import { Character } from './Character';
import { NeuralNetwork } from './ai/NeuralNetwork';

const PLAYER_CHAR = '😀';

const NUM_OF_INPUT_SENSORS = 4;
const NUM_OF_ACTION_OUTPUTS = 4;

export class Player extends Character {
  brain: NeuralNetwork;

  constructor(x = 0, y = 0, brain?: NeuralNetwork) {
    super(PLAYER_CHAR, x, y);
    // Using a hidden layer of 6 neurons in between inputs and outputs
    if (!brain) {
      this.brain = new NeuralNetwork([
        NUM_OF_INPUT_SENSORS,
        6,
        NUM_OF_ACTION_OUTPUTS,
      ]);
    } else {
      this.brain = brain;
    }
  }
}
