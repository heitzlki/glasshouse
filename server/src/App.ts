import openInWeb from 'open';

import Server from './Server';
import Database from './Database';
import Board from './Board';
import Socket from './Socket';

export default class App {
  constructor(
    public server: Server = new Server(),
    public database: Database = new Database(),
    public board: Board = new Board(),
    public socket: Socket = new Socket()
  ) {}

  startServer() {
    this.server.init();
    this.server.start();
  }

  startDatabase() {
    this.database.init();
  }

  startSocket() {
    this.socket.init();
  }

  startBoard() {
    this.board.init();
    this.board.ready()
  }

  start() {
    this.startServer();
    this.startDatabase();
    this.startSocket();
    this.startBoard();
  }

  async open() {
    await openInWeb(`http://${process.env.HOST}:${process.env.PORT}`);
  }
}
