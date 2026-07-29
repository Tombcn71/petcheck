"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { X, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { genEventId } from "@/lib/eventId";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  dogId?: string;
}

export function PricingModal({ isOpen, onClose, dogId }: PricingModalProps) {
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && document.body) {
      setPortalTarget(document.body);
    }
  }, []);

  if (!isOpen || !portalTarget) return null;

  return createPortal(
    <div className="fixed inset-0 bg-white/85 backdrop-blur-xl flex items-center justify-center z-[999999] p-4 animate-in fade-in duration-300">
      {/* Container: w-[95vw] voor mobiel, max-w-md voor desktop */}
      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 w-[95vw] max-w-md max-h-[90vh] overflow-y-auto relative shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] transform animate-in zoom-in-95 duration-200">
        {/* Achtergrond branding gloed */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#4FC3F7]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Sluitknop */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-full transition-colors z-10"
          type="button">
          <X size={20} strokeWidth={3} />
        </button>

        {/* Jaarlijkse kaart - zelfde als Pricing.tsx */}
        <div className="mt-6 bg-white rounded-[2rem] border-4 border-[#4FC3F7] p-6 flex flex-col relative text-center shadow-[8px_8px_0px_0px_rgba(79,195,247,0.4)]">
          {/* 50% EARLY BIRD BADGE */}
          <div className="flex justify-center mb-4">
            <div className="bg-[#01579B] text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-2 border-2 border-white">
              <Sparkles size={14} className="text-[#4FC3F7]" />
              50% early bird korting
            </div>
          </div>

          <span className="text-[#4FC3F7] text-[11px] font-black uppercase tracking-[0.2em] mb-4">
            Jaarlijks Plan
          </span>

          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="text-4xl font-black text-[#01579B]">€60</span>
            <span className="text-[#4FC3F7] font-black text-lg">/jaar</span>
          </div>

          <div className="mb-6">
            <p className="text-slate-500 text-sm font-black line-through decoration-2">
              NORMAAL €120
            </p>
          </div>

          <ul className="space-y-3 mb-6 flex-grow text-left">
            {[
              "Toegang voor 3 honden",
              "Onbeperkte AI-gezondheidsscans",
              "Historisch medisch dossier",
              "PDF rapport voor de dierenarts",
              "Direct resultaat in 30 seconden",
            ].map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-xs font-bold text-slate-700 leading-tight">
                <CheckCircle2
                  size={16}
                  className="text-[#4FC3F7] shrink-0"
                  strokeWidth={3}
                />
                {feature}
              </li>
            ))}
          </ul>

          <button
            onClick={() => {
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
              window.location.href =
                "/api/stripe/checkout?priceId=price_1TRDtmRK5rzSG2g7mqIpKZcW";
            }}
            className="w-full h-16 rounded-2xl bg-[#01579B] hover:bg-[#4FC3F7] text-white font-black uppercase text-sm tracking-widest transition-all shadow-lg active:scale-95 border-none">
            Activeer Jaarplan
          </button>
        </div>

        {/* Privacy & Controle */}
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-slate-500 mb-1">
            <ShieldCheck size={11} className="text-slate-500" />
            <span className="text-[9px] font-bold uppercase tracking-wider">
              Privacy & Controle
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold leading-relaxed px-2">
            Geen behoefte om door te gaan? Je zit nergens aan vast. Je kunt je
            account en alle opgeslagen medische data op elk moment permanent
            vernietigen via de{" "}
            <Link
              href={`/dashboard/instellingen${dogId ? `?dogId=${dogId}` : ""}`}
              onClick={onClose}
              className="text-slate-600 font-bold underline hover:text-[#1A1A2E] transition-colors">
              Instellingen
            </Link>
            .
          </p>
        </div>
      </div>
    </div>,
    portalTarget,
  );
}
