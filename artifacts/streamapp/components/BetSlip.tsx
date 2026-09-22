import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useBetting } from "@/context/BettingContext";
import { useColors } from "@/hooks/useColors";

export function BetSlip({ compact = false }: { compact?: boolean }) {
  const colors = useColors();
  const { balance, slip, totalOdds, potentialReturn, removeSelection, placeDemoBet, clearSlip } = useBetting();
  const [stakeText, setStakeText] = useState("10");
  const [submitting, setSubmitting] = useState(false);
  const stake = Number(stakeText) || 0;

  const submit = async () => {
    setSubmitting(true);
    const result = await placeDemoBet(stake);
    setSubmitting(false);
    if (!result.ok) {
      Alert.alert("Bet slip", result.error);
      return;
    }
    setStakeText("10");
    Alert.alert("Wager placed", "Your stake was posted to the wallet.");
  };

  if (!slip.length) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Feather name="file-text" size={28} color={colors.mutedForeground} />
        <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Your bet slip is empty</Text>
        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Tap an odd to add a selection.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Text style={[styles.title, { color: colors.foreground }]}>Bet slip</Text>
          <View style={[styles.count, { backgroundColor: colors.accent }]}><Text style={[styles.countText, { color: colors.accentForeground }]}>{slip.length}</Text></View>
        </View>
        <TouchableOpacity onPress={clearSlip}><Feather name="trash-2" size={17} color={colors.mutedForeground} /></TouchableOpacity>
      </View>
      {slip.map((selection) => (
        <View key={selection.id} style={[styles.selection, { borderBottomColor: colors.border }]}>
          <View style={styles.selectionCopy}>
            <Text style={[styles.league, { color: colors.mutedForeground }]} numberOfLines={1}>{selection.league}</Text>
            <Text style={[styles.match, { color: colors.foreground }]} numberOfLines={1}>{selection.matchName}</Text>
            <Text style={[styles.pick, { color: colors.primary }]}>Pick {selection.selection}</Text>
          </View>
          <Text style={[styles.odds, { color: colors.accent }]}>{selection.odds.toFixed(2)}</Text>
          <TouchableOpacity onPress={() => removeSelection(selection.id)} style={styles.remove}>
            <Feather name="x" size={14} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>
      ))}
      <View style={styles.summary}>
        <View><Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Total odds</Text><Text style={[styles.summaryValue, { color: colors.foreground }]}>{totalOdds.toFixed(2)}</Text></View>
        <View><Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Potential return</Text><Text style={[styles.summaryValue, { color: colors.success }]}>ETB {(stake * potentialReturn).toFixed(2)}</Text></View>
      </View>
      <View style={styles.stakeRow}>
        <Text style={[styles.stakeLabel, { color: colors.foreground }]}>Demo stake</Text>
        <View style={[styles.inputWrap, { backgroundColor: colors.input, borderColor: colors.border }]}>
          <Text style={[styles.currency, { color: colors.mutedForeground }]}>ETB</Text>
          <TextInput value={stakeText} onChangeText={setStakeText} keyboardType="decimal-pad" style={[styles.input, { color: colors.foreground }]} />
        </View>
      </View>
      <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent }]} onPress={submit} activeOpacity={0.84}>
        <Text style={[styles.buttonText, { color: colors.accentForeground }]}>{submitting ? "Submitting…" : "Place wager"}</Text>
        <Feather name="arrow-right" size={16} color={colors.accentForeground} />
      </TouchableOpacity>
      {!compact && <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>Wallet balance {balance.toLocaleString()} ETB · wagers remain compliance-gated</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderWidth: 1, borderRadius: 14, overflow: "hidden", paddingBottom: 13 },
  header: { padding: 13, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { flexDirection: "row", alignItems: "center", gap: 7 },
  title: { fontSize: 17, fontFamily: "Inter_700Bold" },
  count: { width: 21, height: 21, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  countText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  selection: { paddingHorizontal: 13, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: "row", alignItems: "center", gap: 9 },
  selectionCopy: { flex: 1, gap: 2 },
  league: { fontSize: 9, fontFamily: "Inter_400Regular" },
  match: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  pick: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  odds: { fontSize: 14, fontFamily: "Inter_700Bold" },
  remove: { width: 24, height: 24, alignItems: "center", justifyContent: "center" },
  summary: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 13, paddingTop: 13 },
  summaryLabel: { fontSize: 10, fontFamily: "Inter_400Regular" },
  summaryValue: { fontSize: 13, fontFamily: "Inter_700Bold", marginTop: 3 },
  stakeRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 13, marginTop: 13 },
  stakeLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  inputWrap: { width: 116, height: 38, borderRadius: 8, borderWidth: 1, flexDirection: "row", alignItems: "center", paddingHorizontal: 8 },
  currency: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  input: { flex: 1, textAlign: "right", fontSize: 13, fontFamily: "Inter_700Bold", padding: 0 },
  button: { minHeight: 44, marginHorizontal: 13, marginTop: 13, borderRadius: 9, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
  buttonText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  disclaimer: { fontSize: 9, textAlign: "center", marginTop: 10, fontFamily: "Inter_400Regular" },
  empty: { borderWidth: 1, borderRadius: 14, alignItems: "center", padding: 24, gap: 8 },
  emptyTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  emptyText: { fontSize: 12, fontFamily: "Inter_400Regular" },
});