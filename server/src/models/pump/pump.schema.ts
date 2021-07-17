import { Schema } from 'mongoose';

const PumpSchema = new Schema({
  timestamp: { type: Date, default: new Date() },
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

export default PumpSchema;
