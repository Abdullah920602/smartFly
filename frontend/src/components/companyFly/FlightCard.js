import React from 'react';
import './CompanyFlyStyles.css';

const FlightCard = ({ 
  flight, 
  onEdit, 
  onDelete, 
  getStatusColor, 
  getStatusText, 
  isDarkMode 
}) => {
  const seatsOccupied = flight.totalSeats - flight.availableSeats;
  const seatsPercentage = (seatsOccupied / flight.totalSeats) * 100;

  return (
    <div className={`flight-card ${isDarkMode ? '' : 'light-mode'}`}>
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
          <i className="fas fa-plane"></i>
        </div>
        <div className="route-point">
          <h4>{flight.arrival}</h4>
          <p>{flight.arrivalTime}</p>
        </div>
      </div>

      <div className="flight-details">
        <div className="detail-item">
          <span className="label">التاريخ:</span>
          <span className="value">{flight.date}</span>
        </div>
        <div className="detail-item">
          <span className="label">الطائرة:</span>
          <span className="value">{flight.aircraft}</span>
        </div>
        <div className="detail-item">
          <span className="label">البوابة:</span>
          <span className="value">{flight.gate}</span>
        </div>
        <div className="detail-item">
          <span className="label">المرحل:</span>
          <span className="value">{flight.terminal}</span>
        </div>
      </div>

      <div className="flight-seats">
        <div className="seats-info">
          <span className="available">{flight.availableSeats}</span>
          <span className="separator">/</span>
          <span className="total">{flight.totalSeats}</span>
          <span className="label">مقاعد</span>
        </div>
        <div className="seats-progress">
          <div 
            className="progress-bar" 
            style={{ width: `${seatsPercentage}%` }}
          />
        </div>
      </div>

      <div className="flight-price">
        <span className="price">${flight.price}</span>
      </div>

      <div className="flight-actions">
        <button 
          className={`btn-edit ${isDarkMode ? '' : 'light-mode'}`}
          onClick={() => onEdit(flight)}
        >
          <i className="fas fa-edit me-1"></i>
          تعديل
        </button>
        <button 
          className={`btn-delete ${isDarkMode ? '' : 'light-mode'}`}
          onClick={() => onDelete(flight.id)}
        >
          <i className="fas fa-trash me-1"></i>
          حذف
        </button>
      </div>
    </div>
  );
};

export default FlightCard;
