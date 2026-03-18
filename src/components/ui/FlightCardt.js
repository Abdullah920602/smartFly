import React from 'react';

const FlightCart = ({ flight }) => {
  return (
    <div className="flight-card">
      <div className="flight-header">
        <h5>{flight.airline}</h5>
        <span className="flight-number">{flight.flightNumber}</span>
      </div>
      <div className="flight-route">
        <div className="departure">
          <strong>{flight.departure}</strong>
          <small>{flight.departureTime}</small>
        </div>
        <div className="route-arrow">→</div>
        <div className="arrival">
          <strong>{flight.arrival}</strong>
          <small>{flight.arrivalTime}</small>
        </div>
      </div>
      <div className="flight-footer">
        <div className="price">
          <strong>{flight.price} دينار</strong>
        </div>
        <button className="btn btn-primary btn-sm">حجز</button>
      </div>
    </div>
  );
};

export default FlightCart;
