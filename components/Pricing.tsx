"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Plus, Minus, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Pricing() {
  const [dogCount, setDogCount] = useState(1);
  const totalPrice = (9.99 + (dogCount - 1) * 5.0).toFixed(2);

  return (
    <section className="w-full bg-[#F8FAFC] py-20 font-sans">
      <div className="max-w-6xl mx-auto px-4">
        <header className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 text-[#1A1A2E]"
            style={{ fontFamily: "'Syne', sans-serif" }}>
            Kies je <span className="text-[#4FC3F7]">Plan</span>
          </h2>
          <p className="text-slate-500 font-bold">
            Bescherm je trouwe viervoeter met AI-precisie.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
          {/* GRATIS PLAN */}
          <div className="w-full max-w-sm bg-white rounded-[2.5rem] border border-slate-200 p-10 flex flex-col shadow-sm">
            <div className="mb-8">
              <span className="bg-slate-100 text-slate-500 text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                Gratis
              </span>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-5xl font-black text-[#1A1A2E]">€0</span>
                <span className="text-slate-400 font-bold">/altijd</span>
              </div>
            </div>

            <div className="flex-grow">
              <ul className="space-y-5 mb-8">
                <li className="flex items-center gap-3 text-sm font-bold text-slate-600">
                  <CheckCircle2
                    size={18}
                    className="text-emerald-500 shrink-0"
                  />{" "}
                  1 Hond inbegrepen
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-600">
                  <CheckCircle2
                    size={18}
                    className="text-emerald-500 shrink-0"
                  />{" "}
                  1 AI-Scan per maand
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-600">
                  <CheckCircle2
                    size={18}
                    className="text-emerald-500 shrink-0"
                  />{" "}
                  Scan op 1 ziektebeeld
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-400">
                  <XCircle size={18} className="text-rose-400 shrink-0" />{" "}
                  Onbeperkt scannen
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-400">
                  <XCircle size={18} className="text-rose-400 shrink-0" /> Scan
                  op 12+ ziektebeelden
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-400">
                  <XCircle size={18} className="text-rose-400 shrink-0" /> PDF
                  Export / Historie
                </li>
              </ul>
            </div>

            <div className="mt-auto">
              <Button
                asChild
                variant="outline"
                className="w-full h-14 rounded-2xl border-2 font-black uppercase text-[11px] tracking-widest text-slate-400 hover:bg-slate-50 border-slate-100">
                <Link href="/sign-up">Huidig Plan</Link>
              </Button>
            </div>
          </div>

          {/* BASIS PLAN (POPULAIR) */}
          <div className="w-full max-w-sm mt-6 md:mt-0 relative">
            {/* BADGE - Fix: zit nu stevig bovenop de kaart */}
            <div className="absolute -top-5 left-0 right-0 flex justify-center z-30">
              <div className="bg-[#4FC3F7] text-white text-[11px] font-black px-6 py-2.5 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-2">
                <Sparkles size={14} fill="white" /> Meest Gekozen
              </div>
            </div>

            <div className="h-full bg-white rounded-[2.5rem] border-2 border-[#4FC3F7] p-10 flex flex-col shadow-2xl shadow-[#4FC3F7]/20 relative z-10">
              <div className="mb-8">
                <span className="bg-[#4FC3F7] text-white text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                  Basis
                </span>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-5xl font-black text-[#1A1A2E]">
                    €{totalPrice}
                  </span>
                  <span className="text-slate-400 font-bold">/mnd</span>
                </div>
                <p className="text-emerald-600 font-bold text-[10px] uppercase mt-3 flex items-center gap-2 tracking-widest">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />{" "}
                  Eerste 7 dagen gratis
                </p>
              </div>

              {/* DOG SELECTOR */}
              <div className="bg-[#F0F9FF] rounded-2xl p-4 mb-8 flex items-center justify-between border border-[#4FC3F7]/20">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-[#4FC3F7] tracking-tight">
                    Honden
                  </span>
                  <span className="text-2xl font-black italic text-[#1A1A2E] leading-none">
                    {dogCount}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => dogCount > 1 && setDogCount(dogCount - 1)}
                    className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center hover:bg-blue-50 transition-all border border-blue-100 text-[#4FC3F7]">
                    <Minus size={18} strokeWidth={3} />
                  </button>
                  <button
                    onClick={() => setDogCount(dogCount + 1)}
                    className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center hover:bg-blue-50 transition-all border border-blue-100 text-[#4FC3F7]">
                    <Plus size={18} strokeWidth={3} />
                  </button>
                </div>
              </div>

              <div className="flex-grow">
                <ul className="space-y-5 mb-8">
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <CheckCircle2
                      size={18}
                      className="text-[#4FC3F7] shrink-0"
                    />{" "}
                    Onbeperkt AI-Scans
                  </li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <CheckCircle2
                      size={18}
                      className="text-[#4FC3F7] shrink-0"
                    />{" "}
                    Scan op 12+ ziektebeelden
                  </li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <CheckCircle2
                      size={18}
                      className="text-[#4FC3F7] shrink-0"
                    />{" "}
                    PDF Rapportage dierenarts
                  </li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <CheckCircle2
                      size={18}
                      className="text-[#4FC3F7] shrink-0"
                    />{" "}
                    Volledige historie
                  </li>
                  <li className="flex items-center gap-3 text-sm font-bold text-[#4FC3F7]">
                    <CheckCircle2 size={18} className="shrink-0" /> {dogCount}{" "}
                    {dogCount === 1 ? "Hond" : "Honden"} beschermd
                  </li>
                </ul>
              </div>

              <Button
                asChild
                className="w-full h-16 rounded-[1.25rem] bg-[#4FC3F7] hover:bg-[#3db0e3] text-white font-black uppercase text-[12px] tracking-widest shadow-xl shadow-[#4FC3F7]/30 border-none transition-all active:scale-95">
                <Link href={`/sign-up?dogs=${dogCount}&trial=true`}>
                  Start Gratis Week
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
