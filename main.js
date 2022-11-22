import Ball from './Ball.js';
import Paddle from './Paddle.js';

const MAX_BRICK_COUNT = 30;

const startButton = document.getElementById('start-button');

const ball = new Ball(document.getElementById('ball'));
const paddle = new Paddle(document.getElementById('player-paddle'));
const scoreElem = document.getElementById('player-score');

const bricksContainer = document.getElementById('bricks');

let bricks = getBricks();

let lightnessDirection = -1;
let lastTime;
function update(time) {
  if (lastTime != null) {
    const delta = time - lastTime;

    updateGround(delta);

    ball.update(delta, [paddle.rect(), ...bricks], function (hitRectIndex) {
      // If hit a brick
      if (hitRectIndex > 0) {
        handleHit(hitRectIndex);
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
  // bricks.reset();
}

function handleHit(elemIndex) {
  const brick = document.getElementById(`brick-${elemIndex}`);
  if (!!brick) {
    brick.remove();
    bricks = getBricks();
    scoreElem.textContent = Number.parseInt(scoreElem.textContent) + 1;
  }
}

function getBricks() {
  return [...document.querySelectorAll('.brick')]?.map((item) => item.getBoundingClientRect());
}

function generateBricks() {
  for (let i = 0; i < MAX_BRICK_COUNT; i++) {
    const brick = document.createElement('div');
    brick.className = 'brick';
    brick.id = `brick-${i + 1}`;
    // brick.style
    bricksContainer.appendChild(brick);

    brick.style.setProperty('--x', i % 10);
    brick.style.setProperty('--y', Math.floor(i / 10));
  }
}

startButton.addEventListener('click', () => {
  console.log('START!');

  generateBricks();

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
  document.addEventListener('mousemove', (e) => {
    paddle.position = (e.x / window.innerWidth) * 100;
  });
}
