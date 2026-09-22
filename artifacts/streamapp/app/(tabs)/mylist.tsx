import { Feather } from "@expo/vector-icons";
import React from "react";
import { FlatList, Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BetSlip } from "@/components/BetSlip";
import { useBetting } from "@/context/BettingContext";
import { useColors } from "@/hooks/useColors";

export default function BetsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { history } = useBetting();
  const topPadding = Platform.OS === "web" ? 67 : insets.top + 12;

  return (
    <FlatList
      style={[styles.container, { backgroundColor: colors.background }]}
      data={history}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: topPadding, paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 90) }}
      ListHeaderComponent={
        <View>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>YOUR PICKS</Text>
          <Text style={[styles.title, { color: colors.foreground }]}>Bets</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Review your selections, place a demo ticket, and see your history.</Text>
          <BetSlip />
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Bet history</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={[styles.historyRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.historyIcon, { backgroundColor: colors.secondary }]}><Feather name="clock" size={17} color={colors.accent} /></View>
          <View style={styles.historyCopy}>
            <Text style={[styles.historyTitle, { color: colors.foreground }]}>{item.selections.length}-selection demo ticket</Text>
            <Text style={[styles.historyMeta, { color: colors.mutedForeground }]}>ETB {item.stake} stake · {item.potentialReturn.toFixed(2)} potential return</Text>
          </View>
          <Text style={[styles.pending, { color: colors.accent }]}>PENDING</Text>
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Feather name="file-text" size={40} color={colors.mutedForeground} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No wagers yet</Text>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Your placed tickets will appear here.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  eyebrow: { fontSize: 10, letterSpacing: 2, fontFamily: "Inter_700Bold" },
  title: { fontSize: 30, fontFamily: "Inter_700Bold", marginTop: 5 },
  subtitle: { fontSize: 13, lineHeight: 19, fontFamily: "Inter_400Regular", marginTop: 5, marginBottom: 18 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", marginTop: 24, marginBottom: 10 },
  historyRow: { borderWidth: 1, borderRadius: 11, padding: 12, flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  historyIcon: { width: 35, height: 35, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  historyCopy: { flex: 1, gap: 3 },
  historyTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  historyMeta: { fontSize: 10, fontFamily: "Inter_400Regular" },
  pending: { fontSize: 9, letterSpacing: 0.8, fontFamily: "Inter_700Bold" },
  empty: { alignItems: "center", gap: 8, paddingTop: 35 },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  emptyText: { fontSize: 13, fontFamily: "Inter_400Regular" },
});