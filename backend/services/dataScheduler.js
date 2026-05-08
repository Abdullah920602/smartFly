/**
 * نظام التحديثات المستمرة للبيانات
 * يحدّث بيانات الرحلات من شركات الطيران الأردنية بشكل دوري وتلقائي
 */

const cron = require('node-cron');
const jordanianAirlinesService = require('./jordanianAirlinesService');
const Flight = require('../models/Flight');
const logger = require('../utils/logger');

class DataScheduler {
  constructor() {
    this.jobs = [];
    this.isRunning = false;
  }

  /**
   * بدء جميع الوظائف المجدولة
   */
  startScheduler() {
    if (this.isRunning) {
      logger.warn('جدول التحديثات قيد التشغيل بالفعل');
      return;
    }

    try {
      this.isRunning = true;

      // تحديث البيانات كل ساعة
      this.scheduleFlightDataUpdate();

      // تحديث حالات الرحلات كل 15 دقيقة
      this.scheduleFlightStatusUpdate();

      // تنظيف البيانات القديمة يومياً
      this.scheduleDataCleanup();

      // إعادة حساب الأسعار الديناميكية كل 30 دقيقة
      this.schedulePriceUpdate();

      // تحديث إحصائيات الطيران يومياً
      this.scheduleAirlineStats();

      // تقرير يومي عن الرحلات
      this.scheduleDailyReport();

      logger.info('✅ تم بدء جدول التحديثات الآلية بنجاح');
    } catch (error) {
      logger.error('خطأ في بدء جدول التحديثات:', error);
      this.isRunning = false;
    }
  }

  /**
   * تحديث بيانات الرحلات كل ساعة
   */
  scheduleFlightDataUpdate() {
    const job = cron.schedule('0 * * * *', async () => {
      try {
        logger.info('🔄 بدء تحديث بيانات الرحلات...');
        
        const flights = await jordanianAirlinesService.fetchRealFlightData();
        await jordanianAirlinesService.saveFlightsToDatabase(flights);
        
        logger.info(`✅ تم تحديث ${flights.length} رحلة بنجاح`);
      } catch (error) {
        logger.error('❌ خطأ في تحديث بيانات الرحلات:', error);
      }
    });

    this.jobs.push(job);
  }

  /**
   * تحديث حالات الرحلات كل 15 دقيقة
   */
  scheduleFlightStatusUpdate() {
    const job = cron.schedule('*/15 * * * *', async () => {
      try {
        logger.info('🔄 بدء تحديث حالات الرحلات...');
        
        // جلب الرحلات المستقبلية القريبة
        const now = new Date();
        const inTwoDays = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
        
        const flights = await Flight.find({
          date: {
            $gte: now.toISOString().split('T')[0],
            $lte: inTwoDays.toISOString().split('T')[0]
          }
        }).limit(50);

        // تحديث عشوائي لحالات بعض الرحلات
        for (const flight of flights) {
          if (Math.random() > 0.85) { // 15% احتمالية تغيير الحالة
            const newStatus = this.getRandomStatus();
            flight.status = newStatus;
            flight.lastUpdated = new Date();
            await flight.save();
          }
        }

        logger.info(`✅ تم تحديث حالات ${flights.length} رحلة`);
      } catch (error) {
        logger.error('❌ خطأ في تحديث حالات الرحلات:', error);
      }
    });

    this.jobs.push(job);
  }

  /**
   * تنظيف البيانات القديمة يومياً (في الساعة 2 صباحاً)
   */
  scheduleDataCleanup() {
    const job = cron.schedule('0 2 * * *', async () => {
      try {
        logger.info('🧹 بدء تنظيف البيانات القديمة...');
        
        // حذف الرحلات التي انتهت قبل 3 أيام
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        
        const result = await Flight.deleteMany({
          date: { $lt: threeMonthsAgo.toISOString().split('T')[0] },
          status: 'Completed'
        });

        logger.info(`✅ تم حذف ${result.deletedCount} رحلة قديمة`);
      } catch (error) {
        logger.error('❌ خطأ في تنظيف البيانات:', error);
      }
    });

    this.jobs.push(job);
  }

  /**
   * إعادة حساب الأسعار الديناميكية كل 30 دقيقة
   */
  schedulePriceUpdate() {
    const job = cron.schedule('*/30 * * * *', async () => {
      try {
        logger.info('💰 بدء إعادة حساب الأسعار الديناميكية...');
        
        const flights = await Flight.find({
          date: { $gte: new Date().toISOString().split('T')[0] }
        }).limit(100);

        for (const flight of flights) {
          // إعادة حساب السعر بناءً على التاريخ والطلب
          const distance = this.mockDistance(flight.departure, flight.arrival);
          const basePrice = distance * 0.15;
          const flightDate = new Date(flight.date);
          
          const daysUntil = Math.floor(
            (flightDate - new Date()) / (1000 * 60 * 60 * 24)
          );

          let multiplier = 1;
          const dayOfWeek = flightDate.getDay();
          
          if (dayOfWeek === 5 || dayOfWeek === 6) multiplier = 1.3;
          if (daysUntil < 7) multiplier *= 1.4;
          else if (daysUntil > 45) multiplier *= 0.85;
          else if (daysUntil > 21) multiplier *= 0.95;

          const newPrice = Math.round(basePrice * multiplier * 0.95 + Math.random() * 0.1);
          
          if (Math.abs(newPrice - flight.price) > 5) {
            flight.price = newPrice;
            flight.lastUpdated = new Date();
            await flight.save();
          }
        }

        logger.info(`✅ تم تحديث أسعار ${flights.length} رحلة`);
      } catch (error) {
        logger.error('❌ خطأ في تحديث الأسعار:', error);
      }
    });

    this.jobs.push(job);
  }

  /**
   * تحديث إحصائيات الطيران يومياً
   */
  scheduleAirlineStats() {
    const job = cron.schedule('0 3 * * *', async () => {
      try {
        logger.info('📊 بدء تحديث إحصائيات الطيران...');
        
        const stats = await jordanianAirlinesService.getAirlineStats();
        
        // يمكن حفظ الإحصائيات في مكان ما أو إرسالها إلى الواجهة الأمامية
        logger.info(`✅ تم تحديث إحصائيات ${stats.length} شركة طيران`);
      } catch (error) {
        logger.error('❌ خطأ في تحديث الإحصائيات:', error);
      }
    });

    this.jobs.push(job);
  }

  /**
   * تقرير يومي عن الرحلات (في الساعة 8 صباحاً)
   */
  scheduleDailyReport() {
    const job = cron.schedule('0 8 * * *', async () => {
      try {
        logger.info('📈 بدء إنشاء التقرير اليومي...');
        
        const today = new Date().toISOString().split('T')[0];
        
        const todayFlights = await Flight.aggregate([
          {
            $match: {
              date: today,
              status: { $ne: 'Cancelled' }
            }
          },
          {
            $group: {
              _id: '$airline',
              count: { $sum: 1 },
              avgPrice: { $avg: '$price' },
              totalSeats: { $sum: '$totalSeats' },
              avgAvailable: { $avg: '$availableSeats' }
            }
          }
        ]);

        logger.info('📊 التقرير اليومي:');
        todayFlights.forEach(airline => {
          logger.info(
            `${airline._id}: ${airline.count} رحلة، متوسط السعر: ${Math.round(airline.avgPrice)} JOD`
          );
        });
      } catch (error) {
        logger.error('❌ خطأ في إنشاء التقرير:', error);
      }
    });

    this.jobs.push(job);
  }

  /**
   * الحصول على حالة عشوائية للرحلة
   */
  getRandomStatus() {
    const statuses = ['Available', 'Available', 'Available', 'Available', 'Available', 'Delayed', 'Delayed', 'Cancelled'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  /**
   * حساب المسافة بين المدن (للتجربة)
   */
  mockDistance(from, to) {
    const distances = {
      'Amman-Dubai': 1200,
      'Amman-Cairo': 500,
      'Amman-Beirut': 250,
      'Amman-Istanbul': 1500,
      'Amman-Baghdad': 450,
      'Amman-London': 3500,
      'Amman-Paris': 3200,
      'Amman-New York': 5000,
      'Amman-Aqaba': 180,
    };
    return distances[`${from}-${to}`] || 1000;
  }

  /**
   * إيقاف جميع الوظائف المجدولة
   */
  stopScheduler() {
    try {
      this.jobs.forEach(job => job.stop());
      this.jobs = [];
      this.isRunning = false;
      logger.info('✅ تم إيقاف جدول التحديثات');
    } catch (error) {
      logger.error('خطأ في إيقاف جدول التحديثات:', error);
    }
  }

  /**
   * الحصول على حالة الجدول
   */
  getStatus() {
    return {
      running: this.isRunning,
      jobsCount: this.jobs.length,
      jobs: this.jobs.map(job => ({
        status: job.status,
        nextExecution: job.nextDate()
      }))
    };
  }
}

module.exports = new DataScheduler();
