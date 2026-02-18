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
  ActivityIndicator 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Colors } from "@/constants/theme"; 
import { useRouter } from "expo-router"; 
import { SignupFormType, signupSchema } from "@/schema/auth.schema"; // Ensure this file exists
import { useAuthMutations } from '../../services/auth/auth.queries';

export default function SignupScreen() {
  const { registerMutation } = useAuthMutations();
  const router = useRouter(); 
  const [passwordVisible, setPasswordVisible] = useState(false);

  // 1. Setup Form with Zod Validation
  const { control, handleSubmit, formState: { errors } } = useForm<SignupFormType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    }
  });

  // 2. Submit Handler
  const onSubmit = (data: SignupFormType) => {
    registerMutation.mutate(data);
  };

  const handleLoginNavigation = () => {
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          
          {/* CENTER CONTAINER (Keeps layout clean on Tablets) */}
          <View style={styles.tabletContainer}>

            {/* HEADER */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleLoginNavigation}> 
                 <ArrowLeft color="white" size={24} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Offside</Text>
              <View style={{width: 24}} />
            </View>

            {/* TITLE */}
            <View style={styles.titleSection}>
              <Text style={styles.bigTitle}>Join the Game</Text>
              <Text style={styles.subtitle}>Create your account to get started.</Text>
            </View>

            {/* FORM */}
            <View style={styles.form}>
              
              {/* --- FIRST NAME --- */}
              <Text style={styles.label}>First Name</Text>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[styles.inputContainer, errors.firstName && styles.inputError]}>
                    <TextInput 
                      style={styles.input}
                      placeholder="Jay-Jay"
                      placeholderTextColor="#555"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  </View>
                )}
              />
              {errors.firstName && <Text style={styles.errorText}>{errors.firstName.message}</Text>}

              {/* --- LAST NAME --- */}
              <Text style={styles.label}>Last Name</Text>
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[styles.inputContainer, errors.lastName && styles.inputError]}>
                    <TextInput 
                      style={styles.input}
                      placeholder="Okocha"
                      placeholderTextColor="#555"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  </View>
                )}
              />
              {errors.lastName && <Text style={styles.errorText}>{errors.lastName.message}</Text>}

              {/* --- EMAIL --- */}
              <Text style={styles.label}>Email Address</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[styles.inputContainer, errors.email && styles.inputError]}>
                    <TextInput 
                      style={styles.input}
                      placeholder="jayjay@offside.com"
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
              <Text style={styles.label}>Password</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[styles.inputContainer, errors.password && styles.inputError]}>
                    <TextInput 
                      style={styles.input}
                      placeholder="••••••••"
                      placeholderTextColor="#555"
                      secureTextEntry={!passwordVisible}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                    <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                      {passwordVisible ? 
                        <EyeOff color={Colors.primary} size={20} /> : 
                        <Eye color={Colors.primary} size={20} />
                      }
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

              {/* --- SUBMIT BUTTON --- */}
              <TouchableOpacity 
                style={[styles.createButton, registerMutation.isPending && styles.createButtonDisabled]} 
                onPress={handleSubmit(onSubmit)}
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <ActivityIndicator color="black" />
                ) : (
                  <Text style={styles.createButtonText}>Create Account</Text>
                )}
              </TouchableOpacity>

              {/* --- SOCIALS --- */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialButton}>
                  <Text style={styles.socialText}>G  Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton}>
                  <Text style={styles.socialText}>  Apple</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={handleLoginNavigation}>
                  <Text style={styles.loginLink}>Log In</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D", 
  },
  scrollContent: {
    paddingBottom: 50,
    flexGrow: 1,
  },
  tabletContainer: {
    width: '100%',
    maxWidth: 500, 
    alignSelf: 'center', 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 30, // Adjusted for SafeArea
    marginBottom: 20,
  },
  headerTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  titleSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
    alignItems: "center",
  },
  bigTitle: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "#A1A1A1", 
    fontSize: 16,
    textAlign: "center",
  },
  form: {
    paddingHorizontal: 20,
  },
  label: {
    color: "#A1A1A1",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 10,
    textTransform: "uppercase",
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
    borderColor: "#EF4444", // Red border on error
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
    height: "100%",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  createButton: {
    backgroundColor: Colors.primary, 
    borderRadius: 30,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 30,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  createButtonDisabled: {
    opacity: 0.7, // Dim button when loading
  },
  createButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 18,
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
  socialRow: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 40,
  },
  socialButton: {
    flex: 1,
    backgroundColor: "#1F1F1F",
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    flexDirection: "row",
  },
  socialText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  footerText: {
    color: "#777",
    fontSize: 14,
  },
  loginLink: {
    color: Colors.primary, 
    fontWeight: "bold",
    fontSize: 14,
  },
});