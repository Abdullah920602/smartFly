const express = require('express');
const router = express.Router();
const { getMyBookings, createBooking, cancelBooking, getAirlineBookings } = require('../controllers/bookingController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

router.get('/my-bookings', verifyToken, getMyBookings);
router.get('/airline-bookings', verifyToken, verifyRole(['airline']), getAirlineBookings);
router.post('/', verifyToken, createBooking);
router.put('/:id/cancel', verifyToken, cancelBooking);

module.exports = router;
