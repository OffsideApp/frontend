// hooks/useCurrentUser.ts
import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useProfileQuery } from '../services/auth/auth.queries';

export const useCurrentUser = () => {
  // 1. Grab the instant local cache
  const { user, updateUser } = useAuthStore();

  // 2. Fire the background fetch to the DB (for "me")
  const { data: profileResponse, isLoading, isFetching } = useProfileQuery();

  // 3. 🚀 THE AUTO-SYNC: Whenever fresh data arrives from the DB, save it to the phone!
  useEffect(() => {
    if (profileResponse?.data) {
      updateUser(profileResponse.data);
    }
  }, [profileResponse?.data]); // Only runs when the DB data changes

  // 4. The Hybrid Object: Merge them together so the UI has zero blank spots
  const hybridUser = {
    ...user,
    ...(profileResponse?.data || {})
  };

  return {
    user: hybridUser, // This is the smartest, freshest user object possible
    isLoading,
    isFetching
  };
};