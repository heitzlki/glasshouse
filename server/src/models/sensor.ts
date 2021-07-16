import mongoose, { Schema } from 'mongoose';

const sensorLogSchema = new Schema({
  timestamp: { type: Date, default: new Date() },
  humidity: Number,
});

const SensorLog = mongoose.model('SensorLog', sensorLogSchema);

export default SensorLog;
