const Flight = require('../models/Flight');
const Airline = require('../models/Airline');

exports.getFlights = async (req, res) => {
  try {
    const { departure, arrival, date, minPrice, maxPrice, airline } = req.query;
    let query = {};

    // If user is airline, only show their flights
    if (req.user && req.user.role === 'airline') {
      if (!req.user.airlineId) {
        return res.status(403).json({ 
          success: false,
          message: 'المستخدم غير مرتبط بشركة طيران' 
        });
      }
      query.airlineId = req.user.airlineId;
    }

    if (departure) query.departure = departure;
    if (arrival) query.arrival = arrival;
    if (date) query.date = date;
    if (airline) query.airline = airline;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const flights = await Flight.find(query)
      .populate('airlineId')
      .limit(50)
      .sort({ price: 1 });

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

exports.getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id).populate('airlineId');
    if (!flight) {
      return res.status(404).json({ 
        success: false,
        message: 'الرحلة غير موجودة' 
      });
    }

    res.json({
      success: true,
      flight
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.addFlight = async (req, res) => {
  try {
    const { flightNumber, departure, arrival, departureTime, arrivalTime, date, duration, price, aircraft, availableSeats } = req.body;

    // تحقق من أن المستخدم هو شركة طيران
    if (req.user.role !== 'airline') {
      return res.status(403).json({ 
        success: false,
        message: 'فقط شركات الطيران يمكنها إضافة رحلات' 
      });
    }

    // تحقق من وجود airlineId
    if (!req.user.airlineId) {
      return res.status(403).json({ 
        success: false,
        message: 'المستخدم غير مرتبط بشركة طيران' 
      });
    }

    // Get airline information
    const airline = await Airline.findById(req.user.airlineId);
    if (!airline) {
      return res.status(404).json({ 
        success: false,
        message: 'شركة الطيران غير موجودة' 
      });
    }

    // تحقق من وجود الرحلة (لنفس الرقم ونفس التاريخ)
    let existingFlight = await Flight.findOne({ flightNumber, date });
    if (existingFlight) {
      return res.status(400).json({ 
        success: false,
        message: 'رقم الرحلة موجود بالفعل في هذا التاريخ' 
      });
    }

    const newFlight = new Flight({
      flightNumber,
      airline: airline.name,
      airlineId: req.user.airlineId,
      departure,
      arrival,
      departureTime,
      arrivalTime,
      date,
      duration,
      price,
      aircraft,
      availableSeats: availableSeats || 150
    });

    await newFlight.save();

    res.status(201).json({
      success: true,
      message: 'تم إضافة الرحلة بنجاح',
      flight: newFlight
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.updateFlight = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, price, availableSeats, departureTime, arrivalTime } = req.body;

    // تحقق من أن المستخدم هو شركة طيران
    if (req.user.role !== 'airline') {
      return res.status(403).json({ 
        success: false,
        message: 'فقط شركات الطيران يمكنها تحديث الرحلات' 
      });
    }

    let flight = await Flight.findById(id);
    if (!flight) {
      return res.status(404).json({ 
        success: false,
        message: 'الرحلة غير موجودة' 
      });
    }

    // تحقق من ملكية الرحلة
    if (flight.airlineId.toString() !== req.user.airlineId.toString()) {
      return res.status(403).json({ 
        success: false,
        message: 'لا يمكنك تحديث هذه الرحلة' 
      });
    }

    if (status) flight.status = status;
    if (price) flight.price = price;
    if (availableSeats) flight.availableSeats = availableSeats;
    if (departureTime) flight.departureTime = departureTime;
    if (arrivalTime) flight.arrivalTime = arrivalTime;

    await flight.save();

    res.json({
      success: true,
      message: 'تم تحديث الرحلة بنجاح',
      flight
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.deleteFlight = async (req, res) => {
  try {
    const { id } = req.params;

    // تحقق من أن المستخدم هو شركة طيران
    if (req.user.role !== 'airline') {
      return res.status(403).json({ 
        success: false,
        message: 'فقط شركات الطيران يمكنها حذف الرحلات' 
      });
    }

    const flight = await Flight.findById(id);
    if (!flight) {
      return res.status(404).json({ 
        success: false,
        message: 'الرحلة غير موجودة' 
      });
    }

    // تحقق من ملكية الرحلة
    if (flight.airlineId.toString() !== req.user.airlineId.toString()) {
      return res.status(403).json({ 
        success: false,
        message: 'لا يمكنك حذف هذه الرحلة' 
      });
    }

    await Flight.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'تم حذف الرحلة بنجاح'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};
