import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MatchCard } from "@/components/MatchCard";
import { MATCHES, SPORTS, Sport } from "@/data/matches";
import { useColors } from "@/hooks/useColors";

const FILTERS = ["All", ...SPORTS.map((sport) => sport.name)];

export default function SportsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const topPadding = Platform.OS === "web" ? 67 : insets.top + 12;
  const filtered = useMemo(() => MATCHES.filter((match) => {
    const text = `${match.home} ${match.away} ${match.league}`.toLowerCase();
    return (!query || text.includes(query.toLowerCase())) && (filter === "All" || match.sport === filter);
  }), [query, filter]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MatchCard match={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 90) }]}
        ListHeaderComponent={
          <View style={[styles.header, { paddingTop: topPadding }]}>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>SPORTSBOOK</Text>
            <Text style={[styles.title, { color: colors.foreground }]}>Find your odds</Text>
            <View style={[styles.search, { backgroundColor: colors.input, borderColor: colors.border }]}>
              <Feather name="search" size={17} color={colors.mutedForeground} />
              <TextInput value={query} onChangeText={setQuery} placeholder="Search teams or leagues" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground }]} />
              {query ? <TouchableOpacity onPress={() => setQuery("")}><Feather name="x" size={17} color={colors.mutedForeground} /></TouchableOpacity> : null}
            </View>
            <FlatList
              horizontal
              data={FILTERS}
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterList}
              renderItem={({ item }) => <TouchableOpacity onPress={() => setFilter(item)} style={[styles.filter, { backgroundColor: filter === item ? colors.accent : colors.secondary }]}><Text style={[styles.filterText, { color: filter === item ? colors.accentForeground : colors.foreground }]}>{item}</Text></TouchableOpacity>}
            />
            <View style={styles.resultRow}><Text style={[styles.result, { color: colors.mutedForeground }]}>{filtered.length} matches available</Text><Text style={[styles.demo, { color: colors.accent }]}>DEMO ODDS</Text></View>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Upcoming matches</Text>
          </View>
        }
        ListEmptyComponent={<View style={styles.empty}><Feather name="search" size={42} color={colors.mutedForeground} /><Text style={[styles.emptyTitle, { color: colors.foreground }]}>No matches found</Text><Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Try a different team, league, or sport.</Text></View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingHorizontal: 10 },
  header: { paddingHorizontal: 6, paddingBottom: 8 },
  eyebrow: { fontSize: 10, letterSpacing: 2, fontFamily: "Inter_700Bold" },
  title: { fontSize: 28, fontFamily: "Inter_700Bold", marginTop: 5 },
  search: { height: 45, borderRadius: 8, borderWidth: 1, paddingHorizontal: 12, marginTop: 16, flexDirection: "row", alignItems: "center", gap: 8 },
  input: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  filterList: { gap: 7, paddingTop: 12 },
  filter: { borderRadius: 7, paddingHorizontal: 12, paddingVertical: 8 },
  filterText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  resultRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 14, alignItems: "center" },
  result: { fontSize: 11, fontFamily: "Inter_400Regular" },
  demo: { fontSize: 9, letterSpacing: 1, fontFamily: "Inter_700Bold" },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold", marginTop: 15, marginBottom: 8 },
  empty: { alignItems: "center", paddingTop: 70, gap: 8 },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  emptyText: { fontSize: 13, fontFamily: "Inter_400Regular" },
});