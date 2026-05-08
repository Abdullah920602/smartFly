const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: [true, 'رقم الرحلة مطلوب'],
    index: true
  },
  airline: {
    type: String,
    required: [true, 'اسم الشركة مطلوب']
  },
  airlineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Airline'
  },
  departure: {
    type: String,
    required: [true, 'مدينة الإقلاع مطلوبة']
  },
  arrival: {
    type: String,
    required: [true, 'مدينة الوصول مطلوبة']
  },
  departureTime: String,
  arrivalTime: String,
  date: {
    type: String,
    required: [true, 'تاريخ الرحلة مطلوب'],
    index: true
  },
  duration: String,
  price: {
    type: Number,
    required: [true, 'السعر مطلوب']
  },
  availableSeats: {
    type: Number,
    default: 150
  },
  aircraft: String,
  status: {
    type: String,
    enum: ['Available', 'Delayed', 'Cancelled', 'Completed'],
    default: 'Available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ Create a compound unique index for flightNumber + date
// This allows the same flight number on different dates
flightSchema.index({ flightNumber: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Flight', flightSchema);
