import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { useBetting } from "@/context/BettingContext";
import { Match, MatchMarket } from "@/data/matches";
import { useColors } from "@/hooks/useColors";

export function OddsButton({ match, market }: { match: Match; market: MatchMarket }) {
  const colors = useColors();
  const { isSelected, toggleSelection } = useBetting();
  const selected = isSelected(match.id, market.id);

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: selected ? colors.accent : colors.input, borderColor: selected ? colors.accent : colors.border }]}
      onPress={() => toggleSelection(match, market)}
      activeOpacity={0.82}
    >
      <Text style={[styles.label, { color: selected ? colors.accentForeground : colors.mutedForeground }]}>{market.label}</Text>
      <Text style={[styles.odds, { color: selected ? colors.accentForeground : colors.foreground }]}>{market.odds.toFixed(2)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { minWidth: 67, minHeight: 43, flex: 1, borderRadius: 6, borderWidth: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 7, paddingVertical: 5 },
  label: { fontSize: 10, fontFamily: "Inter_500Medium" },
  odds: { fontSize: 12, fontFamily: "Inter_700Bold", marginTop: 2 },
});