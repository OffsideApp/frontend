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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, AtSign, PenTool } from "lucide-react-native";
import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import StickyFooter from "@/components/StickyFooter";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setProfileSchema, setProfileType } from "@/schema/auth.schema";
import { useAuthMutations } from "@/services/auth/auth.queries";

export default function SetProfileScreen() {
  const router = useRouter();
  const { setProfileMutation } = useAuthMutations();
  const [bioLength, setBioLength] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<setProfileType>({
    resolver: zodResolver(setProfileSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      bio: "",
    },
  });

  const onSubmit = (data: setProfileType) => {
    // Send it to the backend!
    setProfileMutation.mutate(data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/(auth)/select-club")}
          style={styles.iconButton}
        >
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Claim Your Identity</Text>
        <View style={{ width: 34 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.textSection}>
            <Text style={styles.bigTitle}>Who are you?</Text>
            <Text style={styles.subtitle}>
              Pick a unique handle and drop your football philosophy.
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Username</Text>
            <View
              style={[
                styles.inputContainer,
                errors.username && styles.inputError,
              ]}
            >
              <View style={styles.atSymbolContainer}>
                <AtSign color="#555" size={18} />
              </View>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="jayjay_10"
                    placeholderTextColor="#555"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />
            </View>
            {errors.username?.message ? (
              <Text style={styles.errorText}>{errors.username.message}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bio (Optional)</Text>
            <View
              style={[styles.bioContainer, errors.bio && styles.inputError]}
            >
              <Controller
                control={control}
                name="bio"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.bioInput}
                    placeholder="e.g. In Pep we trust. Treble winners."
                    placeholderTextColor="#555"
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      setBioLength(text.length);
                      onChange(text);
                    }}
                    value={value}
                    multiline
                    maxLength={160}
                    textAlignVertical="top"
                  />
                )}
              />
            </View>
            <View style={styles.bioFooter}>
              <View style={{ flex: 1 }}>
                {errors.bio?.message ? (
                  <Text style={styles.errorText}>{errors.bio.message}</Text>
                ) : null}
              </View>
              <Text
                style={[
                  styles.charCount,
                  bioLength >= 150 && { color: Colors.primary },
                ]}
              >
                {bioLength}/160
              </Text>
            </View>
          </View>
        </ScrollView>

        <StickyFooter
          title={
            setProfileMutation.isPending ? "SAVING..." : "CONTINUE"
          }
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid || setProfileMutation.isPending}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D0D" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerTitle: { color: "white", fontWeight: "bold", fontSize: 16 },
  iconButton: { padding: 5 },
  content: { paddingHorizontal: 20, paddingTop: 30, paddingBottom: 120 },
  textSection: { alignItems: "center", marginBottom: 40 },
  bigTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "#777",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
  },

  inputGroup: { marginBottom: 25 },
  inputLabel: {
    color: "#CCC",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F1F1F",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    height: 55,
    overflow: "hidden",
  },
  atSymbolContainer: {
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    height: "100%",
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.05)",
  },
  input: { flex: 1, color: "white", fontSize: 16, paddingHorizontal: 15 },
  inputError: { borderColor: "#FF4C4C" },
  errorText: { color: "#FF4C4C", fontSize: 12, marginTop: 6, marginLeft: 4 },

  bioContainer: {
    backgroundColor: "#1F1F1F",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    minHeight: 120,
    padding: 15,
  },
  bioInput: { color: "white", fontSize: 16, flex: 1 },
  bioFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 4,
  },
  charCount: { color: "#555", fontSize: 12, fontWeight: "500" },
});
