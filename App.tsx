// App.tsx
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons"; 
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActivityIndicator, View, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import your Zustand store (adjust path if necessary)
import { useAuthStore } from "./store/useAuthStore";

// Import your new Screens
import OnboardingScreen from "./screens/OnboardingScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import FeedScreen from "./screens/FeedScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreenn";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import SelectClubScreen from "./screens/SelectClubScreen";
import SetProfileScreen from "./screens/SelectProfileScreen";
import VerifyScreen from "./screens/VerifyScreen";
import MatchdayScreen from "./screens/MatchDayScreen";
import CreatePostScreen from "./screens/CreatePostScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- CUSTOM DARK THEME ---
const AppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0D0D0D', // Kills the white flash on modal transitions
    card: '#0D0D0D',       // Kills the white gap under the bottom tabs
  },
};

// --- BOTTOM TABS FOR MAIN APP ---
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#CCFF00", // Neon Green Active State
        tabBarInactiveTintColor: "#555555", // Muted Gray Inactive State
        tabBarStyle: {
          backgroundColor: '#0D0D0D', 
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.05)', 
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8, 
          height: Platform.OS === 'ios' ? 88 : 68,
          elevation: 0, 
          shadowOpacity: 0, 
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: -4,
        },
        tabBarIcon: ({ color, focused }) => {
          let iconName: any;
          if (route.name === "Feed")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "Matchday")
            iconName = focused ? "football" : "football-outline";
          else if (route.name === "Profile")
            iconName = focused ? "person" : "person-outline";

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Matchday" component={MatchdayScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// --- ROOT NAVIGATION LOGIC ---
function NavigationContent() {
  // Pull authentication state directly from Zustand
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("alreadyLaunched").then((value) => {
      if (value == null) {
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  if (isFirstLaunch === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#0D0D0D' }}>
        <ActivityIndicator size="large" color="#CCFF00" />
      </View>
    );
  }

  return (
    // Pass the custom Dark Theme here
    <NavigationContainer theme={AppTheme}>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0D0D0D' } }}>
        {isAuthenticated ? (
          // USER IS LOGGED IN -> Show Main App Flow
          <>
            {!user?.hasSelectedClub ? (
              <Stack.Screen name="SelectClub" component={SelectClubScreen} />
            ) : !user?.hasUsername ? (
              <Stack.Screen name="SetProfile" component={SetProfileScreen} />
            ) : (
              // Fully setup user goes to Main Tabs
              <>
                <Stack.Screen name="Main" component={HomeTabs} />
                <Stack.Screen
                  name="CreatePost"
                  component={CreatePostScreen}
                  options={{ presentation: "modal" }} // Makes it slide up!
                />
              </>
            )}
          </>
        ) : (
          // USER IS NOT LOGGED IN -> Show Auth Flow
          <>
            {isFirstLaunch && (
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            )}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Verify" component={VerifyScreen} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPasswordScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const queryClient = new QueryClient();

// --- APP ENTRY POINT ---
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#0D0D0D' }}>
          <NavigationContent />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}