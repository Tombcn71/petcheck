"use client";

import { useEffect, useState } from "react";
import { Share, PlusSquare, X, Monitor, Smartphone, CheckCircle } from "lucide-react";

type Platform = "ios-safari" | "ios-other" | "android" | "desktop" | "standalone";

function detectPlatform(): Platform {
  if (typeof window === "undefined") return "desktop";

  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as any).standalone === true;
  if (standalone) return "standalone";

  const ua = navigator.userAgent;
  const isIOS =
    /iPhone|iPad|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isIOS) {
    const isSafari = !/CriOS|FxiOS|OPiOS|mercury/i.test(ua);
    return isSafari ? "ios-safari" : "ios-other";
  }

  if (/android/i.test(ua)) return "android";
  return "desktop";
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function InstallModal({ isOpen, onClose }: Props) {
  const [platform, setPlatform] = useState<Platform>("desktop");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleNativeInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setInstalled(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-sm mx-0 sm:mx-4 p-6 shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors">
          <X size={16} />
        </button>

        <div className="mb-5">
          <div className="w-12 h-12 bg-[#4FC3F7]/10 rounded-2xl flex items-center justify-center mb-3">
            <Smartphone className="text-[#4FC3F7]" size={24} />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight text-[#1A1A2E]">
            Installeer Doggyscan
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Gebruik de app als een native app op je apparaat
          </p>
        </div>

        {/* Standalone - al geïnstalleerd */}
        {platform === "standalone" && (
          <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 rounded-2xl p-4">
            <CheckCircle size={20} className="shrink-0" />
            <p className="text-sm font-bold">Al geïnstalleerd op dit apparaat!</p>
          </div>
        )}

        {/* iOS Safari */}
        {platform === "ios-safari" && (
          <ol className="space-y-3">
            <li className="flex items-center gap-3 text-sm text-slate-700">
              <span className="bg-[#4FC3F7]/15 text-[#0288D1] w-7 h-7 flex items-center justify-center rounded-full text-xs font-black shrink-0">1</span>
              Tik op de <strong>Deel-knop</strong> <Share size={16} className="text-blue-500 inline mx-1" /> onderin Safari
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-700">
              <span className="bg-[#4FC3F7]/15 text-[#0288D1] w-7 h-7 flex items-center justify-center rounded-full text-xs font-black shrink-0">2</span>
              Tik op <strong>Zet op beginscherm</strong> <PlusSquare size={16} className="inline mx-1" />
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-700">
              <span className="bg-[#4FC3F7]/15 text-[#0288D1] w-7 h-7 flex items-center justify-center rounded-full text-xs font-black shrink-0">3</span>
              Tik op <strong>Voeg toe</strong> rechts bovenin
            </li>
          </ol>
        )}

        {/* iOS Chrome/andere browser */}
        {platform === "ios-other" && (
          <div className="space-y-3">
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-xs text-amber-800 leading-relaxed">
              Je gebruikt Chrome op iPhone. Installeren gaat alleen via <strong>Safari</strong>.
            </div>
            <ol className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <span className="bg-[#4FC3F7]/15 text-[#0288D1] w-7 h-7 flex items-center justify-center rounded-full text-xs font-black shrink-0 mt-0.5">1</span>
                Kopieer de URL en open <strong>doggyscan.nl</strong> in Safari
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <span className="bg-[#4FC3F7]/15 text-[#0288D1] w-7 h-7 flex items-center justify-center rounded-full text-xs font-black shrink-0 mt-0.5">2</span>
                Tik op <Share size={14} className="inline text-blue-500 mx-1" /> → <strong>Zet op beginscherm</strong>
              </li>
            </ol>
          </div>
        )}

        {/* Android Chrome */}
        {platform === "android" && (
          <div className="space-y-3">
            {deferredPrompt ? (
              <button
                onClick={handleNativeInstall}
                className="w-full py-4 bg-[#4FC3F7] hover:bg-[#0288D1] text-white font-black uppercase rounded-2xl text-sm tracking-wide transition-colors">
                Installeer nu
              </button>
            ) : (
              <ol className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-slate-700">
                  <span className="bg-[#4FC3F7]/15 text-[#0288D1] w-7 h-7 flex items-center justify-center rounded-full text-xs font-black shrink-0">1</span>
                  Tik op de <strong>⋮ menu</strong> rechts bovenin Chrome
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-700">
                  <span className="bg-[#4FC3F7]/15 text-[#0288D1] w-7 h-7 flex items-center justify-center rounded-full text-xs font-black shrink-0">2</span>
                  Tik op <strong>App toevoegen aan startscherm</strong>
                </li>
              </ol>
            )}
            {installed && (
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold">
                <CheckCircle size={16} /> Geïnstalleerd!
              </div>
            )}
          </div>
        )}

        {/* Desktop */}
        {platform === "desktop" && (
          <div className="space-y-3">
            {deferredPrompt ? (
              <button
                onClick={handleNativeInstall}
                className="w-full py-4 bg-[#4FC3F7] hover:bg-[#0288D1] text-white font-black uppercase rounded-2xl text-sm tracking-wide transition-colors">
                Installeer als app
              </button>
            ) : (
              <div className="flex items-start gap-3 text-sm text-slate-600 bg-slate-50 rounded-2xl p-4">
                <Monitor size={18} className="shrink-0 mt-0.5 text-slate-400" />
                <p className="leading-relaxed">
                  Klik op het <strong>installeer-icoontje</strong> in de adresbalk van Chrome of Edge om de app te installeren.
                </p>
              </div>
            )}
            {installed && (
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold">
                <CheckCircle size={16} /> Geïnstalleerd!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
