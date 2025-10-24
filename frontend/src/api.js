import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Add token from localStorage to all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url);
    console.log('Auth header:', config.headers.Authorization ? 'Set' : 'Not set');
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// api.js - Update the response interceptor
API.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    // Only remove token for 401 (Unauthorized), not for 403 (Forbidden)
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      console.log('Token removed due to auth error');
    }
    // For 403 (Forbidden), don't logout - just show error
    // This could be due to role restrictions, not auth issues
    
    return Promise.reject(error);
  }
);

export default API;

// api.js - Update plantDetectionAPI
export const plantDetectionAPI = {
  detect: (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return API.post('/plant/detect/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getHistory: () => {
    return API.get('/plant/history/');
  },

  deleteHistory: (detectionId = null) => {
    if (detectionId) {
      return API.delete(`/plant/history/${detectionId}/`);
    } else {
      return API.delete('/plant/history/');
    }
  }
};