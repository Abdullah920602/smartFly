import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// تهيئة Firestore
const db = getFirestore();
const auth = getAuth();

/**
 * جلب جميع البيانات من Firestore وتخزينها في متغيرات
 * @returns {Object} كائن يحتوي على جميع البيانات المجلوبة
 */
export const getAllFirestore = async () => {
  try {
    console.log('بدء جلب جميع البيانات من Firestore...');
    
    // متغيرات لتخزين البيانات
    let allFlights = [];
    let allAirlines = [];
    let allUsers = [];
    let allBookings = [];
    let allAirports = [];
    let allPromotions = [];
    let allSettings = {};
    let allStatistics = {};
    
    // جلب الرحلات
    try {
      const flightsCollection = collection(db, 'flights');
      const flightsSnapshot = await getDocs(flightsCollection);
      allFlights = flightsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(`تم جلب ${allFlights.length} رحلة`);
    } catch (error) {
      console.error('خطأ في جلب الرحلات:', error);
    }
    
    // جلب شركات الطيران
    try {
      const airlinesCollection = collection(db, 'airlines');
      const airlinesSnapshot = await getDocs(airlinesCollection);
      allAirlines = airlinesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(`تم جلب ${allAirlines.length} شركة طيران`);
    } catch (error) {
      console.error('خطأ في جلب شركات الطيران:', error);
    }
    
    // جلب المستخدمين
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      allUsers = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(`تم جلب ${allUsers.length} مستخدم`);
    } catch (error) {
      console.error('خطأ في جلب المستخدمين:', error);
    }
    
    // جلب الحجوزات
    try {
      const bookingsCollection = collection(db, 'bookings');
      const bookingsSnapshot = await getDocs(bookingsCollection);
      allBookings = bookingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(`تم جلب ${allBookings.length} حجز`);
    } catch (error) {
      console.error('خطأ في جلب الحجوزات:', error);
    }
    
    // جلب المطارات
    try {
      const airportsCollection = collection(db, 'airports');
      const airportsSnapshot = await getDocs(airportsCollection);
      allAirports = airportsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(`تم جلب ${allAirports.length} مطار`);
    } catch (error) {
      console.error('خطأ في جلب المطارات:', error);
    }
    
    // جلب العروض الترويجية
    try {
      const promotionsCollection = collection(db, 'promotions');
      const promotionsSnapshot = await getDocs(promotionsCollection);
      allPromotions = promotionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(`تم جلب ${allPromotions.length} عرض ترويجي`);
    } catch (error) {
      console.error('خطأ في جلب العروض الترويجية:', error);
    }
    
    // جلب الإعدادات
    try {
      const settingsDoc = doc(db, 'settings', 'general');
      const settingsSnapshot = await getDoc(settingsDoc);
      if (settingsSnapshot.exists()) {
        allSettings = settingsSnapshot.data();
        console.log('تم جلب الإعدادات العامة');
      }
    } catch (error) {
      console.error('خطأ في جلب الإعدادات:', error);
    }
    
    // حساب الإحصائيات
    try {
      allStatistics = {
        totalFlights: allFlights.length,
        totalAirlines: allAirlines.length,
        totalUsers: allUsers.length,
        totalBookings: allBookings.length,
        totalAirports: allAirports.length,
        totalPromotions: allPromotions.length,
        activeFlights: allFlights.filter(flight => flight.status === 'Available').length,
        completedBookings: allBookings.filter(booking => booking.status === 'Completed').length,
        totalRevenue: allBookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0),
        averageFlightPrice: allFlights.length > 0 ? 
          allFlights.reduce((sum, flight) => sum + (flight.price || 0), 0) / allFlights.length : 0
      };
      console.log('تم حساب الإحصائيات');
    } catch (error) {
      console.error('خطأ في حساب الإحصائيات:', error);
    }
    
    // تجميع جميع البيانات
    const allData = {
      flights: allFlights,
      airlines: allAirlines,
      users: allUsers,
      bookings: allBookings,
      airports: allAirports,
      promotions: allPromotions,
      settings: allSettings,
      statistics: allStatistics,
      timestamp: new Date().toISOString(),
      totalRecords: allFlights.length + allAirlines.length + allUsers.length + 
                   allBookings.length + allAirports.length + allPromotions.length
    };
    
    console.log('✅ تم جلب جميع البيانات بنجاح!');
    console.log(`إجمالي السجلات: ${allData.totalRecords}`);
    
    return allData;
    
  } catch (error) {
    console.error('❌ خطأ في جلب البيانات من Firestore:', error);
    throw new Error(`فشل في جلب البيانات: ${error.message}`);
  }
};

/**
 * جلب بيانات محددة من Firestore
 * @param {string} collectionName اسم المجموعة
 * @returns {Array} مصفوفة البيانات
 */
export const getCollectionData = async (collectionName) => {
  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(`تم جلب ${data.length} سجل من ${collectionName}`);
    return data;
  } catch (error) {
    console.error(`خطأ في جلب ${collectionName}:`, error);
    throw error;
  }
};

/**
 * جلب وثيقة محددة من Firestore
 * @param {string} collectionName اسم المجموعة
 * @param {string} documentId معرف الوثيقة
 * @returns {Object} بيانات الوثيقة
 */
export const getDocumentData = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = {
        id: docSnap.id,
        ...docSnap.data()
      };
      console.log(`تم جلب الوثيقة ${documentId} من ${collectionName}`);
      return data;
    } else {
      console.log(`الوثيقة ${documentId} غير موجودة في ${collectionName}`);
      return null;
    }
  } catch (error) {
    console.error(`خطأ في جلب الوثيقة ${documentId} من ${collectionName}:`, error);
    throw error;
  }
};

/**
 * جلب إحصائيات سريعة
 * @returns {Object} الإحصائيات الأساسية
 */
export const getQuickStatistics = async () => {
  try {
    const flights = await getCollectionData('flights');
    const bookings = await getCollectionData('bookings');
    const users = await getCollectionData('users');
    
    return {
      totalFlights: flights.length,
      totalBookings: bookings.length,
      totalUsers: users.length,
      activeFlights: flights.filter(f => f.status === 'Available').length,
      completedBookings: bookings.filter(b => b.status === 'Completed').length,
      totalRevenue: bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('خطأ في جلب الإحصائيات السريعة:', error);
    throw error;
  }
};

/**
 * التحقق من حالة الاتصال بـ Firestore
 * @returns {boolean} حالة الاتصال
 */
export const checkFirestoreConnection = async () => {
  try {
    // محاولة جلب وثيقة اختبار
    const testDoc = doc(db, 'test', 'connection');
    await getDoc(testDoc);
    console.log('✅ الاتصال بـ Firestore يعمل بشكل صحيح');
    return true;
  } catch (error) {
    console.error('❌ مشكلة في الاتصال بـ Firestore:', error);
    return false;
  }
};

// تصدير الدوال المساعدة
export default {
  getAllFirestore,
  getCollectionData,
  getDocumentData,
  getQuickStatistics,
  checkFirestoreConnection
};
