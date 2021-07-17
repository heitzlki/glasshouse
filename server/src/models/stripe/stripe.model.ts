import { model } from 'mongoose';
import { IStripeDocument } from '@models/stripe/stripe.types';
import StripeSchema from '@models/stripe/stripe.schema';

export const StripeModel = model<IStripeDocument>('sensor', StripeSchema);
