import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useCatalog } from "@/context/CatalogContext";
import type { Movie } from "@/data/movies";
import { useColors } from "@/hooks/useColors";

const PASSWORD_KEY = "@streamapp/admin-password";

type FormState = {
  title: string;
  genre: string;
  posterUrl: string;
  videoUrl: string;
  description: string;
};

const EMPTY_FORM: FormState = {
  title: "",
  genre: "Drama",
  posterUrl: "",
  videoUrl: "",
  description: "",
};

export default function AdminScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { movies, addMovie, updateMovie, deleteMovie } = useCatalog();
  const [storedPassword, setStoredPassword] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const topPadding = Platform.OS === "web" ? 67 : insets.top + 12;

  useEffect(() => {
    AsyncStorage.getItem(PASSWORD_KEY).then(setStoredPassword);
  }, []);

  const submitPassword = () => {
    const trimmed = password.trim();
    if (trimmed.length < 4) return;
    if (!storedPassword) {
      AsyncStorage.setItem(PASSWORD_KEY, trimmed);
      setStoredPassword(trimmed);
      setUnlocked(true);
    } else if (trimmed === storedPassword) {
      setUnlocked(true);
    } else {
      Alert.alert("Incorrect password", "Please try again.");
    }
    setPassword("");
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const saveMovie = () => {
    if (!form.title.trim() || !form.genre.trim() || !form.description.trim()) {
      Alert.alert("Missing details", "Add a title, category, and description.");
      return;
    }

    const existing = editingId
      ? movies.find((movie) => movie.id === editingId)
      : undefined;
    const movie: Movie = {
      id: editingId ?? `movie-${Date.now()}`,
      title: form.title.trim(),
      genre: form.genre.trim(),
      description: form.description.trim(),
      posterUrl: form.posterUrl.trim() || undefined,
      videoUrl: form.videoUrl.trim() || undefined,
      poster: form.posterUrl.trim()
        ? { uri: form.posterUrl.trim() }
        : existing?.poster ?? { uri: "https://picsum.photos/400/600" },
      year: existing?.year ?? 2026,
      rating: existing?.rating ?? 0,
      duration: existing?.duration ?? "1h 30m",
      progress: existing?.progress,
      isFeatured: existing?.isFeatured,
    };

    if (editingId) updateMovie(movie);
    else addMovie(movie);
    resetForm();
    Alert.alert("Saved", `${movie.title} is now in your catalog.`);
  };

  const startEditing = (movie: Movie) => {
    setEditingId(movie.id);
    setForm({
      title: movie.title,
      genre: movie.genre,
      posterUrl: movie.posterUrl ?? "",
      videoUrl: movie.videoUrl ?? "",
      description: movie.description,
    });
  };

  const confirmDelete = (movie: Movie) => {
    Alert.alert("Delete movie?", `Remove ${movie.title} from the catalog?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteMovie(movie.id) },
    ]);
  };

  if (!unlocked) {
    const isSetup = !storedPassword;
    return (
      <View style={[styles.locked, { backgroundColor: colors.background, paddingTop: topPadding }]}>
        <View style={[styles.lockIcon, { backgroundColor: colors.card }]}>
          <Feather name="shield" size={34} color={colors.primary} />
        </View>
        <Text style={[styles.lockTitle, { color: colors.foreground }]}>
          {isSetup ? "Set up Admin access" : "Admin access"}
        </Text>
        <Text style={[styles.lockSubtitle, { color: colors.mutedForeground }]}>
          {isSetup
            ? "Create a private password for managing your StreamApp catalog."
            : "Enter your Admin password to manage the movie catalog."}
        </Text>
        <TextInput
          testID="admin-password-input"
          style={[styles.input, { color: colors.foreground, backgroundColor: colors.input, borderColor: colors.border }]}
          value={password}
          onChangeText={setPassword}
          placeholder={isSetup ? "Create password" : "Enter password"}
          placeholderTextColor={colors.mutedForeground}
          secureTextEntry
          autoCapitalize="none"
          returnKeyType="done"
          onSubmitEditing={submitPassword}
        />
        <TouchableOpacity
          testID="admin-unlock-button"
          style={[styles.primaryButton, { backgroundColor: colors.primary, opacity: password.trim().length >= 4 ? 1 : 0.5 }]}
          onPress={submitPassword}
          disabled={password.trim().length < 4}
        >
          <Text style={[styles.primaryButtonText, { color: colors.primaryForeground }]}>
            {isSetup ? "Create password" : "Unlock Admin"}
          </Text>
        </TouchableOpacity>
        {isSetup && (
          <Text style={[styles.smallText, { color: colors.mutedForeground }]}>
            Use at least 4 characters. This password is stored only on this phone.
          </Text>
        )}
      </View>
    );
  }

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPadding, paddingBottom: insets.bottom + 110 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.foreground }]}>Admin</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Manage your local movie catalog
          </Text>
        </View>
        <TouchableOpacity onPress={() => setUnlocked(false)} style={[styles.lockButton, { backgroundColor: colors.secondary }]}>
          <Feather name="lock" size={16} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      <View style={[styles.formCard, { backgroundColor: colors.card }]}>
        <View style={styles.formHeader}>
          <Text style={[styles.formTitle, { color: colors.foreground }]}>
            {editingId ? "Edit movie" : "Add a movie"}
          </Text>
          {editingId && (
            <TouchableOpacity onPress={resetForm}>
              <Text style={[styles.cancelText, { color: colors.primary }]}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
        <Field label="Title" value={form.title} placeholder="Movie title" onChange={(value) => setForm((prev) => ({ ...prev, title: value }))} colors={colors} />
        <Field label="Category" value={form.genre} placeholder="Drama, Action, Sci-Fi" onChange={(value) => setForm((prev) => ({ ...prev, genre: value }))} colors={colors} />
        <Field label="Poster Image URL" value={form.posterUrl} placeholder="https://..." onChange={(value) => setForm((prev) => ({ ...prev, posterUrl: value }))} colors={colors} keyboardType="url" />
        <Field label="Video URL" value={form.videoUrl} placeholder="https://..." onChange={(value) => setForm((prev) => ({ ...prev, videoUrl: value }))} colors={colors} keyboardType="url" />
        <Field label="Description" value={form.description} placeholder="Tell viewers about this movie" onChange={(value) => setForm((prev) => ({ ...prev, description: value }))} colors={colors} multiline />
        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={saveMovie}>
          <Feather name={editingId ? "check" : "plus"} size={18} color={colors.primaryForeground} />
          <Text style={[styles.primaryButtonText, { color: colors.primaryForeground }]}>
            {editingId ? "Save changes" : "Add movie"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.listTitle, { color: colors.foreground }]}>
        Catalog ({movies.length})
      </Text>
      {movies.map((movie) => (
        <View key={movie.id} style={[styles.movieRow, { backgroundColor: colors.card }]}>
          <View style={styles.movieRowText}>
            <Text style={[styles.movieTitle, { color: colors.foreground }]} numberOfLines={1}>{movie.title}</Text>
            <Text style={[styles.movieCategory, { color: colors.mutedForeground }]}>{movie.genre}</Text>
          </View>
          <TouchableOpacity onPress={() => startEditing(movie)} style={styles.rowAction}>
            <Feather name="edit-2" size={17} color={colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => confirmDelete(movie)} style={styles.rowAction}>
            <Feather name="trash-2" size={17} color={colors.destructive} />
          </TouchableOpacity>
        </View>
      ))}
    </KeyboardAwareScrollViewCompat>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
  colors,
  multiline = false,
  keyboardType = "default",
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
  multiline?: boolean;
  keyboardType?: "default" | "url";
}) {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.foreground }]}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput, { color: colors.foreground, backgroundColor: colors.input, borderColor: colors.border }]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === "url" ? "none" : "sentences"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  locked: { flex: 1, paddingHorizontal: 24, alignItems: "center" },
  lockIcon: { width: 76, height: 76, borderRadius: 24, alignItems: "center", justifyContent: "center", marginTop: 70, marginBottom: 22 },
  lockTitle: { fontSize: 26, fontFamily: "Inter_700Bold", textAlign: "center" },
  lockSubtitle: { fontSize: 15, lineHeight: 22, fontFamily: "Inter_400Regular", textAlign: "center", maxWidth: 320, marginTop: 10, marginBottom: 26 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  title: { fontSize: 28, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 4 },
  lockButton: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  formCard: { borderRadius: 14, padding: 16, marginBottom: 24 },
  formHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  formTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  cancelText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  field: { marginBottom: 13 },
  label: { fontSize: 12, fontFamily: "Inter_600SemiBold", marginBottom: 6 },
  input: { width: "100%", height: 48, borderWidth: 1, borderRadius: 10, paddingHorizontal: 13, fontSize: 15, fontFamily: "Inter_400Regular" },
  multilineInput: { height: 82, paddingTop: 12, textAlignVertical: "top" },
  primaryButton: { minHeight: 50, borderRadius: 11, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingHorizontal: 16, marginTop: 4 },
  primaryButtonText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  smallText: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 16, textAlign: "center" },
  listTitle: { fontSize: 19, fontFamily: "Inter_600SemiBold", marginBottom: 10 },
  movieRow: { minHeight: 62, borderRadius: 12, flexDirection: "row", alignItems: "center", paddingLeft: 15, paddingRight: 8, marginBottom: 8 },
  movieRowText: { flex: 1, marginRight: 8 },
  movieTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  movieCategory: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 4 },
  rowAction: { width: 40, height: 44, alignItems: "center", justifyContent: "center" },
});