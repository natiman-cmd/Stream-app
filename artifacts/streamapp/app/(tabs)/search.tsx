import { Feather } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
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

import { MovieCard } from "@/components/MovieCard";
import { useCatalog } from "@/context/CatalogContext";
import { useColors } from "@/hooks/useColors";

const GENRES = ["All", "Sci-Fi", "Action", "Drama"];

function HighlightText({
  text,
  query,
  baseColor,
  highlightColor,
}: {
  text: string;
  query: string;
  baseColor: string;
  highlightColor: string;
}) {
  if (!query) {
    return (
      <Text style={{ color: baseColor, fontSize: 11, fontFamily: "Inter_500Medium" }} numberOfLines={1}>
        {text}
      </Text>
    );
  }

  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) {
    return (
      <Text style={{ color: baseColor, fontSize: 11, fontFamily: "Inter_500Medium" }} numberOfLines={1}>
        {text}
      </Text>
    );
  }

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + query.length);
  const after = text.slice(idx + query.length);

  return (
    <Text style={{ fontSize: 11, fontFamily: "Inter_500Medium" }} numberOfLines={1}>
      <Text style={{ color: baseColor }}>{before}</Text>
      <Text style={{ color: highlightColor, fontFamily: "Inter_700Bold" }}>{match}</Text>
      <Text style={{ color: baseColor }}>{after}</Text>
    </Text>
  );
}

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const inputRef = useRef<TextInput>(null);
  const { movies } = useCatalog();

  const topPadding = Platform.OS === "web" ? 67 : insets.top + 12;

  const filtered = movies.filter((m) => {
    const matchesQuery =
      query === "" || m.title.toLowerCase().includes(query.toLowerCase());
    const matchesGenre = selectedGenre === "All" || m.genre === selectedGenre;
    return matchesQuery && matchesGenre;
  });

  const resultLabel =
    query.length > 0 || selectedGenre !== "All"
      ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`
      : `${movies.length} movies`;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.secondary }]}>
          <Feather name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            ref={inputRef}
            style={[styles.input, { color: colors.foreground }]}
            placeholder="Search movies..."
            placeholderTextColor={colors.mutedForeground}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {query.length > 0 && Platform.OS !== "ios" && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Feather name="x" size={18} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.genreRow}>
          {GENRES.map((g) => (
            <TouchableOpacity
              key={g}
              onPress={() => setSelectedGenre(g)}
              style={[
                styles.genrePill,
                {
                  backgroundColor:
                    selectedGenre === g ? colors.primary : colors.secondary,
                },
              ]}
            >
              <Text style={[styles.genreText, { color: colors.foreground }]}>
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.resultCount, { color: colors.mutedForeground }]}>
          {resultLabel}
        </Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        scrollEnabled={!!filtered.length}
        contentContainerStyle={[
          styles.grid,
          {
            paddingBottom:
              insets.bottom + (Platform.OS === "web" ? 34 : 90),
          },
        ]}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <MovieCard movie={item} width={106} height={156} showMeta={false} />
            <HighlightText
              text={item.title}
              query={query}
              baseColor={colors.mutedForeground}
              highlightColor={colors.foreground}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="film" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No results
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Try a different title or genre
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  genreRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  genrePill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  genreText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  resultCount: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginBottom: 8,
  },
  grid: {
    paddingHorizontal: 12,
    paddingTop: 4,
  },
  gridItem: {
    flex: 1,
    margin: 4,
    maxWidth: "33.33%",
    gap: 5,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
});
