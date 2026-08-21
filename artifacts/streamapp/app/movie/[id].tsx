import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  Platform,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MovieCard } from "@/components/MovieCard";
import { useCatalog } from "@/context/CatalogContext";
import { getPosterSource } from "@/data/movies";
import { useWatchlist } from "@/context/WatchlistContext";
import { useColors } from "@/hooks/useColors";

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const { movies } = useCatalog();

  const movie = movies.find((m) => m.id === id);

  if (!movie) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground }}>Movie not found</Text>
      </View>
    );
  }

  const bookmarked = isInWatchlist(movie.id);

  const moreLikeThis = movies.filter(
    (m) => m.genre === movie.genre && m.id !== movie.id
  );

  const handlePlay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleBookmark = () => {
    toggleWatchlist(movie);
    Haptics.notificationAsync(
      bookmarked
        ? Haptics.NotificationFeedbackType.Warning
        : Haptics.NotificationFeedbackType.Success
    );
  };

  const handleShare = () => {
    Share.share({ message: `Watch ${movie.title} on StreamApp!` });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom:
            insets.bottom + (Platform.OS === "web" ? 34 : 40),
        }}
      >
        {/* Poster */}
        <View style={styles.posterContainer}>
          <Image
            source={getPosterSource(movie)}
            style={styles.poster}
            resizeMode="cover"
          />
          <View style={styles.posterOverlay} />
          <TouchableOpacity
            style={[
              styles.backBtn,
              { top: (Platform.OS === "web" ? 67 : insets.top) + 10 },
            ]}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Feather name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={[styles.genreLabel, { color: colors.primary }]}>
            {movie.genre.toUpperCase()}
          </Text>
          <Text style={[styles.title, { color: colors.foreground }]}>
            {movie.title}
          </Text>
          <Text style={[styles.meta, { color: colors.mutedForeground }]}>
            {movie.year} · {movie.duration} · ★ {movie.rating}
          </Text>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.playBtn, { backgroundColor: colors.primary }]}
              onPress={handlePlay}
              activeOpacity={0.8}
            >
              <Feather name="play" size={20} color="#fff" />
              <Text style={styles.playText}>Play Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.iconBtn,
                {
                  backgroundColor: bookmarked
                    ? colors.primary
                    : colors.secondary,
                },
              ]}
              onPress={handleBookmark}
              activeOpacity={0.8}
            >
              <Feather
                name="bookmark"
                size={20}
                color={bookmarked ? "#fff" : colors.foreground}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: colors.secondary }]}
              onPress={handleShare}
              activeOpacity={0.8}
            >
              <Feather name="share-2" size={20} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          {bookmarked && (
            <View
              style={[
                styles.savedBadge,
                { backgroundColor: "rgba(229, 9, 20, 0.12)" },
              ]}
            >
              <Feather name="check" size={14} color={colors.primary} />
              <Text style={[styles.savedText, { color: colors.primary }]}>
                Saved to My List
              </Text>
            </View>
          )}

          {/* Synopsis */}
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Synopsis
          </Text>
          <Text style={[styles.synopsis, { color: colors.mutedForeground }]}>
            {movie.description}
          </Text>
        </View>

        {/* More Like This */}
        {moreLikeThis.length > 0 && (
          <View style={styles.moreLikeThis}>
            <Text
              style={[styles.sectionTitle, { color: colors.foreground, paddingHorizontal: 20 }]}
            >
              More Like This
            </Text>
            <FlatList
              data={moreLikeThis}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.moreLikeThisList}
              renderItem={({ item }) => (
                <View style={styles.moreLikeThisCard}>
                  <MovieCard movie={item} width={120} height={175} />
                </View>
              )}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  posterContainer: {
    height: 420,
    position: "relative",
  },
  poster: {
    width: "100%",
    height: "100%",
  },
  posterOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  backBtn: {
    position: "absolute",
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    padding: 20,
    gap: 8,
  },
  genreLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 2,
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    marginTop: 2,
  },
  meta: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
    marginBottom: 4,
    alignItems: "center",
  },
  playBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  playText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  iconBtn: {
    width: 50,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  savedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  savedText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    marginTop: 10,
    marginBottom: 2,
  },
  synopsis: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
  },
  moreLikeThis: {
    marginTop: 8,
    paddingBottom: 8,
  },
  moreLikeThisList: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 12,
  },
  moreLikeThisCard: {
    marginRight: 12,
  },
});
