import Ball from './Ball.js';
import Paddle from './Paddle.js';

const MAX_BRICK_COUNT = 30;

const startButton = document.getElementById('start-button');

const ball = new Ball(document.getElementById('ball'));
const paddle = new Paddle(document.getElementById('player-paddle'));
const scoreElem = document.getElementById('player-score');

const bricksContainer = document.getElementById('bricks');

let bricks = [];
let brickRects = [];

let lightnessDirection = -1;
let lastTime;
function update(time) {
  if (lastTime != null) {
    const delta = time - lastTime;

    updateGround(delta);

    ball.update(delta, [paddle.rect(), ...brickRects], function (hitRectIndex) {
      // If hit a brick
      if (hitRectIndex > 0) {
        handleHit(hitRectIndex - 1);
      }
    });

    if (isLose()) {
      handleLose();
    }
  }

  lastTime = time;
  window.requestAnimationFrame(update);
}

function updateGround(delta) {
  let foregroundLightness = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--foregroundLightness')
  );
  const backgroundLightness = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--backgroundLightness')
  );

  if (foregroundLightness <= 0) {
    lightnessDirection = 1;
  } else if (foregroundLightness >= 100) {
    lightnessDirection = -1;
  }

  // To set ball and paddles more visible
  const lightnessDiff = Math.floor(Math.abs(foregroundLightness - backgroundLightness));
  if (lightnessDiff === 10) {
    foregroundLightness += lightnessDirection * 20;
  }

  document.documentElement.style.setProperty(
    '--foregroundLightness',
    `${foregroundLightness + lightnessDirection * delta * 0.01}%`
  );
  document.documentElement.style.setProperty(
    '--backgroundLightness',
    `${backgroundLightness - lightnessDirection * delta * 0.01}%`
  );
}

function isLose() {
  const rect = ball.rect();

  return rect.top >= window.innerHeight;
}

function handleLose() {
  scoreElem.textContent = Number.parseInt(scoreElem.textContent) - 1;

  ball.reset();

  generateBricks();
}

function handleHit(elemIndex) {
  if (removeBrick(elemIndex)) {
    scoreElem.textContent = Number.parseInt(scoreElem.textContent) + 1;

    if (bricks.length === 0) {
      ball.reset();
      generateBricks();
    }
  }
}

function generateBricks() {
  // Clear content of bricks container
  bricksContainer.replaceChildren();

  bricks = [];
  brickRects = [];

  for (let i = 0; i < MAX_BRICK_COUNT; i++) {
    const brick = document.createElement('div');
    brick.className = 'brick';
    brick.id = `brick-${i + 1}`;

    const brickContent = document.createElement('div');
    brickContent.className = 'brick__content';
    brick.appendChild(brickContent);

    bricksContainer.appendChild(brick);

    brick.style.setProperty('--x', i % 10);
    brick.style.setProperty('--y', Math.floor(i / 10));

    bricks.push(brick);
  }

  brickRects = [...bricks]?.map((item) => item.getBoundingClientRect());
}

function removeBrick(index) {
  const brick = bricks[index];

  if (!!brick) {
    brick.remove();
    bricks.splice(index, 1);
    brickRects.splice(index, 1);

    return true;
  }

  return false;
}

startButton.addEventListener('click', () => {
  console.log('START!');

  generateBricks();

  document.documentElement.style.cursor = 'none';

  const ballElem = ball.ballElem;
  ballElem.style.display = 'block';
  startButton.style.display = 'none';

  // Start animation
  window.requestAnimationFrame(update);
});

// Touch-screen (mobile) device
if ('ontouchmove' in document.documentElement) {
  document.documentElement.addEventListener('touchmove', (e) => {
    const evt = typeof e.originalEvent === 'undefined' ? e : e.originalEvent;
    const touch = evt.touches[0] || evt.changedTouches[0];
    paddle.position = (touch.pageX / window.innerWidth) * 100;
  });
}
// Desktop device
else {
  function moveFn(value) {
    paddle.position = value;
  }

  document.addEventListener('mousemove', (e) => {
    moveFn((e.x / window.innerWidth) * 100);
  });

  document.addEventListener('keydown', (e) => {
    const btnDelta = 6;

    switch (e.key) {
      case 'ArrowLeft':
        moveFn(paddle.position - btnDelta);
        break;
      case 'ArrowRight':
        moveFn(paddle.position + btnDelta);
        break;
    }
  });
}
