// مساعد لتحليل استعلامات الرحلات الذكية
// يساعد في فهم نية المستخدم والعثور على الرحلات ذات الصلة

const arabicCities = {
  'عمّان': ['عمان', 'امّان', 'عمّان', 'جنيب'],
  'الدوحة': ['الدوحة', 'دوحة', 'قطر'],
  'دبي': ['دبي', 'الإمارات'],
  'القاهرة': ['القاهرة', 'مصر', 'كايرو'],
  'بيروت': ['بيروت', 'لبنان'],
  'اسطنبول': ['اسطنبول', 'تركيا', 'استنبول'],
  'جدة': ['جدة', 'السعودية'],
  'الرياض': ['الرياض', 'السعودية'],
  'بغداد': ['بغداد', 'العراق'],
  'البحرين': ['البحرين', 'منامة'],
  'الكويت': ['الكويت'],
  'مسقط': ['مسقط', 'عمّان'],
};

// تحليل الكلمات المفتاحية في الرسالة
class FlightQueryAnalyzer {
  
  /**
   * استخراج المدن من الرسالة
   */
  static extractCities(message) {
    const cities = [];
    const lowerMessage = message.toLowerCase();
    
    for (const [city, aliases] of Object.entries(arabicCities)) {
      for (const alias of aliases) {
        const pattern = new RegExp(`\\b${alias}\\b`, 'gi');
        if (pattern.test(lowerMessage)) {
          cities.push(city);
          break;
        }
      }
    }
    
    return [...new Set(cities)]; // إزالة التكرار
  }

  /**
   * استخراج نوع الاستعلام (بحث، سعر، حجز، إلخ)
   */
  static identifyQueryType(message) {
    const types = [];
    const lowerMessage = message.toLowerCase();

    // أنماط البحث
    const patterns = {
      search: ['ابحث', 'أبحث', 'أريد', 'أبغي', 'هل يوجد', 'هناك رحلات'],
      price: ['سعر', 'كم', 'تكلفة', 'أرخص', 'أغلى', 'سعر التذكرة', 'ثمن', 'قيمة', 'تخفيف', 'عرض'],
      best: ['أفضل', 'أحسن', 'أمثل', 'أجود', 'الأفضل'],
      time: ['متى', 'وقت', 'تاريخ', 'موعد', 'ساعة', 'يوم', 'أسرع'],
      booking: ['احجز', 'حجز', 'أحجز', 'أريد الحجز', 'الحجز'],
      availability: ['متاح', 'موجود', 'هناك', 'يوجد', 'كم عدد'],
      company: ['شركة', 'طيران', 'الخطوط', 'الطيران'],
      help: ['ساعد', 'مساعدة', 'كيف', 'كيفية', 'شنو', 'شلون']
    };

    for (const [type, keywords] of Object.entries(patterns)) {
      for (const keyword of keywords) {
        if (lowerMessage.includes(keyword)) {
          types.push(type);
          break;
        }
      }
    }

    return [...new Set(types)];
  }

  /**
   * استخراج معايير السعر من الرسالة
   */
  static extractPriceCriteria(message) {
    const criteria = {
      wantsCheapest: /أرخص|أقل سعر|أقل ثمن|أقلهم سعر|أرخصهم/.test(message.toLowerCase()),
      wantsMostExpensive: /أغلى|أعلى سعر|أعلى ثمن/.test(message.toLowerCase()),
      maxBudget: this._extractNumber(message),
      prefersBudget: /بميزانية|في حدود|متوسط السعر|معقول|رخيص/.test(message.toLowerCase()),
    };
    return criteria;
  }

  /**
   * استخراج معايير الوقت من الرسالة
   */
  static extractTimeCriteria(message) {
    const criteria = {
      wantsEarliest: /أسرع|أقرب|أبكر|في الصباح/.test(message.toLowerCase()),
      wantsLatest: /متأخرة|في المساء|ليلاً|الليل/.test(message.toLowerCase()),
      prefersQuick: /سريعة|قصيرة المدة|كم ساعة|حوالي|حولي/.test(message.toLowerCase()),
    };
    return criteria;
  }

  /**
   * استخراج الأرقام من الرسالة
   */
  static _extractNumber(message) {
    const numberPattern = /\d+/;
    const match = message.match(numberPattern);
    return match ? parseInt(match[0]) : null;
  }

  /**
   * فلترة الرحلات بناءً على معايير المستخدم
   */
  static filterFlights(flights, criteria) {
    let filtered = [...flights];

    // تطبيق فلاتر المدن
    if (criteria.departure) {
      filtered = filtered.filter(f => 
        f.departure.toLowerCase() === criteria.departure.toLowerCase()
      );
    }
    if (criteria.arrival) {
      filtered = filtered.filter(f => 
        f.arrival.toLowerCase() === criteria.arrival.toLowerCase()
      );
    }

    // تطبيق فلاتر السعر
    if (criteria.priceCriteria) {
      if (criteria.priceCriteria.maxBudget) {
        filtered = filtered.filter(f => f.price <= criteria.priceCriteria.maxBudget);
      }
      if (criteria.priceCriteria.wantsCheapest) {
        filtered = filtered.sort((a, b) => a.price - b.price);
      }
      if (criteria.priceCriteria.wantsMostExpensive) {
        filtered = filtered.sort((a, b) => b.price - a.price);
      }
    }

    // تطبيق فلاتر الوقت
    if (criteria.timeCriteria) {
      if (criteria.timeCriteria.wantsEarliest) {
        filtered = filtered.sort((a, b) => {
          const timeA = a.departureTime || '00:00';
          const timeB = b.departureTime || '00:00';
          return timeA.localeCompare(timeB);
        });
      }
      if (criteria.timeCriteria.wantsLatest) {
        filtered = filtered.sort((a, b) => {
          const timeA = a.departureTime || '00:00';
          const timeB = b.departureTime || '00:00';
          return timeB.localeCompare(timeA);
        });
      }
    }

    return filtered;
  }

  /**
   * بناء سياق غني من بيانات الرحلات للـ AI
   */
  static buildFlightContext(flights, userMessage = '') {
    if (!flights || flights.length === 0) {
      return '';
    }

    const uniqueAirlines = [...new Set(flights.map(f => f.airline))];
    const uniqueDestinations = [...new Set(flights.map(f => f.arrival))];
    const uniqueDepartures = [...new Set(flights.map(f => f.departure))];
    
    const prices = flights.map(f => f.price).sort((a, b) => a - b);
    const cheapestFlight = flights.reduce((min, f) => f.price < min.price ? f : min);
    const mostExpensiveFlight = flights.reduce((max, f) => f.price > max.price ? f : max);

    // بناء جدول الرحلات المنسقة
    const flightTable = flights
      .slice(0, 10) // أول 10 رحلات فقط لتقليل التكاليف
      .map(f => `• ${f.flightNumber} (${f.airline}) من ${f.departure} إلى ${f.arrival}: ${f.price} د.ا، وقت المغادرة: ${f.departureTime || 'غير محدد'}`)
      .join('\n');

    return `
📊 **معلومات الرحلات المتاحة:**

**الرحلات الموجودة:** ${flights.length} رحلة
**شركات الطيران:** ${uniqueAirlines.join(', ')}
**الوجهات:** ${uniqueDestinations.join(', ')}
**نقاط الإقلاع:** ${uniqueDepartures.join(', ')}

**نطاق الأسعار:** ${prices[0]} - ${prices[prices.length - 1]} د.ا
**السعر الأرخص:** ${cheapestFlight.price} د.ا (${cheapestFlight.flightNumber})
**السعر الأغلى:** ${mostExpensiveFlight.price} د.ا (${mostExpensiveFlight.flightNumber})

**أول 10 رحلات:**
${flightTable}

---
${userMessage ? `**اهتمام المستخدم:** "${userMessage}"` : ''}
`;
  }

  /**
   * تحليل شامل للرسالة
   */
  static analyzeMessage(message, availableFlights = []) {
    return {
      originalMessage: message,
      queryTypes: this.identifyQueryType(message),
      cities: this.extractCities(message),
      priceCriteria: this.extractPriceCriteria(message),
      timeCriteria: this.extractTimeCriteria(message),
      flightContext: this.buildFlightContext(availableFlights, message),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = FlightQueryAnalyzer;
