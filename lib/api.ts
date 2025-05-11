import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://api.the-odds-api.com/v4',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (!config.params) {
    config.params = {};
  }
  
  const apiKey = process.env.NEXT_PUBLIC_BET_APP_API_KEY;
  
  if (!apiKey) {
    console.error('Warning: API key is missing! Set NEXT_PUBLIC_BET_APP_API_KEY environment variable.');
  }
  
  config.params.api_key = apiKey;
  
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('Remaining requests:', response.headers['x-requests-remaining']);
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error('API Error: Authentication failed. Check your API key.');
    } else {
      console.error('API Error:', error.response?.status, error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);
