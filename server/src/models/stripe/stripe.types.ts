import { Document, Model } from 'mongoose';
export interface IStripe {
  timestamp: Date;
  state: string;
  manually: string;
}
export interface IStripeDocument extends IStripe, Document {}
export interface IStripeModel extends Model<IStripeDocument> {}
