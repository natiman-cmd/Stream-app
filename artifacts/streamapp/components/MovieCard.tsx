import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { getPosterSource, type Movie } from "@/data/movies";
import { useColors } from "@/hooks/useColors";

interface Props {
  movie: Movie;
  width?: number;
  height?: number;
  showMeta?: boolean;
}

export function MovieCard({
  movie,
  width = 110,
  height = 160,
  showMeta = true,
}: Props) {
  const colors = useColors();
  const router = useRouter();

  const percent =
    movie.progress !== undefined
      ? Math.round(movie.progress * 100)
      : null;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/movie/${movie.id}` as never)}
      activeOpacity={0.8}
      style={{ width }}
    >
      <View style={{ width, height, borderRadius: colors.radius, overflow: "hidden" }}>
        <Image
          source={getPosterSource(movie)}
          style={[styles.poster, { width, height }]}
          resizeMode="cover"
        />

        {percent !== null && (
          <>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${percent}%` as `${number}%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>

            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={styles.badgeText}>{percent}%</Text>
            </View>
          </>
        )}
      </View>

      {showMeta && (
        <View style={[styles.meta, { width }]}>
          <Text
            style={[styles.title, { color: colors.foreground }]}
            numberOfLines={1}
          >
            {movie.title}
          </Text>
          <View style={styles.subRow}>
            <Text style={[styles.genre, { color: colors.mutedForeground }]}>
              {movie.genre}
            </Text>
            <View style={styles.ratingRow}>
              <Text style={[styles.star, { color: colors.primary }]}>★</Text>
              <Text style={[styles.rating, { color: colors.mutedForeground }]}>
                {movie.rating}
              </Text>
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  poster: {
    backgroundColor: "#1c1c1e",
  },
  progressBarBg: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  progressBarFill: {
    height: 4,
  },
  badge: {
    position: "absolute",
    top: 7,
    right: 7,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.3,
  },
  meta: {
    marginTop: 6,
    gap: 3,
  },
  title: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  subRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  genre: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  star: {
    fontSize: 11,
  },
  rating: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
});
