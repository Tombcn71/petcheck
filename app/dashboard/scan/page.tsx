"use client";

import { useState, useRef, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, Image } from "lucide-react";
import { PricingModal } from "@/components/PricingModal";

const TRIAL_DAYS = 0;

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

function ToolView({
  tool,
  dogId,
  onBack,
}: {
  tool: (typeof tools)[0];
  dogId: string | null;
  onBack: () => void;
}) {
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const cameraRef = useRef<HTMLInputElement | null>(null);
  const galleryRef = useRef<HTMLInputElement | null>(null);

  async function analyze(file: File) {
    setLoading(true);
    try {
      const previewUrl = URL.createObjectURL(file);
      setPreview((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
        return previewUrl;
      });

      const form = new FormData();
      form.append("image", file);
      form.append("toolId", tool.id);
      if (dogId) form.append("dogId", dogId);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Analyse mislukt." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7FA] p-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-[#4FC3F7] mb-8">
        <ArrowLeft size={14} /> Terug
      </button>

      <div className="max-w-sm mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
            style={{ background: tool.bg }}>
            {tool.icon}
          </div>
          <h1 className="text-2xl font-black">{tool.title}</h1>
        </div>

        <div className="aspect-[4/3] bg-slate-100 rounded-2xl mb-6 flex items-center justify-center overflow-hidden">
          {preview ? (
            <img
              src={preview}
              className="w-full h-full object-cover"
              alt="Preview"
            />
          ) : (
            <span className="text-slate-400">📸 Foto uploaden</span>
          )}
        </div>

        <input
          type="file"
          accept="image/jpeg"
          capture="environment"
          className="hidden"
          ref={cameraRef}
          onChange={(e) => {
            if (e.target.files?.[0]) {
              analyze(e.target.files[0]);
              e.target.value = "";
            }
          }}
        />
        <input
          type="file"
          accept="image/jpeg"
          className="hidden"
          ref={galleryRef}
          onChange={(e) => {
            if (e.target.files?.[0]) {
              analyze(e.target.files[0]);
              e.target.value = "";
            }
          }}
        />

        <div className="flex gap-3 mb-6">
          <Button
            className="flex-1 flex items-center justify-center gap-2"
            style={{ background: tool.bg, color: tool.color }}
            disabled={loading}
            onClick={() => cameraRef.current?.click()}>
            <Camera size={16} />
            {loading ? "Bezig..." : "Camera"}
          </Button>
          <Button
            className="flex-1 flex items-center justify-center gap-2"
            style={{ background: tool.bg, color: tool.color }}
            disabled={loading}
            onClick={() => galleryRef.current?.click()}>
            <Image size={16} />
            Galerij
          </Button>
        </div>

        {result && (
          <div className="p-4 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 space-y-2">
            <p className="font-bold">{result.summary}</p>
            <p className="text-sm text-slate-600">{result.advice}</p>
            {result.isOk === false && (
              <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded-md font-bold text-xs mt-1">
                Let op: Check dit bij een dierenarts.
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ScanContent() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const dogId = searchParams.get("dogId");

  const [selectedTool, setSelectedTool] = useState<(typeof tools)[0] | null>(
    null,
  );

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

  if (!isLoaded)
    return (
      <div className="p-20 text-center uppercase font-black">Laden...</div>
    );

  if (selectedTool) {
    return (
      <ToolView
        tool={selectedTool}
        dogId={dogId}
        onBack={() => setSelectedTool(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7FA] text-[#1A1A2E] p-6 md:p-12">
      <PricingModal
        isOpen={trialExpired}
        onClose={() => {
          window.location.href = `/dashboard?dogId=${dogId}`;
        }}
        dogId={dogId || undefined}
      />
      <main
        className={`max-w-7xl mx-auto ${trialExpired ? "blur-sm pointer-events-none" : ""}`}>
        <Link
          href={`/dashboard?dogId=${dogId}`}
          className="inline-flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-[#4FC3F7] mb-8">
          <ArrowLeft size={14} /> Terug naar Dashboard
        </Link>

        {/* Selectiescherm — alleen iconen, geen inputs of refs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool)}
              className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-slate-200 flex flex-col items-center gap-3 hover:ring-2 active:scale-95 transition-all">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                style={{ background: tool.bg }}>
                {tool.icon}
              </div>
              <span className="text-sm font-bold text-center">
                {tool.title}
              </span>
            </button>
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
