import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFlights } from '../services/firebaseService';
import SimpleFlightCard from '../components/ui/SimpleFlightCard';
import SimpleFlightSearch from '../components/ui/SimpleFlightSearch';
import { sampleFlights } from '../utils/sampleData.js';
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
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [originValue, setOriginValue] = useState('Amman (AMM)');
  const [destinationValue, setDestinationValue] = useState('Dubai (DXB)');
  const [showDepartureCalendar, setShowDepartureCalendar] = useState(false);
  const [showReturnCalendar, setShowReturnCalendar] = useState(false);
  const [selectedDepartureDate, setSelectedDepartureDate] = useState('2026-04-14');
  const [selectedReturnDate, setSelectedReturnDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(3); // April (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026);
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [tripType, setTripType] = useState('oneway'); // 'oneway', 'roundtrip', 'multicity'

  const holidays = {
    '2026-05-26': { name: 'Arafah Day', type: 'tentative' },
    '2026-05-27': { name: 'Eid al-Adha Holiday', type: 'tentative' },
    '2026-05-28': { name: 'Eid al-Adha Holiday', type: 'tentative' },
    '2026-05-29': { name: 'Eid al-Adha Holiday', type: 'tentative' }
  };

  const popularCities = [
    // Middle East
    'Amman (AMM)', 'Riyadh (RUH)', 'Jeddah (JED)', 'Dubai (DXB)', 
    'Cairo (CAI)', 'Istanbul (IST)', 'Abu Dhabi (AUH)', 'Doha (DOH)',
    'Kuwait (KWI)', 'Manama (BAH)', 'Muscat (MCT)', 'Baghdad (BGW)',
    'Beirut (BEY)', 'Damascus (DAM)', 'Tel Aviv (TLV)', 'Algiers (ALG)',
    'Tunis (TUN)', 'Casablanca (CMN)', 'Rabat (RBA)', 'Marrakech (RAK)',
    
    // Europe
    'London (LHR)', 'Paris (CDG)', 'Frankfurt (FRA)', 'Amsterdam (AMS)',
    'Madrid (MAD)', 'Barcelona (BCN)', 'Rome (FCO)', 'Milan (MXP)',
    'Vienna (VIE)', 'Zurich (ZRH)', 'Brussels (BRU)', 'Stockholm (ARN)',
    'Oslo (OSL)', 'Copenhagen (CPH)', 'Helsinki (HEL)', 'Warsaw (WAW)',
    'Prague (PRG)', 'Budapest (BUD)', 'Athens (ATH)', 'Moscow (SVO)',
    
    // North America
    'New York (JFK)', 'Los Angeles (LAX)', 'Toronto (YYZ)', 'Chicago (ORD)',
    'San Francisco (SFO)', 'Miami (MIA)', 'Boston (BOS)', 'Washington DC (IAD)',
    'Dallas (DFW)', 'Houston (IAH)', 'Atlanta (ATL)', 'Denver (DEN)',
    'Las Vegas (LAS)', 'Seattle (SEA)', 'Philadelphia (PHL)', 'Phoenix (PHX)',
    
    // Asia Pacific
    'Tokyo (NRT)', 'Singapore (SIN)', 'Bangkok (BKK)', 'Mumbai (BOM)',
    'Delhi (DEL)', 'Sydney (SYD)', 'Melbourne (MEL)', 'Seoul (ICN)',
    'Jakarta (CGK)', 'Kuala Lumpur (KUL)', 'Manila (MNL)', 'Ho Chi Minh City (SGN)',
    'Bangalore (BLR)', 'Chennai (MAA)', 'Kolkata (CCU)', 'Beijing (PEK)',
    'Shanghai (PVG)', 'Guangzhou (CAN)', 'Shenzhen (SZX)', 'Hong Kong (HKG)',
    
    // South Asia
    'Lahore (LHE)', 'Islamabad (ISB)', 'Karachi (KHI)', 'Dhaka (DAC)',
    'Colombo (CMB)', 'Kathmandu (KTM)', 'Male (MLE)',
    
    // Africa
    'Johannesburg (JNB)', 'Cape Town (CPT)', 'Nairobi (NBO)', 'Lagos (LOS)',
    'Addis Ababa (ADD)', 'Cairo (CAI)', 'Casablanca (CMN)', 'Algiers (ALG)',
    'Tunis (TUN)', 'Khartoum (KRT)', 'Dar es Salaam (DAR)',
    
    // South America
    'São Paulo (GRU)', 'Rio de Janeiro (GIG)', 'Buenos Aires (EZE)',
    'Lima (LIM)', 'Bogotá (BOG)', 'Santiago (SCL)', 'Caracas (CCS)',
    
    // Oceania
    'Sydney (SYD)', 'Melbourne (MEL)', 'Brisbane (BNE)', 'Perth (PER)',
    'Auckland (AKL)', 'Wellington (WLG)', 'Christchurch (CHC)'
  ];

  useEffect(() => {
    console.log('Loading sample flights directly...');
    console.log('Sample flights loaded:', sampleFlights.length);
    console.log('First flight:', sampleFlights[0]);
    setFlights(sampleFlights);
    setFilteredFlights(sampleFlights.slice(0, 9));
    setLoading(false);
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

  const handleSearch = () => {
    // Validate required fields
    if (!originValue || !destinationValue) {
      alert('يرجى اختيار مطار المغادرة والوجهة');
      return;
    }

    if (!selectedDepartureDate) {
      alert('يرجى اختيار تاريخ المغادرة');
      return;
    }

    if (tripType === 'roundtrip' && !selectedReturnDate) {
      alert('يرجى اختيار تاريخ العودة للرحلات ذهاب وعودة');
      return;
    }

    console.log('Searching for flights with criteria:');
    console.log('Origin:', originValue);
    console.log('Destination:', destinationValue);
    console.log('Date:', selectedDepartureDate);
    console.log('Available flights:', flights.length);

    // Filter flights based on criteria
    const filtered = flights.filter(flight => {
      // Extract airport codes from origin and destination values
      const originCode = originValue.includes('(') ? originValue.match(/\(([^)]+)\)/)[1] : originValue;
      const destinationCode = destinationValue.includes('(') ? destinationValue.match(/\(([^)]+)\)/)[1] : destinationValue;
      
      console.log('Checking flight:', flight.flightNumber, flight.departure, '->', flight.arrival, 'on', flight.date);
      
      // Check if flight matches origin and destination
      const flightOrigin = flight.departure.toLowerCase();
      const flightDestination = flight.arrival.toLowerCase();
      const searchOrigin = originCode.toLowerCase();
      const searchDestination = destinationCode.toLowerCase();
      
      const matchesOrigin = flightOrigin.includes(searchOrigin) || searchOrigin.includes(flightOrigin);
      const matchesDestination = flightDestination.includes(searchDestination) || searchDestination.includes(flightDestination);
      
      // Check date match - more flexible matching
      const matchesDepartureDate = flight.date && (
        flight.date === selectedDepartureDate || 
        flight.date.includes(selectedDepartureDate.split('-')[2]) // Extract day
      );
      
      // For round trip, also check return date
      const matchesReturnDate = tripType === 'roundtrip' ? 
        (flight.returnDate && flight.returnDate.includes(selectedReturnDate.split('-')[2])) : true;
      
      console.log('Match results:', {
        matchesOrigin,
        matchesDestination,
        matchesDepartureDate,
        matchesReturnDate,
        flightDate: flight.date,
        searchDate: selectedDepartureDate
      });
      
      return matchesOrigin && matchesDestination && matchesDepartureDate && matchesReturnDate;
    });

    console.log('Filtered flights:', filtered.length);

    // Update filtered flights
    setFilteredFlights(filtered);
    setSearchResults({ flights: filtered });
    
    // Show message if no flights found
    if (filtered.length === 0) {
      alert(`لم يتم العثور على رحلات من ${originValue} إلى ${destinationValue} في التاريخ المحدد. يرجى محاولة تواريخ أو وجهات مختلفة.`);
    } else {
      console.log(`Found ${filtered.length} flights from ${originValue} to ${destinationValue}`);
      // Scroll to results section
      setTimeout(() => {
        const resultsSection = document.querySelector('.results-header');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  // Passenger counter functions
  const incrementAdults = () => setAdults(prev => prev + 1);
  const decrementAdults = () => setAdults(prev => Math.max(1, prev - 1));
  const incrementChildren = () => setChildren(prev => prev + 1);
  const decrementChildren = () => setChildren(prev => Math.max(0, prev - 1));
  const incrementInfants = () => setInfants(prev => prev + 1);
  const decrementInfants = () => setInfants(prev => Math.max(0, prev - 1));

  const getPassengerDisplay = () => {
    const parts = [];
    if (adults > 0) parts.push(`${adults} Adult${adults > 1 ? 's' : ''}`);
    if (children > 0) parts.push(`${children} Child${children > 1 ? 'ren' : ''}`);
    if (infants > 0) parts.push(`${infants} Infant${infants > 1 ? 's' : ''}`);
    return parts.length > 0 ? parts.join(', ') : '1 Adult';
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDateString = (day, month, year) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const formatDateDisplay = (dateString) => {
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const handleDateSelect = (day, isDeparture) => {
    const dateString = formatDateString(day, currentMonth, currentYear);
    
    if (isDeparture) {
      setSelectedDepartureDate(dateString);
      setShowDepartureCalendar(false);
    } else {
      setSelectedReturnDate(dateString);
      setShowReturnCalendar(false);
    }
  };

  const renderCalendar = (isDeparture) => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDateString(day, currentMonth, currentYear);
      const isHoliday = holidays[dateString];
      const isSelected = isDeparture ? 
        dateString === selectedDepartureDate : 
        dateString === selectedReturnDate;
      const isToday = dateString === formatDateString(new Date().getDate(), new Date().getMonth(), new Date().getFullYear());
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${isSelected ? 'selected' : ''} ${isHoliday ? 'holiday' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => handleDateSelect(day, isDeparture)}
          style={{
            padding: '8px',
            textAlign: 'center',
            cursor: 'pointer',
            borderRadius: '4px',
            backgroundColor: isSelected ? '#22c55e' : isHoliday ? '#fef3c7' : isToday ? '#f0f9ff' : 'white',
            color: isSelected ? 'white' : '#0F172A',
            border: isHoliday ? '1px solid #f59e0b' : '1px solid #e2e8f0',
            fontSize: '14px',
            fontWeight: isToday ? '600' : 'normal',
            position: 'relative'
          }}
        >
          {day}
          {isHoliday && (
            <div style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '6px',
              height: '6px',
              backgroundColor: '#f59e0b',
              borderRadius: '50%'
            }}></div>
          )}
        </div>
      );
    }
    
    return days;
  };

  const renderCalendarWidget = (isDeparture) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <div className="calendar-widget" style={{
        position: 'absolute',
        top: '100%',
        left: '0',
        right: '0',
        background: 'white',
        border: '2px solid #e2e8f0',
        borderTop: 'none',
        borderRadius: '0 0 10px 10px',
        padding: '20px',
        zIndex: 1000,
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        minWidth: '350px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <button
            onClick={() => setCurrentMonth(prev => prev === 0 ? 11 : prev - 1)}
            style={{
              background: '#FFD700',
              border: 'none',
              borderRadius: '4px',
              padding: '5px 10px',
              cursor: 'pointer',
              color: '#0F172A',
              fontWeight: '600'
            }}
          >
            &lt;
          </button>
          <h4 style={{
            margin: 0,
            color: '#0F172A',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            {months[currentMonth]} {currentYear}
          </h4>
          <button
            onClick={() => setCurrentMonth(prev => prev === 11 ? 0 : prev + 1)}
            style={{
              background: '#FFD700',
              border: 'none',
              borderRadius: '4px',
              padding: '5px 10px',
              cursor: 'pointer',
              color: '#0F172A',
              fontWeight: '600'
            }}
          >
            &gt;
          </button>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '2px',
          marginBottom: '10px'
        }}>
          {weekDays.map(day => (
            <div key={day} style={{
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: '600',
              color: '#64748b',
              padding: '5px'
            }}>
              {day}
            </div>
          ))}
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '2px'
        }}>
          {renderCalendar(isDeparture)}
        </div>
        
        {/* Holiday Notes */}
        <div style={{
          marginTop: '15px',
          padding: '10px',
          background: '#fef3c7',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#92400e'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '5px' }}>Official Holidays:</div>
          <div>May 26 - Arafah Day (tentative)</div>
          <div>May 27-29 - Eid al-Adha Holiday (tentative)</div>
        </div>
      </div>
    );
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section" style={{
        background: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Flag_of_Jordan.svg/1280px-Flag_of_Jordan.svg.png') no-repeat center center`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'var(--jordan-white)',
        padding: '80px 0',
        marginBottom: '40px',
        position: 'relative',
        overflow: 'hidden',
        backgroundSize: '100% 100%'
      }}>
        {/* Text overlay for better readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          zIndex: 1
        }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 style={{
                fontSize: '3rem',
                fontWeight: '700',
                marginBottom: '16px',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                color: '#ffffff'
              }}>
                <i className="fas fa-plane me-3" style={{ color: '#FFD700' }}></i>
                SmartFly Jordan
              </h1>
              <p style={{
                fontSize: '1.2rem',
                opacity: '1',
                marginBottom: '32px',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                color: '#ffffff'
              }}>
                اكتشف أفضل عروض الطيران مع الخطوط الأردنية الملكية وشركات الطيران المحلية
              </p>
            </div>
            <div className="col-md-4 text-center">
              <div className="position-relative">
                <i className="fas fa-plane-departure" style={{
                  fontSize: '6rem',
                  opacity: '0.6',
                  color: '#FFD700',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flight Search Interface */}
      <div className="flight-search-container" style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1e293b 100%)',
        padding: '60px 20px',
        marginBottom: '40px'
      }}>
        <div className="container">
          <div className="search-box" style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            maxWidth: '100%',
            margin: '0 auto'
          }}>
            <h2 style={{
              color: '#0F172A',
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              <i className="fas fa-search me-3" style={{ color: '#FFD700' }}></i>
              {"\u0628\u062d\u062b \u0639\u0646 \u0631\u062d\u0644\u0629"}
            </h2>

            <div className="search-form">
              {/* Trip Type Buttons */}
              <div className="row g-3 mb-3">
                <div className="col-12">
                  <div style={{
                    display: 'flex',
                    gap: '15px',
                    justifyContent: 'center'
                  }}>
                  <button 
                    onClick={() => setTripType('oneway')}
                    style={{
                      padding: '10px 20px',
                      border: '2px solid rgba(15, 23, 42, 0.95)',
                      background: tripType === 'oneway' ? 'rgba(15, 23, 42, 0.95)' : '#ffffff',
                      color: tripType === 'oneway' ? '#ffffff' : '#0F172A',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}>
                    ذهاب فقط
                  </button>
                  <button 
                    onClick={() => setTripType('roundtrip')}
                    style={{
                      padding: '10px 20px',
                      border: '2px solid rgba(15, 23, 42, 0.95)',
                      background: tripType === 'roundtrip' ? 'rgba(15, 23, 42, 0.95)' : '#ffffff',
                      color: tripType === 'roundtrip' ? '#ffffff' : '#0F172A',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}>
                    ذهاب وعودة
                  </button>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-start' }}>
              {/* Origin */}
             <div className="position-relative" style={{ flex: '1', minWidth: '200px', maxWidth: '280px' }}>
                  <label style={{
                    display: 'block',
                    color: '#0F172A',
                    fontWeight: '600',
                    marginBottom: '8px',
                    fontSize: '14px'
                  }}>
                    <i className="fas fa-plane-departure me-2" style={{ color: '#FFD700' }}></i>
                     مكان الانطلاق
                  </label>
                  <input
                    type="text"
                    value={originValue}
                    onFocus={() => setShowOriginDropdown(true)}
                    onBlur={() => setTimeout(() => setShowOriginDropdown(false), 200)}
                    onChange={(e) => setOriginValue(e.target.value)}
                    placeholder="من عمان (AMM)"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      background: '#ffffff',
                      color: '#0F172A',
                      transition: 'border-color 0.3s ease'
                    }}
                  />
                  
                  {/* Popular Cities Dropdown */}
                  {showOriginDropdown && (
                    <div className="countries-dropdown" style={{
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      right: '0',
                      background: '#ffffff',
                      border: '2px solid #e2e8f0',
                      borderTop: 'none',
                      borderRadius: '0 0 10px 10px',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      zIndex: 1000,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{
                        padding: '12px',
                        background: '#f8fafc',
                        borderBottom: '1px solid #e2e8f0',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#64748b'
                      }}>
                        المدن الاشهر
                      </div>
                      {popularCities.map((city, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setOriginValue(city);
                            setShowOriginDropdown(false);
                          }}
                          style={{
                            padding: '12px 15px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #f1f5f9',
                            transition: 'background-color 0.2s ease',
                            fontSize: '15px',
                            color: '#0F172A'
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#f8fafc'}
                          onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}
                        >
                          {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Destination */}
                <div className="position-relative" style={{ flex: '1', minWidth: '200px', maxWidth: '280px' }}>
                  <label style={{
                    display: 'block',
                    color: '#0F172A',
                    fontWeight: '600',
                    marginBottom: '8px',
                    fontSize: '14px'
                  }}>
                    <i className="fas fa-plane-arrival me-2" style={{ color: '#FFD700' }}></i>
                    الوجهة
                  </label>
                  <input
                    type="text"
                    value={destinationValue}
                    onFocus={() => setShowDestinationDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDestinationDropdown(false), 200)}
                    onChange={(e) => setDestinationValue(e.target.value)}
                    placeholder="أدخل الوجهة"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      background: '#ffffff',
                      color: '#0F172A',
                      transition: 'border-color 0.3s ease'
                    }}
                  />
                  
                  {/* Popular Cities Dropdown */}
                  {showDestinationDropdown && (
                    <div className="countries-dropdown" style={{
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      right: '0',
                      background: '#ffffff',
                      border: '2px solid #e2e8f0',
                      borderTop: 'none',
                      borderRadius: '0 0 10px 10px',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      zIndex: 1000,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{
                        padding: '12px',
                        background: '#f8fafc',
                        borderBottom: '1px solid #e2e8f0',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#64748b'
                      }}>
                        المدن الاشهر
                      </div>
                      {popularCities.map((city, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setDestinationValue(city);
                            setShowDestinationDropdown(false);
                          }}
                          style={{
                            padding: '12px 15px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #f1f5f9',
                            transition: 'background-color 0.2s ease',
                            fontSize: '15px',
                            color: '#0F172A'
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#f8fafc'}
                          onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}
                        >
                          {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Departure Date */}
                <div className="position-relative" style={{ flex: '1', minWidth: '200px', maxWidth: '280px' }}>
                  <label style={{
                    display: 'block',
                    color: '#0F172A',
                    fontWeight: '600',
                    marginBottom: '8px',
                    fontSize: '14px'
                  }}>
                    <i className="fas fa-calendar me-2" style={{ color: '#FFD700' }}></i>
                    تاريخ الذهاب
                  </label>
                  <input
                    type="text"
                    value={formatDateDisplay(selectedDepartureDate)}
                    onFocus={() => setShowDepartureCalendar(true)}
                    onBlur={() => setTimeout(() => setShowDepartureCalendar(false), 200)}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      background: '#ffffff',
                      color: '#0F172A',
                      transition: 'border-color 0.3s ease',
                      cursor: 'pointer'
                    }}
                  />
                  
                  {/* Calendar Widget */}
                  {showDepartureCalendar && renderCalendarWidget(true)}
                </div>

                {/* Return Date - Only show for round trip */}
                {tripType === 'roundtrip' && (
                  <div className="position-relative" style={{ flex: '1', minWidth: '200px', maxWidth: '280px' }}>
                    <label style={{
                      display: 'block',
                      color: '#0F172A',
                      fontWeight: '600',
                      marginBottom: '8px',
                      fontSize: '14px'
                    }}>
                      <i className="fas fa-calendar-alt me-2" style={{ color: '#FFD700' }}></i>
                          تاريخ العودة
                    </label>
                    <input
                      type="text"
                      value={selectedReturnDate ? formatDateDisplay(selectedReturnDate) : 'Select return date'}
                      onFocus={() => setShowReturnCalendar(true)}
                      onBlur={() => setTimeout(() => setShowReturnCalendar(false), 200)}
                      readOnly
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '10px',
                        fontSize: '14px',
                        background: '#ffffff',
                        color: '#0F172A',
                        transition: 'border-color 0.3s ease',
                        cursor: 'pointer'
                      }}
                    />
                    
                    {/* Calendar Widget */}
                    {showReturnCalendar && renderCalendarWidget(false)}
                  </div>
                )}
              </div>

              {/* Additional Options */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'flex-start', marginTop: '20px' }}>
                {/* Passengers */}
                <div className="position-relative" style={{ flex: '1', minWidth: '200px', maxWidth: '280px' }}>
                  <label style={{
                    display: 'block',
                    color: '#0F172A',
                    fontWeight: '600',
                    marginBottom: '8px',
                    fontSize: '14px'
                  }}>
                    <i className="fas fa-users me-2" style={{ color: '#FFD700' }}></i>
                    المسافرين
                  </label>
                  <input
                    type="text"
                    value={getPassengerDisplay()}
                    onFocus={() => setShowPassengerDropdown(true)}
                    onBlur={() => setTimeout(() => setShowPassengerDropdown(false), 200)}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '14px',
                      background: '#ffffff',
                      color: '#0F172A',
                      transition: 'border-color 0.3s ease',
                      cursor: 'pointer'
                    }}
                  />
                  
                  {/* Passenger Dropdown */}
                  {showPassengerDropdown && (
                    <div className="passenger-dropdown" style={{
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      right: '0',
                      background: 'white',
                      border: '2px solid #e2e8f0',
                      borderTop: 'none',
                      borderRadius: '0 0 10px 10px',
                      padding: '20px',
                      zIndex: 1000,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      minWidth: '300px'
                    }}>
                      {/* Adult Counter */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#0F172A', fontSize: '14px' }}>البالغ</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>اكثر 12 سنة</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <button
                            onClick={decrementAdults}
                            style={{
                              background: adults > 1 ? '#FFD700' : '#e2e8f0',
                              border: 'none',
                              borderRadius: '50%',
                              width: '30px',
                              height: '30px',
                              cursor: adults > 1 ? 'pointer' : 'not-allowed',
                              color: 'white',
                              fontSize: '18px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            -
                          </button>
                          <span style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A', minWidth: '30px', textAlign: 'center' }}>
                            {adults}
                          </span>
                          <button
                            onClick={incrementAdults}
                            style={{
                              background: '#FFD700',
                              border: 'none',
                              borderRadius: '50%',
                              width: '30px',
                              height: '30px',
                              cursor: 'pointer',
                              color: 'white',
                              fontSize: '18px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Children Counter */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#0F172A', fontSize: '14px' }}>اطفال</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>2 الى 12 سنة</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <button
                            onClick={decrementChildren}
                            style={{
                              background: children > 0 ? '#FFD700' : '#e2e8f0',
                              border: 'none',
                              borderRadius: '50%',
                              width: '30px',
                              height: '30px',
                              cursor: children > 0 ? 'pointer' : 'not-allowed',
                              color: 'white',
                              fontSize: '18px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            -
                          </button>
                          <span style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A', minWidth: '30px', textAlign: 'center' }}>
                            {children}
                          </span>
                          <button
                            onClick={incrementChildren}
                            style={{
                              background: '#FFD700',
                              border: 'none',
                              borderRadius: '50%',
                              width: '30px',
                              height: '30px',
                              cursor: 'pointer',
                              color: 'white',
                              fontSize: '18px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Infants Counter */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#0F172A', fontSize: '14px' }}>رضيع</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>اقل 2 سنة</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <button
                            onClick={decrementInfants}
                            style={{
                              background: infants > 0 ? '#FFD700' : '#e2e8f0',
                              border: 'none',
                              borderRadius: '50%',
                              width: '30px',
                              height: '30px',
                              cursor: infants > 0 ? 'pointer' : 'not-allowed',
                              color: 'white',
                              fontSize: '18px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            -
                          </button>
                          <span style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A', minWidth: '30px', textAlign: 'center' }}>
                            {infants}
                          </span>
                          <button
                            onClick={incrementInfants}
                            style={{
                              background: '#FFD700',
                              border: 'none',
                              borderRadius: '50%',
                              width: '30px',
                              height: '30px',
                              cursor: 'pointer',
                              color: 'white',
                              fontSize: '18px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* زر التاكيد*/}
                      <button
                        onClick={() => setShowPassengerDropdown(false)}
                        style={{
                          background: '#FFD700',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '12px 24px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          width: '100%',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#FFD700'}
                        onMouseOut={(e) => e.target.style.background = '#FFD700'}
                      >
                        تأكيد
                      </button>
                    </div>
                  )}
                </div>

                {/* Class */}
                <div style={{ flex: '1', minWidth: '200px', maxWidth: '280px' }}>
                  <label style={{
                    display: 'block',
                    color: '#0F172A',
                    fontWeight: '600',
                    marginBottom: '8px',
                    fontSize: '14px'
                  }}>
                    <i className="fas fa-crown me-2" style={{ color: '#FFD700' }}></i>
                    الدرجة
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '8px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    background: '#ffffff',
                    color: '#0F172A'
                  }}>
                    <option>درجة الاقتصاد</option>
                    <option>درجة رجال الأعمال</option>
                    <option>درجة الأولى</option>
                  </select>
                </div>

                {/* Payment Methods */}
                <div style={{ flex: '1', minWidth: '200px', maxWidth: '280px' }}>
                  <label style={{
                    display: 'block',
                    color: '#0F172A',
                    fontWeight: '600',
                    marginBottom: '8px',
                    fontSize: '14px'
                  }}>
                    <i className="fas fa-credit-card me-2" style={{ color: '#FFD700' }}></i>
                    طرق الدفع
                  </label>
                  <select style={{
                    width: '100%',
                    padding: '8px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    background: '#ffffff',
                    color: '#0F172A'
                  }}>
                    <option>فيزا</option>
                    <option>ماستركارد</option>
                    <option>كليك</option>
                  </select>
                </div>

              </div>

              {/* Search Button */}
              <div className="text-center mt-4">
                <button
                  onClick={handleSearch}
                  style={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 36px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(15, 23, 42, 0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(15, 23, 42, 1)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(15, 23, 42, 0.95)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="fas fa-search"></i>
                  بحث
                </button>
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
              {filteredFlights.map((flight, index) => {
                // Find the original index from the complete flights array
                const originalIndex = flights.findIndex(f => 
                  f.flightNumber === flight.flightNumber && 
                  f.departure === flight.departure && 
                  f.arrival === flight.arrival &&
                  f.time === flight.time
                );
                return (
                  <SimpleFlightCard key={index} flight={{...flight, id: originalIndex}} />
                );
              })}
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