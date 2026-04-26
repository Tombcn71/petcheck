"use client";

import { useEffect } from "react";
import { subscribeUser } from "@/app/actions";

// Helper om VAPID key om te zetten voor de browser
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function InstallPrompt() {
  useEffect(() => {
    // 1. Registreer Service Worker & regel Push Subscriptie
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(async (registration) => {
          // Wacht tot de worker klaar is en probeer dan te subscriben
          await navigator.serviceWorker.ready;

          try {
            const sub = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(
                process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
              ),
            });

            // Stuur de browser-sub direct naar je Neon database via de Server Action
            await subscribeUser(JSON.parse(JSON.stringify(sub)));
          } catch (pushError) {
            console.error("Push abonnement mislukt:", pushError);
          }
        })
        .catch((err) => console.error("SW registratie fout:", err));
    }

    // 2. Luister naar het officiële Android installatie-signaal
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();

      // Knal direct het officiële Android systeemvenster in beeld
      e.prompt();

      e.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === "accepted") {
          console.log("Doggyscan succesvol geïnstalleerd");
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

  // Geen HTML-rommel, alleen pure logica
  return null;
}
