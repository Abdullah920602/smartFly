/**
 * خدمة الشات بوت الذكي المتقدم
 * شات بوت احترافي يفهم أسئلة معقدة عن الطيران والحجوزات
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const Flight = require('../models/Flight');
const Booking = require('../models/Booking');
const knowledgeBase = require('./chatbotKnowledgeBase');
const logger = require('../utils/logger');

class AdvancedChatbotService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Try to use available models - fallback to gemini-pro if gemini-1.5-flash is not available
    try {
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    } catch (error) {
      logger.warn('Failed to initialize gemini-pro model');
      this.model = null;
    }
    this.conversationHistory = new Map();
    this.cache = new Map();
    this.cacheExpiry = 3600000; // ساعة واحدة
  }

  /**
   * معالجة الرسالة الواردة
   */
  async processMessage(userMessage, userId, language = 'ar') {
    try {
      logger.info(`رسالة من المستخدم ${userId}: ${userMessage}`);

      // الحصول على السياق
      const context = await this.buildContext(userMessage, userId);

      // معالجة الرسالة
      const response = await this.generateSmartResponse(
        userMessage,
        context,
        language,
        userId
      );

      // حفظ في السجل
      this.addToConversationHistory(userId, userMessage, response);

      return response;
    } catch (error) {
      logger.error('خطأ في معالجة الرسالة:', error?.message || 'Unknown error');
      return this.getFallbackResponse(userMessage, error);
    }
  }

  /**
   * بناء السياق الغني من البيانات وقاعدة المعارف
   */
  async buildContext(userMessage, userId) {
    try {
      // استخراج كلمات مفتاحية من الرسالة
      const keywords = this.extractKeywords(userMessage);
      
      // البحث عن المدن والتواريخ
      const { fromCity, toCity, date } = this.extractFlightDetails(userMessage);

      // جلب البيانات ذات الصلة
      const context = {
        keywords,
        flightDetails: { fromCity, toCity, date },
        relevantFlights: [],
        userBookings: [],
        availableOptions: [],
        knowledgeBase: {
          airlines: [],
          destinations: [],
          services: [],
          policies: []
        }
      };

      // البحث في قاعدة المعارف
      const searchResults = knowledgeBase.search(userMessage);
      context.knowledgeBase = searchResults;

      // جلب الرحلات ذات الصلة
      if (fromCity && toCity) {
        context.relevantFlights = await this.searchFlights(fromCity, toCity, date);
      }

      // جلب حجوزات المستخدم
      if (userId) {
        context.userBookings = await this.getUserBookings(userId);
      }

      // تحليل نوع الاستعلام
      context.queryType = this.analyzeQueryType(userMessage);

      // إضافة معلومات الأسعار من قاعدة المعارف
      if (fromCity && toCity) {
        const pricingInfo = knowledgeBase.getPricingInfo(fromCity, toCity);
        if (pricingInfo) {
          context.pricingInfo = pricingInfo;
        }
      }

      return context;
    } catch (error) {
      logger.debug('معلومات عن خطأ السياق:', {
        message: error?.message || '',
        name: error?.name || '',
        userMessage: userMessage?.substring(0, 50)
      });
      return { keywords: [], flightDetails: {}, relevantFlights: [], userBookings: [], knowledgeBase: {} };
    }
  }

  /**
   * استخراج الكلمات المفتاحية المتقدم
   */
  extractKeywords(message) {
    const keywords = {
      searchKeywords: [],
      priceKeywords: [],
      timeKeywords: [],
      preferenceKeywords: [],
      serviceKeywords: [],
      urgencyKeywords: [],
      airlineKeywords: []
    };

    const lowerMessage = message.toLowerCase();

    // كلمات البحث والسفر
    if (['رحلة', 'رحلات', 'سفر', 'طيران', 'مغادرة', 'وصول'].some(k => lowerMessage.includes(k))) {
      keywords.searchKeywords.push('flight');
    }

    // كلمات الأسعار
    if (['رخيص', 'أرخص', 'بسعر منخفض', 'الأقل سعراً', 'تخفيض', 'خصم', 'عرض'].some(k => lowerMessage.includes(k))) {
      keywords.searchKeywords.push('cheap');
      keywords.priceKeywords.push('low');
    }

    if (['غالي', 'مكلف', 'الأغلى', 'درجة أولى', 'رجال الأعمال'].some(k => lowerMessage.includes(k))) {
      keywords.searchKeywords.push('premium');
      keywords.priceKeywords.push('high');
    }

    // كلمات الوقت
    if (['مبكر', 'الصباح', 'بكري', 'فجر', 'صباحاً'].some(k => lowerMessage.includes(k))) {
      keywords.timeKeywords.push('early');
    }

    if (['متأخر', 'المساء', 'الليل', 'مساءً'].some(k => lowerMessage.includes(k))) {
      keywords.timeKeywords.push('late');
    }

    if (['غد', 'الغد', 'غداً', 'اليوم', 'حالاً', 'الآن'].some(k => lowerMessage.includes(k))) {
      keywords.urgencyKeywords.push('urgent');
    }

    // كلمات التفضيلات
    if (['أفضل', 'الأفضل', 'أحسن', 'ممتاز', 'موصى به'].some(k => lowerMessage.includes(k))) {
      keywords.preferenceKeywords.push('best');
    }

    if (['سريع', 'أسرع', 'مباشر', 'بدون توقف', 'غير متوقف'].some(k => lowerMessage.includes(k))) {
      keywords.preferenceKeywords.push('direct');
    }

    if (['توقف', 'محطة', 'ترانزيت', 'توقف واحد'].some(k => lowerMessage.includes(k))) {
      keywords.preferenceKeywords.push('connecting');
    }

    // كلمات الخدمات
    if (['حجز', 'تذكرة', 'حجز', 'دفع', 'شراء'].some(k => lowerMessage.includes(k))) {
      keywords.serviceKeywords.push('booking');
    }

    if (['إلغاء', 'إرجاع', 'استرداد', 'تعديل', 'تغيير'].some(k => lowerMessage.includes(k))) {
      keywords.serviceKeywords.push('modification');
    }

    if (['أمتعة', 'شنطة', 'حقائب', 'وزن'].some(k => lowerMessage.includes(k))) {
      keywords.serviceKeywords.push('baggage');
    }

    if (['وجبة', 'طعام', 'أكل', 'مشروب'].some(k => lowerMessage.includes(k))) {
      keywords.serviceKeywords.push('meal');
    }

    // كلمات شركات الطيران
    if (['الملكية', 'الملكية الأردنية', 'RJ', 'royal jordanian'].some(k => lowerMessage.includes(k))) {
      keywords.airlineKeywords.push('Royal Jordanian');
    }

    if (['صقور', 'الأردنية للصقور', 'JF', 'falcons'].some(k => lowerMessage.includes(k))) {
      keywords.airlineKeywords.push('Jordanian Falcons');
    }

    if (['عقاب', 'طيران العقاب', 'WG', 'wings'].some(k => lowerMessage.includes(k))) {
      keywords.airlineKeywords.push('Wings Airline');
    }

    if (['خليج', 'طيران الخليج', 'FlyDubai', 'FZ'].some(k => lowerMessage.includes(k))) {
      keywords.airlineKeywords.push('FlyDubai');
    }

    if (['سعودية', 'السعودية', 'SV', 'saudi'].some(k => lowerMessage.includes(k))) {
      keywords.airlineKeywords.push('Saudi Airlines');
    }

    if (['مصر', 'مصر للطيران', 'MS', 'egyptair'].some(k => lowerMessage.includes(k))) {
      keywords.airlineKeywords.push('Egypt Air');
    }

    return keywords;
  }

  /**
   * استخراج تفاصيل الرحلة من الرسالة
   */
  extractFlightDetails(message) {
    const cities = [
      'عمّان', 'دبي', 'القاهرة', 'بيروت', 'اسطنبول', 'بغداد', 
      'لندن', 'باريس', 'نيويورك', 'العقبة', 'البحرين', 'الرياض',
      'Amman', 'Dubai', 'Cairo', 'Beirut', 'Istanbul', 'Baghdad',
      'London', 'Paris', 'New York', 'Aqaba', 'Bahrain', 'Riyadh'
    ];

    let fromCity = null;
    let toCity = null;
    let date = null;

    // البحث عن المدن
    const lowerMessage = message.toLowerCase();
    for (const city of cities) {
      if (lowerMessage.includes(city.toLowerCase())) {
        if (!fromCity) fromCity = city;
        else if (!toCity) toCity = city;
      }
    }

    // البحث عن التاريخ
    const datePattern = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/;
    const dateMatch = message.match(datePattern);
    if (dateMatch) {
      date = dateMatch[0];
    }

    // البحث عن كلمات نسبية للوقت
    if (['غد', 'اليوم', 'أسبوع'].some(k => lowerMessage.includes(k))) {
      date = this.calculateRelativeDate(message);
    }

    return { fromCity, toCity, date };
  }

  /**
   * حساب التاريخ النسبي
   */
  calculateRelativeDate(message) {
    const lowerMessage = message.toLowerCase();
    const today = new Date();

    if (lowerMessage.includes('غد')) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    }

    if (lowerMessage.includes('أسبوع')) {
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek.toISOString().split('T')[0];
    }

    return today.toISOString().split('T')[0];
  }

  /**
   * تحليل متقدم لنوع الاستعلام
   */
  analyzeQueryType(message) {
    const lowerMessage = message.toLowerCase();

    // استفسارات البحث والسفر
    if (['أبحث عن', 'هل توجد', 'ما الرحلات', 'كم سعر', 'ابحث', 'بحث', 'سفر', 'طيران', 'مغادرة', 'وصول'].some(k => lowerMessage.includes(k))) {
      return 'search';
    }

    // استفسارات الحجز والدفع
    if (['أحجز', 'أريد الحجز', 'كيف أحجز', 'حجز', 'تذكرة', 'دفع', 'شراء', 'احجز لي'].some(k => lowerMessage.includes(k))) {
      return 'booking';
    }

    // استفسارات الحالة والمواعيد
    if (['حالة', 'متى', 'كم تستغرق', 'وقت', 'جدول', 'إقلاع', 'وصول', 'مغادرة', 'مدة'].some(k => lowerMessage.includes(k))) {
      return 'status';
    }

    // استفسارات الإلغاء والتعديل
    if (['ملغية', 'مؤجلة', 'تأخير', 'إلغاء', 'إرجاع', 'استرداد', 'تعديل', 'تغيير', 'تأخير'].some(k => lowerMessage.includes(k))) {
      return 'cancellation';
    }

    // استفسارات الأسعار
    if (['سعر', 'أسعار', 'تكلفة', 'كم سعر', 'بكم', 'غالي', 'رخيص', 'خصم', 'عرض'].some(k => lowerMessage.includes(k))) {
      return 'pricing';
    }

    // استفسارات شركات الطيران
    if (['شركة', 'خطوط', 'الملكية', 'الطيران', 'ناقل', 'RJ', 'صقور', 'عقاب'].some(k => lowerMessage.includes(k))) {
      return 'airline';
    }

    // استفسارات الخدمات
    if (['خدمة', 'مساعدة', 'دعم', 'شكوى', 'مشكلة', 'أمتعة', 'وجبة', 'مقعد'].some(k => lowerMessage.includes(k))) {
      return 'service';
    }

    // استفسارات الوجهات
    if (['وجهة', 'مدن', 'دول', 'أين', 'إلى أين', 'من أين'].some(k => lowerMessage.includes(k))) {
      return 'destination';
    }

    // استفسارات الطوارئ
    if (['طارئ', 'طوارئ', 'فقدان', 'ضياع', 'مساعدة عاجلة', 'مشكلة كبيرة'].some(k => lowerMessage.includes(k))) {
      return 'emergency';
    }

    return 'general';
  }

  /**
   * البحث عن الرحلات
   */
  async searchFlights(fromCity, toCity, date) {
    try {
      let query = {
        departure: this.normalizeCity(fromCity),
        arrival: this.normalizeCity(toCity)
      };

      if (date) {
        query.date = date;
      }

      const flights = await Flight.find(query)
        .sort({ price: 1 })
        .limit(10);

      return flights;
    } catch (error) {
      logger.error('خطأ في البحث عن الرحلات:', error);
      return [];
    }
  }

  /**
   * تطبيع اسم المدينة
   */
  normalizeCity(city) {
    const cityMap = {
      'عمّان': 'Amman',
      'دبي': 'Dubai',
      'القاهرة': 'Cairo',
      'بيروت': 'Beirut',
      'اسطنبول': 'Istanbul',
      'بغداد': 'Baghdad',
      'لندن': 'London',
      'باريس': 'Paris',
      'نيويورك': 'New York',
      'العقبة': 'Aqaba',
      'البحرين': 'Bahrain',
      'الرياض': 'Riyadh'
    };

    return cityMap[city] || city;
  }

  /**
   * جلب حجوزات المستخدم
   */
  async getUserBookings(userId) {
    try {
      // Skip if userId is not a valid ObjectId or doesn't exist
      if (!userId || typeof userId !== 'string' || userId.length === 0) {
        return [];
      }

      const bookings = await Booking.find({ userId })
        .populate('flightId')
        .limit(5)
        .sort({ createdAt: -1 });

      return bookings;
    } catch (error) {
      // Gracefully handle any database errors (e.g., invalid ObjectId format)
      logger.debug('خطأ في جلب الحجوزات (غالباً userId غير صحيح):', error.message);
      return [];
    }
  }

  /**
   * توليد الرد الذكي
   */
  async generateSmartResponse(userMessage, context, language, userId) {
    try {
      if (!this.model) {
        throw new Error('Gemini model not initialized');
      }

      // بناء السياق الغني للـ Gemini
      const systemPrompt = this.buildSystemPrompt(language, context);
      
      // صياغة الرسالة مع السياق
      const enrichedMessage = this.enrichMessage(userMessage, context);

      // بناء محتوى مبسط للـ API
      const messageContent = `${systemPrompt}\n\n${enrichedMessage}`;

      // الحصول على الرد من Gemini
      const result = await this.model.generateContent(messageContent);

      // التحقق من النتيجة
      if (!result || !result.response) {
        throw new Error('No response from Gemini API');
      }

      let response = result.response.text();

      // تحسين الرد
      response = this.enhanceResponse(response, context, language);

      return {
        text: response,
        suggestions: this.generateSuggestions(context),
        flights: context.relevantFlights.slice(0, 3),
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('خطأ في توليد الرد:', error.message || error);
      return this.getFallbackResponse(userMessage, error);
    }
  }

  /**
   * بناء النص الأساسي للنموذج
   */
  buildSystemPrompt(language, context) {
    if (language === 'ar') {
      return `أنت مساعد SmartFly الذكي المتخصص في حجوزات الطيران الأردنية والخدمات ذات الصلة. لديك معرفة شاملة بـ:

🇯🇴 **شركات الطيران الأردنية:**
- الملكية الأردنية (RJ) - الناقل الرسمي
- الأردنية للصقور (JF)
- طيران العقاب (WG)
- شركات أخرى تعمل من الأردن

🛫 **الوجهات الرئيسية من الأردن:**
- دولية: دبي، القاهرة، اسطنبول، لندن، باريس، نيويورك
- إقليمية: بيروت، بغداد، الرياض، البحرين
- محلية: العقبة

💰 **معلومات الأسعار:**
- الرحلات الداخلية: 80-150 دينار أردني
- الرحلات الإقليمية: 180-350 دينار أردني
- الرحلات الدولية: 500-1200 دينار أردني
- الأسعار تشمل الضرائب والرسوم

🎫 **الخدمات والتسهيلات:**
- حجز إلكتروني وتعديل على الحجوزات
- اختيار المقاعد والأمتعة
- وجبات الطعام حسب الدرجة
- سياسات الإلغاء والتعويض

**مهامك الأساسية:**
1. الإجابة على جميع أسئلة الركاب بشكل احترافي وودود
2. تقديم توصيات دقيقة للرحلات بناءً على التفضيلات
3. مساعدة كاملة في حجز التذاكر والتعديل على الحجوزات
4. تقديم معلومات دقيقة عن جميع شركات الطيران الأردنية
5. توضيح سياسات الأسعار والرسوم والضرائب والخدمات
6. حل المشاكل والشكاوى بسرعة وكفاءة

**قواعد مهمة جداً:**
- كن دقيقاً 100% في المعلومات المتعلقة بالأسعار والمواعيد
- قدم توصيات شاملة ومفصلة دائماً
- استخدم كل البيانات المتاحة في السياق
- اعرض جميع الأسعار بالدينار الأردني (JOD)
- كن متعاطفاً جداً مع المشاكل والشكاوى
- اقدم حلولاً عملية وسريعة ومضمونة
- استخدم emojis مناسبة لجعل الردود أكثر ودية
- كن مستعداً للإجابة على أي سؤال عن الطيران في الأردن`;
    }

    return `You are SmartFly's intelligent assistant specialized in Jordanian airline bookings and related services. You have comprehensive knowledge of:

🇯🇴 **Jordanian Airlines:**
- Royal Jordanian (RJ) - The official carrier
- Jordanian Falcons (JF)
- Wings Airlines (WG)
- Other airlines operating from Jordan

🛫 **Main Destinations from Jordan:**
- International: Dubai, Cairo, Istanbul, London, Paris, New York
- Regional: Beirut, Baghdad, Riyadh, Bahrain
- Domestic: Aqaba

💰 **Price Information:**
- Domestic flights: 80-150 JOD
- Regional flights: 180-350 JOD
- International flights: 500-1200 JOD
- Prices include taxes and fees

🎫 **Services and Facilities:**
- Online booking and reservation modifications
- Seat selection and baggage
- Meals according to class
- Cancellation and compensation policies

**Your Core Tasks:**
1. Answer all passenger questions professionally and kindly
2. Provide accurate flight recommendations based on preferences
3. Complete assistance with ticket booking and reservation modifications
4. Provide accurate information about all Jordanian airlines
5. Clarify pricing policies, fees, taxes, and services
6. Solve problems and complaints quickly and efficiently

**Very Important Rules:**
- Be 100% accurate with price and time information
- Always provide comprehensive and detailed recommendations
- Use all available data in context
- Display all prices in Jordanian Dinar (JOD)
- Be very empathetic with problems and complaints
- Offer practical, quick, and guaranteed solutions
- Use appropriate emojis to make responses more friendly
- Be ready to answer any question about aviation in Jordan`;
  }

  /**
   * تثري الرسالة بالسياق وقاعدة المعارف
   */
  enrichMessage(userMessage, context) {
    let enriched = `المستخدم يقول: "${userMessage}"`;

    if (context.queryType) {
      enriched += `\n\nنوع الاستعلام: ${context.queryType}`;
    }

    if (context.flightDetails.fromCity && context.flightDetails.toCity) {
      enriched += `\nالمسار: من ${context.flightDetails.fromCity} إلى ${context.flightDetails.toCity}`;
    }

    // إضافة معلومات من قاعدة المعارف
    if (context.knowledgeBase.airlines.length > 0) {
      enriched += `\n\nشركات الطيران ذات الصلة:`;
      context.knowledgeBase.airlines.slice(0, 2).forEach((airline, idx) => {
        enriched += `\n${idx + 1}. ${airline.name} (${airline.code}) - ${airline.englishName}`;
        enriched += `\n   التقييم: ${airline.rating}/5 - الوجهات: ${airline.destinations}`;
      });
    }

    if (context.knowledgeBase.destinations.length > 0) {
      enriched += `\n\nالوجهات ذات الصلة:`;
      context.knowledgeBase.destinations.slice(0, 2).forEach((dest, idx) => {
        enriched += `\n${idx + 1}. ${dest.arabicName} (${dest.code}) - ${dest.country || dest.arabicCountry || 'الأردن'}`;
        if (dest.priceRange) enriched += `\n   السعر: ${dest.priceRange}`;
        if (dest.flightTime) enriched += `\n   مدة الرحلة: ${dest.flightTime}`;
      });
    }

    if (context.knowledgeBase.services.length > 0) {
      enriched += `\n\nالخدمات ذات الصلة:`;
      context.knowledgeBase.services.forEach((service, idx) => {
        enriched += `\n${idx + 1}. معلومات الخدمة متاحة`;
      });
    }

    if (context.pricingInfo) {
      enriched += `\n\nمعلومات الأسعار:`;
      enriched += `\n- نطاق السعر: ${context.pricingInfo.priceRange}`;
      enriched += `\n- مدة الرحلة: ${context.pricingInfo.flightTime}`;
      enriched += `\n- وجهة شائعة: ${context.pricingInfo.popular ? 'نعم' : 'لا'}`;
    }

    if (context.relevantFlights.length > 0) {
      enriched += `\n\nالرحلات المتاحة (${context.relevantFlights.length}):`;
      context.relevantFlights.slice(0, 3).forEach((flight, idx) => {
        enriched += `\n${idx + 1}. ${flight.flightNumber} - ${flight.airline}`;
        enriched += `\n   السعر: ${flight.price} JOD`;
        enriched += `\n   الوقت: ${flight.departureTime} - ${flight.arrivalTime}`;
      });
    }

    return enriched;
  }

  /**
   * تحسين الرد
   */
  enhanceResponse(response, context, language) {
    // إضافة bilingual support أو تنسيق أفضل
    let enhanced = response;

    // إزالة الاختبارات والتعليقات غير الضرورية
    enhanced = enhanced.replace(/\[test\]/gi, '');
    enhanced = enhanced.replace(/\[draft\]/gi, '');

    // إضافة نقاط أردية مهمة
    if (language === 'ar' && context.relevantFlights.length > 0) {
      enhanced += '\n\n📌 **معلومات مهمة:**';
      enhanced += '\n- جميع الأسعار تشمل الضرائب والرسوم';
      enhanced += '\n- يمكن تعديل الحجز حتى 24 ساعة قبل الإقلاع';
      enhanced += '\n- الأمتعة المسموحة: 23 كيلوجرام';
    }

    return enhanced;
  }

  /**
   * توليد اقتراحات ذكية وشاملة
   */
  generateSuggestions(context) {
    const suggestions = [];
    const { keywords, queryType, relevantFlights, userBookings } = context;

    // اقتراحات بناءً على نوع الاستعلام
    if (queryType === 'search') {
      if (relevantFlights.length === 0) {
        suggestions.push('جرب تواريخ مختلفة');
        suggestions.push('ابحث عن رحلات مع توقف');
        suggestions.push('توسيع نطاق البحث');
        suggestions.push('عرض جميع الوجهات');
      } else {
        suggestions.push('عرض مزيد من الخيارات');
        suggestions.push('تصفية حسب السعر');
        suggestions.push('حجز هذه الرحلة');
        suggestions.push('مقارنة الشركات');
      }
    }

    // اقتراحات بناءً على الكلمات المفتاحية
    if (keywords.priceKeywords.includes('low')) {
      suggestions.push('العروض الأرخص');
      suggestions.push('رحلات اقتصادية');
      suggestions.push('خصومات خاصة');
    }

    if (keywords.priceKeywords.includes('high')) {
      suggestions.push('درجة رجال الأعمال');
      suggestions.push('الدرجة الأولى');
      suggestions.push('خدمات VIP');
    }

    if (keywords.timeKeywords.includes('early')) {
      suggestions.push('رحلات الصباح الباكر');
      suggestions.push('أقرب إقلاع');
      suggestions.push('تجنب التأخير');
    }

    if (keywords.timeKeywords.includes('late')) {
      suggestions.push('رحلات المساء');
      suggestions.push('وصول متأخر');
      suggestions.push('مواعيد مرنة');
    }

    if (keywords.preferenceKeywords.includes('direct')) {
      suggestions.push('رحلات مباشرة فقط');
      suggestions.push('بدون توقف');
      suggestions.push('أسرع طريق');
    }

    if (keywords.serviceKeywords.includes('booking')) {
      suggestions.push('احجز الآن');
      suggestions.push('خطوات الحجز');
      suggestions.push('طرق الدفع');
    }

    if (keywords.serviceKeywords.includes('baggage')) {
      suggestions.push('سياسة الأمتعة');
      suggestions.push('أمتعة إضافية');
      suggestions.push('وزن الحقائب');
    }

    if (keywords.serviceKeywords.includes('meal')) {
      suggestions.push('قائمة الوجبات');
      suggestions.push('طلب خاص');
      suggestions.push('وجبات غذائية');
    }

    // اقتراحات بناءً على شركات الطيران
    if (keywords.airlineKeywords.length > 0) {
      suggestions.push(`معلومات عن ${keywords.airlineKeywords[0]}`);
      suggestions.push('مقارنة الشركات');
      suggestions.push('تقييمات الركاب');
    }

    // اقتراحات الحجوزات
    if (userBookings.length > 0) {
      suggestions.push('عرض حجوزاتي');
      suggestions.push('تعديل الحجز');
      suggestions.push('إلغاء الحجز');
      suggestions.push('تأكيد الحجز');
    }

    // اقتراحات الطوارئ
    if (queryType === 'emergency') {
      suggestions.push('اتصل بالطوارئ');
      suggestions.push('مساعدة عاجلة');
      suggestions.push('تتبع الحجز');
      suggestions.push('رقم الطوارئ');
    }

    // اقتراحات عامة إذا لم يتم العثور على شيء
    if (suggestions.length === 0) {
      suggestions.push('ابحث عن رحلة');
      suggestions.push('الملكية الأردنية');
      suggestions.push('الأسعار الحالية');
      suggestions.push('خدمة العملاء');
      suggestions.push('عروض خاصة');
    }

    // إزالة التكرار والعودة بحد أقصى 5 اقتراحات
    return [...new Set(suggestions)].slice(0, 5);
  }

  /**
   * الحصول على الرد الاحتياطي المحسّن والشامل
   */
  getFallbackResponse(userMessage, error) {
    const lowerMsg = userMessage.toLowerCase();
    
    // تحليل متقدم للنية المستخدم
    if (['رحلة', 'رحلات', 'أبحث', 'ابحث', 'من', 'إلى', 'بحث', 'سفر', 'طيران'].some(k => lowerMsg.includes(k))) {
      return {
        text: `أنا هنا لمساعدتك في البحث عن أفضل الرحلات! 🎫✈️\n\n**خدمات البحث المتاحة:**\n🔍 رحلات من عمان إلى جميع الوجهات\n🌍 رحلات دولية (دبي، القاهرة، اسطنبول، لندن)\n🏛️ رحلات إقليمية (بيروت، بغداد، الرياض)\n🏖️ رحلات محلية (العقبة)\n\n**للبحث عن رحلة، أخبرني ب:**\n• مدينة المغادرة والوصول\n• التاريخ المفضل\n• عدد المسافرين\n• الدرجة (اقتصادية، رجال الأعمال، أولى)\n\n**مثال:** "أريد رحلة من عمّان إلى دبي يوم الجمعة القادم لشخصين"\n\n**أفضل الأسعار حالياً:**\n• عمّان → دبي: من 220 دينار أردني\n• عمّان → القاهرة: من 150 دينار أردني\n• عمّان → بيروت: من 95 دينار أردني`,
        suggestions: ['عمّان → دبي', 'عمّان → القاهرة', 'عمّان → اسطنبول', 'جميع الرحلات'],
        isError: false,
        timestamp: new Date()
      };
    }
    
    if (['سعر', 'أسعار', 'تكلفة', 'كم سعر', 'بكم', 'حجز', 'تذاكر', 'دفع'].some(k => lowerMsg.includes(k))) {
      return {
        text: `يسعدني أن أساعدك في معرفة الأسعار والحجز! 💳🎫\n\n**معلومات الأسعار الحالية:**\n\n**الرحلات الداخلية:**\n• عمّان ↔ العقبة: 85-120 دينار أردني\n\n**الرحلات الإقليمية:**\n• عمّان → القاهرة: 150-220 دينار أردني\n• عمّان → بيروت: 95-150 دينار أردني\n• عمّان → دبي: 220-350 دينار أردني\n• عمّان → اسطنبول: 280-450 دينار أردني\n\n**الرحلات الدولية:**\n• عمّان → لندن: 520-850 دينار أردني\n• عمّان → باريس: 480-750 دينار أردني\n• عمّان → نيويورك: 750-1200 دينار أردني\n\n**ملاحظات هامة:**\n✅ جميع الأسعار تشمل الضرائب والرسوم\n✅ يمكن تعديل الحجز حتى 24 ساعة قبل الإقلاع\n✅ الأمتعة المسموحة: 23 كيلوجرام لدرجة الاقتصاد\n✅ وجبات طعام مجانية في الرحلات الدولية\n\n**كيف يمكنني مساعدتك في الحجز؟**`,
        suggestions: ['احجز الآن', 'عرض العروض', 'سياسات الإلغاء', 'معلومات الأمتعة'],
        isError: false,
        timestamp: new Date()
      };
    }
    
    if (['شركات', 'خطوط', 'الملكية', 'الطيران', 'ناقل'].some(k => lowerMsg.includes(k))) {
      return {
        text: `معلومات عن شركات الطيران الأردنية! 🇯🇴✈️\n\n**الشركات الأردنية الرئيسية:**\n\n**🛫 الملكية الأردنية (RJ)**\n• الناقل الرسمي للأردن\n• تأسست عام 1963\n• تغطي 50+ وجهة عالمية\n• المقر الرئيسي: مطار الملكة علياء الدولي\n• درجات الخدمة: اقتصادية، رجال الأعمال، أولى\n\n**🦅 الأردنية للصقور (JF)**\n• شريك محلي للملكية الأردنية\n• رحلات إقليمية ومحلية\n• أسعار تنافسية\n\n**🦅 طيران العقاب (WG)**\n• رحلات محلية وإقليمية\n• تركيز على الخدمة السريعة\n\n**شركات أخرى تعمل من الأردن:**\n• طيران الخليج (إمارات)\n• الخطوط الجوية العربية السعودية\n• مصر للطيران\n• طيران الشرق الأوسط\n\n**الوجهات الرئيسية من الأردن:**\n🌍 دولية: دبي، القاهرة، اسطنبول، لندن، باريس، نيويورك\n🏛️ إقليمية: بيروت، بغداد، الرياض، الدوحة، البحرين\n🏖️ محلية: العقبة\n\n**أي شركة تريد معرفة المزيد عنها؟**`,
        suggestions: ['الملكية الأردنية', 'الوجهات المتاحة', 'مقارنة الأسعار', 'حجز مع شركة معينة'],
        isError: false,
        timestamp: new Date()
      };
    }
    
    if (['وقت', 'متى', 'جدول', 'إقلاع', 'وصول', 'مدة'].some(k => lowerMsg.includes(k))) {
      return {
        text: `معلومات عن مواعيد الرحلات والجدول الزمني! ⏰✈️\n\n**أوقات الإقلاع النموذجية من عمان:**\n\n**🌅 الصباح الباكر (6:00 - 9:00):**\n• عمّان → القاهرة: 7:30 ص\n• عمّان → بيروت: 8:15 ص\n• عمّان → دبي: 8:45 ص\n\n**🌞 منتصف النهار (10:00 - 14:00):**\n• عمّان → اسطنبول: 11:00 ص\n• عمّان → الرياض: 12:30 م\n• عمّان → البحرين: 1:15 م\n\n**🌆 المساء (15:00 - 21:00):**\n• عمّان → لندن: 4:30 م\n• عمّان → باريس: 5:15 م\n• عمّان → نيويورك: 6:45 م\n\n**مدد الرحلات التقريبية:**\n• عمّان → العقبة: 1 ساعة\n• عمّان → القاهرة: 1.5 ساعة\n• عمّان → دبي: 3 ساعات\n• عمّان → اسطنبول: 3 ساعات\n• عمّان → لندن: 5.5 ساعات\n• عمّان → نيويورك: 10 ساعات\n\n**ملاحظات:**\n✅ يوصى بالوصول قبل 3 ساعات للرحلات الدولية\n✅ ساعتين للرحلات الإقليمية\n✅ ساعة واحدة للرحلات المحلية\n\n**هل تريد معرفة وقت رحلة معينة؟**`,
        suggestions: ['جدول الرحلات الكامل', 'وقت رحلة محددة', 'فحص الحالة', 'معلومات التسجيل'],
        isError: false,
        timestamp: new Date()
      };
    }
    
    if (['خدمة', 'مساعدة', 'دعم', 'شكوى', 'مشكلة'].some(k => lowerMsg.includes(k))) {
      return {
        text: `خدمة العملاء والدعم في SmartFly! 🤝📞\n\n**خدماتنا المتاحة لك:**\n\n**🎫 حجز وتعديل:**\n• حجز جديد عبر الهاتف أو الإنترنت\n• تعديل الحجز حتى 24 ساعة قبل الإقلاع\n• إلغاء الحجز واسترداد الأموال\n• اختيار المقاعد والأمتعة الإضافية\n\n**📞 التواصل معنا:**\n• هاتف: +962 6 500 0000\n• بريد إلكتروني: info@smartfly.jo\n• دردشة مباشرة: 24/7\n• مكاتب خدمة العملاء في المطار\n\n**🏢 مكاتبنا:**\n• المقر الرئيسي: عمان، شارع الملكة رانيا\n• فرع مطار الملكة علياء: على مدار الساعة\n• فروع في جميع المدن الرئيسية\n\n**⚡ خدمات الطوارئ:**\n• تغييرات الطقس والإلغاءات\n• مساعدة في حالات فقدان الأمتعة\n• حجز بديل في حالات الطوارئ\n• إعادة جدولة الرحلات\n\n**كيف يمكنني مساعدتك تحديداً؟**`,
        suggestions: ['اتصل بنا', 'تتبع الحجز', 'الشكاوى', 'الأسئلة الشائعة'],
        isError: false,
        timestamp: new Date()
      };
    }
    
    // رد عام شامل ومحسّن جداً
    return {
      text: `مرحباً بك في SmartFly Jordan! 🇯🇴✈️\n\nأنا مساعدك الذكي المتخصص في جميع خدمات الطيران الأردنية. يمكنني مساعدتك في:\n\n**🎫 خدمات الحجز والبحث:**\n• البحث عن أفضل الرحلات والأسعار\n• حجز التذاكر إلكترونياً\n• تعديل وإلغاء الحجوزات\n• اختيار المقاعد والخدمات الإضافية\n\n**🛫 معلومات الطيران:**\n• جميع شركات الطيران الأردنية\n• الوجهات المحلية والدولية\n• الجداول الزمنية والأسعار\n• سياسات الأمتعة والوجبات\n\n**📞 خدمة العملاء:**\n• حل المشاكل والشكاوى\n• مساعدة في حالات الطوارئ\n• معلومات عن المطار والتسجيل\n• سياسات الإلغاء والتعويض\n\n**🌍 معلومات إضافية:**\n• أفضل وقت للحجز\n• نصائح السفر\n• معلومات عن الوجهات\n• عروض وخصومات خاصة\n\n**كيف يمكنني مساعدتك اليوم؟ اختر من:**\n1. البحث عن رحلة\n2. معلومات الأسعار\n3. حجز تذكرة\n4. الاستفسار عن شركة طيران\n5. مساعدة في حجز موجود\n6. أي سؤال آخر عن الطيران!`,
        suggestions: ['ابحث عن رحلة', 'الملكية الأردنية', 'الأسعار الحالية', 'احجز الآن', 'خدمة العملاء', 'عروض خاصة'],
        isError: false,
        timestamp: new Date()
    };
  }

  /**
   * إضافة إلى سجل المحادثة
   */
  addToConversationHistory(userId, userMessage, response) {
    if (!this.conversationHistory.has(userId)) {
      this.conversationHistory.set(userId, []);
    }

    const history = this.conversationHistory.get(userId);
    history.push({
      userMessage,
      response: response.text,
      timestamp: new Date()
    });

    // احتفظ بآخر 50 رسالة فقط
    if (history.length > 50) {
      history.shift();
    }
  }

  /**
   * الحصول على سجل المحادثة
   */
  getConversationHistory(userId) {
    return this.conversationHistory.get(userId) || [];
  }

  /**
   * مسح سجل المحادثة
   */
  clearConversationHistory(userId) {
    this.conversationHistory.delete(userId);
  }
}

module.exports = new AdvancedChatbotService();
