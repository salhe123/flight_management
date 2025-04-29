import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://sky-scrapper.p.rapidapi.com', 
  headers: {
    'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
  },
});

// Function to fetch nearby airports based on latitude and longitude
export const getNearbyAirports = async (lat, lng) => {
  try {
    const response = await apiClient.get('/api/v1/flights/getNearByAirports', {
      params: { lat, lng },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching nearby airports:', error);
    throw error;
  }
};

// Function to search for airports based on a query (city or airport name)
export const searchAirports = async (query) => {
  try {
    const response = await apiClient.get('/api/v1/flights/searchAirport', {
      params: { query },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error searching airports:', error);
    throw error;
  }
};

// Function to search for flights based on origin, destination, and date
export const searchFlights = async (params) => {
  try {
    console.log('API Request Params:', params); // Debugging: Log the request parameters
    const response = await apiClient.get('/api/v1/flights/searchFlights', { params });
    console.log('API Response:', response.data); // Debugging: Log the raw API response
    return response.data;
  } catch (err) {
    console.error('API Error:', err); // Log any API errors
    throw err; // Re-throw the error for the calling function to handle
  }
};