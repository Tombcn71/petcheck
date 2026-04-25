"use client";

import { useEffect } from "react";

export function InstallPrompt() {
  useEffect(() => {
    // 1. Registreer de Service Worker (nodig voor de officiële prompt)
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // 2. Luister naar het systeem-signaal
    const handleBeforeInstallPrompt = (e: any) => {
      // Voorkom dat Chrome het direct doet (zodat we controle hebben)
      e.preventDefault();

      // FIRE! Activeer direct de officiële Android-installatie prompt
      // Zodra de browser er klaar voor is, knalt het systeemvenster in beeld
      e.prompt();

      e.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === "accepted") {
          console.log("Gebruiker heeft Doggyscan geïnstalleerd");
        }
      });
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  // We renderen helemaal NIETS. Geen popups, geen knoppen.
  return null;
}
