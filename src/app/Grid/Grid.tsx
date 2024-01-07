import { Controller } from 'app/classes/Controller';
import {
  LineOfSightSensor,
  SensorCoordinate,
} from 'app/classes/LineOfSightSensor';
import { Player } from 'app/classes/Player';

import { gridCell, gridContainer, gridRow } from './Grid.css';

type Props = {
  controller: Controller;
};

export function Grid({ controller }: Props) {
  const {
    board: { data },
  } = controller;

  return (
    <div className={gridContainer}>
      {data.map((row, rowIndex) => (
        <div key={rowIndex} className={gridRow}>
          {row.map((value, colIndex) => (
            <div
              key={colIndex}
              className={gridCell}
              style={{
                background: `rgba(255,255,0, ${getLineOfSightOpacity(
                  colIndex,
                  rowIndex,
                  controller.player,
                )})`,
              }}
            >
              {value}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function getLineOfSightOpacity(x: number, y: number, player: Player) {
  const { forward, right, backward, left } =
    LineOfSightSensor.getSensorCoordinates(
      player.position.x,
      player.position.y,
    );

  return [forward, right, backward, left].reduce(
    (acc, coords) =>
      Math.max(acc, getDirectionLineOfSightOpacity(x, y, coords)),
    0,
  );
}

function getDirectionLineOfSightOpacity(
  x: number,
  y: number,
  coords: SensorCoordinate[],
) {
  const index = coords
    .reverse()
    .findIndex(({ x: sensorX, y: sensorY }) => x === sensorX && y === sensorY);
  return index === -1 ? 0 : reverseNormalize(index, 0, coords.length);
}

// Normalizes values in the range "min to max" to "1 to zero"
function reverseNormalize(
  value: number,
  minValue: number,
  maxValue: number,
): number {
  // Ensure the value is within the valid range [minValue, maxValue]
  const clampedValue = Math.min(Math.max(value, minValue), maxValue);

  // Reverse map the clamped value to the range [0, 1] and return
  return 1 - (clampedValue - minValue) / (maxValue - minValue);
}
