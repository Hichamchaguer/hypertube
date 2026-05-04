"use client";

import { useEffect } from "react";

export function PWARegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    // Register our custom sw.js v11
    navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" })
      .then((reg) => {
        console.log("[SW] Registered scope:", reg.scope);
      })
      .catch((err) => {
        console.error("[SW] Registration failed:", err);
      });
  }, []);

  return null;
}
