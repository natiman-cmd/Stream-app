import { Feather } from "@expo/vector-icons";
import React from "react";
import { FlatList, Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCasino } from "@/context/CasinoContext";
import { formatCredits } from "@/data/games";
import { useColors } from "@/hooks/useColors";

export default function ActivityScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { balance, rounds, wins, totalWagered } = useCasino();
  const topPadding = Platform.OS === "web" ? 67 : insets.top + 12;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={rounds}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: topPadding, paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 90) }}
        ListHeaderComponent={
          <View>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>YOUR SESSION</Text>
            <Text style={[styles.title, { color: colors.foreground }]}>Activity</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>A transparent history of your play-money rounds.</Text>
            <View style={[styles.balanceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.balanceTop}>
                <View>
                  <Text style={[styles.label, { color: colors.mutedForeground }]}>CURRENT BALANCE</Text>
                  <Text style={[styles.balance, { color: colors.foreground }]}>{formatCredits(balance)}</Text>
                </View>
                <View style={[styles.balanceIcon, { backgroundColor: `${colors.accent}20` }]}>
                  <Feather name="credit-card" size={22} color={colors.accent} />
                </View>
              </View>
              <View style={styles.metrics}>
                <View><Text style={[styles.metricValue, { color: colors.foreground }]}>{rounds.length}</Text><Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>Rounds</Text></View>
                <View><Text style={[styles.metricValue, { color: colors.success }]}>{wins}</Text><Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>Wins</Text></View>
                <View><Text style={[styles.metricValue, { color: colors.foreground }]}>{totalWagered.toLocaleString()}</Text><Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>Wagered</Text></View>
              </View>
            </View>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Round history</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.row, { borderBottomColor: colors.border }]}>
            <View style={[styles.resultIcon, { backgroundColor: item.won ? `${colors.success}20` : `${colors.destructive}20` }]}>
              <Feather name={item.won ? "check" : "x"} size={17} color={item.won ? colors.success : colors.destructive} />
            </View>
            <View style={styles.rowCopy}>
              <Text style={[styles.gameTitle, { color: colors.foreground }]}>{item.gameTitle}</Text>
              <Text style={[styles.meta, { color: colors.mutedForeground }]}>{item.choice} · Result {item.outcome}</Text>
            </View>
            <View style={styles.rowAmount}>
              <Text style={[styles.amount, { color: item.won ? colors.success : colors.destructive }]}>
                {item.won ? `+${item.payout - item.stake}` : `-${item.stake}`}
              </Text>
              <Text style={[styles.after, { color: colors.mutedForeground }]}>{item.balanceAfter.toLocaleString()}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="activity" size={44} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No rounds yet</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Play a table and your results will show here.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  eyebrow: { marginHorizontal: 20, fontSize: 10, letterSpacing: 2, fontFamily: "Inter_700Bold" },
  title: { marginHorizontal: 20, fontSize: 30, fontFamily: "Inter_700Bold", marginTop: 5 },
  subtitle: { marginHorizontal: 20, fontSize: 13, lineHeight: 19, fontFamily: "Inter_400Regular", marginTop: 5 },
  balanceCard: { margin: 20, marginBottom: 8, borderRadius: 18, borderWidth: 1, padding: 17 },
  balanceTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  label: { fontSize: 10, letterSpacing: 1.4, fontFamily: "Inter_700Bold" },
  balance: { fontSize: 24, fontFamily: "Inter_700Bold", marginTop: 5 },
  balanceIcon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  metrics: { flexDirection: "row", borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#303653", marginTop: 18, paddingTop: 14, justifyContent: "space-between" },
  metricValue: { fontSize: 16, fontFamily: "Inter_700Bold" },
  metricLabel: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 3 },
  sectionTitle: { marginHorizontal: 20, fontSize: 18, fontFamily: "Inter_700Bold", marginTop: 17, marginBottom: 5 },
  row: { marginHorizontal: 20, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: "row", alignItems: "center", gap: 11 },
  resultIcon: { width: 35, height: 35, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  rowCopy: { flex: 1 },
  gameTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  meta: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 3 },
  rowAmount: { alignItems: "flex-end" },
  amount: { fontSize: 13, fontFamily: "Inter_700Bold" },
  after: { fontSize: 10, fontFamily: "Inter_400Regular", marginTop: 3 },
  empty: { alignItems: "center", paddingTop: 60, gap: 9, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 19, fontFamily: "Inter_700Bold" },
  emptyText: { fontSize: 14, textAlign: "center", fontFamily: "Inter_400Regular" },
});