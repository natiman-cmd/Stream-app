import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useProperties } from "@/context/PropertyContext";
import { formatPrice, Property } from "@/data/properties";
import { useColors } from "@/hooks/useColors";

export function PropertyCard({ property, compact = false }: { property: Property; compact?: boolean }) {
  const colors = useColors();
  const router = useRouter();
  const { isSaved, toggleSaved } = useProperties();

  return (
    <TouchableOpacity
      style={[styles.card, compact ? styles.compactCard : styles.fullCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => router.push(`/movie/${property.id}`)}
      activeOpacity={0.88}
    >
      <View style={[styles.imageWrap, compact ? styles.compactImage : styles.fullImage]}>
        <Image source={{ uri: property.imageUrl }} style={styles.image} resizeMode="cover" />
        <View style={styles.imageShade} />
        {property.verified && (
          <View style={[styles.verified, { backgroundColor: colors.success }]}>
            <Feather name="check" size={11} color={colors.background} />
            <Text style={[styles.verifiedText, { color: colors.background }]}>Verified</Text>
          </View>
        )}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: "rgba(5,8,18,0.68)" }]}
          onPress={() => toggleSaved(property.id)}
          activeOpacity={0.8}
        >
          <Feather name={isSaved(property.id) ? "heart" : "heart"} size={17} color={isSaved(property.id) ? colors.destructive : colors.foreground} />
        </TouchableOpacity>
      </View>
      <View style={styles.copy}>
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.foreground }]}>{formatPrice(property.price)}</Text>
          <Text style={[styles.type, { color: colors.primary }]}>{property.type}</Text>
        </View>
        <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>{property.title}</Text>
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={13} color={colors.mutedForeground} />
          <Text style={[styles.location, { color: colors.mutedForeground }]} numberOfLines={1}>{property.location}</Text>
        </View>
        <View style={[styles.metaRow, { borderTopColor: colors.border }]}>
          {property.bedrooms > 0 && <Text style={[styles.meta, { color: colors.mutedForeground }]}>{property.bedrooms} bd</Text>}
          <Text style={[styles.meta, { color: colors.mutedForeground }]}>{property.bathrooms} ba</Text>
          <Text style={[styles.meta, { color: colors.mutedForeground }]}>{property.area} m²</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { overflow: "hidden", borderWidth: 1, borderRadius: 17 },
  fullCard: { width: "100%" },
  compactCard: { width: 250 },
  imageWrap: { position: "relative", overflow: "hidden" },
  fullImage: { height: 190 },
  compactImage: { height: 140 },
  image: { width: "100%", height: "100%" },
  imageShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.08)" },
  verified: { position: "absolute", left: 10, top: 10, flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 9 },
  verifiedText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  saveButton: { position: "absolute", right: 10, top: 10, width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  copy: { padding: 13, gap: 5 },
  priceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  price: { fontSize: 16, fontFamily: "Inter_700Bold" },
  type: { fontSize: 10, fontFamily: "Inter_700Bold" },
  title: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  location: { flex: 1, fontSize: 11, fontFamily: "Inter_400Regular" },
  metaRow: { flexDirection: "row", gap: 14, borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 8, marginTop: 4 },
  meta: { fontSize: 11, fontFamily: "Inter_500Medium" },
});