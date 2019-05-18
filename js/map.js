/**
 * sammoJS
 * @author Rust <zegalkm@gmail.com>
 * @version 0.0.1
 * Homepage: https://github.com/venuspink?tab=repositories
 */

var width =48;
var height = 48;

var ctxMap = new HashMap();
var heroMap = new HashMap();
var canvasMap = new HashMap();
var characterMap = new HashMap();

var hero_loc_map = new HashMap();

//맵의 지형 정보를 2차원 배열에 세팅 (지형 특성 코드 값)
var map = [
    [1,1,1,1,1,0,0,0,0,0,0,0],
    [1,1,1,1,1,0,0,0,0,0,0,0],
    [1,1,1,1,1,0,0,0,0,0,0,0],
    [1,1,1,1,1,0,0,0,0,0,0,0]
];

var heroes = new Array();

let pathFinder = null;

function Hero(idd){

    const hh_top = 6;
    const hh_left = 8;

    var top = 48 * hh_top;
    var left = 48 * hh_left;

    var hero_info = {x: hh_left, y: hh_top, width: 48, height: 48, spriteX: 0, spriteY: 0, speed: 150, edgeRegion: 50, moving: false, animateTime: 2, animateCur: 0,
        animatePos: Array(0, 42, 84, 42, 0, 128, 170, 128), target : 48, moveOn : false};

    if(idd == "SH"){

    }else{
        top = 0; //canvas생성시 포지션
        left = 48; //canvas생성시 포지션
    }

    var hcanvas = $('<canvas/>', { id: 'mycanvas_'+idd});
    hcanvas.css('position', 'absolute').css("left",left).css("top",top).css("z-index","1");
    hcanvas.attr("width","48px");
    hcanvas.attr("height","48px");
    $('#container').append(hcanvas);
    ctx = document.getElementById("mycanvas_"+idd).getContext("2d");
    canvas = document.getElementById("mycanvas_"+idd);

    var heroImg = new Image();
    heroImg.src = "hero/seohwang/mov.bmp";
    heroImg.id = idd;

    var hero_init_x = 0;
    var hero_init_y = 0;
    heroImg.onload = function(){
        if(heroImg.id == "SH"){
            ctx.drawImage(heroImg, 0, 0, 48, 48, 0, 0, 48, 48);
            hero_init_x = Math.floor(left / width);
            hero_init_y = Math.floor(top / height);
            alert(hero_init_x+","+hero_init_y);
            hero_loc_map.set(hero_init_x+","+hero_init_y,idd);
            // step();
        }else{
            ctx.drawImage(heroImg, 0, 0, 48, 48, 0, 0, 48, 48);
            hero_loc_map.set("1,0",idd);
            // step();
        }
    }

    ctxMap.set("ctx_"+idd,ctx);//맵에 컨텍스트 저장
    canvasMap.set("canvas_"+idd,hcanvas);//맵에 캔버스 저장
    heroMap.set("hero_"+idd, heroImg);//맵에 히어로이미지 저장

    //alert(hero_init_x);

    characterMap.set("char_"+idd, hero_info);


    var onSelect = false;


    canvas.addEventListener('click', (e) => {
        onSelect = true;
        x = e.offsetX;
        y = e.offsetY;

        targetTileX = Math.floor(x / width); //소수점은 버림.
        targetTileY = Math.floor(y / height);

        console.log("characterMap" , characterMap);
        //alert(characterMap.get("char_"+idd).x);

        hero_info.moveOn = true;
        characterMap.set("char_"+idd, hero_info);

        if(currentSelectHero !== idd) {
            currentSelectHero = idd;

            const path = [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:2,y:1},{x:2,y:2}];
            pathFinder = transMovingValue(path);

            moveHero();
            //캐릭터 이미지를 클릭했을 때 우측으로 한칸 moving해보기

            rangeArray = movingRange(characterMap.get("char_" + idd).x, characterMap.get("char_" + idd).y);//이동 가능 영역 계산
            console.log("::rangeArray :",rangeArray);
            Game.drawMoveArea(rangeArray); //이동 가능 영역을 표시한다.
        }

    });

}

var Game = {};
Game.run = function(canvas, context){

    this.canvas = canvas;
    this.ctx = context;

    var img = new Image();
    img.src = "maps/map01.jpg";

    img.onload = function() {
        context.drawImage(img, 0, 0, 912, 1680); //배경맵
        Game.drawGrid(); //좌표그리드
        // Hero.init("SH");
        addHero("SH");
    }

    this.canvas.addEventListener('click', (e) => {
        x = e.offsetX;
        y = e.offsetY;

        targetTileX = Math.floor(x / width); //소수점은 버림.
        targetTileY = Math.floor(y / height);

        var index = targetTileX + (12 * targetTileY); //map의 index값을 구한다.

        alert(targetTileX+" , "+targetTileY);
        // console.log('canvas click : '+e.offsetX );

        //TODO 해당 위치를 클릭하면, path finder로 경로 리턴.
        //경로를 던져준다. moveHero();

     });
}

Game.drawGrid = function(){
    this.ctx.strokeStyle = 'red';
    this.ctx.lineWidth = 1;
    for(var r=0; r<=20; r++){ //rows 4줄
        for(var c = 0; c<=18; c++){ //cols 12칸
            this.ctx.strokeRect(width * c, height * r, width, height);
        } 
    }

    // // draw font in red
    // con.font = "20pt sans-serif";
    // con.fillText("Canvas Rocks!", 5, 100);
    // con.strokeText("Canvas Rocks!", 5, 130);
}

Game.drawMoveArea = function(rangeArray){
    for(var r=0; r<rangeArray.length; r++){
        this.ctx.fillStyle="#FF0000";
        this.ctx.globalAlpha = 0.5;
        this.ctx.fillRect(width * rangeArray[r].x, height * rangeArray[r].y, width, height);
    }
}

window.onload = function(){
    var canvas = document.getElementById("map");
    var ctx = canvas.getContext("2d");
    
    Game.run(canvas, ctx);

}




function addHero(id){
    // alert("추가:"+id);
    // if(animStepId !== ''){
    //     window.cancelAnimationFrame(animStepId);
    // }
    heroes.push(id);
    new Hero(id)

}


const cycleLoop = [0,1];
let currentLoopIndex = 0;
let frameCount = 0;
var animStepId = '';

function step() {

    frameCount++;
//   console.log("ctx : "+ctx);
    if (frameCount < 15) {
        window.requestAnimationFrame(step);
        return;
    }
    frameCount = 0;
    for (var i = 0; i < heroes.length; i++) {
        ctx = ctxMap.get("ctx_" + heroes[i]);
        img = heroMap.get("hero_" + heroes[i]);
        ctx.clearRect(0, 0, width, height);
        drawFrame(ctx, img, cycleLoop[currentLoopIndex]);
    }
    currentLoopIndex++;
    if (currentLoopIndex >= cycleLoop.length) {
        currentLoopIndex = 0;
    }
//   console.log("currentLoopIndex : "+currentLoopIndex);
    animStepId = window.requestAnimationFrame(step);

}

var nextDirection = null; //캐릭터의 현재 위치 . 초기화 필요
var currentSelectHero;
let movingCount = 0;
let movingValueX = 0;
let movingValueY = 0;
function moveHero() {
    cc = characterMap.get("char_"+currentSelectHero);
    cvs = canvasMap.get("canvas_"+currentSelectHero);

    if(nextDirection == null){
        //위치 초기화
        cvs.css("left", pathFinder[0].x);
        cvs.css("top", pathFinder[0].y);
        movingValueX = pathFinder[0].x;
        movingValueY = pathFinder[0].y;
        movingCount++;
        nextDirection = pathFinder[movingCount];
    }

    if(nextDirection.flag == 'L'){
        cc.target = pathFinder[movingCount-1].x - nextDirection.x;
    }else if(nextDirection.flag == 'R'){
        cc.target = pathFinder[movingCount-1].x + nextDirection.x;
    }else if(nextDirection.flag == 'T'){
        cc.target = pathFinder[movingCount-1].y - nextDirection.y;
    }else{
        cc.target = pathFinder[movingCount-1].y + nextDirection.y;
    }

    // console.log("nextDirection :",nextDirection);
    // console.log("cc.target :",cc.target);

    if(nextDirection.flag == 'L') {
        if (cc.moveOn && movingValueX > cc.target) {
            movingValueX -= 2; //speed
            cvs.css("left", movingValueX);
            if (movingValueX == cc.target) {
                movingCount++;
                if(pathFinder.length > movingCount){
                    nextDirection = pathFinder[movingCount];
                }else{
                    cc.moveOn = false;
                }
            }
        }
    }else if(nextDirection.flag == 'R') {
        if (cc.moveOn && movingValueX < cc.target) {
            movingValueX += 2; //speed
            cvs.css("left", movingValueX);
            if (movingValueX >= cc.target) {
                console.log("RRRRR",cc.target);
                console.log("movingCount",movingCount);
                movingCount++;
                if(pathFinder.length > movingCount){
                    nextDirection = pathFinder[movingCount];
                }else{
                    cc.moveOn = false;
                }
            }
        }
    }else if(nextDirection.flag == 'T') {
        if (cc.moveOn && movingValueY > cc.target) {
            movingValueY -= 2; //speed
            cvs.css("top", movingValueY);
            if (movingValueY == cc.target) {
                movingCount++;
                if(pathFinder.length > movingCount){
                    nextDirection = pathFinder[movingCount];
                }else{
                    cc.moveOn = false;
                }
            }
        }
    }else{
        if (cc.moveOn && movingValueY < cc.target) {
            movingValueY += 2; //speed
            cvs.css("top", movingValueY);
            if (movingValueY == cc.target) {
                movingCount++;
                if(pathFinder.length > movingCount){
                    nextDirection = pathFinder[movingCount];
                }else{
                    cc.moveOn = false;
                }
            }
        }
    }

    if(cc.moveOn) {
        animStepId = window.requestAnimationFrame(moveHero);
    }else{
        cancelAnimationFrame(animStepId);
    }
}

function transMovingValue(pathArr){
    const movingValueArr = [{x:pathArr[0].x * width, y:pathArr[0].y * height}];
    let prevPath = null;
    let index = 0;
    for(let a of pathArr){
        if(prevPath == null){
            prevPath = a;
        }else{
            if(prevPath.x == a.x){
                if(prevPath.y > a.y){
                    movingValueArr.push({x:pathArr[index].x * width, y:pathArr[index].y * height, flag:'T'});
                }else{
                    movingValueArr.push({x:pathArr[index].x * width, y:pathArr[index].y * height, flag:'B'});
                }
            }else if(prevPath.x > a.x){
                movingValueArr.push({x:pathArr[index].x * width, y:pathArr[index].y * height, flag:'L'});
            }else{
                movingValueArr.push({x:pathArr[index].x * width, y:pathArr[index].y * height, flag:'R'});
            }

            prevPath = a;
        }
        index++;
    }

    console.log("movingValueArr",movingValueArr);

    return movingValueArr;
}

function drawFrame2(ctx,  img, char){
    // console.log("HERO.id"+Hero.id);
    // ctx.drawImage(img, 0, cycle * height, width, height, 0, 0, 48, 48);



    ctx.drawImage(
                  img, //원본 이미지
                  0,   //spriteX : 세로로 구성되어 있기 때문에 x좌표는 무조건 0임
                hero_info.spriteY,  // 이미지 위에서부터 몇번째 그림을 쓸 것인지. 한컷당 48px으로 때문에 계산. 그러므로 첫번째 샷은 0이 된다.
                hero_info.width,    // 48 고정
                hero_info.height,   // 48 고정
                hero_info.x,        // 0 고정
                hero_info.y,        // 0 고정
                hero_info.width,    // 48 고정
                hero_info.height    // 48 고정
    );
}

function drawFrame(ctx,  img, cycle){
    // console.log("HERO.id"+Hero.id);
    ctx.drawImage(img, 0, cycle * height, width, height, 0, 0, 48, 48);
}

var cct = 0;
function anim(){
    console.log("TIME : "+ new Date()+ "cct : "+cct);
    cct++;

    if(cct > 47){
        cancelAnimationFrame(aaid);
        return;
    }

    aaid = requestAnimationFrame(anim);

}


/** *********************************************

 @name : Moving Range
 @desc : 이동 가능 범위를 리턴해준다.
 cx : 현재 위치 x
 cy : 현재 위치 y

 ** ********************************************/
function movingRange(cx, cy){
    //1. 이동력에 따라 범위 조절

    //2. 범위는 기본 마름모 꼴. 이동력이 2라면 , 좌 : 2칸, 우 : 2칸 , 위 : 2칸, 아래 : 2칸.. 사이 대각선 계산.

    //3. 지형에 따라 , 병과에 따라 이동력 변경. 기본 이동력 2. 지형 : 평지(+1), 산악을 만나면 거기서 멈춤. 기병(+2)

    var moveAbility = 3;
    var range = [];

    //8방 체크 -  oLL , oTT, oLT, oRR, oRT, oBB, oRB, oLB
    var oLL , oTT, oLTx, oLTy, oRR, oRT, oBB, oRB, oLB;

    oLL = cx - moveAbility;
    oTT = cy - moveAbility;
    oLTx = cx - moveAbility - 1;
    oLTy = oTT - 1;
    oRR = cx + moveAbility;
    oBB = cy + moveAbility;

    console.log("cx : "+cx);

    //Left area location
    for(var i=0; i<moveAbility; i++){
        if(oLL+i >= 0) {
            var location = {x: oLL + i, y: cy};
            range.push(location);
        }
    }

    //Right area location
    for(var i=0; i<moveAbility; i++){
        if(oRR-i <= 9) {
            var location = {x: oRR - i, y: cy};
            range.push(location);
        }
    }

    //Top area location
    for(var i=0; i<moveAbility; i++){
        if(oTT+i >= 0) {
            var location = {x: cx, y: oTT + i};
            range.push(location);
        }
    }

    //Bottom area location
    for(var i=0; i<moveAbility; i++){
        if(oBB-i <= 4) {
            var location = {x: cx, y: oBB - i};
            range.push(location);
        }
    }

    //Right <--> Bottom area location
    var callCount = 0;
    for(var i=cx+1; i<oRR; i++){
        for(var j=cy+1; j<oBB-callCount; j++){
            let location = {x: i, y: j};
            range.push(location);
        }
        callCount++;
    }

    return range;

}

/** *********************************************

 @name : Path Finder
 @desc : 선택 된 포지션에 가는 루트를 리턴해준다.
 cx : 현재 위치 x
 cy : 현재 위치 y
 tx : 타깃 위치 x
 ty : 타깃 위치 y

 ** ********************************************/
