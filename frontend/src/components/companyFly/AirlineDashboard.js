import React, { useState, useEffect } from 'react';
import MainNavbar from '../layout/MainNavbar';
import { flightService } from '../../services/apiService';
import './CompanyFlyStyles.css';

const AirlineDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [flights, setFlights] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [activeTab, setActiveTab] = useState('flights');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for theme preference
    const savedTheme = localStorage.getItem('theme');
    const isLightMode = savedTheme === 'light';
    setIsDarkMode(!isLightMode);

    // Listen for theme changes
    const handleThemeChange = () => {
      const currentTheme = localStorage.getItem('theme');
      setIsDarkMode(currentTheme !== 'light');
    };

    window.addEventListener('themeChanged', handleThemeChange);

    // Also check periodically for theme changes (fallback)
    const interval = setInterval(() => {
      const currentTheme = localStorage.getItem('theme');
      setIsDarkMode(currentTheme !== 'light');
    }, 500);

    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // Load flights from backend API
    loadFlights();
  }, []);

  const loadFlights = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await flightService.getFlights();
      if (response.success) {
        setFlights(response.flights);
      } else {
        setError('فشل في تحميل الرحلات');
      }
    } catch (error) {
      console.error('Error loading flights:', error);
      setError('فشل في تحميل الرحلات من الخادم');
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    flightNumber: '',
    airline: '',
    departure: '',
    arrival: '',
    departureTime: '',
    arrivalTime: '',
    date: '',
    aircraft: '',
    price: '',
    availableSeats: '',
    totalSeats: '',
    gate: '',
    terminal: '',
    status: 'scheduled'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingFlight) {
        // Update existing flight via API
        const response = await flightService.updateFlight(editingFlight._id, {
          ...formData,
          price: parseFloat(formData.price),
          availableSeats: parseInt(formData.availableSeats),
          totalSeats: parseInt(formData.totalSeats)
        });
        
        if (response.success) {
          // Reload flights from backend
          loadFlights();
        } else {
          setError('فشل في تحديث الرحلة');
        }
      } else {
        // Create new flight via API
        const response = await flightService.addFlight({
          ...formData,
          price: parseFloat(formData.price),
          availableSeats: parseInt(formData.availableSeats),
          totalSeats: parseInt(formData.totalSeats)
        });
        
        if (response.success) {
          // Reload flights from backend
          loadFlights();
        } else {
          setError('فشل في إنشاء الرحلة');
        }
      }

      // Reset form
      setFormData({
        flightNumber: '',
        airline: '',
        departure: '',
        arrival: '',
        departureTime: '',
        arrivalTime: '',
        date: '',
        aircraft: '',
        price: '',
        availableSeats: '',
        totalSeats: '',
        gate: '',
        terminal: '',
        status: 'scheduled'
      });
      setShowCreateModal(false);
      setEditingFlight(null);
    } catch (error) {
      console.error('Error saving flight:', error);
      setError('فشل في حفظ الرحلة');
    }
  };

  const handleEdit = (flight) => {
    setFormData(flight);
    setEditingFlight(flight);
    setShowCreateModal(true);
  };

  const handleDelete = async (flightId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الرحلة؟')) {
      try {
        const response = await flightService.deleteFlight(flightId);
        if (response.success) {
          // Reload flights from backend
          loadFlights();
        } else {
          setError('فشل في حذف الرحلة');
        }
      } catch (error) {
        console.error('Error deleting flight:', error);
        setError('فشل في حذف الرحلة');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return isDarkMode ? 'bg-blue-500 text-white' : 'bg-[#11a3a3] text-white';
      case 'boarding':
        return isDarkMode ? 'bg-yellow-500 text-black' : 'bg-yellow-400 text-black';
      case 'departed':
        return isDarkMode ? 'bg-green-500 text-white' : 'bg-green-600 text-white';
      case 'cancelled':
        return isDarkMode ? 'bg-red-500 text-white' : 'bg-red-600 text-white';
      case 'delayed':
        return isDarkMode ? 'bg-orange-500 text-white' : 'bg-orange-500 text-white';
      default:
        return isDarkMode ? 'bg-gray-500 text-white' : 'bg-gray-400 text-white';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'scheduled':
        return 'Scheduled';
      case 'boarding':
        return 'Boarding';
      case 'departed':
        return 'Departed';
      case 'cancelled':
        return 'Cancelled';
      case 'delayed':
        return 'Delayed';
      default:
        return 'Unknown';
    }
  };

  const getStatusCount = (status) => {
    return flights.filter(flight => flight.status === status).length;
  };

  const totalRevenue = flights.reduce((sum, flight) => sum + (flight.price * (flight.totalSeats - flight.availableSeats)), 0);
  const totalPassengers = flights.reduce((sum, flight) => sum + (flight.totalSeats - flight.availableSeats), 0);

  return (
    <div className={`dashboard-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <MainNavbar />
      <div className={`airline-dashboard ${isDarkMode ? '' : 'light-mode'}`}>
        <div className="dashboard-header">
          <h1>Airline Dashboard</h1>
          <button 
            className={`btn-create ${isDarkMode ? '' : 'light-mode'}`}
            onClick={() => setShowCreateModal(true)}
          >
            ✈️ Create Flight
          </button>
        </div>

        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'flights' ? 'active' : ''} ${isDarkMode ? '' : 'light-mode'}`}
            onClick={() => setActiveTab('flights')}
          >
            Flights ({flights.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''} ${isDarkMode ? '' : 'light-mode'}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>

      {activeTab === 'flights' && (
        <>
          <div className="flights-stats">
            <div className={`stat-card ${isDarkMode ? '' : 'light-mode'}`}>
              <div className={`stat-icon ${isDarkMode ? '' : 'light-mode'}`}>
                ✈️
              </div>
              <div className="stat-info">
                <h3>{flights.length}</h3>
                <p>Total Flights</p>
              </div>
            </div>
            <div className={`stat-card ${isDarkMode ? '' : 'light-mode'}`}>
              <div className={`stat-icon ${isDarkMode ? '' : 'light-mode'}`}>
                👥
              </div>
              <div className="stat-info">
                <h3>{totalPassengers}</h3>
                <p>Total Passengers</p>
              </div>
            </div>
            <div className={`stat-card ${isDarkMode ? '' : 'light-mode'}`}>
              <div className={`stat-icon ${isDarkMode ? '' : 'light-mode'}`}>
                💰
              </div>
              <div className="stat-info">
                <h3>${totalRevenue.toLocaleString()}</h3>
                <p>Total Revenue</p>
              </div>
            </div>
            <div className={`stat-card ${isDarkMode ? '' : 'light-mode'}`}>
              <div className={`stat-icon ${isDarkMode ? '' : 'light-mode'}`}>
                📊
              </div>
              <div className="stat-info">
                <h3>{getStatusCount('scheduled')}</h3>
                <p>Scheduled</p>
              </div>
            </div>
          </div>

          <div className="flights-filters">
            <button className={`filter-btn ${isDarkMode ? '' : 'light-mode'} active`}>
              All Flights ({flights.length})
            </button>
            <button className={`filter-btn ${isDarkMode ? '' : 'light-mode'}`}>
              Scheduled ({getStatusCount('scheduled')})
            </button>
            <button className={`filter-btn ${isDarkMode ? '' : 'light-mode'}`}>
              Boarding ({getStatusCount('boarding')})
            </button>
            <button className={`filter-btn ${isDarkMode ? '' : 'light-mode'}`}>
              Departed ({getStatusCount('departed')})
            </button>
            <button className={`filter-btn ${isDarkMode ? '' : 'light-mode'}`}>
              Cancelled ({getStatusCount('cancelled')})
            </button>
          </div>

          <div className="flights-grid">
            {flights.map((flight) => (
              <div key={flight.id} className={`flight-card ${isDarkMode ? '' : 'light-mode'}`}>
                <div className="flight-header">
                  <div className="flight-info">
                    <h3>{flight.flightNumber}</h3>
                    <p className="airline">{flight.airline}</p>
                  </div>
                  <div className={`flight-status ${getStatusColor(flight.status)}`}>
                    {getStatusText(flight.status)}
                  </div>
                </div>
                
                <div className="flight-route">
                  <div className="route-point">
                    <h4>{flight.departure}</h4>
                    <p>{flight.departureTime}</p>
                  </div>
                  <div className="route-line">
                    ✈️
                  </div>
                  <div className="route-point">
                    <h4>{flight.arrival}</h4>
                    <p>{flight.arrivalTime}</p>
                  </div>
                </div>

                <div className="flight-details">
                  <div className="detail-item">
                    <span className="label">Date:</span>
                    <span className="value">{flight.date}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Aircraft:</span>
                    <span className="value">{flight.aircraft}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Gate:</span>
                    <span className="value">{flight.gate}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Terminal:</span>
                    <span className="value">{flight.terminal}</span>
                  </div>
                </div>

                <div className="flight-seats">
                  <div className="seats-info">
                    <span className="available">{flight.availableSeats}</span>
                    <span className="separator">/</span>
                    <span className="total">{flight.totalSeats}</span>
                    <span className="label">Seats</span>
                  </div>
                  <div className="seats-progress">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${((flight.totalSeats - flight.availableSeats) / flight.totalSeats) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flight-price">
                  <span className="price">${flight.price}</span>
                </div>

                <div className="flight-actions">
                  <button 
                    className={`btn-edit ${isDarkMode ? '' : 'light-mode'}`}
                    onClick={() => handleEdit(flight)}
                  >
                    Edit
                  </button>
                  <button 
                    className={`btn-delete ${isDarkMode ? '' : 'light-mode'}`}
                    onClick={() => handleDelete(flight.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'analytics' && (
        <div className="analytics-section">
          <div className="analytics-grid">
            <div className={`chart-container ${isDarkMode ? '' : 'light-mode'}`}>
              <h3>Flight Status Distribution</h3>
              <div className="chart-placeholder">
                <div className="status-chart">
                  <div className="chart-item">
                    <div className="chart-color scheduled"></div>
                    <span>Scheduled: {getStatusCount('scheduled')}</span>
                  </div>
                  <div className="chart-item">
                    <div className="chart-color boarding"></div>
                    <span>Boarding: {getStatusCount('boarding')}</span>
                  </div>
                  <div className="chart-item">
                    <div className="chart-color departed"></div>
                    <span>Departed: {getStatusCount('departed')}</span>
                  </div>
                  <div className="chart-item">
                    <div className="chart-color cancelled"></div>
                    <span>Cancelled: {getStatusCount('cancelled')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`chart-container ${isDarkMode ? '' : 'light-mode'}`}>
              <h3>Revenue Overview</h3>
              <div className="chart-placeholder">
                <div className="revenue-summary">
                  <div className="revenue-item">
                    <span className="label">Total Revenue:</span>
                    <span className="value">${totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="revenue-item">
                    <span className="label">Average per Flight:</span>
                    <span className="value">${flights.length > 0 ? Math.round(totalRevenue / flights.length) : 0}</span>
                  </div>
                  <div className="revenue-item">
                    <span className="label">Total Passengers:</span>
                    <span className="value">{totalPassengers}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="modal-overlay">
          <div className={`modal-content ${isDarkMode ? '' : 'light-mode'}`}>
            <div className="modal-header">
              <h2>{editingFlight ? 'Edit Flight' : 'Create New Flight'}</h2>
              <button 
                className="btn-close"
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingFlight(null);
                  setFormData({
                    flightNumber: '',
                    airline: '',
                    departure: '',
                    arrival: '',
                    departureTime: '',
                    arrivalTime: '',
                    date: '',
                    aircraft: '',
                    price: '',
                    availableSeats: '',
                    totalSeats: '',
                    gate: '',
                    terminal: '',
                    status: 'scheduled'
                  });
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flight-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Flight Number *</label>
                  <input
                    type="text"
                    name="flightNumber"
                    value={formData.flightNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. SV123"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Airline *</label>
                  <input
                    type="text"
                    name="airline"
                    value={formData.airline}
                    onChange={handleInputChange}
                    placeholder="e.g. Saudia"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Departure City *</label>
                  <input
                    type="text"
                    name="departure"
                    value={formData.departure}
                    onChange={handleInputChange}
                    placeholder="e.g. Riyadh"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Arrival City *</label>
                  <input
                    type="text"
                    name="arrival"
                    value={formData.arrival}
                    onChange={handleInputChange}
                    placeholder="e.g. Dubai"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Departure Time *</label>
                  <input
                    type="time"
                    name="departureTime"
                    value={formData.departureTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Arrival Time *</label>
                  <input
                    type="time"
                    name="arrivalTime"
                    value={formData.arrivalTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Aircraft *</label>
                  <input
                    type="text"
                    name="aircraft"
                    value={formData.aircraft}
                    onChange={handleInputChange}
                    placeholder="e.g. Boeing 777"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g. 1200"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Available Seats *</label>
                  <input
                    type="number"
                    name="availableSeats"
                    value={formData.availableSeats}
                    onChange={handleInputChange}
                    placeholder="e.g. 45"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Total Seats *</label>
                  <input
                    type="number"
                    name="totalSeats"
                    value={formData.totalSeats}
                    onChange={handleInputChange}
                    placeholder="e.g. 180"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Gate</label>
                  <input
                    type="text"
                    name="gate"
                    value={formData.gate}
                    onChange={handleInputChange}
                    placeholder="e.g. A12"
                  />
                </div>

                <div className="form-group">
                  <label>Terminal</label>
                  <input
                    type="text"
                    name="terminal"
                    value={formData.terminal}
                    onChange={handleInputChange}
                    placeholder="e.g. 1"
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="boarding">Boarding</option>
                    <option value="departed">Departed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="delayed">Delayed</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className={`btn-cancel ${isDarkMode ? '' : 'light-mode'}`}
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingFlight(null);
                    setFormData({
                      flightNumber: '',
                      airline: '',
                      departure: '',
                      arrival: '',
                      departureTime: '',
                      arrivalTime: '',
                      date: '',
                      aircraft: '',
                      price: '',
                      availableSeats: '',
                      totalSeats: '',
                      gate: '',
                      terminal: '',
                      status: 'scheduled'
                    });
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={`btn-submit ${isDarkMode ? '' : 'light-mode'}`}
                >
                  {editingFlight ? 'Update Flight' : 'Create Flight'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AirlineDashboard;
