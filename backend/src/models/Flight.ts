import mongoose, { Document, Schema } from 'mongoose';

export interface IFlight extends Document {
  flight_id: string;
  airline: string;
  departure_city: string;
  arrival_city: string;
  departure_time: string;
  arrival_time: string;
  base_price: number;
  booking_attempts: Array<{
    timestamp: Date;
  }>;
  last_price_reset: Date;
  createdAt: Date;
}

const FlightSchema = new Schema<IFlight>({
  flight_id: {
    type: String,
    required: true,
    unique: true,
  },
  airline: {
    type: String,
    required: true,
  },
  departure_city: {
    type: String,
    required: true,
  },
  arrival_city: {
    type: String,
    required: true,
  },
  departure_time: {
    type: String,
    required: true,
  },
  arrival_time: {
    type: String,
    required: true,
  },
  base_price: {
    type: Number,
    required: true,
    min: 2000,
    max: 3000,
  },
  booking_attempts: [{
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  last_price_reset: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

FlightSchema.index({ departure_city: 1, arrival_city: 1 });

export default mongoose.model<IFlight>('Flight', FlightSchema);
