import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Match } from "@/data/matches";
import { useColors } from "@/hooks/useColors";
import { OddsButton } from "@/components/OddsButton";

export function MatchCard({ match }: { match: Match }) {
  const colors = useColors();
  const router = useRouter();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <TouchableOpacity style={styles.header} onPress={() => router.push(`/movie/${match.id}`)} activeOpacity={0.8}>
        <View style={styles.leagueRow}>
          <Feather name="circle" size={14} color={colors.foreground} />
          <Text style={[styles.league, { color: colors.mutedForeground }]} numberOfLines={1}>{match.league}</Text>
          {match.status === "live" && <Text style={[styles.live, { color: colors.destructive }]}>LIVE</Text>}
        </View>
        <Text style={[styles.time, { color: colors.mutedForeground }]}>{match.startTime}</Text>
      </TouchableOpacity>
      <View style={styles.teamsRow}>
        <View style={styles.teamCopy}>
          <Text style={[styles.teams, { color: colors.foreground }]}>{match.home}</Text>
          <Text style={[styles.teams, { color: colors.foreground }]}>{match.away}</Text>
        </View>
        <Feather name="chevron-right" size={17} color={colors.mutedForeground} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.oddsRow}>
        {match.markets.map((market) => <OddsButton key={market.id} match={match} market={market} />)}
      </ScrollView>
      <TouchableOpacity style={[styles.more, { borderTopColor: colors.border }]} onPress={() => router.push(`/movie/${match.id}`)}>
        <Text style={[styles.moreText, { color: colors.primary }]}>+{Math.max(0, match.markets.length - 3)} side bets</Text>
        <Feather name="chevron-right" size={13} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 10, overflow: "hidden", marginBottom: 10 },
  header: { paddingHorizontal: 11, paddingTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  leagueRow: { flexDirection: "row", alignItems: "center", gap: 6, flex: 1 },
  league: { flex: 1, fontSize: 10, fontFamily: "Inter_500Medium" },
  live: { fontSize: 9, fontFamily: "Inter_700Bold", letterSpacing: 1 },
  time: { fontSize: 10, fontFamily: "Inter_400Regular" },
  teamsRow: { paddingHorizontal: 11, paddingTop: 8, paddingBottom: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  teamCopy: { gap: 4 },
  teams: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  oddsRow: { paddingHorizontal: 8, gap: 5, paddingBottom: 9 },
  more: { borderTopWidth: StyleSheet.hairlineWidth, paddingHorizontal: 11, paddingVertical: 8, flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 4 },
  moreText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
});