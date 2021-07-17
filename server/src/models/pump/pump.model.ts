import { model } from 'mongoose';
import { IPumpDocument } from '@models/pump/pump.types';
import PumpSchema from '@models/pump/pump.schema';

export const PumpModel = model<IPumpDocument>('pump', PumpSchema);
