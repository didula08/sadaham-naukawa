import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILike extends Document {
  lanternId: mongoose.Types.ObjectId;
  voterIp: string;
  createdAt: Date;
}

const LikeSchema: Schema<ILike> = new Schema({
  lanternId: { type: Schema.Types.ObjectId, ref: 'Lantern', required: true },
  voterIp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Compound index to ensure one like per IP per lantern
LikeSchema.index({ lanternId: 1, voterIp: 1 }, { unique: true });

export const Like: Model<ILike> = mongoose.models.Like || mongoose.model<ILike>('Like', LikeSchema);
