import Flight from '../models/Flight';

export interface PricingResult {
  currentPrice: number;
  isSurgeActive: boolean;
  surgePercentage: number;
  timeUntilReset?: number; // in milliseconds
}

export class PricingService {
  static async calculatePrice(flightId: string): Promise<PricingResult> {
    const flight = await Flight.findById(flightId);
    
    if (!flight) {
      throw new Error('Flight not found');
    }

    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

    flight.booking_attempts = flight.booking_attempts.filter(
      (attempt) => attempt.timestamp > tenMinutesAgo
    );

    const recentBookings = flight.booking_attempts.filter(
      (attempt) => attempt.timestamp > fiveMinutesAgo
    );

    let currentPrice = flight.base_price;
    let isSurgeActive = false;
    let surgePercentage = 0;
    let timeUntilReset: number | undefined;

    if (recentBookings.length >= 3) {
      surgePercentage = 10;
      currentPrice = flight.base_price * 1.1; // 10% increase
      isSurgeActive = true;

      const oldestBooking = recentBookings[0].timestamp;
      const resetTime = new Date(oldestBooking.getTime() + 10 * 60 * 1000);
      timeUntilReset = resetTime.getTime() - now.getTime();
    }

    await flight.save();

    return {
      currentPrice: Math.round(currentPrice),
      isSurgeActive,
      surgePercentage,
      timeUntilReset: timeUntilReset && timeUntilReset > 0 ? timeUntilReset : undefined,
    };
  }

  static async recordBookingAttempt(flightId: string): Promise<void> {
    const flight = await Flight.findById(flightId);
    
    if (!flight) {
      throw new Error('Flight not found');
    }

    flight.booking_attempts.push({ timestamp: new Date() });
    await flight.save();
  }
}
