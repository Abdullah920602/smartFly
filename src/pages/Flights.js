import React, { useState, useEffect } from 'react';
import { getFlights } from '../services/firebaseService';
import SimpleFlightCard from '../components/ui/SimpleFlightCard';
import AirlineSelector from '../components/ui/AirlineSelector';
import '../styles/pages/Flights.css';
import '../styles/simplified-flights.css';
import FlightDetails from './FlightDetails';
import { sampleFlights } from '../utils/sampleData.js';

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

  const priceRanges = [
    { label: 'All prices', value: '' },
    { label: 'Less than 300 JOD', value: '0-300' },
    { label: '300 - 500 JOD', value: '300-500' },
    { label: '500 - 700 JOD', value: '500-700' },
    { label: 'More than 700 JOD', value: '700+' }
  ];

  // Calculate flight counts for each airline
  const calculateFlightCounts = (flightsData) => {
    const counts = { total: flightsData.length };
    airlines.forEach(airline => {
      counts[airline] = flightsData.filter(flight => 
        flight.airline && flight.airline.toLowerCase().includes(airline.toLowerCase())
      ).length;
    });
    return counts;
  };

  // Fetch flights
  const fetchFlights = async () => {
    try {
      setLoading(true);
      // Use same sample flights data as Home.js for consistency
      console.log('Loading sample flights directly...');
      console.log('Sample flights loaded:', sampleFlights.length);
      console.log('First flight:', sampleFlights[0]);
      setFlights(sampleFlights);
      setFilteredFlights(sampleFlights);
      setFlightCounts(calculateFlightCounts(sampleFlights));
    } catch (error) {
      console.error('Error fetching flights:', error);
    } finally {
      setLoading(false);
    }
  };

  // AI search (separate from chat)
  const handleAiSearch = async (searchTerm = aiSearchTerm) => {
    if (!searchTerm.trim()) {
      applyFilters();
      return;
    }
    
    try {
      setIsAiSearching(true);
      // Local search in flights
      const filtered = flights.filter(flight => 
        flight.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.arrival.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFlights(filtered);
      
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsAiSearching(false);
    }
  };

  // Apply filters to flights
  const applyFilters = () => {
    let filtered = [...flights];
    
    // Filter by airline
    if (filters.airline) {
      filtered = filtered.filter(flight => 
        flight.airline && flight.airline.toLowerCase().includes(filters.airline.toLowerCase())
      );
    }
    
    // Filter by departure city
    if (filters.departure) {
      filtered = filtered.filter(flight => 
        flight.departure && flight.departure.toLowerCase().includes(filters.departure.toLowerCase())
      );
    }
    
    // Filter by arrival city
    if (filters.arrival) {
      filtered = filtered.filter(flight => 
        flight.arrival && flight.arrival.toLowerCase().includes(filters.arrival.toLowerCase())
      );
    }
    
    // Filter by date
    if (filters.date) {
      filtered = filtered.filter(flight => flight.date === filters.date);
    }
    
    setFilteredFlights(filtered);
  };
  
  // Select airline
  const handleAirlineSelect = (airline) => {
    setSelectedAirline(airline);
    setFilters(prev => ({
      ...prev,
      airline: airline
    }));
    setAiSearchTerm(''); // Clear AI search when selecting airline
    setSearchCriteria(null);
  };
  
  // Update filters
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    if (filterName === 'airline') {
      setSelectedAirline(value);
    }
  };

  // Clear all filters
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
  
  // Apply filters when changed
  useEffect(() => {
    if (!aiSearchTerm) {
      applyFilters();
    }
  }, [filters, flights]);

  // Check voice search support
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
      <div className="flights-header" style={{ 
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center',
        marginBottom: '40px',
        boxShadow: '0 2px 20px rgba(15, 23, 42, 0.1)',
        borderBottom: '1px solid rgba(255, 215, 0, 0.2)'
      }}>
        <div className="container">
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700',
            marginBottom: '16px',
            color: 'white'
          }}>
            <i className="fas fa-plane-departure me-3" style={{ color: '#FFD700' }}></i>
            {selectedAirline ? `All Available Flights` : 'All Available Flights'} ({filteredFlights.length})
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: 'rgba(255, 255, 255, 0.9)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Choose from a wide range of Jordanian flights
          </p>
        </div>
      </div>
      
      <div className="container">
        {/* Airline selection */}
        <AirlineSelector 
          selectedAirline={selectedAirline}
          onAirlineSelect={handleAirlineSelect}
          airlines={airlines}
          flightCounts={flightCounts}
        />
        
        {/* Additional filters - show only when airline is selected */}
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
                Filtering flights for {selectedAirline}
              </small>
            </div>
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label" style={{ color: 'var(--jordan-royal)', fontWeight: '600', fontSize: '14px' }}>From</label>
                <select
                  className="form-select"
                  value={filters.departure}
                  onChange={(e) => handleFilterChange('departure', e.target.value)}
                >
                  <option value="">Any city</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label" style={{ color: 'var(--jordan-royal)', fontWeight: '600', fontSize: '14px' }}>To</label>
                <select
                  className="form-select"
                  value={filters.arrival}
                  onChange={(e) => handleFilterChange('arrival', e.target.value)}
                >
                  <option value="">Any city</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <button className="btn btn-outline-secondary w-100" onClick={clearFilters}>
                  <i className="fas fa-times me-1"></i>Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Search results */}
        <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
          <div className="results-header text-center mb-4">
            <h2 style={{ color: 'var(--jordan-royal)', fontWeight: '600' }}>
              <i className="fas fa-plane-departure me-3" style={{ color: 'var(--jordan-gold)' }}></i>
              Available Flights ({filteredFlights.length})
            </h2>
            <p style={{ color: 'var(--jordan-stone)', fontSize: '1.1rem' }}>
              Choose from a wide range of Jordanian flights
            </p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner-border" style={{ color: 'var(--jordan-gold)' }}> 
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading flights...</p>
            </div>
          ) : filteredFlights.length === 0 ? (
            <div className="no-results">
              <i className="fas fa-plane-slash fa-3x text-muted mb-3"></i>
              <h4>No flights available</h4>
              <p className="text-muted">
                No flights found matching search criteria
              </p>
            </div>
          ) : (
            <div>
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
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Flights;
