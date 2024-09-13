let board;
let boardWidth = 1500;
let boardHeight = 300;
let context;
let playerWidth = 85;
let playerHeight = 85;
let playerX = 50;
let playerY = 215;
let playerImg;
let player = {
    x: playerX,
    y: playerY,
    width: playerWidth,
    height: playerHeight
};

playerImg = new Image();
playerImg.src = "gus123.png";

let gameOver = false;
let score = 0;
let time = 0;
let live = 3;


let boxImg;
let boxWidth = 90;
let boxHeight = 120;
let boxX = 1000;
let boxY = 215;

boxImg = new Image();
boxImg.src = "83.jpg";

let boxesArray = [];
let boxSpeed = -10; 

let VelocityY = 0;
let Gravity = 0.35;

let Retry = document.getElementById("RetryButton");
let RetryDelay = false

console.log(player);
window.onload = function () {
    
    board = document.getElementById("Board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    playerImg.onload = function () {
        context.drawImage(playerImg, player.x, player.y, player.width, player.height);
    };

    requestAnimationFrame(update);

    document.addEventListener("keydown", movePlayer);
    Retry.addEventListener("click", ()=>{
        if(RetryDelay){
        
        }else{
            RetryDelay = true
            Retry.innerHTML = "WAITTT"; 
            setTimeout(() => {
                gameReset()
                Retry.innerHTML = "Again" 
                RetryDelay=false
                }, 1000);
            }
        }   );

    
    createBoxWithRandomInterval();
};

function createBoxWithRandomInterval() {

    if (gameOver) {
        return;
    }

    createBox(); 
    let randomTime = rnd(1000, 2500);
    setTimeout(createBoxWithRandomInterval, randomTime);
}

function rnd(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}

function update() {
    requestAnimationFrame(update);

    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);
    VelocityY += Gravity;

    player.y = Math.min(player.y + VelocityY, playerY);
    context.drawImage(playerImg, player.x, player.y, player.width, player.height);

    for (let index = 0; index < boxesArray.length; index++) {
        let box = boxesArray[index];
        box.x += boxSpeed;
        context.drawImage(box.img, box.x, box.y, box.width, box.height);

        if (onCollision(player, box)) {
            gameOver = true;
            live -= 1;

            context.font = "normal bold 40px Arial"; 
            context.textAlign = "center";
            context.fillText("GameOver!", boardWidth / 2, boardHeight / 2);
            context.fillText("Your Score : "+score,boardWidth/2 ,(boardHeight/2)+50);

            setTimeout(() => {
                Retry.style.display = "block";
            }, 500);
        }
    }
    score++;
    time += 0.01;
    context.font = "normal bold 40px Arial";
    context.textAlign = "left";
    context.fillText("Score : " + score, 200, 40);
    context.fillText("Time : " + time.toFixed(0), 20, 40);
    context.fillText("Live Remain : " + live, 20, 80);
    context.fillStyle = "white";
    if (time == 60) {
        gameOver = true;
        context.font = "normal bold 40px Arial"; 
        context.textAlign = "center";
        context.fillText("You Won! With Score :" + score, boardWidth / 2, boardHeight / 2);
        
    }
}

function movePlayer(e) {
    if (gameOver) {
        return;
    }

    if (e.code === "Space" && player.y === playerY) {
        VelocityY = -10;
    }
}

function createBox(e) {
    if (gameOver) {
        return;
    }

    let box = {
        img: boxImg,
        x: boxX,
        y: boxY,
        width: boxWidth,
        height: boxHeight
    };

    boxesArray.push(box);

    if (boxesArray.length > 5) {
        boxesArray.shift();
    }
}

function onCollision(obj1, obj2) {
    return obj1.x < (obj2.x + obj2.width) && (obj1.x + obj1.width) > obj2.x
        && obj1.y < (obj2.y + obj2.height) && (obj1.y + obj1.height) > obj2.y;
}

function gameReset() {
    if (!gameOver) {
        return;
    }

    
    if (live > 0) {
        setTimeout(() => {
            gameOver = false;
            Retry.style.display = "block"; 
            score = 0;
            time = 0;
            boxesArray = [];
            VelocityY = 0;
            player.y = playerY;

            createBoxWithRandomInterval();
        }, 500);
        
    }
}