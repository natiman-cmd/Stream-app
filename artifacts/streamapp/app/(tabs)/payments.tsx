import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useBetting } from "@/context/BettingContext";
import { apiFetch } from "@/lib/api";
import { useColors } from "@/hooks/useColors";

type Mode = "deposit" | "withdrawal";
type PaymentMethod = "telebirr" | "bank";

interface PaymentInstructions {
  currency: string;
  telebirr: { phoneNumber: string; accountName: string };
  bank: { bankName: string; accountName: string; accountNumber: string };
  note: string;
}

interface PaymentRequest {
  id: string;
  type: Mode;
  status: string;
  amountCents: number;
  paymentMethod: PaymentMethod;
  reference?: string | null;
  note?: string | null;
  createdAt: string;
  reviewNote?: string | null;
}

const emptyInstructions: PaymentInstructions = {
  currency: "ETB",
  telebirr: { phoneNumber: "", accountName: "" },
  bank: { bankName: "", accountName: "", accountNumber: "" },
  note: "Send the exact amount, then submit your reference and receipt for manual review.",
};

export default function PaymentsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { playerId, balance, availableBalance, lockedBalance, refreshWallet } = useBetting();
  const [mode, setMode] = useState<Mode>("deposit");
  const [method, setMethod] = useState<PaymentMethod>("telebirr");
  const [instructions, setInstructions] = useState(emptyInstructions);
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");
  const [phone, setPhone] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [receipt, setReceipt] = useState<{ data: string; name: string; type: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const topPadding = Platform.OS === "web" ? 67 : insets.top + 12;

  const loadRequests = async () => {
    if (!playerId) return;
    try {
      const response = await apiFetch<{ requests: PaymentRequest[] }>(`/api/payments/requests/${playerId}`);
      setRequests(response.requests);
    } catch {
      setRequests([]);
    }
  };

  useEffect(() => {
    apiFetch<PaymentInstructions>("/api/payments/instructions").then(setInstructions).catch(() => undefined);
  }, []);

  useEffect(() => {
    void loadRequests();
  }, [playerId]);

  const accountDetails = useMemo(() => {
    if (method === "telebirr") {
      return [
        ["Telebirr number", instructions.telebirr.phoneNumber || "Not configured"],
        ["Account name", instructions.telebirr.accountName || "Not configured"],
      ];
    }
    return [
      ["Bank", instructions.bank.bankName || "Not configured"],
      ["Account name", instructions.bank.accountName || "Not configured"],
      ["Account number", instructions.bank.accountNumber || "Not configured"],
    ];
  }, [instructions, method]);

  const chooseReceipt = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      base64: true,
      quality: 0.65,
    });
    if (result.canceled || !result.assets[0]?.base64) return;
    const asset = result.assets[0];
    const type = asset.mimeType || "image/jpeg";
    setReceipt({
      data: `data:${type};base64,${asset.base64}`,
      name: asset.fileName || "payment-receipt.jpg",
      type,
    });
  };

  const resetForm = () => {
    setAmount("");
    setReference("");
    setNote("");
    setPhone("");
    setBankName("");
    setBankAccount("");
    setAccountName("");
    setReceipt(null);
  };

  const submit = async () => {
    if (!playerId) {
      Alert.alert("Wallet", "Your wallet is still loading.");
      return;
    }
    const amountCents = Math.round(Number(amount) * 100);
    if (!Number.isInteger(amountCents) || amountCents < 10_00) {
      Alert.alert("Amount required", "Enter at least ETB 10.");
      return;
    }
    if (mode === "deposit" && !reference.trim()) {
      Alert.alert("Reference required", "Enter the transaction reference from your payment.");
      return;
    }
    if (mode === "deposit" && !receipt) {
      Alert.alert("Receipt required", "Upload a screenshot or photo of the payment receipt.");
      return;
    }
    if (mode === "withdrawal" && method === "telebirr" && !phone.trim()) {
      Alert.alert("Phone required", "Enter the Telebirr number to receive the withdrawal.");
      return;
    }
    if (mode === "withdrawal" && method === "bank" && (!bankName.trim() || !bankAccount.trim() || !accountName.trim())) {
      Alert.alert("Bank details required", "Enter the bank, account number, and account holder name.");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "deposit") {
        await apiFetch("/api/payments/deposits", {
          method: "POST",
          body: JSON.stringify({
            playerId,
            amountCents,
            paymentMethod: method,
            reference: reference.trim(),
            receiptData: receipt?.data,
            receiptFileName: receipt?.name,
            receiptContentType: receipt?.type,
            note: note.trim() || undefined,
          }),
        });
      } else {
        await apiFetch("/api/payments/withdrawals", {
          method: "POST",
          body: JSON.stringify({
            playerId,
            amountCents,
            paymentMethod: method,
            payoutPhone: method === "telebirr" ? phone.trim() : undefined,
            payoutBankName: method === "bank" ? bankName.trim() : undefined,
            payoutBankAccount: method === "bank" ? bankAccount.trim() : undefined,
            payoutAccountName: method === "bank" ? accountName.trim() : undefined,
            note: note.trim() || undefined,
          }),
        });
      }
      await refreshWallet();
      await loadRequests();
      resetForm();
      Alert.alert("Submitted for review", mode === "deposit" ? "Your deposit will be credited after the receipt is verified." : "Your withdrawal is reserved and will be paid after manual approval.");
    } catch (error) {
      Alert.alert("Could not submit", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPadding, paddingBottom: insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.eyebrow, { color: colors.primary }]}>WALLET</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>Payments</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Deposit funds manually or request a withdrawal. Every request is reviewed before the balance changes.</Text>

      <View style={[styles.balanceCard, { backgroundColor: colors.primary }]}>
        <View><Text style={[styles.balanceLabel, { color: "#dbe6ff" }]}>Available balance</Text><Text style={[styles.balance, { color: colors.primaryForeground }]}>ETB {availableBalance.toLocaleString()}</Text></View>
        <Feather name="credit-card" size={26} color={colors.accent} />
        <View style={styles.balanceMeta}><Text style={{ color: "#dbe6ff", fontSize: 10 }}>Total ETB {balance.toLocaleString()}</Text><Text style={{ color: "#dbe6ff", fontSize: 10 }}>Reserved ETB {lockedBalance.toLocaleString()}</Text></View>
      </View>

      <View style={[styles.segment, { backgroundColor: colors.secondary }]}>
        <TouchableOpacity style={[styles.segmentItem, mode === "deposit" && { backgroundColor: colors.accent }]} onPress={() => setMode("deposit")}><Feather name="plus-circle" size={16} color={mode === "deposit" ? colors.accentForeground : colors.mutedForeground} /><Text style={[styles.segmentText, { color: mode === "deposit" ? colors.accentForeground : colors.foreground }]}>Deposit</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.segmentItem, mode === "withdrawal" && { backgroundColor: colors.accent }]} onPress={() => setMode("withdrawal")}><Feather name="arrow-up-circle" size={16} color={mode === "withdrawal" ? colors.accentForeground : colors.mutedForeground} /><Text style={[styles.segmentText, { color: mode === "withdrawal" ? colors.accentForeground : colors.foreground }]}>Withdraw</Text></TouchableOpacity>
      </View>

      <Text style={[styles.section, { color: colors.foreground }]}>{mode === "deposit" ? "Send payment to" : "Where should we send it?"}</Text>
      <View style={[styles.methodRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TouchableOpacity style={[styles.method, method === "telebirr" && { borderColor: colors.accent, backgroundColor: colors.secondary }]} onPress={() => setMethod("telebirr")}><Feather name="smartphone" size={17} color={colors.accent} /><Text style={[styles.methodText, { color: colors.foreground }]}>Telebirr</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.method, method === "bank" && { borderColor: colors.accent, backgroundColor: colors.secondary }]} onPress={() => setMethod("bank")}><Feather name="briefcase" size={17} color={colors.accent} /><Text style={[styles.methodText, { color: colors.foreground }]}>Bank</Text></TouchableOpacity>
      </View>

      {mode === "deposit" ? (
        <View style={[styles.instructions, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {accountDetails.map(([label, value]) => <View key={label} style={styles.detailRow}><Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>{label}</Text><Text style={[styles.detailValue, { color: colors.foreground }]}>{value}</Text></View>)}
          <Text style={[styles.instructionsNote, { color: colors.mutedForeground }]}>{instructions.note}</Text>
        </View>
      ) : (
        <Text style={[styles.helper, { color: colors.mutedForeground }]}>Withdrawals are reserved from your available balance immediately and released if an admin rejects the request.</Text>
      )}

      <Text style={[styles.section, { color: colors.foreground }]}>Request details</Text>
      <View style={styles.form}>
        <Text style={[styles.label, { color: colors.foreground }]}>Amount (ETB)</Text>
        <TextInput value={amount} onChangeText={setAmount} placeholder="0.00" placeholderTextColor={colors.mutedForeground} keyboardType="decimal-pad" style={[styles.input, { color: colors.foreground, backgroundColor: colors.input, borderColor: colors.border }]} />
        {mode === "deposit" ? (
          <>
            <Text style={[styles.label, { color: colors.foreground }]}>Transaction reference</Text>
            <TextInput value={reference} onChangeText={setReference} placeholder="Reference / transaction ID" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground, backgroundColor: colors.input, borderColor: colors.border }]} />
            <TouchableOpacity style={[styles.upload, { borderColor: colors.border, backgroundColor: colors.input }]} onPress={chooseReceipt}><Feather name="upload" size={17} color={colors.accent} /><Text style={[styles.uploadText, { color: colors.foreground }]}>{receipt ? receipt.name : "Upload payment receipt"}</Text></TouchableOpacity>
          </>
        ) : method === "telebirr" ? (
          <>
            <Text style={[styles.label, { color: colors.foreground }]}>Telebirr phone number</Text>
            <TextInput value={phone} onChangeText={setPhone} placeholder="09…" placeholderTextColor={colors.mutedForeground} keyboardType="phone-pad" style={[styles.input, { color: colors.foreground, backgroundColor: colors.input, borderColor: colors.border }]} />
          </>
        ) : (
          <>
            <Text style={[styles.label, { color: colors.foreground }]}>Bank name</Text>
            <TextInput value={bankName} onChangeText={setBankName} placeholder="Bank name" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground, backgroundColor: colors.input, borderColor: colors.border }]} />
            <Text style={[styles.label, { color: colors.foreground }]}>Account number</Text>
            <TextInput value={bankAccount} onChangeText={setBankAccount} placeholder="Account number" placeholderTextColor={colors.mutedForeground} keyboardType="number-pad" style={[styles.input, { color: colors.foreground, backgroundColor: colors.input, borderColor: colors.border }]} />
            <Text style={[styles.label, { color: colors.foreground }]}>Account holder name</Text>
            <TextInput value={accountName} onChangeText={setAccountName} placeholder="Full name" placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground, backgroundColor: colors.input, borderColor: colors.border }]} />
          </>
        )}
        <Text style={[styles.label, { color: colors.foreground }]}>Note (optional)</Text>
        <TextInput value={note} onChangeText={setNote} placeholder="Add context for the reviewer" placeholderTextColor={colors.mutedForeground} multiline style={[styles.input, styles.noteInput, { color: colors.foreground, backgroundColor: colors.input, borderColor: colors.border }]} />
        <TouchableOpacity style={[styles.submit, { backgroundColor: colors.accent }]} onPress={submit} disabled={submitting}><Text style={[styles.submitText, { color: colors.accentForeground }]}>{submitting ? "Submitting…" : mode === "deposit" ? "Submit deposit" : "Request withdrawal"}</Text><Feather name="arrow-right" size={17} color={colors.accentForeground} /></TouchableOpacity>
      </View>

      <Text style={[styles.section, { color: colors.foreground }]}>Your requests</Text>
      {requests.length === 0 ? <Text style={[styles.empty, { color: colors.mutedForeground }]}>No deposit or withdrawal requests yet.</Text> : requests.map((request) => (
        <View key={request.id} style={[styles.requestRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.requestIcon, { backgroundColor: colors.secondary }]}><Feather name={request.type === "deposit" ? "arrow-down-left" : "arrow-up-right"} size={17} color={colors.accent} /></View>
          <View style={styles.requestCopy}><Text style={[styles.requestTitle, { color: colors.foreground }]}>{request.type === "deposit" ? "Deposit" : "Withdrawal"} · ETB {(request.amountCents / 100).toLocaleString()}</Text><Text style={[styles.requestMeta, { color: colors.mutedForeground }]}>{request.paymentMethod} · {request.status}</Text></View>
          <Text style={[styles.requestStatus, { color: request.status === "approved" ? colors.success : request.status === "rejected" ? colors.destructive : colors.accent }]}>{request.status.toUpperCase()}</Text>
        </View>
      ))}
      <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>Manual payments are not instant. Keep your receipt until the request is reviewed.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  eyebrow: { fontSize: 10, letterSpacing: 2, fontFamily: "Inter_700Bold" },
  title: { fontSize: 30, fontFamily: "Inter_700Bold", marginTop: 5 },
  subtitle: { fontSize: 13, lineHeight: 19, marginTop: 5 },
  balanceCard: { borderRadius: 14, padding: 16, marginTop: 17, minHeight: 115, flexDirection: "row", alignItems: "flex-start", gap: 12 },
  balanceLabel: { fontSize: 11 },
  balance: { fontSize: 28, fontFamily: "Inter_700Bold", marginTop: 6 },
  balanceMeta: { position: "absolute", left: 16, bottom: 13, gap: 2 },
  segment: { flexDirection: "row", padding: 4, borderRadius: 10, marginTop: 14, gap: 4 },
  segmentItem: { flex: 1, minHeight: 40, borderRadius: 7, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 7 },
  segmentText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  section: { fontSize: 17, fontFamily: "Inter_700Bold", marginTop: 22, marginBottom: 10 },
  methodRow: { borderWidth: 1, borderRadius: 11, padding: 6, flexDirection: "row", gap: 6 },
  method: { flex: 1, minHeight: 45, borderRadius: 7, borderWidth: 1, borderColor: "transparent", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
  methodText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  instructions: { borderWidth: 1, borderRadius: 11, padding: 13, marginTop: 10, gap: 9 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  detailLabel: { fontSize: 11 },
  detailValue: { flex: 1, textAlign: "right", fontSize: 12, fontFamily: "Inter_700Bold" },
  instructionsNote: { fontSize: 11, lineHeight: 16, marginTop: 3 },
  helper: { fontSize: 12, lineHeight: 18, marginTop: 2 },
  form: { gap: 9 },
  label: { fontSize: 12, fontFamily: "Inter_600SemiBold", marginTop: 3 },
  input: { minHeight: 46, borderWidth: 1, borderRadius: 9, paddingHorizontal: 12, fontSize: 14 },
  noteInput: { minHeight: 74, textAlignVertical: "top", paddingTop: 12 },
  upload: { minHeight: 48, borderWidth: 1, borderRadius: 9, borderStyle: "dashed", flexDirection: "row", alignItems: "center", paddingHorizontal: 12, gap: 8 },
  uploadText: { flex: 1, fontSize: 12, fontFamily: "Inter_600SemiBold" },
  submit: { minHeight: 48, borderRadius: 9, marginTop: 6, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  submitText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  empty: { fontSize: 12, paddingVertical: 8 },
  requestRow: { borderWidth: 1, borderRadius: 11, padding: 11, flexDirection: "row", alignItems: "center", gap: 9, marginBottom: 8 },
  requestIcon: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  requestCopy: { flex: 1, gap: 3 },
  requestTitle: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  requestMeta: { fontSize: 10 },
  requestStatus: { fontSize: 9, letterSpacing: 0.6, fontFamily: "Inter_700Bold" },
  disclaimer: { fontSize: 9, textAlign: "center", lineHeight: 14, marginTop: 20 },
});