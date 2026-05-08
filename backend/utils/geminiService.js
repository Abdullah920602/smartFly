const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// نموذج النظام الذكي للشات بوت
const generateSystemPrompt = (availableFlights, userContext = {}) => {
  const flightStats = {
    total: availableFlights.length,
    airlines: [...new Set(availableFlights.map(f => f.airline))],
    destinations: [...new Set(availableFlights.map(f => f.arrival))],
    minPrice: Math.min(...availableFlights.map(f => f.price)),
    maxPrice: Math.max(...availableFlights.map(f => f.price)),
    avgPrice: Math.round(availableFlights.reduce((sum, f) => sum + f.price, 0) / availableFlights.length)
  };

  return `أنت مساعد ذكي متخصص في حجوزات الرحلات الجوية لمنصة SmartFly Jordan.

🎯 معلومات النظام:
- عدد الرحلات المتاحة: ${flightStats.total}
- شركات الطيران الموجودة: ${flightStats.airlines.join(', ') || 'غير محدد'}
- الوجهات المتاحة: ${flightStats.destinations.join(', ') || 'غير محدد'}
- نطاق الأسعار: ${flightStats.minPrice} د.ا - ${flightStats.maxPrice} د.ا
- السعر المتوسط: ${flightStats.avgPrice} د.ا

📋 إرشادات الإجابة:
1. كن ودياً واحترافياً في كل الردود
2. افهم نية المستخدم (البحث عن رحلات، الأسعار، التوقيتات، الحجز)
3. عند السؤال عن أفضل سعر أو أفضل وقت، قدم تجزئة محترفة للخيارات
4. استخدم بيانات الرحلات الفعلية عند الإجابة
5. قدم اقتراحات مفيدة بناءً على سؤال المستخدم
6. إذا طلب المستخدم رحلات محددة، ابحث عن المعايير في البيانات المتاحة
7. أجب دائماً باللغة العربية بشكل احترافي ومختصر

🔍 أنواع الاستفسارات التي قد تتلقاها:
- البحث عن رحلات من/إلى مدينة معينة
- استعلامات السعر والعروض الخاصة
- أفضل الأوقات للسفر
- مقارنة الرحلات والخيارات
- معلومات عن شركات الطيران
- تفاصيل الحجز والدفع
- استفسارات عامة عن الخدمات

💡 ملاحظات مهمة:
- لا تعطي معلومات غير دقيقة - استخدم البيانات المتاحة فقط
- إذا لم تجد معلومة محددة، قل أنك ستساعد المستخدم بآلية أخرى
- قدم خيارات واضحة ومرقمة عند وجود عدة احتمالات
- اطلب توضيح إذا كان السؤال غير واضح

---`;
};

// تهيئة Gemini API
const initializeGemini = () => {
  if (!genAI && GEMINI_API_KEY) {
    try {
      genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      console.log('✅ Gemini API initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Gemini:', error.message);
      genAI = null;
      return false;
    }
  }
  return !!genAI;
};

// دالة للحصول على رد من Gemini مع السياق الكامل
const getGeminiResponse = async (userMessage, conversationHistory = [], availableFlights = [], userContext = {}) => {
  try {
    const isInitialized = initializeGemini();
    
    if (!isInitialized || !GEMINI_API_KEY) {
      throw new Error('Gemini API is not initialized');
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: generateSystemPrompt(availableFlights, userContext)
    });

    // تحضير سجل المحادثة
    const formattedHistory = conversationHistory
      .filter(msg => msg && msg.role && msg.text)
      .slice(-6) // احتفظ بآخر 6 رسائل لتقليل التكاليف
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

    // إنشاء محادثة
    const chat = model.startChat({ history: formattedHistory });

    // إضافة سياق إضافي للرسالة إذا لزم الأمر
    let enrichedMessage = userMessage;
    
    // تحسين فهم النية من خلال الكلمات المفتاحية
    if (userMessage.toLowerCase().includes('أفضل') || userMessage.toLowerCase().includes('أرخص')) {
      enrichedMessage += '\n\n[ملاحظة: المستخدم يبحث عن أفضل خيار - قدم مقارنة محترفة]';
    }
    if (userMessage.toLowerCase().includes('متى') || userMessage.toLowerCase().includes('وقت')) {
      enrichedMessage += '\n\n[ملاحظة: المستخدم يسأل عن الوقت/التاريخ - قدم تفاصيل زمنية واضحة]';
    }
    if (userMessage.toLowerCase().includes('كم') || userMessage.toLowerCase().includes('سعر')) {
      enrichedMessage += '\n\n[ملاحظة: المستخدم يسأل عن الأسعار - قدم معلومات مالية دقيقة]';
    }

    console.log('🤖 Sending to Gemini:', enrichedMessage);

    const result = await chat.sendMessage(enrichedMessage);
    const reply = result.response.text();

    console.log('✅ Gemini response received successfully');
    return reply;

  } catch (error) {
    console.error('❌ Gemini Error:', error.message);
    throw error;
  }
};

// تحديد القيود / المحاولات المتكررة
const testGeminiConnection = async () => {
  try {
    const isInitialized = initializeGemini();
    if (!isInitialized) {
      return { success: false, message: 'Gemini API not initialized' };
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('مرحباً');
    
    return { 
      success: !!result, 
      message: 'Gemini connection OK' 
    };
  } catch (error) {
    console.error('Gemini connection test failed:', error.message);
    return { 
      success: false, 
      message: error.message 
    };
  }
};

module.exports = {
  initializeGemini,
  getGeminiResponse,
  testGeminiConnection,
  generateSystemPrompt
};
