"use client";

import { useState, useEffect } from "react";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Luister naar het 'beforeinstallprompt' signaal van Android/Chrome
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e); // Bewaar het signaal zodat we de 1-klik actie kunnen doen
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Start de officiële 1-klik installatie op Android
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  // Als de app al geïnstalleerd is, laat niets zien
  if (isStandalone) return null;

  // Toon popup op iOS, of op Android zodra het signaal binnen is
  if (!isIOS && !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white p-6 rounded-2xl shadow-2xl border-2 border-[#4FC3F7] z-[100] animate-in fade-in slide-in-from-bottom-10">
      <div className="flex flex-col items-center text-center">
        <h3 className="text-xl font-extrabold text-slate-900 mb-2">
          Installeer Doggyscan
        </h3>
        <p className="text-sm text-slate-600 mb-4 font-medium">
          {isIOS
            ? 'Tik op de deel-knop (vierkantje met pijl) en kies "Zet op beginscherm" om de app te installeren.'
            : "Installeer de app met één klik voor de snelste zorg voor je hond."}
        </p>

        {!isIOS && deferredPrompt && (
          <button
            onClick={handleInstallClick}
            className="w-full bg-[#4FC3F7] hover:bg-[#3fb0e0] text-white font-black py-4 rounded-xl text-lg transition-all active:scale-95 shadow-lg shadow-blue-200">
            NU INSTALLEREN
          </button>
        )}
      </div>
    </div>
  );
}
