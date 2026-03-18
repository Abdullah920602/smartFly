// src/utils/sampleData.js
import { addFlight } from '../services/firebaseService';

// بيانات الرحلات الأردنية
export const sampleFlights = [
  // رحلات الملكية الأردنية الداخلية
  {
    flightNumber: 'RJ-101',
    airline: 'Royal Jordanian',
    departure: 'Amman',
    arrival: 'Aqaba',
    date: '2025-09-05',
    time: '08:00',
    price: 85,
    capacity: 120,
    aircraft: 'Embraer E190',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-102',
    airline: 'Royal Jordanian',
    departure: 'Aqaba',
    arrival: 'Amman',
    date: '2025-09-05',
    time: '18:30',
    price: 85,
    capacity: 120,
    aircraft: 'Embraer E190',
    status: 'Available'
  },
  // رحلات إقليمية من عمان
  {
    flightNumber: 'RJ-201',
    airline: 'Royal Jordanian',
    departure: 'Amman',
    arrival: 'Dubai',
    date: '2025-09-06',
    time: '10:15',
    price: 320,
    capacity: 280,
    aircraft: 'Boeing 787',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-202',
    airline: 'Royal Jordanian',
    departure: 'Dubai',
    arrival: 'Amman',
    date: '2025-09-06',
    time: '15:45',
    price: 320,
    capacity: 280,
    aircraft: 'Boeing 787',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-301',
    airline: 'Royal Jordanian',
    departure: 'Amman',
    arrival: 'Cairo',
    date: '2025-09-07',
    time: '11:30',
    price: 180,
    capacity: 160,
    aircraft: 'Airbus A320',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-302',
    airline: 'Royal Jordanian',
    departure: 'Cairo',
    arrival: 'Amman',
    date: '2025-09-07',
    time: '16:20',
    price: 180,
    capacity: 160,
    aircraft: 'Airbus A320',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-401',
    airline: 'Royal Jordanian',
    departure: 'Amman',
    arrival: 'Beirut',
    date: '2025-09-08',
    time: '09:00',
    price: 120,
    capacity: 140,
    aircraft: 'Airbus A319',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-402',
    airline: 'Royal Jordanian',
    departure: 'Beirut',
    arrival: 'Amman',
    date: '2025-09-08',
    time: '14:15',
    price: 120,
    capacity: 140,
    aircraft: 'Airbus A319',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-501',
    airline: 'Royal Jordanian',
    departure: 'Amman',
    arrival: 'Doha',
    date: '2025-09-09',
    time: '12:45',
    price: 280,
    capacity: 200,
    aircraft: 'Airbus A321',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-502',
    airline: 'Royal Jordanian',
    departure: 'Doha',
    arrival: 'Amman',
    date: '2025-09-09',
    time: '19:30',
    price: 280,
    capacity: 200,
    aircraft: 'Airbus A321',
    status: 'Available'
  },
  // رحلات دولية من عمان
  {
    flightNumber: 'RJ-601',
    airline: 'Royal Jordanian',
    departure: 'Amman',
    arrival: 'London',
    date: '2025-09-10',
    time: '13:20',
    price: 650,
    capacity: 280,
    aircraft: 'Boeing 787',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-602',
    airline: 'Royal Jordanian',
    departure: 'London',
    arrival: 'Amman',
    date: '2025-09-11',
    time: '22:15',
    price: 650,
    capacity: 280,
    aircraft: 'Boeing 787',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-701',
    airline: 'Royal Jordanian',
    departure: 'Amman',
    arrival: 'Paris',
    date: '2025-09-12',
    time: '14:00',
    price: 580,
    capacity: 250,
    aircraft: 'Airbus A330',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-702',
    airline: 'Royal Jordanian',
    departure: 'Paris',
    arrival: 'Amman',
    date: '2025-09-12',
    time: '20:45',
    price: 580,
    capacity: 250,
    aircraft: 'Airbus A330',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-801',
    airline: 'Royal Jordanian',
    departure: 'Amman',
    arrival: 'Frankfurt',
    date: '2025-09-13',
    time: '15:30',
    price: 620,
    capacity: 280,
    aircraft: 'Boeing 787',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-802',
    airline: 'Royal Jordanian',
    departure: 'Frankfurt',
    arrival: 'Amman',
    date: '2025-09-13',
    time: '23:10',
    price: 620,
    capacity: 280,
    aircraft: 'Boeing 787',
    status: 'Available'
  },
  // رحلات شركات أردنية أخرى
  {
    flightNumber: 'JY-201',
    airline: 'Jazeera Airways Jordan',
    departure: 'Amman',
    arrival: 'Kuwait',
    date: '2025-09-14',
    time: '16:00',
    price: 220,
    capacity: 180,
    aircraft: 'Airbus A320',
    status: 'Available'
  },
  {
    flightNumber: 'JY-202',
    airline: 'Jazeera Airways Jordan',
    departure: 'Kuwait',
    arrival: 'Amman',
    date: '2025-09-14',
    time: '21:30',
    price: 220,
    capacity: 180,
    aircraft: 'Airbus A320',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-901',
    airline: 'Royal Jordanian',
    departure: 'Amman',
    arrival: 'Istanbul',
    date: '2025-09-15',
    time: '17:15',
    price: 380,
    capacity: 200,
    aircraft: 'Airbus A321',
    status: 'Available'
  },
  {
    flightNumber: 'RJ-902',
    airline: 'Royal Jordanian',
    departure: 'Istanbul',
    arrival: 'Amman',
    date: '2025-09-15',
    time: '22:45',
    price: 380,
    capacity: 200,
    aircraft: 'Airbus A321',
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
