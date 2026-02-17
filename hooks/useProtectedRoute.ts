// hooks/useProtectedRoute.ts
import { useEffect } from 'react';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';

export function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  
  const { isAuthenticated, isHydrated } = useAuthStore();

  useEffect(() => {
    // 1. If navigation isn't ready, do nothing.
    // The "key" property is only present when the RootNavigator is mounted.
    if (!navigationState?.key) return;

    // 2. If the store is still loading from disk, do nothing.
    // This prevents the "Flash of Login" and premature redirects.
    if (!isHydrated) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login only if we are SURE they are not authenticated
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home if they are logged in and trying to login
      router.replace('/(home)/feed');
    }
  }, [isAuthenticated, isHydrated, segments, navigationState?.key]);
}