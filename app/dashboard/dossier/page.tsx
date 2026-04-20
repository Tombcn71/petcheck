"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Trash2,
  CameraOff,
  Loader2,
  FileDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface DossierScan {
  id: string;
  tool_id: string;
  summary: string;
  details: string;
  advice: string;
  image_url: string;
  is_ok: boolean;
  created_at: string;
}

const dossierVertalingen: Record<string, string> = {
  alles: "Alles",
  eyes: "Ogen",
  poop: "Ontlasting",
  dental: "Gebit",
  skin: "Huid & Vacht",
  bcs: "Gewicht",
  pain: "Comfort",
  coat: "Vachtglans",
  nose: "Neus",
  ticks: "Teken",
  fleas: "Vlooien",
  mange: "Infecties",
  ears: "Oren",
};

function DossierContent() {
  const { user } = useUser();
  const [dossierItems, setDossierItems] = useState<DossierScan[]>([]);
  const [dog, setDog] = useState<any>(null); // State voor de hond, net als in Dashboard
  const [loading, setLoading] = useState(true);
  const [actieveTab, setActieveTab] = useState("alles");

  const searchParams = useSearchParams();
  const dogName = dog?.name || "Je hond";

  useEffect(() => {
    async function laadDossier() {
      try {
        // We gebruiken hier exact dezelfde routes als in je dashboard!
        const [resGeschiedenis, resHond] = await Promise.all([
          fetch("/api/geschiedenis"),
          fetch("/api/dogs"), // DASHBOARD STIJL
        ]);

        const data = await resGeschiedenis.json();
        const dogData = await resHond.json();

        const items = Array.isArray(data) ? data : [];
        setDossierItems(items);
        if (dogData) setDog(dogData);

        // 1. Check URL params voor tab-activatie
        const tabParam = searchParams.get("tab");
        if (
          tabParam &&
          (dossierVertalingen[tabParam] ||
            items.some((i) => i.tool_id === tabParam))
        ) {
          setActieveTab(tabParam);
        }

        // 2. Smooth scroll naar specifiek ID vanuit dashboard
        if (window.location.hash) {
          const targetId = window.location.hash.replace("#", "");
          setTimeout(() => {
            const element = document.getElementById(targetId);
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 600);
        }
      } catch (err) {
        console.error("Dossier error:", err);
      } finally {
        setLoading(false);
      }
    }
    laadDossier();
  }, [searchParams]);

  const dossierCategorieen = [
    "alles",
    ...Array.from(new Set(dossierItems.map((s) => s.tool_id))),
  ];

  async function verwijderDossierItem(id: string) {
    if (!confirm("Dit item verwijderen uit het dossier?")) return;
    try {
      const res = await fetch(`/api/geschiedenis/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDossierItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  }

  const gefilterdDossier = dossierItems.filter((item) => {
    return actieveTab === "alles" || item.tool_id === actieveTab;
  });

  if (loading)
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#4FC3F7]" />
      </div>
    );

  return (
    <div className="w-full max-w-7xl ml-0 text-left font-jakarta">
      {/* HEADER: Aangepast naar Dashboard look */}
      <header className="mb-12 border-b border-slate-100 pb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6 md:gap-8">
          {/* HONDENFOTO */}
          <div className="h-20 w-20 md:h-24 md:w-24 rounded-[2rem] overflow-hidden shadow-xl border-4 border-[#1A1A2E] shrink-0 bg-slate-50 flex items-center justify-center">
            {dog?.image_url ? (
              <img
                src={dog.image_url}
                alt={dogName}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-4xl">🐶</span>
            )}
          </div>

          <div className="flex flex-col">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#4FC3F7] hover:text-[#111827] transition-all mb-1">
              <ArrowLeft size={14} /> Terug naar Dashboard
            </Link>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-[#111827] uppercase italic leading-none">
              {dogName}'s{" "}
              <span className="text-[#4FC3F7] not-italic">Dossier</span>
            </h1>
          </div>
        </div>

        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1A1A2E] rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-[4px_4px_0_0_#4FC3F7] active:translate-y-1 active:shadow-none transition-all w-fit">
          <FileDown size={16} /> PDF Rapport
        </button>
      </header>

      {/* TABS */}
      <div className="mb-10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 ml-1">
          Filter op categorie
        </p>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-2 pb-4">
            {dossierCategorieen.map((cat) => (
              <button
                key={cat}
                onClick={() => setActieveTab(cat)}
                className={`rounded-xl px-6 py-2.5 text-xs font-bold transition-all border-2 ${
                  actieveTab === cat
                    ? "bg-[#4FC3F7] border-[#4FC3F7] text-white shadow-md shadow-[#4FC3F7]/20"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                }`}>
                {dossierVertalingen[cat] || cat}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-1 bg-slate-100" />
        </ScrollArea>
      </div>

      {/* GRID */}
      {gefilterdDossier.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem]">
          <p className="text-slate-400 text-sm font-medium italic">
            Geen scans gevonden in deze categorie.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {gefilterdDossier.map((item) => (
            <Card
              key={item.id}
              id={item.id}
              className={`rounded-[2.5rem] border-2 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl ${
                !item.is_ok
                  ? "border-red-200 ring-1 ring-red-50"
                  : "border-slate-300"
              }`}>
              <div className="relative h-56 md:h-64 bg-slate-50">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt="Scan"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-200">
                    <CameraOff size={40} />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-2 rounded-full shadow-md">
                  {item.is_ok ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <AlertCircle className="text-red-500" size={20} />
                  )}
                </div>
                <Badge
                  className={`absolute bottom-4 left-4 border-none text-[9px] font-black uppercase tracking-wider ${item.is_ok ? "bg-[#111827]" : "bg-red-600"} text-white py-1.5 px-3`}>
                  {dossierVertalingen[item.tool_id] || item.tool_id}
                </Badge>
              </div>

              <CardContent className="p-6 md:p-8">
                <div className="mb-4 text-left">
                  <h3 className="font-extrabold text-xl text-[#111827]">
                    {dossierVertalingen[item.tool_id] || item.tool_id}
                  </h3>
                  <p
                    className={`text-sm font-bold ${item.is_ok ? "text-green-600" : "text-red-600"} mt-1`}>
                    {item.summary}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 md:p-5 mb-6 border border-slate-100 text-left">
                  <p className="text-slate-600 text-[13px] md:text-sm leading-relaxed mb-3 italic">
                    "{item.details}"
                  </p>
                  {item.advice && (
                    <div className="pt-3 border-t border-slate-200">
                      <span className="text-[10px] font-black uppercase text-[#4FC3F7] tracking-wider block mb-1">
                        Dossier Advies:
                      </span>
                      <p className="text-[#111827] text-sm font-bold leading-snug">
                        {item.advice}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-auto">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] md:text-xs font-bold">
                    <Calendar size={14} className="text-[#4FC3F7]" />
                    {new Date(item.created_at).toLocaleDateString("nl-NL")}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => verwijderDossierItem(item.id)}
                    className="h-9 w-9 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DossierPagina() {
  return (
    <main className="min-h-screen bg-white p-4 md:p-10 lg:p-12 font-jakarta antialiased">
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Loader2 className="animate-spin text-[#4FC3F7]" />
          </div>
        }>
        <DossierContent />
      </Suspense>
    </main>
  );
}
