import chalk from 'chalk';
import { Board as JohnnyFiveBoard } from 'johnny-five';

import { BoardModel } from '@models/board/board.model';
import { IBoardDocument } from '@models/board/board.types';
import { SensorModel } from '@models/sensor/sensor.model';
import { PumpModel } from '@models/pump/pump.model';

import Sensor from '@board/Sensor';
import Stripe from '@board/Stripe';
import Pump from '@board/Pump';

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
    public stripe?: Stripe,
    public pump?: Pump,

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

          this.sensor = new Sensor(this.pins.sensor, this.currentBoard);
          this.stripe = new Stripe(this.pins.stripe, this.currentBoard);
          this.pump = new Pump(this.pins.pump, this.currentBoard);
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
              connected: this.sensor?.sensor.id ? true : false,
              pin: String(this.sensor?.sensor.pin) || '',
              interval: this.previousBoard.sensor.interval,
            },
            pump: {
              connected: this.pump?.pump.id ? true : false,
              pin: String(this.pump?.pump.pin || ''),
              active: this.pump?.pump.value ? true : false,
              sensor: this.previousBoard.pump.sensor,
              refill: this.previousBoard.pump.refill,
              schedule: this.previousBoard.pump.schedule,
            },
            stripe: {
              connected: this.stripe?.stripe.id ? true : false,
              pin: String(this.stripe?.stripe.pin || ''),
              active: this.stripe?.stripe.value ? true : false,
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
              connected: this.sensor?.sensor.id ? true : false,
              pin: String(this.sensor?.sensor.pin || ''),
            },
            pump: {
              connected: this.pump?.pump.id ? true : false,
              pin: String(this.pump?.pump.pin || ''),
              active: this.pump?.pump.value ? true : false,
            },
            stripe: {
              connected: this.stripe?.stripe.id ? true : false,
              pin: String(this.stripe?.stripe.pin || ''),
              active: this.stripe?.stripe.value ? true : false,
            },
          });
        }
      });
    }
  }

  async deleteData() {
    await BoardModel.deleteMany({});
    await PumpModel.deleteMany({});
    await SensorModel.deleteMany({});
  }
}
