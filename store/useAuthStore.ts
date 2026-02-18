import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: any;
  isAuthenticated: boolean;
  isHydrated: boolean;
  hasSeenOnboarding: boolean; 
  login: (user: any) => void;
  logout: () => void;
  setHydrated: () => void;
  completeOnboarding: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      hasSeenOnboarding: false, 

      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setHydrated: () => set({ isHydrated: true }),
      completeOnboarding: () => set({ hasSeenOnboarding: true }), 
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