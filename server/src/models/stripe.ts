import mongoose, { Schema } from 'mongoose';

const stripeLogSchema = new Schema({
  timestamp: Date,
  state: String,
  manually: Boolean,
});

const StripeLog = mongoose.model('StripeLog', stripeLogSchema);

export default StripeLog;
