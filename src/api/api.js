import axios from 'axios';

//0f62e45032mshb7f109360ae181dp16c1bejsn29c1c87f435d

const apiClient = axios.create({
  baseURL: 'https://sky-scrapper.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
  },
});

if (!import.meta.env.VITE_RAPIDAPI_KEY) {
  console.error('RAPIDAPI Key is missing in environment variables');
}

// Function to fetch nearby airports based on latitude and longitude
export const getNearbyAirports = async (lat, lng) => {
  if (isNaN(lat) || isNaN(lng)) {
    throw new Error('Invalid latitude or longitude provided.');
  }

  try {
    const response = await apiClient.get('/api/v1/flights/getNearByAirports', {
      params: { lat, lng },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching nearby airports:', error);
    throw new Error('Failed to fetch nearby airports. Please try again.');
  }
};

// Function to search for airports based on a query (city or airport name)
export const searchAirports = async (query) => {
  if (!query) {
    throw new Error('Query parameter is required to search airports.');
  }

  try {
    const response = await apiClient.get('/api/v1/flights/searchAirport', {
      params: { query },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error searching airports:', error);
    throw new Error('Failed to search airports. Please try again.');
  }
};

// Function to search for flights based on origin, destination, and date
export const searchFlights = async (params = {}) => {
  const {
    originSkyId,
    destinationSkyId,
    date,
    originEntityId,
    destinationEntityId,
  } = params;

  // Validate required parameters
  if (!originSkyId || !destinationSkyId || !date || !originEntityId || !destinationEntityId) {
    throw new Error('Missing required parameters for flight search.');
  }

  const finalParams = {
    originSkyId,
    destinationSkyId,
    date,
    originEntityId,
    destinationEntityId,
  };

  try {
    const response = await apiClient.get('/api/v1/flights/searchFlights', { params: finalParams });
    // Handle API-specific status
    if (response.data.context?.status === 'failure') {
      return { status: false, data: [], message: 'No flights found.' };
    }

    return response.data;
  } catch (err) {
    console.error('API Error:', err);
    throw new Error('Failed to fetch flight data. Please check your inputs and try again.');
  }
};