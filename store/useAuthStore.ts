import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: any;
  isAuthenticated: boolean;
  isHydrated: boolean;
  hasSeenOnboarding: boolean; // <--- 1. NEW FLAG
  login: (user: any) => void;
  logout: () => void;
  setHydrated: () => void;
  completeOnboarding: () => void; // <--- 2. NEW ACTION
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      hasSeenOnboarding: false, // Default is false

      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setHydrated: () => set({ isHydrated: true }),
      completeOnboarding: () => set({ hasSeenOnboarding: true }), // Mark as seen
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);