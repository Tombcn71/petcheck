"use client";
import { useState, useRef, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, X, Zap, ChevronRight } from "lucide-react";
import { TRIAL_DAYS } from "../../trial-config"; // Haal de centrale tijd op

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
    id: "pain",
    icon: "🤕",
    title: "Pijn Signalen",
    description: "Analyseer gezichtsuitdrukkingen op acute pijn",
    bg: "#FCE4EC",
    color: "#D81B60",
  },
  {
    id: "vomit",
    icon: "🤮",
    title: "Braaksel Analyse",
    description: "Analyseer kleur en inhoud op alarmsignalen",
    bg: "#F1F8E9",
    color: "#558B2F",
  },
  {
    id: "poop",
    icon: "💩",
    title: "Ontlasting Analyse",
    description: "Detecteer bloed, wormen en consistentie",
    bg: "#F1EFE8",
    color: "#5D4037",
  },
  {
    id: "eyes",
    icon: "👁️",
    title: "Oog Check",
    description: "Controleer op staar, roodheid of irritatie",
    bg: "#E6F1FB",
    color: "#0288D1",
  },
  {
    id: "ears",
    icon: "👂",
    title: "Oor Check",
    description: "Spoor diepliggende ontstekingen of mijt op",
    bg: "#E1F5EE",
    color: "#00695C",
  },
  {
    id: "nose",
    icon: "👃",
    title: "Neus Analyse",
    description: "Check op extreme droogheid of korstjes",
    bg: "#ECEFF1",
    color: "#455A64",
  },
  {
    id: "skin",
    icon: "🐾",
    title: "Huid & Allergie",
    description: "Herken hotspots, kale plekken en uitslag",
    bg: "#FAEEDA",
    color: "#E65100",
  },
  {
    id: "ticks",
    icon: "🕷️",
    title: "Parasieten & Teken",
    description: "Spoor actieve vlooien, mijten en teken op",
    bg: "#EEEDFE",
    color: "#6A1B9A",
  },
  {
    id: "mange",
    icon: "🔬",
    title: "Huidinfecties",
    description: "Maak onderscheid tussen schimmel of schurft",
    bg: "#FCEBEB",
    color: "#C62828",
  },
  {
    id: "dental",
    icon: "🦷",
    title: "Gebit & Tandvlees",
    description: "Monitor tandsteen en tandvleesontstekingen",
    bg: "#EAF3DE",
    color: "#388E3C",
  },
  {
    id: "symmetry",
    icon: "🪞",
    title: "Lichaams-Symmetrie",
    description: "Beoordeel de stand en gewichtsverdeling",
    bg: "#E0F7FA",
    color: "#00838F",
  },
  {
    id: "coat",
    icon: "🐕",
    title: "Vachtkwaliteit",
    description: "Beoordeel glans, dofheid en voedingstekorten",
    bg: "#FFF8E1",
    color: "#FF8F00",
  },
];

function ScanContent() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const dogId = searchParams.get("dogId");

  const [dog, setDog] = useState<Dog | null>(null);
  const [results, setResults] = useState<Record<string, Result>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const isPro = user?.publicMetadata?.role === "pro";
  const trialEndsAt = user?.publicMetadata?.trialEndsAt as string | undefined;

  const signupDate = user?.createdAt
    ? new Date(user.createdAt).getTime()
    : Date.now();
  const trialDurationMs = TRIAL_DAYS * 24 * 60 * 60 * 1000;
  const backupTrialExpired = Date.now() - signupDate > trialDurationMs;

  const trialExpired =
    !!user &&
    !isPro &&
    (trialEndsAt
      ? new Date(trialEndsAt).getTime() < Date.now()
      : backupTrialExpired);

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
    if (trialExpired) return;

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

        if (res.status === 403) {
          setResults((prev) => ({
            ...prev,
            [toolId]: { error: "Je proefperiode is verlopen." },
          }));
          return;
        }

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

  if (!isLoaded)
    return (
      <div className="p-20 text-center uppercase font-black">Laden...</div>
    );

  return (
    <div className="min-h-screen bg-[#F7F7FA] text-[#1A1A2E] font-sans p-6 md:p-12 relative">
      {/* EXACT DEZELFDE BRUTAAL MOOIE POPUP MET STRIPE DIRECT IN JE SCAN PAGINA */}
      {trialExpired && (
        <div className="fixed inset-0 bg-[#1A1A2E]/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full relative shadow-2xl border-4 border-[#4FC3F7]">
            <Link
              href="/dashboard"
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 transition-colors">
              <X size={24} strokeWidth={3} />
            </Link>

            <div className="text-center mb-8">
              <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-[#4FC3F7] fill-[#4FC3F7]" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tighter italic text-[#111827]">
                Trial voorbij
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-2 px-2">
                Je gratis week Doggyscan is afgelopen. Kies een plan om
                onbeperkt scans te blijven maken voor {dog?.name || "je hond"}.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() =>
                  (window.location.href = `/api/stripe/checkout?priceId=price_1TRDtmRK5rzSG2g74m7KLTE0`)
                }
                className="w-full group bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl hover:border-[#4FC3F7] transition-all text-left">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-black uppercase tracking-tighter text-sm text-[#111827]">
                    Maandelijks
                  </span>
                  <ChevronRight size={16} className="text-[#111827]" />
                </div>
                <div className="text-2xl font-black text-[#1A1A2E]">
                  €9,99
                  <span className="text-xs font-bold text-slate-400 uppercase ml-1">
                    /mnd
                  </span>
                </div>
              </button>

              <button
                onClick={() =>
                  (window.location.href = `/api/stripe/checkout?priceId=price_1TRDtmRK5rzSG2g7mqIpKZcW`)
                }
                className="w-full group bg-[#1A1A2E] border-2 border-[#1A1A2E] p-5 rounded-2xl hover:scale-[1.02] transition-all text-left shadow-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-black uppercase tracking-tighter text-sm text-[#4FC3F7]">
                    Jaarlijks
                  </span>
                  <span className="bg-[#4FC3F7] text-[#1A1A2E] text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
                    Bespaar 20%
                  </span>
                </div>
                <div className="text-2xl font-black text-white">
                  €99,00
                  <span className="text-xs font-bold text-slate-400 uppercase ml-1">
                    /jr
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <main
        className={`max-w-7xl mx-auto transition-all duration-500 ${trialExpired ? "blur-sm grayscale-[0.5] pointer-events-none" : ""}`}>
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
              className="rounded-xl font-bold uppercase text-[10px] tracking-widest border-2 border-slate-200 bg-white hover:bg-slate-50 shadow-sm h-12 px-6">
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
                  <div className="relative aspect-[16/10] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center">
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
                    disabled={isLoading || trialExpired}>
                    {isLoading
                      ? "Bezig..."
                      : trialExpired
                        ? "Trial verlopen"
                        : preview
                          ? "Nieuwe Foto"
                          : "Start Analyse"}
                  </Button>

                  {res && !isLoading && (
                    <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      {res.error ? (
                        <div className="p-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-center text-xs font-bold">
                          {res.error}
                        </div>
                      ) : (
                        <>
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
                        </>
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
