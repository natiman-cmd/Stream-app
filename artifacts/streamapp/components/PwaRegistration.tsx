import { useEffect } from "react";
import { Platform } from "react-native";

export function PwaRegistration() {
  useEffect(() => {
    if (
      Platform.OS !== "web" ||
      typeof navigator === "undefined" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    void navigator.serviceWorker
      .register("/service-worker.js")
      .catch((error: unknown) => {
        console.warn("Neon Stakes PWA service worker registration failed", error);
      });
  }, []);

  return null;
}