const express = require('express');
const router = express.Router();
const { getAllAirlines, getAirlineById, getAirlineFlights, getAirlineStats } = require('../controllers/airlineController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

router.get('/', getAllAirlines);
router.get('/:id', getAirlineById);
router.get('/:id/flights', getAirlineFlights);
router.get('/stats/my-stats', verifyToken, verifyRole(['airline']), getAirlineStats);

module.exports = router;
