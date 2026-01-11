import { Response } from 'express';
import Booking from '../models/Booking';
import Flight from '../models/Flight';
import Wallet from '../models/Wallet';
import { PricingService } from '../services/pricing.service';
import { AuthRequest } from '../middleware/auth.middleware';

function generatePNR(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pnr = '';
  for (let i = 0; i < 6; i++) {
    pnr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pnr;
}

export class BookingController {
  static async createBooking(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { flightId, passenger_name } = req.body;

      if (!flightId || !passenger_name) {
        res.status(400).json({ error: 'Flight ID and passenger name are required' });
        return;
      }

      const flight = await Flight.findById(flightId);
      if (!flight) {
        res.status(404).json({ error: 'Flight not found' });
        return;
      }

      const pricing = await PricingService.calculatePrice(flightId);
      const finalPrice = pricing.currentPrice;

      const wallet = await Wallet.findOne({ userId: req.userId });
      if (!wallet) {
        res.status(404).json({ error: 'Wallet not found' });
        return;
      }

      if (wallet.balance < finalPrice) {
        res.status(400).json({ 
          error: 'Insufficient wallet balance',
          required: finalPrice,
          available: wallet.balance,
        });
        return;
      }

      let pnr = generatePNR();
      let existingBooking = await Booking.findOne({ pnr });
      
      while (existingBooking) {
        pnr = generatePNR();
        existingBooking = await Booking.findOne({ pnr });
      }

      const booking = new Booking({
        userId: req.userId,
        flightId: flight._id,
        passenger_name,
        final_price: finalPrice,
        pnr,
        flight_details: {
          flight_id: flight.flight_id,
          airline: flight.airline,
          departure_city: flight.departure_city,
          arrival_city: flight.arrival_city,
          departure_time: flight.departure_time,
          arrival_time: flight.arrival_time,
        },
      });

      await booking.save();

      wallet.balance -= finalPrice;
      wallet.transactions.push({
        type: 'debit',
        amount: finalPrice,
        description: `Flight booking - ${flight.flight_id} (${flight.departure_city} → ${flight.arrival_city})`,
        timestamp: new Date(),
      });

      await wallet.save();

      await PricingService.recordBookingAttempt(flightId);

      res.status(201).json({
        message: 'Booking successful',
        booking: {
          _id: booking._id,
          pnr: booking.pnr,
          passenger_name: booking.passenger_name,
          final_price: booking.final_price,
          booking_date: booking.booking_date,
          flight_details: booking.flight_details,
        },
        wallet_balance: wallet.balance,
      });
    } catch (error) {
      console.error('Create booking error:', error);
      res.status(500).json({ error: 'Failed to create booking' });
    }
  }

  static async getBookingHistory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const bookings = await Booking.find({ userId: req.userId })
        .sort({ booking_date: -1 });

      res.json({
        bookings,
        count: bookings.length,
      });
    } catch (error) {
      console.error('Get booking history error:', error);
      res.status(500).json({ error: 'Failed to get booking history' });
    }
  }

  static async getBookingById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const booking = await Booking.findOne({ 
        _id: id, 
        userId: req.userId 
      });

      if (!booking) {
        res.status(404).json({ error: 'Booking not found' });
        return;
      }

      res.json({ booking });
    } catch (error) {
      console.error('Get booking error:', error);
      res.status(500).json({ error: 'Failed to get booking' });
    }
  }
}
