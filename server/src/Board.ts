import chalk from 'chalk';
import { Board as JohnnyFiveBoard, Pin, Sensor } from 'johnny-five';

export type optionsType = {
  id?: number | string;
  port?: string | object;
  repl?: boolean;
  debug?: boolean;
  timeout?: number;
};

export default class Board {
  public board?: JohnnyFiveBoard;
  public options?: optionsType;

  constructor(board?: JohnnyFiveBoard, options?: optionsType) {
    this.board = board;
    this.options = options;
  }

  init() {
    this.board = new JohnnyFiveBoard();
  }

  ready() {
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

          // led = new Pin(13);
          // sensor = new Sensor('A0');

          // console.log(this.board.pins);
          // if (board && board.register) {
          //   console.log(board.register[0].pin);
          // }
        }
      });
    }
  }
}
