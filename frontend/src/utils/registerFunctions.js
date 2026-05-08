// Authentication Functions for SmartFly
// ملف يحتوي فقط على دوال المصادقة الأساسية

// =====================================================
// تسجيل الدخول الموحد (للمسافرين وشركات الطيران)
// =====================================================
export const loginUser = async (formData, authService) => {
  try {
    const loginData = {
      email: formData.email,
      password: formData.password,
      role: formData.role
    };
    
    console.log('� Login attempt:', loginData.role);
    
    const response = await authService.login(loginData);
    
    if (response.success) {
      console.log('✅ Login successful');
      
      // تحديد الوجهة بناءً على الدور
      let redirectTo = '/login';
      if (response.user.role === 'traveler') {
        redirectTo = '/home';
      } else if (response.user.role === 'airline') {
        redirectTo = '/airline-dashboard';
      } else if (response.user.role === 'admin') {
        redirectTo = '/data-manager';
      }
      
      return {
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        user: response.user,
        redirectTo
      };
    } else {
      return {
        success: false,
        message: response.message || 'فشل تسجيل الدخول'
      };
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل تسجيل الدخول. يرجى التحقق من بياناتك.'
    };
  }
};

// =====================================================
// تسجيل مسافر جديد
// =====================================================
export const registerTraveler = async (formData, authService) => {
  try {
    const registerData = {
      fullName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      nationality: formData.nationality,
      role: 'traveler'
    };
    
    console.log('👤 Registering traveler...');
    
    const response = await authService.register(registerData);
    
    if (response.success) {
      console.log('✅ Traveler registered successfully');
      return {
        success: true,
        message: 'تم تسجيل المسافر بنجاح',
        user: response.user,
        redirectTo: '/login'
      };
    } else {
      return {
        success: false,
        message: response.message || 'فشل تسجيل المسافر'
      };
    }
  } catch (error) {
    console.error('❌ Registration error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل التسجيل. يرجى المحاولة مرة أخرى.'
    };
  }
};

// =====================================================
// تسجيل شركة طيران جديدة
// =====================================================
export const registerAirline = async (formData, authService) => {
  try {
    const registerData = {
      fullName: formData.contactPerson,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      airlineName: formData.companyName,
      airlineCode: formData.companyCode.toUpperCase(),
      licenseNumber: formData.licenseNumber,
      website: formData.website
    };
    
    console.log('🏢 Registering airline...');
    
    const response = await authService.registerAirline(registerData);
    
    if (response.success) {
      console.log('✅ Airline registered successfully');
      return {
        success: true,
        message: 'تم تسجيل شركة الطيران بنجاح',
        user: response.user,
        redirectTo: '/login'
      };
    } else {
      return {
        success: false,
        message: response.message || 'فشل تسجيل شركة الطيران'
      };
    }
  } catch (error) {
    console.error('❌ Registration error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل التسجيل. يرجى التحقق من بياناتك.'
    };
  }
};

// =====================================================
// التحقق من نموذج المسافر
// =====================================================
export const validateTravelerForm = (formData) => {
  const errors = {};
  
  if (!formData.firstName || formData.firstName.trim().length < 2) {
    errors.firstName = 'الاسم الأول يجب أن يكون 2 أحرف على الأقل';
  }
  
  if (!formData.lastName || formData.lastName.trim().length < 2) {
    errors.lastName = 'الاسم الأخير يجب أن يكون 2 أحرف على الأقل';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email)) {
    errors.email = 'البريد الإلكتروني غير صالح';
  }
  
  if (!formData.password || formData.password.length < 8) {
    errors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
  }
  
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'كلمات المرور غير متطابقة';
  }
  
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
  if (!formData.phone || !phoneRegex.test(formData.phone)) {
    errors.phone = 'رقم الهاتف غير صالح';
  }
  
  if (!formData.dateOfBirth) {
    errors.dateOfBirth = 'تاريخ الميلاد مطلوب';
  }
  
  if (!formData.nationality) {
    errors.nationality = 'الجنسية مطلوبة';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// =====================================================
// تسجيل الخروج الموحد
// =====================================================
export const logoutUser = async (authService) => {
  try {
    console.log('👋 Logging out...');
    
    const response = await authService.logout();
    
    if (response.success) {
      console.log('✅ Logout successful');
      return {
        success: true,
        message: 'تم تسجيل الخروج بنجاح',
        redirectTo: '/login'
      };
    } else {
      return {
        success: false,
        message: response.message || 'فشل تسجيل الخروج'
      };
    }
  } catch (error) {
    console.error('❌ Logout error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل تسجيل الخروج. يرجى المحاولة مرة أخرى.'
    };
  }
};

// =====================================================
// التحقق من نموذج شركة الطيران
// =====================================================
export const validateAirlineForm = (formData) => {
  const errors = {};
  
  if (!formData.contactPerson || formData.contactPerson.trim().length < 3) {
    errors.contactPerson = 'اسم شخص الاتصال يجب أن يكون 3 أحرف على الأقل';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email)) {
    errors.email = 'البريد الإلكتروني غير صالح';
  }
  
  if (!formData.password || formData.password.length < 8) {
    errors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
  }
  
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'كلمات المرور غير متطابقة';
  }
  
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
  if (!formData.phone || !phoneRegex.test(formData.phone)) {
    errors.phone = 'رقم الهاتف غير صالح';
  }
  
  if (!formData.companyName || formData.companyName.trim().length < 3) {
    errors.companyName = 'اسم الشركة يجب أن يكون 3 أحرف على الأقل';
  }
  
  if (!formData.companyCode || formData.companyCode.length < 2 || formData.companyCode.length > 3) {
    errors.companyCode = 'كود الشركة يجب أن يكون 2-3 أحرف';
  }
  
  if (!formData.licenseNumber || formData.licenseNumber.trim().length < 3) {
    errors.licenseNumber = 'رقم الرخصة مطلوب';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
