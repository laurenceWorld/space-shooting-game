// 캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement('canvas');
ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundImg, spaceshipImg, bulletImg, enemyImg, gameOverImg;
let gameOver = false;
let score = 0;

// 우주선 좌표
let spaceshipX = canvas.width / 2 - 24;
let spaceshipY = canvas.height - 48;

let bulletList = [];
function Bullet() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = spaceshipX + 16;
    this.y = spaceshipY;
    this.alive = true;

    bulletList.push(this);
  };
  this.update = function () {
    this.y -= 7;
  };

  this.checkHit = function () {
    for (let i = 0; i < enemyList.length; i++) {
      if (
        this.y <= enemyList[i].y &&
        this.x >= enemyList[i].x &&
        this.x <= enemyList[i].x + 50
      ) {
        score++;
        this.alive = false;
        enemyList.splice(i, 1);
      }
    }
  };
}

function generateRandomValue(min, max) {
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNum;
}

let enemyList = [];
function Enemy() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.y = 0;
    this.x = generateRandomValue(0, canvas.width - 50);
    enemyList.push(this);
  };
  this.update = function () {
    this.y += 5;

    if (this.y >= canvas.height - 50) {
      gameOver = true;
    }
  };
}

function loadImage() {
  backgroundImg = new Image();
  backgroundImg.src = 'images/background.jpg';

  spaceshipImg = new Image();
  spaceshipImg.src = 'images/spaceship.png';

  bulletImg = new Image();
  bulletImg.src = 'images/bullet.png';

  enemyImg = new Image();
  enemyImg.src = 'images/enemy.png';

  gameOverImg = new Image();
  gameOverImg.src = 'images/gameover.jpg';
}

let keysDown = {};
function setupKeyboardListener() {
  document.addEventListener('keydown', (event) => {
    keysDown[event.key] = true;
  });
  document.addEventListener('keyup', (event) => {
    delete keysDown[event.key];

    if (event.code == 'Space') {
      createBullet();
    }
  });
}

function createBullet() {
  let b = new Bullet();
  b.init();
}

function createEnemy() {
  const interval = setInterval(function () {
    let e = new Enemy();
    e.init();
  }, 700);
}

function update() {
  if ('ArrowRight' in keysDown) {
    spaceshipX += 5; // 우주선 속도
  }
  if ('ArrowLeft' in keysDown) {
    spaceshipX -= 5;
  }

  if (spaceshipX <= 0) {
    spaceshipX = 0;
  }
  if (spaceshipX >= canvas.width - 48) {
    spaceshipX = canvas.width - 48;
  }

  // 총알의 y좌표 업데이트하는 함수 호출
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      bulletList[i].update();
      bulletList[i].checkHit();
    }
  }

  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].update();
  }
}

function render() {
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImg, spaceshipX, spaceshipY);
  ctx.fillText(`Score:${score}`, 20, 30);
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';

  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      ctx.drawImage(bulletImg, bulletList[i].x, bulletList[i].y);
    }
  }

  for (let i = 0; i < enemyList.length; i++) {
    ctx.drawImage(enemyImg, enemyList[i].x, enemyList[i].y);
  }
}

function main() {
  if (!gameOver) {
    update();
    render();
    requestAnimationFrame(main);
  } else {
    ctx.drawImage(gameOverImg, 10, 100, 380, 380);
  }
}

loadImage();
setupKeyboardListener();
createEnemy();
main();

// 문제!! 스코어 오르는게 이상함
