import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { CasinoGame } from "@/data/games";
import { useColors } from "@/hooks/useColors";

export function CasinoGameCard({
  game,
  compact = false,
}: {
  game: CasinoGame;
  compact?: boolean;
}) {
  const colors = useColors();
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        compact ? styles.compactCard : styles.fullCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={() => router.push(`/movie/${game.id}`)}
      activeOpacity={0.84}
    >
      <View style={[styles.iconWrap, { backgroundColor: `${game.accent}20` }]}>
        <Feather name={game.icon} size={compact ? 22 : 28} color={game.accent} />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.category, { color: game.accent }]}>{game.category.toUpperCase()}</Text>
        <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
          {game.title}
        </Text>
        {!compact && (
          <Text style={[styles.description, { color: colors.mutedForeground }]} numberOfLines={2}>
            {game.description}
          </Text>
        )}
        <Text style={[styles.payout, { color: colors.foreground }]}>{game.payoutLabel}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  fullCard: {
    minHeight: 112,
  },
  compactCard: {
    width: 250,
    minHeight: 92,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: {
    flex: 1,
    gap: 3,
  },
  category: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  description: {
    fontSize: 12,
    lineHeight: 17,
    fontFamily: "Inter_400Regular",
  },
  payout: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    marginTop: 2,
  },
});