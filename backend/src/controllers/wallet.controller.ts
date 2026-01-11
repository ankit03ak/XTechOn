import { Response } from 'express';
import Wallet from '../models/Wallet';
import { AuthRequest } from '../middleware/auth.middleware';

export class WalletController {
  static async getWallet(req: AuthRequest, res: Response): Promise<void> {
    try {
      const wallet = await Wallet.findOne({ userId: req.userId });

      if (!wallet) {
        res.status(404).json({ error: 'Wallet not found' });
        return;
      }

      res.json({
        balance: wallet.balance,
        transactions: wallet.transactions.sort((a, b) => 
          b.timestamp.getTime() - a.timestamp.getTime()
        ),
      });
    } catch (error) {
      console.error('Get wallet error:', error);
      res.status(500).json({ error: 'Failed to get wallet' });
    }
  }

  static async addFunds(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        res.status(400).json({ error: 'Invalid amount' });
        return;
      }

      const wallet = await Wallet.findOne({ userId: req.userId });

      if (!wallet) {
        res.status(404).json({ error: 'Wallet not found' });
        return;
      }

      wallet.balance += amount;
      wallet.transactions.push({
        type: 'credit',
        amount,
        description: 'Funds added to wallet',
        timestamp: new Date(),
      });

      await wallet.save();

      res.json({
        message: 'Funds added successfully',
        balance: wallet.balance,
      });
    } catch (error) {
      console.error('Add funds error:', error);
      res.status(500).json({ error: 'Failed to add funds' });
    }
  }
}
