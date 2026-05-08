/**
 * نظام تحسينات الأداء والـ Caching
 * تحسينات عالية الأداء لتسريع التطبيق
 */

const NodeCache = require('node-cache');
const logger = require('../utils/logger');

class PerformanceManager {
  constructor() {
    // إعدادات الـ cache المختلفة
    this.flightCache = new NodeCache({ stdTTL: 300 }); // 5 دقائق
    this.userCache = new NodeCache({ stdTTL: 600 }); // 10 دقائق
    this.statsCache = new NodeCache({ stdTTL: 3600 }); // ساعة واحدة
    
    this.stats = {
      cacheHits: 0,
      cacheMisses: 0,
      requestsProcessed: 0,
      averageResponseTime: 0
    };
  }

  /**
   * middleware لتحديث الأداء
   */
  performanceMiddleware() {
    const self = this;
    return (req, res, next) => {
      const startTime = Date.now();

      const originalJson = res.json.bind(res);
      res.json = function(data) {
        const duration = Date.now() - startTime;
        
        self.stats.requestsProcessed++;
        
        // حساب متوسط وقت الاستجابة
        const avgTime = self.stats.averageResponseTime;
        self.stats.averageResponseTime = 
          (avgTime * (self.stats.requestsProcessed - 1) + duration) / 
          self.stats.requestsProcessed;

        res.set('X-Response-Time', `${duration}ms`);
        
        if (duration > 1000) {
          logger.warn(`⚠️ استغرق الطلب وقتاً طويلاً: ${duration}ms - ${req.path}`);
        }

        return originalJson(data);
      };

      next();
    };
  }

  /**
   * حفظ الرحلات في الـ cache
   */
  cacheFlights(query, flights) {
    const key = this.generateCacheKey('flights', query);
    this.flightCache.set(key, flights);
    logger.debug(`💾 تم حفظ ${flights.length} رحلة في الـ cache`);
  }

  /**
   * جلب الرحلات من الـ cache
   */
  getFlightsFromCache(query) {
    const key = this.generateCacheKey('flights', query);
    const cached = this.flightCache.get(key);
    
    if (cached) {
      this.stats.cacheHits++;
      logger.debug(`✅ تم استرجاع الرحلات من الـ cache`);
    } else {
      this.stats.cacheMisses++;
    }
    
    return cached;
  }

  /**
   * حفظ بيانات المستخدم في الـ cache
   */
  cacheUserData(userId, data) {
    this.userCache.set(`user_${userId}`, data);
  }

  /**
   * جلب بيانات المستخدم من الـ cache
   */
  getUserDataFromCache(userId) {
    return this.userCache.get(`user_${userId}`);
  }

  /**
   * حفظ الإحصائيات في الـ cache
   */
  cacheStats(key, stats) {
    this.statsCache.set(key, stats);
  }

  /**
   * جلب الإحصائيات من الـ cache
   */
  getStatsFromCache(key) {
    return this.statsCache.get(key);
  }

  /**
   * توليد مفتاح الـ cache
   */
  generateCacheKey(type, query) {
    return `${type}_${JSON.stringify(query)}`.replace(/\s+/g, '');
  }

  /**
   * مسح الـ cache
   */
  clearAllCache() {
    this.flightCache.flushAll();
    this.userCache.flushAll();
    this.statsCache.flushAll();
    logger.info('🧹 تم مسح جميع الـ cache');
  }

  /**
   * مسح الـ cache للرحلات
   */
  clearFlightsCache() {
    this.flightCache.flushAll();
    logger.info('🧹 تم مسح cache الرحلات');
  }

  /**
   * الحصول على إحصائيات الأداء
   */
  getPerformanceStats() {
    const totalRequests = this.stats.requestsProcessed;
    const hitRate = totalRequests > 0 
      ? (this.stats.cacheHits / (this.stats.cacheHits + this.stats.cacheMisses) * 100).toFixed(2)
      : 0;

    return {
      requestsProcessed: totalRequests,
      cacheHits: this.stats.cacheHits,
      cacheMisses: this.stats.cacheMisses,
      hitRate: `${hitRate}%`,
      averageResponseTime: `${this.stats.averageResponseTime.toFixed(2)}ms`,
      cacheStats: {
        flights: this.flightCache.getStats(),
        users: this.userCache.getStats(),
        stats: this.statsCache.getStats()
      }
    };
  }

  /**
   * تحسين استعلامات قاعدة البيانات
   */
  optimizeQuery(model, query, options = {}) {
    return model
      .find(query)
      .select(options.select || '')
      .limit(options.limit || 100)
      .lean() // إرجاع Plain JavaScript Objects بدلاً من Model instances
      .exec();
  }

  /**
   * تجميع الاستعلامات (Query Batching)
   */
  async batchQueries(queries) {
    return Promise.all(queries);
  }

  /**
   * ضغط البيانات المرسلة
   */
  compressionMiddleware() {
    const compression = require('compression');
    return compression({
      level: 6,
      threshold: 1024, // بايت
      filter: (req, res) => {
        if (req.headers['x-no-compression']) {
          return false;
        }
        return compression.filter(req, res);
      }
    });
  }
}

module.exports = new PerformanceManager();
