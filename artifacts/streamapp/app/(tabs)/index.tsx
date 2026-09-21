import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MatchCard } from "@/components/MatchCard";
import { useBetting } from "@/context/BettingContext";
import { MATCHES, SPORTS, TOP_LEAGUES } from "@/data/matches";
import { useProfile } from "@/context/ProfileContext";
import { useColors } from "@/hooks/useColors";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile } = useProfile();
  const { balance, slip } = useBetting();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 90) }}
      >
        <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 14 }]}>
          <View style={styles.brandRow}>
            <View style={[styles.logo, { backgroundColor: colors.accent }]}><Feather name="activity" size={20} color={colors.accentForeground} /></View>
            <View><Text style={[styles.brand, { color: colors.foreground }]}>nudrub<Text style={{ color: colors.accent }}>bet</Text></Text><Text style={[styles.demo, { color: colors.mutedForeground }]}>DEMO SPORTSBOOK</Text></View>
          </View>
          <TouchableOpacity style={[styles.balance, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => router.push("/(tabs)/profile")}>
            <Feather name="credit-card" size={14} color={colors.accent} />
            <Text style={[styles.balanceText, { color: colors.foreground }]}>{balance.toLocaleString()}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickNav}>
          <TouchableOpacity style={[styles.quickNavItem, { backgroundColor: colors.primary }]}><Feather name="home" size={15} color={colors.primaryForeground} /><Text style={[styles.quickNavText, { color: colors.primaryForeground }]}>Home</Text></TouchableOpacity>
          <TouchableOpacity style={styles.quickNavItem} onPress={() => router.push("/(tabs)/search")}><Feather name="target" size={15} color={colors.mutedForeground} /><Text style={[styles.quickNavText, { color: colors.mutedForeground }]}>Sports</Text></TouchableOpacity>
          <TouchableOpacity style={styles.quickNavItem} onPress={() => router.push("/(tabs)/mylist")}><Feather name="file-text" size={15} color={colors.mutedForeground} /><Text style={[styles.quickNavText, { color: colors.mutedForeground }]}>Bet slip {slip.length ? `(${slip.length})` : ""}</Text></TouchableOpacity>
        </View>

        <View style={[styles.hero, { backgroundColor: colors.primary }]}>
          <View style={styles.heroLine} />
          <Text style={[styles.heroEyebrow, { color: colors.accent }]}>WELCOME TO NUDRUB BET</Text>
          <Text style={[styles.heroTitle, { color: colors.primaryForeground }]}>Match day starts here.</Text>
          <Text style={[styles.heroText, { color: "#dbe6ff" }]}>Follow your leagues, compare odds, and build a demo slip in seconds.</Text>
          <TouchableOpacity style={[styles.heroButton, { backgroundColor: colors.accent }]} onPress={() => router.push("/(tabs)/search")}>
            <Text style={[styles.heroButtonText, { color: colors.accentForeground }]}>Explore sports</Text><Feather name="arrow-right" size={16} color={colors.accentForeground} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Top leagues</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.leagueList}>
          {TOP_LEAGUES.map((league, index) => (
            <TouchableOpacity key={league} style={[styles.leagueChip, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => router.push("/(tabs)/search")}>
              <Feather name={index === 0 ? "award" : "circle"} size={14} color={index === 0 ? colors.accent : colors.mutedForeground} />
              <Text style={[styles.leagueText, { color: colors.foreground }]} numberOfLines={1}>{league.split(" · ")[1] ?? league}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionRow}><Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 0 }]}>Upcoming matches</Text><TouchableOpacity onPress={() => router.push("/(tabs)/search")}><Text style={[styles.seeAll, { color: colors.accent }]}>View all</Text></TouchableOpacity></View>
        <View style={styles.matches}>{MATCHES.slice(0, 3).map((match) => <MatchCard key={match.id} match={match} />)}</View>

        <View style={[styles.responsibleCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.responsibleIcon, { backgroundColor: colors.secondary }]}><Feather name="shield" size={20} color={colors.success} /></View>
          <View style={styles.responsibleCopy}><Text style={[styles.responsibleTitle, { color: colors.foreground }]}>Play responsibly</Text><Text style={[styles.responsibleText, { color: colors.mutedForeground }]}>Set limits, take breaks, and keep betting fun. This app is currently in demo mode.</Text></View>
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
        </View>
        <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>DEMO MODE · NO DEPOSITS · NO WITHDRAWALS · NO CASH PAYOUTS</Text>
        <Text style={[styles.greeting, { color: colors.mutedForeground }]}>Good luck, {profile.name}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  logo: { width: 36, height: 36, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  brand: { fontSize: 20, fontFamily: "Inter_700Bold" },
  demo: { fontSize: 8, letterSpacing: 1.4, fontFamily: "Inter_700Bold", marginTop: 1 },
  balance: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderRadius: 17, paddingHorizontal: 10, paddingVertical: 8 },
  balanceText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  quickNav: { marginHorizontal: 10, backgroundColor: "#10244f", flexDirection: "row", borderRadius: 8, padding: 4, gap: 3 },
  quickNavItem: { flex: 1, minHeight: 36, borderRadius: 5, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5 },
  quickNavText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  hero: { margin: 10, marginTop: 12, borderRadius: 10, overflow: "hidden", padding: 20, minHeight: 185 },
  heroLine: { position: "absolute", width: 260, height: 260, borderRadius: 130, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", right: -90, top: -90 },
  heroEyebrow: { fontSize: 10, letterSpacing: 1.8, fontFamily: "Inter_700Bold" },
  heroTitle: { fontSize: 28, lineHeight: 34, fontFamily: "Inter_700Bold", marginTop: 10, maxWidth: 260 },
  heroText: { fontSize: 13, lineHeight: 19, fontFamily: "Inter_400Regular", marginTop: 6, maxWidth: 295 },
  heroButton: { alignSelf: "flex-start", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 7, flexDirection: "row", alignItems: "center", gap: 7, marginTop: 17 },
  heroButtonText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  sectionTitle: { marginHorizontal: 16, marginTop: 19, marginBottom: 10, fontSize: 17, fontFamily: "Inter_700Bold" },
  leagueList: { paddingHorizontal: 16, gap: 8 },
  leagueChip: { width: 132, borderWidth: 1, borderRadius: 8, padding: 11, gap: 8 },
  leagueText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  sectionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginRight: 16 },
  seeAll: { fontSize: 11, fontFamily: "Inter_700Bold" },
  matches: { marginHorizontal: 10 },
  responsibleCard: { margin: 16, borderWidth: 1, borderRadius: 12, padding: 13, flexDirection: "row", alignItems: "center", gap: 10 },
  responsibleIcon: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  responsibleCopy: { flex: 1, gap: 3 },
  responsibleTitle: { fontSize: 13, fontFamily: "Inter_700Bold" },
  responsibleText: { fontSize: 11, lineHeight: 16, fontFamily: "Inter_400Regular" },
  disclaimer: { textAlign: "center", fontSize: 9, letterSpacing: 0.8, fontFamily: "Inter_600SemiBold" },
  greeting: { textAlign: "center", fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 8 },
});