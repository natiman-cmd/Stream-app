import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CasinoGameCard } from "@/components/CasinoGameCard";
import { GAMES } from "@/data/games";
import { useColors } from "@/hooks/useColors";

const CATEGORIES = ["All", "Quick Play", "Featured Table", "High Multiplier"];

export default function GamesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const topPadding = Platform.OS === "web" ? 67 : insets.top + 12;

  const filtered = useMemo(
    () =>
      GAMES.filter((game) => {
        const matchesQuery =
          !query ||
          game.title.toLowerCase().includes(query.toLowerCase()) ||
          game.description.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = category === "All" || game.category === category;
        return matchesQuery && matchesCategory;
      }),
    [query, category],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>THE FLOOR</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>Choose your game</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Every table uses free virtual credits. No deposits, no withdrawals.
        </Text>
        <View style={[styles.searchBar, { backgroundColor: colors.secondary }]}>
          <Feather name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            placeholder="Search games..."
            placeholderTextColor={colors.mutedForeground}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Feather name="x" size={18} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setCategory(item)}
              style={[
                styles.categoryPill,
                { backgroundColor: category === item ? colors.primary : colors.secondary },
              ]}
              activeOpacity={0.8}
            >
              <Text style={[styles.categoryText, { color: category === item ? colors.primaryForeground : colors.foreground }]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
        <Text style={[styles.resultCount, { color: colors.mutedForeground }]}>
          {filtered.length} table{filtered.length === 1 ? "" : "s"} available
        </Text>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 90) }]}
        renderItem={({ item }) => <CasinoGameCard game={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="search" size={44} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No games found</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Try a different search or category.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 8 },
  eyebrow: { fontSize: 10, letterSpacing: 2, fontFamily: "Inter_700Bold" },
  title: { fontSize: 28, fontFamily: "Inter_700Bold", marginTop: 5 },
  subtitle: { fontSize: 13, lineHeight: 19, fontFamily: "Inter_400Regular", marginTop: 6, maxWidth: 330 },
  searchBar: { flexDirection: "row", alignItems: "center", borderRadius: 12, paddingHorizontal: 12, height: 46, gap: 8, marginTop: 18 },
  input: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  categoryList: { gap: 8, paddingTop: 14 },
  categoryPill: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 18 },
  categoryText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  resultCount: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 12, marginBottom: 8 },
  list: { paddingHorizontal: 20, paddingTop: 5 },
  empty: { alignItems: "center", paddingTop: 80, gap: 9 },
  emptyTitle: { fontSize: 19, fontFamily: "Inter_700Bold" },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular" },
});