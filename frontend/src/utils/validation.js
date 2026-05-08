// Validation utilities for SmartFly application

export const validationRules = {
  // Email validation
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'البريد الإلكتروني غير صالح'
  },
  
  // Password validation
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف كبير، حرف صغير، ورقم'
  },
  
  // Phone validation
  phone: {
    required: true,
    pattern: /^[\+]?[0-9\s\-\(\)]{10,15}$/,
    message: 'رقم الهاتف غير صالح'
  },
  
  // Name validation
  fullName: {
    required: true,
    minLength: 3,
    maxLength: 50,
    pattern: /^[\u0600-\u06FFa-zA-Z\s]+$/,
    message: 'الاسم يجب أن يكون 3-50 حرف ويحتوي على حروف عربية أو إنجليزية فقط'
  },
  
  // Airline code validation
  airlineCode: {
    required: true,
    minLength: 2,
    maxLength: 3,
    pattern: /^[A-Z]{2,3}$/,
    message: 'كود شركة الطيران يجب أن يكون 2-3 أحرف إنجليزية كبيرة'
  },
  
  // Date validation
  dateOfBirth: {
    required: true,
    validate: (value) => {
      const date = new Date(value);
      const today = new Date();
      const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
      const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      
      return date >= minDate && date <= maxDate;
    },
    message: 'العمر يجب أن يكون بين 18 و 100 سنة'
  },
  
  // Nationality validation
  nationality: {
    required: true,
    allowedValues: ['jo', 'sa', 'ae', 'qa', 'bh', 'kw', 'om', 'eg', 'lb', 'iq'],
    message: 'الجنسية غير مدعومة'
  }
};

// Validation function
export const validateField = (fieldName, value) => {
  const rule = validationRules[fieldName];
  if (!rule) return { isValid: true, message: '' };
  
  // Required validation
  if (rule.required && (!value || value.trim() === '')) {
    return { isValid: false, message: 'هذا الحقل مطلوب' };
  }
  
  // Length validation
  if (rule.minLength && value.length < rule.minLength) {
    return { isValid: false, message: `الحقل يجب أن يكون ${rule.minLength} أحرف على الأقل` };
  }
  
  if (rule.maxLength && value.length > rule.maxLength) {
    return { isValid: false, message: `الحقل يجب أن يكون ${rule.maxLength} حرف كحد أقصى` };
  }
  
  // Pattern validation
  if (rule.pattern && !rule.pattern.test(value)) {
    return { isValid: false, message: rule.message };
  }
  
  // Custom validation
  if (rule.validate && !rule.validate(value)) {
    return { isValid: false, message: rule.message };
  }
  
  // Allowed values validation
  if (rule.allowedValues && !rule.allowedValues.includes(value)) {
    return { isValid: false, message: rule.message };
  }
  
  return { isValid: true, message: '' };
};

// Form validation
export const validateForm = (formData, fields) => {
  const errors = {};
  let isValid = true;
  
  fields.forEach(field => {
    const validation = validateField(field, formData[field]);
    if (!validation.isValid) {
      errors[field] = validation.message;
      isValid = false;
    }
  });
  
  return { isValid, errors };
};

// Password strength checker
export const checkPasswordStrength = (password) => {
  if (!password) return { strength: 0, message: 'ضعيفة جداً' };
  
  let score = 0;
  const feedback = [];
  
  // Length check
  if (password.length >= 8) score += 1;
  else feedback.push('8 أحرف على الأقل');
  
  // Uppercase check
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('حرف كبير واحد على الأقل');
  
  // Lowercase check
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('حرف صغير واحد على الأقل');
  
  // Number check
  if (/\d/.test(password)) score += 1;
  else feedback.push('رقم واحد على الأقل');
  
  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else feedback.push('رمز خاص واحد على الأقل');
  
  let strength, message;
  switch (score) {
    case 0:
    case 1:
      strength = 1;
      message = 'ضعيفة جداً';
      break;
    case 2:
      strength = 2;
      message = 'ضعيفة';
      break;
    case 3:
      strength = 3;
      message = 'متوسطة';
      break;
    case 4:
      strength = 4;
      message = 'قوية';
      break;
    case 5:
      strength = 5;
      message = 'قوية جداً';
      break;
    default:
      strength = 3;
      message = 'متوسطة';
  }
  
  return { strength, message, feedback };
};

// Email domain validation for airlines
export const validateAirlineEmail = (email) => {
  const airlineDomains = [
    'rj.com', 'royaljordanian.com', 'airline.com',
    'me-airlines.com', 'middleeast.com',
    'gulfair.com', 'kuwaitairways.com',
    'omanair.com', 'emirates.com',
    'qatarairways.com', 'etihad.com'
  ];
  
  const domain = email.split('@')[1]?.toLowerCase();
  return airlineDomains.some(airlineDomain => 
    domain.includes(airlineDomain)
  );
};
