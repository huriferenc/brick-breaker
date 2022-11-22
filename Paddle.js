export default class Paddle {
  constructor(paddleElem) {
    this.paddleElem = paddleElem;
    this.reset();
  }

  get position() {
    return Number.parseFloat(getComputedStyle(this.paddleElem).getPropertyValue('--x'));
  }

  set position(value) {
    this.paddleElem.style.setProperty('--x', value <= 0 ? 0 : value >= 100 ? 100 : value);
  }

  rect() {
    return this.paddleElem.getBoundingClientRect();
  }

  reset() {
    this.position = 50;
  }
}
