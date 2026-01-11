import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  flightId: mongoose.Types.ObjectId;
  passenger_name: string;
  final_price: number;
  booking_date: Date;
  pnr: string;
  status: 'confirmed' | 'cancelled';
  flight_details: {
    flight_id: string;
    airline: string;
    departure_city: string;
    arrival_city: string;
    departure_time: string;
    arrival_time: string;
  };
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  flightId: {
    type: Schema.Types.ObjectId,
    ref: 'Flight',
    required: true,
  },
  passenger_name: {
    type: String,
    required: true,
  },
  final_price: {
    type: Number,
    required: true,
  },
  booking_date: {
    type: Date,
    default: Date.now,
  },
  pnr: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed',
  },
  flight_details: {
    flight_id: String,
    airline: String,
    departure_city: String,
    arrival_city: String,
    departure_time: String,
    arrival_time: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IBooking>('Booking', BookingSchema);
