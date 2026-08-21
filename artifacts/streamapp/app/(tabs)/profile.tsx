import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useProfile } from "@/context/ProfileContext";
import { useCatalog } from "@/context/CatalogContext";
import { useWatchlist } from "@/context/WatchlistContext";
import { useColors } from "@/hooks/useColors";

const MENU_ITEMS: { icon: string; label: string }[] = [
  { icon: "bell", label: "Notifications" },
  { icon: "download", label: "Downloads" },
  { icon: "settings", label: "Settings" },
  { icon: "help-circle", label: "Help & Support" },
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, updateName } = useProfile();
  const { watchlist } = useWatchlist();
  const { movies } = useCatalog();
  const inProgressCount = movies.filter((movie) => movie.progress !== undefined).length;
  const topPadding = Platform.OS === "web" ? 67 : insets.top + 12;

  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(profile.name);
  const inputRef = useRef<TextInput>(null);

  const avatarLetter = (profile.name || "?")[0].toUpperCase();

  const startEditing = () => {
    setDraftName(profile.name);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const confirmEdit = () => {
    updateName(draftName);
    setEditing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const cancelEdit = () => {
    setDraftName(profile.name);
    setEditing(false);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingTop: topPadding,
        paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 90),
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar + Name */}
      <View style={styles.profileSection}>
        <View style={[styles.avatarWrapper]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>
          <TouchableOpacity
            style={[styles.avatarEditBtn, { backgroundColor: colors.secondary, borderColor: colors.background }]}
            onPress={startEditing}
            activeOpacity={0.8}
          >
            <Feather name="edit-2" size={11} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {editing ? (
          <View style={styles.nameEditRow}>
            <TextInput
              ref={inputRef}
              style={[
                styles.nameInput,
                {
                  color: colors.foreground,
                  backgroundColor: colors.secondary,
                  borderColor: colors.primary,
                },
              ]}
              value={draftName}
              onChangeText={setDraftName}
              onSubmitEditing={confirmEdit}
              returnKeyType="done"
              autoCorrect={false}
              maxLength={30}
              selectTextOnFocus
            />
            <TouchableOpacity
              style={[styles.confirmBtn, { backgroundColor: colors.primary }]}
              onPress={confirmEdit}
              activeOpacity={0.8}
            >
              <Feather name="check" size={16} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelBtn, { backgroundColor: colors.secondary }]}
              onPress={cancelEdit}
              activeOpacity={0.8}
            >
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.nameRow}
            onPress={startEditing}
            activeOpacity={0.7}
          >
            <Text style={[styles.name, { color: colors.foreground }]}>
              {profile.name}
            </Text>
            <Feather name="edit-2" size={14} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}

        <Text style={[styles.plan, { color: colors.primary }]}>
          {profile.plan} Plan
        </Text>
      </View>

      {/* Stats */}
      <View style={[styles.statsRow, { backgroundColor: colors.card }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.foreground }]}>
            {watchlist.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            Saved
          </Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.foreground }]}>
            {inProgressCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            In Progress
          </Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.foreground }]}>
            12
          </Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            Available
          </Text>
        </View>
      </View>

      {/* Menu */}
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
            <Feather
              name="chevron-right"
              size={18}
              color={colors.mutedForeground}
            />
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
    paddingVertical: 24,
    gap: 10,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 4,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 36,
    fontFamily: "Inter_700Bold",
  },
  avatarEditBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  name: {
    fontSize: 22,
    fontFamily: "Inter_600SemiBold",
  },
  nameEditRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
  },
  nameInput: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    borderWidth: 1.5,
  },
  confirmBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  plan: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    paddingVertical: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statNumber: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    marginVertical: 4,
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
