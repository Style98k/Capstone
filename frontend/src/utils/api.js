import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

// Request interceptor - adds auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('quickgig_user');
      // Only redirect if not already on login/register page
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access denied');
    }
    
    // Handle 500 Server Error
    if (error.response?.status >= 500) {
      console.error('Server error occurred');
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error - please check your connection');
    }
    
    return Promise.reject(error);
  }
);

// ============================================
// AUTH API
// ============================================
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },
  
  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  
  updateProfile: async (userId, data) => {
    const response = await api.put(`/users/${userId}`, data);
    return response.data;
  },
  
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  }
};

// ============================================
// GIGS API
// ============================================
export const gigsAPI = {
  getAll: async () => {
    const response = await api.get('/gigs');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/gigs/${id}`);
    return response.data;
  },
  
  create: async (gigData) => {
    const response = await api.post('/gigs', gigData);
    return response.data;
  },
  
  update: async (id, gigData) => {
    const response = await api.put(`/gigs/${id}`, gigData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/gigs/${id}`);
    return response.data;
  },
  
  getByClient: async (clientId) => {
    const response = await api.get(`/gigs/client/${clientId}`);
    return response.data;
  }
};

// ============================================
// APPLICATIONS API
// ============================================
export const applicationsAPI = {
  getAll: async () => {
    const response = await api.get('/applications');
    return response.data;
  },
  
  getByGig: async (gigId) => {
    const response = await api.get(`/applications/gig/${gigId}`);
    return response.data;
  },
  
  getByStudent: async (studentId) => {
    const response = await api.get(`/applications/student/${studentId}`);
    return response.data;
  },
  
  create: async (applicationData) => {
    const response = await api.post('/applications', applicationData);
    return response.data;
  },
  
  updateStatus: async (id, status) => {
    const response = await api.put(`/applications/${id}`, { status });
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  }
};

// ============================================
// TRANSACTIONS API
// ============================================
export const transactionsAPI = {
  getAll: async () => {
    const response = await api.get('/transactions');
    return response.data;
  },
  
  getByUser: async (userId) => {
    const response = await api.get(`/transactions/user/${userId}`);
    return response.data;
  },
  
  getByGig: async (gigId) => {
    const response = await api.get(`/transactions/gig/${gigId}`);
    return response.data;
  },
  
  create: async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  }
};

// ============================================
// MESSAGES API
// ============================================
export const messagesAPI = {
  send: async (messageData) => {
    const response = await api.post('/messages/send', messageData);
    return response.data;
  },
  
  getConversation: async (user1Id, user2Id) => {
    const response = await api.get(`/messages/conversation/${user1Id}/${user2Id}`);
    return response.data;
  },
  
  getByGig: async (gigId) => {
    const response = await api.get(`/messages/gig/${gigId}`);
    return response.data;
  }
};

// ============================================
// CONVERSATIONS API
// ============================================
export const conversationsAPI = {
  getByUser: async (userId) => {
    const response = await api.get(`/conversations/user/${userId}`);
    return response.data;
  },
  
  create: async (conversationData) => {
    const response = await api.post('/conversations', conversationData);
    return response.data;
  },
  
  updateLastMessage: async (id, lastMessage) => {
    const response = await api.put(`/conversations/${id}`, { last_message: lastMessage });
    return response.data;
  }
};

// ============================================
// NOTIFICATIONS API
// ============================================
export const notificationsAPI = {
  getByUser: async (userId) => {
    const response = await api.get(`/notifications/user/${userId}`);
    return response.data;
  },
  
  create: async (notificationData) => {
    const response = await api.post('/notifications', notificationData);
    return response.data;
  },
  
  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  }
};

// ============================================
// RATINGS API
// ============================================
export const ratingsAPI = {
  getAll: async () => {
    const response = await api.get('/ratings');
    return response.data;
  },
  
  getByUser: async (userId) => {
    const response = await api.get(`/ratings/user/${userId}`);
    return response.data;
  },
  
  create: async (ratingData) => {
    const response = await api.post('/ratings', ratingData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/ratings/${id}`);
    return response.data;
  }
};

// Default export for direct axios access if needed
export default api;
