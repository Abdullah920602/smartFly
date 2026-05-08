const mongoose = require('mongoose');
require('dotenv').config();

// Sample data for testing
const sampleUsers = [
  {
    fullName: 'أحمد محمد',
    email: 'ahmad@test.com',
    password: 'password123',
    phone: '+962 7 1234 5678',
    role: 'traveler',
    nationality: 'jo',
    dateOfBirth: '1990-01-15'
  },
  {
    fullName: 'مدير الخطوط الملكية',
    email: 'rj@test.com',
    password: 'password123',
    phone: '+962 6 5000 1111',
    role: 'airline',
    nationality: 'jo'
  }
];

const sampleAirlines = [
  {
    name: 'الخطوط الجوية الملكية الأردنية',
    code: 'RJ',
    email: 'info@rj.com',
    phone: '+962 6 5000 1111',
    isActive: true
  },
  {
    name: 'طيران الشرق الأوسط',
    code: 'ME',
    email: 'info@me.com',
    phone: '+962 6 4000 2222',
    isActive: true
  }
];

const sampleFlights = [
  {
    flightNumber: 'RJ-101',
    airline: 'الخطوط الجوية الملكية الأردنية',
    departure: 'Amman (AMM)',
    arrival: 'Aqaba (AQJ)',
    departureTime: '08:00',
    arrivalTime: '09:15',
    date: '2026-05-15',
    duration: '1h 15m',
    price: 85,
    availableSeats: 120,
    aircraft: 'Embraer E190',
    status: 'Available'
  },
  {
    flightNumber: 'ME-201',
    airline: 'طيران الشرق الأوسط',
    departure: 'Amman (AMM)',
    arrival: 'Dubai (DXB)',
    departureTime: '10:30',
    arrivalTime: '14:45',
    date: '2026-05-15',
    duration: '4h 15m',
    price: 250,
    availableSeats: 180,
    aircraft: 'Airbus A320',
    status: 'Available'
  }
];

async function setupDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await mongoose.connection.db.dropDatabase();
    console.log('✅ Database cleared');

    // Import models
    const User = require('./models/User');
    const Airline = require('./models/Airline');
    const Flight = require('./models/Flight');

    // Insert sample airlines
    console.log('✈️ Inserting airlines...');
    const airlines = await Airline.insertMany(sampleAirlines);
    console.log(`✅ Inserted ${airlines.length} airlines`);

    // Insert sample users
    console.log('👥 Inserting users...');
    const users = await User.insertMany(sampleUsers);
    console.log(`✅ Inserted ${users.length} users`);

    // Update airline user with airlineId
    const airlineUser = users.find(u => u.role === 'airline');
    const rjAirline = airlines.find(a => a.code === 'RJ');
    if (airlineUser && rjAirline) {
      await User.findByIdAndUpdate(airlineUser._id, { airlineId: rjAirline._id });
      console.log('✅ Updated airline user with airlineId');
    }

    // Insert sample flights
    console.log('🛫 Inserting flights...');
    const flights = await Flight.insertMany(sampleFlights);
    console.log(`✅ Inserted ${flights.length} flights`);

    console.log('🎉 Database setup completed successfully!');
    console.log('\n📋 Sample Login Credentials:');
    console.log('Traveler: ahmad@test.com / password123');
    console.log('Airline: rj@test.com / password123');

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();
