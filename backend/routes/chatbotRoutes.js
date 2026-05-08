const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const { verifyToken } = require('../middleware/authMiddleware');
const logger = require('../utils/logger');

// 🤖 المسارات الأساسية للشات بوت

// إرسال رسالة إلى الشات بوت
router.post('/message', verifyToken, chatbotController.sendMessage);

// جلب سجل المحادثة
router.get('/history/:userId', verifyToken, chatbotController.getConversationHistory);

// مسح سجل المحادثة
router.delete('/history/:userId', verifyToken, chatbotController.clearHistory);

// اختبار اتصال Gemini API
router.get('/test-connection', chatbotController.testConnection);

// مسار الشات العام (بدون authentication)
router.post('/send', async (req, res) => {
  try {
    const { message, userId = 'anonymous', conversationHistory = [] } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'الرسالة فارغة'
      });
    }

    const advancedChatbotService = require('../services/advancedChatbotService');
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
      timestamp: response.timestamp
    });
  } catch (error) {
    logger.error('خطأ في معالجة رسالة الشات:', error?.message || error);
    
    return res.json({
      success: false,
      message: 'حدث خطأ في معالجة رسالتك',
      reply: 'عذراً، حدثت مشكلة. يرجى المحاولة مرة أخرى.'
    });
  }
});

// 💡 المسارات المتقدمة

// الحصول على توصيات مخصصة
router.get('/recommendations/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { departure, arrival, date } = req.query;
    
    const travelRecommendationService = require('../services/travelRecommendationService');
    
    const recommendations = await travelRecommendationService.getPersonalizedRecommendations(
      userId,
      { departure, arrival, date }
    );

    res.json({
      success: true,
      ...recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في الحصول على التوصيات'
    });
  }
});

// أفضل العروض
router.get('/best-deals', async (req, res) => {
  try {
    const travelRecommendationService = require('../services/travelRecommendationService');
    const deals = await travelRecommendationService.getBestDeals();

    res.json({
      success: true,
      ...deals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في الحصول على العروض'
    });
  }
});

// الرحلات الشهيرة
router.get('/popular-routes', async (req, res) => {
  try {
    const travelRecommendationService = require('../services/travelRecommendationService');
    const routes = await travelRecommendationService.getPopularRoutes();

    res.json({
      success: true,
      ...routes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في الحصول على الرحلات الشهيرة'
    });
  }
});

// نصائح السفر
router.get('/travel-tips', async (req, res) => {
  try {
    const travelRecommendationService = require('../services/travelRecommendationService');
    const tips = travelRecommendationService.getTravelTips();

    res.json({
      success: true,
      tips
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في الحصول على النصائح'
    });
  }
});

// إحصائيات الأداء
router.get('/performance/stats', verifyToken, async (req, res) => {
  try {
    // التحقق من أن المستخدم admin
    const user = req.user;
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك'
      });
    }

    const performanceManager = require('../services/performanceManager');
    const stats = performanceManager.getPerformanceStats();

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في الحصول على الإحصائيات'
    });
  }
});

module.exports = router;
