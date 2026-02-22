// hooks/useProtectedRoute.ts
import { useEffect } from 'react';
import { useRouter, useSegments, useRootNavigationState, usePathname } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';

export function useProtectedRoute() {
  const segments = useSegments();
  const pathname = usePathname(); 
  const router = useRouter();
  const navigationState = useRootNavigationState();
  
  const { isAuthenticated, isHydrated, user, hasSeenOnboarding } = useAuthStore();

  useEffect(() => {
    // 1. Wait for navigation and storage to be ready
    if (!navigationState?.key || !isHydrated) return;

    // 2. Ignore Splash Screen
    if (pathname === '/') return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';

    // 3. 🛑 NOT LOGGED IN LOGIC
    if (!isAuthenticated) {
      if (!hasSeenOnboarding && !inOnboarding) {
        router.replace('/onboarding');
      } else if (hasSeenOnboarding && !inAuthGroup) {
        router.replace('/(auth)/login');
      }
      return; // Stop running here
    }

    // 4. ✅ LOGGED IN LOGIC
    if (isAuthenticated && user) {
      const isMissingProfile = !user.hasUsername || !user.hasSelectedClub;
      const isOnSelectClubScreen = segments[1] === 'select-club';

      // A. If they are incomplete
      if (isMissingProfile) {
        if (!isOnSelectClubScreen) {
          // Send them to setup if they aren't already there
          router.replace('/(auth)/select-club');
        }
        // 🚨 CRITICAL FIX: Always return here so they stay trapped on the setup screen!
        return; 
      }

      // B. If they are completely setup, but trying to sneak back to Auth/Onboarding
      if (inAuthGroup || inOnboarding) {
        router.replace('/(home)/feed');
      }
    }
  }, [isAuthenticated, isHydrated, segments, pathname, navigationState?.key, user, hasSeenOnboarding]);
}