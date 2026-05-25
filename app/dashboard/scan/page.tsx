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

function ScanContent() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const dogId = searchParams.get("dogId");

  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [showPricing, setShowPricing] = useState(false);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const isPro = user?.publicMetadata?.role === "pro";
  const trialEndsAt = user?.publicMetadata?.trialEndsAt as string | undefined;

  const trialExpired =
    !!user &&
    !isPro &&
    (trialEndsAt ? new Date(trialEndsAt).getTime() < Date.now() : true);

  useEffect(() => {
    if (isLoaded && trialExpired) {
      setShowPricing(true);
    }
  }, [isLoaded, trialExpired]);

  if (!isLoaded)
    return (
      <div className="p-20 text-center uppercase font-black">Laden...</div>
    );

  return (
    <div className="min-h-screen bg-[#F7F7FA] text-[#1A1A2E] font-sans p-6 md:p-12">
      <PricingModal
        isOpen={showPricing}
        onClose={() => {
          setShowPricing(false);
          window.location.href = "/dashboard";
        }}
        dogId={dogId || undefined}
      />

      <main className="max-w-7xl mx-auto transition-all duration-500">
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
                <Button
                  className="w-full"
                  style={{
                    background: trialExpired ? "#E2E8F0" : tool.bg,
                    color: trialExpired ? "#94A3B8" : tool.color,
                  }}
                  onClick={() =>
                    trialExpired
                      ? setShowPricing(true)
                      : fileRefs.current[tool.id]?.click()
                  }>
                  {trialExpired ? "Upgrade vereist" : "Start Analyse"}
                </Button>
                <input
                  type="file"
                  className="hidden"
                  ref={(el) => {
                    fileRefs.current[tool.id] = el;
                  }}
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
