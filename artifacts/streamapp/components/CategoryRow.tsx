import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { MovieCard } from "@/components/MovieCard";
import type { Movie } from "@/data/movies";
import { useColors } from "@/hooks/useColors";

interface Props {
  title: string;
  movies: Movie[];
}

export function CategoryRow({ title, movies }: Props) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={movies.length > 0}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <MovieCard movie={item} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 28,
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  list: {
    paddingHorizontal: 16,
  },
  cardWrapper: {
    marginRight: 10,
  },
});
