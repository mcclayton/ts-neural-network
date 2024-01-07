import { Controller } from './Controller';

export type SensorCoordinate = {
  x: number;
  y: number;
};

export class LineOfSightSensor {
  /**
   * Looks in all directions and provides sensor readings between
   * 0 - 1, where 1 means an obstacle is right ahead in the given direction
   * and 0 means the sensor does not detect an obstacle.
   */
  static getSensorValues(x: number, y: number, controller: Controller) {
    const { forward, right, backward, left } = this.getSensorCoordinates(x, y);

    // Sensor values as array corresponding to directions
    return {
      forward: this.getSensorValue(controller, forward),
      right: this.getSensorValue(controller, right),
      backward: this.getSensorValue(controller, backward),
      left: this.getSensorValue(controller, left),
    };
  }

  static getSensorCoordinates(x: number, y: number) {
    const forward: SensorCoordinate[] = [
      { x, y: y - 1 },
      { x, y: y - 2 },
      { x, y: y - 3 },
      { x, y: y - 4 },
      { x, y: y - 5 },
    ];
    const right: SensorCoordinate[] = [
      { x: x + 1, y },
      { x: x + 2, y },
      { x: x + 3, y },
      { x: x + 4, y },
      { x: x + 5, y },
    ];
    const backward: SensorCoordinate[] = [
      { x, y: y + 1 },
      { x, y: y + 2 },
      { x, y: y + 3 },
      { x, y: y + 4 },
      { x, y: y + 5 },
    ];
    const left: SensorCoordinate[] = [
      { x: x - 1, y },
      { x: x - 2, y },
      { x: x - 3, y },
      { x: x - 4, y },
      { x: x - 5, y },
    ];

    return { forward, right, backward, left };
  }

  private static getSensorValue(
    controller: Controller,
    sensorCoords: SensorCoordinate[],
  ) {
    for (let i = 0; i < sensorCoords.length; i++) {
      const { x, y } = sensorCoords[i];
      if (controller.isCollisionAt(x, y)) {
        // The closer we detect a collision, the closer the value should be to 1
        return 1 - i * (1 / sensorCoords.length);
      }
    }
    // If we don't see any collisions, the sensor returns 0
    return 0;
  }
}
