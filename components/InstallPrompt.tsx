"use client";

import { useState, useEffect } from "react";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Registreer Service Worker (Verplicht voor echt Android signaal)
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* SW fout - stille fail */
      });
    }

    // 2. Vang het echte systeem-signaal op
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 3. Status checks
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream,
    );
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    // 4. Forceer zichtbaarheid voor UI (iOS ziet het direct, Android zodra gevalideerd)
    const timer = setTimeout(() => {
      if (!window.matchMedia("(display-mode: standalone)").matches) {
        setIsVisible(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // De ECHTE Android prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setIsVisible(false);
      }
    } else if (!isIOS) {
      // Fallback als browser signaal traag is: open het browser menu
      alert(
        "Klik op de 3 puntjes in je browser en kies 'App installeren' voor de volledige ervaring.",
      );
    }
  };

  if (isStandalone || !isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-2 border-[#4FC3F7] z-[9999] animate-in fade-in slide-in-from-bottom-10">
      <div className="flex flex-col items-center text-center">
        <div className="w-14 h-14 bg-[#4FC3F7] rounded-2xl mb-4 flex items-center justify-center text-white text-3xl shadow-lg shadow-blue-200">
          🐾
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-1 leading-tight">
          Doggyscan op je startscherm?
        </h3>
        <p className="text-[13px] text-slate-600 mb-6 font-medium leading-relaxed max-w-[280px]">
          {isIOS
            ? 'Tik op de deel-knop ⎋ en kies "Zet op beginscherm" voor de snelste zorg.'
            : "Installeer de app direct voor razendsnelle AI-gezondheidschecks."}
        </p>

        <div className="flex gap-3 w-full">
          <button
            onClick={() => setIsVisible(false)}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold py-4 rounded-xl text-xs transition-colors">
            LATER
          </button>
          <button
            onClick={isIOS ? undefined : handleInstallClick}
            className={`flex-[2] ${isIOS ? "opacity-50 cursor-default" : "active:scale-95"} bg-[#4FC3F7] hover:bg-[#3fb0e0] text-white font-black py-4 rounded-xl text-xs shadow-lg shadow-blue-100 transition-all uppercase tracking-wider`}>
            {isIOS ? "Volg instructie" : "Nu Installeren"}
          </button>
        </div>
      </div>
    </div>
  );
}
