import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  DashboardHeader, 
  DashboardTabs, 
  FlightsStats, 
  FlightsGrid, 
  AnalyticsSection, 
  FlightModal 
} from '../components/companyFly';
import { flightService } from '../services/apiService';
import '../components/companyFly/CompanyFlyStyles.css';

const AirlineDashboardPage = () => {
  const [searchParams] = useSearchParams();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [flights, setFlights] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'flights');
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
          loadFlights();
        } else {
          setError('فشل في إنشاء الرحلة');
        }
      }

      // Reset form
      resetForm();
    } catch (error) {
      console.error('Error saving flight:', error);
      setError('فشل في حفظ الرحلة');
    }
  };

  const resetForm = () => {
    setFormData({
      flightNumber: '',
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
        return 'مجدولة';
      case 'boarding':
        return 'صعود';
      case 'departed':
        return 'مغادرة';
      case 'cancelled':
        return 'ملغاة';
      case 'delayed':
        return 'متأخرة';
      default:
        return 'غير معروف';
    }
  };

  const getStatusCount = (status) => {
    return flights.filter(flight => flight.status === status).length;
  };

  const totalRevenue = flights.reduce((sum, flight) => sum + (flight.price * (flight.totalSeats - flight.availableSeats)), 0);
  const totalPassengers = flights.reduce((sum, flight) => sum + (flight.totalSeats - flight.availableSeats), 0);

  return (
    <div className={`companyfly-dashboard ${isDarkMode ? '' : 'light-mode'}`}>
      <div className="dashboard-content">
        <DashboardHeader 
          onCreateFlight={() => setShowCreateModal(true)} 
          isDarkMode={isDarkMode} 
        />

        <DashboardTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          flightsCount={flights.length}
          isDarkMode={isDarkMode}
        />

        {activeTab === 'flights' && (
          <>
            <FlightsStats 
              flights={flights}
              totalPassengers={totalPassengers}
              totalRevenue={totalRevenue}
              getStatusCount={getStatusCount}
              isDarkMode={isDarkMode}
            />

            <FlightsGrid 
              flights={flights}
              onEdit={handleEdit}
              onDelete={handleDelete}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              isDarkMode={isDarkMode}
            />
          </>
        )}

        {activeTab === 'analytics' && (
          <AnalyticsSection 
            flights={flights}
            totalRevenue={totalRevenue}
            totalPassengers={totalPassengers}
            getStatusCount={getStatusCount}
            isDarkMode={isDarkMode}
          />
        )}
      </div>

      <FlightModal 
        show={showCreateModal}
        onClose={resetForm}
        onSubmit={handleSubmit}
        formData={formData}
        onInputChange={handleInputChange}
        editingFlight={editingFlight}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default AirlineDashboardPage;
