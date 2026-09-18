import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Platform, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCasino } from "@/context/CasinoContext";
import { formatCredits, getGame } from "@/data/games";
import { useColors } from "@/hooks/useColors";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(value));

export default function GameDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const game = getGame(id);
  const { balance, playRound } = useCasino();
  const [stake, setStake] = useState(game?.minStake ?? 10);
  const [choice, setChoice] = useState(game?.options[0] ?? "");
  const [error, setError] = useState("");
  const [roundId, setRoundId] = useState<string | null>(null);

  const round = useMemo(() => undefined, []);
  if (!game) {
    return <View style={[styles.notFound, { backgroundColor: colors.background }]}><Text style={{ color: colors.foreground }}>Game not found</Text></View>;
  }

  const result = roundId;
  const lastRound = result ? undefined : undefined;

  const handlePlay = () => {
    const next = playRound(game, stake, choice);
    if (!next.ok) {
      setError(next.error);
      return;
    }
    setError("");
    setRoundId(next.round.id);
    Haptics.notificationAsync(next.round.won ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning);
  };

  const handleShare = () => {
    void Share.share({ message: `I’m playing ${game.title} in Neon Stakes — a play-money casino demo.` });
  };

  const suggestedStakes = Array.from(new Set([game.minStake, game.minStake * 2, game.minStake * 5, game.maxStake])).filter((value) => value <= game.maxStake);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 36 }}>
        <View style={[styles.top, { backgroundColor: `${game.accent}18` }]}>
          <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.background }]} onPress={() => router.back()}>
            <Feather name="arrow-left" size={21} color={colors.foreground} />
          </TouchableOpacity>
          <View style={[styles.bigIcon, { backgroundColor: `${game.accent}28` }]}>
            <Feather name={game.icon} size={55} color={game.accent} />
          </View>
          <Text style={[styles.category, { color: game.accent }]}>{game.category.toUpperCase()}</Text>
          <Text style={[styles.title, { color: colors.foreground }]}>{game.title}</Text>
          <Text style={[styles.tagline, { color: colors.mutedForeground }]}>{game.tagline}</Text>
        </View>

        <View style={styles.content}>
          <View style={[styles.balanceBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View><Text style={[styles.balanceLabel, { color: colors.mutedForeground }]}>YOUR BALANCE</Text><Text style={[styles.balance, { color: colors.foreground }]}>{formatCredits(balance)}</Text></View>
            <TouchableOpacity onPress={handleShare}><Feather name="share-2" size={19} color={colors.mutedForeground} /></TouchableOpacity>
          </View>

          <Text style={[styles.description, { color: colors.mutedForeground }]}>{game.description}</Text>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Choose your call</Text>
          <View style={styles.options}>
            {game.options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.option, { backgroundColor: choice === option ? colors.primary : colors.secondary, borderColor: choice === option ? colors.primary : colors.border }]}
                onPress={() => { setChoice(option); setError(""); }}
                activeOpacity={0.82}
              >
                <Text style={[styles.optionText, { color: choice === option ? colors.primaryForeground : colors.foreground }]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.stakeHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Stake</Text>
            <Text style={[styles.range, { color: colors.mutedForeground }]}>{game.minStake}–{game.maxStake} credits</Text>
          </View>
          <View style={styles.stakeRow}>
            {suggestedStakes.map((value) => (
              <TouchableOpacity key={value} onPress={() => { setStake(value); setError(""); }} style={[styles.stakeChip, { backgroundColor: stake === value ? colors.accent : colors.secondary }]} activeOpacity={0.8}>
                <Text style={[styles.stakeText, { color: stake === value ? colors.accentForeground : colors.foreground }]}>{value}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={[styles.playButton, { backgroundColor: colors.primary }]} onPress={handlePlay} activeOpacity={0.86}>
            <Feather name="zap" size={19} color={colors.primaryForeground} />
            <Text style={[styles.playText, { color: colors.primaryForeground }]}>Play for {stake} credits</Text>
          </TouchableOpacity>
          {error ? <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text> : null}

          {lastRound && <Text>{lastRound}</Text>}
          {result && (
            <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.resultIcon, { backgroundColor: colors.success }]}>
                <Feather name="check" size={22} color={colors.primaryForeground} />
              </View>
              <Text style={[styles.resultTitle, { color: colors.foreground }]}>Round complete</Text>
              <Text style={[styles.resultText, { color: colors.mutedForeground }]}>Check Activity for the settled result.</Text>
              <Text style={[styles.resultMeta, { color: colors.mutedForeground }]}>Round {result.slice(-6)} · just now</Text>
            </View>
          )}
          <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>Play-money only. No deposits, withdrawals, cash-equivalent prizes, or payment methods are supported.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  top: { minHeight: 330, alignItems: "center", justifyContent: "flex-end", paddingHorizontal: 24, paddingBottom: 30, paddingTop: Platform.OS === "web" ? 67 : 30 },
  backButton: { position: "absolute", top: Platform.OS === "web" ? 67 : 45, left: 18, width: 41, height: 41, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  bigIcon: { width: 126, height: 126, borderRadius: 40, alignItems: "center", justifyContent: "center", marginBottom: 24 },
  category: { fontSize: 10, letterSpacing: 2, fontFamily: "Inter_700Bold" },
  title: { fontSize: 30, textAlign: "center", fontFamily: "Inter_700Bold", marginTop: 8 },
  tagline: { fontSize: 14, fontFamily: "Inter_400Regular", marginTop: 6 },
  content: { padding: 20 },
  balanceBar: { padding: 15, borderRadius: 15, borderWidth: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  balanceLabel: { fontSize: 10, letterSpacing: 1.3, fontFamily: "Inter_700Bold" },
  balance: { fontSize: 17, fontFamily: "Inter_700Bold", marginTop: 3 },
  description: { fontSize: 15, lineHeight: 23, fontFamily: "Inter_400Regular", marginTop: 20 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold", marginTop: 22 },
  options: { flexDirection: "row", flexWrap: "wrap", gap: 9, marginTop: 11 },
  option: { minWidth: 92, flex: 1, borderRadius: 12, borderWidth: 1, paddingVertical: 14, alignItems: "center" },
  optionText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  stakeHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  range: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 22 },
  stakeRow: { flexDirection: "row", gap: 8, marginTop: 11 },
  stakeChip: { flex: 1, borderRadius: 11, paddingVertical: 12, alignItems: "center" },
  stakeText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  playButton: { borderRadius: 14, minHeight: 54, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, marginTop: 22 },
  playText: { fontSize: 15, fontFamily: "Inter_700Bold" },
  error: { fontSize: 12, textAlign: "center", fontFamily: "Inter_500Medium", marginTop: 10 },
  resultCard: { borderRadius: 17, borderWidth: 1, alignItems: "center", padding: 20, marginTop: 20 },
  resultIcon: { width: 43, height: 43, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  resultTitle: { fontSize: 17, fontFamily: "Inter_700Bold", marginTop: 10 },
  resultText: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 5 },
  resultMeta: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 9 },
  disclaimer: { textAlign: "center", fontSize: 11, lineHeight: 17, fontFamily: "Inter_400Regular", marginTop: 24 },
});