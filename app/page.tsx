"use client";

import Link from "next/link";
import { Show, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PawPrint, ArrowRight, Sparkles } from "lucide-react"; // Of lucide-react
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";

const features = [
  {
    icon: "👁️",
    title: "Oog Check",
    desc: "Controleer op staar, rode ogen en ontstekingen.",
  },
  {
    icon: "💩",
    title: "Ontlasting Analyse",
    desc: "Check op bloed, consistentie en tekenen van wormen.",
  },
  {
    icon: "🦷",
    title: "Gebit & Tandvlees",
    desc: "Monitor tandsteen en ontstoken tandvlees (gingivitis).",
  },
  {
    icon: "🐾",
    title: "Huid & Allergie",
    desc: "Herken schimmels, hotspots en allergische uitslag.",
  },
  {
    icon: "⚖️",
    title: "Gewicht & Conditie",
    desc: "Krijg advies over de Body Condition Score van je hond.",
  },
  {
    icon: "🤕",
    title: "Pijn Signalen",
    desc: "AI-analyse van de gezichtsuitdrukking voor acute pijn.",
  },
  {
    icon: "✨",
    title: "Vacht & Glans",
    desc: "Beoordeel doffe vacht en mogelijke voedingstekorten.",
  },
  {
    icon: "🐶",
    title: "Neus Check",
    desc: "Check op korsten, extreme droogheid of loopneuzen.",
  },
  {
    icon: "🦟",
    title: "Ongedierte Spotter",
    desc: "Vind vlooien en mijten tussen de haren van je hond.",
  },
  {
    icon: "🕷️",
    title: "Teken Identificatie",
    desc: "Identificeer de teek en bepaal het risico op Lyme.",
  },
  {
    icon: "👂",
    title: "Oor Gezondheid",
    desc: "Spoor oormijt en diepliggende ontstekingen op.",
  },
  {
    icon: "🔬",
    title: "Ringworm & Schurft",
    desc: "Maak direct onderscheid tussen verschillende parasieten.",
  },
];

export default function Home() {
  return (
    <div className="bg-white text-[#1A1A2E] font-sans overflow-x-hidden">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Syne:wght@800&family=DM+Sans:wght@400;500;700&display=swap");
      `}</style>

      {/* HERO SECTION */}
      <main className="relative max-w-[1200px] mx-auto px-6 py-24 md:py-32 text-center">
        {/* Subtiele achtergrond gloed */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#4FC3F7]/10 via-transparent to-transparent -z-10" />

        <Badge
          variant="secondary"
          className="bg-[#E6F1FB] text-[#0288D1] border-none px-4 py-1.5 mb-8 rounded-full font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 mr-2" />
          Next-Gen Veterinary AI
        </Badge>

        <h1
          className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.95] mb-8"
          style={{ fontFamily: "'Syne', sans-serif" }}>
          Zorg voor je hond, <br />
          <span className="text-[#4FC3F7] ">simpel gemaakt.</span>
        </h1>

        <p className="text-lg md:text-xl text-[#6B6B8A] max-w-[700px] mx-auto mb-12 leading-relaxed font-medium">
          De meest geavanceerde AI-tool voor hondenbezitters in Nederland.
          Analyseer symptomen en welzijn direct vanaf een foto.
        </p>

        <div className="flex justify-center items-center gap-4">
          <Show when="signed-out">
            <SignUpButton mode="modal">
              <Button
                size="lg"
                className="bg-[#1A1A2E] hover:bg-black text-white px-10 h-16 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-[#1A1A2E]/20">
                Start Gratis Check <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-[#1A1A2E] hover:bg-black text-white px-10 h-16 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-[#1A1A2E]/20">
                Naar mijn Dashboard <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </Show>
        </div>
      </main>

      {/* FEATURE SECTION */}
      <section className="bg-[#F9FAFB] py-24 px-6 border-y border-slate-100">
        <div className="max-w-[1200px] mx-auto">
          <header className="text-center mb-20">
            <h2
              className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4"
              style={{ fontFamily: "'Syne', sans-serif" }}>
              Medische Mogelijkheden
            </h2>
            <div className="h-1.5 w-20 bg-[#4FC3F7] mx-auto rounded-full" />
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <Card
                key={i}
                className="bg-white border-slate-200/60 rounded-[32px] overflow-hidden hover:border-[#4FC3F7] hover:shadow-2xl hover:shadow-[#4FC3F7]/10 transition-all duration-500 group cursor-default">
                <CardHeader className="pb-2 p-8">
                  <div className="text-4xl mb-6 group-hover:scale-125 transition-transform duration-500 origin-left inline-block">
                    {f.icon}
                  </div>
                  <CardTitle
                    className="text-lg font-black uppercase italic tracking-tight"
                    style={{ fontFamily: "'Syne', sans-serif" }}>
                    {f.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <p className="text-[#6B6B8A] text-sm leading-relaxed font-medium">
                    {f.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Pricing />
      <Faq />

      {/* FOOTER */}
      <footer className="py-20 px-6 text-center border-t border-slate-100 bg-white">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 text-xl font-black uppercase tracking-tighter mb-6 text-[#1A1A2E]"
          style={{ fontFamily: "'Syne', sans-serif" }}>
          <PawPrint className="text-[#4FC3F7] w-6 h-6" fill="currentColor" />
          PetCheck.ai
        </Link>
        <div className="max-w-md mx-auto">
          <p className="text-[#AAAAAA] text-xs font-bold uppercase tracking-[0.2em] leading-relaxed">
            © 2026 PetCheck AI. <br />
            <span className="opacity-50 text-[10px]">
              Voor informatieve doeleinden. Vervangt geen professioneel
              dierenartsadvies.
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
