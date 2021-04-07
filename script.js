const $canvas = document.getElementById('myCanvas'),
      $bricks = document.getElementById('bricks'),
      $start = document.getElementById('start'),
      $steps = document.getElementById('steps'),
      ctx = $canvas.getContext("2d"),
      ballRadius = 10;

let x = $canvas.width/2,
    y = $canvas.height-30,
    dx = 2,
    dy = -2,
    paddleHeight = 10,
    paddleWidth = 75,
    paddleX = (($canvas.width - paddleWidth) / 2),
    paddleY = ($canvas.height - paddleHeight),
    rightPressed = false,
    leftPressed = false,
    brickRowCount = 3,
    brickColumnCount = 6,
    brickWidth = 80,
    brickHeight = 20,
    brickPadding = 10,
    brickOffsetTop = 30,
    brickOffsetLeft = 30,
    bricks = [],
    score = 0,
    interval,
    steps = 0;
    

  for(var c=0; c<brickColumnCount; c++) {
      bricks[c] = [];
      for(var r=0; r<brickRowCount; r++) {
          bricks[c][r] = { x: 0, y: 0 , status: 1};
      }
  }


////event listeners

document.addEventListener("keydown", keyMoveDown);
document.addEventListener("keyup", keyMoveUp);
$start.addEventListener('click', () => {interval = setInterval(startGame, 10);})

////functions


function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "gold";
  ctx.fill();
  ctx.closePath();
}


function draw() {
  drawPaddle();
  drawBricks();

}

draw();
function startGame() {
  ctx.clearRect(0, 0, $canvas.width, $canvas.height);
  drawBall();
  draw();
  collisionDetection();
  
  //hitting the top wall
  if(y + dy < ballRadius) {
      dy = -dy;
  }
  //hitting bottom wall
   if (y + dy > $canvas.height - ballRadius){
    if(x > paddleX && x < paddleX + paddleWidth) { //if ball hit paddle
      dy = -dy;
    } else { //if ball missed paddle
      checkBallMissedPaddle();
    }
     
  }
  
    if(x + dx > $canvas.width-ballRadius || x + dx < ballRadius) { //ball hits the left and right wall
      dx = -dx;
  }
  
  x += dx;
  y += dy;

  movePaddle();
}

function checkBallMissedPaddle() {
  if (y + dy > $canvas.height + ballRadius) { //if ball missed paddle
    clearInterval(interval);
      Swal.fire({
        title: 'Game Over',
        text: 'You lost the ball, Try again',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        imageUrl: 'https://cdn0.iconfinder.com/data/icons/social-messaging-productivity-4/128/thumbs-down2-512.png',
        imageWidth: 100,
        imageHeight: 100,
    }).then((result) => {
      console.log(result.isConfirmed);
      if (result.isConfirmed) {
        document.location.reload();
      }})}
}

function movePaddle() {
  if(rightPressed) {
    paddleX += 7;
    if(paddleX + paddleWidth > $canvas.width) {
      paddleX = $canvas.width - paddleWidth;
    }
}
if(leftPressed) {
  paddleX -= 7;
  if(paddleX < 0) {
      paddleX = 0;
  }
}
}

// let interval = setInterval(draw, 10);

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}


function keyMoveDown($event) {
  if($event.key == 'Right' || $event.key == 'ArrowRight') {
    rightPressed = true;
  } 
  if ($event.key == 'Left' || $event.key == 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyMoveUp($event) {
    if($event.key == 'Right' || $event.key == 'ArrowRight') {
        rightPressed = false;
      } 
      if ($event.key == 'Left' || $event.key == 'ArrowLeft') {
        leftPressed = false;
      }

}


function drawBricks() {
  for (let c=0; c<brickColumnCount; c++) {
    for (let r=0; r<brickRowCount; r++) {
      if(bricks[c][r].status == 1) {
      let brickX = (c*(brickWidth + brickPadding) + brickOffsetLeft);
      let brickY = (r*(brickHeight + brickPadding) + brickOffsetTop);
      bricks[c][r].x = brickX;
      bricks[c][r].y = brickY;
      ctx.beginPath();
      ctx.rect(brickX, brickY, brickWidth, brickHeight);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.closePath();}
    }
  }
}


function collisionDetection() {
  for(let c=0; c<brickColumnCount; c++) {
    for(let r=0; r<brickRowCount; r++) {
        let b = bricks[c][r];
        if(b.status ==1) {
          if(x > b.x && x < (b.x + brickWidth) && y > b.y && y < (b.y + brickHeight)) {
            dy = -dy;
            // dx = -dx;
            b.status = 0;
            steps ++;
            $steps.innerText = steps;
            calcSteps();

        }
        }
    }
  }
}


function calcSteps() {
  if(steps == brickRowCount*brickColumnCount) {
    setTimeout(() => {
      Swal.fire({
        position: 'center',
        title: 'Good Job',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        imageUrl: './photo/winner.jpg',
        imageWidth: 100,
        imageHeight: 100,

      }).then((result) => {
        console.log(result.isConfirmed);
        if (result.isConfirmed) {
          document.location.reload();
        }});
      clearInterval(interval);
    }, 200);
  }
}







// function drawScore() {
//   ctx.font = "bold 16px Arial";
//   ctx.fillStyle = "gold";
//   ctx.fillText("Score: "+score, 8, 20);
// }