"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Plus, Minus, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Pricing() {
  const [dogCount, setDogCount] = useState(1);
  // ORIGINELE PRIJS: 9.99 basis + 5.00 per extra hond
  const totalPrice = (9.99 + (dogCount - 1) * 5.0).toFixed(2);

  return (
    <section className="w-full bg-[#F8FAFC] py-24">
      <div className="max-w-5xl mx-auto px-6">
        <header className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-[#1A1A2E]"
            style={{ fontFamily: "'Syne', sans-serif" }}>
            Kies je <span className="text-[#4FC3F7]">Plan</span>
          </h2>
          <p className="text-slate-500 font-medium max-w-xl mx-auto italic">
            Upgrade voor volledige bescherming en onbeperkte scans op alle
            ziektebeelden.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {/* GRATIS KAART */}
          <Card className="rounded-[3rem] border-slate-200 shadow-sm flex flex-col bg-white overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="p-10 pb-6">
              <Badge
                variant="outline"
                className="w-fit mb-4 font-black uppercase tracking-[0.2em] text-[10px] text-slate-400 border-slate-200">
                Gratis
              </Badge>
              <CardTitle className="text-6xl font-black text-[#1A1A2E]">
                €0
              </CardTitle>
            </CardHeader>

            <CardContent className="p-10 pt-0 flex-grow">
              <ul className="space-y-5">
                {[
                  { text: "1 Hond inbegrepen", active: true },
                  { text: "1 AI-Scan per maand", active: true },
                  { text: "Scan op 1 ziektebeeld", active: true },
                  { text: "Onbeperkt scannen", active: false },
                  { text: "Scan op 12+ ziektebeelden", active: false },
                  { text: "PDF Export voor dierenarts", active: false },
                  { text: "Volledige medische historie", active: false },
                ].map((item, i) => (
                  <li
                    key={i}
                    className={`flex items-center gap-4 text-sm font-bold ${item.active ? "text-slate-700" : "text-slate-300 opacity-60"}`}>
                    {item.active ? (
                      <CheckCircle2
                        size={18}
                        className="text-emerald-500 shrink-0"
                      />
                    ) : (
                      <XCircle size={18} className="text-rose-400 shrink-0" />
                    )}
                    <span
                      className={
                        !item.active ? "line-through decoration-slate-200" : ""
                      }>
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="p-10 pt-0">
              <Button
                asChild
                variant="outline"
                className="w-full h-14 rounded-2xl font-black uppercase tracking-widest border-2 border-slate-100 text-slate-400 hover:bg-slate-50">
                <Link href="/sign-up">Probeer Gratis</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* BASIS KAART (Aanbevolen) */}
          <Card className="rounded-[3rem] border-2 border-[#4FC3F7] shadow-2xl shadow-[#4FC3F7]/10 flex flex-col relative bg-white md:scale-[1.05] z-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#4FC3F7] text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg">
              <Sparkles size={12} fill="white" /> Aanbevolen
            </div>

            <CardHeader className="p-10 pb-6">
              <Badge className="w-fit mb-4 bg-[#4FC3F7] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#4FC3F7]">
                Basis
              </Badge>
              <div className="flex flex-col">
                <CardTitle className="text-6xl font-black text-[#1A1A2E]">
                  €{totalPrice}
                </CardTitle>
                <div className="mt-3 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <p className="text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                    Eerste 7 dagen gratis
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-10 pt-0 flex-grow">
              {/* DOG SELECTOR */}
              <div className="bg-[#F0F9FF] rounded-[2rem] p-6 mb-8 border border-[#4FC3F7]/10">
                <div className="flex justify-between items-center mb-4 px-2">
                  <span className="text-[10px] font-black uppercase text-[#4FC3F7] tracking-widest">
                    Aantal honden
                  </span>
                  <span className="text-2xl font-black text-[#1A1A2E] italic">
                    {dogCount}
                  </span>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    className="flex-1 h-12 rounded-xl bg-white shadow-sm hover:bg-slate-50 border border-slate-100"
                    onClick={() => dogCount > 1 && setDogCount(dogCount - 1)}>
                    <Minus size={18} />
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1 h-12 rounded-xl bg-white shadow-sm hover:bg-slate-50 border border-slate-100"
                    onClick={() => setDogCount(dogCount + 1)}>
                    <Plus size={18} />
                  </Button>
                </div>
              </div>

              <ul className="space-y-5">
                {[
                  "Onbeperkt AI-Scans",
                  "Scan op 12+ ziektebeelden",
                  "PDF Rapportage dierenarts",
                  "Volledige historie",
                  `${dogCount} ${dogCount === 1 ? "Hond" : "Honden"} beschermd`,
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-4 text-sm font-bold text-slate-700">
                    <CheckCircle2
                      size={18}
                      className="text-emerald-500 shrink-0"
                    />
                    <span
                      className={
                        i === 1 ? "text-[#4FC3F7] font-extrabold" : ""
                      }>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="p-10 pt-0">
              <Button
                asChild
                className="w-full h-16 rounded-2xl bg-[#4FC3F7] hover:bg-[#3db0e3] text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-[#4FC3F7]/30 transition-all hover:scale-[1.02]">
                <Link href={`/sign-up?dogs=${dogCount}&trial=true`}>
                  Start Gratis Week
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
