import cloneDeep from 'lodash/cloneDeep';

import { Character } from './Character';

const EMPTY_VALUE = '';

export class Board {
  private characters: Character[];

  private grid: string[][];

  constructor(characters: Character[], rows = 10, cols = 10) {
    this.characters = characters;
    this.grid = Array.from({ length: cols }, () =>
      Array(rows).fill(EMPTY_VALUE),
    );
  }

  get rows() {
    return this.grid[0].length;
  }

  get cols() {
    return this.grid.length;
  }

  // tick() {
  //   this.checkCollisions();
  // }

  get data() {
    const newGrid = cloneDeep(this.grid);
    this.characters.forEach((c) => {
      const { x, y } = c.position;
      newGrid[y][x] = c.symbol;
    });
    return newGrid;
  }
}
