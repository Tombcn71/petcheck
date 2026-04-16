"use client";
import { useState } from "react";
import { CheckCircle2, XCircle, Plus, Minus, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Pricing() {
  const [dogCount, setDogCount] = useState(1);
  // ORIGINELE PRIJS: 9.99 basis + 5.00 per extra hond
  const totalPrice = (9.99 + (dogCount - 1) * 5.0).toFixed(2);

  return (
    <div className="w-full bg-[#F8FAFC] py-24 font-sans">
      <div className="max-w-5xl mx-auto px-4">
        <h2
          className="text-center text-4xl font-black uppercase tracking-tighter mb-4 text-slate-800 font-syne"
          style={{ fontFamily: "'Syne', sans-serif" }}>
          Kies je <span className="text-[#4FC3F7]">Plan</span>
        </h2>
        <p className="text-center text-slate-500 mb-16 font-medium max-w-xl mx-auto">
          Upgrade voor volledige bescherming en onbeperkte scans op alle
          ziektebeelden.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch max-w-4xl mx-auto">
          {/* GRATIS KAART - HERSTELD */}
          <div className="bg-white rounded-[3rem] p-10 border border-slate-200 flex flex-col shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">
              Gratis
            </h3>
            <div className="text-6xl font-black text-slate-800 mb-10">€0</div>

            <ul className="space-y-5 mb-12 flex-grow">
              <li className="flex items-center gap-4 font-bold text-slate-700 text-sm">
                <CheckCircle2 size={20} className="text-green-500" /> 1 Hond
                inbegrepen
              </li>
              <li className="flex items-center gap-4 font-bold text-slate-700 text-sm">
                <CheckCircle2 size={20} className="text-green-500" /> 1 AI-Scan
                per maand
              </li>
              <li className="flex items-center gap-4 font-bold text-slate-700 text-sm">
                <CheckCircle2 size={20} className="text-green-500" /> Scan op 1
                ziektebeeld (vlooien/teken)
              </li>

              <li className="flex items-center gap-4 font-bold text-slate-400 text-sm opacity-60">
                <XCircle size={20} className="text-red-500" />{" "}
                <span className="line-through decoration-slate-300">
                  Onbeperkt scannen
                </span>
              </li>
              <li className="flex items-center gap-4 font-bold text-slate-400 text-sm opacity-60">
                <XCircle size={20} className="text-red-500" />{" "}
                <span className="line-through decoration-slate-300">
                  Scan op 12+ ziektebeelden
                </span>
              </li>
              <li className="flex items-center gap-4 font-bold text-slate-400 text-sm opacity-60">
                <XCircle size={20} className="text-red-500" />{" "}
                <span className="line-through decoration-slate-300">
                  PDF Export voor dierenarts
                </span>
              </li>
              <li className="flex items-center gap-4 font-bold text-slate-400 text-sm opacity-60">
                <XCircle size={20} className="text-red-500" />{" "}
                <span className="line-through decoration-slate-300">
                  Volledige medische historie
                </span>
              </li>
            </ul>

            <Link
              href="/sign-up"
              className="w-full py-5 rounded-3xl border-2 border-slate-100 text-center font-bold text-slate-400 hover:bg-slate-50 transition-all text-sm uppercase tracking-widest">
              Probeer Gratis
            </Link>
          </div>

          {/* BASIS KAART - HERSTELD + TRIAL */}
          <div className="bg-white rounded-[3rem] p-10 border-2 border-[#4FC3F7] shadow-xl shadow-blue-100 flex flex-col relative scale-[1.03]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4FC3F7] text-white text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={12} /> Aanbevolen
            </div>

            <h3 className="text-sm font-black uppercase tracking-widest text-[#4FC3F7] mb-2">
              Basis
            </h3>
            <div className="flex flex-col mb-8">
              <div className="text-6xl font-black text-slate-800">
                €{totalPrice}
              </div>
              {/* TRIAL BADGE */}
              <div className="mt-2 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <p className="text-green-600 font-bold text-sm uppercase tracking-tighter">
                  Eerste 7 dagen gratis
                </p>
              </div>
            </div>

            {/* OPTELLER - HERSTELD */}
            <div className="bg-[#F0F9FF] rounded-3xl p-5 mb-10 border border-[#4FC3F7] border-opacity-10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] font-black uppercase text-[#4FC3F7]">
                  Aantal honden
                </span>
                <span className="text-xl font-bold text-slate-700">
                  {dogCount}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => dogCount > 1 && setDogCount(dogCount - 1)}
                  className="flex-1 bg-white h-12 rounded-xl flex items-center justify-center shadow-sm hover:bg-white active:scale-95 transition-all">
                  <Minus size={20} className="text-slate-600" />
                </button>
                <button
                  onClick={() => setDogCount(dogCount + 1)}
                  className="flex-1 bg-white h-12 rounded-xl flex items-center justify-center shadow-sm hover:bg-white active:scale-95 transition-all">
                  <Plus size={20} className="text-slate-600" />
                </button>
              </div>
            </div>

            <ul className="space-y-5 mb-10 flex-grow">
              <li className="flex items-center gap-4 font-bold text-slate-700 text-sm">
                <CheckCircle2 size={20} className="text-green-500" /> Onbeperkt
                AI-Scans
              </li>
              <li className="flex items-center gap-4 font-bold text-slate-700 text-sm">
                <CheckCircle2 size={20} className="text-green-500" />{" "}
                <span className="font-extrabold text-[#4FC3F7]">
                  Scan op 12+ ziektebeelden
                </span>
              </li>
              <li className="flex items-center gap-4 font-bold text-slate-700 text-sm">
                <CheckCircle2 size={20} className="text-green-500" /> PDF
                Rapportage dierenarts
              </li>
              <li className="flex items-center gap-4 font-bold text-slate-700 text-sm">
                <CheckCircle2 size={20} className="text-green-500" /> Volledige
                historie
              </li>
              <li className="flex items-center gap-4 font-bold text-slate-700 text-sm">
                <CheckCircle2 size={20} className="text-green-500" /> {dogCount}{" "}
                {dogCount === 1 ? "Hond" : "Honden"} beschermd
              </li>
            </ul>

            <Link
              href={`/sign-up?dogs=${dogCount}&trial=true`}
              className="w-full py-5 rounded-3xl bg-[#4FC3F7] text-white text-center font-bold shadow-lg shadow-blue-200 hover:brightness-105 transition-all uppercase tracking-widest text-sm">
              Start Gratis Week
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
