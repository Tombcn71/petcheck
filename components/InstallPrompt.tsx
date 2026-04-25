"use client";

import { useState, useEffect } from "react";

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check of de gebruiker op een iPhone/iPad zit
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream,
    );

    // Check of de app al is geïnstalleerd (standalone mode)
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  // Als de app al is geïnstalleerd, laten we niets zien
  if (isStandalone) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white p-4 rounded-2xl shadow-2xl border border-blue-100 z-50">
      <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">
        Installeer Doggyscan
      </h3>

      {isIOS ? (
        <p className="text-sm text-gray-600">
          Om Doggyscan op je iPhone te zetten: tik op de deel-knop
          <span className="inline-block mx-1">⎋</span>
          en kies daarna{" "}
          <span className="font-semibold text-[#4FC3F7]">
            "Zet op beginscherm"
          </span>
          .
        </p>
      ) : (
        <p className="text-sm text-gray-600">
          Voeg Doggyscan toe aan je startscherm voor een snelle gezondheidscheck
          van je hond.
        </p>
      )}

      {!isIOS && (
        <button
          className="mt-3 w-full bg-[#4FC3F7] text-white font-bold py-2 rounded-xl"
          onClick={() =>
            window.alert(
              'Gebruik de menu-instellingen van je browser om "App installeren" te kiezen.',
            )
          }>
          App Installeren
        </button>
      )}
    </div>
  );
}
