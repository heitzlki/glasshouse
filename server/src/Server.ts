import { GraphQLServer, Options } from 'graphql-yoga';
import chalk from 'chalk';

import { genSchema } from '@utils/genSchema';
// import { authMiddleware } from './utils/authMiddleware';

export default class Server {
  constructor(
    public server?: GraphQLServer,
    public cors: { credentials: boolean; origin: string } = {
      credentials: true,
      origin:
        process.env.NODE_ENV === 'dev'
          ? '*'
          : `http://${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}/`,
    },
    public options: Options = {
      cors: cors,
      port: process.env.PORT,
      endpoint: '/graphql',
      subscriptions: '/subscriptions',
      playground: '/playground',
    }
  ) {}

  init() {
    this.server = new GraphQLServer({
      // middlewares: [authMiddleware],
      schema: genSchema(),
      context: (ctx) => ctx,
    });
  }

  start() {
    if (this.server) {
      this.server.start(this.options ? this.options : {}, () => {
        if (process.env.NODE_ENV !== 'test') {
          console.log(
            chalk.green(
              `[*] Started server in ${chalk.underline(
                process.env.NODE_ENV
              )} mode at ${chalk.underline(
                `http://${process.env.HOST}:${process.env.PORT}`
              )}`
            )
          );
        }
      });
    }
  }
}
