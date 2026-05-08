const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  flightId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: true
  },
  passengerInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    passportNumber: String,
    nationality: String,
    dateOfBirth: String
  },
  selectedSeat: String,
  totalPrice: Number,
  discount: {
    type: Number,
    default: 0
  },
  finalPrice: Number,
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Confirmed'
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    default: 'credit_card'
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
