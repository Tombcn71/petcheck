"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [zichtbaar, setZichtbaar] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) {
      setZichtbaar(true);
    }
  }, []);

  const accepteer = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setZichtbaar(false);
  };

  const weiger = () => {
    localStorage.setItem("cookie-consent", "declined");
    setZichtbaar(false);
  };

  if (!zichtbaar) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="max-w-4xl mx-auto bg-white border border-slate-100 rounded-2xl shadow-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-xs font-bold text-slate-500 flex-1 leading-relaxed">
          Wij gebruiken cookies om de app goed te laten werken en je ervaring te verbeteren. Lees meer in ons{" "}
          <Link href="/privacy" className="text-[#4FC3F7] hover:underline">
            privacybeleid
          </Link>
          .
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={weiger}
            className="px-4 py-2 rounded-xl border-2 border-slate-100 text-slate-400 hover:border-slate-200 font-black uppercase text-[10px] tracking-widest transition-all">
            Weigeren
          </button>
          <button
            onClick={accepteer}
            className="px-4 py-2 rounded-xl bg-[#4FC3F7] hover:bg-[#0288D1] text-white font-black uppercase text-[10px] tracking-widest transition-all">
            Accepteren
          </button>
        </div>
      </div>
    </div>
  );
}
