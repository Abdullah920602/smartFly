import axios from 'axios';

// Base URL for the backend API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Flight Services
export const flightService = {
  // Get all flights with optional filters
  getFlights: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/flights?${params}`);
    return response.data;
  },

  // Get flight by ID
  getFlightById: async (flightId) => {
    const response = await api.get(`/flights/${flightId}`);
    return response.data;
  },

  // Add new flight (for airlines only)
  addFlight: async (flightData) => {
    const response = await api.post('/flights', flightData);
    return response.data;
  },

  // Update flight (for airlines only)
  updateFlight: async (flightId, flightData) => {
    const response = await api.put(`/flights/${flightId}`, flightData);
    return response.data;
  },

  // Delete flight (for airlines only)
  deleteFlight: async (flightId) => {
    const response = await api.delete(`/flights/${flightId}`);
    return response.data;
  }
};

// Airline Services
export const airlineService = {
  // Get all airlines
  getAirlines: async () => {
    const response = await api.get('/airlines');
    return response.data;
  },

  // Get airline by ID
  getAirlineById: async (airlineId) => {
    const response = await api.get(`/airlines/${airlineId}`);
    return response.data;
  }
};

// Booking Services
export const bookingService = {
  // Create new booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get user bookings
  getUserBookings: async () => {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (bookingId) => {
    const response = await api.put(`/bookings/${bookingId}/cancel`);
    return response.data;
  }
};

// Authentication Services
export const authService = {
  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Register airline
  registerAirline: async (airlineData) => {
    const response = await api.post('/auth/airline-register', airlineData);
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await api.put('/auth/update-profile', userData);
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Chatbot Services
export const chatbotService = {
  // Send message to chatbot
  sendMessage: async (message) => {
    const response = await api.post('/chatbot/send', { message });
    return response.data;
  },

  // Get chatbot suggestions
  getRecommendations: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/chatbot/recommendations?${params}`);
    return response.data;
  },

  // Get best deals
  getBestDeals: async () => {
    const response = await api.get('/chatbot/best-deals');
    return response.data;
  },

  // Get popular routes
  getPopularRoutes: async () => {
    const response = await api.get('/chatbot/popular-routes');
    return response.data;
  }
};

export default api;
