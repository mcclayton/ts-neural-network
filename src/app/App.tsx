/* eslint-disable no-case-declarations */
import 'app/App.css';
import { useEffect, useRef, useState } from 'react';

import { Grid } from './Grid/Grid';
import { Controller } from './classes/Controller';
import { NeuralNetwork } from './classes/ai/NeuralNetwork';

export function App() {
  const [renderCyle, setRenderCycle] = useState(0);
  const { current: controller } = useRef(new Controller());

  const handleKeyUp = (event: KeyboardEvent) => {
    const { player } = controller;
    switch (event.key) {
      case 'ArrowUp':
        player.up();
        controller.tick(() => setRenderCycle(renderCyle + 1));
        break;
      case 'ArrowDown':
        player.down();
        controller.tick(() => setRenderCycle(renderCyle + 1));
        break;
      case 'ArrowRight':
        player.right();
        controller.tick(() => setRenderCycle(renderCyle + 1));
        break;
      case 'ArrowLeft':
        player.left();
        controller.tick(() => setRenderCycle(renderCyle + 1));
        break;
      default:
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
        controller.tick(() => setRenderCycle(renderCyle + 1));
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp);

    // Cleanup the event listeners when the component unmounts
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderCyle]);

  return (
    <div>
      🏁 FINISH LINE 🏁
      <div>{`SCORE: ${controller.score.toFixed(1)}`}</div>
      <div style={{ display: 'flex' }}>
        <Grid key={renderCyle} data={controller.board.data} />
        {/* TODO: Visualize the neural network (weights, biases, inputs, and outputs) */}
      </div>
    </div>
  );
}
