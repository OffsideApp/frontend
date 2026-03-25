// services/auth.queries.ts
import { useMutation } from '@tanstack/react-query';
import { AuthService } from './auth.service';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // 👈 Swapped Expo Router for React Navigation
import { useAuthStore } from '../../store/useAuthStore';
import { ApiError } from '../../types/auth.types';

export const useAuthMutations = () => {
  const navigation = useNavigation<any>(); // 👈 Hooked up React Navigation
  const { login, updateUser } = useAuthStore();

  // 1. REGISTER HOOK
  const registerMutation = useMutation({
    mutationFn: AuthService.register,
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Registration failed";
      Alert.alert("Error", msg);
    },
    onSuccess: (_, variables) => {
      // Navigate to Verify Email screen, passing the email as a param
      navigation.navigate("Verify", { email: variables.email });
    }
  });

  // 2. VERIFY HOOK
  const verifyMutation = useMutation({
    mutationFn: AuthService.verifyEmail,
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Verification failed";
      Alert.alert("Error", msg);
    },
    onSuccess: () => {
      Alert.alert("Success", "Email verified! Please login.");
      navigation.navigate("Login"); // 👈 Changed to standard route name
    }
  });

  // 3. LOGIN HOOK
  const loginMutation = useMutation({
    mutationFn: AuthService.login,
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Login failed";
      Alert.alert("Error", msg);
    },
    onSuccess: (data) => {
      if (data.data) {
        // 🚀 THE MAGIC: Saving to Zustand flips `isAuthenticated` to true.
        // App.tsx will automatically unmount the Auth screens and mount 
        // SetProfile, SelectClub, or Main Tabs based on the user's data!
        // No manual navigation needed here!
        login(data.data);
      }
    }
  });

  // 4. SELECT CLUB HOOK
  const selectClubMutation = useMutation({
    mutationFn: AuthService.selectClub,
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to save club";
      Alert.alert("Error", msg);
    },
    onSuccess: () => {
      // 🚀 THE MAGIC: Tell Zustand the club is saved. 
      // App.tsx automatically pushes them to the next relevant screen!
      updateUser({ hasSelectedClub: true });
    }
  });

  // 5. SET PROFILE HOOK
  const setProfileMutation = useMutation({
    mutationFn: AuthService.setProfile,
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to set profile";
      Alert.alert("Error", msg);
    },
    onSuccess: () => {
      // 🚀 THE MAGIC: Tell Zustand the user now has a username.
      // App.tsx automatically pushes them to the next relevant screen!
      if (updateUser) {
         updateUser({ hasUsername: true });
      }
    }
  });

  return { registerMutation, verifyMutation, loginMutation, selectClubMutation, setProfileMutation };
};