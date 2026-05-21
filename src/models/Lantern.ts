import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILantern extends Document {
  title: string;
  description: string;
  videoUrl: string;
  creatorName: string;
  likeCount: number;
  bankAccountName: string;
  bankName: string;
  bankBranch: string;
  bankAccountNumber: string;
  receiptImage?: string;
  isApproved: boolean;
  isWinner: boolean;
  createdAt: Date;
}

const LanternSchema: Schema<ILantern> = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
  creatorName: { type: String, required: true },
  likeCount: { type: Number, default: 0 },
  bankAccountName: { type: String, required: true },
  bankName: { type: String, required: true },
  bankBranch: { type: String, required: true },
  bankAccountNumber: { type: String, required: true },
  receiptImage: { type: String, required: false },
  isApproved: { type: Boolean, default: false },
  isWinner: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

if (mongoose.models && mongoose.models.Lantern) {
  delete (mongoose.models as any).Lantern;
}

export const Lantern: Model<ILantern> = mongoose.model<ILantern>('Lantern', LanternSchema);

