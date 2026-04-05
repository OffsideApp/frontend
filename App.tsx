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

// Import your Zustand store
import { useAuthStore } from "./store/useAuthStore";

// Import your Screens
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
import CreatePostScreen from "./screens/CreatePostScreen";
import PostDetailScreen from "./screens/PostDetailScreen";
import CreateCommentScreen from "./screens/CreateCommentScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import MatchLobbyScreen from "./screens/MatchLobbyScreen";
import MatchDayScreen from "./screens/MatchDayScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const MatchStack = createNativeStackNavigator();

// 🚀 1. THE NESTED MATCH STACK
export function MatchStackScreen() {
  return (
    <MatchStack.Navigator screenOptions={{ headerShown: false }}>
      {/* The Lobby is the FIRST thing they see when they click the tab */}
      <MatchStack.Screen name="MatchLobby" component={MatchLobbyScreen} />
      
      {/* The Chat Trench is the second thing they see */}
      <MatchStack.Screen name="MatchDay" component={MatchDayScreen} />
    </MatchStack.Navigator>
  );
}

// --- CUSTOM DARK THEME ---
const AppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#0D0D0D", 
    card: "#0D0D0D", 
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
          backgroundColor: "#0D0D0D",
          borderTopWidth: 1,
          borderTopColor: "rgba(255,255,255,0.05)",
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 28 : 8,
          height: Platform.OS === "ios" ? 88 : 68,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
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
      
      {/* 🚀 2. PLUG THE STACK INTO THE TAB HERE */}
      <Tab.Screen name="Matchday" component={MatchStackScreen} />
      
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// --- ROOT NAVIGATION LOGIC ---
function NavigationContent() {
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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0D0D0D",
        }}
      >
        <ActivityIndicator size="large" color="#CCFF00" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={AppTheme}>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0D0D0D" },
        }}
      >
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
                  options={{ presentation: "modal" }} 
                />
                <Stack.Screen name="PostDetail" component={PostDetailScreen} />
                <Stack.Screen
                  name="CreateComment"
                  component={CreateCommentScreen} 
                  options={{ presentation: "modal" }}
                />
                <Stack.Screen
                  name="UserProfile"
                  component={UserProfileScreen} 
                />
                {/* 🚀 3. Removed MatchLobby from here since it's now safely inside MatchStackScreen! */}
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
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#0D0D0D" }}>
          <NavigationContent />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}