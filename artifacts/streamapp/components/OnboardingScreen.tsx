import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useProfile } from "@/context/ProfileContext";
import { useColors } from "@/hooks/useColors";

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { completeOnboarding } = useProfile();
  const [name, setName] = useState("");
  const inputRef = useRef<TextInput>(null);
  const canContinue = name.trim().length > 0;

  const finish = () => {
    if (!name.trim()) {
      inputRef.current?.focus();
      return;
    }
    Keyboard.dismiss();
    completeOnboarding(name.trim());
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace("/(tabs)");
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, 24), paddingBottom: Math.max(insets.bottom, 24) }]}
      bottomOffset={24}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.brandRow}>
        <View style={[styles.logo, { backgroundColor: colors.accent }]}>
          <Feather name="activity" size={21} color={colors.accentForeground} />
        </View>
        <Text style={[styles.brand, { color: colors.foreground }]}>Nudrub Bet</Text>
      </View>
      <View style={styles.main}>
        <View style={[styles.welcomeIcon, { backgroundColor: colors.card }]}>
          <Feather name="target" size={35} color={colors.accent} />
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>Your match day starts here</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Follow the sports you love, manage your wallet, and keep every choice in one place.
        </Text>
        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.foreground }]}>Choose your display name</Text>
          <TextInput
            ref={inputRef}
            testID="onboarding-name-input"
            style={[styles.input, { color: colors.foreground, backgroundColor: colors.input, borderColor: canContinue ? colors.accent : colors.border }]}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor={colors.mutedForeground}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={finish}
            maxLength={30}
          />
          <Text style={[styles.helper, { color: colors.mutedForeground }]}>
            Deposits and withdrawals are submitted for manual review. Wagering remains compliance-gated.
          </Text>
        </View>
      </View>
      <TouchableOpacity
        testID="onboarding-continue-button"
        style={[styles.button, { backgroundColor: canContinue ? colors.accent : colors.secondary, opacity: canContinue ? 1 : 0.75 }]}
        onPress={finish}
        activeOpacity={0.85}
      >
        <Text style={[styles.buttonText, { color: canContinue ? colors.accentForeground : colors.mutedForeground }]}>Enter Nudrub Bet</Text>
        <Feather name="arrow-right" size={18} color={canContinue ? colors.accentForeground : colors.mutedForeground} />
      </TouchableOpacity>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 24 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  brand: { fontSize: 18, fontFamily: "Inter_700Bold" },
  main: { flex: 1, justifyContent: "center", paddingVertical: 40 },
  welcomeIcon: { width: 74, height: 74, borderRadius: 24, alignItems: "center", justifyContent: "center", marginBottom: 24 },
  title: { fontSize: 34, lineHeight: 40, fontFamily: "Inter_700Bold", marginBottom: 12 },
  subtitle: { fontSize: 16, lineHeight: 24, fontFamily: "Inter_400Regular", maxWidth: 330 },
  form: { marginTop: 36 },
  label: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 10 },
  input: { height: 54, borderWidth: 1.5, borderRadius: 13, paddingHorizontal: 16, fontSize: 16, fontFamily: "Inter_500Medium" },
  helper: { fontSize: 12, lineHeight: 17, fontFamily: "Inter_400Regular", marginTop: 9 },
  button: { minHeight: 56, borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  buttonText: { fontSize: 16, fontFamily: "Inter_700Bold" },
});