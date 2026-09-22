import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { apiFetch } from "@/lib/api";
import { useColors } from "@/hooks/useColors";

interface ReviewRequest {
  id: string;
  playerId: string;
  type: "deposit" | "withdrawal";
  status: string;
  amountCents: number;
  paymentMethod: "telebirr" | "bank";
  reference?: string | null;
  receiptData?: string | null;
  receiptFileName?: string | null;
  payoutPhone?: string | null;
  payoutBankName?: string | null;
  payoutBankAccount?: string | null;
  payoutAccountName?: string | null;
  note?: string | null;
  createdAt: string;
}

export default function AdminScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [token, setToken] = useState("");
  const [requests, setRequests] = useState<ReviewRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const topPadding = Platform.OS === "web" ? 67 : insets.top + 12;

  const load = async () => {
    if (!token.trim()) return;
    setLoading(true);
    try {
      const response = await apiFetch<{ requests: ReviewRequest[] }>("/api/admin/payment-requests?status=pending", {
        headers: { "x-admin-token": token.trim() },
      });
      setRequests(response.requests);
    } catch (error) {
      Alert.alert("Admin review", error instanceof Error ? error.message : "Could not load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const decide = async (request: ReviewRequest, decision: "approve" | "reject") => {
    try {
      await apiFetch(`/api/admin/payment-requests/${request.id}/decision`, {
        method: "POST",
        headers: { "x-admin-token": token.trim() },
        body: JSON.stringify({ decision }),
      });
      setRequests((current) => current.filter((item) => item.id !== request.id));
      Alert.alert("Request updated", `${request.type} marked ${decision}d.`);
    } catch (error) {
      Alert.alert("Admin review", error instanceof Error ? error.message : "Could not update request.");
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingTop: topPadding, paddingBottom: insets.bottom + 90 }}>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>PRIVATE OPERATIONS</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>Payment review</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Approve only after verifying the payment receipt and the payout details. Configure ADMIN_REVIEW_TOKEN on the server before using this screen.</Text>
      <Text style={[styles.label, { color: colors.foreground }]}>Admin review token</Text>
      <View style={styles.tokenRow}>
        <TextInput value={token} onChangeText={setToken} secureTextEntry placeholder="Enter configured token" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground, backgroundColor: colors.input, borderColor: colors.border }]} />
        <TouchableOpacity style={[styles.refresh, { backgroundColor: colors.primary }]} onPress={() => void load()}><Feather name="refresh-cw" size={17} color={colors.primaryForeground} /></TouchableOpacity>
      </View>
      <Text style={[styles.section, { color: colors.foreground }]}>{loading ? "Loading…" : `${requests.length} pending request${requests.length === 1 ? "" : "s"}`}</Text>
      {requests.map((request) => (
        <View key={request.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}><View style={[styles.requestIcon, { backgroundColor: colors.secondary }]}><Feather name={request.type === "deposit" ? "arrow-down-left" : "arrow-up-right"} size={18} color={colors.accent} /></View><View style={styles.copy}><Text style={[styles.cardTitle, { color: colors.foreground }]}>{request.type.toUpperCase()} · ETB {(request.amountCents / 100).toLocaleString()}</Text><Text style={[styles.meta, { color: colors.mutedForeground }]}>{request.paymentMethod} · {request.playerId}</Text></View></View>
          {request.reference ? <Text style={[styles.detail, { color: colors.foreground }]}>Reference: {request.reference}</Text> : null}
          {request.payoutPhone ? <Text style={[styles.detail, { color: colors.foreground }]}>Telebirr: {request.payoutPhone}</Text> : null}
          {request.payoutBankAccount ? <Text style={[styles.detail, { color: colors.foreground }]}>Bank: {request.payoutBankName} · {request.payoutBankAccount} · {request.payoutAccountName}</Text> : null}
          {request.note ? <Text style={[styles.note, { color: colors.mutedForeground }]}>{request.note}</Text> : null}
          {request.receiptData ? <Image source={{ uri: request.receiptData }} style={styles.receipt} resizeMode="contain" /> : null}
          <View style={styles.actions}><TouchableOpacity style={[styles.action, { backgroundColor: colors.secondary }]} onPress={() => void decide(request, "reject")}><Text style={[styles.actionText, { color: colors.destructive }]}>Reject</Text></TouchableOpacity><TouchableOpacity style={[styles.action, { backgroundColor: colors.accent }]} onPress={() => void decide(request, "approve")}><Text style={[styles.actionText, { color: colors.accentForeground }]}>Approve</Text></TouchableOpacity></View>
        </View>
      ))}
      {!loading && requests.length === 0 ? <Text style={[styles.empty, { color: colors.mutedForeground }]}>No pending requests, or enter the admin token to load them.</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  eyebrow: { fontSize: 10, letterSpacing: 2, fontFamily: "Inter_700Bold" },
  title: { fontSize: 29, fontFamily: "Inter_700Bold", marginTop: 5 },
  subtitle: { fontSize: 12, lineHeight: 18, marginTop: 5 },
  label: { fontSize: 12, fontFamily: "Inter_600SemiBold", marginTop: 18, marginBottom: 8 },
  tokenRow: { flexDirection: "row", gap: 8 },
  input: { flex: 1, minHeight: 45, borderWidth: 1, borderRadius: 9, paddingHorizontal: 12 },
  refresh: { width: 45, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  section: { fontSize: 18, fontFamily: "Inter_700Bold", marginTop: 24, marginBottom: 10 },
  card: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 10, gap: 9 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 9 },
  requestIcon: { width: 36, height: 36, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  copy: { flex: 1, gap: 3 },
  cardTitle: { fontSize: 13, fontFamily: "Inter_700Bold" },
  meta: { fontSize: 10 },
  detail: { fontSize: 11, lineHeight: 16 },
  note: { fontSize: 11, lineHeight: 16 },
  receipt: { width: "100%", height: 160, borderRadius: 8, backgroundColor: "#091735" },
  actions: { flexDirection: "row", gap: 8, marginTop: 4 },
  action: { flex: 1, minHeight: 40, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  actionText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  empty: { fontSize: 12, paddingVertical: 12 },
});