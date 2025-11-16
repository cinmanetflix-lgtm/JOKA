import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
};

// Services API
export const servicesAPI = {
  getAll: () => api.get('/services'),
  getById: (id: string) => api.get(`/services/${id}`),
  search: (params: any) => api.get('/services/search', { params }),
};

// Bookings API
export const bookingsAPI = {
  create: (data: any) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getById: (id: string) => api.get(`/bookings/${id}`),
  confirm: (id: string) => api.patch(`/bookings/${id}/confirm`),
  cancel: (id: string, reason?: string) =>
    api.patch(`/bookings/${id}/cancel`, { reason }),
};

// Payments API
export const paymentsAPI = {
  create: (data: any) => api.post('/payments', data),
  processStripe: (id: string) => api.post(`/payments/${id}/stripe`),
  processMobileMoney: (id: string) => api.post(`/payments/${id}/mobile-money`),
  confirm: (id: string) => api.patch(`/payments/${id}/confirm`),
};

// Parcours API
export const parcoursAPI = {
  create: (data: any) => api.post('/parcours', data),
  getAll: () => api.get('/parcours'),
  getMyParcours: () => api.get('/parcours/my-parcours'),
  getById: (id: string) => api.get(`/parcours/${id}`),
};

export default api;
