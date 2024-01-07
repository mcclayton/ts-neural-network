/* eslint-disable no-case-declarations */
import 'app/App.css';
import { useRef, useState } from 'react';
import { useInterval } from 'usehooks-ts';

import { Grid } from './Grid/Grid';
import { Controller } from './classes/Controller';
import { NeuralNetwork } from './classes/ai/NeuralNetwork';

export function App() {
  const { current: controller } = useRef(new Controller());
  const [best, setBest] = useState({
    score: 0,
    brain: JSON.stringify(controller.player.brain),
  });
  const [paused, setPaused] = useState(true);
  const [renderCyle, setRenderCycle] = useState(0);

  useInterval(() => {
    if (!paused) {
      const { player } = controller;
      const { forward, right, backward, left } = controller.getSensorValues();
      const actions = NeuralNetwork.feedForward(
        [forward, right, backward, left],
        player.brain,
      );
      if (actions[0]) {
        player.up();
      }
      if (actions[1]) {
        player.right();
      }
      if (actions[2]) {
        player.down();
      }
      if (actions[3]) {
        player.left();
      }
      controller.tick(
        () => setRenderCycle(renderCyle + 1),
        () => {
          if (controller.score > best.score) {
            setBest({
              score: controller.score,
              brain: JSON.stringify(player.brain),
            });
          }
          // mutate the best brain, and reset using the new mutation
          controller.reset(NeuralNetwork.mutate(JSON.parse(best.brain), 0.3));
        },
      );
    }
  }, 1000);

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      🏁 FINISH LINE 🏁
      <div>{`SCORE: ${controller.score.toFixed(1)}`}</div>
      <div>{`Current Session Best: ${best.score}`}</div>
      <div>{`Saved 🧠 Best: ${
        localStorage.getItem('bestScore') || 'N/A'
      }`}</div>
      <div style={{ display: 'flex' }}>
        <Grid key={renderCyle} data={controller.board.data} />
        {/* TODO: Visualize the neural network (weights, biases, inputs, and outputs) */}
      </div>
      <div>
        <button type="button" onClick={() => setPaused(!paused)}>
          {paused ? 'Start' : 'Pause'}
        </button>
        <button
          type="button"
          onClick={() => {
            controller.reset();
            setBest({
              score: 0,
              brain: JSON.stringify(controller.player.brain),
            });
            setPaused(true);
          }}
        >
          Reset
        </button>
      </div>
      <div>
        <button
          type="button"
          onClick={() => {
            if (
              // eslint-disable-next-line no-alert
              !window.confirm(
                'Are you sure you want to overrite the currently saved best neural net state?',
              )
            ) {
              return;
            }
            window.localStorage.setItem('bestScore', `${best.score}`);
            window.localStorage.setItem('bestBrain', best.brain);
          }}
        >
          Save Best 🧠
        </button>
        <button
          type="button"
          disabled={!window.localStorage.getItem('bestBrain')}
          onClick={() => {
            const bestBrain = window.localStorage.getItem('bestBrain');
            const bestScore = window.localStorage.getItem('bestScore');
            if (bestBrain) {
              setPaused(true);
              setBest({
                score: Number.parseInt(bestScore || '0', 10),
                brain: bestBrain,
              });
              controller.reset(JSON.parse(bestBrain));
            }
          }}
        >
          Load Best 🧠
        </button>
        <button
          type="button"
          onClick={() => {
            if (
              // eslint-disable-next-line no-alert
              window.confirm(
                'Are you sure you want to clear the best neural net state from local storage?',
              )
            ) {
              window.localStorage.clear();
            }
          }}
        >
          Clear Best 🧠
        </button>
      </div>
    </div>
  );
}
