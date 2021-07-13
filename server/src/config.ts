// * Inspired by https://stackoverflow.com/a/56666712
import { config as configDotenv } from 'dotenv';
import { resolve } from 'path';
import chalk from 'chalk';

switch (process.env.NODE_ENV) {
  case 'dev':
    console.log(chalk.blue(`Environment is ${chalk.bold(`development`)}`));
    configDotenv({
      path: resolve(__dirname, '../.env.dev'),
    });
    break;
  case 'test':
    configDotenv({
      path: resolve(__dirname, '../.env.test'),
    });
    break;
  default:
    throw new Error(
      chalk.red.bold(`'NODE_ENV' ${process.env.NODE_ENV} is not handled!`)
    );
}

const throwIfNot = <T, K extends keyof T>(
  obj: Partial<T>,
  prop: K,
  msg?: string
): T[K] => {
  if (obj[prop] === undefined || obj[prop] === null) {
    throw new Error(
      msg || chalk.red(`Environment is missing variable ${prop}`)
    );
  } else {
    return obj[prop] as T[K];
  }
};

// Validate that we have our expected ENV variables defined!
['PORT', 'HOST', 'CLIENT_PORT', 'CLIENT_HOST', 'IO_PORT', 'DB_CONNECT'].forEach(
  (v) => {
    throwIfNot(process.env, v);
  }
);
