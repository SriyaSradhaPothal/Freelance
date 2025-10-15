import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', { profile: profileData }),
};

// Project API
export const projectAPI = {
  getAll: (filters = {}) => api.get('/projects', { params: filters }),
  getById: (id) => api.get(`/projects/${id}`),
  create: (projectData) => api.post('/projects', projectData),
  update: (id, projectData) => api.put(`/projects/${id}`, projectData),
  delete: (id) => api.delete(`/projects/${id}`),
  getUserProjects: (userId) => api.get(`/projects/user/${userId}`),
};

// Bid API
export const bidAPI = {
  getByProject: (projectId) => api.get(`/bids/project/${projectId}`),
  getByFreelancer: (freelancerId) => api.get(`/bids/freelancer/${freelancerId}`),
  create: (bidData) => api.post('/bids', bidData),
  accept: (id) => api.put(`/bids/${id}/accept`),
  reject: (id) => api.put(`/bids/${id}/reject`),
};

// Message API
export const messageAPI = {
  getByProject: (projectId) => api.get(`/messages/project/${projectId}`),
  send: (messageData) => api.post('/messages', messageData),
  markAsRead: (id) => api.put(`/messages/${id}/read`),
};

// Contract API
export const contractAPI = {
  getUserContracts: (userId) => api.get(`/contracts/user/${userId}`),
  getById: (id) => api.get(`/contracts/${id}`),
  updateMilestone: (contractId, milestoneId, status) => 
    api.put(`/contracts/${contractId}/milestone/${milestoneId}`, { status }),
  complete: (id) => api.put(`/contracts/${id}/complete`),
};

// Payment API
export const paymentAPI = {
  createPaymentIntent: (contractId, amount) => 
    api.post('/payments/create-payment-intent', { contractId, amount }),
  confirmPayment: (contractId, milestoneId, amount) => 
    api.post('/payments/confirm-payment', { contractId, milestoneId, amount }),
};

export default api;



