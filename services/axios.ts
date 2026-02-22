// services/api.ts
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

// Response Interceptor: Handle 401 (Optional: Auto-logout or Refresh logic here)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 Unauthorized, we might want to logout
    console.log("❌ BACKEND REJECTION REASON:", error.response?.data);
    if (error.response?.status === 401) {
      // For now, just log it. We will add Refresh Logic later.
      console.log('Session expired or unauthorized');
    }
    return Promise.reject(error);
  }
);