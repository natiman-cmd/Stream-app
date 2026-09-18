import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useCasino } from "@/context/CasinoContext";
import { GAMES } from "@/data/games";
import { useColors } from "@/hooks/useColors";

const PASSWORD_KEY = "@streamapp/admin-password";

export default function AdminScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { resetCasino } = useCasino();
  const [storedPassword, setStoredPassword] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const topPadding = Platform.OS === "web" ? 67 : insets.top + 12;

  useEffect(() => {
    AsyncStorage.getItem(PASSWORD_KEY).then(setStoredPassword);
  }, []);

  const submitPassword = () => {
    const trimmed = password.trim();
    if (trimmed.length < 4) return;
    if (!storedPassword) {
      void AsyncStorage.setItem(PASSWORD_KEY, trimmed);
      setStoredPassword(trimmed);
      setUnlocked(true);
    } else if (trimmed === storedPassword) {
      setUnlocked(true);
    } else {
      Alert.alert("Incorrect password", "Please try again.");
    }
    setPassword("");
  };

  if (!unlocked) {
    const isSetup = !storedPassword;
    return (
      <View style={[styles.locked, { backgroundColor: colors.background, paddingTop: topPadding }]}>
        <View style={[styles.lockIcon, { backgroundColor: colors.card }]}>
          <Feather name="shield" size={34} color={colors.primary} />
        </View>
        <Text style={[styles.lockTitle, { color: colors.foreground }]}>{isSetup ? "Set up controls" : "Admin controls"}</Text>
        <Text style={[styles.lockSubtitle, { color: colors.mutedForeground }]}>
          {isSetup ? "Create a local password to review the play-money game setup." : "Enter your local admin password to continue."}
        </Text>
        <TextInput
          testID="admin-password-input"
          style={[styles.input, { color: colors.foreground, backgroundColor: colors.input, borderColor: colors.border }]}
          value={password}
          onChangeText={setPassword}
          placeholder={isSetup ? "Create password" : "Enter password"}
          placeholderTextColor={colors.mutedForeground}
          secureTextEntry
          autoCapitalize="none"
          onSubmitEditing={submitPassword}
        />
        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary, opacity: password.trim().length >= 4 ? 1 : 0.5 }]} onPress={submitPassword} disabled={password.trim().length < 4}>
          <Text style={[styles.primaryText, { color: colors.primaryForeground }]}>{isSetup ? "Create password" : "Unlock controls"}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPadding, paddingBottom: insets.bottom + 100 }}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.foreground }]}>Game controls</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Local play-money configuration</Text>
        </View>
        <TouchableOpacity onPress={() => setUnlocked(false)} style={[styles.lockButton, { backgroundColor: colors.secondary }]}>
          <Feather name="lock" size={16} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>
      <View style={[styles.notice, { backgroundColor: colors.secondary }]}>
        <Feather name="info" size={18} color={colors.accent} />
        <Text style={[styles.noticeText, { color: colors.mutedForeground }]}>This demo has no deposits, withdrawals, or cash-equivalent prizes. Game outcomes are generated locally for entertainment.</Text>
      </View>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Active tables ({GAMES.length})</Text>
      {GAMES.map((game) => (
        <View key={game.id} style={[styles.gameRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.gameIcon, { backgroundColor: `${game.accent}20` }]}><Feather name={game.icon} size={18} color={game.accent} /></View>
          <View style={styles.gameCopy}><Text style={[styles.gameTitle, { color: colors.foreground }]}>{game.title}</Text><Text style={[styles.gameMeta, { color: colors.mutedForeground }]}>{game.category} · {game.minStake}–{game.maxStake} credits</Text></View>
          <Text style={[styles.payout, { color: game.accent }]}>{game.payoutLabel}</Text>
        </View>
      ))}
      <TouchableOpacity style={[styles.resetButton, { backgroundColor: colors.secondary }]} onPress={() => { resetCasino(); Alert.alert("Demo reset", "The wallet and activity history are back to a fresh session."); }}>
        <Feather name="refresh-cw" size={16} color={colors.destructive} />
        <Text style={[styles.resetText, { color: colors.destructive }]}>Reset wallet and history</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  locked: { flex: 1, paddingHorizontal: 24, alignItems: "center" },
  lockIcon: { width: 76, height: 76, borderRadius: 24, alignItems: "center", justifyContent: "center", marginTop: 70, marginBottom: 22 },
  lockTitle: { fontSize: 26, fontFamily: "Inter_700Bold", textAlign: "center" },
  lockSubtitle: { fontSize: 15, lineHeight: 22, fontFamily: "Inter_400Regular", textAlign: "center", maxWidth: 320, marginTop: 10, marginBottom: 26 },
  input: { width: "100%", height: 50, borderWidth: 1, borderRadius: 11, paddingHorizontal: 14, fontSize: 15, fontFamily: "Inter_400Regular" },
  primaryButton: { width: "100%", minHeight: 51, marginTop: 14, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  primaryText: { fontSize: 15, fontFamily: "Inter_700Bold" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  title: { fontSize: 28, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 4 },
  lockButton: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  notice: { borderRadius: 14, padding: 14, flexDirection: "row", gap: 10, alignItems: "flex-start", marginBottom: 24 },
  noticeText: { flex: 1, fontSize: 12, lineHeight: 18, fontFamily: "Inter_400Regular" },
  sectionTitle: { fontSize: 19, fontFamily: "Inter_700Bold", marginBottom: 10 },
  gameRow: { minHeight: 70, borderRadius: 14, borderWidth: 1, padding: 11, flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 9 },
  gameIcon: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  gameCopy: { flex: 1 },
  gameTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  gameMeta: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 3 },
  payout: { maxWidth: 90, fontSize: 10, textAlign: "right", fontFamily: "Inter_600SemiBold" },
  resetButton: { marginTop: 18, borderRadius: 13, paddingVertical: 14, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  resetText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
});