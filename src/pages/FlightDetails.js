import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFlights } from '../services/firebaseService';
import '../styles/pages/FlightDetails.css';

const FlightDetails = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingStep, setBookingStep] = useState(1);
  const [passengerInfo, setPassengerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    passportNumber: '',
    nationality: 'أردني',
    dateOfBirth: ''
  });
  const [selectedSeat, setSelectedSeat] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    fetchFlightDetails();
  }, [flightId]);

  const fetchFlightDetails = async () => {
    try {
      setLoading(true);
      const flights = await getFlights();
      const foundFlight = flights.find(f => f.id === flightId);
      setFlight(foundFlight);
    } catch (error) {
      console.error('خطأ في جلب تفاصيل الرحلة:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setPassengerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBooking = () => {
    if (bookingStep === 1) {
      setBookingStep(2);
    } else if (bookingStep === 2) {
      setBookingStep(3);
    } else {
      setBookingConfirmed(true);
    }
  };

  const resetBooking = () => {
    setBookingStep(1);
    setBookingConfirmed(false);
    setPassengerInfo({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      passportNumber: '',
      nationality: 'أردني',
      dateOfBirth: ''
    });
    setSelectedSeat('');
  };

  if (loading) {
    return (
      <div className="flight-details-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </div>
        <p>جاري تحميل تفاصيل الرحلة...</p>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="flight-not-found">
        <div className="container text-center py-5">
          <i className="fas fa-plane-slash" style={{ fontSize: '64px', color: 'var(--jordan-stone)', marginBottom: '16px' }}></i>
          <h3 style={{ color: 'var(--jordan-royal)' }}>الرحلة غير موجودة</h3>
          <p style={{ color: 'var(--jordan-stone)' }}>لم يتم العثور على الرحلة المطلوبة</p>
          <button className="btn btn-primary" onClick={() => navigate('/flights')}>
            العودة للرحلات
          </button>
        </div>
      </div>
    );
  }

  if (bookingConfirmed) {
    return (
      <div className="booking-confirmation">
        <div className="container py-5">
          <div className="confirmation-card">
            <div className="text-center mb-4">
              <i className="fas fa-check-circle" style={{ fontSize: '64px', color: 'var(--jordan-gold)', marginBottom: '16px' }}></i>
              <h2 style={{ color: 'var(--jordan-royal)' }}>تم تأكيد الحجز بنجاح!</h2>
              <p style={{ color: 'var(--jordan-stone)' }}>سيتم إرسال تفاصيل الحجز على بريدك الإلكتروني</p>
            </div>
            
            <div className="booking-summary">
              <h5 style={{ color: 'var(--jordan-royal)', marginBottom: '16px' }}>ملخص الحجز</h5>
              <div className="summary-details">
                <div className="row">
                  <div className="col-md-6">
                    <strong>الرحلة:</strong> {flight.flightNumber}<br/>
                    <strong>الشركة:</strong> {flight.airline}<br/>
                    <strong>المسار:</strong> {flight.departure} → {flight.arrival}
                  </div>
                  <div className="col-md-6">
                    <strong>المسافر:</strong> {passengerInfo.firstName} {passengerInfo.lastName}<br/>
                    <strong>المقعد:</strong> {selectedSeat}<br/>
                    <strong>السعر:</strong> {flight.price} دينار
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-4">
              <button className="btn btn-primary me-3" onClick={() => navigate('/flights')}>
                العودة للرحلات
              </button>
              <button className="btn btn-outline-primary" onClick={resetBooking}>
                حجز رحلة أخرى
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flight-details-page">
      {/* Header */}
      <div className="flight-details-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col">
              <button className="btn btn-link p-0 mb-3" onClick={() => navigate('/flights')}>
                <i className="fas fa-arrow-right me-2"></i>
                العودة للرحلات
              </button>
              <h2 style={{ color: 'var(--jordan-white)', margin: 0 }}>
                تفاصيل الرحلة {flight.flightNumber}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', margin: '8px 0 0' }}>
                {flight.airline} • {flight.departure} → {flight.arrival}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div className="row">
          {/* تفاصيل الرحلة */}
          <div className="col-lg-8">
            <div className="flight-info-card">
              <div className="flight-route">
                <div className="route-point">
                  <div className="city-info">
                    <h4>{flight.departure}</h4>
                    <p className="time">{flight.departureTime}</p>
                    <small className="date">{flight.date}</small>
                  </div>
                </div>
                
                <div className="route-line">
                  <div className="plane-icon">
                    <i className="fas fa-plane"></i>
                  </div>
                  <div className="duration">
                    <small>مدة الرحلة</small>
                    <strong>{flight.duration || '2س 30د'}</strong>
                  </div>
                </div>
                
                <div className="route-point">
                  <div className="city-info">
                    <h4>{flight.arrival}</h4>
                    <p className="time">{flight.arrivalTime}</p>
                    <small className="date">{flight.date}</small>
                  </div>
                </div>
              </div>

              <div className="flight-details-grid">
                <div className="detail-item">
                  <i className="fas fa-building"></i>
                  <div>
                    <strong>شركة الطيران</strong>
                    <p>{flight.airline}</p>
                  </div>
                </div>
                
                <div className="detail-item">
                  <i className="fas fa-plane"></i>
                  <div>
                    <strong>رقم الرحلة</strong>
                    <p>{flight.flightNumber}</p>
                  </div>
                </div>
                
                <div className="detail-item">
                  <i className="fas fa-chair"></i>
                  <div>
                    <strong>نوع الطائرة</strong>
                    <p>{flight.aircraft || 'Boeing 737'}</p>
                  </div>
                </div>
                
                <div className="detail-item">
                  <i className="fas fa-users"></i>
                  <div>
                    <strong>المقاعد المتاحة</strong>
                    <p>{flight.availableSeats || '45'} مقعد</p>
                  </div>
                </div>
                
                <div className="detail-item">
                  <i className="fas fa-suitcase"></i>
                  <div>
                    <strong>الأمتعة</strong>
                    <p>23 كيلو مجاناً</p>
                  </div>
                </div>
                
                <div className="detail-item">
                  <i className="fas fa-utensils"></i>
                  <div>
                    <strong>الوجبات</strong>
                    <p>وجبة مجانية</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* بطاقة الحجز */}
          <div className="col-lg-4">
            <div className="booking-card">
              <div className="booking-header">
                <h5>احجز هذه الرحلة</h5>
                <div className="price">
                  <span className="amount">{flight.price}</span>
                  <span className="currency">دينار</span>
                </div>
              </div>

              {bookingStep === 1 && (
                <div className="booking-step">
                  <h6>بيانات المسافر</h6>
                  <div className="passenger-form">
                    <div className="row g-3">
                      <div className="col-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="الاسم الأول"
                          value={passengerInfo.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                        />
                      </div>
                      <div className="col-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="اسم العائلة"
                          value={passengerInfo.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                        />
                      </div>
                      <div className="col-12">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="البريد الإلكتروني"
                          value={passengerInfo.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      </div>
                      <div className="col-12">
                        <input
                          type="tel"
                          className="form-control"
                          placeholder="رقم الهاتف"
                          value={passengerInfo.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="رقم جواز السفر"
                          value={passengerInfo.passportNumber}
                          onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                        />
                      </div>
                      <div className="col-12">
                        <input
                          type="date"
                          className="form-control"
                          placeholder="تاريخ الميلاد"
                          value={passengerInfo.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {bookingStep === 2 && (
                <div className="booking-step">
                  <h6>اختيار المقعد</h6>
                  <div className="seat-selection">
                    <div className="seat-map">
                      {['1A', '1B', '1C', '2A', '2B', '2C', '3A', '3B', '3C', '4A', '4B', '4C'].map(seat => (
                        <button
                          key={seat}
                          className={`seat ${selectedSeat === seat ? 'selected' : ''}`}
                          onClick={() => setSelectedSeat(seat)}
                        >
                          {seat}
                        </button>
                      ))}
                    </div>
                    <div className="seat-legend">
                      <div className="legend-item">
                        <div className="seat available"></div>
                        <span>متاح</span>
                      </div>
                      <div className="legend-item">
                        <div className="seat selected"></div>
                        <span>مختار</span>
                      </div>
                      <div className="legend-item">
                        <div className="seat occupied"></div>
                        <span>محجوز</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {bookingStep === 3 && (
                <div className="booking-step">
                  <h6>تأكيد الحجز</h6>
                  <div className="booking-summary">
                    <div className="summary-item">
                      <strong>المسافر:</strong>
                      <span>{passengerInfo.firstName} {passengerInfo.lastName}</span>
                    </div>
                    <div className="summary-item">
                      <strong>المقعد:</strong>
                      <span>{selectedSeat}</span>
                    </div>
                    <div className="summary-item">
                      <strong>السعر الإجمالي:</strong>
                      <span>{flight.price} دينار</span>
                    </div>
                    <div className="summary-item">
                      <strong>الخصم:</strong>
                      <span>10%</span>
                    </div>
                    <div className="summary-item">
                      <strong>السعر بعد الخصم:</strong>
                      <span>{flight.price * 0.9} دينار</span>
                    </div>
                  </div>
                  
                  <div className="payment-info">
                    <h6>معلومات الدفع</h6>
                    <div className="payment-methods">
                      <div className="payment-method active">
                        <i className="fas fa-credit-card"></i>
                        <span>بطاقة ائتمانية</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="booking-actions">
                {bookingStep > 1 && (
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setBookingStep(bookingStep - 1)}
                  >
                    السابق
                  </button>
                )}
                
                <button 
                  className="btn btn-primary"
                  onClick={handleBooking}
                  disabled={
                    (bookingStep === 1 && (!passengerInfo.firstName || !passengerInfo.lastName || !passengerInfo.email)) ||
                    (bookingStep === 2 && !selectedSeat)
                  }
                >
                  {bookingStep === 1 && 'التالي'}
                  {bookingStep === 2 && 'تأكيد المقعد'}
                  {bookingStep === 3 && 'تأكيد الحجز والدفع'}
                </button>
              </div>

              <div className="booking-progress">
                <div className="progress-steps">
                  <div className={`step ${bookingStep >= 1 ? 'active' : ''}`}>
                    <span>1</span>
                    <small>البيانات</small>
                  </div>
                  <div className={`step ${bookingStep >= 2 ? 'active' : ''}`}>
                    <span>2</span>
                    <small>المقعد</small>
                  </div>
                  <div className={`step ${bookingStep >= 3 ? 'active' : ''}`}>
                    <span>3</span>
                    <small>الدفع</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;