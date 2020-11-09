/**
 * 히어로클래스
 * 히어로를 생성하고, 액션을 정의
 * 2019.11.12.
 */


/**
 * 히어로 생성 - 맵 위에 히어로 표시
 */

class Hero{
    //초기 설정 세팅
    constructor(heroId, mapObj){
        this.mapObj = mapObj;
        this.heroId = heroId;
        this.heroObj = $('<canvas/>',{id : 'hero_cv_'+this.heroId});
        this.heroWidth = CONFIG.HERO_WITH;
        this.heroHeight = CONFIG.HERO_HEIGHT;
        //TODO 초기 히어로 정보를 서버에서 가져와야 함. (ex. 맵 상의 시작위치.)
        this.heroInfo = {
            left : 1 * CONFIG.TILE_WIDTH,
            top : 1 * CONFIG.TILE_HEIGHT,
            movingRange : 3,
            currentLoc : {x:1, y:1}
        };
        this.heroObj.css('position', 'absolute').css("left",this.heroInfo.left).css("top",this.heroInfo.top).css("z-index","1");
        this.heroObj.attr("width", this.heroWidth);
        this.heroObj.attr("height", this.heroHeight);

        this.walkingStand = this.walkingStand.bind(this);
        this.movingHero = this.movingHero.bind(this);
        this.frameCount = 0;

        $('#container').append(this.heroObj);
        this.ctx = document.getElementById("hero_cv_"+this.heroId).getContext("2d");
        this.canvas = document.getElementById("hero_cv_"+this.heroId);

        this.heroImage = new Image();
        this.heroImage.src = "../hero/seohwang/mov.bmp"; //TODO 이 부분은 서버에서 가져와야 함
        this.heroImage.id = this.heroId;

        this.cycleIndex = 0;

        this.animMovingId = '';
        this.targetX = -1;
        this.targetY = -1;


    }

    //생성
    createHero(){
        // $('#container').append(this.heroObj);
        // const ctx = document.getElementById("hero_cv_"+this.heroId).getContext("2d");
        // const canvas = document.getElementById("hero_cv_"+this.heroId);

        // const heroImage = new Image();
        // heroImage.src = "../hero/seohwang/mov.bmp"; //TODO 이 부분은 서버에서 가져와야 함
        // heroImage.id = this.heroId;

        //arrow function은 this가 바인딩되지 않음. 상위 스코프인 생성자 this 호출가능
        let result = this.heroImage.onload = () => {
            // sx :이미지 출력할 x 좌표
            // sy :이미지 출력할 y 좌표 ===> 결국엔 이 옵션만값만 손대면 됨... 0,48,96....
            // sw :[옵션] 이미지 width /원본(source) 잘라낼 영역(clipping rectangle)
            // sh :[옵션] 이미지 Height /원본(source) 잘라낼 영역(clipping rectangle)
            // dx :[옵션] 만약 잘라내었다면, 대상 이미지의 X좌표
            // dy :[옵션] 만약 잘라내었다면, 대상 이미지의 Y좌표
            // dw :[옵션] 만약 잘라내었다면, 대상 이미지의 width
            // dh :[옵션] 만약 잘라내었다면, 대상 이미지의 Height
            this.ctx.drawImage(this.heroImage, 0, this.cycleIndex * this.heroHeight, this.heroWidth, this.heroHeight, 0, 0, this.heroWidth, this.heroHeight);
            this.heroSelection();
            return true;
        };

        return result;
    }

    //TODO 움직이는 모션
    // 1.스탠드 상황
    // 2.캐릭터 이동 시.
    // stepper 라이브러리 있음.

    walkingStand(){
        // console.log("this.frameCount", this.frameCount);
        this.frameCount++;
        if (this.frameCount < 15) {
            window.requestAnimationFrame(this.walkingStand);
            return;
        }
        this.frameCount = 0;
        if(this.cycleIndex > 0){
            this.cycleIndex = 0;
        }else{
            this.cycleIndex = 1;
        }
        this.ctx.drawImage(this.heroImage, 0, this.cycleIndex * this.heroHeight, this.heroWidth, this.heroHeight, 0, 0, this.heroWidth, this.heroHeight);
        window.requestAnimationFrame(this.walkingStand);
    }


    //TODO 맵 이동 모션
    // x1 -> x2, y1 -> y2 로 이동해야 함.
    movingHero(targetX){

        if(this.targetX < 0 ){
            this.targetX = targetX;
        }

        const distanceX = this.targetX - this.heroInfo.left;
        if(distanceX > 0){
            this.heroInfo.left += 2;
        }else if(distanceX < 0){
            this.heroInfo.left -= 2;
        }else{
            cancelAnimationFrame(this.animMovingId);
            console.log("END",$("#"+this.canvas.id).css("left"));
            this.heroInfo.currentLoc.x = this.targetX;
            return;
        }

        console.log("distanceX",distanceX);
        console.log("ca",$("#"+this.canvas.id).css("left"));

        $("#"+this.canvas.id).css("left", this.heroInfo.left);

        this.animMovingId = window.requestAnimationFrame(this.movingHero);

    }

    /**
     * 히어로 선택
     * - 선택 시 기본적으로 이동 가능 범위를 보여줌
     * - 이동 후, 또는 한번 더 클릭 시 명령 창을 띄워줌. 우측.
     */
    heroSelection(){
       this.canvas.addEventListener('click', (e) => {

           //이동 가능 범위 표시
           const crX = this.heroInfo.currentLoc.x;
           const crY = this.heroInfo.currentLoc.y;
           const mvR = this.heroInfo.movingRange;

           const movingAreaArr = new Array();

           let count = 0; //단계 계산 카운트
           for(let yy = crY; yy >= crY-mvR; yy--){
               if(yy >= 0) {
                   for (let i = crX - mvR + count; i <= crX + mvR + count; i++) {
                       if(i >= 0 && !(i == crX && yy == crY)){
                           movingAreaArr.push({x: i, y: yy});
                       }
                   }
                   count--;
               }
           }

           count = -1;
           for(let yy = crY+1; yy <= crY+mvR; yy++){
               if(yy >= 0) { //TODO 지도 영역밖으로 나가는지 체크
                   for (let i = crX - mvR + count; i <= crX + mvR + count; i++) {
                       if(i >= 0 && !(i == crX && yy == crY)){
                           movingAreaArr.push({x: i, y: yy});
                       }
                   }
                   count--;
               }
           }




           this.mapObj.drawMovingArea(movingAreaArr);

           //배열값을 return 해서 맵에 표시.

           //TODO movingHero에서 이동한 좌표정보를 다시 this.heroInfo에 set해야 함.
       });
    }



}