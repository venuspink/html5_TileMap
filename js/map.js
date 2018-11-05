var width =48;
var height = 48;

var map = [
    1,1,1,1,1,0,0,0,0,0,0,0,
    1,1,1,1,1,0,0,0,0,0,0,0,
    1,1,1,1,1,0,0,0,0,0,0,0,
    1,1,1,1,1,0,0,0,0,0,0,0
];

var Game = {};
Game.run = function(canvas, context){

    this.canvas = canvas;
    this.ctx = context;

    var img = new Image();
    img.src = "maps/map01.jpg";

    img.onload = function() {
        context.drawImage(img, 0, 0, 912, 1680); //배경맵
        Game.drawGrid(); //좌표그리드
    }

    this.canvas.addEventListener('click', (e) => {
        x = e.offsetX;
        y = e.offsetY;

        targetTileX = Math.floor(x / width);
        targetTileY = Math.floor(y / height);

        var index = targetTileX + (12 * targetTileY);

        alert(index);
        // console.log('canvas click : '+e.offsetX );
     });
}

Game.drawGrid = function(){
    // con.fillStyle = "white";

    this.ctx.strokeStyle = 'red';
    this.ctx.lineWidth = 1;
    for(var r=0; r<=4; r++){
        for(var c = 0; c<=11; c++){
            this.ctx.strokeRect(width * c,height * r,width,height);
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





