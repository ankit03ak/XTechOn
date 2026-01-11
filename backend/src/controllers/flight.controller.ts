import { Response } from 'express';
import Flight from '../models/Flight';
import { PricingService } from '../services/pricing.service';
import { AuthRequest } from '../middleware/auth.middleware';

export class FlightController {
  static async searchFlights(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { 
        departure_city, 
        arrival_city, 
        sort_by = 'base_price',
        sort_order = 'asc' 
      } = req.query;

      const query: any = {};
      
      if (departure_city) {
        query.departure_city = new RegExp(departure_city as string, 'i');
      }
      
      if (arrival_city) {
        query.arrival_city = new RegExp(arrival_city as string, 'i');
      }

      const sortOptions: any = {};
      sortOptions[sort_by as string] = sort_order === 'desc' ? -1 : 1;

      const flights = await Flight.find(query)
        .sort(sortOptions)
        .limit(10);

      const flightsWithPricing = await Promise.all(
        flights.map(async (flight) => {
          const pricing = await PricingService.calculatePrice(flight._id.toString());
          
          return {
            _id: flight._id,
            flight_id: flight.flight_id,
            airline: flight.airline,
            departure_city: flight.departure_city,
            arrival_city: flight.arrival_city,
            departure_time: flight.departure_time,
            arrival_time: flight.arrival_time,
            base_price: flight.base_price,
            current_price: pricing.currentPrice,
            is_surge_active: pricing.isSurgeActive,
            surge_percentage: pricing.surgePercentage,
            time_until_reset: pricing.timeUntilReset,
          };
        })
      );

      res.json({
        flights: flightsWithPricing,
        count: flightsWithPricing.length,
      });
    } catch (error) {
      console.error('Search flights error:', error);
      res.status(500).json({ error: 'Failed to search flights' });
    }
  }

  static async getFlightById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const flight = await Flight.findById(id);
      
      if (!flight) {
        res.status(404).json({ error: 'Flight not found' });
        return;
      }

      const pricing = await PricingService.calculatePrice(flight._id.toString());

      res.json({
        _id: flight._id,
        flight_id: flight.flight_id,
        airline: flight.airline,
        departure_city: flight.departure_city,
        arrival_city: flight.arrival_city,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        base_price: flight.base_price,
        current_price: pricing.currentPrice,
        is_surge_active: pricing.isSurgeActive,
        surge_percentage: pricing.surgePercentage,
        time_until_reset: pricing.timeUntilReset,
      });
    } catch (error) {
      console.error('Get flight error:', error);
      res.status(500).json({ error: 'Failed to get flight' });
    }
  }

  static async getCities(req: AuthRequest, res: Response): Promise<void> {
    try {
      const departureCities = await Flight.distinct('departure_city');
      const arrivalCities = await Flight.distinct('arrival_city');

      res.json({
        departure_cities: departureCities.sort(),
        arrival_cities: arrivalCities.sort(),
      });
    } catch (error) {
      console.error('Get cities error:', error);
      res.status(500).json({ error: 'Failed to get cities' });
    }
  }
}
