import openInWeb from 'open';

import Server from './Server';
import Board from './Board';
import Socket from './Socket';

export default class App {
  constructor(
    public server: Server = new Server(),
    public board: Board = new Board(),
    public socket: Socket = new Socket()
  ) {
    this.server = server;
    this.board = board;
    this.socket = socket;
  }

  startServer() {
    this.server.init();
    this.server.start();
  }

  startSocket() {
    this.socket.init();
  }

  startBoard() {
    this.board.init();
  }

  start() {
    this.startServer();
    this.startSocket();
    this.startBoard();
  }

  async open() {
    await openInWeb(`http://${process.env.HOST}:${process.env.PORT}`);
  }
}
