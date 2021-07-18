import app from '@index';

// import cron from 'node-cron';
import moment from 'moment';
import { Pin as JohnnyFivePin } from 'johnny-five';

import { BoardModel } from '@models/board/board.model';
import { IBoardDocument } from '@models/board/board.types';

import { eventType } from '@Socket';

export default class Stripe {
  constructor(
    public stripePin: number,
    public currentBoard?: IBoardDocument,
    public stripe: JohnnyFivePin = new JohnnyFivePin(stripePin)
  ) {}

  async setStripe(
    activate: boolean = false,
    event: eventType = 'stripe',
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
}
