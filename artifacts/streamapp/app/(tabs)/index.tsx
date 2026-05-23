import React from "react";
import { Platform, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CategoryRow } from "@/components/CategoryRow";
import { HeroSection } from "@/components/HeroSection";
import {
  CONTINUE_WATCHING,
  FEATURED_MOVIE,
  NEW_RELEASES,
  TRENDING,
} from "@/data/movies";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

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
        <HeroSection movie={FEATURED_MOVIE} />
        {CONTINUE_WATCHING.length > 0 && (
          <CategoryRow title="Continue Watching" movies={CONTINUE_WATCHING} />
        )}
        <CategoryRow title="Trending Now" movies={TRENDING} />
        <CategoryRow title="New Releases" movies={NEW_RELEASES} />
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
