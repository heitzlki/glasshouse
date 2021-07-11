import { Server } from 'socket.io';
import chalk from 'chalk';

type methodsType = 'GET' | 'HEAD' | 'POST';

type corsType = {
  origin: string;
  methods: Array<methodsType>;
};

export default class Socket {
  public io?: Server;
  public cors?: corsType = {
    origin: '*',
    methods: ['GET', 'POST'],
  };

  constructor(io?: Server, cors?: corsType) {
    this.io = io;
    this.cors = cors;
  }

  init() {
    this.io = new Server({ cors: this.cors });

    this.io.attach(Number(process.env.IO_PORT), {
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
    });

    if (this.io && process.env.NODE_ENV !== 'test') {
      console.log(chalk.green(`[*] Started socket`));
    }

    // this.io.use((socket, next) => {
    //   if (socket.handshake.query && socket.handshake.query.token) {
    //     if (socket.handshake.query.token !== 'SECRET_KEY')
    //       return next(new Error('Authentication error'));
    //     next();
    //   } else {
    //     next(new Error('Authentication error'));
    //   }
    // });
  }
  connection() {
    if (this.io) {
      this.io.on('connection', (socket) => {
        if (this.io && process.env.NODE_ENV !== 'test') {
          console.log(chalk.green(`[*] Socket connected`));

          socket.on('disconnect', () => {
            console.log(chalk.red(`[/] Socket disconnected`));
          });
        }
      });
    }
  }

  send(event: string, message: any) {
    if (this.io) {
      this.io.on('connection', (socket) => {
        if (this.io) {
          socket.emit(event, message);
        }
      });
    }
  }

  receive(event: string) {
    if (this.io) {
      this.io.on('connection', (socket) => {
        socket.on(event, (arg) => {
          return arg;
        });
      });
    }
  }
}
