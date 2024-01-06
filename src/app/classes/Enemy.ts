import { Character } from './Character';

const ENEMY_CHAR = '😈';

export class Enemy extends Character {
  constructor(x = 0, y = 0) {
    super(ENEMY_CHAR, x, y);
  }
}
