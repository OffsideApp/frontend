// services/api.ts
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { router } from 'expo-router';

// 👇 CHANGE THIS LINE
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api/v1"; 

// Debugging: Check your terminal/logs to see which one it picked!
console.log("🔗 Connecting to:", API_URL);

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Add Token to every request
api.interceptors.request.use(
  async (config) => {
    // We access the token directly from Zustand state (outside hooks)
    const token = useAuthStore.getState().accessToken;
    console.log("🔐 Token being sent:", token ? "YES (Token exists)" : "NO (Token is null)");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 (Optional: Auto-logout or Refresh logic here)
// 2. Response Interceptor: Catch 401 Unauthorized globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the backend says the user is unauthorized (deleted, expired token, etc.)
    if (error.response && error.response.status === 401) {
      console.log('User invalid or token expired. Forcing logout...');
      // Clear the Zustand store & AsyncStorage
      useAuthStore.getState().logout(); 
      // Kick them back to the login screen
      router.replace('/(auth)/login');
    }  
    return Promise.reject(error);
  }
);