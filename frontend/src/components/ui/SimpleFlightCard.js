import React from 'react';
import { useNavigate } from 'react-router-dom';

const SimpleFlightCard = ({ flight }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/flight/${flight.id}`);
  };
  return (
    <div className="simple-flight-card" style={{
      background: 'var(--jordan-white)',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '16px',
      boxShadow: 'var(--soft-shadow)',
      transition: 'var(--smooth-transition)',
      border: '1px solid #f1f5f9'
    }}>
      <div className="flight-header d-flex justify-content-between align-items-start mb-3">
        <div className="airline-info">
          <h6 style={{ color: 'var(--jordan-royal)', margin: 0, fontSize: '16px', fontWeight: '600' }}>
            <i className="fas fa-plane me-2" style={{ color: 'var(--jordan-gold)' }}></i>
            {flight.airline}
          </h6>
          <small className="text-muted">{flight.flightNumber}</small>
        </div>
        <div className="flight-status">
          <span className="badge" style={{
            background: flight.status === 'Available' ? 'var(--jordan-sage)' : '#ffc107',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '11px'
          }}>
            {flight.status === 'Available' ? 'متاح' : flight.status}
          </span>
        </div>
      </div>

      <div className="flight-route d-flex align-items-center justify-content-between mb-3">
        <div className="departure text-center">
          <div style={{ color: 'var(--jordan-royal)', fontWeight: '600', fontSize: '18px' }}>
            {flight.departure}
          </div>
          <small className="text-muted">{flight.time}</small>
        </div>
        
        <div className="route-line flex-grow-1 mx-3 position-relative">
          <div style={{
            height: '2px',
            background: 'linear-gradient(90deg, var(--jordan-gold) 0%, var(--jordan-sage) 100%)',
            position: 'relative'
          }}>
            <i className="fas fa-plane" style={{
              position: 'absolute',
              top: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'var(--jordan-gold)',
              fontSize: '16px'
            }}></i>
          </div>
        </div>
        
        <div className="arrival text-center">
          <div style={{ color: 'var(--jordan-royal)', fontWeight: '600', fontSize: '18px' }}>
            {flight.arrival}
          </div>
          <small className="text-muted">{flight.date}</small>
        </div>
      </div>

      <div className="flight-footer d-flex justify-content-between align-items-center">
        <div className="price-info">
          <span style={{ 
            color: 'var(--jordan-black)', 
            fontSize: '20px', 
            fontWeight: '700' 
          }}>
            {flight.price} دينار
          </span>
          <small className="text-muted d-block">سعر التذكرة</small>
        </div>
        
        <div className="action-buttons">
    
          <button 
            className="btn btn-sm" 
            onClick={handleViewDetails}
            style={{
              background: 'var(--primary-gradient)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px'
            }}
          >
            <i className="fas fa-ticket-alt me-1"></i>
            احجز
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleFlightCard;
