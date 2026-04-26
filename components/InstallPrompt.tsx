"use client";

import { useEffect, useState } from "react";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }

    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream,
    );
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

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

  if (isStandalone) return null;

  if (deferredPrompt)
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

  if (isIOS)
    return (
      <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-lg p-4 z-50">
        <p className="text-sm font-semibold text-[#1A1A2E]">
          Installeer Doggyscan
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Tik op <strong>Delen</strong> ⎋ en dan{" "}
          <strong>Zet op beginscherm</strong> ➕
        </p>
      </div>
    );

  return null;
}
