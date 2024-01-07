import { Board } from './Board';
import { Enemy } from './Enemy';
import { Player } from './Player';
import { NeuralNetwork } from './ai/NeuralNetwork';

const BOARD_ROWS = 11;
const BOARD_COLS = 15;

export class Controller {
  private turnLimit: number;

  private turnsRemaining: number;

  public player: Player;

  public enemies: Enemy[];

  public board: Board;

  constructor(turnLimit: number = 100) {
    this.turnLimit = turnLimit;
    this.turnsRemaining = turnLimit;
    this.player = new Player(Math.floor((BOARD_ROWS - 1) / 2), BOARD_COLS - 1);

    this.enemies = [
      new Enemy(Math.floor((BOARD_ROWS - 1) / 2), (BOARD_COLS - 1) / 2),
      new Enemy(0, 0),
      new Enemy(2, 2),
      new Enemy(4, 4),
      new Enemy(6, 6),
      new Enemy(8, 8),
      new Enemy(2, 9),
      new Enemy(1, 11),
      new Enemy(4, 9),
      new Enemy(9, 10),
      new Enemy(6, 12),
      new Enemy(9, 13),
    ];

    this.board = new Board(
      [this.player, ...this.enemies],
      BOARD_ROWS,
      BOARD_COLS,
    );
  }

  reset(brain?: NeuralNetwork) {
    this.turnsRemaining = this.turnLimit;
    this.player = new Player(
      Math.floor((BOARD_ROWS - 1) / 2),
      BOARD_COLS - 1,
      brain,
    );

    this.enemies = [
      new Enemy(Math.floor((BOARD_ROWS - 1) / 2), (BOARD_COLS - 1) / 2),
      new Enemy(0, 0),
      new Enemy(2, 2),
      new Enemy(4, 4),
      new Enemy(6, 6),
      new Enemy(8, 8),
      new Enemy(2, 9),
      new Enemy(1, 11),
      new Enemy(4, 9),
      new Enemy(9, 10),
      new Enemy(6, 12),
      new Enemy(9, 13),
    ];

    this.board = new Board(
      [this.player, ...this.enemies],
      BOARD_ROWS,
      BOARD_COLS,
    );
  }

  tick(cb: () => void, onFinish?: () => void) {
    this.turnsRemaining -= 1;
    cb();
    if (
      this.isCollisionAt(this.player.position.x, this.player.position.y) ||
      this.score <= 0 ||
      this.turnsRemaining <= 0
    ) {
      onFinish?.();
    }
  }

  get score() {
    // TODO: Punish AI for staying in same spot for a move ?

    // Score is 80% weighted based on distance to finish
    // Score is 20% weighted based on number of moves taken
    const DISTANCE_SCORE_WEIGHT = 0.8;
    const MOVES_SCORE_WEIGHT = 0.2;

    const distanceToFinish = this.board.cols - 1 - this.player.position.y;

    return Number(
      DISTANCE_SCORE_WEIGHT * distanceToFinish +
        MOVES_SCORE_WEIGHT * this.turnsRemaining,
    );
  }

  isCollisionAt(x: number, y: number) {
    if (x > this.board.rows - 1 || x < 0) {
      return 'BOUNDARY';
    }
    if (y > this.board.cols - 1 || y < 0) {
      return 'BOUNDARY';
    }

    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      if (x === enemy.position.x && y === enemy.position.y) {
        return 'ENEMY';
      }
    }

    return false;
  }
}
