import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const FlightCard = ({ flight }) => {
  return (
    <Card style={{ margin: '10px 0' }}>
      <CardContent>
        <Typography variant="h6">
          {flight.presentation.title || 'Flight'}
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

export default FlightCard;