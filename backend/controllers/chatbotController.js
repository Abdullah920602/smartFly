const Flight = require('../models/Flight');
const Airline = require('../models/Airline');
const advancedChatbotService = require('../services/advancedChatbotService');
const jordanianAirlinesService = require('../services/jordanianAirlinesService');
const logger = require('../utils/logger');

/**
 * المتحكم الرئيسي للشات بوت - متقدم وذكي جداً
 */
exports.sendMessage = async (req, res) => {
  try {
    const { message, userId, conversationHistory = [] } = req.body;

    // التحقق من المدخلات
    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'الرسالة فارغة'
      });
    }

    logger.info(`📨 رسالة من المستخدم ${userId}: ${message}`);

    // معالجة الرسالة باستخدام الخدمة المتقدمة
    const response = await advancedChatbotService.processMessage(
      message,
      userId,
      'ar'
    );

    return res.json({
      success: true,
      reply: response.text,
      suggestions: response.suggestions,
      relevantFlights: response.flights,
      timestamp: response.timestamp,
      source: 'advanced-ai'
    });
  } catch (error) {
    logger.error('❌ خطأ في معالجة الرسالة:', error);
    
    return res.json({
      success: true,
      reply: 'عذراً، حدثت مشكلة صغيرة. يرجى المحاولة مرة أخرى.',
      isError: true
    });
  }
};

/**
 * جلب سجل المحادثة
 */
exports.getConversationHistory = (req, res) => {
  try {
    const { userId } = req.params;

    const history = advancedChatbotService.getConversationHistory(userId);

    return res.json({
      success: true,
      history,
      count: history.length
    });
  } catch (error) {
    logger.error('خطأ في جلب سجل المحادثة:', error);
    
    return res.status(500).json({
      success: false,
      message: 'خطأ في جلب السجل'
    });
  }
};

/**
 * مسح سجل المحادثة
 */
exports.clearHistory = (req, res) => {
  try {
    const { userId } = req.params;

    advancedChatbotService.clearConversationHistory(userId);

    return res.json({
      success: true,
      message: 'تم مسح السجل بنجاح'
    });
  } catch (error) {
    logger.error('خطأ في مسح السجل:', error);
    
    return res.status(500).json({
      success: false,
      message: 'خطأ في حذف السجل'
    });
  }
};

/**
 * اختبار الاتصال بـ Gemini
 */
exports.testConnection = async (req, res) => {
  try {
    logger.info('🔍 اختبار الاتصال بـ Gemini API...');

    // محاولة إنشاء رسالة اختبار
    const testMessage = 'اختبر ردك على هذه الرسالة';
    const response = await advancedChatbotService.processMessage(
      testMessage,
      'test-user',
      'ar'
    );

    return res.json({
      success: true,
      message: '✅ الاتصال يعمل بشكل صحيح',
      testResponse: response.text
    });
  } catch (error) {
    logger.error('❌ خطأ في اختبار الاتصال:', error);
    
    return res.json({
      success: false,
      message: '❌ فشل الاتصال بـ Gemini',
      error: error.message
    });
  }
};

/**
 * الحصول على الرحلات المتاحة
 */
exports.getAvailableFlights = async (req, res) => {
  try {
    const flights = await Flight.find().limit(50);
    
    return res.json({
      success: true,
      flights,
      count: flights.length
    });
  } catch (error) {
    logger.error('خطأ في جلب الرحلات:', error);
    
    return res.status(500).json({
      success: false,
      message: 'خطأ في جلب الرحلات'
    });
  }
};

/**
 * الحصول على الشركات الجوية
 */
exports.getAirlines = async (req, res) => {
  try {
    const airlines = await Airline.find();
    
    return res.json({
      success: true,
      airlines,
      count: airlines.length
    });
  } catch (error) {
    logger.error('خطأ في جلب الشركات:', error);
    
    return res.status(500).json({
      success: false,
      message: 'خطأ في جلب الشركات'
    });
  }
};
