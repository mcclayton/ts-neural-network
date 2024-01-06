/* eslint-disable no-param-reassign */
export class Level {
  inputs: number[];

  outputs: number[];

  biases: number[];

  weights: number[][];

  constructor(numOfInputs: number, numOfOutputs: number) {
    this.inputs = new Array(numOfInputs);
    this.outputs = new Array(numOfOutputs);
    this.biases = new Array(numOfOutputs);

    this.weights = [];
    // Initialize weights for every input to map to every output
    this.inputs.forEach((_, idx) => {
      this.weights[idx] = new Array(this.outputs.length);
    });
  }

  // Get random weights and biases
  // i.e. we are generating a random "brain"
  private static randomize(level: Level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        // Assigns a random weight value between -1 and 1
        // for an input/output pair (i.e. "Connection")
        level.weights[i][j] = Math.random() * 2 - 1;
      }
    }

    for (let i = 0; i < level.biases.length; i++) {
      // Assigns a random weight value between -1 and 1
      // for an input/output pair (i.e. "Connection")
      level.biases[i] = Math.random() * 2 - 1;
    }
  }

  static feedForward(givenInputs: number[], level: Level) {
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i];
    }

    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i];
      }

      // Turn the output "on" or off"
      // The outputs of our last layer, must be binary "on" / or "off"
      // but we are making all layer outputs binary for simplicity.
      level.outputs[i] = sum > level.biases[i] ? 1 : 0;
    }

    return level.outputs;
  }
}
