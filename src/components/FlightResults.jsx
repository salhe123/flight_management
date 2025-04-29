import React from 'react';
import FlightCard from './FlightCard';

const FlightResults = ({ flights, hasSearched }) => {
  if (!hasSearched) {
    return null; // Do not show anything initially
  }

  return (
    <div>
      {flights.length > 0 ? (
        flights.map((flight, index) => <FlightCard key={index} flight={flight} />)
      ) : (
        <p>No flights match your search criteria. Please try again.</p>
      )}
    </div>
  );
};

export default FlightResults;