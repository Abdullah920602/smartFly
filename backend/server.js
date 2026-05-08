require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// استيراد الـ Routes
const authRoutes = require('./routes/authRoutes');
const flightRoutes = require('./routes/flightRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const airlineRoutes = require('./routes/airlineRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');

// استيراد الخدمات المتقدمة
const dataScheduler = require('./services/dataScheduler');
const performanceManager = require('./services/performanceManager');
const jordanianAirlinesService = require('./services/jordanianAirlinesService');

// إنشاء تطبيق Express
const app = express();

// ⚠️ IMPORTANT: Set trust proxy BEFORE using rate limiters or accessing req.ip
app.set('trust proxy', 1);

// الاتصال بقاعدة البيانات
connectDB();

// تطبيق الأمان - إصلاح: استدعاء helmet() مرة واحدة فقط بدون CSP مقيّد
app.use(helmet({
  contentSecurityPolicy: false, // تعطيل CSP لتجنب مشاكل التوافق
  crossOriginEmbedderPolicy: false
}));

// CORS - إصلاح: السماح بـ localhost:3000 وأيضاً الوصول المباشر عبر Nginx
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    // السماح للطلبات بدون Origin (مثل Postman أو server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS: Origin not allowed'));
  },
  credentials: true
}));

// Rate Limiting - Fixed with proper trust proxy configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip: (req) => {
    // Skip rate limiting for health check
    return req.path === '/health' || req.path === '/api/status';
  },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false
});

const chatbotLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/airline-register', authLimiter);
app.use('/api/chatbot', chatbotLimiter);

// Compression Middleware
app.use(performanceManager.compressionMiddleware());

// Performance Middleware
app.use(performanceManager.performanceMiddleware());

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/airlines', airlineRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'SmartFly API is running',
    timestamp: new Date(),
    version: '2.0.0'
  });
});

// API Status
app.get('/api/status', (req, res) => {
  const stats = performanceManager.getPerformanceStats();
  res.json({
    success: true,
    status: 'online',
    scheduler: dataScheduler.isRunning,
    performance: stats,
    timestamp: new Date()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'الطريق غير موجود'
  });
});

// Error Handler
app.use(errorHandler);

// بدء الخادم
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, async () => {
  logger.info(`\n🚀 SmartFly Backend Server`)
  logger.info(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  logger.info(`📨 API: http://localhost:${PORT}`);
  logger.info(`✅ Database: Connected`);
  logger.info(`🤖 Chatbot: Ready`);
  
  // تحميل البيانات الأولية
  try {
    logger.info(`\n📥 جاري تحميل بيانات الرحلات...`);
    const initialFlights = await jordanianAirlinesService.fetchRealFlightData();
    await jordanianAirlinesService.saveFlightsToDatabase(initialFlights);
    logger.info(`✅ تم تحميل ${initialFlights.length} رحلة بنجاح`);
  } catch (error) {
    logger.error('❌ خطأ في تحميل البيانات الأولية:', error);
  }

  // بدء جدول التحديثات الآلية
  try {
    logger.info(`\n⏰ بدء جدول التحديثات الآلية...`);
    dataScheduler.startScheduler();
    logger.info(`✅ تم بدء جدول التحديثات`);
  } catch (error) {
    logger.error('❌ خطأ في بدء جدول التحديثات:', error);
  }

  logger.info(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  logger.info(`🎯 النظام جاهز تماماً للعمل!\n`);
});

// معالجة إيقاف الخادم
process.on('SIGTERM', () => {
  logger.info('⏹️ إيقاف الخادم...');
  dataScheduler.stopScheduler();
  server.close(() => {
    logger.info('✅ تم إيقاف الخادم بنجاح');
    process.exit(0);
  });
});

module.exports = app;
