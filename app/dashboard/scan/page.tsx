"use client";

import { useState, useRef, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PricingModal } from "@/components/PricingModal";

const TRIAL_DAYS = 0;

// Hier staan de tools gedefinieerd zodat ze overal in het bestand beschikbaar zijn
const tools = [
  {
    id: "pain",
    icon: "🤕",
    title: "Pijn Signalen",
    bg: "#FCE4EC",
    color: "#D81B60",
  },
  {
    id: "vomit",
    icon: "🤮",
    title: "Braaksel Analyse",
    bg: "#F1F8E9",
    color: "#558B2F",
  },
  {
    id: "poop",
    icon: "💩",
    title: "Ontlasting Analyse",
    bg: "#F1EFE8",
    color: "#5D4037",
  },
  {
    id: "eyes",
    icon: "👁️",
    title: "Oog Check",
    bg: "#E6F1FB",
    color: "#0288D1",
  },
  {
    id: "ears",
    icon: "👂",
    title: "Oor Check",
    bg: "#E1F5EE",
    color: "#00695C",
  },
  {
    id: "nose",
    icon: "👃",
    title: "Neus Analyse",
    bg: "#ECEFF1",
    color: "#455A64",
  },
  {
    id: "skin",
    icon: "🐾",
    title: "Huid & Allergie",
    bg: "#FAEEDA",
    color: "#E65100",
  },
  {
    id: "ticks",
    icon: "🕷️",
    title: "Parasieten & Teken",
    bg: "#EEEDFE",
    color: "#6A1B9A",
  },
  {
    id: "mange",
    icon: "🔬",
    title: "Huidinfecties",
    bg: "#FCEBEB",
    color: "#C62828",
  },
  {
    id: "dental",
    icon: "🦷",
    title: "Gebit & Tandvlees",
    bg: "#EAF3DE",
    color: "#388E3C",
  },
  {
    id: "symmetry",
    icon: "🪞",
    title: "Lichaams-Symmetrie",
    bg: "#E0F7FA",
    color: "#00838F",
  },
  {
    id: "coat",
    icon: "🐕",
    title: "Vachtkwaliteit",
    bg: "#FFF8E1",
    color: "#FF8F00",
  },
];

interface Result {
  summary?: string;
  isOk?: boolean;
  details?: string;
  advice?: string;
  error?: string;
}

function ScanContent() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const dogId = searchParams.get("dogId");

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

  // Functie om de foto te verkleinen voor de AI
  async function resizeImage(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1024;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
      };
    });
  }

  async function analyze(toolId: string, file: File) {
    if (trialExpired) return;
    setLoading((prev) => ({ ...prev, [toolId]: true }));
    try {
      const base64 = await resizeImage(file);
      setPreviews((prev) => ({ ...prev, [toolId]: base64 }));
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
              className="bg-white rounded-[2rem] border-none shadow-sm ring-1 ring-slate-200">
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
                <div className="aspect-[16/10] bg-slate-100 rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
                  {previews[tool.id] ? (
                    <img
                      src={previews[tool.id]}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "📸 Foto uploaden"
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
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
                  onClick={() => fileRefs.current[tool.id]?.click()}>
                  {loading[tool.id] ? "Bezig..." : "Start Analyse"}
                </Button>
                {results[tool.id] && (
                  <div className="text-xs space-y-2 mt-2 p-3 bg-slate-50 rounded-xl">
                    <p className="font-bold">{results[tool.id].summary}</p>
                    <p className="text-slate-600">{results[tool.id].advice}</p>
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
