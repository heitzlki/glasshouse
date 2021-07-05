// import { startServer } from './startServer';
// startServer();

import { GraphQLServer } from 'graphql-yoga';
import { Board, Pin, Sensor } from 'johnny-five';
import * as socketio from 'socket.io';

const board: any = new Board();
let led: any;
let sensor: Sensor;
let ledState: boolean = false;

board.on('ready', () => {
  // led = new Pin(13);
  // sensor = new Sensor('A0');

  // console.log(board.isReady);
  // console.log(board.port);
  // console.log(board.pins);

  if (board && board.register) {
    console.log(board.register[0].pin);
  }
});

const typeDefs = `
  type Query {
    default: Boolean
  },
  type Mutation {
    led: Boolean!
  }
`;

const resolvers = {
  Query: {
    default: () => {
      return false;
    },
  },
  Mutation: {
    led: () => {
      if (led && ledState !== true) {
        led.high();
        ledState = true;
        return true;
      } else {
        led?.low();
        ledState = false;
        return false;
      }
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
const io: socketio.Server = new socketio.Server();

io.attach(5000, {
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
});

io.use((socket: any, next) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    console.log('[handshake-token]', socket.handshake.query.token);
    if (socket.handshake.query.token !== 'SECRET_KEY')
      return next(new Error('Authentication error'));
    next();
  } else {
    next(new Error('Authentication error'));
  }
}).on('connection', (socket: socketio.Socket) => {
  console.log('[client] connected');
  socket.emit('status', 'success');

  setInterval(() => {
    if (sensor) {
      socket.emit('sensor', sensor.value);
    }
  }, 1000);

  socket.on('disconnect', () => {
    console.log('[client] disconnected');
  });
});

server.start(() =>
  console.log('[graphql] server is running on http://localhost:4000/')
);
