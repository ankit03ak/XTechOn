import { Router } from 'express';
import { FlightController } from '../controllers/flight.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/search', authMiddleware, FlightController.searchFlights);
router.get('/cities', authMiddleware, FlightController.getCities);
router.get('/:id', authMiddleware, FlightController.getFlightById);

export default router;
