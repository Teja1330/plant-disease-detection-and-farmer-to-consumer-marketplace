import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// In your api.js - Add more debugging
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`🔐 Making ${config.method?.toUpperCase()} request to:`, config.url);
      console.log('🔑 Token present:', !!token);
    } else {
      console.warn('⚠️ No auth token found for request:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      console.log('🔑 Token removed due to auth error');
    }
    
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