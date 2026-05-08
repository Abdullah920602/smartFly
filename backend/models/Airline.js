const mongoose = require('mongoose');

const airlineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'اسم الشركة مطلوب'],
    unique: true
  },
  code: {
    type: String,
    required: [true, 'رمز الشركة مطلوب'],
    unique: true,
    maxlength: 3
  },
  logo: String,
  email: {
    type: String,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'البريد الإلكتروني غير صحيح']
  },
  phone: String,
  description: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Airline', airlineSchema);
