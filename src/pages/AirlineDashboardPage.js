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
import '../components/companyFly/CompanyFlyStyles.css';

const AirlineDashboardPage = () => {
  const [searchParams] = useSearchParams();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [flights, setFlights] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'flights');

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
    // Load flights from localStorage
    const savedFlights = localStorage.getItem('airlineFlights');
    if (savedFlights) {
      setFlights(JSON.parse(savedFlights));
    } else {
      // Mock data for demonstration
      const mockFlights = [
        {
          id: 1,
          flightNumber: 'SV123',
          airline: 'السعودية',
          departure: 'الرياض',
          arrival: 'دبي',
          departureTime: '08:00',
          arrivalTime: '10:30',
          date: '2024-03-20',
          aircraft: 'Boeing 777',
          status: 'scheduled',
          price: 1200,
          availableSeats: 45,
          totalSeats: 180,
          gate: 'A12',
          terminal: '1'
        },
        {
          id: 2,
          flightNumber: 'EY456',
          airline: 'الاتحاد',
          departure: 'جدة',
          arrival: 'أبو ظبي',
          departureTime: '14:15',
          arrivalTime: '16:45',
          date: '2024-03-20',
          aircraft: 'Airbus A320',
          status: 'boarding',
          price: 850,
          availableSeats: 12,
          totalSeats: 150,
          gate: 'B8',
          terminal: '2'
        }
      ];
      setFlights(mockFlights);
      localStorage.setItem('airlineFlights', JSON.stringify(mockFlights));
    }
  }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingFlight) {
      // Update existing flight
      const updatedFlights = flights.map(flight => 
        flight.id === editingFlight.id 
          ? { ...formData, id: editingFlight.id, price: parseFloat(formData.price) }
          : flight
      );
      setFlights(updatedFlights);
      localStorage.setItem('airlineFlights', JSON.stringify(updatedFlights));
    } else {
      // Create new flight
      const newFlight = {
        ...formData,
        id: Date.now(),
        price: parseFloat(formData.price),
        availableSeats: parseInt(formData.availableSeats),
        totalSeats: parseInt(formData.totalSeats)
      };
      const updatedFlights = [...flights, newFlight];
      setFlights(updatedFlights);
      localStorage.setItem('airlineFlights', JSON.stringify(updatedFlights));
    }

    // Reset form
    resetForm();
  };

  const resetForm = () => {
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
  };

  const handleEdit = (flight) => {
    setFormData(flight);
    setEditingFlight(flight);
    setShowCreateModal(true);
  };

  const handleDelete = (flightId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الرحلة؟')) {
      const updatedFlights = flights.filter(flight => flight.id !== flightId);
      setFlights(updatedFlights);
      localStorage.setItem('airlineFlights', JSON.stringify(updatedFlights));
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
