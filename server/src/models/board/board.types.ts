import { Document, Model } from 'mongoose';
export interface IBoard {
  timestamp: Date;
  status: {
    connected: boolean;
    port: string;
  };
  sensor: {
    connected: boolean;
    pin: string;
    interval: number;
    calibration: {
      air: number;
      water: number;
    };
  };
  pump: {
    connected: boolean;
    pin: string;
    active: boolean;
    sensor: {
      active: boolean;
      average: {
        value: number;
        for: number;
      };
    };
    refill: {
      active: boolean;
      average: {
        value: number;
        for: number;
      };
    };
    schedule: {
      active: boolean;
      cron: string;
      duration: string;
    };
  };
  stripe: {
    connected: boolean;
    pin: string;
    active: boolean;
    schedule: {
      active: boolean;
      from: Date;
      to: Date;
    };
  };
}
export interface IBoardDocument extends IBoard, Document {}
export interface IBoardModel extends Model<IBoardDocument> {}
