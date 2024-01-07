import { Board } from './Board';
import { Enemy } from './Enemy';
import { Player } from './Player';

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
    ];

    this.board = new Board(
      [this.player, ...this.enemies],
      BOARD_ROWS,
      BOARD_COLS,
    );
  }

  reset() {
    this.turnsRemaining = this.turnLimit;
    this.player = new Player(Math.floor((BOARD_ROWS - 1) / 2), BOARD_COLS - 1);

    this.enemies = [
      new Enemy(Math.floor((BOARD_ROWS - 1) / 2), (BOARD_COLS - 1) / 2),
    ];

    this.board = new Board(
      [this.player, ...this.enemies],
      BOARD_ROWS,
      BOARD_COLS,
    );
  }

  tick(cb: () => void) {
    this.turnsRemaining -= 1;
    cb();
    if (
      this.isCollisionAt(this.player.position.x, this.player.position.y) ||
      this.score <= 0
    ) {
      // TODO: Save state of neural network if score is greater than last saved
      // eslint-disable-next-line no-alert
      alert('Game over, resetting...');
      this.reset();
    }
  }

  // TODO: Clean up sensor, perhaps by making a sensor class?
  // probably should move this sensing to the player object
  getSensorValues() {
    const { x: playerX, y: playerY } = this.player.position;
    const forwardSensor = [
      { x: playerX, y: playerY - 1 },
      { x: playerX, y: playerY - 2 },
      { x: playerX, y: playerY - 3 },
      { x: playerX, y: playerY - 4 },
      { x: playerX, y: playerY - 5 },
    ];
    const rightSensor = [
      { x: playerX + 1, y: playerY },
      { x: playerX + 2, y: playerY },
      { x: playerX + 3, y: playerY },
    ];
    const backwardSensor = [
      { x: playerX, y: playerY + 1 },
      { x: playerX, y: playerY + 2 },
      { x: playerX, y: playerY + 3 },
    ];
    const leftSensor = [
      { x: playerX - 1, y: playerY },
      { x: playerX - 2, y: playerY },
      { x: playerX - 3, y: playerY },
    ];

    function getSensorValue(
      sensor: { x: number; y: number }[],
      controller: Controller,
    ) {
      for (let i = 0; i < sensor.length; i++) {
        const { x, y } = sensor[i];
        if (controller.isCollisionAt(x, y)) {
          // The closer we detect a collision, the closer the value should be to 1
          return 1 - i * (1 / sensor.length);
        }
      }
      // If we don't see any collisions, the sensor returns 0
      return 0;
    }

    return {
      forward: getSensorValue(forwardSensor, this),
      right: getSensorValue(rightSensor, this),
      backward: getSensorValue(backwardSensor, this),
      left: getSensorValue(leftSensor, this),
    };
  }

  get score() {
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

  private isCollisionAt(x: number, y: number) {
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
