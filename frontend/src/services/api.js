import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Use setTimeout to avoid breaking the Promise chain
      // This allows the current async operation to complete before redirecting
      setTimeout(() => {
        window.location.href = '/login';
      }, 0);
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  registerAsOwner: (data) => api.post('/auth/register/owner', data),
  checkEmail: (email) => api.get(`/auth/check-email?email=${email}`),
};

// Users API
export const usersApi = {
  getCurrentUser: () => api.get('/users/me'),
  updateCurrentUser: (data) => api.put('/users/me', data),
  becomeOwner: () => api.post('/users/become-owner'),
  getAllUsers: () => api.get('/users/admin/all'),
  updateUserRole: (id, role) => api.patch(`/users/admin/${id}/role?role=${role}`),
  deleteUser: (id) => api.delete(`/users/admin/${id}`),
};

// Parking Spaces API
export const spacesApi = {
  getAvailable: (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') =>
    api.get(`/spaces/available?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`),

  search: (location, page = 0, size = 10) =>
    api.get(`/spaces/search?location=${location}&page=${page}&size=${size}`),

  filterByPrice: (minRate, maxRate, page = 0, size = 10) =>
    api.get(`/spaces/filter/price?minRate=${minRate}&maxRate=${maxRate}&page=${page}&size=${size}`),

  filterByType: (spaceType, page = 0, size = 10) =>
    api.get(`/spaces/filter/type?spaceType=${spaceType}&page=${page}&size=${size}`),

  getById: (id) => api.get(`/spaces/${id}`),

  create: (data) => api.post('/spaces', data),

  update: (id, data) => api.put(`/spaces/${id}`, data),

  updateStatus: (id, status) => api.patch(`/spaces/${id}/status?status=${status}`),

  delete: (id) => api.delete(`/spaces/${id}`),

  getMySpaces: () => api.get('/spaces/my-spaces'),

  getAllSpaces: (page = 0, size = 10) => api.get(`/spaces/admin/all?page=${page}&size=${size}`),

  getStats: () => api.get('/spaces/admin/stats'),

  getOwnerStats: () => api.get('/spaces/owner/stats'),

  // Admin approval endpoints
  getPendingApprovals: (page = 0, size = 10) => api.get(`/spaces/admin/pending?page=${page}&size=${size}`),

  approveSpace: (id, notes) =>
    api.patch(`/spaces/admin/${id}/approve${notes ? `?notes=${encodeURIComponent(notes)}` : ''}`),

  rejectSpace: (id, reason) => api.patch(`/spaces/admin/${id}/reject?reason=${encodeURIComponent(reason)}`),

  requestMoreInfo: (id, info) => api.patch(`/spaces/admin/${id}/request-info?info=${encodeURIComponent(info)}`),
};

// Bookings API
export const bookingsApi = {
  create: (data) => api.post('/bookings', data),

  getById: (id) => api.get(`/bookings/${id}`),

  getMyBookings: (page = 0, size = 10) => api.get(`/bookings/my-bookings?page=${page}&size=${size}`),

  getSpaceOwnerBookings: (page = 0, size = 10) => api.get(`/bookings/space-bookings?page=${page}&size=${size}`),

  getBookingsBySpace: (spaceId) => api.get(`/bookings/by-space/${spaceId}`),

  confirm: (id) => api.patch(`/bookings/${id}/confirm`),

  cancel: (id, reason) => api.patch(`/bookings/${id}/cancel${reason ? `?reason=${reason}` : ''}`),

  complete: (id) => api.patch(`/bookings/${id}/complete`),

  updatePaymentStatus: (id, status) => api.patch(`/bookings/${id}/payment?paymentStatus=${status}`),

  getAllBookings: (page = 0, size = 10) => api.get(`/bookings/admin/all?page=${page}&size=${size}`),

  getStats: () => api.get('/bookings/admin/stats'),

  getOwnerStats: () => api.get('/bookings/owner/stats'),
};

export default api;
