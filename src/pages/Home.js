import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFlights } from '../services/firebaseService';
import SimpleFlightCard from '../components/ui/SimpleFlightCard';
import SimpleFlightSearch from '../components/ui/SimpleFlightSearch';
import '../styles/simplified-flights.css';

const Home = () => {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        const flightsData = await getFlights();
        
        setFlights(flightsData);
        // عرض أول 9 رحلات في الصفحة الرئيسية
        setFilteredFlights(flightsData.slice(0, 9));
      } catch (err) {
        console.error('Error fetching flights:', err);
        setError('خطأ في جلب الرحلات');
        setFlights([]);
        setFilteredFlights([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, []);

  const handleSmartSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setFilteredFlights(flights);
      return;
    }

    try {
      setSearchLoading(true);
      setError(null); 
      // البحث المحلي في الرحلات المتاحة
      const filtered = flights.filter(flight => 
        flight.airline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flight.departure.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flight.arrival.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults({ flights: filtered });
      setFilteredFlights(filtered);
    } catch (error) {
      console.error('Search error:', error);
      setError('خطأ في البحث');
      setFilteredFlights(flights);
      setSearchResults(null);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section" style={{
        background: 'linear-gradient(135deg, var(--jordan-royal) 0%, var(--jordan-sage) 100%)',
        color: 'var(--jordan-white)',
        padding: '80px 0',
        marginBottom: '40px',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        marginLeft: '0',
        marginRight: '0'
      }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 style={{
                fontSize: '3rem',
                fontWeight: '700',
                marginBottom: '16px',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <i className="fas fa-plane me-3" style={{ color: 'var(--jordan-gold)' }}></i>
                SmartFly Jordan
              </h1>
              <p style={{
                fontSize: '1.2rem',
                opacity: '0.9',
                marginBottom: '32px'
              }}>
                اكتشف أفضل عروض الطيران مع الخطوط الأردنية الملكية وشركات الطيران المحلية
              </p>
            </div>
            <div className="col-md-4 text-center">
              <div className="position-relative">
                <i className="fas fa-plane-departure" style={{
                  fontSize: '6rem',
                  opacity: '0.3',
                  color: 'var(--jordan-gold)'
                }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        <div className="results-header text-center mb-4">
          <h2 style={{ color: 'var(--jordan-royal)', fontWeight: '600' }}>
            <i className="fas fa-plane-departure me-3" style={{ color: 'var(--jordan-gold)' }}></i>
            الرحلات المتاحة ({filteredFlights.length})
          </h2>
          <p style={{ color: 'var(--jordan-stone)', fontSize: '1.1rem' }}>
            اختر من بين مجموعة واسعة من رحلات الطيران الأردني
          </p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner-border" style={{ color: 'var(--jordan-gold)' }}>
              <span className="visually-hidden">جاري التحميل...</span>
            </div>
            <p className="mt-3">جاري تحميل الرحلات...</p>
          </div>
        ) : error ? (
          <div className="no-results">
            <i className="fas fa-exclamation-triangle fa-3x text-muted mb-3"></i>
            <h4>خطأ في تحميل البيانات</h4>
            <p className="text-muted">{error}</p>
          </div>
        ) : filteredFlights.length === 0 ? (
          <div className="no-results">
            <i className="fas fa-plane-slash fa-3x text-muted mb-3"></i>
            <h4>لا توجد رحلات متاحة</h4>
            <p className="text-muted">
              {searchQuery ? 'لم يتم العثور على رحلات تطابق معايير البحث' : 'لا توجد رحلات متاحة في الوقت الحالي'}
            </p>
          </div>
        ) : (
          <>
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
            
            {/* زر عرض جميع الرحلات */}
            {!searchQuery && flights.length > 9 && (
              <div className="text-center mt-4">
                <button 
                  className="btn btn-lg"
                  onClick={() => navigate('/flights')}
                  style={{
                    background: 'var(--primary-gradient)',
                    color: 'var(--jordan-white)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 32px',
                    fontSize: '18px',
                    fontWeight: '600',
                    boxShadow: 'var(--soft-shadow)',
                    transition: 'var(--smooth-transition)'
                  }}
                >
                  <i className="fas fa-plane me-2"></i>
                  عرض جميع الرحلات ({flights.length})
                  <i className="fas fa-arrow-left ms-2"></i>
                </button>
              </div>
            )}
          </>
        )}

        {/* إحصائيات سريعة */}
        <div className="stats-section mt-5" style={{
          background: 'var(--jordan-white)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: 'var(--soft-shadow)'
        }}>
          <h3 className="text-center mb-4" style={{ color: 'var(--jordan-royal)' }}>
            <i className="fas fa-chart-line me-3" style={{ color: 'var(--jordan-gold)' }}></i>
            إحصائيات SmartFly Jordan
          </h3>
          <div className="row g-4">
            <div className="col-md-4 text-center">
              <div style={{
                background: 'var(--jordan-cream)',
                padding: '32px',
                borderRadius: '16px',
                height: '100%'
              }}>
                <i className="fas fa-plane" style={{ fontSize: '3rem', color: 'var(--jordan-royal)', marginBottom: '16px' }}></i>
                <h2 style={{ color: 'var(--jordan-royal)', fontWeight: '700' }}>50+</h2>
                <p style={{ color: 'var(--jordan-stone)', margin: 0 }}>رحلات يومية</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div style={{
                background: 'var(--jordan-cream)',
                padding: '32px',
                borderRadius: '16px',
                height: '100%'
              }}>
                <i className="fas fa-building" style={{ fontSize: '3rem', color: 'var(--jordan-sage)', marginBottom: '16px' }}></i>
                <h2 style={{ color: 'var(--jordan-sage)', fontWeight: '700' }}>4</h2>
                <p style={{ color: 'var(--jordan-stone)', margin: 0 }}>شركات طيران أردنية</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div style={{
                background: 'var(--jordan-cream)',
                padding: '32px',
                borderRadius: '16px',
                height: '100%'
              }}>
                <i className="fas fa-map-marker-alt" style={{ fontSize: '3rem', color: 'var(--jordan-gold)', marginBottom: '16px' }}></i>
                <h2 style={{ color: 'var(--jordan-gold)', fontWeight: '700' }}>15+</h2>
                <p style={{ color: 'var(--jordan-stone)', margin: 0 }}>وجهة سياحية</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Home;