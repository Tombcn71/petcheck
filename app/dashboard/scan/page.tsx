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
import { TRIAL_DAYS } from "../../trial-config";
import { PricingModal } from "@/components/PricingModal";

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
        setDog(
          Array.isArray(data)
            ? data.find((d) => String(d.id) === String(dogId))
            : data,
        );
      } catch (err) {
        console.error("Fout bij laden hond", err);
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

  if (!isLoaded)
    return (
      <div className="p-20 text-center uppercase font-black">Laden...</div>
    );

  return (
    <div className="min-h-screen bg-[#F7F7FA] text-[#1A1A2E] font-sans p-6 md:p-12 relative">
      {trialExpired && (
        <div className="fixed inset-0 bg-[#1A1A2E]/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full relative shadow-2xl border-4 border-[#4FC3F7]">
            <Link
              href="/dashboard"
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-900">
              <X size={24} />
            </Link>
            <div className="text-center mb-8">
              <Zap size={32} className="text-[#4FC3F7] mx-auto mb-4" />
              <h2 className="text-2xl font-black uppercase">Trial voorbij</h2>
              <p className="text-xs text-slate-500 mt-2">
                Kies een plan om onbeperkt scans te maken.
              </p>
            </div>
            <div className="space-y-4">
              <button
                onClick={() =>
                  (window.location.href = `/api/stripe/checkout?priceId=price_1TRDtmRK5rzSG2g74m7KLTE0`)
                }
                className="w-full bg-slate-50 p-5 rounded-2xl border-2 border-slate-100 text-left">
                <div className="font-black text-sm">Maandelijks</div>
                <div className="text-2xl font-black">€9,99</div>
              </button>
              <button
                onClick={() =>
                  (window.location.href = `/api/stripe/checkout?priceId=price_1TRDtmRK5rzSG2g7mqIpKZcW`)
                }
                className="w-full bg-[#1A1A2E] p-5 rounded-2xl text-white text-left">
                <div className="font-black text-sm text-[#4FC3F7]">
                  Jaarlijks
                </div>
                <div className="text-2xl font-black">€99,00</div>
              </button>
            </div>
          </div>
        </div>
      )}

      <main
        className={`max-w-7xl mx-auto transition-all duration-500 ${trialExpired ? "blur-sm grayscale-[0.5]" : ""}`}>
        <Link
          href={`/dashboard?dogId=${dogId}`}
          className="inline-flex items-center gap-2 text-slate-400 font-bold mb-8">
          <ArrowLeft size={14} /> Terug
        </Link>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <CardTitle>{tool.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[16/10] bg-slate-100 rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
                  {previews[tool.id] ? (
                    <img
                      src={previews[tool.id]}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "📸"
                  )}
                </div>
                <Button
                  className="w-full"
                  onClick={() => fileRefs.current[tool.id]?.click()}
                  disabled={loading[tool.id]}>
                  {loading[tool.id] ? "Scannen..." : "Start Analyse"}
                </Button>
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
