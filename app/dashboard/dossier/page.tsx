"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

// --- Types ---
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

interface Dog {
  id: string;
  name: string;
  image_url?: string;
}

const dossierVertalingen: Record<string, string> = {
  alles: "Alles",
  pain: "Pijn Signalen",
  vomit: "Braaksel Analyse",
  poop: "Ontlasting Analyse",
  eyes: "Oog Check",
  ears: "Oor Check",
  nose: "Neus Analyse",
  skin: "Huid & Allergie",
  ticks: "Parasieten & Teken",
  mange: "Huidinfecties",
  dental: "Gebit & Tandvlees",
  symmetry: "Lichaams-Symmetrie",
  coat: "Vachtkwaliteit",
};

export const dynamic = "force-dynamic";

export default function DossierPagina() {
  return (
    <main className="min-h-screen bg-white font-jakarta antialiased">
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Loader2 className="animate-spin text-[#4FC3F7] h-10 w-10" />
          </div>
        }>
        <DossierContent />
      </Suspense>
    </main>
  );
}

function DossierContent() {
  const searchParams = useSearchParams();
  // Veilige check voor build-tijd
  const dogIdFromUrl = searchParams ? searchParams.get("dogId") : null;

  const [scans, setScans] = useState<DossierScan[]>([]);
  const [dog, setDog] = useState<Dog | null>(null);
  const [loading, setLoading] = useState(true);
  const [actieveTab, setActieveTab] = useState("alles");

  useEffect(() => {
    async function laadDossierData() {
      if (!dogIdFromUrl) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // 1. Haal de specifieke hondgegevens op
        const resHonden = await fetch(`/api/dogs?dogId=${dogIdFromUrl}`);
        const hondenData = await resHonden.json();

        if (Array.isArray(hondenData)) {
          setDog(
            hondenData.find(
              (d: Dog) => String(d.id) === String(dogIdFromUrl),
            ) || null,
          );
        } else {
          setDog(hondenData);
        }

        // 2. Haal de scans op
        const resScans = await fetch(`/api/scans?dogId=${dogIdFromUrl}`);
        const scansData = await resScans.json();

        if (Array.isArray(scansData)) {
          const sorted = scansData.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          );
          setScans(sorted);
        }
      } catch (err) {
        console.error("Dossier laad fout:", err);
      } finally {
        setLoading(false);
      }
    }

    laadDossierData();
  }, [dogIdFromUrl]);

  async function verwijderItem(id: string) {
    if (!confirm("Weet je zeker dat je deze scan wilt verwijderen?")) return;
    try {
      const res = await fetch(`/api/scans/${id}`, { method: "DELETE" });
      if (res.ok) {
        setScans((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  }

  const gefilterdeScans = scans.filter(
    (s) => actieveTab === "alles" || s.tool_id === actieveTab,
  );

  const uniekeTabs = [
    "alles",
    ...Array.from(new Set(scans.map((s) => s.tool_id))),
  ];

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#4FC3F7]" />
      </div>
    );
  }

  if (!dog) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold">Geen hond geselecteerd</h2>
        <Link href="/dashboard" className="text-[#4FC3F7] underline mt-4 block">
          Ga terug naar het dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-12">
      <Link
        href={`/dashboard?dogId=${dogIdFromUrl}`}
        className="inline-flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-[#4FC3F7] mb-8 transition-colors">
        <ArrowLeft size={14} /> Terug naar Dashboard
      </Link>

      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 md:h-20 md:w-20 rounded-3xl overflow-hidden border-4 border-slate-50 shadow-md bg-slate-50 shrink-0">
            {dog.image_url ? (
              <img
                src={dog.image_url}
                alt={dog.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">
                🐶
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-[#1A1A2E] uppercase tracking-tight italic leading-none">
              {dog.name}'s{" "}
              <span className="text-[#4FC3F7] not-italic px-1">/</span> Dossier
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
              Historie en AI-Analyses van {dog.name}
            </p>
          </div>
        </div>

        <Button className="bg-[#1A1A2E] text-white rounded-2xl px-6 h-12 hover:bg-[#4FC3F7] transition-all font-bold uppercase text-[10px] tracking-widest">
          <FileDown size={18} className="mr-2" /> PDF Export
        </Button>
      </header>

      <div className="mb-10">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-2 pb-4">
            {uniekeTabs.map((cat) => (
              <button
                key={cat}
                onClick={() => setActieveTab(cat)}
                className={`rounded-xl px-6 py-2.5 text-xs font-bold border-2 transition-all ${
                  actieveTab === cat
                    ? "bg-[#1A1A2E] border-[#1A1A2E] text-white"
                    : "bg-white border-slate-100 text-slate-400 hover:border-[#4FC3F7] hover:text-[#4FC3F7]"
                }`}>
                {dossierVertalingen[cat] || cat}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {gefilterdeScans.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem]">
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
            Nog geen scans gevonden voor {dog.name}
          </p>
        </div>
      ) : (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {gefilterdeScans.map((scan) => (
            <Card
              key={scan.id}
              className={`rounded-[2.5rem] border-none shadow-sm ring-1 ring-slate-100 overflow-hidden hover:shadow-md transition-all bg-white ${!scan.is_ok ? "ring-red-100 bg-red-50/20" : ""}`}>
              <div className="relative h-56 bg-slate-50">
                {scan.image_url ? (
                  <img
                    src={scan.image_url}
                    alt="Scan resultaat"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-200">
                    <CameraOff size={40} />
                  </div>
                )}
                <Badge
                  className={`absolute top-4 left-4 border-none text-[9px] font-black uppercase ${scan.is_ok ? "bg-[#1A1A2E]" : "bg-red-500"} text-white px-3 py-1`}>
                  {dossierVertalingen[scan.tool_id] || scan.tool_id}
                </Badge>
                <div className="absolute top-4 right-4 bg-white/90 p-1.5 rounded-full shadow-sm">
                  {scan.is_ok ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <AlertCircle className="text-red-500" size={20} />
                  )}
                </div>
              </div>

              <CardContent className="p-8">
                <h3 className="font-black text-lg text-[#1A1A2E] mb-2 uppercase italic leading-tight">
                  {scan.summary}
                </h3>
                <p className="text-slate-500 text-xs font-bold leading-relaxed mb-6">
                  {scan.details}
                </p>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-50 mb-6">
                  <span className="text-[9px] font-black uppercase text-[#4FC3F7] tracking-[0.2em] block mb-2">
                    AI Advies
                  </span>
                  <p
                    className={`text-[13px] font-bold leading-snug ${
                      !scan.is_ok ? "text-red-600" : "text-[#1A1A2E]"
                    }`}>
                    {scan.advice}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <Calendar size={14} className="text-[#4FC3F7]" />
                    {new Date(scan.created_at).toLocaleDateString("nl-NL")}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => verwijderItem(scan.id)}
                    className="text-slate-200 hover:text-red-500 hover:bg-transparent transition-colors">
                    <Trash2 size={18} />
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
