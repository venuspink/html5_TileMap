/**
 A에서 T까지 이동 시 Path finder

 1. 해당 목적지로의 이동 방향은 좌,우 먼저 체크. 그 다음 위, 아래 체크

 */
const START_LOC = {x: 2,y: 2}; //시작위치
let CURRENT_LOC = START_LOC; //현재위치
const TARGET_LOC = {x: 10,y: 6}; //목표지점

const WALL = [{x: 3,y: 0}, {x: 2, y: 1}, { x: 4,y: 3}, {x: 3, y: 2}, {x: 2,y: 3}, {x: 4,y: 4},
    { x: 2,y: 5}, {x: 8,y: 6}, {x: 8,y: 7}, {x: 6,y: 5}, {x: 6,y: 4}, {x: 6,y: 3}, {x: 8,y: 8}
]; //장애물

const MAP_SIZE = {x: 10,y: 8}; //맵사이즈


let roads2 = [CURRENT_LOC]; //현재위치 default로 추가
let newRoads = [];
let trashRoads = [];
let WILD_CARD = [{x:CURRENT_LOC.x+1,y:CURRENT_LOC.y},{x:CURRENT_LOC.x-1,y:CURRENT_LOC.y},
    {x:CURRENT_LOC.x,y:CURRENT_LOC.y+1},{x:CURRENT_LOC.x,y:CURRENT_LOC.y-1}]; //와일드카드는 현재 위치 주변 지점들. 트래킹로드 2회까지 중복허용. 트래쉬로 보지 않고 벽으로 봄.

let pracCount = 0;

console.clear();

let nextCheckPosition = '';
let blockList = {};
let prevCheckPosition = '';
let wallCheckCount = 0;

let manualDirection = ''; //수동 지정 방향





// Possible tile types
const TILE_TYPES = {
    0: {
        name: 'Land',
        color: 'wheat'
    },
    1: {
        name: 'Land',
        color: 'wheat'
    },
    2: {
        name: 'Curr_Loc',
        color: '#BE8C8C'
    },
    3: {
        name: 'Target_Loc',
        color: '#95A4CD'
    },
    4: {
        name: 'roads',
        color: '#DADADB'
    },
    5: {
        name: 'wall',
        color: '#2ECCFA'
    },
}

// Map tile data
const mapData = [
    [1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0],
    [1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
]

/**
 Tile class
 */
class Tile {

    constructor(size, type, ctx) {
        this.size = size
        this.type = type
        this.ctx = ctx
    }

    draw(x, y) {
        // Store positions
        const xPos = x * this.size
        const yPos = y * this.size

        // Draw tile
        this.ctx.fillStyle = this.type.color
        this.ctx.fillRect(xPos, yPos, this.size, this.size)
    }
}

/**
 Map class
 */
class TiledMap {

    constructor(selector, data, opts) {
        this.canvas = document.getElementById(selector)
        this.ctx = this.canvas.getContext('2d')
        this.data = data
        this.tileSize = opts.tileSize
        this.showGrid = false
        this.roads = []
    }

    draw() {
        // Clear canvas before redrawing
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    toggleGrid() {
        // Toggle show grid option
        this.showGrid = !this.showGrid

        // Redraw map
        this.draw()
    }

    pathFinder(roads) {
        this.roads = roads;
        this.draw();
    }
}

/**
 OrthogonalMap class
 */
class OrthogonalMap extends TiledMap {

    constructor(selector, data, opts) {
        super(selector, data, opts)
        this.draw()
    }

    draw() {
        super.draw() // Call draw() method from Map class

        const numCols = this.data[0].length
        const numRows = this.data.length

        // Iterate through map data and draw each tile
        for (let y = 0; y < numRows; y++) {
            for (let x = 0; x < numCols; x++) {

                // Get tile ID from map data
                const tileId = this.data[y][x]

                // Use tile ID to determine tile type from TILE_TYPES (i.e. Sea or Land)
                let tileType = TILE_TYPES[tileId]

                if (CURRENT_LOC.x == x && CURRENT_LOC.y == y) {
                    tileType = TILE_TYPES[2]
                }
                if (TARGET_LOC.x == x && TARGET_LOC.y == y) {
                    tileType = TILE_TYPES[3]
                }
                // Create tile instance and draw to our canvas
                new Tile(this.tileSize, tileType, this.ctx).draw(x, y)

                // Draw an outline with coordinates on top of tile if show grid is enabled
                if (this.showGrid) {
                    this.drawGridTile(x, y)
                }
            }
        }
        //Path finder
        /*
        for(let i=0; i<this.roads.length; i++){
            const tileType = 	TILE_TYPES[4];
          new Tile(this.tileSize, tileType, this.ctx).draw(this.roads[i].x, this.roads[i].y);
          this.drawGridTile(this.roads[i].x, this.roads[i].y);
        }*/
        //장애물
        for (let i = 0; i < WALL.length; i++) {
            const tileType = TILE_TYPES[5];
            new Tile(this.tileSize, tileType, this.ctx).draw(WALL[i].x, WALL[i].y);
            this.drawGridTile(WALL[i].x, WALL[i].y);
        }

        for (let road of newRoads) {
            const tileType = TILE_TYPES[4];
            new Tile(this.tileSize, tileType, this.ctx).draw(road.x, road.y);
            this.drawGridTile(road.x, road.y);
        }
    }

    drawGridTile(x, y) {
        // Store positions
        const xPos = x * this.tileSize
        const yPos = y * this.tileSize

        // Draw coordinate text
        this.ctx.font = '14px serif'
        this.ctx.textAlign = 'center'
        this.ctx.fillStyle = '#333'
        this.ctx.fillText(x + ', ' + y, xPos + this.tileSize / 2, yPos + this.tileSize / 2 + 5)

        // Draw grid
        this.ctx.strokeStyle = '#999'
        this.ctx.lineWidth = 0.5
        this.ctx.strokeRect(xPos, yPos, this.tileSize, this.tileSize)
    }
}

$().ready(function() {
    const map = new OrthogonalMap('orthogonal-map', mapData, {
        tileSize: 64
    });
    map.toggleGrid();
});
