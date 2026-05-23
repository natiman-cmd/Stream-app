import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
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
import { MOVIES } from "@/data/movies";
import { useColors } from "@/hooks/useColors";

const GENRES = ["All", "Sci-Fi", "Action", "Drama"];

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  const topPadding = Platform.OS === "web" ? 67 : insets.top + 12;

  const filtered = MOVIES.filter((m) => {
    const matchesQuery =
      query === "" || m.title.toLowerCase().includes(query.toLowerCase());
    const matchesGenre = selectedGenre === "All" || m.genre === selectedGenre;
    return matchesQuery && matchesGenre;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <View
          style={[styles.searchBar, { backgroundColor: colors.secondary }]}
        >
          <Feather name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            placeholder="Search movies..."
            placeholderTextColor={colors.mutedForeground}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Feather name="x" size={18} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.genres}>
          {GENRES.map((g) => (
            <TouchableOpacity
              key={g}
              onPress={() => setSelectedGenre(g)}
              style={[
                styles.genrePill,
                {
                  backgroundColor:
                    selectedGenre === g
                      ? colors.primary
                      : colors.secondary,
                },
              ]}
            >
              <Text style={[styles.genreText, { color: colors.foreground }]}>
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.grid,
          {
            paddingBottom:
              insets.bottom + (Platform.OS === "web" ? 34 : 90),
          },
        ]}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <MovieCard movie={item} width={106} height={156} />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="film" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No movies found
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
    paddingBottom: 12,
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
  genres: {
    flexDirection: "row",
    gap: 8,
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
  grid: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  gridItem: {
    flex: 1,
    margin: 4,
    maxWidth: "33.33%",
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
});
