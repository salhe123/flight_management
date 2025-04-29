import React, { useState } from 'react';
import { TextField, Button, Grid, CircularProgress, Typography, List, ListItem, ListItemButton } from '@mui/material';
import { searchAirports, searchFlights } from '../api/api';

const SearchForm = ({ setFlightResults, setHasSearched }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ origin: '', destination: '', general: '' });

  // Handle Search Button Click
  const handleSearch = async () => {
    setLoading(true);
    setError({ origin: '', destination: '', general: '' }); // Reset errors
    setHasSearched(true); // Mark as searched
  
    try {
      const params = {
        originSkyId: origin, // Only SkyId (e.g., 'GAN')
        destinationSkyId: destination, // Only SkyId (e.g., 'STN')
        date,
      };
  
      console.log('API Request Params:', params); // Debugging: Log the request params
  
      const flights = await searchFlights(params);
  
      console.log('API Response:', flights); // Debugging: Log the API response
  
      if (!flights.status) {
        const newError = { origin: '', destination: '', general: '' };
  
        flights.message.forEach((error) => {
          if (error.originEntityId) newError.origin = error.originEntityId;
          if (error.destinationEntityId) newError.destination = error.destinationEntityId;
        });
  
        setError(newError);
        setFlightResults([]); // Clear previous results in case of error
      } else {
        setFlightResults(flights.data); // Successfully set flight results
      }
    } catch (error) {
      console.error('Error searching flights:', error.message || error);
      setError({ general: 'Something went wrong. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch Suggestions Dynamically as User Types
  const handleAutocomplete = async (query, setSuggestions) => {
    if (!query) {
      setSuggestions([]); // Clear suggestions if input is empty
      return;
    }
    try {
      const airports = await searchAirports(query);
      console.log('API Response:', airports); // Log the raw API response
  
      // Filter out invalid entries
      const validAirports = airports.filter(
        (airport) =>
          airport && // Ensure the airport object exists
          airport.skyId && // Ensure skyId exists
          airport.presentation?.suggestionTitle // Ensure suggestionTitle exists
      );
  
      setSuggestions(validAirports); // Update suggestions with valid data
      console.log('Valid Suggestions:', validAirports); // Log filtered suggestions
    } catch (error) {
      console.error('Error fetching airport suggestions:', error);
      setSuggestions([]); // Clear suggestions on error
    }
  };

  // Handle Selecting a Suggestion
  const handleSelectSuggestion = (skyId, title, setField, clearSuggestions) => {
    setField(skyId); // Set the NAME/TITLE (e.g., "Addis Ababa") in the input field
    clearSuggestions([]); // Clear the suggestions list
    console.log(`Selected ${title} (${skyId})`); // Debugging: Show what was selected
  };

  return (
    <Grid container spacing={2}>
      {/* Origin Input Field */}
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
        {/* Suggestions Dropdown */}
        {originSuggestions.length > 0 && (
          <List>
          {originSuggestions.map((airport, index) => {
            // Skip invalid entries
            if (!airport || !airport.skyId || !airport.presentation?.suggestionTitle) {
              console.warn('Skipping invalid suggestion:', airport);
              return null;
            }
        
            return (
              <ListItem key={`${airport.skyId}-${index}`}>
                <ListItemButton
                  onClick={() =>
                    handleSelectSuggestion(
                      airport.skyId, // Pass SkyId
                      airport.presentation.suggestionTitle, // Pass Title (e.g., "Addis Ababa")
                      setOrigin, // Update Origin Input Field
                      setOriginSuggestions // Clear Suggestions
                    )
                  }
                >
                  {airport.presentation.suggestionTitle}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        )}
      </Grid>

      {/* Destination Input Field */}
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
        {/* Suggestions Dropdown */}
        {/* Suggestions Dropdown for Destination */}
{destinationSuggestions.length > 0 && (
  <List>
    {destinationSuggestions.map((airport, index) => {
      // Ensure the airport object and required fields are valid
      if (!airport || !airport.skyId || !airport.presentation?.suggestionTitle) {
        console.warn('Skipping invalid suggestion:', airport);
        return null; // Skip invalid entries
      }

      return (
        <ListItem key={`${airport.skyId}-${index}`}>
          <ListItemButton
            onClick={() =>
              handleSelectSuggestion(
                airport.skyId, // Pass SkyId
                airport.presentation.suggestionTitle, // Pass Title (e.g., "Bangkok")
                setDestination, // Update Destination Input Field
                setDestinationSuggestions // Clear Suggestions
              )
            }
          >
            {airport.presentation.suggestionTitle}
          </ListItemButton>
        </ListItem>
      );
    })}
  </List>
)}
      </Grid>

      {/* Date Input Field */}
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

      {/* Search Button */}
      <Grid item xs={12}>
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Searching...' : 'Search Flights'}
        </Button>
      </Grid>

      {/* General Error Message */}
      {error.general && (
        <Grid item xs={12}>
          <Typography color="error">{error.general}</Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default SearchForm;