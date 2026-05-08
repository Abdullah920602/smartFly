const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      message: 'خطأ في التحقق من البيانات',
      errors: errors.array().map(err => ({
        field: err.param,
        msg: err.msg || err.message
      }))
    });
  }
  next();
};

const validateRegister = [
  body('fullName')
    .notEmpty()
    .withMessage('الاسم الكامل مطلوب')
    .trim()
    .escape()
    .isLength({ min: 3, max: 50 })
    .withMessage('الاسم يجب أن يكون بين 3 و 50 حرف'),
  body('email')
    .notEmpty()
    .withMessage('البريد الإلكتروني مطلوب')
    .isEmail()
    .normalizeEmail()
    .withMessage('البريد الإلكتروني غير صحيح'),
  body('password')
    .notEmpty()
    .withMessage('كلمة المرور مطلوبة')
    .isLength({ min: 8 })
    .withMessage('كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
  body('phone')
    .optional()
    .trim(),
  validateRequest
];

const validateLogin = [
  body('email')
    .notEmpty()
    .withMessage('البريد الإلكتروني مطلوب')
    .isEmail()
    .normalizeEmail()
    .withMessage('البريد الإلكتروني غير صحيح'),
  body('password')
    .notEmpty()
    .withMessage('كلمة المرور مطلوبة'),
  validateRequest
];

const validateFlight = [
  body('flightNumber')
    .trim()
    .notEmpty()
    .withMessage('رقم الرحلة مطلوب'),
  body('airline')
    .trim()
    .notEmpty()
    .withMessage('اسم الشركة مطلوب'),
  body('departure')
    .trim()
    .notEmpty()
    .withMessage('مدينة الإقلاع مطلوبة'),
  body('arrival')
    .trim()
    .notEmpty()
    .withMessage('مدينة الوصول مطلوبة'),
  body('date')
    .notEmpty()
    .withMessage('التاريخ مطلوب'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('السعر يجب أن يكون رقمياً موجباً'),
  validateRequest
];

module.exports = { 
  validateRequest,
  validateRegister, 
  validateLogin, 
  validateFlight 
};
