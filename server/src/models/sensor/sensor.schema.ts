import { Schema } from 'mongoose';

const SensorSchema = new Schema({
  timestamp: { type: Date, default: new Date() },
  humidity: Number,
});

export default SensorSchema;
