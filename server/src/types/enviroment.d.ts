export interface IProcessEnv {
  PORT: number;
  HOST: string;
  CLIENT_HOST: string;
  CLIENT_PORT: string;
  IO_PORT: number;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends IProcessEnv {}
  }
}
