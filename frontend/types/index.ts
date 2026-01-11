export interface Flight {
  _id: string;
  flight_id: string;
  airline: string;
  departure_city: string;
  arrival_city: string;
  departure_time: string;
  arrival_time: string;
  base_price: number;
  current_price: number;
  is_surge_active: boolean;
  surge_percentage: number;
  time_until_reset?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Booking {
  _id: string;
  pnr: string;
  passenger_name: string;
  final_price: number;
  booking_date: string;
  status: 'confirmed' | 'cancelled';
  flight_details: {
    flight_id: string;
    airline: string;
    departure_city: string;
    arrival_city: string;
    departure_time: string;
    arrival_time: string;
  };
}

export interface Wallet {
  balance: number;
  transactions: Transaction[];
}

export interface Transaction {
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  timestamp: string;
}
