import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { Movie } from "@/data/movies";
import { useColors } from "@/hooks/useColors";

interface Props {
  movie: Movie;
  width?: number;
  height?: number;
  showMeta?: boolean;
}

export function MovieCard({ movie, width = 110, height = 160, showMeta = true }: Props) {
  const colors = useColors();
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/movie/${movie.id}` as never)}
      activeOpacity={0.8}
      style={{ width }}
    >
      <Image
        source={movie.poster}
        style={[styles.poster, { width, height, borderRadius: colors.radius }]}
        resizeMode="cover"
      />
      {movie.progress !== undefined && (
        <View style={[styles.progressBg, { width }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${movie.progress * 100}%` as `${number}%`,
                backgroundColor: colors.primary,
              },
            ]}
          />
        </View>
      )}
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
  progressBg: {
    height: 3,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 2,
    marginTop: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
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
