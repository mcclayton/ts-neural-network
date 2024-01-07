/* eslint-disable no-param-reassign */
import { Level } from './Level';

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export class NeuralNetwork {
  levels: Level[];

  constructor(neuronCounts: number[]) {
    this.levels = [];
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  static feedForward(givenInputs: number[], network: NeuralNetwork) {
    // Get the outputs of the first level
    let outputs = Level.feedForward(givenInputs, network.levels[0]);
    for (let i = 1; i < network.levels.length; i++) {
      // Put the output of the previous level, into the input of the next level
      outputs = Level.feedForward(outputs, network.levels[i]);
    }
    return outputs;
  }

  // Amount 1 = 100%
  static mutate(network: NeuralNetwork, amount = 1) {
    network.levels.forEach((level) => {
      for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] = lerp(level.biases[0], Math.random() * 2 - 1, amount);
      }

      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          level.weights[i][j] = lerp(
            level.weights[i][j],
            Math.random() * 2 - 1,
            amount,
          );
        }
      }
    });
    return network;
  }
}
