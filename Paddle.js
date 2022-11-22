const SPEED = 0.02;

export default class Paddle {
  constructor(paddleElem) {
    this.paddleElem = paddleElem;
    this.reset();
  }

  get position() {
    return Number.parseFloat(getComputedStyle(this.paddleElem).getPropertyValue('--x'));
  }

  set position(value) {
    this.paddleElem.style.setProperty('--x', value);
  }

  rect() {
    return this.paddleElem.getBoundingClientRect();
  }

  reset() {
    this.position = 50;
  }

  update(delta, ballWidth) {
    this.position += SPEED * delta * (ballWidth - this.position);
  }
}
