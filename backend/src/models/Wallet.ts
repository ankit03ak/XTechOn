import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction {
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  timestamp: Date;
}

export interface IWallet extends Document {
  userId: mongoose.Types.ObjectId;
  balance: number;
  transactions: ITransaction[];
  createdAt: Date;
}

const WalletSchema = new Schema<IWallet>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    default: 50000,
    min: 0,
  },
  transactions: [{
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

export default mongoose.model<IWallet>('Wallet', WalletSchema);
