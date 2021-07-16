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

  initServer() {
    this.server.init();
    this.server.start();
  }

  initDatabase() {
    this.database.init();
  }

  initSocket() {
    this.socket.init();
  }

  initBoard() {
    this.board.init();
    this.board.ready();
  }

  startBoard() {
    this.board.setupDatabase();
    this.board.storeSensor();
    this.board.stripeSchedule();
    this.board.activatePump();
  }

  init() {
    this.initServer();
    this.initDatabase();
    this.initSocket();
    this.initBoard();
  }

  start() {
    // this.board.deleteData();
    this.startBoard();
  }

  async open() {
    await openInWeb(`http://${process.env.HOST}:${process.env.PORT}`);
  }
}
