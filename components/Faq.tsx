"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "Welke 12 ziektebeelden kan de AI herkennen?",
    answer:
      "Onze AI is getraind op duizenden klinische beelden en herkent onder andere huidinfecties, hotspots, teken/vlooien, oogontstekingen, tekenen van staar, oorproblemen en diverse huiduitslag. Het Basis plan geeft je toegang tot de volledige database.",
  },
  {
    question: "Vervangt deze app een bezoek aan de dierenarts?",
    answer:
      "Nee, PetCheck is een preventief hulpmiddel. Het helpt je om symptomen vroegtijdig te herkennen en geeft je een medisch rapport dat je kunt delen met je dierenarts. Bij spoed moet je altijd direct contact opnemen met een specialist.",
  },
  {
    question: "Hoe nauwkeurig is de AI-scan?",
    answer:
      "De nauwkeurigheid ligt momenteel boven de 90% voor de meest voorkomende huidaandoeningen. Voor een optimaal resultaat raden we aan om foto's te maken bij goed daglicht en scherp te stellen op het probleemgebied.",
  },
  {
    question: "Kan ik mijn abonnement op elk moment opzeggen?",
    answer:
      "Zeker. We werken niet met wurgcontracten. Je kunt je Basis plan op elk moment met één klik stopzetten via je profielinstellingen. Je behoudt toegang tot je historie tot het einde van je factuurperiode.",
  },
  {
    question: "Hoe werkt de optie voor meerdere honden?",
    answer:
      "In het Basis plan betaal je een vast bedrag voor de eerste hond en een gereduceerd tarief (€5,00) voor elke extra hond. Zo blijft professionele zorg betaalbaar voor gezinnen met meerdere viervoeters.",
  },
];

export default function Faq() {
  // DE GEFIXTE REGEL (GEEN RONDE HAAKJES OM DE STATE):
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-white border-t border-slate-50">
      <div className="max-w-3xl mx-auto px-6">
        <h2
          className="text-3xl font-black uppercase tracking-tighter text-center mb-12 text-slate-800"
          style={{ fontFamily: "'Syne', sans-serif" }}>
          Veelgestelde <span className="text-[#4FC3F7]">Vragen</span>
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-slate-100 rounded-[2rem] overflow-hidden transition-all shadow-sm bg-white">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 text-left flex justify-between items-center hover:bg-slate-50 transition-colors group">
                <span className="font-bold text-slate-700 group-hover:text-[#4FC3F7] transition-colors pr-4">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="text-[#4FC3F7] shrink-0" size={20} />
                ) : (
                  <ChevronDown className="text-slate-400 shrink-0" size={20} />
                )}
              </button>

              {openIndex === index && (
                <div className="p-6 pt-0 text-slate-500 text-sm leading-relaxed border-t border-slate-50 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
