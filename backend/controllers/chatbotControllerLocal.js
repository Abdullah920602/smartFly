const Flight = require('../models/Flight');
const Airline = require('../models/Airline');

// Local Chatbot responses database
const responsePatterns = {
  'greeting': {
    patterns: ['مرحبا', 'السلام', 'صباح', 'مساء', 'هاي', 'ولو', 'كيف'],
    responses: [
      'مرحباً! أنا مساعد SmartFly الذكي. كيف يمكنني مساعدتك؟',
      'أهلاً وسهلاً! ما الذي تبحث عنه اليوم؟',
      'مرحباً بك في SmartFly! هل تريد البحث عن رحلات؟'
    ]
  },
  'search_flights': {
    patterns: ['ابحث', 'أبحث', 'رحلة', 'رحلات', 'من', 'إلى', 'عمّان', 'دبي', 'الرياض'],
    responses: [
      'يمكني مساعدتك في البحث عن رحلات. هل تخبرني من أين وإلى أين تريد السفر؟',
      'ما الوجهة التي تهمك؟ يمكني البحث عن الرحلات المتاحة لك.',
      'حسناً! أي مدينة تريد أن تسافر منها وإلى أين؟'
    ]
  },
  'price': {
    patterns: ['سعر', 'تكلفة', 'سعري', 'كم', 'ثمن', 'تذكرة', 'أرخص', 'أغلى'],
    responses: [
      'أسعار التذاكر تختلف حسب الرحلة والموعد. أخبرني عن الرحلة المحددة التي تهمك.',
      'يمكنك معرفة السعر الدقيق عند تحديد مدينة المغادرة والوصول.',
      'الأسعار تتغير حسب مواعيد الرحلات. ما الرحلة التي تود معرفة سعرها؟'
    ]
  },
  'booking': {
    patterns: ['احجز', 'أحجز', 'حجز', 'أريد', 'أنا أريد', 'حجوزات'],
    responses: [
      'لحجز رحلة، يرجى اختيار الرحلة من قائمة الرحلات المتاحة ثم اتبع خطوات الحجز.',
      'يمكنك الحجز مباشرة من خلال شاشة البحث. اختر الرحلة ثم أكمل الحجز.',
      'للحجز، أولاً اختر أفضل رحلة لك، ثم أكمل عملية الدفع والتأكيد.'
    ]
  },
  'airlines': {
    patterns: ['شركة', 'طيران', 'شركات', 'أي شركة', 'أي طيران'],
    responses: [
      'لدينا عدة شركات طيران متعاونة. يمكنك مشاهدة جميع الشركات من صفحة الشركات.',
      'لدينا شراكات مع أفضل شركات الطيران في المنطقة.',
      'اختر من شركات الطيران المتاحة في نتائج البحث.'
    ]
  },
  'help': {
    patterns: ['ساعد', 'مساعدة', 'كيف', 'إزاي', 'شنو', 'كيف أ', 'تساعد'],
    responses: [
      'أنا هنا لمساعدتك! يمكنني:\n1. البحث عن رحلات\n2. مساعدتك في الحجز\n3. الإجابة على أسئلتك\nما الذي تريده؟',
      'يمكني مساعدتك في البحث والحجز. ما الذي تحتاج إليه؟',
      'أنا مساعد SmartFly. يمكنني مساعدتك في:\n- البحث عن رحلات\n- معلومات عن الأسعار\n- عملية الحجز'
    ]
  },
  'luggage': {
    patterns: ['أمتعة', 'حقيبة', 'حقائب', 'شنط', 'عفش'],
    responses: [
      'سياسة الأمتعة تختلف حسب شركة الطيران الخاصة بك. تحقق من تفاصيل الرحلة للمزيد.',
      'معظم الرحلات تسمح بأمتعة يد وحقيبة مسجلة. تحقق من شروط الحجز.',
      'يمكنك معرفة حد الأمتعة المسموح به من تفاصيل الرحلة.'
    ]
  },
  'cancellation': {
    patterns: ['إلغاء', 'الغاء', 'حذف', 'الرجوع', 'استرجاع', 'رد'],
    responses: [
      'لإلغاء الحجز، تواصل معنا عبر خدمة العملاء. سياسة الإلغاء تختلف حسب نوع التذكرة.',
      'يمكنك الاتصال بخدمة العملاء لإلغاء حجزك. هناك رسوم قد تنطبق حسب الشروط.',
      'للمزيد عن سياسة الإلغاء، تفضل بالتواصل مع فريق الدعم.'
    ]
  },
  'thanks': {
    patterns: ['شكر', 'تمام', 'حاضر', 'شكراً', 'ممنون', 'awesome'],
    responses: [
      'أسعدني مساعدتك! هل هناك شيء آخر تحتاجه؟',
      'على الرحب والسعة! هل أتمكن من مساعدتك بشيء آخر؟',
      'يسعدني أنني ساعدتك! هل تحتاج إلى شيء الآن؟'
    ]
  },
  'default': {
    patterns: [],
    responses: [
      'هذا سؤال جيد! للأسف، لا أملك إجابة محددة حالياً. هل تريد البحث عن رحلات؟',
      'أنا متعلم! لم أفهم السؤال تماماً. هل يمكنك إعادة صياغته بطريقة أخرى؟',
      'عذراً، لم أفهم. جرب أن تسأل عن: البحث عن رحلات، الأسعار، أو الحجز.'
    ]
  }
};

// Find best matching category
const findMatchingCategory = (message) => {
  const lowerMessage = message.toLowerCase();
  let bestMatch = 'default';
  let bestScore = 0;

  for (const [category, data] of Object.entries(responsePatterns)) {
    for (const pattern of data.patterns) {
      if (lowerMessage.includes(pattern)) {
        bestScore++;
      }
    }
    if (bestScore > 0) {
      bestMatch = category;
    }
  }

  return bestMatch;
};

// Get random response from category
const getRandomResponse = (category) => {
  const responses = responsePatterns[category].responses;
  return responses[Math.floor(Math.random() * responses.length)];
};

// Main handler
exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'الرسالة فارغة'
      });
    }

    console.log('📨 Local Chatbot received message:', message);

    // Get available flights
    const flights = await Flight.find({ status: 'Available' }).limit(10).lean();
    console.log(`✈️ Found ${flights.length} available flights`);

    // Find matching category
    const category = findMatchingCategory(message);
    console.log('🎯 Matched category:', category);

    // Get response
    let reply = getRandomResponse(category);

    // If searching for flights, add flight data
    if (category === 'search_flights' && flights.length > 0) {
      reply += '\n\n📋 الرحلات المتاحة:\n';
      flights.slice(0, 3).forEach((flight, index) => {
        reply += `${index + 1}. ${flight.airline} من ${flight.departure} إلى ${flight.arrival} - ${flight.price} دينار\n`;
      });
    }

    console.log('✅ Response generated:', reply.substring(0, 100) + '...');

    res.json({
      success: true,
      reply,
      role: 'model'
    });

  } catch (error) {
    console.error('❌ Chatbot Error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في معالجة رسالتك'
    });
  }
};
