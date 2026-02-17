import React, { useState, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  Pressable 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, ShieldCheck } from "lucide-react-native";
import { Colors } from "@/constants/theme"; 
import { useRouter } from "expo-router"; 

export default function VerifyScreen() {
  const router = useRouter(); 
  const [code, setCode] = useState("");
  const inputRef = useRef<TextInput>(null);

  const CODE_LENGTH = 6;
  const codeDigitsArray = new Array(CODE_LENGTH).fill(0);

  const handleVerify = () => {
    if (code.length === CODE_LENGTH) {
      router.replace("/(auth)/select-club");
    } else {
      alert("Please enter the full 6-digit code");
    }
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
            <TouchableOpacity onPress={() => router.replace("/(auth)/signup")}> 
              <ArrowLeft color="white" size={24} />
            </TouchableOpacity>
          </View>

          {/* Middle Content - Centered */}
          <View style={styles.middle}>
            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.bigTitle}>Verify Your email</Text>
              <Text style={styles.subtitle}>We sent a 6-digit code to your email</Text>
              <Text style={styles.emailText}>player@offside.app</Text>
            </View>

            {/* OTP Input Section */}
            <View style={styles.otpSection}>
              <TextInput 
                ref={inputRef}
                value={code}
                onChangeText={setCode}
                maxLength={CODE_LENGTH}
                keyboardType="number-pad"
                returnKeyType="done"
                style={styles.hiddenInput}
              />
              <Pressable style={styles.otpContainer} onPress={handleContainerPress}>
                {codeDigitsArray.map((_, index) => {
                  const digit = code[index];
                  const isFocused = index === code.length; 
                  return (
                    <View 
                      key={index} 
                      style={[
                        styles.otpBox, 
                        isFocused && styles.otpBoxFocused,
                        digit && styles.otpBoxFilled
                      ]}
                    >
                      <Text style={styles.otpText}>{digit || "•"}</Text>
                    </View>
                  );
                })}
              </Pressable>
            </View>

            {/* Verify Button */}
            <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
              <Text style={styles.verifyButtonText}>Verify</Text>
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
    justifyContent: 'space-between', // Header top, middle center, footer bottom
  },

  header: {
    paddingTop: 10,
  },

  middle: {
    flex: 1,
    justifyContent: 'center', // Center middle content vertically
  },

  // Text Styles
  titleSection: {
    marginBottom: 40,
    justifyContent:'center',
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

  // OTP Styles
  otpSection: {
    marginBottom: 40,
    alignItems: 'center',
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
  },
  otpBox: {
    width: 45,
    height: 55,
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
  otpText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },

  // Button
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
  verifyButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 18,
  },

  // Footer
  bottom: {
    flexShrink: 0,
    alignItems: 'center',
    marginBottom: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
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
  
  // Secure Badge
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
