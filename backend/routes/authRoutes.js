const express = require('express');
const router = express.Router();
const { register, login, airlineRegister, getProfile, updateProfile, changePassword, forgotPassword, resetPassword } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin } = require('../middleware/validateInput');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/airline-register', validateRegister, airlineRegister);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', verifyToken, getProfile);
router.put('/update-profile', verifyToken, updateProfile);
router.put('/change-password', verifyToken, changePassword);

module.exports = router;
