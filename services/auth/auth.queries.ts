// services/auth.queries.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'; // 👈 Added useQueryClient
import { AuthService } from './auth.service';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/useAuthStore';
import { ApiError } from '../../types/auth.types';

export const useAuthMutations = () => {
  const navigation = useNavigation<any>(); 
  const { login, updateUser } = useAuthStore();
  const queryClient = useQueryClient(); // 👈 Needed to instantly refresh data after an upload/follow

  // 1. REGISTER HOOK
  const registerMutation = useMutation({
    mutationFn: AuthService.register,
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Registration failed";
      Alert.alert("Error", msg);
    },
    onSuccess: (_, variables) => {
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
      navigation.navigate("Login"); 
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
      if (updateUser) {
         updateUser({ hasUsername: true });
      }
    }
  });

  // ==========================================
  // 🚀 NEW: PROFILE, AVATAR, & FOLLOW HOOKS
  // ==========================================

  // 6. FETCH PROFILE HOOK (Query instead of Mutation)
  const UseprofileQuery = (username?: string) => useQuery({
    queryKey: ['profile', username || 'me'], // Unique cache key
    queryFn: () => AuthService.getProfile(username),
  });

  // 7. UPLOAD AVATAR HOOK
  const uploadAvatarMutation = useMutation({
    mutationFn: (formData: FormData) => AuthService.uploadAvatar(formData),
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to upload avatar";
      Alert.alert("Upload Error", msg);
    },
    onSuccess: () => {
      // 🚀 Instantly clear the cache so the ProfileScreen fetches the new image!
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });

  // 8. TOGGLE FOLLOW HOOK
  const followMutation = useMutation({
    mutationFn: (targetUserId: string) => AuthService.toggleFollow(targetUserId),
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to follow user";
      Alert.alert("Error", msg);
    },
    onSuccess: () => {
      // 🚀 Instantly refresh the profile so the follower count updates!
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  // 🚀 Ensure everything is exported here!
  return { 
    registerMutation, 
    verifyMutation, 
    loginMutation, 
    selectClubMutation, 
    setProfileMutation,
    UseprofileQuery,
    uploadAvatarMutation,
    followMutation
  };
};

export const useProfileQuery = (username?: string) => {
  return useQuery({
    queryKey: ['profile', username || 'me'], 
    queryFn: () => AuthService.getProfile(username),
  });
};