import mongoose, { Schema } from 'mongoose';

const pumpLogSchema = new Schema({
  timestamp: Date,
  state: String,
  manually: Boolean,
  humidity: {
    current: Number,
    average: {
      from: String,
      to: String,
      value: Number,
    },
  },
});

const PumpLog = mongoose.model('PumpLog', pumpLogSchema);

export default PumpLog;
