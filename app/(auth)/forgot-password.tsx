import React, { useState } from "react";
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
} from "react-native";
import { ArrowLeft, Mail, Zap } from "lucide-react-native";
import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSendOTP = () => {
    router.push("/(auth)/verify");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
              <ArrowLeft color="white" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.heroSection}>
            <Text style={styles.brandText}>OFFSIDE</Text>
          </View>

          {/* Middle Content */}
          <View style={styles.middle}>
            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.bigTitle}>Bench Your Old Password</Text>
              <Text style={styles.subtitle}>
                Enter your registered email below to receive a one-time
                password.
              </Text>
            </View>

            {/* Form Section */}
            <View style={styles.form}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="coach@offside.app"
                  placeholderTextColor="#555"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
                <Mail color={Colors.primary} size={20} />
              </View>

              {/* Send OTP Button */}
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleSendOTP}
              >
                <Text style={styles.actionButtonText}>Send OTP</Text>
                <Zap
                  size={20}
                  color="black"
                  fill="black"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>

              {/* Resend Link */}
              <View style={styles.resendContainer}>
                <Text style={styles.footerText}>
                  Didn&apos;t receive a code?{" "}
                </Text>
                <TouchableOpacity>
                  <Text style={styles.linkTextUnderline}>Resend</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Remembered it? </Text>
            <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
              <Text style={styles.linkTextBold}>Log In</Text>
            </TouchableOpacity>
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
    flexGrow: 1,
    justifyContent: "space-between", // Header top, middle center, footer bottom
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  heroSection: { alignItems: "center"},
  brandText: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 5,
  },
 
  middle: {
    flex: 1,
    justifyContent: "center", // Vertically center main content
    paddingHorizontal: 20,
  },

  // Title Section
  titleSection: {
    marginBottom: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  bigTitle: {
    color: "white",
    fontSize: 36,
    fontWeight: "900",
    marginBottom: 15,
    lineHeight: 42,
  },
  subtitle: {
    color: Colors.primary,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },

  // Form
  form: {
    width: "100%",
  },
  label: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  inputContainer: {
    backgroundColor: "#1F1F1F",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
    height: "100%",
    marginRight: 10,
  },

  // Button
  actionButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 20,
  },
  actionButtonText: {
    color: "black",
    fontWeight: "900",
    fontSize: 18,
  },

  // Resend Section
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
  },

  // Footer Section
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "#555",
    fontSize: 14,
  },
  linkTextUnderline: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  linkTextBold: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});
