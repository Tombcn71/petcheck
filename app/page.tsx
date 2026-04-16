"use client";
import Link from "next/link";
import { Show, SignUpButton } from "@clerk/nextjs";
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
      <main className="max-w-[1200px] mx-auto px-5 py-24 text-center">
        <div className="inline-block px-3 py-1 bg-[#E6F1FB] text-[#0288D1] rounded-full text-xs font-semibold mb-5">
          Next-Gen Veterinary AI
        </div>

        <h1
          className="text-2xl md:text-5xl font-extrabold uppercase tracking-tighter leading-[1.05] mb-6"
          style={{ fontFamily: "'Syne', sans-serif" }}>
          Zorg voor je hond, <br />
          <span className="text-[#4FC3F7]">simpel gemaakt.</span>
        </h1>

        <p className="text-lg md:text-xl text-[#6B6B8A] max-w-[600px] mx-auto mb-10 leading-relaxed">
          De meest geavanceerde AI-tool voor hondenbezitters in Nederland.
          Analyseer symptomen en welzijn direct vanaf een foto.
        </p>

        <div className="flex justify-center">
          <Show when="signed-out">
            <SignUpButton mode="modal">
              <button className="bg-[#1A1A2E] text-white px-10 py-4.5 rounded-[14px] font-bold text-lg hover:scale-105 transition-transform">
                Start Gratis Check →
              </button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="bg-[#1A1A2E] text-white px-10 py-4.5 rounded-[14px] font-bold text-lg hover:scale-105 transition-transform inline-block">
              Naar mijn Dashboard →
            </Link>
          </Show>
        </div>
      </main>
      {/* FEATURE SECTION */}
      <section className="bg-[#F9FAFB] py-20 px-5">
        <div className="max-w-[1200px] mx-auto">
          <h2
            className="text-2xl md:text-xl font-extrabold uppercase text-center mb-12 tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}>
            Medische Mogelijkheden
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-[24px] border border-[#E5E7EB] hover:border-[#4FC3F7] hover:shadow-xl transition-all duration-300 group">
                <div className="text-3xl mb-5 group-hover:scale-110 transition-transform inline-block">
                  {f.icon}
                </div>
                <h3
                  className="text-sm font-bold mb-2 uppercase tracking-tight font-syne"
                  style={{ fontFamily: "'Syne', sans-serif" }}>
                  {f.title}
                </h3>
                <p className="text-[#6B6B8A] text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Pricing /> <Faq />
      {/* FOOTER */}
      <footer className="py-14 px-5 text-center border-t border-[#F3F4F6]">
        <Link
          href="/"
          className="inline-block text-base font-extrabold uppercase mb-4 text-[#1A1A2E]"
          style={{ fontFamily: "'Syne', sans-serif" }}>
          🐾 PetCheck.ai
        </Link>
        <p className="text-[#AAAAAA] text-xs leading-relaxed">
          © 2026 PetCheck AI. Voor informatieve doeleinden. <br />
          Vervangt geen professioneel dierenartsadvies.
        </p>
      </footer>
    </div>
  );
}
