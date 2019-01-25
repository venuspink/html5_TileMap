/**
 * A*star 알고리즘으로 최단거리를 찾는다.
 * Disallow Diagonal 대각선 금지
 * @param loc
 * @param wall
 */
function astar(loc, wall){
    //시작 주변을 열린 목록에.
    //찾은것을 닫힌목록에.

    this.startLoc = START_LOC; //json
    this.currLoc = loc; //json
    this.targetLoc = TARGET_LOC; //json
    this.openSet = [];
    this.closeSet = [loc];
    this.obstacleMap = changeMapToArray(wall);
    this.newPathSet = [];

    //이웃구하기
    this.pathFinder = function(){

        console.log("1. currLoc : ",this.currLoc);

        if(this.currLoc == undefined){
            return;
        }

        const neighbors = this.getNeighbors();

        if(this.closeSet.length == 1){
            this.obstacleMap.set("x"+this.currLoc.x+"y"+this.currLoc.y, this.currLoc);
        }

        //array.splice(3,1) index, 개수

        //openSet에 합치기
        if(this.openSet.length == 0){
            for(let n of neighbors) {
                this.openSet.push(n);
            }
        }else{
            for(let n of neighbors){
                let osIndex = 0;
                let dupCnt = 0;
                let changeIndex = 0;
                let changeNode = null;
                const nKey = "x"+n.x+"y"+n.y;
                for(const o of this.openSet){
                    const oKey = "x"+o.x+"y"+o.y;
                    if(nKey == oKey){ //등록되지 않은 node 추가
                        dupCnt++;
                    }
                    if(nKey == oKey && n.Fcost < o.Fcost){//이미 등록되어 있는데 F값이 더 낮으면 갱신
                        changeIndex = osIndex;
                        changeNode = n;
                    }
                    osIndex++;
                }
                if(dupCnt == 0){
                    this.openSet.push(n);
                }
                if(changeNode !== null){
                    this.openSet.splice(osIndex,1,changeNode);
                }
            }
        }


        //가장 F점수가 낮은것을 closeSet에 추가
        let bestNode = null;
        let bestNodeIndex = 0;
        let ix = 0;
        for(let openNode of this.openSet){
            if(bestNode == null){
                bestNode = openNode;
                bestNodeIndex = ix;
            }else{
                if(bestNode.Fcost > openNode.Fcost){
                    bestNode = openNode;
                    bestNodeIndex = ix;
                }
            }
            ix++;
        }

        console.log("::BEST NODE : ",bestNode, bestNodeIndex);

        this.openSet.splice(bestNodeIndex,1); //선택된 노드는 openSet에서 제거
        this.closeSet.push(bestNode);
        this.obstacleMap.set("x" + bestNode.x + "y" + bestNode.y, bestNode);//장애물 추가 (장애물은 기존 WALL + closeSet)

        if(bestNode.Hcost == 10){ //성공
            console.log("SUCCESS PATH FINDING!!", bestNode);
            this.newPathSet.push(bestNode);
            this.getShortestWayFromCloseSet(bestNode, this.newPathSet);
            this.newPathSet = this.newPathSet.reverse();


        }else{
            this.currLoc = bestNode;
            this.pathFinder(); //recursive
        }

    }

    //G cost 구하기 (시작노드에서 현재노드까지 거리)
    this.getGcost = function(o){
        return (Math.abs(o.x-this.startLoc.x) + Math.abs(o.y-this.startLoc.y))*10;
    }

    //H cost 구하기 (종료노드에서 현재노드까지 거리)
    this.getHcost = function(o){
        return (Math.abs(o.x-this.targetLoc.x) + Math.abs(o.y-this.targetLoc.y))*10;
    }

    //맵을 벗어나는지 체크
    this.outside = function(position){
        let result = false;
        if (position.x < 0 || position.x > MAP_SIZE.x) {
            result = true;
        }
        if(!result && (position.y < 0 || position.y > MAP_SIZE.y)){
            result = true;
        }
        return result;
    }

    //이웃구하기
    this.getNeighbors = function(){
        let toR = { x: this.currLoc.x + 1, y: this.currLoc.y};
        let toL = { x: this.currLoc.x - 1, y: this.currLoc.y};
        let toB = { x: this.currLoc.x, y: this.currLoc.y + 1};
        let toT = { x: this.currLoc.x, y: this.currLoc.y - 1};

        const neighbors = [];

        //장애물 체크
        if (!this.outside(toR) && this.obstacleMap.get("x" + toR.x + "y" + toR.y) == undefined) {
            neighbors.push(toR);
        }
        if (!this.outside(toL) && this.obstacleMap.get("x" + toL.x + "y" + toL.y) == undefined) {
            neighbors.push(toL);
        }
        if (!this.outside(toB) && this.obstacleMap.get("x" + toB.x + "y" + toB.y) == undefined) {
            neighbors.push(toB);
        }
        if (!this.outside(toT) && this.obstacleMap.get("x" + toT.x + "y" + toT.y) == undefined) {
            neighbors.push(toT);
        }

        //cost 계산
        for(let n of neighbors){
            n.Gcost = this.getGcost(n);
            n.Hcost = this.getHcost(n);
            n.Fcost = n.Gcost + n.Hcost;
            n.parent = {x:this.currLoc.x, y:this.currLoc.y};
        }

        // console.log("Neighbors : ", neighbors);

        return neighbors;
    }

    //lastNode의 parent를 기반으로 최단경로 array 구하기
    this.getShortestWayFromCloseSet = function(lastNode, newPathSet){
        if(lastNode.parent !== undefined) {
            if(!(lastNode.parent.x == this.startLoc.x && lastNode.parent.y == this.startLoc.y)) {
                for (let n of this.closeSet) {
                    if (lastNode.parent.x == n.x && lastNode.parent.y == n.y) {
                        newPathSet.push(n);
                        this.getShortestWayFromCloseSet(n, newPathSet);
                    }
                }
            }
        }
    }

}

function test(){
    const obj = new astar(START_LOC, WALL);

    obj.pathFinder();
    console.log("WINNERS : ",obj.newPathSet);

    newRoads = obj.newPathSet;

    const map = new OrthogonalMap('orthogonal-map', mapData, {tileSize: 64});
    map.toggleGrid();
}

//배열 값을 맵으로 변환 key,value
function changeMapToArray(arr) {
    //console.log("arr : ",arr);
    const cMap = new Map();
    for (let data of arr) {
        let key = "x" + data.x + "y" + data.y;

        if (cMap.get(key) == undefined) {
            cMap.set(key, 1);
        } else {
            cMap.set(key, cMap.get(key) + 1);
        }
    }
    return cMap;
}


//G cost = 시작노드에서부터 현재노드까지의 비용
//H cost = 종료노드에서부터 현재노드까지의 비용
//F = G + H

//open에 점수를 저장하고 close는 제외. 오픈리스트의 점수를 비교해서 가장 낮은것에 디스턴스 체크를 한다.

//openlist에 들어있는 개체는 부모를 가지고 있음. F점수는 변동이 됨.
//먼저 neighbor를 openlist에 등록하고, (점수,부모 세팅), openlist에 등록된 것중에서 점수가 가장 낮은거(동점일경우 나중꺼)를 선택해 closeList에 등록.
//선택된것을 기준으로 다시 neighbor를 구하고 openlist에 등록. 이때 closelist와 wall은 제외한다.
//반복.