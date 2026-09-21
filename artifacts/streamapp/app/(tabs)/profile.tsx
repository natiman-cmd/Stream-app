import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useBetting } from "@/context/BettingContext";
import { useProfile } from "@/context/ProfileContext";
import { useColors } from "@/hooks/useColors";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, updateName } = useProfile();
  const { balance, history } = useBetting();
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(profile.name);
  const inputRef = useRef<TextInput>(null);
  const topPadding = Platform.OS === "web" ? 67 : insets.top + 12;

  const saveName = () => {
    updateName(draftName);
    setEditing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPadding, paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 90) }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.accent }]}><Text style={[styles.avatarText, { color: colors.accentForeground }]}>{(profile.name || "?")[0].toUpperCase()}</Text></View>
        {editing ? (
          <View style={styles.editRow}>
            <TextInput ref={inputRef} value={draftName} onChangeText={setDraftName} onSubmitEditing={saveName} autoFocus style={[styles.input, { color: colors.foreground, backgroundColor: colors.input, borderColor: colors.accent }]} />
            <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.accent }]} onPress={saveName}><Feather name="check" size={17} color={colors.accentForeground} /></TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.nameRow} onPress={() => { setDraftName(profile.name); setEditing(true); setTimeout(() => inputRef.current?.focus(), 50); }}>
            <Text style={[styles.name, { color: colors.foreground }]}>{profile.name}</Text><Feather name="edit-2" size={14} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}
        <Text style={[styles.accountLabel, { color: colors.accent }]}>NUDRUB BET DEMO ACCOUNT</Text>
        <Text style={[styles.accountNote, { color: colors.mutedForeground }]}>Virtual balance · no cash value</Text>
      </View>

      <View style={[styles.stats, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.stat}><Text style={[styles.statValue, { color: colors.foreground }]}>ETB {balance.toLocaleString()}</Text><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Balance</Text></View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.stat}><Text style={[styles.statValue, { color: colors.foreground }]}>{history.length}</Text><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Tickets</Text></View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.stat}><Text style={[styles.statValue, { color: colors.accent }]}>Demo</Text><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Mode</Text></View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Responsible gambling</Text>
      <View style={[styles.responsibleCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.shield, { backgroundColor: colors.secondary }]}><Feather name="shield" size={21} color={colors.success} /></View>
        <View style={styles.copy}><Text style={[styles.cardTitle, { color: colors.foreground }]}>Keep it fun and within your limits</Text><Text style={[styles.cardText, { color: colors.mutedForeground }]}>Only bet what you can afford to lose. Take regular breaks and never chase losses.</Text></View>
      </View>
      {[
        { icon: "pause-circle" as const, title: "Take a break", text: "Step away whenever betting stops feeling enjoyable." },
        { icon: "sliders" as const, title: "Set personal limits", text: "Choose a time or spend limit before you start a session." },
        { icon: "help-circle" as const, title: "Need support?", text: "Talk to someone you trust if betting is causing stress." },
      ].map((item) => (
        <TouchableOpacity key={item.title} style={[styles.menuRow, { borderBottomColor: colors.border }]} onPress={() => Alert.alert(item.title, item.text)}>
          <Feather name={item.icon} size={19} color={colors.primary} /><View style={styles.copy}><Text style={[styles.menuTitle, { color: colors.foreground }]}>{item.title}</Text><Text style={[styles.menuText, { color: colors.mutedForeground }]}>{item.text}</Text></View><Feather name="chevron-right" size={16} color={colors.mutedForeground} />
        </TouchableOpacity>
      ))}
      <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>NUDRUB BET IS CURRENTLY A VIRTUAL-CREDITS DEMO. NO DEPOSITS, WITHDRAWALS, OR CASH PAYOUTS ARE AVAILABLE.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  header: { alignItems: "center", paddingVertical: 18, gap: 9 },
  avatar: { width: 78, height: 78, borderRadius: 39, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 31, fontFamily: "Inter_700Bold" },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  name: { fontSize: 23, fontFamily: "Inter_700Bold" },
  editRow: { flexDirection: "row", width: "100%", gap: 8 },
  input: { flex: 1, height: 44, borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 12, fontSize: 16, fontFamily: "Inter_500Medium" },
  saveButton: { width: 44, height: 44, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  accountLabel: { fontSize: 10, letterSpacing: 1.4, fontFamily: "Inter_700Bold" },
  accountNote: { fontSize: 12, fontFamily: "Inter_400Regular" },
  stats: { borderWidth: 1, borderRadius: 14, paddingVertical: 15, flexDirection: "row" },
  stat: { flex: 1, alignItems: "center", gap: 4 },
  statValue: { fontSize: 14, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  divider: { width: StyleSheet.hairlineWidth, marginVertical: 3 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", marginTop: 24, marginBottom: 10 },
  responsibleCard: { borderWidth: 1, borderRadius: 14, padding: 13, flexDirection: "row", gap: 10, alignItems: "center" },
  shield: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  copy: { flex: 1, gap: 3 },
  cardTitle: { fontSize: 13, fontFamily: "Inter_700Bold" },
  cardText: { fontSize: 11, lineHeight: 16, fontFamily: "Inter_400Regular" },
  menuRow: { borderBottomWidth: StyleSheet.hairlineWidth, paddingVertical: 15, flexDirection: "row", alignItems: "center", gap: 11 },
  menuTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  menuText: { fontSize: 11, lineHeight: 16, fontFamily: "Inter_400Regular" },
  disclaimer: { textAlign: "center", fontSize: 9, lineHeight: 15, letterSpacing: 0.5, marginTop: 24, fontFamily: "Inter_500Medium" },
});