import { Character } from './Character';

const PLAYER_CHAR = '😀';

export class Player extends Character {
  constructor(x = 0, y = 0) {
    super(PLAYER_CHAR, x, y);
  }
}
