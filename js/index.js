WINDOW_WIDTH = document.body.clientWidth;
WINDOW_HEIGHT=screen.availHeight;

REDRADIUS =10;
WHITERADIUS=15;
var balls = []; //The array for red balls
var boardLength; //The length of the board
var sX,sY,eX,eY; //The position of board
var ballX,ballY; //The position of the white ball
var redBallTimer=null;
var leftTimer=null;
var redTimer=null;
var whiteRate=200;
var redRate=4000;
var life=3;
var score=0;
var gravity=5;
var width;

function game(){
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext("2d");
//
//    context.clearRect(0,0,WINDOW_WIDTH, WINDOW_HEIGHT);

    if(WINDOW_WIDTH<600){
        canvas.width = WINDOW_WIDTH*0.85;
        canvas.height = WINDOW_HEIGHT*0.8;
        $("#left").removeClass("hidden");
        $("#right").removeClass("hidden");

    }else{
        canvas.width = WINDOW_WIDTH*0.4;
        canvas.height = WINDOW_HEIGHT*0.7;
    }

    width=canvas.width;
    boardLength=canvas.width*0.9;
    sX=canvas.width*0.05;
    eX=sX+boardLength;
    sY=canvas.height*0.9;
    eY=sY;
    ballX=sX+(eX-sX)/2;
    ballY=(sY+eY)/2-WHITERADIUS-2;

    redBallTimer=setInterval(
        function(){
            render( context );
            updateBalls();
        },35
    );

    $("#life").html("life:"+life);
    $("#score").html("score:"+score);
}

window.onload = function(){
   game();
}

function startGame(){
    redTimer=setInterval(
        function(){
            addBalls();
        },redRate);

    $("#st").addClass("hidden");
}

function restart(){

    life=3;
    score=0;
    whiteRate=200;
    redRate=4000;
    gravity=5;
    window.clearInterval(leftTimer);
    window.clearInterval(redBallTimer);
    window.clearInterval(redTimer);
//    redBallTimer=null;
//    leftTimer=null;

    $("#end").addClass("hidden");
    game();
    startGame();
}
/**
 * Update red balls
 */
function updateBalls(){

    for( var i = 0 ; i < balls.length ; i ++ ){

        balls[i].y += balls[i].g;
        var distance=Math.sqrt(Math.pow(ballX-balls[i].x,2)+Math.pow(ballY-balls[i].y,2));
        if(distance<(WHITERADIUS+REDRADIUS)){
            score++;
            $("#score").html("score:"+score);
            balls.shift();
            if(score>0&&score%10==0){
                life++;
                $("#addLife").removeClass("hidden");
                $("#addLife").addClass("moveAnimation");
                setTimeout(function(){
                    $("#addLife").addClass("hidden");
                    $("#addLife").removeClass("moveAnimation");
                    $("#life").html("life:"+life);
                },2000);
            }else{
                if(score>=5&&score<10){
                    whiteRate=60;
                    gravity=7;
                }
                if(score>=10){
                    whiteRate=30;
                    gravity=8;
                }
            }
        }
        else{
           if(balls[i].y>=(sY+eY)/2){
               life--;
               $("#life").html("life:"+life);
               balls.shift();
               if(life<=0){
                   $("#end").removeClass("hidden");
                   clearInterval(redBallTimer);
                   clearInterval(redTimer);
                   clearInterval(leftTimer);
               }
           }
        }
    }
}

/**
 * Add the red ball
 */
function addBalls( ){
    var aBall = {
        x:Math.random()*(width-8*REDRADIUS)+REDRADIUS*4,
        y:0,
        g:gravity,
        color: "#ff0000"
    }
    balls.push( aBall );
}

/**
 * Draw red balls
 * @param cxt
 */
function render( cxt ){

    cxt.clearRect(0,0,WINDOW_WIDTH, WINDOW_HEIGHT);
    renderBoardBall(cxt,sX,sY,eX,eY);

    //Draw red balls
    for( var i = 0 ; i < balls.length ; i ++ ){
        cxt.fillStyle=balls[i].color;

        cxt.beginPath();
        cxt.arc( balls[i].x , balls[i].y , REDRADIUS , 0 , 2*Math.PI , true );
        cxt.closePath();

        cxt.fill();
    }
}

/**
 * Draw the board and the white ball
 * @param cxt --context
 * @param startX --start position(x)
 * @param startY --start position(y)
 * @param endX --end position(x)
 * @param endY --end position(y)
 */
function renderBoardBall(cxt,startX,startY,endX,endY){
    //Draw board
    cxt.beginPath();
    cxt.moveTo(startX,startY);
    cxt.lineTo(endX,endY);
    cxt.lineWidth=5;
    cxt.strokeStyle="#ffffff";
    cxt.stroke();
    cxt.closePath();

    //Draw white ball
    cxt.beginPath();
    cxt.fillStyle="#ffffff";
    cxt.arc(ballX,ballY,WHITERADIUS,0,2*Math.PI);
    cxt.closePath();
    cxt.fill();
}

$(document).keydown(function(event){

    //Left-37,Right-39
    if(event.keyCode == 37){
       leftArrow();

    }else if(event.keyCode==39){
       rightArrow();
    }
})

function boardLeft(){

    var x=sX+boardLength/2-ballX;

    sX-=(1-Math.cos(10*Math.PI/180))*boardLength/2;
    sY+=Math.sin(10*Math.PI/180)*boardLength/2;
    eX+=(1-Math.cos(10*Math.PI/180))*boardLength/2;
    eY-=Math.sin(10*Math.PI/180)*boardLength/2;
    if(sY==eY){
        ballY=(sY+eY)/2-WHITERADIUS-2;
    }
    else{
        if(x>0){
            ballX+=(1-Math.cos(10*Math.PI/180))*x;
            ballY+=Math.sin(10*Math.PI/180)*x;
        }
        else{
            x=ballX-(sX+boardLength/2);
            ballX-=(1-Math.cos(10*Math.PI/180))*x;
            ballY-=Math.sin(10*Math.PI/180)*x;
        }
    }
}

function boardRight(){
    var x=sX+boardLength/2-ballX;
    sX+=(1-Math.cos(10*Math.PI/180))*boardLength/2;
    sY-=Math.sin(10*Math.PI/180)*boardLength/2;
    eX-=(1-Math.cos(10*Math.PI/180))*boardLength/2;
    eY+=Math.sin(10*Math.PI/180)*boardLength/2;
    if(sY==eY){
        ballY=(sY+eY)/2-WHITERADIUS-2;
    }
    else{
        if(x>=0){
            ballX+=(1-Math.cos(10*Math.PI/180))*x;
            ballY-=Math.sin(10*Math.PI/180)*x;
        }else{
            x=ballX-(sX+boardLength/2);
            ballX-=(1-Math.cos(10*Math.PI/180))*x;
            ballY+=Math.sin(10*Math.PI/180)*x;
        }

    }

}

function ballLeft(){
    if(ballX>WHITERADIUS){
        ballX-=Math.cos(10*Math.PI/180)*10;
        ballY+=Math.sin(10*Math.PI/180)*10;
    }
}

function ballRight(){
    if(ballX<=(width-WHITERADIUS)){
        ballX+=Math.cos(10*Math.PI/180)*10;
        ballY+=Math.sin(10*Math.PI/180)*10;
    }
}

function leftArrow(){
    window.clearInterval(leftTimer);
    if(sY<=eY){
        boardLeft();
    }else{
        if(whiteRate>100){
            whiteRate-=50;
        }
    }
    if(eY!=sY){
        leftTimer=setInterval(function(){
            ballLeft();
        },whiteRate);
    }else{
        whiteRate=200;
    }
}

function rightArrow(){
    window.clearInterval(leftTimer);
    if(sY>=eY){
        boardRight();
    }else{
        if(whiteRate>100){
            whiteRate-=50;
        }
    }
    if(eY!=sY){
        leftTimer=setInterval(function(){
            ballRight();
        },whiteRate);
    }else{
        whiteRate=200;
    }
}