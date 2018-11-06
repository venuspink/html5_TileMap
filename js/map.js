var width =48;
var height = 48;

var ctxMap = new HashMap();
var heroMap = new HashMap();
var canvasMap = new HashMap();

var map = [
    1,1,1,1,1,0,0,0,0,0,0,0,
    1,1,1,1,1,0,0,0,0,0,0,0,
    1,1,1,1,1,0,0,0,0,0,0,0,
    1,1,1,1,1,0,0,0,0,0,0,0
];

var Hero = {};
Hero.id = '';

Hero.init = function(idd){
    // var canvas = document.getElementById("hero");
    // var ctx = canvas.getContext("2d"); 

    var top = 0;
    var left = 0;
    if(idd == "SH"){

    }else{
        top = 48;
        left = 48;
    }

    var hcanvas = $('<canvas/>', { id: 'mycanvas_'+idd});
    hcanvas.css('position', 'absolute').css("left",left).css("top",top).css("z-index","1");
    hcanvas.attr("width","48px");
    $('#container').append(hcanvas); 
    var ctx = document.getElementById("mycanvas_"+idd).getContext("2d");
    var canvas = document.getElementById("mycanvas_"+idd);    

    var heroImg = new Image();
    heroImg.src = "hero/seohwang/mov.bmp";
    heroImg.id = idd;
    heroImg.onload = function(){
        if(heroImg.id == "SH"){
            ctx.drawImage(heroImg, 0, 0, 48, 48, 0, 0, 48, 48);
            Hero.id = idd;
            Hero.anim();
        }else{
            ctx.drawImage(heroImg, 0, 48, 48, 48, 0, 0, 48, 48);
            Hero.id = idd;
            Hero.anim();
        }
    }

    ctxMap.set("ctx_"+idd,ctx);//맵에 컨텍스트 저장 
    canvasMap.set("canvas_"+idd,canvas);//맵에 캔버스 저장
    heroMap.set("hero_"+idd, heroImg);//맵에 히어로이미지 저장


    canvas.addEventListener('click', (e) => {
        alert(heroImg.id);
    });
}

Hero.anim = function(){
    step();
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
        Hero.init("SH");
    }

    this.canvas.addEventListener('click', (e) => {
        x = e.offsetX;
        y = e.offsetY;

        targetTileX = Math.floor(x / width); //소수점은 버림.
        targetTileY = Math.floor(y / height);

        var index = targetTileX + (12 * targetTileY); //map의 index값을 구한다.

        alert(index);
        // console.log('canvas click : '+e.offsetX );
     });
}

Game.drawGrid = function(){
    this.ctx.strokeStyle = 'red';
    this.ctx.lineWidth = 1;
    for(var r=0; r<=4; r++){ //rows 4줄
        for(var c = 0; c<=11; c++){ //cols 12칸
            this.ctx.strokeRect(width * c, height * r, width, height);
        } 
    }

    // // draw font in red
    // con.font = "20pt sans-serif";
    // con.fillText("Canvas Rocks!", 5, 100);
    // con.strokeText("Canvas Rocks!", 5, 130);
}

window.onload = function(){
    var canvas = document.getElementById("map");
    var ctx = canvas.getContext("2d");
    
    Game.run(canvas, ctx);

}




function addHero(){
    alert("추가");
    Hero.init("ZZ");
}


const cycleLoop = [0,1];
let currentLoopIndex = 0;
let frameCount = 0;

function step() {
  frameCount++;
//   console.log("ctx : "+ctx);
  if (frameCount < 15) {
    window.requestAnimationFrame(step);
    return;
  }
  frameCount = 0;
  ctx = ctxMap.get("ctx_"+Hero.id);
  img = heroMap.get("hero_"+Hero.id);
  ctx.clearRect(0, 0, width, height);
  drawFrame(ctx, img, cycleLoop[currentLoopIndex]);
  currentLoopIndex++;
  if (currentLoopIndex >= cycleLoop.length) {
    currentLoopIndex = 0;
  }
//   console.log("currentLoopIndex : "+currentLoopIndex);
  window.requestAnimationFrame(step);
}

function drawFrame(ctx,  img, cycle){
    console.log("HERO.id"+Hero.id);
    ctx.drawImage(img, 0, cycle * height, width, height, 0, 0, 48, 48);
}
