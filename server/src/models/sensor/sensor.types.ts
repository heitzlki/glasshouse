import { Document, Model } from 'mongoose';
export interface ISensor {
  timestamp: any; // TODO fix type Date | number issue in src/Board l. 266 & 273
  humidity: number;
}
export interface ISensorDocument extends ISensor, Document {}
export interface ISensorModel extends Model<ISensorDocument> {}
