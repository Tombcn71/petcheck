"use client";

import { CheckCircle2, Sparkles, Gift, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs"; // Toegevoegd voor trial check
import { genEventId } from "@/lib/eventId";

export default function Pricing() {
  const { user, isLoaded } = useUser();

  // Trial Logica (Zelfde als op je scan-pagina)
  const isPro = user?.publicMetadata?.role === "pro";
  const trialEndsAt = user?.publicMetadata?.trialEndsAt as string | undefined;
  const trialExpired =
    !isPro &&
    (trialEndsAt ? new Date(trialEndsAt).getTime() < Date.now() : false);

  const features = [
    "Toegang voor 2 honden",
    "Onbeperkte AI-gezondheidsscans",
    "Historisch medisch dossier",
    "PDF rapport voor de dierenarts",
    "Direct resultaat in 30 seconden",
  ];

  return (
    <section
      id="pricing"
      className="w-full bg-[#F0F9FF] py-20 font-sans scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* HEADER */}
        <header className="text-center mb-16 max-w-2xl mx-auto">
          <h2
            className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4 text-[#01579B]"
            style={{ fontFamily: "'Syne', sans-serif" }}>
            {/* PAS TEKST AAN OP BASIS VAN TRIAL STATUS */}
            {trialExpired ? (
              <>
                KIES JOUW <span className="text-[#4FC3F7]">PLAN</span>
              </>
            ) : (
              <>
                🏷️ EARLY BIRD <span className="text-[#4FC3F7]">DEAL</span>
              </>
            )}
          </h2>
          <p className="text-slate-500 font-bold text-lg leading-relaxed">
            {trialExpired
              ? "Je proefperiode is afgelopen. Activeer je account om direct weer scans te kunnen maken."
              : "Ontdek wat AI voor het welzijn van je hond kan betekenen."}
            <span className="block text-[#0288D1] font-black text-sm mt-2 uppercase tracking-[0.2em]">
              {trialExpired
                ? "Altijd opzegbaar • Direct actief"
                : "Geen betaalgegevens nodig om te starten"}
            </span>
          </p>
        </header>

        <div className="flex justify-center max-w-md mx-auto">
          {/* JAARLIJKSE KAART (DE DEAL) */}
          <div className="bg-white rounded-[2.5rem] border-4 border-[#4FC3F7] p-8 flex flex-col relative text-center shadow-[16px_16px_0px_0px_rgba(79,195,247,0.4)] transition-transform hover:scale-[1.02]">
            {/* 6 MAANDEN GRATIS BADGE */}
            <div className="absolute -top-6 left-0 right-0 flex justify-center z-30">
              <div className="bg-[#01579B] text-white text-[12px] font-black px-6 py-3 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-2 border-2 border-white">
                <Gift size={16} className="text-[#4FC3F7]" />
                50% early bird korting
              </div>
            </div>

            <span className="text-[#4FC3F7] text-[11px] font-black uppercase tracking-[0.2em] mb-6">
              Jaarlijks Plan
            </span>

            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-6xl font-black text-[#01579B]">€60</span>
              <span className="text-[#4FC3F7] font-black text-2xl">/jaar</span>
            </div>

            <div className="mb-8">
              <p className="text-slate-500 text-lg font-black line-through decoration-2">
                NORMAAL €120
              </p>
            </div>

            <ul className="space-y-4 mb-10 flex-grow text-left">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-4 text-sm font-bold text-slate-700 leading-tight">
                  <CheckCircle2
                    size={18}
                    className="text-[#4FC3F7] shrink-0"
                    strokeWidth={3}
                  />
                  {feature}
                </li>
              ))}
              <li className="flex items-start gap-4 text-sm font-black text-[#0288D1] leading-tight italic">
                <Zap
                  size={18}
                  className="text-[#4FC3F7] shrink-0"
                  fill="currentColor"
                />
                Bespaar 50% per jaar!
              </li>
            </ul>

            <Button
              asChild
              className="w-full h-20 rounded-2xl bg-[#01579B] hover:bg-[#4FC3F7] text-white font-black uppercase text-lg tracking-widest transition-all shadow-lg active:scale-95 border-none">
              <Link
                href={
                  trialExpired
                    ? "/api/stripe/checkout?priceId=price_1TRDtmRK5rzSG2g7mqIpKZcW"
                    : "/signup?interval=year&dogs=3"
                }
                onClick={() => {
                  if (trialExpired) {
                    const eventId = genEventId();
                    window.fbq?.(
                      "track",
                      "InitiateCheckout",
                      { value: 60, currency: "EUR" },
                      { eventID: eventId },
                    );
                    fetch("/api/track", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        eventName: "InitiateCheckout",
                        eventId,
                        value: 60,
                        currency: "EUR",
                      }),
                      keepalive: true,
                    }).catch(() => {});
                  } else if (!localStorage.getItem("fb-lead-fired")) {
                    const eventId = genEventId();
                    window.fbq?.("track", "Lead", {}, { eventID: eventId });
                    fetch("/api/track", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ eventName: "Lead", eventId }),
                      keepalive: true,
                    }).catch(() => {});
                    localStorage.setItem("fb-lead-fired", "1");
                  }
                }}>
                {trialExpired ? "Activeer Jaarlijks" : "Start Gratis Week"}
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="flex items-center justify-center gap-2 text-[#4FC3F7] mb-4">
            <Sparkles size={20} fill="currentColor" />
            <span className="text-sm font-black uppercase tracking-[0.3em] text-[#01579B]">
              Kwaliteitsgarantie
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            {trialExpired
              ? "Direct toegang tot alle 12 scans • Altijd opzegbaar"
              : "7 dagen proefperiode • Altijd opzegbaar • Geen betaalgegevens nodig"}
          </p>
        </div>
      </div>
    </section>
  );
}
