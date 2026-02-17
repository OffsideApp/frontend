// store/useAuthStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: any;
  isAuthenticated: boolean;
  isHydrated: boolean; // <--- ADD THIS
  login: (user: any) => void;
  logout: () => void;
  setHydrated: () => void; // <--- ADD THIS
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false, // Default to false
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        // This runs when the storage is fully loaded
        state?.setHydrated(); 
      },
    }
  )
);