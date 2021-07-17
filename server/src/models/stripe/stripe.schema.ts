import { Schema } from 'mongoose';

const StripeSchema = new Schema({
  timestamp: Date,
  state: String,
  manually: Boolean,
});

export default StripeSchema;
