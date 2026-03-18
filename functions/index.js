const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');

admin.initializeApp();
const db = admin.firestore();

// تهيئة Gemini API
const genAI = new GoogleGenerativeAI(functions.config().gemini?.api_key || process.env.GEMINI_API_KEY);

// تحليل الاستعلام باستخدام Gemini
async function analyzeWithGemini(query) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
    تحليل استعلام رحلة طيران وتحويله إلى معايير بحث.
    
    استعلام المستخدم: "${query}"
    
    قم بتحليل النص واستخراج المعلومات التالية:
    - مدينة المغادرة (departure)
    - مدينة الوصول (arrival)
    - التاريخ (date) - إذا تم تحديده
    - الوقت (time) - إذا تم تحديده
    - شركة الطيران (airline) - إذا تم تحديدها
    - السعر الأقصى (maxPrice) - إذا تم تحديده
    
    أعد النتيجة كـ JSON object مع الحقول التالية:
    {
      "departure": "اسم المدينة أو null",
      "arrival": "اسم المدينة أو null", 
      "date": "التاريخ أو null",
      "time": "الوقت أو null",
      "airline": "اسم الشركة أو null",
      "maxPrice": "السعر أو null"
    }
    
    إذا لم يتم العثور على معلومات محددة، استخدم null.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      return {
        departure: null,
        arrival: null,
        date: null,
        time: null,
        airline: null,
        maxPrice: null
      };
    }
  } catch (error) {
    console.error('Error analyzing query with Gemini:', error);
    throw error;
  }
}

// البحث في Firestore بناءً على المعايير المحللة
async function searchFlightsInFirestore(parsedQuery) {
  try {
    let flightsRef = db.collection('flights');
    
    // تطبيق الفلاتر بناءً على المعايير المحللة
    if (parsedQuery.departure) {
      flightsRef = flightsRef.where('departure', '==', parsedQuery.departure);
    }
    if (parsedQuery.arrival) {
      flightsRef = flightsRef.where('arrival', '==', parsedQuery.arrival);
    }
    if (parsedQuery.airline) {
      flightsRef = flightsRef.where('airline', '==', parsedQuery.airline);
    }
    if (parsedQuery.date) {
      flightsRef = flightsRef.where('date', '==', parsedQuery.date);
    }
    
    const snapshot = await flightsRef.get();
    const flights = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // فلترة حسب السعر إذا تم تحديده
    if (parsedQuery.maxPrice) {
      return flights.filter(flight => parseFloat(flight.price) <= parseFloat(parsedQuery.maxPrice));
    }
    
    return flights;
  } catch (error) {
    console.error('Error searching flights in Firestore:', error);
    throw error;
  }
}

// Cloud Function للبحث الذكي في الرحلات
exports.searchFlights = functions.https.onRequest(async (req, res) => {
  // تمكين CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const { query } = req.body;
    
    if (!query) {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    // تحليل الاستعلام باستخدام Gemini
    const parsedQuery = await analyzeWithGemini(query);
    
    // البحث في Firestore
    const flights = await searchFlightsInFirestore(parsedQuery);
    
    res.json({ 
      flights,
      searchCriteria: parsedQuery,
      totalResults: flights.length
    });
  } catch (error) {
    console.error('Error in searchFlights function:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cloud Function لإضافة رحلة جديدة
exports.addFlight = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const flightData = req.body;
    
    if (!flightData) {
      res.status(400).json({ error: 'Flight data is required' });
      return;
    }

    const docRef = await db.collection('flights').add({
      ...flightData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'Available'
    });

    res.json({ 
      success: true, 
      flightId: docRef.id,
      message: 'Flight added successfully' 
    });
  } catch (error) {
    console.error('Error in addFlight function:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cloud Function لجلب جميع الرحلات
exports.getFlights = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const snapshot = await db.collection('flights').get();
    const flights = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    res.json({ flights });
  } catch (error) {
    console.error('Error in getFlights function:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
