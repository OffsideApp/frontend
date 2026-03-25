// App.tsx
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons"; // Or your preferred icon set
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActivityIndicator, View } from "react-native";
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
import ForgotPasswordScreen from "./screens/ForgotPasswordScreenn"
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import SelectClubScreen from "./screens/SelectClubScreen";
import SetProfileScreen from "./screens/SelectProfileScreen";
import VerifyScreen from "./screens/VerifyScreen";
import MatchdayScreen from "./screens/MatchDayScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- BOTTOM TABS FOR MAIN APP ---
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#007BFF", // Replace with your primary color
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, focused }) => {
          let iconName: any;
          if (route.name === "Feed") iconName = focused ? "home" : "home-outline";
          else if (route.name === "Matchday") iconName = focused ? "football" : "football-outline";
          else if (route.name === "Profile") iconName = focused ? "person" : "person-outline";
          
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // USER IS LOGGED IN -> Show Main App Flow
          <>
            {/* Example of condition: If user hasn't selected a club yet */}
            {!user?.hasSelectedClub ? (
               <Stack.Screen name="SelectClub" component={SelectClubScreen} />
            ) : !user?.hasUsername ? (
               <Stack.Screen name="SetProfile" component={SetProfileScreen} />
            ) : (
               // Fully setup user goes to Main Tabs
               <Stack.Screen name="Main" component={HomeTabs} />
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
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
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
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContent />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}