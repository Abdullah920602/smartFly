// src/utils/sampleData.js
import { addFlight } from '../services/firebaseService';

// بيانات الرحلات الأردنية باستخدام المدن من popularCities
export const sampleFlights = [
  // رحلات مطابقة للصورة المعروضة
  {
    flightNumber: 'RJ-102',
    airline: 'Royal Jordanian',
    departure: 'Amman (AMM)',
    arrival: 'Aqaba (AQJ)',
    date: '2026-04-14',
    time: '08:00',
    price: 85,
    capacity: 120,
    aircraft: 'Embraer E190',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-901',
    airline: 'Royal Jordanian',
    departure: 'Istanbul (IST)',
    arrival: 'Amman (AMM)',
    date: '2026-04-14',
    time: '14:30',
    price: 250,
    capacity: 200,
    aircraft: 'Airbus A321',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-209',
    airline: 'Royal Jordanian',
    departure: 'Amman (AMM)',
    arrival: 'Beirut (BEY)',
    date: '2026-04-14',
    time: '10:30',
    price: 120,
    capacity: 140,
    aircraft: 'Airbus A319',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-505',
    airline: 'Royal Jordanian',
    departure: 'Frankfurt (FRA)',
    arrival: 'Amman (AMM)',
    date: '2026-04-14',
    time: '15:30',
    price: 620,
    capacity: 280,
    aircraft: 'Boeing 787',
    status: 'Available'
  },
  // رحلات إقليمية من عمان إلى مدن الشرق الأوسط
  {
    flightNumber: 'RJ-201',
    airline: 'Royal Jordanian',
    departure: 'Amman (AMM)',
    arrival: 'Riyadh (RUH)',
    date: '2026-04-14',
    time: '10:15',
    price: 280,
    capacity: 280,
    aircraft: 'Boeing 787',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-202',
    airline: 'Royal Jordanian',
    departure: 'Riyadh (RUH)',
    arrival: 'Amman (AMM)',
    date: '2026-04-15',
    time: '15:45',
    price: 280,
    capacity: 280,
    aircraft: 'Boeing 787',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-203',
    airline: 'Royal Jordanian',
    departure: 'Amman (AMM)',
    arrival: 'Dubai (DXB)',
    date: '2026-04-14',
    time: '11:30',
    price: 320,
    capacity: 280,
    aircraft: 'Boeing 787',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-204',
    airline: 'Royal Jordanian',
    departure: 'Dubai (DXB)',
    arrival: 'Amman (AMM)',
    date: '2026-04-15',
    time: '16:20',
    price: 320,
    capacity: 280,
    aircraft: 'Boeing 787',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-205',
    airline: 'Royal Jordanian',
    departure: 'Amman (AMM)',
    arrival: 'Cairo (CAI)',
    date: '2026-04-14',
    time: '09:00',
    price: 180,
    capacity: 160,
    aircraft: 'Airbus A320',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-206',
    airline: 'Royal Jordanian',
    departure: 'Cairo (CAI)',
    arrival: 'Amman (AMM)',
    date: '2026-04-15',
    time: '14:15',
    price: 180,
    capacity: 160,
    aircraft: 'Airbus A320',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-207',
    airline: 'Royal Jordanian',
    departure: 'Amman (AMM)',
    arrival: 'Istanbul (IST)',
    date: '2026-04-14',
    time: '12:45',
    price: 250,
    capacity: 200,
    aircraft: 'Airbus A321',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-208',
    airline: 'Royal Jordanian',
    departure: 'Istanbul (IST)',
    arrival: 'Amman (AMM)',
    date: '2026-04-15',
    time: '19:30',
    price: 250,
    capacity: 200,
    aircraft: 'Airbus A321',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-209',
    airline: 'Royal Jordanian',
    departure: 'Amman (AMM)',
    arrival: 'Beirut (BEY)',
    date: '2026-04-14',
    time: '10:30',
    price: 120,
    capacity: 140,
    aircraft: 'Airbus A319',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-210',
    airline: 'Royal Jordanian',
    departure: 'Beirut (BEY)',
    arrival: 'Amman (AMM)',
    date: '2026-04-15',
    time: '17:20',
    price: 120,
    capacity: 140,
    aircraft: 'Airbus A319',
    status: 'Available'
  },
  // رحلات إلى مدن الخليج
  {
    flightNumber: 'RJ-301',
    airline: 'Royal Jordanian',
    departure: 'Amman (AMM)',
    arrival: 'Kuwait (KWI)',
    date: '2026-04-14',
    time: '14:00',
    price: 220,
    capacity: 180,
    aircraft: 'Airbus A320',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-302',
    airline: 'Royal Jordanian',
    departure: 'Kuwait (KWI)',
    arrival: 'Amman (AMM)',
    date: '2026-04-15',
    time: '21:30',
    price: 220,
    capacity: 180,
    aircraft: 'Airbus A320',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-303',
    airline: 'Royal Jordanian',
    departure: 'Amman (AMM)',
    arrival: 'Doha (DOH)',
    date: '2026-04-14',
    time: '13:15',
    price: 280,
    capacity: 200,
    aircraft: 'Airbus A321',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-304',
    airline: 'Royal Jordanian',
    departure: 'Doha (DOH)',
    arrival: 'Amman (AMM)',
    date: '2026-04-15',
    time: '20:45',
    price: 280,
    capacity: 200,
    aircraft: 'Airbus A321',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-305',
    airline: 'Royal Jordanian',
    departure: 'Amman (AMM)',
    arrival: 'Abu Dhabi (AUH)',
    date: '2026-04-14',
    time: '11:45',
    price: 260,
    capacity: 190,
    aircraft: 'Airbus A320',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-306',
    airline: 'Royal Jordanian',
    departure: 'Abu Dhabi (AUH)',
    arrival: 'Amman (AMM)',
    date: '2026-04-15',
    time: '19:20',
    price: 260,
    capacity: 190,
    aircraft: 'Airbus A320',
    status: 'Available'
  },
  // رحلات إلى شمال أفريقيا
  {
    flightNumber: 'RJ-401',
    airline: 'Royal Jordanian',
    departure: 'Amman (AMM)',
    arrival: 'Casablanca (CMN)',
    date: '2026-04-14',
    time: '15:30',
    price: 450,
    capacity: 250,
    aircraft: 'Airbus A330',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-402',
    airline: 'Royal Jordanian',
    departure: 'Casablanca (CMN)',
    arrival: 'Amman (AMM)',
    date: '2026-04-16',
    time: '22:10',
    price: 450,
    capacity: 250,
    aircraft: 'Airbus A330',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-403',
    airline: 'Royal Jordanian',
    departure: 'Amman (AMM)',
    arrival: 'Algiers (ALG)',
    date: '2026-04-14',
    time: '16:45',
    price: 420,
    capacity: 240,
    aircraft: 'Airbus A321',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-404',
    airline: 'Royal Jordanian',
    departure: 'Algiers (ALG)',
    arrival: 'Amman (AMM)',
    date: '2026-04-16',
    time: '23:30',
    price: 420,
    capacity: 240,
    aircraft: 'Airbus A321',
    status: 'Available'
  },
  // رحلات إلى أوروبا
  {
    flightNumber: 'RJ-501',
    airline: 'Royal Jordanian',
    departure: 'Amman (AMM)',
    arrival: 'London (LHR)',
    date: '2026-04-14',
    time: '13:20',
    price: 650,
    capacity: 280,
    aircraft: 'Boeing 787',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-502',
    airline: 'Royal Jordanian',
    departure: 'London (LHR)',
    arrival: 'Amman (AMM)',
    date: '2026-04-15',
    time: '22:15',
    price: 650,
    capacity: 280,
    aircraft: 'Boeing 787',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-503',
    airline: 'Royal Jordanian',
    departure: 'Amman (AMM)',
    arrival: 'Paris (CDG)',
    date: '2026-04-14',
    time: '14:00',
    price: 580,
    capacity: 250,
    aircraft: 'Airbus A330',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-504',
    airline: 'Royal Jordanian',
    departure: 'Paris (CDG)',
    arrival: 'Amman (AMM)',
    date: '2026-04-15',
    time: '20:45',
    price: 580,
    capacity: 250,
    aircraft: 'Airbus A330',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-505',
    airline: 'Royal Jordanian',
    departure: 'Amman (AMM)',
    arrival: 'Frankfurt (FRA)',
    date: '2026-04-14',
    time: '15:30',
    price: 620,
    capacity: 280,
    aircraft: 'Boeing 787',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-506',
    airline: 'Royal Jordanian',
    departure: 'Frankfurt (FRA)',
    arrival: 'Amman (AMM)',
    date: '2026-04-15',
    time: '23:10',
    price: 620,
    capacity: 280,
    aircraft: 'Boeing 787',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-507',
    airline: 'Royal Jordanian',
    departure: 'Amman (AMM)',
    arrival: 'Amsterdam (AMS)',
    date: '2026-04-14',
    time: '12:15',
    price: 590,
    capacity: 270,
    aircraft: 'Boeing 787',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-508',
    airline: 'Royal Jordanian',
    departure: 'Amsterdam (AMS)',
    arrival: 'Amman (AMM)',
    date: '2026-04-15',
    time: '21:45',
    price: 590,
    capacity: 270,
    aircraft: 'Boeing 787',
    status: 'Available'
  },
  // رحلات إلى أمريكا الشمالية
  {
    flightNumber: 'RJ-601',
    airline: 'Royal Jordanian',
    departure: 'Amman (AMM)',
    arrival: 'New York (JFK)',
    date: '2026-04-14',
    time: '16:00',
    price: 850,
    capacity: 320,
    aircraft: 'Boeing 777',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-602',
    airline: 'Royal Jordanian',
    departure: 'New York (JFK)',
    arrival: 'Amman (AMM)',
    date: '2026-04-16',
    time: '23:30',
    price: 850,
    capacity: 320,
    aircraft: 'Boeing 777',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-603',
    airline: 'Royal Jordanian',
    departure: 'Amman (AMM)',
    arrival: 'Toronto (YYZ)',
    date: '2026-04-14',
    time: '17:30',
    price: 780,
    capacity: 300,
    aircraft: 'Boeing 777',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-604',
    airline: 'Royal Jordanian',
    departure: 'Toronto (YYZ)',
    arrival: 'Amman (AMM)',
    date: '2026-04-16',
    time: '01:15',
    price: 780,
    capacity: 300,
    aircraft: 'Boeing 777',
    status: 'Available'
  },
  // رحلات إلى آسيا
  {
    flightNumber: 'RJ-701',
    airline: 'Royal Jordanian',
    departure: 'Amman (AMM)',
    arrival: 'Tokyo (NRT)',
    date: '2026-04-14',
    time: '18:45',
    price: 920,
    capacity: 350,
    aircraft: 'Boeing 777',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-702',
    airline: 'Royal Jordanian',
    departure: 'Tokyo (NRT)',
    arrival: 'Amman (AMM)',
    date: '2026-04-16',
    time: '02:30',
    price: 920,
    capacity: 350,
    aircraft: 'Boeing 777',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-703',
    airline: 'Royal Jordanian',
    departure: 'Amman (AMM)',
    arrival: 'Singapore (SIN)',
    date: '2026-04-14',
    time: '15:20',
    price: 880,
    capacity: 330,
    aircraft: 'Boeing 777',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-704',
    airline: 'Royal Jordanian',
    departure: 'Singapore (SIN)',
    arrival: 'Amman (AMM)',
    date: '2026-04-16',
    time: '03:45',
    price: 880,
    capacity: 330,
    aircraft: 'Boeing 777',
    status: 'Available'
  },
  // رحلات شركة طيران أخرى
  {
    flightNumber: 'JY-101',
    airline: 'Jazeera Airways Jordan',
    departure: 'Amman (AMM)',
    arrival: 'Manama (BAH)',
    date: '2026-04-14',
    time: '11:30',
    price: 200,
    capacity: 170,
    aircraft: 'Airbus A319',
    status: 'Available'
  },
  {
    flightNumber: 'JY-102',
    airline: 'Jazeera Airways Jordan',
    departure: 'Manama (BAH)',
    arrival: 'Amman (AMM)',
    date: '2026-04-15',
    time: '18:45',
    price: 200,
    capacity: 170,
    aircraft: 'Airbus A319',
    status: 'Available'
  },
  {
    flightNumber: 'JY-103',
    airline: 'Jazeera Airways Jordan',
    departure: 'Amman (AMM)',
    arrival: 'Muscat (MCT)',
    date: '2026-04-14',
    time: '13:45',
    price: 240,
    capacity: 180,
    aircraft: 'Airbus A320',
    status: 'Available'
  },
  {
    flightNumber: 'JY-104',
    airline: 'Jazeera Airways Jordan',
    departure: 'Muscat (MCT)',
    arrival: 'Amman (AMM)',
    date: '2026-04-15',
    time: '21:00',
    price: 240,
    capacity: 180,
    aircraft: 'Airbus A320',
    status: 'Available'
  }
];

// دالة لإضافة جميع البيانات الوهمية
export const addSampleData = async () => {
  try {
    console.log('بدء إضافة البيانات الوهمية...');
    
    for (const flight of sampleFlights) {
      await addFlight(flight);
      console.log(`تم إضافة رحلة: ${flight.flightNumber}`);
    }
    
    console.log('تم إضافة جميع البيانات الوهمية بنجاح!');
    return true;
  } catch (error) {
    console.error('خطأ في إضافة البيانات الوهمية:', error);
    return false;
  }
};

// دالة لإضافة رحلة واحدة للاختبار
export const addSingleFlight = async (flightData) => {
  try {
    await addFlight(flightData);
    console.log('تم إضافة الرحلة بنجاح!');
    return true;
  } catch (error) {
    console.error('خطأ في إضافة الرحلة:', error);
    return false;
  }
};

// دالة لإضافة البيانات الوهمية من وحدة التحكم
export const addSampleDataFromConsole = async () => {
  try {
    console.log('بدء إضافة البيانات الوهمية من وحدة التحكم...');
    const success = await addSampleData();
    if (success) {
      console.log('✅ تم إضافة جميع البيانات الوهمية بنجاح!');
      console.log(`📊 تم إضافة ${sampleFlights.length} رحلة إلى قاعدة البيانات`);
    } else {
      console.log('❌ فشل في إضافة البيانات الوهمية');
    }
    return success;
  } catch (error) {
    console.error('❌ خطأ في إضافة البيانات الوهمية:', error);
    return false;
  }
};

// تصدير الدالة للاستخدام في وحدة التحكم
if (typeof window !== 'undefined') {
  window.addSampleDataFromConsole = addSampleDataFromConsole;
  console.log('🚀 يمكنك الآن استخدام addSampleDataFromConsole() في وحدة التحكم لإضافة البيانات الوهمية');
}
