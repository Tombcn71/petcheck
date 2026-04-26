"use client";

import { useEffect, useState } from "react";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Service Worker registreren
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }

    // Installatie prompt bewaren
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  if (!deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between z-50">
      <p className="text-sm font-semibold text-[#1A1A2E]">
        Installeer Doggyscan op je telefoon
      </p>
      <button
        onClick={handleInstall}
        className="bg-[#4FC3F7] text-white text-sm font-bold px-4 py-2 rounded-xl">
        Installeer
      </button>
    </div>
  );
}
