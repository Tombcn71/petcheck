"use client";
import { useState, useRef, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

interface Result {
  summary?: string;
  isOk?: boolean;
  details?: string;
  advice?: string;
  error?: string;
}

interface Dog {
  id: string;
  name: string;
  image_url?: string;
}

const tools = [
  {
    id: "eyes",
    icon: "👁️",
    title: "Oog Check",
    description: "Check op irritatie of roodheid",
    bg: "#E6F1FB",
    color: "#0288D1",
  },
  {
    id: "poop",
    icon: "💩",
    title: "Ontlasting Analyse",
    description: "Detecteer afwijkingen in kleur",
    bg: "#F1EFE8",
    color: "#5D4037",
  },
  {
    id: "dental",
    icon: "🦷",
    title: "Gebit & Tandvlees",
    description: "Monitor tandsteen en tandvlees",
    bg: "#EAF3DE",
    color: "#388E3C",
  },
  {
    id: "skin",
    icon: "🐾",
    title: "Huid & Vacht",
    description: "Check op plekjes of irritatie",
    bg: "#FAEEDA",
    color: "#E65100",
  },
  {
    id: "bcs",
    icon: "⚖️",
    title: "Gewichts-check",
    description: "Beoordeel de BCS score",
    bg: "#F1F8E9",
    color: "#2E7D32",
  },
  {
    id: "pain",
    icon: "🐕",
    title: "Comfort Monitor",
    description: "AI-analyse van ongemak",
    bg: "#FCE4EC",
    color: "#D81B60",
  },
  {
    id: "coat",
    icon: "🐕",
    title: "Vachtkwaliteit",
    description: "Beoordeel glans en conditie",
    bg: "#FFF8E1",
    color: "#FF8F00",
  },
  {
    id: "nose",
    icon: "🐶",
    title: "Neus Analyse",
    description: "Check op droogheid of korstjes",
    bg: "#ECEFF1",
    color: "#455A64",
  },
  {
    id: "ticks",
    icon: "🕷️",
    title: "Teken Spotter",
    description: "Identificeer teken en risico's",
    bg: "#EEEDFE",
    color: "#6A1B9A",
  },
  {
    id: "fleas",
    icon: "🦟",
    title: "Parasieten Check",
    description: "Spoor vlooien of mijten op",
    bg: "#FBEAF0",
    color: "#AD1457",
  },
  {
    id: "mange",
    icon: "🔬",
    title: "Huidinfecties",
    description: "Check op hotspots of schimmel",
    bg: "#FCEBEB",
    color: "#C62828",
  },
  {
    id: "ears",
    icon: "🐶",
    title: "Oor Check",
    description: "Detecteer roodheid of mijt",
    bg: "#E1F5EE",
    color: "#00695C",
  },
];

function ScanContent() {
  const searchParams = useSearchParams();
  const dogId = searchParams.get("dogId");

  const [dog, setDog] = useState<Dog | null>(null);
  const [results, setResults] = useState<Record<string, Result>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Laad hondgegevens voor de header
  useEffect(() => {
    async function loadDog() {
      if (!dogId) return;
      try {
        const res = await fetch(`/api/dogs?dogId=${dogId}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setDog(data.find((d) => String(d.id) === String(dogId)));
        } else {
          setDog(data);
        }
      } catch (err) {
        console.error("Hond laden mislukt", err);
      }
    }
    loadDog();
  }, [dogId]);

  async function analyze(toolId: string, file: File) {
    setLoading((prev) => ({ ...prev, [toolId]: true }));
    const reader = new FileReader();

    reader.onload = async () => {
      const base64 = reader.result as string;
      setPreviews((prev) => ({ ...prev, [toolId]: base64 }));

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: base64,
            toolId,
            dogId: dogId ? parseInt(dogId) : null,
          }),
        });
        const data = await res.json();
        setResults((prev) => ({ ...prev, [toolId]: data }));
      } catch (err) {
        setResults((prev) => ({
          ...prev,
          [toolId]: { error: "Analyse mislukt." },
        }));
      } finally {
        setLoading((prev) => ({ ...prev, [toolId]: false }));
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="min-h-screen bg-[#F7F7FA] text-[#1A1A2E] font-sans p-6 md:p-12">
      <main className="max-w-7xl mx-auto">
        <Link
          href={`/dashboard?dogId=${dogId}`}
          className="inline-flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-[#4FC3F7] mb-8 transition-colors">
          <ArrowLeft size={14} /> Terug naar Dashboard
        </Link>

        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 md:h-20 md:w-20 rounded-3xl overflow-hidden border-4 border-white shadow-md bg-white shrink-0">
              {dog?.image_url ? (
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
              <h1
                className="text-3xl font-black uppercase tracking-tighter leading-none"
                style={{ fontFamily: "'Syne', sans-serif" }}>
                {dog?.name || "Honden"}
                <span className="text-[#4FC3F7]">Scan</span>
              </h1>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mt-2">
                AI-Analyse voor {dog?.name || "je hond"}
              </p>
            </div>
          </div>
          <Link href={`/dashboard/dossier?dogId=${dogId}`}>
            <Button
              variant="outline"
              className="rounded-xl font-bold uppercase text-[10px] tracking-widest border-2 border-slate-200 bg-white hover:bg-slate-50 shadow-sm transition-all h-12 px-6">
              📋 Bekijk Dossier van {dog?.name}
            </Button>
          </Link>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool) => {
            const res = results[tool.id];
            const isLoading = loading[tool.id];
            const preview = previews[tool.id];

            return (
              <Card
                key={tool.id}
                className="border-none shadow-sm ring-1 ring-slate-200 overflow-hidden hover:shadow-md transition-all bg-white rounded-[2rem]">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner"
                    style={{ background: tool.bg }}>
                    {tool.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold tracking-tight">
                      {tool.title}
                    </CardTitle>
                    <CardDescription className="text-xs leading-tight">
                      {tool.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="relative aspect-[16/10] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center group">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-slate-300 text-center font-bold text-[10px] uppercase tracking-widest">
                        📸 Upload foto
                      </div>
                    )}
                    {isLoading && (
                      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center">
                        <Loader2 className="w-6 h-6 text-[#1A1A2E] animate-spin" />
                        <span className="text-[10px] font-black mt-2 uppercase tracking-widest">
                          Scannen...
                        </span>
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={(el) => {
                      fileRefs.current[tool.id] = el;
                    }}
                    onChange={(e) =>
                      e.target.files?.[0] && analyze(tool.id, e.target.files[0])
                    }
                  />

                  <Button
                    className="w-full h-11 rounded-xl font-bold uppercase text-[11px] tracking-widest transition-all active:scale-95"
                    style={{ background: tool.bg, color: tool.color }}
                    onClick={() => fileRefs.current[tool.id]?.click()}
                    disabled={isLoading}>
                    {isLoading
                      ? "Bezig..."
                      : preview
                        ? "Nieuwe Foto"
                        : "Start Analyse"}
                  </Button>

                  {res && !isLoading && !res.error && (
                    <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div
                        className={`p-3 rounded-xl border text-center text-xs font-black uppercase tracking-widest ${res.isOk ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-700"}`}>
                        {res.summary}
                      </div>
                      <div className="mt-3 text-[13px] text-slate-600 leading-relaxed italic">
                        <strong>Inzicht:</strong> {res.details}
                      </div>
                      {res.advice && (
                        <div className="mt-2 p-3 bg-slate-50 rounded-xl border-l-4 border-[#1A1A2E] text-[12px] text-slate-800 font-bold">
                          {res.advice}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center uppercase font-black">Laden...</div>
      }>
      <ScanContent />
    </Suspense>
  );
}
