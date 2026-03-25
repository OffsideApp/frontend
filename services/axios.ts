// services/axios.ts
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

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

// Response Interceptor: Handle 401 (Auto-logout)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the backend says the user is unauthorized (deleted, expired token, etc.)
    if (error.response && error.response.status === 401) {
      console.log('User invalid or token expired. Forcing logout...');
      
      // 🚀 THE MAGIC: Clearing the state instantly tells App.tsx to route to the Login screen!
      useAuthStore.getState().logout(); 
    }  
    return Promise.reject(error);
  }
);