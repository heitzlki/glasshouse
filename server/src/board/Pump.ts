import app from '@index';

import cron from 'node-cron';
import { Pin as JohnnyFivePin } from 'johnny-five';

import { BoardModel } from '@models/board/board.model';
import { IBoardDocument } from '@models/board/board.types';
import { SensorModel } from '@models/sensor/sensor.model';

import { eventType } from '@Socket';

export default class Pump {
  constructor(
    public pumpPin: number,
    public currentBoard?: IBoardDocument,
    public pump: JohnnyFivePin = new JohnnyFivePin(pumpPin)
  ) {}

  async setPump(
    activate: boolean = false,
    event: eventType = 'pump',
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
}
