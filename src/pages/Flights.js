import React, { useState, useEffect } from 'react';
import { getFlights } from '../services/firebaseService';
import SimpleFlightCard from '../components/ui/SimpleFlightCard';
import AirlineSelector from '../components/ui/AirlineSelector';
import '../styles/pages/Flights.css';
import '../styles/simplified-flights.css';

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiSearchTerm, setAiSearchTerm] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState(null);
  const [voiceSearchSupported, setVoiceSearchSupported] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState('');
  const [flightCounts, setFlightCounts] = useState({});
  const [filters, setFilters] = useState({
    airline: '',
    departure: '',
    arrival: '',
    date: '',
    priceRange: ''
  });

  const airlines = [
    'Royal Jordanian',
    'Jordan Aviation',
    'Arab Wings',
    'Jazeera Airways Jordan'
  ];

  const cities = [
    'Amman',
    'Aqaba',
    'Dubai',
    'Doha',
    'Kuwait',
    'Riyadh',
    'Cairo',
    'Beirut'
  ];

  const priceRanges = [
    { label: 'جميع الأسعار', value: '' },
    { label: 'أقل من 300 دينار', value: '0-300' },
    { label: '300 - 500 دينار', value: '300-500' },
    { label: '500 - 700 دينار', value: '500-700' },
    { label: 'أكثر من 700 دينار', value: '700+' }
  ];

  // حساب عدد الرحلات لكل شركة
  const calculateFlightCounts = (flightsData) => {
    const counts = { total: flightsData.length };
    airlines.forEach(airline => {
      counts[airline] = flightsData.filter(flight => 
        flight.airline && flight.airline.toLowerCase().includes(airline.toLowerCase())
      ).length;
    });
    return counts;
  };

  // جلب الرحلات
  const fetchFlights = async () => {
    try {
      setLoading(true);
      const flightsData = await getFlights();
      setFlights(flightsData);
      setFilteredFlights(flightsData);
      setFlightCounts(calculateFlightCounts(flightsData));
    } catch (error) {
      console.error('خطأ في جلب الرحلات:', error);
    } finally {
      setLoading(false);
    }
  };

  // البحث بالذكاء الاصطناعي (منفصل عن الشات)
  const handleAiSearch = async (searchTerm = aiSearchTerm) => {
    if (!searchTerm.trim()) {
      applyFilters();
      return;
    }
    
    try {
      setIsAiSearching(true);
          // البحث المحلي في الرحلات
    const filtered = flights.filter(flight => 
      flight.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.arrival.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFlights(filtered);
      
    } catch (error) {
      console.error('خطأ في البحث:', error);
    } finally {
      setIsAiSearching(false);
    }
  };

  // تطبيق الفلاتر على الرحلات
  const applyFilters = () => {
    let filtered = [...flights];
    
    // فلترة حسب شركة الطيران
    if (filters.airline) {
      filtered = filtered.filter(flight => 
        flight.airline && flight.airline.toLowerCase().includes(filters.airline.toLowerCase())
      );
    }
    
    // فلترة حسب مدينة الإقلاع
    if (filters.departure) {
      filtered = filtered.filter(flight => 
        flight.departure && flight.departure.toLowerCase().includes(filters.departure.toLowerCase())
      );
    }
    
    // فلترة حسب مدينة الوصول
    if (filters.arrival) {
      filtered = filtered.filter(flight => 
        flight.arrival && flight.arrival.toLowerCase().includes(filters.arrival.toLowerCase())
      );
    }
    
    // فلترة حسب التاريخ
    if (filters.date) {
      filtered = filtered.filter(flight => flight.date === filters.date);
    }
    
    setFilteredFlights(filtered);
  };
  
  // تحديد شركة الطيران
  const handleAirlineSelect = (airline) => {
    setSelectedAirline(airline);
    setFilters(prev => ({
      ...prev,
      airline: airline
    }));
    setAiSearchTerm(''); // مسح البحث الذكي عند اختيار شركة
    setSearchCriteria(null);
  };
  
  // تحديث الفلاتر
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    if (filterName === 'airline') {
      setSelectedAirline(value);
    }
  };

  // مسح جميع الفلاتر
  const clearFilters = () => {
    setFilters({
      airline: '',
      departure: '',
      arrival: '',
      date: '',
      priceRange: ''
    });
    setSelectedAirline('');
    setAiSearchTerm('');
    setSearchCriteria(null);
    setFilteredFlights(flights);
  };

  useEffect(() => {
    fetchFlights();
  }, []);
  
  // تطبيق الفلاتر عند تغييرها
  useEffect(() => {
    if (!aiSearchTerm) {
      applyFilters();
    }
  }, [filters, flights]);

  // التحقق من دعم البحث الصوتي
  useEffect(() => {
    const checkVoiceSupport = () => {
      const hasMediaDevices = navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
      const hasSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
      setVoiceSearchSupported(hasMediaDevices && hasSpeechRecognition);
    };
    checkVoiceSupport();
  }, []);

  return (
    <div className="flights-page">
      {/* Header */}
      <div className="flights-header">
        <div className="container">
          <h1>رحلات الطيران المتاحة</h1>
          <p>اختر من بين مجموعة واسعة من رحلات الطيران</p>
        </div>
      </div>
      
      <div className="container">
        {/* اختيار شركة الطيران */}
        <AirlineSelector 
          selectedAirline={selectedAirline}
          onAirlineSelect={handleAirlineSelect}
          airlines={airlines}
          flightCounts={flightCounts}
        />
        
        {/* فلاتر إضافية - تظهر فقط عند اختيار شركة */}
        {selectedAirline && (
          <div className="additional-filters mb-4" style={{
            background: 'var(--jordan-cream)',
            borderRadius: '12px',
            padding: '16px',
            border: '2px solid var(--jordan-gold)'
          }}>
            <div className="filter-header mb-3">
              <small style={{ color: 'var(--jordan-royal)', fontWeight: '600' }}>
                <i className="fas fa-filter me-1"></i>
                فلترة رحلات {selectedAirline}
              </small>
            </div>
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label" style={{ color: 'var(--jordan-royal)', fontWeight: '600', fontSize: '14px' }}>من</label>
                <select
                  className="form-select"
                  value={filters.departure}
                  onChange={(e) => handleFilterChange('departure', e.target.value)}
                >
                  <option value="">أي مدينة</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label" style={{ color: 'var(--jordan-royal)', fontWeight: '600', fontSize: '14px' }}>إلى</label>
                <select
                  className="form-select"
                  value={filters.arrival}
                  onChange={(e) => handleFilterChange('arrival', e.target.value)}
                >
                  <option value="">أي مدينة</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <button className="btn btn-outline-secondary w-100" onClick={clearFilters}>
                  <i className="fas fa-times me-1"></i>مسح الفلاتر
                </button>
              </div>
            </div>
          </div>
        )}
        {/* نتائج البحث */}
        <div className="results-section">
          <div className="results-header mb-3 d-flex justify-content-between align-items-center">
            <div>
              <h4 style={{ color: 'var(--jordan-royal)', margin: 0 }}>
                <i className="fas fa-plane-departure me-2" style={{ color: 'var(--jordan-gold)' }}></i>
                {selectedAirline ? `رحلات ${selectedAirline}` : 'جميع الرحلات المتاحة'} ({filteredFlights.length})
              </h4>
              {selectedAirline && (
                <small style={{ color: 'var(--jordan-stone)' }}>
                  عرض رحلات شركة {selectedAirline} فقط
                </small>
              )}
            </div>
            {selectedAirline && (
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={() => handleAirlineSelect('')}
              >
                <i className="fas fa-times me-1"></i>
                إلغاء فلتر الشركة
              </button>
            )}
          </div>

            {/* Search Criteria Display */}
            {searchCriteria && (
              <div className="search-criteria-display">
                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2"></i>
                  <strong>معايير البحث:</strong> {searchCriteria.description}
                </div>
              </div>
            )}

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
                <div className="spinner-border" role="status" style={{ color: '#5a9a9c' }}>
              <span className="visually-hidden">جاري التحميل...</span>
            </div>
            <p className="mt-3">جاري تحميل الرحلات...</p>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredFlights.length === 0 && (
          <div className="no-results">
            <div className="text-center py-5">
              <i className="fas fa-plane-slash fa-3x text-muted mb-3"></i>
              <h4>لا توجد رحلات متاحة</h4>
              <p className="text-muted">
                جرب تغيير معايير البحث أو الفلاتر للحصول على نتائج
              </p>
              <button className="btn btn-primary" onClick={clearFilters}>
                    <i className="fas fa-refresh me-2"></i>
                مسح جميع الفلاتر
              </button>
            </div>
          </div>
        )}

          {/* قائمة الرحلات بتصميم البطاقات مثل الصفحة الرئيسية */}
          {!loading && filteredFlights.length > 0 && (
            <div className="flights-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '24px',
              marginBottom: '32px'
            }}>
              {filteredFlights.map((flight) => (
                <SimpleFlightCard key={flight.id} flight={flight} />
              ))}
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default Flights;

