const Booking = require('../models/Booking');
const Flight = require('../models/Flight');

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('flightId')
      .sort({ bookingDate: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { flightId, passengerInfo, selectedSeat, discount } = req.body;

    // تحقق من وجود الرحلة
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ 
        success: false,
        message: 'الرحلة غير موجودة' 
      });
    }

    // تحقق من عدد المقاعد المتاحة
    if (flight.availableSeats <= 0) {
      return res.status(400).json({ 
        success: false,
        message: 'لا توجد مقاعد متاحة' 
      });
    }

    // احسب السعر النهائي
    const totalPrice = flight.price;
    const discountAmount = discount || 0;
    const finalPrice = totalPrice - discountAmount;

    // إنشاء الحجز
    const booking = new Booking({
      userId: req.user.id,
      flightId,
      passengerInfo,
      selectedSeat,
      totalPrice,
      discount: discountAmount,
      finalPrice,
      status: 'Confirmed'
    });

    await booking.save();

    // قلل عدد المقاعد المتاحة
    flight.availableSeats -= 1;
    await flight.save();

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الحجز بنجاح',
      booking: {
        bookingId: booking._id,
        flightId: booking.flightId,
        totalPrice: booking.totalPrice,
        finalPrice: booking.finalPrice
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: 'الحجز غير موجود' 
      });
    }

    // تحقق من ملكية الحجز
    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'لا يمكنك إلغاء هذا الحجز' 
      });
    }

    booking.status = 'Cancelled';
    await booking.save();

    // أضف المقعد مرة أخرى للمتاح
    const flight = await Flight.findById(booking.flightId);
    flight.availableSeats += 1;
    await flight.save();

    res.json({
      success: true,
      message: 'تم إلغاء الحجز بنجاح'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.getAirlineBookings = async (req, res) => {
  try {
    // تحقق من أن المستخدم هو شركة طيران
    if (req.user.role !== 'airline') {
      return res.status(403).json({ 
        success: false,
        message: 'فقط شركات الطيران يمكنها رؤية حجوزاتها' 
      });
    }

    // جلب كل الرحلات لهذه الشركة
    const flights = await Flight.find({ airlineId: req.user.airlineId });
    const flightIds = flights.map(f => f._id);

    // جلب كل الحجوزات على هذه الرحلات
    const bookings = await Booking.find({ flightId: { $in: flightIds } })
      .populate('flightId')
      .populate('userId', 'fullName email phone')
      .sort({ bookingDate: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};
