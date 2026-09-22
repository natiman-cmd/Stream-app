import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Platform, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BetSlip } from "@/components/BetSlip";
import { OddsButton } from "@/components/OddsButton";
import { useBetting } from "@/context/BettingContext";
import { getMatch } from "@/data/matches";
import { useColors } from "@/hooks/useColors";

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const match = getMatch(id);
  const { slip } = useBetting();

  if (!match) {
    return <View style={[styles.notFound, { backgroundColor: colors.background }]}><Text style={{ color: colors.foreground }}>Match not found</Text></View>;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 36 }}>
        <View style={[styles.hero, { backgroundColor: colors.primary }]}>
          <TouchableOpacity style={[styles.back, { backgroundColor: colors.background }]} onPress={() => router.back()}><Feather name="arrow-left" size={20} color={colors.foreground} /></TouchableOpacity>
          <Text style={[styles.sport, { color: colors.accent }]}>{match.sport.toUpperCase()} · {match.status === "live" ? "LIVE" : "UPCOMING"}</Text>
          <Text style={[styles.league, { color: "#dbe6ff" }]}>{match.league}</Text>
          <View style={styles.teamBlock}><Text style={[styles.team, { color: colors.primaryForeground }]}>{match.home}</Text><Text style={[styles.vs, { color: "#b7c9f2" }]}>VS</Text><Text style={[styles.team, { color: colors.primaryForeground }]}>{match.away}</Text></View>
          <Text style={[styles.time, { color: "#dbe6ff" }]}>{match.startTime}</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.sectionRow}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>Match result and markets</Text><TouchableOpacity onPress={() => Share.share({ message: `${match.home} vs ${match.away} on Nudrub Bet` })}><Feather name="share-2" size={18} color={colors.mutedForeground} /></TouchableOpacity></View>
          <Text style={[styles.helper, { color: colors.mutedForeground }]}>Tap an odd to add it to your bet slip. One selection per match.</Text>
          <View style={styles.marketGrid}>{match.markets.map((market) => <OddsButton key={market.id} match={match} market={market} />)}</View>
          <View style={[styles.slipNotice, { backgroundColor: colors.secondary }]}>
            <Feather name="file-text" size={17} color={colors.accent} />
            <Text style={[styles.slipNoticeText, { color: colors.foreground }]}>{slip.length ? `${slip.length} selection${slip.length === 1 ? "" : "s"} in your bet slip` : "Your bet slip is empty"}</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/mylist")}><Text style={[styles.openSlip, { color: colors.accent }]}>Open</Text></TouchableOpacity>
          </View>
          <BetSlip compact />
          <View style={[styles.responsible, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="shield" size={18} color={colors.success} />
            <View style={styles.responsibleCopy}><Text style={[styles.responsibleTitle, { color: colors.foreground }]}>Responsible gambling</Text><Text style={[styles.responsibleText, { color: colors.mutedForeground }]}>Set a limit before you play, take breaks, and never chase losses. Wallet actions are reviewed manually.</Text></View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  hero: { minHeight: 280, alignItems: "center", justifyContent: "flex-end", padding: 24, paddingTop: Platform.OS === "web" ? 67 : 30 },
  back: { position: "absolute", top: Platform.OS === "web" ? 67 : 42, left: 17, width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  sport: { fontSize: 10, letterSpacing: 1.8, fontFamily: "Inter_700Bold" },
  league: { fontSize: 12, fontFamily: "Inter_500Medium", marginTop: 8 },
  teamBlock: { alignItems: "center", gap: 7, marginTop: 24 },
  team: { fontSize: 23, textAlign: "center", fontFamily: "Inter_700Bold" },
  vs: { fontSize: 10, letterSpacing: 2, fontFamily: "Inter_700Bold" },
  time: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 14 },
  content: { padding: 16 },
  sectionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  helper: { fontSize: 12, lineHeight: 18, fontFamily: "Inter_400Regular", marginTop: 5 },
  marketGrid: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 15 },
  slipNotice: { borderRadius: 9, padding: 11, flexDirection: "row", alignItems: "center", gap: 8, marginTop: 18 },
  slipNoticeText: { flex: 1, fontSize: 12, fontFamily: "Inter_600SemiBold" },
  openSlip: { fontSize: 11, fontFamily: "Inter_700Bold" },
  responsible: { marginTop: 18, borderWidth: 1, borderRadius: 12, padding: 12, flexDirection: "row", gap: 9 },
  responsibleCopy: { flex: 1, gap: 3 },
  responsibleTitle: { fontSize: 12, fontFamily: "Inter_700Bold" },
  responsibleText: { fontSize: 11, lineHeight: 16, fontFamily: "Inter_400Regular" },
});