import React from 'react';
import FlightCard from './FlightCard';

const FlightsGrid = ({ flights }) => (
  <div className="flights-grid">
    {flights.map(flight => <FlightCard key={flight.id} flight={flight} />)}
  </div>
);

export default FlightsGrid;
