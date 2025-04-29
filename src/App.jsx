import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import FlightResults from './components/FlightResults';

const App = () => {
  const [flightResults, setFlightResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Flight Search</h1>
      <SearchForm setFlightResults={setFlightResults} setHasSearched={setHasSearched} />
      <FlightResults flights={flightResults} hasSearched={hasSearched} />
    </div>
  );
};

export default App;