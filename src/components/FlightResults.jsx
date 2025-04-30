import React from 'react';
import PropTypes from 'prop-types';
import FlightCard from './FlightCard';
import { Typography, Box } from '@mui/material';

//show loading state and no results found
const FlightResults = ({ flights, hasSearched, loading, destinationImageUrl }) => {
  if (!hasSearched) {
    return null; 
  }

  if (loading) {
    return (
      <Typography variant="body1" color="textSecondary">
        Searching for flights...
      </Typography>
    );
  }

  return (
    <div>
      {flights.length > 0 ? (
        flights.map((flight, index) => <FlightCard key={index} flight={flight} />)
      ) : (
        <Box textAlign="center" marginTop={4}>
          <img
            src={destinationImageUrl || 'https://via.placeholder.com/150'}
            alt="No flights available"
            style={{ width: '100%', maxWidth: '400px', marginBottom: '20px' }}
          />
          <Typography variant="body1" color="textSecondary">
            No flights match your search criteria. Please try changing your search parameters.
          </Typography>
        </Box>
      )}
    </div>
  );
};

FlightResults.propTypes = {
  flights: PropTypes.array.isRequired,
  hasSearched: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  destinationImageUrl: PropTypes.string,
};

export default FlightResults;