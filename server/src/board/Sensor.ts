import app from '@index';

import { Sensor as JohnnyFiveSensor } from 'johnny-five';

import { BoardModel } from '@models/board/board.model';
import { IBoardDocument } from '@models/board/board.types';
import { SensorModel } from '@models/sensor/sensor.model';

import reMap from '@utils/reMap';

export default class Sensor {
  constructor(
    public sensorPin: number | string,
    public currentBoard?: IBoardDocument,
    public sensor: JohnnyFiveSensor = new JohnnyFiveSensor(sensorPin),
    public sensorInterval: number = 3000
  ) {}

  reMapSensorData(value: number) {
    /**
     * * reMap Sensor data explanation:
     * * https://www.arduinoplatform.com/arduino-sensors/detecting-moisture-with-soil-moisture-sensor-and-arduino/
     *
     * * Custom values:
     * * Air: 800
     * * Water: 355
     */
    if (this.currentBoard) {
      return reMap(
        value,
        this.currentBoard.sensor.calibration.air, // replace the value with value when placed in air
        this.currentBoard.sensor.calibration.water, // replace the value with value when placed in water
        0,
        100
      ).toFixed(0);
    }
  }

  async storeSensor() {
    let sensorIntervalDB = await BoardModel.findOne({ sort: { _id: -1 } });
    this.sensorInterval = sensorIntervalDB
      ? sensorIntervalDB.sensor.interval
      : this.sensorInterval;

    setInterval(async () => {
      if (this.sensor && app.socket.io) {
        let valueInPercent = this.reMapSensorData(this.sensor.value);
        app.socket.send('sensor', valueInPercent);
        await SensorModel.create({
          humidity: valueInPercent,
        });
      }
    }, this.sensorInterval);
  }
}
