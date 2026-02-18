import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator, // <--- For the loading spinner
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";

// 1. Import Hook Form & Zod
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormType, loginSchema } from "@/schema/auth.schema";
import { useAuthMutations } from "@/services/auth/auth.queries";

export default function LoginScreen() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  // 3. Get the Login API Mutation
  const { loginMutation } = useAuthMutations();

  // 4. Setup Form
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const handleSignupNavigation = () => {
    router.replace("/(auth)/signup");
  };

  // 5. The Submit Function
  const onSubmit = (data: LoginFormType) => {
    // This calls the API. The success logic (store update & navigation) 
    // is handled inside 'services/auth.queries.ts'
    loginMutation.mutate(data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          
          {/* CENTER CONTAINER FOR TABLETS */}
          <View style={styles.tabletContainer}>

            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()}>
                <ArrowLeft color={Colors.primary} size={28} />
              </TouchableOpacity>
            </View>

            {/* Hero Section */}
            <View style={styles.heroSection}>
              <Text style={styles.brandText}>OFFSIDE</Text>
              <Text style={styles.tagline}>GET IN{"\n"}THE GAME</Text>
            </View>

            {/* Toggle Switch */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity style={[styles.toggleButton, styles.activeToggle]}>
                <Text style={[styles.toggleText, styles.activeToggleText]}>
                  Login
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.toggleButton}
                onPress={handleSignupNavigation}
              >
                <Text style={styles.toggleText}>Signup</Text>
              </TouchableOpacity>
            </View>

            {/* Login Form */}
            <View style={styles.form}>
              
              {/* --- EMAIL --- */}
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[styles.inputContainer, errors.email && styles.inputError]}>
                    <Mail color="#555" size={20} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="pitch@offside.com"
                      placeholderTextColor="#555"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  </View>
                )}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

              {/* --- PASSWORD --- */}
              <Text style={styles.label}>PASSWORD</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[styles.inputContainer, errors.password && styles.inputError]}>
                    <Lock color="#555" size={20} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="••••••••"
                      placeholderTextColor="#555"
                      secureTextEntry={!passwordVisible}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                    <TouchableOpacity
                      onPress={() => setPasswordVisible(!passwordVisible)}
                    >
                      {passwordVisible ? (
                        <EyeOff color="#555" size={20} />
                      ) : (
                        <Eye color="#555" size={20} />
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

              <TouchableOpacity style={styles.forgotPassword} onPress={() => router.push('/(auth)/forgot-password')}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* --- SUBMIT BUTTON --- */}
              <TouchableOpacity
                style={[styles.kickOffButton, loginMutation.isPending && styles.kickOffButtonDisabled]}
                onPress={handleSubmit(onSubmit)}
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                   <ActivityIndicator color="black" />
                ) : (
                  <>
                    <FontAwesome5 name="futbol" size={24} color={Colors.background} />
                    <Text style={styles.kickOffText}>KICK OFF</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialText}>G Google</Text>
              </TouchableOpacity>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>New to the league? </Text>
                <TouchableOpacity onPress={handleSignupNavigation}>
                  <Text style={styles.createAccountText}>Create an account</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D0D" },
  scrollContent: { paddingTop: 50, paddingBottom: 50 },
  tabletContainer: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  heroSection: { alignItems: "center", marginTop: 20, marginBottom: 30 },
  brandText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 5,
  },
  tagline: {
    color: "white",
    fontSize: 42,
    fontWeight: "900",
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 42,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#1F1F1F",
    marginHorizontal: 20,
    borderRadius: 30,
    padding: 4,
    marginBottom: 30,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 25,
  },
  activeToggle: { backgroundColor: Colors.primary },
  toggleText: { color: "#777", fontWeight: "bold", fontSize: 16 },
  activeToggleText: { color: "black" },
  form: { paddingHorizontal: 20 },
  label: {
    color: "#777",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 10,
    letterSpacing: 1,
  },
  inputContainer: {
    backgroundColor: "#1F1F1F",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: "white", fontSize: 16, height: "100%" },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  forgotPassword: { alignSelf: "flex-end", marginTop: 10, marginBottom: 20 },
  forgotPasswordText: { color: "#A1A1A1", fontSize: 14 },
  kickOffButton: {
    backgroundColor: Colors.primary,
    borderRadius: 30,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    flexDirection: "row",
    gap: 10,
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 30,
  },
  kickOffButtonDisabled: {
    opacity: 0.7,
  },
  kickOffText: {
    color: "black",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  footer: { flexDirection: "row", justifyContent: "center", paddingTop: 30, paddingBottom: 50 },
  footerText: { color: "#777", fontSize: 14 },
  createAccountText: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#333",
  },
  dividerText: {
    color: "#555",
    marginHorizontal: 10,
    fontSize: 14,
  },
  socialButton: {
    flex: 1,
    backgroundColor: "white",
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    flexDirection: "row",
  },
  socialText: {
    color: Colors.background,
    fontWeight: "600",
    fontSize: 16,
  },
});