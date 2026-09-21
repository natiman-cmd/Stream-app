import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SPORTS, TOP_LEAGUES } from "@/data/matches";
import { useColors } from "@/hooks/useColors";

export default function AdminScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === "web" ? 67 : insets.top + 12;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingTop: topPadding, paddingBottom: insets.bottom + 90 }}>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>NUDRUB BET</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>Sports setup</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Preview of the demo sportsbook configuration.</Text>
      <View style={[styles.notice, { backgroundColor: colors.secondary }]}>
        <Feather name="shield" size={18} color={colors.success} />
        <Text style={[styles.noticeText, { color: colors.mutedForeground }]}>This build intentionally uses local demo odds and virtual credits. It does not process real wagers.</Text>
      </View>
      <Text style={[styles.section, { color: colors.foreground }]}>Sports ({SPORTS.length})</Text>
      {SPORTS.map((sport) => <View key={sport.name} style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}><Feather name={sport.name === "Virtual Sports" ? "target" : "circle"} size={17} color={colors.accent} /><Text style={[styles.rowText, { color: colors.foreground }]}>{sport.name}</Text><Text style={[styles.count, { color: colors.mutedForeground }]}>{sport.count}</Text></View>)}
      <Text style={[styles.section, { color: colors.foreground }]}>Top leagues</Text>
      {TOP_LEAGUES.map((league) => <View key={league} style={[styles.leagueRow, { borderBottomColor: colors.border }]}><Feather name="award" size={15} color={colors.primary} /><Text style={[styles.leagueText, { color: colors.foreground }]}>{league}</Text></View>)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  eyebrow: { fontSize: 10, letterSpacing: 2, fontFamily: "Inter_700Bold" },
  title: { fontSize: 29, fontFamily: "Inter_700Bold", marginTop: 5 },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 5 },
  notice: { marginTop: 19, borderRadius: 12, padding: 13, flexDirection: "row", gap: 9 },
  noticeText: { flex: 1, fontSize: 12, lineHeight: 17, fontFamily: "Inter_400Regular" },
  section: { fontSize: 18, fontFamily: "Inter_700Bold", marginTop: 24, marginBottom: 10 },
  row: { minHeight: 50, borderRadius: 9, borderWidth: 1, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 7 },
  rowText: { flex: 1, fontSize: 13, fontFamily: "Inter_600SemiBold" },
  count: { fontSize: 12, fontFamily: "Inter_500Medium" },
  leagueRow: { minHeight: 44, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: "row", alignItems: "center", gap: 9 },
  leagueText: { fontSize: 13, fontFamily: "Inter_500Medium" },
});