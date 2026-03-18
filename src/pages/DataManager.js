import React, { useState, useEffect } from 'react';
import { addSampleData, sampleFlights } from '../utils/sampleData';
import { getFlights, deleteFlight } from '../services/firebaseService';
import '../styles/pages/DataManager.css';

const DataManager = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // جلب الرحلات الموجودة
  const fetchFlights = async () => {
    try {
      setLoading(true);
      const flightsData = await getFlights();
      setFlights(flightsData);
    } catch (error) {
      console.error('خطأ في جلب الرحلات:', error);
      setMessage('خطأ في جلب الرحلات');
    } finally {
      setLoading(false);
    }
  };

  // إضافة البيانات الوهمية
  const handleAddSampleData = async () => {
    try {
      setLoading(true);
      setMessage('جاري إضافة البيانات الوهمية...');
      
      const success = await addSampleData();
      
      if (success) {
        setMessage('تم إضافة البيانات الوهمية بنجاح!');
        await fetchFlights(); // تحديث القائمة
      } else {
        setMessage('فشل في إضافة البيانات الوهمية');
      }
    } catch (error) {
      console.error('خطأ في إضافة البيانات:', error);
      setMessage('خطأ في إضافة البيانات الوهمية');
    } finally {
      setLoading(false);
    }
  };

  // حذف جميع الرحلات
  const handleClearAllFlights = async () => {
    if (!window.confirm('هل أنت متأكد من حذف جميع الرحلات؟')) {
      return;
    }

    try {
      setLoading(true);
      setMessage('جاري حذف جميع الرحلات...');
      
      const deletePromises = flights.map(flight => deleteFlight(flight.id));
      await Promise.all(deletePromises);
      
      setMessage('تم حذف جميع الرحلات بنجاح!');
      setFlights([]);
    } catch (error) {
      console.error('خطأ في حذف الرحلات:', error);
      setMessage('خطأ في حذف الرحلات');
    } finally {
      setLoading(false);
    }
  };

  // حذف رحلة واحدة
  const handleDeleteFlight = async (flightId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الرحلة؟')) {
      return;
    }

    try {
      await deleteFlight(flightId);
      setMessage('تم حذف الرحلة بنجاح!');
      await fetchFlights(); // تحديث القائمة
    } catch (error) {
      console.error('خطأ في حذف الرحلة:', error);
      setMessage('خطأ في حذف الرحلة');
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  return (
    <div className="data-manager">
      <div className="data-manager-header">
        <h1>إدارة البيانات الوهمية</h1>
        <p>إدارة البيانات الوهمية في قاعدة البيانات</p>
      </div>

      <div className="data-manager-actions">
        <button 
          className="btn btn-primary"
          onClick={handleAddSampleData}
          disabled={loading}
        >
          {loading ? 'جاري الإضافة...' : 'إضافة البيانات الوهمية'}
        </button>
        
        <button 
          className="btn btn-danger"
          onClick={handleClearAllFlights}
          disabled={loading || flights.length === 0}
        >
          {loading ? 'جاري الحذف...' : 'حذف جميع الرحلات'}
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('خطأ') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="data-stats">
        <div className="stat-card">
          <h3>الرحلات الموجودة</h3>
          <p className="stat-number">{flights.length}</p>
        </div>
        <div className="stat-card">
          <h3>البيانات الوهمية الجاهزة</h3>
          <p className="stat-number">{sampleFlights.length}</p>
        </div>
      </div>

      <div className="flights-list">
        <h2>الرحلات الموجودة في قاعدة البيانات</h2>
        
        {loading ? (
          <div className="loading">جاري التحميل...</div>
        ) : flights.length === 0 ? (
          <div className="no-flights">
            <p>لا توجد رحلات في قاعدة البيانات</p>
            <p>اضغط على "إضافة البيانات الوهمية" لإضافة بيانات تجريبية</p>
          </div>
        ) : (
          <div className="flights-grid">
            {flights.map((flight) => (
              <div key={flight.id} className="flight-card">
                <div className="flight-header">
                  <h3>{flight.flightNumber}</h3>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteFlight(flight.id)}
                    title="حذف الرحلة"
                  >
                    ×
                  </button>
                </div>
                <div className="flight-info">
                  <p><strong>الشركة:</strong> {flight.airline}</p>
                  <p><strong>من:</strong> {flight.departure}</p>
                  <p><strong>إلى:</strong> {flight.arrival}</p>
                  <p><strong>التاريخ:</strong> {flight.date}</p>
                  <p><strong>الوقت:</strong> {flight.time}</p>
                  <p><strong>السعر:</strong> {flight.price} دينار</p>
                  <p><strong>السعة:</strong> {flight.capacity} راكب</p>
                  <p><strong>الطائرة:</strong> {flight.aircraft}</p>
                  <p><strong>الحالة:</strong> {flight.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataManager;
