// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs, query, where, orderBy, deleteDoc, updateDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACEJkJRFoCN666hCHEWs9MvbKmVngwTWU",
  authDomain: "popoop-ecf85.firebaseapp.com",
  projectId: "popoop-ecf85",
  storageBucket: "popoop-ecf85.appspot.com",
  messagingSenderId: "264748021798",
  appId: "1:264748021798:web:221169eca4c710c4a40ee7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// إضافة رحلة جديدة إلى قاعدة البيانات
export async function addFlight(flightData) {
  try {
    const docRef = await addDoc(collection(db, "flights"), {
      ...flightData,
      createdAt: new Date(),
      status: 'Available'
    });
    return docRef;
  } catch (error) {
    console.error("Error adding flight: ", error);
    throw error;
  }
}

// جلب جميع الرحلات أو مع فلترة
export async function getFlights({ from, to, airline, date } = {}) {
  try {
    let q = collection(db, "flights");
    let filters = [];
    
    if (from) filters.push(where("departure", "==", from));
    if (to) filters.push(where("arrival", "==", to));
    if (airline) filters.push(where("airline", "==", airline));
    if (date) filters.push(where("date", "==", date));
    
    if (filters.length > 0) {
      q = query(q, ...filters);
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting flights: ", error);
    throw error;
  }
}

// البحث في الرحلات باستخدام نص حر
export async function searchFlights(searchText) {
  try {
    const allFlights = await getFlights();
    const searchLower = searchText.toLowerCase();
    
    return allFlights.filter(flight => 
      flight.flightNumber.toLowerCase().includes(searchLower) ||
      flight.airline.toLowerCase().includes(searchLower) ||
      flight.departure.toLowerCase().includes(searchLower) ||
      flight.arrival.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error("Error searching flights: ", error);
    throw error;
  }
}

// حذف رحلة
export async function deleteFlight(flightId) {
  try {
    await deleteDoc(doc(db, "flights", flightId));
  } catch (error) {
    console.error("Error deleting flight: ", error);
    throw error;
  }
}

// تحديث رحلة
export async function updateFlight(flightId, flightData) {
  try {
    await updateDoc(doc(db, "flights", flightId), {
      ...flightData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error updating flight: ", error);
    throw error;
  }
}


