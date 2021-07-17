import { Document, Model } from 'mongoose';
export interface IPump {
  timestamp: Date;
  state: string;
  manually: boolean;
  humidity: {
    current: number;
    average: {
      from: string;
      to: string;
      value: number;
    };
  };
}
export interface IPumpDocument extends IPump, Document {}
export interface IPumpdModel extends Model<IPumpDocument> {}
