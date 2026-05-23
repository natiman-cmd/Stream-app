import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const MENU_ITEMS: { icon: string; label: string }[] = [
  { icon: "user", label: "Account" },
  { icon: "bell", label: "Notifications" },
  { icon: "download", label: "Downloads" },
  { icon: "settings", label: "Settings" },
  { icon: "help-circle", label: "Help & Support" },
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === "web" ? 67 : insets.top + 12;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingTop: topPadding,
        paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 90),
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileSection}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>A</Text>
        </View>
        <Text style={[styles.name, { color: colors.foreground }]}>Alice</Text>
        <Text style={[styles.plan, { color: colors.primary }]}>
          Premium Plan
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        {MENU_ITEMS.map((item, i) => (
          <TouchableOpacity
            key={item.label}
            style={[
              styles.menuItem,
              i < MENU_ITEMS.length - 1 && {
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: colors.border,
              },
            ]}
            activeOpacity={0.7}
          >
            <Feather
              name={item.icon as keyof typeof Feather.glyphMap}
              size={20}
              color={colors.foreground}
            />
            <Text style={[styles.menuLabel, { color: colors.foreground }]}>
              {item.label}
            </Text>
            <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.signOutBtn, { backgroundColor: colors.card }]}
        activeOpacity={0.7}
      >
        <Text style={[styles.signOutText, { color: colors.destructive }]}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileSection: {
    alignItems: "center",
    paddingVertical: 28,
    gap: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  avatarText: {
    color: "#fff",
    fontSize: 32,
    fontFamily: "Inter_700Bold",
  },
  name: {
    fontSize: 22,
    fontFamily: "Inter_600SemiBold",
  },
  plan: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 15,
    gap: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  signOutBtn: {
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },
  signOutText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
});
