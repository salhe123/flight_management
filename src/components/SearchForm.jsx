import React, { useState } from 'react';
import {
  TextField, Button, Grid, CircularProgress, Typography, List, ListItem, ListItemButton,
  Box, Paper
} from '@mui/material';
import { searchAirports, searchFlights } from '../api/api';

const SearchForm = ({ setFlightResults, setHasSearched }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ origin: '', destination: '', general: '' });
  const [destinationImageUrl, setDestinationImageUrl] = useState('');


  // State to track if the user has searched for flights
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({ origin: '', destination: '', general: '' });
    setHasSearched(true);

    try {
      const originEntity = originSuggestions.find((s) => s.skyId === origin);
      const destinationEntity = destinationSuggestions.find((s) => s.skyId === destination);

      if (!originEntity || !destinationEntity) {
        setError({
          origin: !originEntity ? 'Please select a valid origin.' : '',
          destination: !destinationEntity ? 'Please select a valid destination.' : '',
        });
        setLoading(false);
        return;
      }

      const params = {
        originSkyId: origin,
        destinationSkyId: destination,
        date,
        originEntityId: originEntity.navigation.entityId,
        destinationEntityId: destinationEntity.navigation.entityId,
      };

      const flightsResponse = await searchFlights(params);

      if (!flightsResponse.status) {
        setError({ general: flightsResponse.message || 'No flights found.' });
        setDestinationImageUrl(flightsResponse.destinationImageUrl || '');
        setFlightResults([]);
      } else {
        setFlightResults(flightsResponse.data.itineraries || []);
        setDestinationImageUrl(flightsResponse.destinationImageUrl || '');
      }
    } catch (err) {
      console.error('Flight search error:', err);
      setError({ general: 'Something went wrong. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAutocomplete = async (query, setSuggestions) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const airports = await searchAirports(query);
      const validAirports = airports.filter(
        (airport) =>
          airport?.skyId &&
          airport.presentation?.suggestionTitle &&
          airport.navigation?.entityId
      );
      setSuggestions(validAirports);
    } catch (err) {
      console.error('Airport fetch error:', err);
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (skyId, setField, clearSuggestions) => {
    setField(skyId);
    clearSuggestions([]);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom textAlign="center">
        Flight Search
      </Typography>
      <Box component="form" onSubmit={handleSearch}>
        <Grid container spacing={3}>
          {/* Origin Input */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Origin"
              value={origin}
              onChange={(e) => {
                setOrigin(e.target.value);
                handleAutocomplete(e.target.value, setOriginSuggestions);
              }}
              fullWidth
              error={!!error.origin}
              helperText={error.origin}
            />
            {originSuggestions.length > 0 && (
              <List dense sx={{ bgcolor: '#f9f9f9', borderRadius: 1 }}>
                {originSuggestions.map((airport, idx) => (
                  <ListItem key={`${airport.skyId}-${idx}`} disablePadding>
                    <ListItemButton
                      onClick={() =>
                        handleSelectSuggestion(
                          airport.skyId,
                          setOrigin,
                          setOriginSuggestions
                        )
                      }
                    >
                      {airport.presentation.suggestionTitle}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Grid>

          {/* Destination Input */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Destination"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                handleAutocomplete(e.target.value, setDestinationSuggestions);
              }}
              fullWidth
              error={!!error.destination}
              helperText={error.destination}
            />
            {destinationSuggestions.length > 0 && (
              <List dense sx={{ bgcolor: '#f9f9f9', borderRadius: 1 }}>
                {destinationSuggestions.map((airport, idx) => (
                  <ListItem key={`${airport.skyId}-${idx}`} disablePadding>
                    <ListItemButton
                      onClick={() =>
                        handleSelectSuggestion(
                          airport.skyId,
                          setDestination,
                          setDestinationSuggestions
                        )
                      }
                    >
                      {airport.presentation.suggestionTitle}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Grid>

          {/* Date Picker */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Searching...' : 'Search Flights'}
            </Button>
          </Grid>

          {/* General Error Message */}
          {error.general && (
            <Grid item xs={12}>
              <Typography color="error" align="center">
                {error.general}
              </Typography>
            </Grid>
          )}

          {/* Optional Image Display */}
          {!loading && destinationImageUrl && error.general && (
            <Grid item xs={12}>
              <Box textAlign="center">
                <img
                  src={destinationImageUrl}
                  alt="No flights available"
                  style={{ width: '100%', maxWidth: '400px', borderRadius: 8 }}
                />
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Paper>
  );
};

export default SearchForm;
