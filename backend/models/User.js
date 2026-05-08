const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'الرجاء إدخال الاسم الكامل'],
    trim: true,
    maxlength: [50, 'الاسم يجب أن لا يزيد عن 50 حرف']
  },
  email: {
    type: String,
    required: [true, 'الرجاء إدخال البريد الإلكتروني'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'الرجاء إدخال بريد إلكتروني صحيح']
  },
  password: {
    type: String,
    required: [true, 'الرجاء إدخال كلمة المرور'],
    minlength: [8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'],
    select: false
  },
  phone: String,
  role: {
    type: String,
    enum: ['traveler', 'airline', 'admin'],
    default: 'traveler'
  },
  airlineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Airline'
  },
  passportNumber: String,
  nationality: String,
  dateOfBirth: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpiry: Date
});

module.exports = mongoose.model('User', userSchema);
