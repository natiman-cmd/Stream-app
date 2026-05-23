import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import type { Movie } from "@/data/movies";
import { useColors } from "@/hooks/useColors";

interface Props {
  movie: Movie;
  width?: number;
  height?: number;
}

export function MovieCard({ movie, width = 110, height = 160 }: Props) {
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
});
