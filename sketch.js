let x = 0;
let boop;

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;
const DIRECTION_UP = "ArrowUp";
const DIRECTION_DOWN = "ArrowDown";
const DIRECTION_RIGHT = "ArrowRight";
const DIRECTION_LEFT = "ArrowLeft";

let frameRatePerSec = 12;
let environment;
let food;


class Element {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  distance(other) {
    return Math.sqrt(
      Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2)
    );
  }
}

class Food extends Element {
  constructor(x, y) {
    super(x, y);
  }

  draw() {
    stroke(255);
    fill(0);
    rect(this.x, this.y, 10, 10);
  }
}

class SnakeBodyPart extends Element {
  constructor(x, y) {
    super(x, y);
    this.size = 10;
  }

  draw() {
    stroke(0);
    fill(255);
    rect(this.x, this.y, this.size, this.size);
  }

  isOutOfBounds() {
    return (
      this.x >= CANVAS_WIDTH ||
      this.x <= 0 ||
      this.y <= 0 ||
      this.y >= CANVAS_HEIGHT
    );
  }
}

class Snake {
  constructor() {
    this.body = [new SnakeBodyPart(40, 40)];
    this.direction = DIRECTION_RIGHT;
  }

  getHead() {
    return this.body[0];
  }

  getTail() {
    return this.body[this.body.length - 1];
  }

  nextHead() {
    const head = this.getHead();
    return {
      [DIRECTION_UP]: new SnakeBodyPart(head.x, head.y - head.size),
      [DIRECTION_DOWN]: new SnakeBodyPart(head.x, head.y + head.size),
      [DIRECTION_RIGHT]: new SnakeBodyPart(head.x + head.size, head.y),
      [DIRECTION_LEFT]: new SnakeBodyPart(head.x - head.size, head.y)
    }[this.direction];
  }

  advance() {
    const nextHead = this.nextHead();
    this.body.pop();
    this.body.unshift(nextHead);
  }

  draw() {
    for (let part of this.body) {
      part.draw();
    }
  }

  onDirectionChanged() {
    let _this = this;

    // Handle only arrow presses
    if (!isArrowKey() || isReverse()) return;
    this.direction = key;

    function isReverse() {
      return (
        (_this.direction == DIRECTION_UP && key == DIRECTION_DOWN) ||
        (_this.direction == DIRECTION_DOWN && key == DIRECTION_UP) ||
        (_this.direction == DIRECTION_RIGHT && key == DIRECTION_LEFT) ||
        (_this.direction == DIRECTION_LEFT && key == DIRECTION_RIGHT)
      );
    }

    function isArrowKey() {
      return [
        DIRECTION_UP,
        DIRECTION_DOWN,
        DIRECTION_RIGHT,
        DIRECTION_LEFT
      ].includes(key);
    }
  }

  isTouchingFood() {
    let distance = this.getHead().distance(food);
    return distance < 10;
  }

  isOutOfBounds() {
    return this.getHead().isOutOfBounds();
  }

  eat() {
    const tail = this.getTail();
    const newTail = new SnakeBodyPart(tail.x, tail.y);
    this.body.push(newTail);
    frameRatePerSec += 2;
    frameRate(frameRatePerSec);
    food = null;
  }
}

let snake = new Snake();

function setup() {
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.parent("container1");
  frameRate(frameRatePerSec);
}

function draw() {
  background(204);

  // Update
  snake.advance();
  if (!food) generateFood();

  // Draw
  snake.draw();
  food.draw();

  if (snake.isTouchingFood()) snake.eat();
  if (keyIsDown) snake.onDirectionChanged();
  if (snake.isOutOfBounds()) this.restart();
}

function restart() {
  snake.body = [new SnakeBodyPart(40, 40)];
  snake.direction = DIRECTION_RIGHT;
  food = null;
}

function generateFood() {
  const x = random(5, CANVAS_WIDTH - 5);
  const y = random(5, CANVAS_HEIGHT - 5);
  food = new Food(x, y);
}
