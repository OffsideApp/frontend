// services/auth.queries.ts
import { useMutation } from '@tanstack/react-query';
import { AuthService } from './auth.service';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import { ApiError } from '../../types/auth.types';

export const useAuthMutations = () => {
  const router = useRouter();
  const { login } = useAuthStore();

  // 1. REGISTER HOOK
  const registerMutation = useMutation({
    mutationFn: AuthService.register,
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Registration failed";
      Alert.alert("Error", msg);
    },
    onSuccess: (_, variables) => {
      // Navigate to Verify Email screen, passing the email
      router.push({
        pathname: "/(auth)/verify",
        params: { email: variables.email }
      });
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
      router.replace("/(auth)/login");
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
        // Save to Zustand
        login(data.data);

        // Smart Navigation based on your flow
        if (!data.data.hasUsername) {
           // If they haven't set a username yet (New Flow)
           // router.replace("/(auth)/set-profile"); // You'll build this next
           console.log("Go to Set Username");
        } else if (!data.data.hasSelectedClub) {
           router.replace("/(auth)/select-club");
        } else {
           router.replace("/(home)/feed");
        }
      }
    }
  });

  return { registerMutation, verifyMutation, loginMutation };
};