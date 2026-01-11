import { Router } from 'express';
import { WalletController } from '../controllers/wallet.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, WalletController.getWallet);
router.post('/add-funds', authMiddleware, WalletController.addFunds);

export default router;
