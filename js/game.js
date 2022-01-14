'use strict'

const backCanvas = document.querySelector('#background_controller');
const backContext = backCanvas.getContext('2d');

const canvas = document.querySelector('#game_field');
const context = canvas.getContext('2d');

const fieldSize = {
  x: parseInt(canvas.offsetWidth),
  y: parseInt(canvas.offsetHeight)
};

const square_size = 24;
const cell = {
  size: square_size,
  quarter: square_size / 4,
  amount: {
    x: fieldSize.x / square_size,
    y: fieldSize.y / square_size
  },
  center: {
    x: Math.floor(fieldSize.x / 2 / square_size),
    y: Math.floor(fieldSize.y / 2 / square_size)
  }
};

const scoreSpan = document.querySelector('#score_value');
let score = 0;


const foodArray = [
  'img/eda1.png',
  'img/eda2.png',
  'img/eda3.png',
];
let foodImg = new Image();
foodImg.src = foodArray[foodRand(0, foodArray.length - 1)];
let food = {
  x: Math.floor(Math.random() * cell.amount.x) * cell.size,
  y: Math.floor(Math.random() * cell.amount.y) * cell.size
};
let isFoodChange = false;

function foodRand(a, b) {
  return Math.floor(
    Math.random() * (b - a + 1)
  ) + a;
}

let snake = [];
let snakeLength = 12; //

const speed = cell.size / 8;

snake[0] = {
  x: cell.center.x * cell.size,
  y: cell.center.y * cell.size
};

const partyCheckBox = document.querySelector('#party-checkbox');

let isAudioinit = false;

const audioGameOver = new Audio('sound/gameover.mp3');
const audioEat = new Audio('sound/eat.mp3');

function soundInit() {
  isAudioinit = true;
  audioGameOver.play();
  audioGameOver.pause();
  audioEat.play();
  audioEat.pause();
}

function soundEat() {
  audioEat.currentTime = 0.5;
  audioEat.play();
}

function soundGameOver() {
  audioGameOver.currentTime = 0;
  audioGameOver.play();
}

function randomColor() {
  return '#' + ((~~(Math.random() * 255)).toString(16)) + ((~~(Math.random() * 255)).toString(16)) + ((~~(Math.random() * 255)).toString(16));
}

document.addEventListener('keydown', changeDirection);
(function () {
  document.querySelector('#up').addEventListener('click', dirUp);
  document.querySelector('#right').addEventListener('click', dirRight);
  document.querySelector('#down').addEventListener('click', dirDown);
  document.querySelector('#left').addEventListener('click', dirLeft);
})();
(function () {
  document.querySelector('#mob-up').addEventListener('touchstart', dirUp);
  document.querySelector('#mob-right').addEventListener('touchstart', dirRight);
  document.querySelector('#mob-down').addEventListener('touchstart', dirDown);
  document.querySelector('#mob-left').addEventListener('touchstart', dirLeft);
})();

(function () {
  document.querySelector('#mob-up').addEventListener('click', dirUp);
  document.querySelector('#mob-right').addEventListener('click', dirRight);
  document.querySelector('#mob-down').addEventListener('click', dirDown);
  document.querySelector('#mob-left').addEventListener('click', dirLeft);
})();

let dir;
let nextDir;


function changeDirection(EO) {
  EO = EO || window.event;

  if (isAudioinit === false) {
    soundInit();
  }

  if (EO.keyCode === 38) {
    dirUp(EO);
  } else if (EO.keyCode === 39) {
    dirRight(EO);
  } else if (EO.keyCode === 40) {
    dirDown(EO);
  } else if (EO.keyCode === 37) {
    dirLeft(EO);
  }
}

function dirUp(EO) {
  EO = EO || window.event;
  EO.preventDefault();
  if (dir != 'down') {
    nextDir = 'up';
  }
  return;
}

function dirRight(EO) {
  EO = EO || window.event;
  EO.preventDefault();
  if (dir != 'left') {
    nextDir = 'right';
  }
  return;
}

function dirDown(EO) {
  EO = EO || window.event;
  EO.preventDefault();
  if (dir != 'up') {
    nextDir = 'down';
  }
  return;
}

function dirLeft(EO) {
  EO = EO || window.event;
  EO.preventDefault();
  if (dir != 'right') {
    nextDir = 'left';
  }
  return;
}

function drawSnake() {
  for (let i = snake.length - 1; i >= 0; i--) {
    context.beginPath();
    context.fillStyle = (i == 0) ? '#040e26' : '#142652';
    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.arc(snake[i].x + cell.quarter * 2, snake[i].y + cell.quarter * 2, cell.quarter * 2, 0, Math.PI * 2, false);
    context.fill();
  }
}

function throughWall(snakeX, snakeY) {
  if (snakeX < 0) {
    snakeX = fieldSize.x - (cell.size);
  } else if (snakeX > (fieldSize.x - cell.size)) {
    snakeX = 0;
  }
  if (snakeY < 0) {
    snakeY = fieldSize.y - cell.size;
  } else if (snakeY > (fieldSize.y - cell.size)) {
    snakeY = 0;
  }
  return {
    x: snakeX,
    y: snakeY
  };
}


function renderingСontrol() {
  context.clearRect(0, 0, fieldSize.x, fieldSize.y);


  (function () {
    try {
      if (isFoodChange) {
        isFoodChange = false;
        foodImg.src = foodArray[foodRand(0, foodArray.length - 1)];
      }
      context.shadowBlur = 20;
      context.shadowOffsetX = 1;
      context.shadowOffsetY = 2;
      context.shadowColor = '#be6c6a';
      context.drawImage(foodImg, food.x, food.y);
    } catch (ex) {
      console.error('возникло исключение типа: ' + ex.name);
      isFoodChange = true;
      if (isFoodChange) {
        isFoodChange = false;
        foodImg.src = foodArray[foodRand(0, foodArray.length - 1)];
      }
      context.shadowBlur = 20;
      context.shadowOffsetX = 1;
      context.shadowOffsetY = 2;
      context.shadowColor = '#be6c6a';
      context.drawImage(foodImg, food.x, food.y);
    }
  })();


  let snakeX = snake[0].x;
  let snakeY = snake[0].y;


  (function () {

    if (snakeX % cell.size === 0 && (nextDir == 'up' || nextDir == 'down')) {
      dir = nextDir;
      nextDir = '';
    } else if (snakeY % cell.size === 0 && (nextDir == 'right' || nextDir == 'left')) {
      dir = nextDir;
      nextDir = '';
    }

    if (dir == 'left') {
      snakeX -= speed;
    } else if (dir == 'up') {
      snakeY -= speed;
    } else if (dir == 'right') {
      snakeX += speed;
    } else if (dir == 'down') {
      snakeY += speed;
    }
  })();


  let afterWallPos = {};

  if (snakeX < 0 || snakeX > (fieldSize.x - cell.size) ||
    snakeY < 0 || snakeY > (fieldSize.y - cell.size)) {
    afterWallPos = throughWall(snakeX, snakeY);
    snakeX = afterWallPos.x;
    snakeY = afterWallPos.y;
  }


  drawSnake();


  if (snakeX == food.x && snakeY == food.y) {
    score++;
    soundEat();
    scoreSpan.textContent = score;
    setTimeout(changeFood, 0);

    function changeFood() {
      isFoodChange = true;
    }
    food = {
      x: Math.floor(Math.random() * cell.amount.x) * cell.size,
      y: Math.floor(Math.random() * cell.amount.y) * cell.size
    };
    snakeLength += 8;
  } else if (!dir || snake.length > snakeLength) {
    snake.pop();
  }


  let newHead = {
    x: snakeX,
    y: snakeY
  };


  for (let i = 0; i < snake.length; i++) {
    if (newHead.x === snake[i].x && newHead.y === snake[i].y) {

      setTimeout(gameOver, 100);
    }
  }
  snake.unshift(newHead);
}
let game = setInterval(renderingСontrol, 1000 / 60);

document.querySelector('#butt_start').addEventListener('click', newGame);

function newGame() {

  document.location.reload();
}


function gameOver() {
  context.clearRect(0, 0, fieldSize.x, fieldSize.y);

  clearInterval(game);
  showHiddenRecord();

}

function showHiddenRecord() {
  const recordText = document.querySelector('.hidden');
  recordText.style.display = "block";
  const finalScore = document.querySelector('#final_score');
  finalScore.textContent = score;
  soundGameOver();
}



document.querySelector('#butt_rules').addEventListener('click', showRules);
document.querySelector('#close-rules-but').addEventListener('click', showRules);
const rules = document.querySelector('#rules');
let isRulesShow = false;

function showRules() {
  if (!isRulesShow) {
    rules.style.visibility = 'visible';
    rules.style.height = '550px';
    isRulesShow = true;
    return;
  }
  if (isRulesShow) {
    rules.style.visibility = 'hidden';
    rules.style.height = '0px';
    isRulesShow = false;
    return;
  }
}
let isDirty = true;

// window.onbeforeunload = function (evt) {
//   if (isDirty) {
//     return 'If you continue your changes will not be saved.';
//   }
// };