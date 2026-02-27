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
      const isOnSelectClub = segments[1] === 'select-club';
      const isOnSetProfile = segments[1] === 'set-profile';

      // STEP 1: If they haven't picked a club, lock them on select-club
      if (!user.hasSelectedClub) {
        if (!isOnSelectClub) {
          router.replace('/(auth)/select-club');
        }
        return; // 🛑 Stop here until they pick a club
      }

      // STEP 2: If they have a club but NO username, 
      if (!user.hasUsername) {
        if (!isOnSetProfile && !isOnSelectClub) {
          router.replace('/(auth)/set-profile');
        }
        return; // 🛑 Stop here until they set a username
      }

      // STEP 3: Fully setup! If they try to go back to Login/Signup, push them to Feed
      if (inAuthGroup || inOnboarding) {
        router.replace('/(home)/feed');
      }
    }
  }, [isAuthenticated, isHydrated, segments, pathname, navigationState?.key, user, hasSeenOnboarding]);
}
