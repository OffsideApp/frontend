// store/useAuthStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginResponse } from '../types/auth.types';

interface AuthState {
  user: Partial<LoginResponse> | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean; // 👈 RESTORED
  hasSeenOnboarding: boolean;
  
  // Actions
  login: (data: LoginResponse) => void;
  logout: () => void;
  completeOnboarding: () => void;
  setHydrated: () => void; // 👈 RESTORED
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isHydrated: false, // 👈 Starts false
      hasSeenOnboarding: false,

      login: (data) => set({ 
        user: data, 
        accessToken: data.accessToken, 
        refreshToken: data.refreshToken, 
        isAuthenticated: true 
      }),

      logout: () => set({ 
        user: null, 
        accessToken: null, 
        refreshToken: null, 
        isAuthenticated: false 
      }),

      completeOnboarding: () => set({ hasSeenOnboarding: true }),
      setHydrated: () => set({ isHydrated: true }), // 👈 Action to flip it
    }),
    {
      name: 'offside-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      
      // 👇 This fires when Zustand finishes loading from Phone Storage
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);