import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCasino } from "@/context/CasinoContext";
import { useProfile } from "@/context/ProfileContext";
import { formatCredits } from "@/data/games";
import { useColors } from "@/hooks/useColors";

const MENU_ITEMS: { icon: keyof typeof Feather.glyphMap; label: string; detail: string }[] = [
  { icon: "gift", label: "Daily bonus", detail: "Claim free credits once a day" },
  { icon: "shield", label: "Responsible play", detail: "Play-money limits and reminders" },
  { icon: "info", label: "About Neon Stakes", detail: "An entertainment-only demo" },
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, updateName } = useProfile();
  const { balance, totalRounds, wins, resetCasino } = useCasino();
  const topPadding = Platform.OS === "web" ? 67 : insets.top + 12;
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(profile.name);
  const inputRef = useRef<TextInput>(null);

  const startEditing = () => {
    setDraftName(profile.name);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const confirmEdit = () => {
    updateName(draftName);
    setEditing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPadding, paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 90) }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileSection}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={[styles.avatarText, { color: colors.primaryForeground }]}>{(profile.name || "?")[0].toUpperCase()}</Text>
        </View>
        {editing ? (
          <View style={styles.nameEditRow}>
            <TextInput
              ref={inputRef}
              style={[styles.nameInput, { color: colors.foreground, backgroundColor: colors.secondary, borderColor: colors.primary }]}
              value={draftName}
              onChangeText={setDraftName}
              onSubmitEditing={confirmEdit}
              returnKeyType="done"
              maxLength={30}
              selectTextOnFocus
            />
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.primary }]} onPress={confirmEdit}>
              <Feather name="check" size={17} color={colors.primaryForeground} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.nameRow} onPress={startEditing} activeOpacity={0.7}>
            <Text style={[styles.name, { color: colors.foreground }]}>{profile.name}</Text>
            <Feather name="edit-2" size={14} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}
        <Text style={[styles.memberLabel, { color: colors.primary }]}>PLAY-MONEY MEMBER</Text>
        <Text style={[styles.memberNote, { color: colors.mutedForeground }]}>No payments or cash prizes</Text>
      </View>

      <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.stat}><Text style={[styles.statValue, { color: colors.foreground }]}>{formatCredits(balance)}</Text><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Balance</Text></View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.stat}><Text style={[styles.statValue, { color: colors.foreground }]}>{totalRounds}</Text><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Rounds</Text></View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.stat}><Text style={[styles.statValue, { color: colors.success }]}>{wins}</Text><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Wins</Text></View>
      </View>

      <View style={[styles.menuCard, { backgroundColor: colors.card }]}>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.menuItem, index < MENU_ITEMS.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}
            activeOpacity={0.75}
          >
            <View style={[styles.menuIcon, { backgroundColor: colors.secondary }]}>
              <Feather name={item.icon} size={18} color={colors.primary} />
            </View>
            <View style={styles.menuCopy}>
              <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
              <Text style={[styles.menuDetail, { color: colors.mutedForeground }]}>{item.detail}</Text>
            </View>
            <Feather name="chevron-right" size={17} color={colors.mutedForeground} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.resetButton, { backgroundColor: colors.secondary }]}
        onPress={resetCasino}
        activeOpacity={0.8}
      >
        <Feather name="refresh-cw" size={16} color={colors.destructive} />
        <Text style={[styles.resetText, { color: colors.destructive }]}>Reset demo credits</Text>
      </TouchableOpacity>
      <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>
        Neon Stakes is a simulated casino experience. Credits are fictional, have no monetary value, and cannot be exchanged or withdrawn.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileSection: { alignItems: "center", paddingVertical: 22, gap: 9 },
  avatar: { width: 84, height: 84, borderRadius: 42, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 34, fontFamily: "Inter_700Bold" },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  name: { fontSize: 23, fontFamily: "Inter_700Bold" },
  nameEditRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 20, width: "100%" },
  nameInput: { flex: 1, height: 44, borderWidth: 1.5, borderRadius: 11, paddingHorizontal: 12, fontSize: 16, fontFamily: "Inter_500Medium" },
  iconButton: { width: 44, height: 44, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  memberLabel: { fontSize: 10, letterSpacing: 1.5, fontFamily: "Inter_700Bold" },
  memberNote: { fontSize: 12, fontFamily: "Inter_400Regular" },
  statsCard: { marginHorizontal: 20, borderRadius: 17, borderWidth: 1, paddingVertical: 17, flexDirection: "row" },
  stat: { flex: 1, alignItems: "center", gap: 4 },
  statValue: { fontSize: 16, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  divider: { width: StyleSheet.hairlineWidth, marginVertical: 3 },
  menuCard: { margin: 20, marginBottom: 12, borderRadius: 17, overflow: "hidden" },
  menuItem: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  menuIcon: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  menuCopy: { flex: 1, gap: 3 },
  menuLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  menuDetail: { fontSize: 11, fontFamily: "Inter_400Regular" },
  resetButton: { marginHorizontal: 20, borderRadius: 13, paddingVertical: 13, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  resetText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  disclaimer: { marginHorizontal: 28, marginTop: 20, textAlign: "center", fontSize: 11, lineHeight: 17, fontFamily: "Inter_400Regular" },
});