import React, { useState,  } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import { Colors } from "@/constants/theme"; 
import { useRouter } from "expo-router"; 

export default function SignupScreen() {
  const router = useRouter(); 
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLoginNavigation = () => {
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* FIX 3: Add a "Center Container" to stop it stretching on Tablets */}
          {/* <View style={styles.tabletContainer}> */}

            <View style={styles.header}>
              <TouchableOpacity onPress={handleLoginNavigation}> 
                 <ArrowLeft color="white" size={24} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Offside</Text>
              <View style={{width: 24}} />
            </View>

            <View style={styles.titleSection}>
              <Text style={styles.bigTitle}>Join the Game</Text>
              <Text style={styles.subtitle}>Create your account to get started.</Text>
            </View>

            <View style={styles.form}>
              
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputContainer}>
                <TextInput 
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor="#555"
                />
              </View>

              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputContainer}>
                <TextInput 
                  style={styles.input}
                  placeholder="john@example.com"
                  placeholderTextColor="#555"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <Text style={styles.label}>Username</Text>
              <View style={styles.inputContainer}>
                <TextInput 
                  style={styles.input}
                  placeholder="johndoe_offside"
                  placeholderTextColor="#555"
                  autoCapitalize="none"
                />
              </View>

              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <TextInput 
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#555"
                  secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                  {passwordVisible ? 
                    <EyeOff color={Colors.primary} size={20} /> : 
                    <Eye color={Colors.primary} size={20} />
                  }
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.createButton} onPress={() => router.replace("/(auth)/verify")}>
                <Text style={styles.createButtonText}>Create Account</Text>
              </TouchableOpacity>

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
          {/* </View> */}
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
    paddingBottom: 100, // FIX 4: Huge padding at bottom so floating icons don't cover text
  },
  // FIX 5: The Magic Tablet Style
  tabletContainer: {
    width: '100%',
    maxWidth: 500, // Stretches on Phone, stops at 500px on Tablet
    alignSelf: 'center', // Centers it in the middle of the big screen
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
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
    alignItems:"center",
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
  },
  form: {
    paddingHorizontal: 20,
  },
  label: {
    color: "#A1A1A1",
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 8,
    marginTop: 10,
    textTransform:"uppercase",
     letterSpacing: 1,
  },
  inputContainer: {
    backgroundColor: "#1F1F1F", 
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
    height: "100%",
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