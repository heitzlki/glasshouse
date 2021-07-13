import chalk from "chalk";
import { Board as JohnnyFiveBoard, Pin, Sensor } from "johnny-five";

export type optionsType = {
  id?: number | string;
  port?: string | object;
  repl?: boolean;
  debug?: boolean;
  timeout?: number;
};

export type pinsType = {
  sensor: string | number;
  stripe: string | number;
  pump: string | number;
};

export default class Board {
  constructor(
    public board?: JohnnyFiveBoard,
    public options?: optionsType,
    public pins: pinsType = {
      sensor: "A1",
      stripe: 12,
      pump: 13,
    },
    public sensor?: Sensor,
    public stripe?: Pin,
    public pump?: Pin
  ) {}

  init() {
    this.board = new JohnnyFiveBoard();
  }

  ready() {
    if (this.board) {
      this.board.on("ready", () => {
        if (this.board && process.env.NODE_ENV !== "test") {
          console.log(
            chalk.green(
              `[*] Board is ${chalk.underline(
                this.board.isReady ? "ready" : "not ready"
              )} on ${chalk.underline(this.board.port)}`
            )
          );

          this.sensor = new Sensor(this.pins.sensor);
          this.stripe = new Pin(this.pins.stripe);
          this.pump = new Pin(this.pins.pump);

          // console.log(this.board.pins);
          // if (board && board.register) {
          //   console.log(board.register[0].pin);
          // }
        }
      });
    }
  }
}
