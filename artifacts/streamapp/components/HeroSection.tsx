import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { Movie } from "@/data/movies";
import { useColors } from "@/hooks/useColors";

const { width } = Dimensions.get("window");
const HERO_HEIGHT = Platform.OS === "web" ? 380 : 500;

interface Props {
  movie: Movie;
}

export function HeroSection({ movie }: Props) {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { height: HERO_HEIGHT + topPad }]}>
      <Image
        source={movie.poster}
        style={styles.backdrop}
        resizeMode="cover"
      />
      <View style={styles.dimOverlay} />
      <View style={styles.bottomFade} />

      <View style={[styles.content, { paddingTop: topPad + 12 }]}>
        <View style={styles.spacer} />
        <Text style={[styles.genre, { color: colors.primary }]}>
          {movie.genre.toUpperCase()}
        </Text>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.meta}>
          {movie.year} · {movie.duration} · ★ {movie.rating}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.playBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push(`/movie/${movie.id}` as never)}
            activeOpacity={0.8}
          >
            <Feather name="play" size={18} color="#fff" />
            <Text style={styles.playText}>Play</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.infoBtn}
            onPress={() => router.push(`/movie/${movie.id}` as never)}
            activeOpacity={0.8}
          >
            <Feather name="info" size={18} color="#fff" />
            <Text style={styles.infoText}>More Info</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  bottomFade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 220,
    backgroundColor: "rgba(15,15,15,0.85)",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  spacer: { flex: 1 },
  genre: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 2,
    marginBottom: 6,
  },
  title: {
    color: "#ffffff",
    fontSize: 30,
    fontFamily: "Inter_700Bold",
    marginBottom: 6,
  },
  meta: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginBottom: 18,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  playBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 8,
    gap: 8,
  },
  playText: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  infoBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 8,
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  infoText: {
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
});
