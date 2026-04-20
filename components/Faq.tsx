"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    question: "Can ik mijn abonnement op elk moment opzeggen?",
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
  return (
    <section className="py-24 bg-white border-t border-slate-50">
      <section id="faq" className="scroll-mt-20">
        {/* ... rest van je FAQ content ... */}
      </section>
      <div className="max-w-3xl mx-auto px-6">
        <header className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-slate-800"
            style={{ fontFamily: "'Syne', sans-serif" }}>
            Veelgestelde <span className="text-[#4FC3F7]">Vragen</span>
          </h2>
          <div className="h-1.5 w-16 bg-[#4FC3F7] mx-auto rounded-full mt-4" />
        </header>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-slate-100 rounded-[2rem] px-6 shadow-sm bg-white transition-all hover:border-[#4FC3F7]/30">
              <AccordionTrigger className="hover:no-underline py-6">
                <span className="text-left font-bold text-slate-700 hover:text-[#4FC3F7] transition-colors pr-4">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-slate-500 text-sm leading-relaxed border-t border-slate-50 pt-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
