const Airline = require('../models/Airline');
const Flight = require('../models/Flight');

exports.getAllAirlines = async (req, res) => {
  try {
    const airlines = await Airline.find({ isActive: true });

    res.json({
      success: true,
      count: airlines.length,
      airlines
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.getAirlineById = async (req, res) => {
  try {
    const airline = await Airline.findById(req.params.id);
    if (!airline) {
      return res.status(404).json({ 
        success: false,
        message: 'الشركة غير موجودة' 
      });
    }

    res.json({
      success: true,
      airline
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.getAirlineFlights = async (req, res) => {
  try {
    const flights = await Flight.find({ airlineId: req.params.id })
      .sort({ date: 1 });

    res.json({
      success: true,
      count: flights.length,
      flights
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.getAirlineStats = async (req, res) => {
  try {
    // تحقق من أن المستخدم هو شركة طيران
    if (req.user.role !== 'airline') {
      return res.status(403).json({ 
        success: false,
        message: 'فقط شركات الطيران يمكنها رؤية إحصائياتها' 
      });
    }

    const flights = await Flight.find({ airlineId: req.user.airlineId });
    const totalFlights = flights.length;
    const totalSeats = flights.reduce((sum, f) => sum + 150, 0);
    const bookedSeats = flights.reduce((sum, f) => sum + (150 - f.availableSeats), 0);

    res.json({
      success: true,
      stats: {
        totalFlights,
        totalSeats,
        bookedSeats,
        availableSeats: totalSeats - bookedSeats,
        occupancyRate: ((bookedSeats / totalSeats) * 100).toFixed(2) + '%'
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};
