"use client";

import { useState } from "react";
import { CheckCircle2, Plus, Minus, Sparkles } from "lucide-react";
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
            Kies voor <span className="text-[#4FC3F7]">Zekerheid</span>
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
            Start je gratis week en ontdek de kracht van AI.
          </p>
        </header>

        <div className="flex justify-center">
          {/* BASIS PLAN (NU HET ENIGE PLAN) */}
          <div className="w-full max-w-md relative">
            {/* BADGE */}
            <div className="absolute -top-5 left-0 right-0 flex justify-center z-30">
              <div className="bg-[#1A1A2E] text-white text-[11px] font-black px-6 py-2.5 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-2">
                <Sparkles
                  size={14}
                  className="text-[#4FC3F7]"
                  fill="currentColor"
                />{" "}
                7 dagen proefperiode
              </div>
            </div>

            <div className="h-full bg-white rounded-[2.5rem] border-4 border-[#1A1A2E] p-10 flex flex-col shadow-[16px_16px_0px_0px_rgba(79,195,247,0.2)] relative z-10">
              <div className="mb-8 text-center">
                <span className="text-[#4FC3F7] text-[11px] font-black uppercase tracking-[0.2em]">
                  Premium Toegang
                </span>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-6xl font-black text-[#1A1A2E]">
                    €{totalPrice}
                  </span>
                  <span className="text-slate-400 font-bold text-lg">/mnd</span>
                </div>
                <p className="text-emerald-600 font-black text-[10px] uppercase mt-4 flex items-center justify-center gap-2 tracking-widest bg-emerald-50 py-2 rounded-full">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />{" "}
                  Eerste week volledig gratis
                </p>
              </div>

              {/* DOG SELECTOR */}
              <div className="bg-[#F8FAFC] rounded-2xl p-5 mb-8 flex items-center justify-between border-2 border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Aantal honden
                  </span>
                  <span className="text-3xl font-black text-[#1A1A2E] leading-none mt-1">
                    {dogCount}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => dogCount > 1 && setDogCount(dogCount - 1)}
                    className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center hover:bg-slate-50 transition-all border-2 border-slate-100 text-[#1A1A2E]">
                    <Minus size={20} strokeWidth={3} />
                  </button>
                  <button
                    onClick={() => setDogCount(dogCount + 1)}
                    className="w-12 h-12 bg-[#1A1A2E] rounded-xl shadow-sm flex items-center justify-center hover:bg-[#2A2A4E] transition-all text-white">
                    <Plus size={20} strokeWidth={3} />
                  </button>
                </div>
              </div>

              <div className="flex-grow">
                <ul className="space-y-4 mb-10">
                  {[
                    "Onbeperkt AI-Gezondheidsscans",
                    "Scan op 12+ ziektebeelden",
                    "Direct PDF Rapport voor de arts",
                    "Automatische Dossieropbouw",
                    "24/7 AI-Ondersteuning",
                  ].map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-4 text-sm font-bold text-slate-700">
                      <div className="bg-[#4FC3F7]/10 p-1 rounded-full">
                        <CheckCircle2
                          size={18}
                          className="text-[#4FC3F7] shrink-0"
                        />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                asChild
                className="w-full h-16 rounded-2xl bg-[#4FC3F7] hover:bg-[#1A1A2E] text-white font-black uppercase text-sm tracking-[0.15em] shadow-lg transition-all active:scale-95 border-none">
                <Link href={`/onboarding?dogs=${dogCount}&trial=true`}>
                  Start mijn gratis week
                </Link>
              </Button>

              <p className="text-center text-[10px] font-bold text-slate-400 uppercase mt-4 tracking-tighter">
                Geen verborgen kosten • Altijd direct opzegbaar
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
