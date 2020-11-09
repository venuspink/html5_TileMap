/**
 * sammoJS
 * @author Rust <zegalkm@gmail.com>
 * @version 0.0.1
 * Homepage: https://github.com/venuspink?tab=repositories
 */


/**
 * 맵초기화
 * 맵이미지 로드, 맵좌표생성(타일 클릭 시 좌표정보on)
 */
class DefaultMap {
    constructor(mapImgSrc){
        this.tileWidth = CONFIG.TILE_WIDTH;
        this.tileHeight = CONFIG.TILE_HEIGHT;
        this.mapImgSrc = mapImgSrc;
        this.mapCanvas = document.getElementById("map");
        this.ctx = this.mapCanvas.getContext("2d");
    }

    /**
     * 맵 이미지 로드
     */
    loadMap(){
        const mapImg = new Image();
        mapImg.src = this.mapImgSrc;
        const context = this.ctx;
        const $this = this;

        mapImg.onload = function () {
            context.drawImage(mapImg, 0, 0, 912, 1680); //배경맵
            $this.setUpGrid(10,10);
            $this.mapClickEvent(); //맵 타일 클릭이벤트 리스너 등록.
        };
    }

    /**
     * 그리드셋업
     * @param x
     * @param y
     */
    setUpGrid(X_count, Y_count) {
        for(let x=0; x<=X_count; x++){
            for(let y=0; y<=Y_count; y++){
                this.drawGridTile(x,y);
            }
        }
    }

    /**
     * 좌표 그리드 그리기
     * @param x
     * @param y
     */
    drawGridTile(x, y) {
        // Store positions
        const xPos = x * this.tileWidth;
        const yPos = y * this.tileHeight;

        // Draw coordinate text
        this.ctx.font = '14px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#333';
        this.ctx.fillText(x + ', ' + y, xPos + this.tileWidth / 2, yPos + this.tileHeight / 2 + 5);

        // Draw grid
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(xPos, yPos, this.tileWidth, this.tileHeight);
    }

    /**
     * 맵 타일 클릭이벤트
     * @param x
     * @param y
     */
    mapClickEvent(){
        this.mapCanvas.addEventListener('click', (e) => {
            const x = e.offsetX;
            const y = e.offsetY;

            const targetTileX = Math.floor(x / this.tileWidth); //소수점은 버림.
            const targetTileY = Math.floor(y / this.tileHeight);

            console.log("CLICK X,Y", targetTileX, targetTileY);

            this.actionMoveX = targetTileX;
            this.actionMoveY = targetTileY;

            //TODO hero에 찍힌 위치 전달.
        });
    }


    /**
     * 이동 가능 영역 색칠
     * @param x
     * @param y
     */
    drawMovingArea(movingAreaArr){
        console.log("movingArea",movingAreaArr);

        for(let r=0; r<movingAreaArr.length; r++){
            this.ctx.fillStyle="#FF0000";
            this.ctx.globalAlpha = 0.5;
            this.ctx.fillRect(CONFIG.TILE_WIDTH * movingAreaArr[r].x, CONFIG.TILE_HEIGHT * movingAreaArr[r].y, CONFIG.TILE_WIDTH, CONFIG.TILE_HEIGHT);
        }
    }
}

function start() {
    const imgSrc = "../maps/map01.jpg" //맵 경로
    const map = new DefaultMap(imgSrc);
    map.loadMap();

    const hero1 = new Hero("seohwang", map);
    let createResult = hero1.createHero();
    if(createResult){
        hero1.walkingStand();
        hero1.movingHero(0);
    }
}

function move(){

}




