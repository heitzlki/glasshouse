import app from '@index';

import chalk from 'chalk';
import cron from 'node-cron';
import moment from 'moment';
import { Board as JohnnyFiveBoard, Pin, Sensor } from 'johnny-five';

import { BoardModel } from '@models/board/board.model';
import { IBoardDocument } from '@models/board/board.types';
import { SensorModel } from '@models/sensor/sensor.model';
import { PumpModel } from '@models/pump/pump.model';

import reMap from '@utils/reMap';

export type optionsType = {
  id?: number | string;
  port?: string | object;
  repl?: boolean;
  debug?: boolean;
  timeout?: number;
};

export type pinsType = {
  sensor: number | string;
  stripe: number;
  pump: number;
};

export default class Board {
  constructor(
    public board?: JohnnyFiveBoard,
    public options?: optionsType,
    public pins: pinsType = {
      sensor: 'A0',
      stripe: 12,
      pump: 13,
    },
    public sensor?: Sensor,
    public stripe?: Pin,
    public pump?: Pin,
    public sensorInterval: number = 3000,
    public previousBoard?: IBoardDocument,
    public currentBoard?: IBoardDocument
  ) {}

  init() {
    this.board = new JohnnyFiveBoard();
  }

  async ready() {
    if (this.board) {
      this.board.on('ready', () => {
        if (this.board && process.env.NODE_ENV !== 'test') {
          console.log(
            chalk.green(
              `[*] Board is ${chalk.underline(
                this.board.isReady ? 'ready' : 'not ready'
              )} on ${chalk.underline(this.board.port)}`
            )
          );

          this.sensor = new Sensor(this.pins.sensor);
          this.stripe = new Pin(this.pins.stripe);
          this.pump = new Pin(this.pins.pump);
        }
      });
    }

    let boardsInDatabase = await BoardModel.find({});

    this.previousBoard = boardsInDatabase[boardsInDatabase.length - 1];
  }

  async setupDatabase() {
    if (this.board) {
      this.board.on('ready', async () => {
        if (this.previousBoard) {
          this.currentBoard = await BoardModel.create({
            status: {
              connected: this.board?.isReady || false,
              port: this.board?.port || '',
            },
            sensor: {
              connected: this.sensor?.id ? true : false,
              pin: String(this.sensor?.pin) || '',
              interval: this.previousBoard.sensor.interval,
            },
            pump: {
              connected: this.pump?.id ? true : false,
              pin: String(this.pump?.pin || ''),
              active: this.pump?.value ? true : false,
              sensor: this.previousBoard.pump.sensor,
              refill: this.previousBoard.pump.refill,
              schedule: this.previousBoard.pump.schedule,
            },
            stripe: {
              connected: this.stripe?.id ? true : false,
              pin: String(this.stripe?.pin || ''),
              active: this.stripe?.value ? true : false,
              schedule: this.previousBoard.stripe.schedule,
            },
          });
        } else {
          this.currentBoard = await BoardModel.create({
            status: {
              connected: this.board?.isReady || false,
              port: this.board?.port || '',
            },
            sensor: {
              connected: this.sensor?.id ? true : false,
              pin: String(this.sensor?.pin || ''),
            },
            pump: {
              connected: this.pump?.id ? true : false,
              pin: String(this.pump?.pin || ''),
              active: this.pump?.value ? true : false,
            },
            stripe: {
              connected: this.stripe?.id ? true : false,
              pin: String(this.stripe?.pin || ''),
              active: this.stripe?.value ? true : false,
            },
          });
        }
      });
    }
  }

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

  async setStripe(
    activate: boolean = false,
    event: string = 'stripe',
    message: string = 'stopped stripe'
  ) {
    if (this.stripe) {
      activate ? this.stripe.high() : this.stripe.low();
    }

    if (app.socket.io) {
      app.socket.io.send(event, message);
    }

    if (this.currentBoard) {
      this.currentBoard =
        (await BoardModel.findOneAndUpdate(
          {
            _id: this.currentBoard._id,
          },
          {
            $set: {
              'stripe.active': activate,
            },
          },
          { new: true }
        )) || this.currentBoard;
    }
  }

  stripeSchedule() {
    // Checks every 5 sec if the stripe needs to be activated
    setInterval(() => {
      if (this.currentBoard && this.currentBoard.stripe.schedule.active) {
        let timeFormat = 'HH:mm:ss';
        let isBetween = moment().isBetween(
          moment(this.currentBoard?.stripe.schedule.from, timeFormat),
          moment(this.currentBoard?.stripe.schedule.to, timeFormat)
        );

        if (isBetween) {
          this.setStripe(true, 'stripe', 'started stripe');
        } else {
          this.setStripe(); // disables the stripe by default
        }
      }
    }, 5000);
    // Checks every minute if the stripe needs to be activated
    // cron.schedule('* * * * *', async () => {

    // });
  }

  async setPump(
    activate: boolean = false,
    event: string = 'pump',
    message: string = 'stopped pump'
  ) {
    if (this.pump) {
      activate ? this.pump.high() : this.pump.low();
    }

    if (app.socket.io) {
      app.socket.io.send(event, message);
    }

    if (this.currentBoard) {
      this.currentBoard =
        (await BoardModel.findOneAndUpdate(
          {
            _id: this.currentBoard._id,
          },
          {
            $set: {
              'pump.active': activate,
            },
          },
          { new: true }
        )) || this.currentBoard;
    }
  }

  pumpSchedule() {
    if (this.currentBoard && this.currentBoard.pump.schedule.active) {
      cron.schedule(this.currentBoard.pump.schedule.cron, () => {
        this.setPump(true, 'pump', 'started pump');

        if (this.currentBoard)
          setTimeout(
            this.setPump, // disables the pump by default
            Number(this.currentBoard.pump.schedule.duration)
          );
      });
    }
  }

  activatePump() {
    // Checks every 5 sec if the pump needs to be activated
    setInterval(async () => {
      if (this.currentBoard && this.currentBoard.pump.sensor.active) {
        let sensorData = await SensorModel.find({
          timestamp: {
            $gte:
              new Date().getTime() - this.currentBoard.pump.sensor.average.for,
          },
        });

        let sensorAverage = Number(
          (
            sensorData.reduce(
              (sum: number, data: { timestamp: Date; humidity: number }) => {
                return sum + Number(data.humidity);
              },
              0
            ) / sensorData.length
          ).toFixed(0)
        );

        if (sensorAverage < this.currentBoard.pump.sensor.average.value) {
          this.setPump(true, 'pump', 'started pump');

          if (this.currentBoard) {
            setTimeout(
              this.setPump,
              Number(this.currentBoard.pump.schedule.duration)
            );
          }
        }
      }
    }, 5000);

    // Checks every minute if the pump needs to be activated
    // cron.schedule('* * * * *', async () => {

    // });
  }

  async deleteData() {
    await BoardModel.deleteMany({});
    await PumpModel.deleteMany({});
    await SensorModel.deleteMany({});
  }
}
