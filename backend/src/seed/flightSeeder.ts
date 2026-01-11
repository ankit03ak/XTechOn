import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Flight from '../models/Flight';

dotenv.config();

const flightData = [
  {
    flight_id: 'AI101',
    airline: 'Air India',
    departure_city: 'Mumbai',
    arrival_city: 'Delhi',
    departure_time: '06:00 AM',
    arrival_time: '08:15 AM',
    base_price: 2500,
  },
  {
    flight_id: 'SG202',
    airline: 'SpiceJet',
    departure_city: 'Delhi',
    arrival_city: 'Bangalore',
    departure_time: '09:30 AM',
    arrival_time: '12:00 PM',
    base_price: 2800,
  },
  {
    flight_id: 'IG303',
    airline: 'IndiGo',
    departure_city: 'Bangalore',
    arrival_city: 'Mumbai',
    departure_time: '02:00 PM',
    arrival_time: '04:30 PM',
    base_price: 2300,
  },
  {
    flight_id: 'AI404',
    airline: 'Air India',
    departure_city: 'Chennai',
    arrival_city: 'Kolkata',
    departure_time: '07:45 AM',
    arrival_time: '10:15 AM',
    base_price: 2700,
  },
  {
    flight_id: 'SG505',
    airline: 'SpiceJet',
    departure_city: 'Kolkata',
    arrival_city: 'Hyderabad',
    departure_time: '11:00 AM',
    arrival_time: '01:30 PM',
    base_price: 2400,
  },
  {
    flight_id: 'IG606',
    airline: 'IndiGo',
    departure_city: 'Hyderabad',
    arrival_city: 'Chennai',
    departure_time: '03:15 PM',
    arrival_time: '04:45 PM',
    base_price: 2200,
  },
  {
    flight_id: 'AI707',
    airline: 'Air India',
    departure_city: 'Mumbai',
    arrival_city: 'Bangalore',
    departure_time: '05:30 PM',
    arrival_time: '07:45 PM',
    base_price: 2600,
  },
  {
    flight_id: 'SG808',
    airline: 'SpiceJet',
    departure_city: 'Delhi',
    arrival_city: 'Mumbai',
    departure_time: '08:00 PM',
    arrival_time: '10:15 PM',
    base_price: 2900,
  },
  {
    flight_id: 'IG909',
    airline: 'IndiGo',
    departure_city: 'Bangalore',
    arrival_city: 'Delhi',
    departure_time: '06:45 AM',
    arrival_time: '09:30 AM',
    base_price: 2750,
  },
  {
    flight_id: 'AI1010',
    airline: 'Air India',
    departure_city: 'Chennai',
    arrival_city: 'Mumbai',
    departure_time: '12:30 PM',
    arrival_time: '02:45 PM',
    base_price: 2450,
  },
  {
    flight_id: 'SG1111',
    airline: 'SpiceJet',
    departure_city: 'Kolkata',
    arrival_city: 'Delhi',
    departure_time: '04:00 PM',
    arrival_time: '06:30 PM',
    base_price: 2650,
  },
  {
    flight_id: 'IG1212',
    airline: 'IndiGo',
    departure_city: 'Hyderabad',
    arrival_city: 'Bangalore',
    departure_time: '10:15 AM',
    arrival_time: '11:30 AM',
    base_price: 2100,
  },
  {
    flight_id: 'AI1313',
    airline: 'Air India',
    departure_city: 'Mumbai',
    arrival_city: 'Chennai',
    departure_time: '01:00 PM',
    arrival_time: '03:15 PM',
    base_price: 2550,
  },
  {
    flight_id: 'SG1414',
    airline: 'SpiceJet',
    departure_city: 'Delhi',
    arrival_city: 'Hyderabad',
    departure_time: '07:30 AM',
    arrival_time: '10:00 AM',
    base_price: 2800,
  },
  {
    flight_id: 'IG1515',
    airline: 'IndiGo',
    departure_city: 'Bangalore',
    arrival_city: 'Kolkata',
    departure_time: '09:00 AM',
    arrival_time: '11:45 AM',
    base_price: 2950,
  },
  {
    flight_id: 'AI1616',
    airline: 'Air India',
    departure_city: 'Chennai',
    arrival_city: 'Delhi',
    departure_time: '05:00 PM',
    arrival_time: '07:45 PM',
    base_price: 2850,
  },
  {
    flight_id: 'SG1717',
    airline: 'SpiceJet',
    departure_city: 'Kolkata',
    arrival_city: 'Mumbai',
    departure_time: '11:30 AM',
    arrival_time: '02:00 PM',
    base_price: 2700,
  },
  {
    flight_id: 'IG1818',
    airline: 'IndiGo',
    departure_city: 'Hyderabad',
    arrival_city: 'Delhi',
    departure_time: '08:15 AM',
    arrival_time: '10:45 AM',
    base_price: 2600,
  },
  {
    flight_id: 'AI1919',
    airline: 'Air India',
    departure_city: 'Mumbai',
    arrival_city: 'Kolkata',
    departure_time: '03:45 PM',
    arrival_time: '06:15 PM',
    base_price: 2750,
  },
  {
    flight_id: 'SG2020',
    airline: 'SpiceJet',
    departure_city: 'Delhi',
    arrival_city: 'Chennai',
    departure_time: '10:00 AM',
    arrival_time: '12:45 PM',
    base_price: 2900,
  },
];

const seedFlights = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('❌ MONGODB_URI is not defined in .env file');
      console.log('Please create a .env file and add your MongoDB connection string:');
      console.log('MONGODB_URI=your_mongodb_connection_string_here');
      process.exit(1);
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    console.log('🗑️  Clearing existing flights...');
    await Flight.deleteMany({});

    console.log('📝 Seeding flights...');
    await Flight.insertMany(flightData);

    console.log(`✅ Successfully seeded ${flightData.length} flights!`);
    console.log('🎉 Database seeding completed');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedFlights();
