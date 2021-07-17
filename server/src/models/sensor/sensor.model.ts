import { model } from 'mongoose';
import { ISensorDocument } from '@models/sensor/sensor.types';
import SensorSchema from '@models/sensor/sensor.schema';

export const SensorModel = model<ISensorDocument>('sensor', SensorSchema);
