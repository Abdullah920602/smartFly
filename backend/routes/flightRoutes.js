const express = require('express');
const router = express.Router();
const { getFlights, getFlightById, addFlight, updateFlight, deleteFlight } = require('../controllers/flightController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const { validateFlight } = require('../middleware/validateInput');

router.get('/', verifyToken, getFlights);
router.get('/:id', getFlightById);
router.post('/', verifyToken, verifyRole(['airline']), validateFlight, addFlight);
router.put('/:id', verifyToken, verifyRole(['airline']), updateFlight);
router.delete('/:id', verifyToken, verifyRole(['airline']), deleteFlight);

module.exports = router;
