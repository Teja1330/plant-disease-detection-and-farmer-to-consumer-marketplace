import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    // Skip token check for login and register endpoints
    if (config.url === '/login' || config.url === '/register') {
      console.log(`🔓 Making ${config.method?.toUpperCase()} request to:`, config.url);
      return config;
    }
    
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`🔐 Making ${config.method?.toUpperCase()} request to:`, config.url);
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

// Response interceptor
API.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    
    // If this is a login response, store the token
    if (response.config.url === '/login' && response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      console.log('🔑 Token stored from login response');
    }
    
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
      localStorage.removeItem('current_role');
      localStorage.removeItem('user_data');
      console.log('🔑 Token removed due to auth error');
    }
    
    return Promise.reject(error);
  }
);

export default API;

// Plant Detection API
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

// Farmer API
export const farmerAPI = {
  // Dashboard
  getDashboard: () => {
    return API.get('/farmer/dashboard/');
  },

  // Products
  getProducts: () => {
    return API.get('/farmer/products/');
  },

  createProduct: (formData) => {
    return API.post('/farmer/products/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  },

  deleteProduct: (productId) => {
    return API.delete(`/farmer/products/${productId}/`);
  },

  // Orders
  getOrders: () => {
    return API.get('/farmer/orders/');
  },

  updateOrderStatus: (orderId, status) => {
    return API.patch(`/farmer/orders/${orderId}/`, { status });
  }
};

// Customer API
export const customerAPI = {
  // Marketplace
  getMarketplaceProducts: () => {
    return API.get('/customer/marketplace/');
  },

  // Orders
  getOrders: () => {
    return API.get('/customer/orders/history/');
  },

  createOrder: (orderData) => {
    return API.post('/customer/orders/', orderData);
  },

  // Cart
  getCart: () => {
    return API.get('/customer/cart/');
  },

  addToCart: (productId, quantity = 1) => {
    return API.post('/customer/cart/', { product_id: productId, quantity });
  },

  removeFromCart: (itemId) => {
    return API.delete(`/customer/cart/${itemId}/`);
  },

  clearCart: () => {
    return API.delete('/customer/cart/');
  }
};

export const authAPI = {
  logout: () => {
    return API.post('/logout');
  },
  
  switchAccount: (role) => {
    return API.post('/switch-account/', { role });
  },
  
  getCurrentUser: () => {
    return API.get('/user');
  }
};


export const addressAPI = {
  getCurrentAddress: async () => {
    const response = await API.get('/user');
    return response;
  },

  updateAddress: async (addressData) => {
    const response = await API.patch('/update-address/', addressData);
    return response;
  },

  getAvailableDistricts: async () => {
    const response = await API.get('/available-districts/');
    return response;
  }
};

export const enhancedAuthAPI = {
  ...authAPI,
  ...addressAPI
};