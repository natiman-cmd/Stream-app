import React from "react";
import { Platform, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CategoryRow } from "@/components/CategoryRow";
import { HeroSection } from "@/components/HeroSection";
import { useCatalog } from "@/context/CatalogContext";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { movies } = useCatalog();
  const featuredMovie = movies.find((movie) => movie.isFeatured) ?? movies[0];
  const continueWatching = movies.filter((movie) => movie.progress !== undefined);
  const trending = movies.slice(0, 6);
  const newReleases = movies.slice(-6).reverse();

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom:
            insets.bottom + (Platform.OS === "web" ? 34 : 90),
        }}
      >
        {featuredMovie && <HeroSection movie={featuredMovie} />}
        {continueWatching.length > 0 && (
          <CategoryRow title="Continue Watching" movies={continueWatching} />
        )}
        <CategoryRow title="Trending Now" movies={trending} />
        <CategoryRow title="New Releases" movies={newReleases} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  scroll: {
    flex: 1,
  },
});
