import React, { useRef, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  Pressable,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, ShieldCheck } from "lucide-react-native";
import { Colors } from "@/constants/theme"; 
import { useRouter, useLocalSearchParams } from "expo-router"; 

// 1. Imports for Logic
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthMutations } from "@/services/auth/auth.queries";

// 2. Define Schema Locally (Simple enough)
const verifySchema = z.object({
  otp: z.string().length(6, "Please enter the full 6-digit code"),
});

type VerifyFormType = z.infer<typeof verifySchema>;

export default function VerifyScreen() {
  const router = useRouter(); 
  
  // 3. Get Email from previous screen
  const { email } = useLocalSearchParams<{ email: string }>();

  // 4. Setup Mutation & Form
  const { verifyMutation } = useAuthMutations();
  const inputRef = useRef<TextInput>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<VerifyFormType>({
    resolver: zodResolver(verifySchema),
    defaultValues: { otp: "" }
  });

  const CODE_LENGTH = 6;
  const codeDigitsArray = new Array(CODE_LENGTH).fill(0);

  // 5. Submit Handler
  const onSubmit = (data: VerifyFormType) => {
    if (!email) {
        alert("Email missing! Please go back and signup again.");
        return;
    }
    // Call API
    verifyMutation.mutate({ email, otp: data.otp });
  };

  const handleContainerPress = () => {
    inputRef.current?.focus();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <View style={styles.wrapper}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}> 
              <ArrowLeft color="white" size={24} />
            </TouchableOpacity>
          </View>

          {/* Middle Content - Centered */}
          <View style={styles.middle}>
            
            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.bigTitle}>Verify Your Email</Text>
              <Text style={styles.subtitle}>We sent a 6-digit code to</Text>
              <Text style={styles.emailText}>{email || "your email"}</Text>
            </View>

            {/* OTP Input Section */}
            <View style={styles.otpSection}>
              
              {/* HIDDEN INPUT (Controlled by React Hook Form) */}
              <Controller
                control={control}
                name="otp"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <TextInput 
                      ref={inputRef}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      maxLength={CODE_LENGTH}
                      keyboardType="number-pad"
                      returnKeyType="done"
                      style={styles.hiddenInput}
                    />

                    {/* VISUAL BOXES (Mapped to the hidden input value) */}
                    <Pressable style={styles.otpContainer} onPress={handleContainerPress}>
                      {codeDigitsArray.map((_, index) => {
                        const digit = value ? value[index] : undefined;
                        const isFocused = value ? index === value.length : index === 0; 
                        
                        return (
                          <View 
                            key={index} 
                            style={[
                              styles.otpBox, 
                              isFocused && styles.otpBoxFocused,
                              digit ? styles.otpBoxFilled : null,
                              errors.otp && styles.otpBoxError // Red border on error
                            ]}
                          >
                            <Text style={styles.otpText}>{digit || ""}</Text>
                          </View>
                        );
                      })}
                    </Pressable>
                  </>
                )}
              />
              
              {/* Error Message */}
              {errors.otp && <Text style={styles.errorText}>{errors.otp.message}</Text>}
            </View>

            {/* Verify Button */}
            <TouchableOpacity 
              style={[styles.verifyButton, verifyMutation.isPending && styles.verifyButtonDisabled]} 
              onPress={handleSubmit(onSubmit)}
              disabled={verifyMutation.isPending}
            >
              {verifyMutation.isPending ? (
                 <ActivityIndicator color="black" />
              ) : (
                 <Text style={styles.verifyButtonText}>Verify Account</Text>
              )}
            </TouchableOpacity>

          </View>

          {/* Footer & Secure Badge */}
          <View style={styles.bottom}>
            <View style={styles.footer}>
              <Text style={styles.footerText}>Didn&apos;t receive a code? </Text>
              <TouchableOpacity>
                <Text style={styles.resendText}>Resend Code</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.secureBadge}>
              <ShieldCheck size={14} color="#555" />
              <Text style={styles.secureText}>SECURE VERIFICATION SYSTEM</Text>
            </View>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D", 
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 10,
  },
  middle: {
    flex: 1,
    justifyContent: 'center',
  },
  titleSection: {
    marginBottom: 40,
    alignItems: 'center', // Centered text looks better for OTP screens
  },
  bigTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: "#A1A1A1", 
    fontSize: 16,
    lineHeight: 24,
  },
  emailText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
    textDecorationLine: 'underline',
  },
  otpSection: {
    marginBottom: 40,
    alignItems: 'center',
    width: '100%',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  otpContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 8, // Added gap for better spacing
  },
  otpBox: {
    flex: 1, // Allow boxes to grow equally
    aspectRatio: 0.8, // Maintain rectangular shape
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "#1F1F1F",
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFocused: {
    borderColor: Colors.primary,
    backgroundColor: "rgba(204, 255, 0, 0.05)",
  },
  otpBoxFilled: {
    borderColor: "white",
  },
  otpBoxError: {
    borderColor: "#EF4444",
  },
  otpText: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    marginTop: 15,
  },
  verifyButton: {
    backgroundColor: Colors.primary, 
    borderRadius: 30,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  verifyButtonDisabled: {
    opacity: 0.7,
  },
  verifyButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 18,
  },
  bottom: {
    flexShrink: 0,
    alignItems: 'center',
    marginBottom: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
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
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  secureText: {
    color: '#555',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});