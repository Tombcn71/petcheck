"use client";

import { useState, useRef, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import { PricingModal } from "@/components/PricingModal";

const TRIAL_DAYS = 7;

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
    bg: "#FCE4EC",
    color: "#D81B60",
    photoTip: "Maak een foto van het gezicht van je hond",
  },
  {
    id: "vomit",
    icon: "🤮",
    title: "Braaksel Analyse",
    bg: "#F1F8E9",
    color: "#558B2F",
    photoTip: "Maak een foto van het braaksel op de grond",
  },
  {
    id: "poop",
    icon: "💩",
    title: "Ontlasting Analyse",
    bg: "#F1EFE8",
    color: "#5D4037",
    photoTip: "Maak een foto van de ontlasting op de grond",
  },
  {
    id: "eyes",
    icon: "👁️",
    title: "Oog Check",
    bg: "#E6F1FB",
    color: "#0288D1",
    photoTip: "Maak een close-up van het oog of de ogen",
  },
  {
    id: "ears",
    icon: "🐶",
    title: "Oor Check",
    bg: "#E1F5EE",
    color: "#00695C",
    photoTip: "Maak een foto van het binnenste van het oor",
  },
  {
    id: "nose",
    icon: "🐽",
    title: "Neus Analyse",
    bg: "#ECEFF1",
    color: "#455A64",
    photoTip: "Maak een foto van de neus, goed belicht",
  },
  {
    id: "skin",
    icon: "🐾",
    title: "Huid & Allergie",
    bg: "#FAEEDA",
    color: "#E65100",
    photoTip: "Maak een foto van het aangetaste huidgebied",
  },
  {
    id: "ticks",
    icon: "🕷️",
    title: "Parasieten & Teken",
    bg: "#EEEDFE",
    color: "#6A1B9A",
    photoTip: "Maak een close-up van de teek of parasiet",
  },
  {
    id: "mange",
    icon: "🔬",
    title: "Huidinfecties",
    bg: "#FCEBEB",
    color: "#C62828",
    photoTip: "Maak een foto van de aangetaste plek op de huid",
  },
  {
    id: "dental",
    icon: "🦷",
    title: "Gebit & Tandvlees",
    bg: "#EAF3DE",
    color: "#388E3C",
    photoTip: "Maak een foto van de tanden, mond geopend",
  },
  {
    id: "symmetry",
    icon: "🪞",
    title: "Lichaams-Symmetrie",
    bg: "#E0F7FA",
    color: "#00838F",
    photoTip: "Maak een foto van je hond van voren, staand",
  },
  {
    id: "coat",
    icon: "🐕",
    title: "Vachtkwaliteit",
    bg: "#FFF8E1",
    color: "#FF8F00",
    photoTip: "Maak een close-up van de vacht",
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
        setDog(
          Array.isArray(data)
            ? data.find((d) => String(d.id) === String(dogId))
            : data,
        );
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
      <PricingModal
        isOpen={trialExpired}
        onClose={() => {
          // Stuur de gebruiker terug naar het dashboard bij het sluiten
          window.location.href = `/dashboard?dogId=${dogId}`;
        }}
        dogId={dogId || undefined}
      />
      <main
        className={`max-w-7xl mx-auto transition-all duration-500 ${trialExpired ? "blur-sm pointer-events-none" : ""}`}>
        <Link
          href={`/dashboard?dogId=${dogId}`}
          className="inline-flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-[#4FC3F7] mb-8">
          <ArrowLeft size={14} /> Terug naar Dashboard
        </Link>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Card
              key={tool.id}
              className={`bg-white rounded-[2rem] border-none shadow-sm ring-1 ring-slate-200 transition-all duration-300 ${loading[tool.id] ? "animate-pulse ring-2 ring-slate-400" : ""}`}>
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: tool.bg }}>
                  {tool.icon}
                </div>
                <CardTitle className="text-lg font-bold">
                  {tool.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[16/10] bg-slate-100 rounded-2xl mb-4 flex items-center justify-center overflow-hidden relative">
                  {previews[tool.id] ? (
                    <>
                      <img
                        src={previews[tool.id]}
                        className="w-full h-full object-cover"
                      />
                      {loading[tool.id] && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl">
                          <Loader2 className="animate-spin text-white" size={36} />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center px-4 py-2">
                      <p className="text-2xl mb-2">📸</p>
                      <p className="text-xs text-slate-500 leading-snug">{tool.photoTip}</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  ref={(el) => {
                    fileRefs.current[tool.id] = el;
                  }}
                  onChange={(e) =>
                    e.target.files?.[0] && analyze(tool.id, e.target.files[0])
                  }
                />
                <Button
                  className="w-full mb-4"
                  style={{ background: tool.bg, color: tool.color }}
                  disabled={loading[tool.id]}
                  onClick={() => fileRefs.current[tool.id]?.click()}>
                  {loading[tool.id] ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={16} />
                      Analyse bezig...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Upload size={16} />
                      Upload Foto
                    </span>
                  )}
                </Button>
                {results[tool.id] && (
                  <div className="text-xs space-y-2 mt-2 p-3 bg-slate-50 rounded-xl">
                    <p className="font-bold">{results[tool.id].summary}</p>
                    <p className="text-slate-600">{results[tool.id].advice}</p>
                    {results[tool.id].isOk === false && (
                      <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded-md font-bold mt-1">
                        Let op: Check dit bij een dierenarts.
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
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
