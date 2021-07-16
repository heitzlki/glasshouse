import mongoose, { Mongoose } from 'mongoose';
import chalk from 'chalk';

export default class Database {
  constructor(
    public db: Mongoose = mongoose,
    public connection: mongoose.Connection = mongoose.connection,
    public options: mongoose.ConnectOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  ) {}

  init() {
    this.db.connect(String(process.env.DB_CONNECT), this.options);
    this.connection.on('error', (err) => {
      throw new Error(
        chalk.red(`[/] Could not connect to database") \n ${err}`)
      );
    });

    this.connection.once('open', () => {
      console.log(chalk.green(`[*] Connected to database`));
    });
  }
}
