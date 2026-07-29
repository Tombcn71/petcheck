"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Activity,
  ChevronRight,
  Loader2,
  Syringe,
  Pill,
  AlertTriangle,
  Zap,
  Camera,
  PlusCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PricingModal } from "@/components/PricingModal";
import { DogSwitcher } from "@/components/DogSwitcher";
import { TRIAL_DAYS } from "../trial-config";

function getTrialStatus(
  createdAt: string | Date | number,
  trialEndsAt?: string,
) {
  const start = new Date(createdAt).getTime();
  const trialDurationMs = TRIAL_DAYS * 24 * 60 * 60 * 1000;
  const end = trialEndsAt
    ? new Date(trialEndsAt).getTime()
    : start + trialDurationMs;
  const now = Date.now();
  const totalDuration = end - start;
  const elapsed = now - start;
  const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  const msLeft = Math.max(0, end - now);
  const daysLeft = Math.ceil(msLeft / (24 * 60 * 60 * 1000));
  return { progress, daysLeft, isExpired: now > end, msLeft };
}

interface DossierItem {
  id: string;
  tool_id: string;
  summary: string;
  is_ok: boolean;
  image_url?: string;
  created_at: string;
}

interface Vaccinatie {
  id: string;
  type: string;
  datum_verloop: string;
}

interface Medicatie {
  id: string;
  naam: string;
  dosering: string;
  frequentie: string;
  notitie: string;
}

const dossierVertalingen: Record<string, string> = {
  eyes: "Ogen",
  poop: "Ontlasting",
  dental: "Gebit",
  skin: "Huid & Vacht",
  bcs: "Gewicht",
  pain: "Pijn Signalen",
  coat: "Vachtglans",
  nose: "Neus",
  ticks: "Teken",
  fleas: "Vlooien",
  mange: "Infecties",
  ears: "Oren",
};

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="animate-spin text-[#4FC3F7] h-10 w-10" />
        </div>
      }>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dogIdFromUrl = searchParams.get("dogId") || "";

  useEffect(() => {
    const status = searchParams.get("status");
    const sessionId = searchParams.get("session_id");
    if (status !== "success" || !sessionId) return;

    const alGeteld = sessionStorage.getItem("fb-purchase-" + sessionId);
    if (!alGeteld) {
      window.fbq?.(
        "track",
        "Purchase",
        {
          value: Number(searchParams.get("value")) || 0,
          currency: searchParams.get("currency") || "EUR",
        },
        { eventID: sessionId },
      );
      sessionStorage.setItem("fb-purchase-" + sessionId, "1");
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("status");
    params.delete("session_id");
    params.delete("value");
    params.delete("currency");
    router.replace(`/dashboard?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [allDogs, setAllDogs] = useState<any[]>([]);
  const [dog, setDog] = useState<any>(null);
  const [dossierAlerts, setDossierAlerts] = useState<DossierItem[]>([]);
  const [totalScans, setTotalScans] = useState<number | null>(null);
  const [vaccinaties, setVaccinaties] = useState<Vaccinatie[]>([]);
  const [medicaties, setMedicaties] = useState<Medicatie[]>([]);
  const [loading, setLoading] = useState(true);
  const [rapportData, setRapportData] = useState<{
    brief: string;
    details: any[];
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const isPro = user?.publicMetadata?.role === "pro";
  const trialEndsAt = user?.publicMetadata?.trialEndsAt as string | undefined;

  const trial = user?.createdAt
    ? getTrialStatus(user.createdAt, trialEndsAt)
    : { progress: 0, daysLeft: 1, isExpired: false, msLeft: 0 };

  const dogName = dog?.name
    ? dog.name.charAt(0).toUpperCase() + dog.name.slice(1)
    : "Laden...";

  useEffect(() => {
    async function initDashboard() {
      if (!isLoaded) return;
      setRapportData(null);
      setDossierAlerts([]);
      setLoading(true);

      try {
        const t = `?t=${Date.now()}`;
        const fetchOptions = { cache: "no-store" as RequestCache };

        const dogsRes = await fetch("/api/dogs" + t, fetchOptions);
        const hondenData = await dogsRes.json();

        if (!Array.isArray(hondenData) || hondenData.length === 0) {
          setLoading(false);
          return;
        }

        setAllDogs(hondenData);

        const actieveHond = dogIdFromUrl
          ? hondenData.find((d: any) => String(d.id) === String(dogIdFromUrl))
          : hondenData[0];

        if (actieveHond) {
          setDog({ ...actieveHond });

          // VANGRAIL: dwing de URL naar het juiste ID als deze nog leeg was
          if (!dogIdFromUrl) {
            router.replace(`/dashboard?dogId=${actieveHond.id}`, {
              scroll: false,
            });
          }

          const idToFetch = actieveHond.id;
          const [scansRes, vacRes, medRes] = await Promise.all([
            fetch(
              `/api/scans?dogId=${idToFetch}&t=${Date.now()}`,
              fetchOptions,
            ),
            fetch(
              `/api/vaccinaties?dogId=${idToFetch}&t=${Date.now()}`,
              fetchOptions,
            ),
            fetch(
              `/api/medicatie?dogId=${idToFetch}&t=${Date.now()}`,
              fetchOptions,
            ),
          ]);

          const scansData = await scansRes.json().catch(() => []);
          const vacData = await vacRes.json().catch(() => []);
          const medData = await medRes.json().catch(() => []);

          const alleScans = Array.isArray(scansData) ? scansData : [];
          setTotalScans(alleScans.length);
          setDossierAlerts(alleScans.filter((item: any) => !item.is_ok));
          setVaccinaties(Array.isArray(vacData) ? vacData : []);
          setMedicaties(Array.isArray(medData) ? medData : []);
        }
      } catch (err) {
        console.error("Kritieke dashboard fout:", err);
      } finally {
        setLoading(false);
      }
    }

    initDashboard();
  }, [isLoaded, dogIdFromUrl, router]);

  const genereerRapportData = async () => {
    setIsGenerating(true);
    try {
      const activeDogId = dogIdFromUrl || dog?.id;
      const res = await fetch(
        `/api/rapport?name=${dogName}&dogId=${activeDogId}`,
      );
      const data = await res.json();
      setRapportData(data);
    } catch (err) {
      console.error("Rapport fout:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const isVerlopen = (datum: string) => new Date(datum) < new Date();
  const heeftVerlopenVaccinatie = vaccinaties.some((v) =>
    isVerlopen(v.datum_verloop),
  );
  const eerstvolgendeVac = vaccinaties[0];
  const actieveMedicatie = medicaties.length > 0 ? medicaties[0] : null;

  return (
    <main className="min-h-screen bg-white p-4 sm:p-6 md:p-10 lg:p-12 font-jakarta antialiased text-[#111827]">
      <div className="w-full max-w-4xl ml-0 text-left">
        {isLoaded && !isPro && (
          <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3 flex-1">
              <div className="bg-[#4FC3F7] p-1 rounded-lg shrink-0">
                <Zap size={12} className="fill-white text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#1A1A2E] mb-1">
                  {trial.isExpired
                    ? "Trial verlopen"
                    : `Trial: ${trial.daysLeft} ${trial.daysLeft === 1 ? "dag" : "dagen"} over`}
                </p>
                <Progress
                  value={Math.max(5, trial.progress)}
                  className={`h-1.5 border border-white shadow-inner ${trial.progress > 80 ? "[&>div]:bg-rose-500" : "[&>div]:bg-[#4FC3F7]"}`}
                />
              </div>
            </div>
            <button
              onClick={() => setShowPricing(true)}
              className="text-[9px] font-black uppercase tracking-widest bg-[#1A1A2E] text-white px-3 py-1.5 rounded-lg hover:bg-[#4FC3F7] transition-colors shrink-0 text-center">
              Upgrade naar Pro
            </button>
          </div>
        )}

        <PricingModal
          isOpen={showPricing}
          onClose={() => setShowPricing(false)}
          dogId={dogIdFromUrl || dog?.id}
        />

        {/* 
          COMPACTE HONDEN SWITCHER SECIE
          Dit zet de switcher helemaal strak bovenaan de pagina content neer, 
          met een subtiele scheidingslijn, ideaal voor mobiel én desktop.
        */}
        {allDogs.length > 0 && (
          <div className="mb-6 pb-2 border-b border-slate-100">
            <DogSwitcher
              allDogs={allDogs}
              dogIdFromUrl={dogIdFromUrl || dog?.id}
            />
          </div>
        )}

        {/* HEADER */}
        <header className="mb-8 md:mb-10 border-b border-slate-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-left">
          <div className="flex items-center gap-4 md:gap-6">
            <div
              key={dog?.image_url}
              className="h-14 w-14 md:h-18 md:w-18 rounded-2xl overflow-hidden shadow-md border-2 border-[#1A1A2E] shrink-0 bg-slate-50 flex items-center justify-center">
              {dog?.image_url ? (
                <img
                  src={dog.image_url}
                  alt={dogName}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-2xl">🐶</span>
              )}
            </div>
            <div className="flex flex-col">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#4FC3F7] mb-0.5">
                Welkom terug, {user?.firstName}
              </p>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#111827] uppercase italic leading-none mb-2">
                {dogName}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-left">
                {dog?.age && (
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                    {dog.age} jaar
                  </span>
                )}
                {dog?.gender && (
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                    {dog.gender}
                  </span>
                )}
                {dog?.weight && (
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                    {dog.weight} kg
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {!loading && (
              <>
                {trial.isExpired && !isPro ? (
                  <button
                    onClick={() => setShowPricing(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#01579B] hover:bg-[#4FC3F7] text-white font-black uppercase text-[10px] tracking-wider shadow-sm transition-all">
                    <Camera size={14} strokeWidth={2.5} />
                    <span>Nieuwe scan</span>
                  </button>
                ) : (
                  <Link
                    href={`/dashboard/scan?dogId=${dogIdFromUrl || dog?.id}`}>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#01579B] hover:bg-[#4FC3F7] text-white font-black uppercase text-[10px] tracking-wider shadow-sm transition-all">
                      <Camera size={14} strokeWidth={2.5} />
                      <span>Nieuwe scan</span>
                    </button>
                  </Link>
                )}
              </>
            )}
          </div>
        </header>

        <section className="mb-8 md:mb-10 text-left">
          <h2 className="text-md md:text-lg font-bold text-[#111827] mb-3 md:mb-4 tracking-tight text-left">
            Recente analyses
          </h2>
          <div className="space-y-2">
            {loading ? (
              <Loader2 className="animate-spin text-[#4FC3F7]" size={24} />
            ) : totalScans === 0 ? (
              <Link href={`/dashboard/scan?dogId=${dogIdFromUrl || dog?.id}`}>
                <div className="p-4 border border-dashed border-slate-200 rounded-xl text-slate-500 bg-slate-50/50 flex items-center gap-3 text-xs hover:border-[#4FC3F7] hover:text-[#4FC3F7] transition-all">
                  <Activity size={16} className="shrink-0" />
                  {`Nog geen analyses voor ${dogName}, maak je eerste scan om het welzijn van je hond te checken.`}
                </div>
              </Link>
            ) : dossierAlerts.length === 0 ? (
              <div className="p-4 border border-dashed border-slate-200 rounded-xl text-slate-500 bg-slate-50/50 flex items-center gap-3 text-xs">
                <Activity size={16} className="text-slate-400 shrink-0" /> Alles
                ziet er goed uit bij <strong className="ml-1">{dogName}</strong>
                !
              </div>
            ) : (
              dossierAlerts.map((item) => (
                <Link
                  key={item.id}
                  href={`/dashboard/dossier?dogId=${dogIdFromUrl || dog?.id}&tab=${item.tool_id}#${item.id}`}
                  className="group flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 hover:border-[#4FC3F7] transition-all">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 shrink-0 border border-slate-100">
                      <Activity size={16} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-baseline md:gap-2 min-w-0 overflow-hidden text-left">
                      <span className="text-xs md:text-sm font-bold text-[#111827] whitespace-nowrap">
                        {dossierVertalingen[item.tool_id] || item.tool_id}:
                      </span>
                      <span className="text-xs md:text-sm font-semibold text-red-600 truncate block">
                        {item.summary}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-slate-300 group-hover:text-[#4FC3F7] shrink-0 ml-2"
                  />
                </Link>
              ))
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10">
          <Link
            href={`/dashboard/vaccinaties?dogId=${dogIdFromUrl || dog?.id}`}
            className="block group">
            <div
              className={`p-4 md:p-5 rounded-xl border transition-all h-full text-left ${!loading && heeftVerlopenVaccinatie ? "bg-red-50/50 border-red-200" : "bg-slate-50/50 border-slate-200 group-hover:border-[#4FC3F7]"}`}>
              <div className="flex items-center gap-2.5 mb-4">
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center text-white ${!loading && heeftVerlopenVaccinatie ? "bg-red-500" : "bg-[#4FC3F7]"}`}>
                  <Syringe size={16} />
                </div>
                <h3 className="text-sm font-bold text-left">Vaccinaties</h3>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-100 flex items-center justify-between shadow-sm">
                <div className="text-left">
                  <p className="text-[8px] font-black uppercase text-slate-400">
                    Volgende
                  </p>
                  <p className="text-xs font-bold truncate">
                    {eerstvolgendeVac ? eerstvolgendeVac.type : "Geen planning"}
                  </p>
                </div>
                <div className="text-right ml-2">
                  <p className="text-[8px] font-black uppercase text-slate-400">
                    Datum
                  </p>
                  <p
                    className={`text-xs font-bold ${!loading && heeftVerlopenVaccinatie ? "text-red-600" : "text-[#111827]"}`}>
                    {eerstvolgendeVac
                      ? new Date(
                          eerstvolgendeVac.datum_verloop,
                        ).toLocaleDateString("nl-NL")
                      : "--"}
                  </p>
                </div>
              </div>
            </div>
          </Link>
          <Link
            href={`/dashboard/medicatie?dogId=${dogIdFromUrl || dog?.id}`}
            className="block group">
            <div className="p-4 md:p-5 bg-slate-50/50 rounded-xl border border-slate-200 group-hover:border-[#4FC3F7] transition-all h-full text-left">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-8 w-8 rounded-lg bg-[#4FC3F7] flex items-center justify-center text-white">
                  <Pill size={16} />
                </div>
                <h3 className="text-sm font-bold text-left">Medicatie</h3>
              </div>
              {actieveMedicatie ? (
                <div className="bg-white p-3 rounded-lg border border-slate-100 flex items-center justify-between shadow-sm">
                  <div className="text-left">
                    <p className="text-[8px] font-black uppercase text-slate-400">
                      Lopende kuur
                    </p>
                    <p className="text-xs font-bold text-left">
                      {actieveMedicatie.naam}
                    </p>
                  </div>
                  <div className="text-right ml-2">
                    <p className="text-[8px] font-black uppercase text-slate-400">
                      Schema
                    </p>
                    <p className="text-[9px] font-bold text-[#4FC3F7]">
                      {actieveMedicatie.frequentie}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-13.5 border border-dashed border-slate-200 rounded-lg bg-white/50 text-slate-400 italic text-xs text-left">
                  Geen actieve kuren
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
