"use client";

import { useState } from "react";
import {
  Camera,
  ArrowRight,
  Sparkles,
  Bone,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    breed: "",
    age: "",
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans text-[#1A1A2E]">
      <div className="w-full max-w-xl">
        {/* PROGRESS BAR */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= i ? "bg-[#4FC3F7]" : "bg-slate-200"}`}
            />
          ))}
        </div>

        {/* STAP 1: NAAM */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <header>
              <img
                src="/logo.png"
                className="w-8 h-8 mb-6 object-contain"
                alt="Logo"
              />
              <h1 className="text-5xl font-black uppercase tracking-tighter leading-[0.9]">
                Hoe heet <br /> <span className="text-[#4FC3F7]">je hond?</span>
              </h1>
            </header>
            <input
              autoFocus
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-8 border-4 border-[#1A1A2E] rounded-[2rem] font-black text-2xl uppercase outline-none focus:border-[#4FC3F7] transition-all"
              placeholder="NAAM HIER..."
            />
            <Button
              onClick={() => setStep(2)}
              disabled={!formData.name}
              className="w-full py-10 bg-[#1A1A2E] text-white font-black uppercase rounded-[2rem] text-xl shadow-[0_10px_0_0_#4FC3F7]">
              Volgende <ArrowRight className="ml-2" />
            </Button>
          </div>
        )}

        {/* STAP 2: FOTO */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-[0.9]">
              Heb je een <br />{" "}
              <span className="text-[#4FC3F7]">leuke foto?</span>
            </h1>
            <div className="w-full aspect-square bg-white border-4 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center cursor-pointer hover:border-[#4FC3F7] transition-all group">
              <Camera
                size={48}
                className="text-slate-200 group-hover:text-[#4FC3F7] mb-4"
              />
              <span className="text-slate-400 font-black uppercase text-xs">
                Klik om te uploaden
              </span>
            </div>
            <div className="flex flex-col gap-4">
              <Button
                onClick={() => setStep(3)}
                className="w-full py-8 bg-[#1A1A2E] text-white font-black uppercase rounded-[2rem]">
                Opslaan
              </Button>
              <button
                onClick={() => setStep(3)}
                className="text-slate-400 font-bold uppercase text-[10px]">
                Overslaan voor nu
              </button>
            </div>
          </div>
        )}

        {/* STAP 3: RAS & LEEFTIJD (Samengevoegd voor snelheid) */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <h1 className="text-5xl font-black uppercase tracking-tighter leading-[0.9]">
              Wat voor <span className="text-[#4FC3F7]">hond</span> <br /> is{" "}
              {formData.name}?
            </h1>
            <div className="space-y-4">
              <input
                placeholder="RAS (BIJV. LABRADOR)"
                className="w-full p-8 border-4 border-[#1A1A2E] rounded-[2rem] font-black text-xl uppercase outline-none focus:border-[#4FC3F7]"
                onChange={(e) =>
                  setFormData({ ...formData, breed: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="LEEFTIJD"
                className="w-full p-8 border-4 border-[#1A1A2E] rounded-[2rem] font-black text-xl uppercase outline-none focus:border-[#4FC3F7]"
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
              />
            </div>
            <Button
              onClick={() => setStep(4)}
              className="w-full py-10 bg-[#1A1A2E] text-white font-black uppercase rounded-[2rem] shadow-[0_10px_0_0_#4FC3F7]">
              Bijna klaar
            </Button>
          </div>
        )}

        {/* STAP 4: TRIAL ACTIVATIE (Cruciaal!) */}
        {step === 4 && (
          <div className="space-y-8 animate-in zoom-in-95 border-4 border-[#1A1A2E] p-10 rounded-[3rem] bg-white shadow-[20px_20px_0_0_#4FC3F7]">
            <div className="text-center space-y-2">
              <ShieldCheck className="mx-auto text-[#4FC3F7]" size={48} />
              <h2 className="text-4xl font-black uppercase tracking-tighter">
                Activeer proefweek
              </h2>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                Onbeperkt scannen voor {formData.name}
              </p>
            </div>

            <div className="bg-[#F8FAFC] p-6 rounded-[2rem] border-2 border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase text-slate-400">
                  Totaal vandaag
                </span>
                <span className="text-2xl font-black text-emerald-500">
                  €0,00
                </span>
              </div>
              <p className="text-[9px] font-bold text-slate-400 leading-tight uppercase">
                Na 7 dagen €9,99/mnd. We sturen je een herinnering voordat de
                proefperiode afloopt.
              </p>
            </div>

            <Button
              onClick={() => setStep(5)}
              className="w-full py-10 bg-[#4FC3F7] text-white font-black uppercase rounded-[2rem] text-xl shadow-[0_8px_0_0_#1A1A2E] active:translate-y-1 active:shadow-none transition-all">
              Start nu gratis
            </Button>
          </div>
        )}

        {/* STAP 5: SUCCES / DASHBOARD REDIRECT */}
        {step === 5 && (
          <div className="space-y-8 animate-in fade-in text-center">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.4)]">
              <Sparkles className="text-white" size={40} />
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter">
              Je bent <br /> <span className="text-[#4FC3F7]">Live!</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase text-xs">
              Je kunt nu je eerste scan maken.
            </p>
            <Button
              asChild
              className="w-full py-10 bg-[#1A1A2E] text-white font-black uppercase rounded-[2rem] text-xl">
              <a href="/dashboard">Naar Dashboard</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
