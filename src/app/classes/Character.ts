export abstract class Character {
  private x: number;

  private y: number;

  private char: string;

  constructor(symbol: string, x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.char = symbol;
  }

  up() {
    this.y -= 1;
  }

  down() {
    this.y += 1;
  }

  left() {
    this.x -= 1;
  }

  right() {
    this.x += 1;
  }

  get position() {
    return { x: this.x, y: this.y };
  }

  get symbol() {
    return this.char;
  }
}
