import React, { useState, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Pressable
} from "react-native";
import { ArrowLeft, Lock, Eye, EyeOff, Key, RotateCcw } from "lucide-react-native";
import { Colors } from "@/constants/theme"; 
import { useRouter } from "expo-router"; 
// We reuse the Haptics we created earlier for that premium feel

export default function ResetPasswordScreen() {
  const router = useRouter(); 
  
  // State
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP Logic
  const otpRef = useRef<TextInput>(null);
  const OTP_LENGTH = 6;
  const otpArray = new Array(OTP_LENGTH).fill(0);

  // Password Strength Logic (Simple Visual)
  const getStrengthLevel = (pass: string) => {
    if (pass.length === 0) return 0;
    if (pass.length < 6) return 1;
    if (pass.length < 10) return 2;
    return 3; // Max strength
  };
  const strength = getStrengthLevel(newPassword);

  const handleReset = () => {
    if (otp.length === OTP_LENGTH && newPassword && newPassword === confirmPassword) {
      
      // In real app: Call API -> Success -> Login
      router.replace("/(auth)/login"); 
    } else {
      
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}> 
               <ArrowLeft color="white" size={24} />
            </TouchableOpacity>
            <Text style={styles.securityBadge}>OFFSIDE SECURITY</Text>
          </View>

          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.bigTitle}>
              Set New <Text style={{color: Colors.primary}}>Password</Text>
            </Text>
            <Text style={styles.subtitle}>
              Enter the code sent to your email and choose a secure new password to regain access.
            </Text>
          </View>

          {/* 1. OTP Section (Circular Inputs) */}
          <View style={styles.section}>
            <Text style={styles.label}>OTP CODE</Text>
            <View style={styles.otpWrapper}>
              <TextInput 
                ref={otpRef}
                value={otp}
                onChangeText={(t) => {
                  setOtp(t);
            
                }}
                maxLength={OTP_LENGTH}
                keyboardType="number-pad"
                style={styles.hiddenInput}
              />
              <Pressable style={styles.otpContainer} onPress={() => otpRef.current?.focus()}>
                {otpArray.map((_, index) => {
                  const digit = otp[index];
                  const isFocused = index === otp.length;
                  return (
                    <View 
                      key={index} 
                      style={[
                        styles.otpCircle, 
                        isFocused && styles.otpCircleFocused,
                        digit ? styles.otpCircleFilled : null
                      ]}
                    >
                      <Text style={styles.otpText}>{digit || "-"}</Text>
                    </View>
                  );
                })}
              </Pressable>
            </View>
          </View>

          {/* 2. New Password */}
          <View style={styles.section}>
            <Text style={styles.label}>NEW PASSWORD</Text>
            <View style={styles.inputContainer}>
              <Lock color="#555" size={20} style={{marginRight: 10}} />
              <TextInput 
                style={styles.input}
                placeholder="Min. 8 characters"
                placeholderTextColor="#555"
                secureTextEntry={!showPassword}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff color="#555" size={20} /> : <Eye color="#555" size={20} />}
              </TouchableOpacity>
            </View>
            
            {/* Strength Meter Bars */}
            <View style={styles.strengthContainer}>
              {[1, 2, 3, 4].map((bar, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.strengthBar, 
                    index < strength ? styles.strengthActive : styles.strengthInactive
                  ]} 
                />
              ))}
            </View>
          </View>

          {/* 3. Confirm Password */}
          <View style={styles.section}>
            <Text style={styles.label}>CONFIRM NEW PASSWORD</Text>
            <View style={styles.inputContainer}>
              <RotateCcw color="#555" size={20} style={{marginRight: 10}} />
              <TextInput 
                style={styles.input}
                placeholder="Repeat your password"
                placeholderTextColor="#555"
                secureTextEntry={!showPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
          </View>

          {/* Reset Button */}
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>RESET PASSWORD</Text>
            <Key size={20} color="black" fill="black" style={{marginLeft: 8}} />
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Didn&apos;t receive the code? </Text>
            <TouchableOpacity>
              <Text style={styles.resendText}>Resend Code</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Branding */}
          <View style={styles.branding}>
             {/* Simple Text Logo or Icon */}
             <View style={styles.logoDiamond} />
             <Text style={styles.logoText}>OFFSIDE</Text>
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
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 30,
  },
  securityBadge: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 15,
    letterSpacing: 1,
  },
  
  // Title
  titleSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  bigTitle: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: "#A1A1A1", 
    fontSize: 15,
    lineHeight: 22,
  },

  // Sections
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  label: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // OTP Styles
  otpWrapper: {
    height: 60,
    justifyContent: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1, height: 1, opacity: 0,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otpCircle: {
    width: 50, height: 50,
    borderRadius: 25, // Circular
    backgroundColor: "#111", // Very dark
    borderWidth: 1,
    borderColor: "#333",
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpCircleFocused: {
    borderColor: Colors.primary,
    backgroundColor: "rgba(204, 255, 0, 0.05)",
  },
  otpCircleFilled: {
    borderColor: "#555",
    backgroundColor: "#1F1F1F",
  },
  otpText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  // Input Styles
  inputContainer: {
    backgroundColor: "#1F1F1F", 
    borderRadius: 30, // Pill shape like in design
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 56,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
    height: "100%",
  },

  // Strength Bar
  strengthContainer: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 5,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthActive: {
    backgroundColor: Colors.primary,
  },
  strengthInactive: {
    backgroundColor: "#333",
  },

  // Button
  resetButton: {
    backgroundColor: Colors.primary, 
    borderRadius: 30,
    height: 56,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 30,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  resetButtonText: {
    color: "#000",
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 1,
  },

  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
  },
  footerText: {
    color: "#555",
    fontSize: 14,
  },
  resendText: {
    color: Colors.primary, 
    fontWeight: "bold",
    fontSize: 14,
  },

  // Bottom Branding
  branding: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    opacity: 0.5,
  },
  logoDiamond: {
    width: 12, height: 12,
    backgroundColor: Colors.primary,
    transform: [{ rotate: '45deg' }], // Diamond shape
    marginRight: 8,
  },
  logoText: {
    color: "white",
    fontWeight: '900',
    fontSize: 16,
    fontStyle: 'italic',
  },
});