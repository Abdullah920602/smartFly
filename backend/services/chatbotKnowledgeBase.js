/**
 * قاعدة معارف شاملة للشات بوت SmartFly
 * تحتوي على جميع المعلومات اللازمة للإجابة على أي سؤال عن الطيران في الأردن
 */

class ChatbotKnowledgeBase {
  constructor() {
    this.airlines = {
      jordanian: [
        {
          code: 'RJ',
          name: 'الملكية الأردنية',
          englishName: 'Royal Jordanian',
          type: 'official',
          founded: 1963,
          hub: 'Amman',
          fleet: 35,
          destinations: 50,
          rating: 4.2,
          services: ['درجة اقتصادية', 'درجة رجال الأعمال', 'درجة أولى'],
          baggage: {
            economy: 23,
            business: 30,
            first: 40
          },
          contact: {
            phone: '+962 6 500 0000',
            website: 'www.rj.com',
            email: 'info@rj.com'
          }
        },
        {
          code: 'JF',
          name: 'الأردنية للصقور',
          englishName: 'Jordanian Falcons',
          type: 'regional',
          founded: 2015,
          hub: 'Amman',
          fleet: 8,
          destinations: 12,
          rating: 3.8,
          services: ['درجة اقتصادية', 'درجة رجال الأعمال'],
          baggage: {
            economy: 20,
            business: 25
          },
          contact: {
            phone: '+962 6 510 0000',
            website: 'www.falconsair.com',
            email: 'info@falconsair.com'
          }
        },
        {
          code: 'WG',
          name: 'طيران العقاب',
          englishName: 'Wings Airline',
          type: 'domestic',
          founded: 2018,
          hub: 'Amman',
          fleet: 5,
          destinations: 6,
          rating: 3.5,
          services: ['درجة اقتصادية'],
          baggage: {
            economy: 15
          },
          contact: {
            phone: '+962 6 520 0000',
            website: 'www.wingsairline.com',
            email: 'info@wingsairline.com'
          }
        }
      ],
      international: [
        {
          code: 'FZ',
          name: 'طيران الخليج',
          englishName: 'FlyDubai',
          country: 'UAE',
          rating: 4.0,
          services: ['درجة اقتصادية', 'درجة رجال الأعمال']
        },
        {
          code: 'SV',
          name: 'الخطوط الجوية العربية السعودية',
          englishName: 'Saudi Airlines',
          country: 'Saudi Arabia',
          rating: 3.9,
          services: ['درجة اقتصادية', 'درجة رجال الأعمال']
        },
        {
          code: 'MS',
          name: 'مصر للطيران',
          englishName: 'Egypt Air',
          country: 'Egypt',
          rating: 3.7,
          services: ['درجة اقتصادية', 'درجة رجال الأعمال']
        }
      ]
    };

    this.destinations = {
      domestic: [
        {
          city: 'Amman',
          arabicName: 'عمّان',
          code: 'AMM',
          airport: 'Queen Alia International',
          arabicAirport: 'مطار الملكة علياء الدولي',
          description: 'العاصمة الأردنية ومركز الطيران الرئيسي'
        },
        {
          city: 'Aqaba',
          arabicName: 'العقبة',
          code: 'AQJ',
          airport: 'King Hussein International',
          arabicAirport: 'مطار الملك حسين الدولي',
          description: 'المدينة الساحلية والوجهة السياحية الرئيسية'
        }
      ],
      regional: [
        {
          city: 'Dubai',
          arabicName: 'دبي',
          code: 'DXB',
          country: 'UAE',
          arabicCountry: 'الإمارات',
          distance: 1200,
          flightTime: '3 ساعات',
          priceRange: '220-350 دينار',
          popular: true
        },
        {
          city: 'Cairo',
          arabicName: 'القاهرة',
          code: 'CAI',
          country: 'Egypt',
          arabicCountry: 'مصر',
          distance: 500,
          flightTime: '1.5 ساعة',
          priceRange: '150-220 دينار',
          popular: true
        },
        {
          city: 'Beirut',
          arabicName: 'بيروت',
          code: 'BEY',
          country: 'Lebanon',
          arabicCountry: 'لبنان',
          distance: 250,
          flightTime: '50 دقيقة',
          priceRange: '95-150 دينار',
          popular: true
        },
        {
          city: 'Istanbul',
          arabicName: 'اسطنبول',
          code: 'IST',
          country: 'Turkey',
          arabicCountry: 'تركيا',
          distance: 1500,
          flightTime: '3 ساعات',
          priceRange: '280-450 دينار',
          popular: true
        },
        {
          city: 'Baghdad',
          arabicName: 'بغداد',
          code: 'BGW',
          country: 'Iraq',
          arabicCountry: 'العراق',
          distance: 450,
          flightTime: '1.25 ساعة',
          priceRange: '120-180 دينار',
          popular: false
        },
        {
          city: 'Riyadh',
          arabicName: 'الرياض',
          code: 'RUH',
          country: 'Saudi Arabia',
          arabicCountry: 'السعودية',
          distance: 900,
          flightTime: '2.5 ساعة',
          priceRange: '200-320 دينار',
          popular: false
        },
        {
          city: 'Bahrain',
          arabicName: 'البحرين',
          code: 'BAH',
          country: 'Bahrain',
          arabicCountry: 'البحرين',
          distance: 800,
          flightTime: '2.25 ساعة',
          priceRange: '180-280 دينار',
          popular: false
        }
      ],
      international: [
        {
          city: 'London',
          arabicName: 'لندن',
          code: 'LHR',
          country: 'UK',
          arabicCountry: 'بريطانيا',
          distance: 3500,
          flightTime: '5.5 ساعة',
          priceRange: '520-850 دينار',
          popular: true
        },
        {
          city: 'Paris',
          arabicName: 'باريس',
          code: 'CDG',
          country: 'France',
          arabicCountry: 'فرنسا',
          distance: 3200,
          flightTime: '5 ساعات',
          priceRange: '480-750 دينار',
          popular: true
        },
        {
          city: 'New York',
          arabicName: 'نيويورك',
          code: 'JFK',
          country: 'USA',
          arabicCountry: 'أمريكا',
          distance: 5000,
          flightTime: '10 ساعات',
          priceRange: '750-1200 دينار',
          popular: true
        },
        {
          city: 'Frankfurt',
          arabicName: 'فرانكفورت',
          code: 'FRA',
          country: 'Germany',
          arabicCountry: 'ألمانيا',
          distance: 3000,
          flightTime: '4.5 ساعة',
          priceRange: '450-700 دينار',
          popular: false
        }
      ]
    };

    this.services = {
      booking: {
        methods: ['إلكتروني', 'هاتف', 'في المطار', 'في مكاتب الشركة'],
        payment: ['بطاقة ائتمانية', 'باي بال', 'تحويل بنكي', 'نقداً'],
        modification: {
          deadline: '24 ساعة قبل الإقلاع',
          fees: 'تعتمد على نوع التذكرة والوجهة',
          refund: 'ممكن استرداد الأموال حسب سياسة الإلغاء'
        }
      },
      baggage: {
        standard: {
          economy: '23 كيلوجرام',
          business: '30 كيلوجرام',
          first: '40 كيلوجرام'
        },
        extra: {
          fees: '10-20 دينار لكل كيلوجرام إضافي',
          limit: 'أقصى 32 كيلوجرام للقطعة الواحدة'
        },
        prohibited: ['مواد قابلة للاشتعال', 'أسلحة', 'مواد خطرة', 'سوائل أكثر من 100 مل']
      },
      meals: {
        economy: ['وجبة خفيفة', 'مشروبات', 'وجبات خاصة بطلب'],
        business: ['وجبة كاملة', 'مشروبات متنوعة', 'وجبات خاصة'],
        first: ['وجبات فاخرة', 'مشروبات فاخرة', 'قائمة طعام حسب الطلب'],
        special: ['نباتي', 'حلال', 'كوشر', 'بدون غلوتين', 'وجبات أطفال']
      },
      checkIn: {
        online: {
          start: '48 ساعة قبل الإقلاع',
          end: 'ساعتان قبل الإقلاع',
          method: 'الموقع الإلكتروني أو التطبيق'
        },
        airport: {
          economy: '3 ساعات قبل الإقلاع (دولي)، ساعتان (إقليمي)',
          business: 'ساعتان قبل الإقلاع',
          first: 'ساعة واحدة قبل الإقلاع'
        }
      }
    };

    this.policies = {
      cancellation: {
        refundable: 'استرداد كامل مع خصم بسيط',
        nonRefundable: 'لا استرداد إلا في حالات الطوارئ',
        partial: 'استرداد جزئي حسب وقت الإلغاء'
      },
      delays: {
        short: 'تأخير أقل من ساعتين - لا تعويض',
        medium: 'تأخير 2-4 ساعات - وجبة ومشروبات',
        long: 'تأخير أكثر من 4 ساعات - إعادة حجز أو استرداد'
      },
      specialAssistance: {
        available: ['كبار السن', 'الأطفال', 'ذوي الاحتياجات الخاصة', 'المرضى'],
        request: 'يجب طلبها 48 ساعة قبل الرحلة',
        services: ['كرسي متحرك', 'مساعدة في المطار', 'وجبات خاصة']
      }
    };

    this.emergency = {
      contacts: {
        main: '+962 6 500 0000',
        emergency: '+962 6 500 1111',
        whatsapp: '+962 7 9000 0000',
        email: 'emergency@smartfly.jo'
      },
      services: [
        'تتبع الحجوزات',
        'مساعدة في حالات فقدان الأمتعة',
        'إعادة الحجز في حالات الطوارئ',
        'توفير مكان إقامة بديل',
        'نقل طبي إذا لزم الأمر'
      ]
    };
  }

  /**
   * البحث عن معلومات شركة طيران
   */
  getAirlineInfo(airlineCode) {
    const allAirlines = [...this.airlines.jordanian, ...this.airlines.international];
    return allAirlines.find(airline => 
      airline.code.toLowerCase() === airlineCode.toLowerCase() ||
      airline.name.toLowerCase().includes(airlineCode.toLowerCase()) ||
      airline.englishName.toLowerCase().includes(airlineCode.toLowerCase())
    );
  }

  /**
   * البحث عن معلومات الوجهة
   */
  getDestinationInfo(cityCode) {
    const allDestinations = [...this.destinations.domestic, ...this.destinations.regional, ...this.destinations.international];
    return allDestinations.find(dest => 
      dest.code.toLowerCase() === cityCode.toLowerCase() ||
      dest.city.toLowerCase().includes(cityCode.toLowerCase()) ||
      dest.arabicName.toLowerCase().includes(cityCode.toLowerCase())
    );
  }

  /**
   * الحصول على معلومات الأسعار
   */
  getPricingInfo(fromCity, toCity) {
    const from = this.getDestinationInfo(fromCity);
    const to = this.getDestinationInfo(toCity);
    
    if (!from || !to) return null;

    const distance = Math.abs(to.distance - (from.distance || 0));
    let basePrice = 0;

    if (to.priceRange) {
      const prices = to.priceRange.match(/\d+/g);
      if (prices) {
        basePrice = (parseInt(prices[0]) + parseInt(prices[1])) / 2;
      }
    }

    return {
      from,
      to,
      distance,
      basePrice,
      priceRange: to.priceRange,
      flightTime: to.flightTime,
      popular: to.popular
    };
  }

  /**
   * الحصول على معلومات الخدمات
   */
  getServiceInfo(serviceType) {
    return this.services[serviceType] || null;
  }

  /**
   * الحصول على معلومات السياسات
   */
  getPolicyInfo(policyType) {
    return this.policies[policyType] || null;
  }

  /**
   * الحصول على معلومات الطوارئ
   */
  getEmergencyInfo() {
    return this.emergency;
  }

  /**
   * البحث الشامل في قاعدة المعارف
   */
  search(query) {
    const results = {
      airlines: [],
      destinations: [],
      services: [],
      policies: []
    };

    const lowerQuery = query.toLowerCase();

    // البحث في شركات الطيران
    results.airlines = this.airlines.jordanian.filter(airline => 
      airline.name.toLowerCase().includes(lowerQuery) ||
      airline.englishName.toLowerCase().includes(lowerQuery) ||
      airline.code.toLowerCase().includes(lowerQuery)
    );

    // البحث في الوجهات
    const allDestinations = [...this.destinations.domestic, ...this.destinations.regional, ...this.destinations.international];
    results.destinations = allDestinations.filter(dest => 
      dest.city.toLowerCase().includes(lowerQuery) ||
      dest.arabicName.toLowerCase().includes(lowerQuery) ||
      dest.code.toLowerCase().includes(lowerQuery)
    );

    // البحث في الخدمات
    if (['حجز', 'booking', 'دفع', 'payment'].some(k => lowerQuery.includes(k))) {
      results.services.push(this.services.booking);
    }
    if (['أمتعة', 'baggage', 'حقائب', 'luggage'].some(k => lowerQuery.includes(k))) {
      results.services.push(this.services.baggage);
    }
    if (['وجبة', 'meal', 'طعام', 'food'].some(k => lowerQuery.includes(k))) {
      results.services.push(this.services.meals);
    }
    if (['تسجيل', 'checkin', 'وصول', 'arrival'].some(k => lowerQuery.includes(k))) {
      results.services.push(this.services.checkIn);
    }

    // البحث في السياسات
    if (['إلغاء', 'cancellation', 'استرداد', 'refund'].some(k => lowerQuery.includes(k))) {
      results.policies.push(this.policies.cancellation);
    }
    if (['تأخير', 'delay', 'متأخر', 'late'].some(k => lowerQuery.includes(k))) {
      results.policies.push(this.policies.delays);
    }
    if (['مساعدة', 'assistance', 'خاص', 'special'].some(k => lowerQuery.includes(k))) {
      results.policies.push(this.policies.specialAssistance);
    }

    return results;
  }
}

module.exports = new ChatbotKnowledgeBase();
