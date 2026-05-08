// ثوابت التطبيق
export const APP_CONFIG = {
  NAME: 'SmartFly',
  VERSION: '1.0.0',
  DESCRIPTION: 'منصة حجز الطيران الذكية'
};



// ثوابت الألوان
export const COLORS = {
  PRIMARY: '#0F172A',
  SECONDARY: '#FFD700',
  SUCCESS: '#FFD700',
  WARNING: '#FFD700',
  DANGER: 'rgba(15, 23, 42, 0.8)',
  INFO: '#0F172A',
  LIGHT: '#ffffff',
  DARK: '#0F172A'
};

// ثوابت شركات الطيران
export const AIRLINES = [
  { id: 1, name: 'Saudi Airlines', code: 'SV', logo: 'saudi-airlines.png' },
  { id: 2, name: 'Emirates', code: 'EK', logo: 'emirates.png' },
  { id: 3, name: 'Qatar Airways', code: 'QR', logo: 'qatar-airways.png' },
  { id: 4, name: 'Gulf Air', code: 'GF', logo: 'gulf-air.png' },
  { id: 5, name: 'Kuwait Airways', code: 'KU', logo: 'kuwait-airways.png' },
  { id: 6, name: 'Oman Air', code: 'WY', logo: 'oman-air.png' }
];

// ثوابت المدن
export const CITIES = [
  { id: 1, name: 'الرياض', code: 'RUH', country: 'السعودية' },
  { id: 2, name: 'جدة', code: 'JED', country: 'السعودية' },
  { id: 3, name: 'الدمام', code: 'DMM', country: 'السعودية' },
  { id: 4, name: 'مكة', code: 'MAK', country: 'السعودية' },
  { id: 5, name: 'المدينة', code: 'MED', country: 'السعودية' },
  { id: 6, name: 'دبي', code: 'DXB', country: 'الإمارات' },
  { id: 7, name: 'أبو ظبي', code: 'AUH', country: 'الإمارات' },
  { id: 8, name: 'الدوحة', code: 'DOH', country: 'قطر' },
  { id: 9, name: 'المنامة', code: 'BAH', country: 'البحرين' },
  { id: 10, name: 'الكويت', code: 'KWI', country: 'الكويت' },
  { id: 11, name: 'مسقط', code: 'MCT', country: 'عمان' },
  { id: 12, name: 'القاهرة', code: 'CAI', country: 'مصر' },
  { id: 13, name: 'الإسكندرية', code: 'ALY', country: 'مصر' },
  { id: 14, name: 'عمان', code: 'AMM', country: 'الأردن' },
  { id: 15, name: 'بيروت', code: 'BEY', country: 'لبنان' },
  { id: 16, name: 'بغداد', code: 'BGW', country: 'العراق' }
];

// ثوابت حالة الرحلة
export const FLIGHT_STATUS = {
  AVAILABLE: 'Available',
  BOOKED: 'Booked',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
  DELAYED: 'Delayed'
};

// ثوابت حالة الحجز
export const BOOKING_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed'
};

// ثوابت الرسائل
export const MESSAGES = {
  SUCCESS: {
    FLIGHT_ADDED: 'تم إضافة الرحلة بنجاح',
    BOOKING_CONFIRMED: 'تم تأكيد الحجز بنجاح',
    DATA_UPDATED: 'تم تحديث البيانات بنجاح'
  },
  ERROR: {
    NETWORK_ERROR: 'خطأ في الاتصال بالشبكة',
    VALIDATION_ERROR: 'خطأ في البيانات المدخلة',
    AUTH_ERROR: 'خطأ في المصادقة'
  },
  LOADING: {
    FETCHING_DATA: 'جاري جلب البيانات...',
    PROCESSING: 'جاري المعالجة...',
    SAVING: 'جاري الحفظ...'
  }
};

// ثوابت التخطيط
export const LAYOUT = {
  SIDEBAR_WIDTH: '300px',
  NAVBAR_HEIGHT: '76px',
  TRANSITION_DURATION: '0.3s'
};

// ثوابت التصميم
export const BREAKPOINTS = {
  MOBILE: '480px',
  TABLET: '768px',
  DESKTOP: '1024px',
  LARGE_DESKTOP: '1200px'
};

// ثوابت التخزين المحلي
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'smartfly_user_preferences',
  SEARCH_HISTORY: 'smartfly_search_history',
  FAVORITES: 'smartfly_favorites',
  THEME: 'smartfly_theme'
};

// ثوابت API
export const API_ENDPOINTS = {
  FLIGHTS: '/api/flights',
  BOOKINGS: '/api/bookings',
  USERS: '/api/users',
  AIRLINES: '/api/airlines',
  AIRPORTS: '/api/airports'
};

// ثوابت التحقق
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 50,
  MIN_PRICE: 0,
  MAX_PRICE: 10000
};
