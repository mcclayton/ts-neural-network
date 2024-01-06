import 'app/App.css';
import { useEffect, useRef, useState } from 'react';

import { Grid } from './Grid/Grid';
import { Controller } from './classes/Controller';

export function App() {
  const [renderCyle, setRenderCycle] = useState(0);
  const { current: controller } = useRef(new Controller());

  const handleKeyUp = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        controller.player.up();
        controller.tick(() => setRenderCycle(renderCyle + 1));
        break;
      case 'ArrowDown':
        controller.player.down();
        controller.tick(() => setRenderCycle(renderCyle + 1));
        break;
      case 'ArrowRight':
        controller.player.right();
        controller.tick(() => setRenderCycle(renderCyle + 1));
        break;
      case 'ArrowLeft':
        controller.player.left();
        controller.tick(() => setRenderCycle(renderCyle + 1));
        break;
      default:
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
      <Grid key={renderCyle} data={controller.board.data} />
    </div>
  );
}
