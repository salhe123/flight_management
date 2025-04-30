import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography } from '@mui/material';

const FlightCard = ({ flight }) => {
  return (
    <Card style={{ margin: '10px 0' }}>
      <CardContent>
        <Typography variant="h6">
          {flight.presentation?.title || 'Flight'}
        </Typography>
        <Typography>
          Price: {flight.price || 'N/A'} - Duration: {flight.duration || 'N/A'}
        </Typography>
        <Typography>
          Departure: {flight.departureTime || 'N/A'} - Arrival: {flight.arrivalTime || 'N/A'}
        </Typography>
      </CardContent>
    </Card>
  );
};

FlightCard.propTypes = {
  flight: PropTypes.shape({
    presentation: PropTypes.shape({
      title: PropTypes.string,
    }),
    price: PropTypes.string,
    duration: PropTypes.string,
    departureTime: PropTypes.string,
    arrivalTime: PropTypes.string,
  }),
};

export default FlightCard;