import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, BookingController.createBooking);
router.get('/history', authMiddleware, BookingController.getBookingHistory);
router.get('/:id', authMiddleware, BookingController.getBookingById);

export default router;
