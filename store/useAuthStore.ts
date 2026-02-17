import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Define what a User looks like (keep it simple for now)
interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

// 2. Define the Auth State & Actions
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (email: string) => void; // We simulate login
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // SIMULATED LOGIN
      // Later, we will replace this with a real API call
      login: (email) => {
        const fakeUser = {
          id: 'user_123',
          username: '@OffsideKing',
          email: email,
          avatar: 'https://i.pravatar.cc/150?img=12', // Random avatar
        };
        
        set({
          user: fakeUser,
          token: 'fake-jwt-token-12345',
          isAuthenticated: true,
        });
        console.log('User logged in!', fakeUser.username);
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        console.log('User logged out.');
      },
    }),
    {
      name: 'offside-auth-storage', // Saves to phone storage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);