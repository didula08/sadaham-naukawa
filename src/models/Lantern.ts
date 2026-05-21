import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILantern extends Document {
  title: string;
  description: string;
  videoUrl: string;
  creatorName: string;
  likeCount: number;
  createdAt: Date;
}

const LanternSchema: Schema<ILantern> = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
  creatorName: { type: String, required: true },
  likeCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const Lantern: Model<ILantern> = mongoose.models.Lantern || mongoose.model<ILantern>('Lantern', LanternSchema);
