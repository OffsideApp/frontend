// services/axios.ts
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const API_URL = "https://backend-production-0515.up.railway.app/api/v1"; 

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Connection': 'close',
  },
  
});

// Request Interceptor: Add Token to every request
api.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// We need a variable to prevent multiple simultaneous refresh requests
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Handle 401 and attempt Refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't already tried to refresh this specific request
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // If the request that failed WAS the refresh route itself, don't loop! Just logout.
      if (originalRequest.url.includes('/auth/refresh-token')) {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      originalRequest._retry = true; // Mark this request so we don't loop infinitely
      
      const refreshToken = useAuthStore.getState().refreshToken;

      // If we don't even have a refresh token, we can't save them. Force logout.
      if (!refreshToken) {
         useAuthStore.getState().logout();
         return Promise.reject(error);
      }

      if (isRefreshing) {
        // If another request is already refreshing the token, add this request to a queue
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      isRefreshing = true;

      try {
        console.log('🔄 Attempting to refresh token...');
        
        // 1. Ask the backend for a new access token using the refresh token
        // Notice we use a fresh axios instance here (axios.post) so it doesn't trigger our interceptors!
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken: refreshToken
        });

        // Assuming your backend returns { success: true, data: { accessToken: "...", refreshToken: "..." } }
        const newTokens = response.data.data;

        // 2. Save the new tokens to Zustand
       useAuthStore.setState({
           accessToken: newTokens.accessToken,
           refreshToken: newTokens.refreshToken || refreshToken 
        });
        
        // 3. Process any queued requests that were waiting for this new token
        processQueue(null, newTokens.accessToken);

        // 4. Retry the original request that failed with the new token
        originalRequest.headers['Authorization'] = `Bearer ${newTokens.accessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        console.log('❌ Refresh token failed or expired. Forcing logout.');
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }  

    // For any other error (400, 404, 500, etc.), just reject it normally
    return Promise.reject(error);
  }
);