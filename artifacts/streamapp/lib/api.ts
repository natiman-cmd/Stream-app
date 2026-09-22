import { Platform } from "react-native";

const apiHost = process.env.EXPO_PUBLIC_DOMAIN
  ? `https://${process.env.EXPO_PUBLIC_DOMAIN}`
  : "";

function apiUrl(path: string) {
  if (Platform.OS === "web" || !apiHost) return path;
  return `${apiHost}${path}`;
}

export async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(apiUrl(path), {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = typeof payload?.error === "string" ? payload.error : `Request failed with ${response.status}`;
    const requestError = new Error(error) as Error & { status?: number; code?: string };
    requestError.status = response.status;
    requestError.code = payload?.code;
    throw requestError;
  }
  return payload as T;
}