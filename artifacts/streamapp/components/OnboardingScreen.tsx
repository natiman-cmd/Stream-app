import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
    const trimmedName = name.trim();
    if (!trimmedName) {
      inputRef.current?.focus();
      return;
    }

    Keyboard.dismiss();
    completeOnboarding(trimmedName);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace("/(tabs)");
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Math.max(insets.top, 24),
          paddingBottom: Math.max(insets.bottom, 24),
        },
      ]}
      bottomOffset={24}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topRow}>
        <View style={[styles.logoMark, { backgroundColor: colors.primary }]}>
          <Feather name="play" size={20} color={colors.primaryForeground} />
        </View>
        <Text style={[styles.brand, { color: colors.foreground }]}>
          StreamApp
        </Text>
      </View>

      <View style={styles.main}>
        <View style={[styles.welcomeIcon, { backgroundColor: colors.card }]}>
          <Feather name="film" size={34} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Make it yours
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Tell us your name and we’ll personalize your streaming experience.
        </Text>

        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.foreground }]}>
            What should we call you?
          </Text>
          <TextInput
            ref={inputRef}
            testID="onboarding-name-input"
            style={[
              styles.input,
              {
                color: colors.foreground,
                backgroundColor: colors.input,
                borderColor: canContinue ? colors.primary : colors.border,
              },
            ]}
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
            You can change this later from your Profile.
          </Text>
        </View>
      </View>

      <TouchableOpacity
        testID="onboarding-continue-button"
        style={[
          styles.button,
          {
            backgroundColor: canContinue ? colors.primary : colors.secondary,
            ...(canContinue
              ? {
                  shadowColor: colors.primary,
                  shadowOpacity: 0.7,
                  shadowRadius: 14,
                  shadowOffset: { width: 0, height: 0 },
                  elevation: 10,
                }
              : {}),
          },
        ]}
        onPress={finish}
        activeOpacity={0.85}
      >
        <Text
          style={[
            styles.buttonText,
            { color: canContinue ? colors.primaryForeground : colors.mutedForeground },
          ]}
        >
          Continue
        </Text>
        <Feather
          name="arrow-right"
          size={18}
          color={canContinue ? colors.primaryForeground : colors.mutedForeground}
        />
      </TouchableOpacity>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoMark: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  main: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 40,
  },
  welcomeIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontFamily: "Inter_700Bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Inter_400Regular",
    maxWidth: 320,
  },
  form: {
    marginTop: 36,
  },
  label: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 10,
  },
  input: {
    height: 54,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  helper: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 9,
  },
  button: {
    minHeight: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
});