import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MOVIES } from "@/data/movies";
import { useColors } from "@/hooks/useColors";

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const movie = MOVIES.find((m) => m.id === id);

  if (!movie) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground }}>Movie not found</Text>
      </View>
    );
  }

  const handlePlay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 40),
        }}
      >
        <View style={styles.posterContainer}>
          <Image
            source={movie.poster}
            style={styles.poster}
            resizeMode="cover"
          />
          <View style={styles.posterOverlay} />
          <TouchableOpacity
            style={[styles.backBtn, { top: (Platform.OS === "web" ? 67 : insets.top) + 10 }]}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Feather name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

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
              style={[styles.iconBtn, { backgroundColor: colors.secondary }]}
              onPress={handleBookmark}
              activeOpacity={0.8}
            >
              <Feather name="bookmark" size={20} color={colors.foreground} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: colors.secondary }]}
              activeOpacity={0.8}
            >
              <Feather name="share-2" size={20} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.synopsisLabel, { color: colors.foreground }]}>
            Synopsis
          </Text>
          <Text style={[styles.synopsis, { color: colors.mutedForeground }]}>
            {movie.description}
          </Text>
        </View>
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
  synopsisLabel: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    marginTop: 10,
  },
  synopsis: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
  },
});
