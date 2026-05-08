import React from 'react';
import FlightCard from './FlightCard';
import './CompanyFlyStyles.css';

const FlightsGrid = ({ 
  flights, 
  onEdit, 
  onDelete, 
  getStatusColor, 
  getStatusText, 
  isDarkMode 
}) => {
  return (
    <div className="flights-grid">
      {flights.map((flight) => (
        <FlightCard
          key={flight.id}
          flight={flight}
          onEdit={onEdit}
          onDelete={onDelete}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          isDarkMode={isDarkMode}
        />
      ))}
    </div>
  );
};

export default FlightsGrid;
