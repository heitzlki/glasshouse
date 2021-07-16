import { model } from 'mongoose';
import { IBoardDocument } from '@models/board/board.types';
import BoardSchema from '@models/board/board.schema';

export const BoardModel = model<IBoardDocument>('board', BoardSchema);
