/**
 * نظام التوصيات الذكي المتقدم
 * يوفر توصيات شخصية للرحلات بناءً على تفضيلات المستخدم والبيانات التاريخية
 */

const Flight = require('../models/Flight');
const Booking = require('../models/Booking');
const User = require('../models/User');
const logger = require('../utils/logger');

class TravelRecommendationService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 3600000; // ساعة واحدة
  }

  /**
   * الحصول على توصيات مخصصة للمستخدم
   */
  async getPersonalizedRecommendations(userId, criteria = {}) {
    try {
      // التحقق من الـ cache
      const cacheKey = `recommendations_${userId}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      // جلب بيانات المستخدم
      const user = await User.findById(userId);
      if (!user) {
        return { recommendations: [] };
      }

      // جلب سجل الحجزات
      const bookings = await Booking.find({ userId })
        .populate('flightId')
        .sort({ createdAt: -1 })
        .limit(20);

      // تحليل تفضيلات المستخدم
      const preferences = this.analyzeUserPreferences(bookings);

      // جلب الرحلات المناسبة
      const flights = await this.findSuitableFlights(preferences, criteria);

      // ترتيب الرحلات حسب الملاءمة
      const recommendations = flights
        .map(flight => ({
          ...flight.toObject(),
          score: this.calculateMatchScore(flight, preferences),
          reason: this.getRecommendationReason(flight, preferences)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      // حفظ في الـ cache
      this.saveToCache(cacheKey, { recommendations });

      return { recommendations };
    } catch (error) {
      logger.error('خطأ في الحصول على التوصيات:', error);
      return { recommendations: [] };
    }
  }

  /**
   * تحليل تفضيلات المستخدم من السجل
   */
  analyzeUserPreferences(bookings) {
    const preferences = {
      favoriteAirlines: {},
      favoriteRoutes: {},
      preferredTimes: {},
      priceRange: { min: Infinity, max: 0 },
      averagePrice: 0,
      travelFrequency: {},
      stopPreference: 'direct', // أو 'any'
      departureTimePreference: 'morning' // morning, afternoon, evening
    };

    let totalPrice = 0;

    for (const booking of bookings) {
      const flight = booking.flightId;

      // تجميع شركات الطيران المفضلة
      preferences.favoriteAirlines[flight.airline] = 
        (preferences.favoriteAirlines[flight.airline] || 0) + 1;

      // تجميع المسارات المفضلة
      const route = `${flight.departure}-${flight.arrival}`;
      preferences.favoriteRoutes[route] = 
        (preferences.favoriteRoutes[route] || 0) + 1;

      // تحليل أوقات الإقلاع المفضلة
      const hour = parseInt(flight.departureTime.split(':')[0]);
      if (hour < 12) preferences.departureTimePreference = 'morning';
      else if (hour < 18) preferences.departureTimePreference = 'afternoon';
      else preferences.departureTimePreference = 'evening';

      // تحليل نطاق الأسعار
      preferences.priceRange.min = Math.min(preferences.priceRange.min, flight.price);
      preferences.priceRange.max = Math.max(preferences.priceRange.max, flight.price);
      totalPrice += flight.price;

      // تحليل عدد التوقفات
      if (flight.stops === 0) preferences.stopPreference = 'direct';
    }

    // حساب السعر المتوسط
    if (bookings.length > 0) {
      preferences.averagePrice = Math.round(totalPrice / bookings.length);
    }

    return preferences;
  }

  /**
   * البحث عن رحلات مناسبة
   */
  async findSuitableFlights(preferences, criteria) {
    try {
      let query = {
        status: 'Available',
        date: { $gte: new Date().toISOString().split('T')[0] }
      };

      // تطبيق معايير البحث
      if (criteria.departure) {
        query.departure = criteria.departure;
      }
      if (criteria.arrival) {
        query.arrival = criteria.arrival;
      }
      if (criteria.date) {
        query.date = criteria.date;
      }

      // البحث عن الرحلات
      let flights = await Flight.find(query).limit(100);

      // تصفية حسب نطاق السعر وتفضيلات المستخدم
      if (preferences.priceRange.min !== Infinity) {
        const maxPrice = preferences.priceRange.max * 1.2; // 20% أعلى من الحد الأقصى السابق
        flights = flights.filter(f => f.price <= maxPrice);
      }

      // تصفية حسب عدد التوقفات
      if (preferences.stopPreference === 'direct') {
        flights = flights.filter(f => f.stops === 0);
      }

      return flights;
    } catch (error) {
      logger.error('خطأ في البحث عن رحلات مناسبة:', error);
      return [];
    }
  }

  /**
   * حساب درجة المطابقة
   */
  calculateMatchScore(flight, preferences) {
    let score = 0;

    // درجة شركة الطيران المفضلة
    if (preferences.favoriteAirlines[flight.airline]) {
      score += 30;
    }

    // درجة نطاق السعر
    if (flight.price >= preferences.priceRange.min && 
        flight.price <= preferences.priceRange.max) {
      score += 25;
    } else if (flight.price < preferences.priceRange.max * 1.2) {
      score += 15;
    }

    // درجة وقت الإقلاع المفضل
    const hour = parseInt(flight.departureTime.split(':')[0]);
    if (preferences.departureTimePreference === 'morning' && hour < 12) {
      score += 20;
    } else if (preferences.departureTimePreference === 'afternoon' && hour >= 12 && hour < 18) {
      score += 20;
    } else if (preferences.departureTimePreference === 'evening' && hour >= 18) {
      score += 20;
    }

    // درجة عدد التوقفات
    if (flight.stops === 0 && preferences.stopPreference === 'direct') {
      score += 15;
    }

    // درجة المقاعد المتاحة
    if (flight.availableSeats > 20) {
      score += 10;
    }

    return score;
  }

  /**
   * الحصول على سبب التوصية
   */
  getRecommendationReason(flight, preferences) {
    const reasons = [];

    if (preferences.favoriteAirlines[flight.airline]) {
      reasons.push('✈️ شركة طيران مفضلة لديك');
    }

    if (flight.price < preferences.averagePrice) {
      reasons.push('💰 سعر أقل من المتوسط');
    }

    if (flight.stops === 0) {
      reasons.push('⏱️ رحلة مباشرة');
    }

    if (flight.availableSeats > 50) {
      reasons.push('🪑 عدد كبير من المقاعد المتاحة');
    }

    if (reasons.length === 0) {
      reasons.push('✅ خيار جيد');
    }

    return reasons;
  }

  /**
   * الحصول على أفضل العروض الحالية
   */
  async getBestDeals() {
    try {
      const cacheKey = 'best_deals';
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const today = new Date().toISOString().split('T')[0];
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const nextMonthStr = nextMonth.toISOString().split('T')[0];

      // البحث عن أرخص رحلات لكل مسار
      const deals = await Flight.aggregate([
        {
          $match: {
            date: { $gte: today, $lte: nextMonthStr },
            status: 'Available',
            price: { $lt: 500 }
          }
        },
        {
          $group: {
            _id: { departure: '$departure', arrival: '$arrival' },
            minPrice: { $min: '$price' },
            avgPrice: { $avg: '$price' },
            flightCount: { $sum: 1 },
            cheapestFlight: { $first: '$$ROOT' }
          }
        },
        {
          $sort: { minPrice: 1 }
        },
        {
          $limit: 10
        }
      ]);

      const result = { deals };
      this.saveToCache(cacheKey, result);

      return result;
    } catch (error) {
      logger.error('خطأ في الحصول على أفضل العروض:', error);
      return { deals: [] };
    }
  }

  /**
   * الحصول على الرحلات الشهيرة
   */
  async getPopularRoutes() {
    try {
      const cacheKey = 'popular_routes';
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const routes = await Booking.aggregate([
        {
          $lookup: {
            from: 'flights',
            localField: 'flightId',
            foreignField: '_id',
            as: 'flight'
          }
        },
        {
          $unwind: '$flight'
        },
        {
          $group: {
            _id: {
              departure: '$flight.departure',
              arrival: '$flight.arrival'
            },
            bookingCount: { $sum: 1 },
            avgRating: { $avg: '$rating' }
          }
        },
        {
          $sort: { bookingCount: -1 }
        },
        {
          $limit: 15
        }
      ]);

      const result = { routes };
      this.saveToCache(cacheKey, result);

      return result;
    } catch (error) {
      logger.error('خطأ في الحصول على الرحلات الشهيرة:', error);
      return { routes: [] };
    }
  }

  /**
   * نصائح السفر الذكية
   */
  getTravelTips() {
    return [
      {
        title: '💡 اعرف أفضل وقت للحجز',
        description: 'عادة ما تكون الأسعار أقل قبل 3-6 أسابيع من تاريخ السفر'
      },
      {
        title: '🌙 السفر في الليل يوفر المال',
        description: 'الرحلات الليلية عادة ما تكون أرخص بـ 15-20% من رحلات النهار'
      },
      {
        title: '📅 تجنب أيام نهاية الأسبوع',
        description: 'الحجز في الأيام الأسبوعية يوفر ما يصل إلى 30% من السعر'
      },
      {
        title: '✈️ اختر رحلات التوقف',
        description: 'الرحلات بها توقف قد تكون أرخص بـ 40-50% من الرحلات المباشرة'
      },
      {
        title: '🎯 استخدم المرونة في التواريخ',
        description: 'تغيير تاريخ السفر بيوم واحد قد يوفر مئات الدنانير'
      },
      {
        title: '💼 اشترك في برنامج الولاء',
        description: 'احصل على نقاط وخصومات عند الحجز مع شركات الطيران الجديرة بالثقة'
      }
    ];
  }

  /**
   * الحفظ في الـ cache
   */
  saveToCache(key, value) {
    this.cache.set(key, {
      data: value,
      timestamp: Date.now()
    });
  }

  /**
   * جلب من الـ cache
   */
  getFromCache(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.cacheExpiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  /**
   * مسح الـ cache
   */
  clearCache() {
    this.cache.clear();
  }
}

module.exports = new TravelRecommendationService();
