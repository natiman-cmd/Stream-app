import React from "react";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CasinoGameCard } from "@/components/CasinoGameCard";
import { useCasino, DAILY_BONUS } from "@/context/CasinoContext";
import { formatCredits, GAMES } from "@/data/games";
import { useProfile } from "@/context/ProfileContext";
import { useColors } from "@/hooks/useColors";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile } = useProfile();
  const { balance, rounds, canClaimBonus, claimBonus } = useCasino();
  const colors = useColors();
  const featuredGame = GAMES[2];
  const quickGames = GAMES.filter((game) => game.category === "Quick Play");
  const recent = rounds.slice(0, 3);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom:
            insets.bottom + (Platform.OS === "web" ? 34 : 90),
        }}
      >
        <View style={[styles.header, { paddingTop: Platform.OS === "web" ? 67 : insets.top + 20 }]}>
          <View>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>WELCOME BACK</Text>
            <Text style={[styles.greeting, { color: colors.foreground }]}>Hey, {profile.name}</Text>
          </View>
          <View style={[styles.balancePill, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="credit-card" size={15} color={colors.accent} />
            <Text style={[styles.balanceText, { color: colors.foreground }]}>{balance.toLocaleString()}</Text>
          </View>
        </View>

        <View style={[styles.hero, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.heroGlow} />
          <Text style={[styles.heroEyebrow, { color: featuredGame.accent }]}>FEATURED TABLE</Text>
          <Text style={[styles.heroTitle, { color: colors.foreground }]}>{featuredGame.title}</Text>
          <Text style={[styles.heroText, { color: colors.mutedForeground }]}>{featuredGame.tagline}</Text>
          <TouchableOpacity
            style={[styles.heroButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push(`/movie/${featuredGame.id}`)}
            activeOpacity={0.85}
          >
            <Feather name="target" size={17} color={colors.primaryForeground} />
            <Text style={[styles.heroButtonText, { color: colors.primaryForeground }]}>Play featured</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Your wallet</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.mutedForeground }]}>Play-money balance</Text>
          </View>
          {canClaimBonus && (
            <TouchableOpacity onPress={claimBonus} style={[styles.bonusButton, { backgroundColor: colors.secondary }]} activeOpacity={0.8}>
              <Feather name="gift" size={15} color={colors.accent} />
              <Text style={[styles.bonusText, { color: colors.accent }]}>+{DAILY_BONUS}</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={[styles.walletCard, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.walletLabel, { color: colors.mutedForeground }]}>AVAILABLE CREDITS</Text>
          <Text style={[styles.walletBalance, { color: colors.foreground }]}>{formatCredits(balance)}</Text>
          <Text style={[styles.walletNote, { color: colors.mutedForeground }]}>No deposits · No cash prizes · Just for fun</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick play</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {quickGames.map((game) => <CasinoGameCard key={game.id} game={game} compact />)}
        </ScrollView>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent rounds</Text>
        {recent.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="activity" size={22} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Your latest rounds will appear here.</Text>
          </View>
        ) : recent.map((round) => (
          <View key={round.id} style={[styles.roundRow, { borderBottomColor: colors.border }]}>
            <View style={[styles.roundIcon, { backgroundColor: round.won ? `${colors.success}20` : `${colors.destructive}20` }]}>
              <Feather name={round.won ? "arrow-up-right" : "arrow-down-right"} size={16} color={round.won ? colors.success : colors.destructive} />
            </View>
            <View style={styles.roundCopy}>
              <Text style={[styles.roundTitle, { color: colors.foreground }]}>{round.gameTitle}</Text>
              <Text style={[styles.roundMeta, { color: colors.mutedForeground }]}>{round.choice} · {round.outcome}</Text>
            </View>
            <Text style={[styles.roundAmount, { color: round.won ? colors.success : colors.destructive }]}>
              {round.won ? `+${round.payout - round.stake}` : `-${round.stake}`}
            </Text>
          </View>
        ))}
        <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>NEON STAKES IS A PLAY-MONEY DEMO. CREDITS HAVE NO MONETARY VALUE.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eyebrow: { fontSize: 10, letterSpacing: 2, fontFamily: "Inter_700Bold" },
  greeting: { fontSize: 28, fontFamily: "Inter_700Bold", marginTop: 4 },
  balancePill: { flexDirection: "row", alignItems: "center", gap: 7, borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 9 },
  balanceText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  hero: { marginHorizontal: 20, padding: 22, borderRadius: 22, borderWidth: 1, overflow: "hidden", minHeight: 190 },
  heroGlow: { position: "absolute", width: 160, height: 160, borderRadius: 80, backgroundColor: "rgba(255,204,102,0.12)", right: -30, top: -40 },
  heroEyebrow: { fontSize: 10, letterSpacing: 2, fontFamily: "Inter_700Bold" },
  heroTitle: { fontSize: 27, fontFamily: "Inter_700Bold", marginTop: 12 },
  heroText: { fontSize: 14, fontFamily: "Inter_400Regular", marginTop: 5 },
  heroButton: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 12, paddingHorizontal: 15, paddingVertical: 11, marginTop: 20 },
  heroButtonText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  sectionHeader: { marginHorizontal: 20, marginTop: 26, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { marginHorizontal: 20, marginTop: 24, fontSize: 19, fontFamily: "Inter_700Bold" },
  sectionSubtitle: { marginTop: 3, fontSize: 12, fontFamily: "Inter_400Regular" },
  bonusButton: { flexDirection: "row", gap: 6, alignItems: "center", borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8 },
  bonusText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  walletCard: { marginHorizontal: 20, marginTop: 12, padding: 18, borderRadius: 18 },
  walletLabel: { fontSize: 10, letterSpacing: 1.5, fontFamily: "Inter_700Bold" },
  walletBalance: { fontSize: 25, fontFamily: "Inter_700Bold", marginTop: 7 },
  walletNote: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 7 },
  horizontalList: { gap: 12, paddingHorizontal: 20, paddingTop: 12 },
  emptyCard: { marginHorizontal: 20, marginTop: 12, borderRadius: 16, borderWidth: 1, padding: 20, alignItems: "center", gap: 8 },
  emptyText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  roundRow: { marginHorizontal: 20, paddingVertical: 13, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: "row", alignItems: "center", gap: 10 },
  roundIcon: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  roundCopy: { flex: 1 },
  roundTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  roundMeta: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  roundAmount: { fontSize: 13, fontFamily: "Inter_700Bold" },
  disclaimer: { marginHorizontal: 20, marginTop: 25, fontSize: 9, textAlign: "center", letterSpacing: 0.7, fontFamily: "Inter_500Medium" },
});
