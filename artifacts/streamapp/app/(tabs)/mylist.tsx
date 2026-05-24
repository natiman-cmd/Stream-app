import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MovieCard } from "@/components/MovieCard";
import { useWatchlist } from "@/context/WatchlistContext";
import { useColors } from "@/hooks/useColors";

export default function MyListScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { watchlist, removeFromWatchlist } = useWatchlist();

  const topPadding = Platform.OS === "web" ? 67 : insets.top + 12;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: topPadding },
      ]}
    >
      <Text style={[styles.title, { color: colors.foreground }]}>My List</Text>

      {watchlist.length === 0 ? (
        <View style={styles.empty}>
          <Feather name="bookmark" size={56} color={colors.mutedForeground} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
            Your list is empty
          </Text>
          <Text
            style={[styles.emptySubtitle, { color: colors.mutedForeground }]}
          >
            Tap the bookmark icon on any movie to save it here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={watchlist}
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
              <TouchableOpacity
                style={[
                  styles.removeBtn,
                  { backgroundColor: colors.secondary },
                ]}
                onPress={() => removeFromWatchlist(item.id)}
                activeOpacity={0.8}
              >
                <Feather name="x" size={12} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    marginBottom: 20,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingBottom: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
  },
  emptySubtitle: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 260,
  },
  grid: {
    paddingTop: 4,
  },
  gridItem: {
    flex: 1,
    margin: 4,
    maxWidth: "33.33%",
    position: "relative",
  },
  removeBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
});
