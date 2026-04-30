"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Activity,
  Phone,
  ChevronRight,
  Loader2,
  FileDown,
  CheckCircle2,
  Syringe,
  Pill,
  AlertTriangle,
  ShieldCheck,
  Info,
  Plus,
  Zap,
  X,
} from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { RapportPDF } from "@/components/RapportPDF";
import { Progress } from "@/components/ui/progress";

// --- Trial Logica Functie ---
function getTrialStatus(createdAt: string | Date | number) {
  const TRIAL_DAYS = 7;
  const start = new Date(createdAt).getTime();
  const duration = TRIAL_DAYS * 24 * 60 * 60 * 1000;
  const now = Date.now();
  const elapsed = now - start;

  const progress = Math.min(100, Math.max(0, (elapsed / duration) * 100));
  const daysLeft = Math.max(
    0,
    Math.ceil((duration - elapsed) / (24 * 60 * 60 * 1000)),
  );

  return { progress, daysLeft, isExpired: elapsed > duration };
}

// --- Interfaces ---
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
  pain: "Comfort",
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

  const [allDogs, setAllDogs] = useState<any[]>([]);
  const [dog, setDog] = useState<any>(null);
  const [dossierAlerts, setDossierAlerts] = useState<DossierItem[]>([]);
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
  const trial = user?.createdAt
    ? getTrialStatus(user.createdAt)
    : { progress: 0, daysLeft: 1, isExpired: false };

  const dogName = dog?.name || "Laden...";

  // MASTER FETCH: Haalt alles in één keer op
  useEffect(() => {
    async function initDashboard() {
      if (!isLoaded) return;
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

          setDossierAlerts(
            Array.isArray(scansData)
              ? scansData.filter((item: any) => !item.is_ok)
              : [],
          );
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
  }, [isLoaded, dogIdFromUrl]);

  const genereerRapportData = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch(
        `/api/rapport?name=${dogName}${dogIdFromUrl ? `&dogId=${dogIdFromUrl}` : ""}`,
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
        {/* --- TRIAL PROGRESS BAR --- */}
        {isLoaded && !isPro && (
          <div className="mb-10 p-6 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 shadow-sm transition-all text-left">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className="bg-[#4FC3F7] p-1.5 rounded-lg shadow-sm">
                  <Zap size={14} className="fill-white text-white" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-widest text-[#1A1A2E]">
                  {trial.isExpired
                    ? "Trial verlopen"
                    : `Trial Status: ${trial.daysLeft} dag over`}
                </h4>
              </div>
              <button
                onClick={() => setShowPricing(true)}
                className="text-[10px] font-black uppercase tracking-widest bg-[#1A1A2E] text-white px-4 py-2 rounded-full hover:bg-[#4FC3F7] transition-colors">
                Upgrade naar Pro
              </button>
            </div>
            <Progress
              value={Math.max(5, trial.progress)}
              className={`h-2.5 border border-white shadow-inner ${trial.progress > 80 ? "[&>div]:bg-rose-500" : "[&>div]:bg-[#4FC3F7]"}`}
            />
          </div>
        )}

        {/* --- PRICING MODAL --- */}
        {showPricing && (
          <div className="fixed inset-0 bg-[#1A1A2E]/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full relative shadow-2xl border-4 border-[#4FC3F7]">
              <button
                onClick={() => setShowPricing(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 transition-colors">
                <X size={24} strokeWidth={3} />
              </button>
              <div className="text-center mb-8">
                <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap size={32} className="text-[#4FC3F7] fill-[#4FC3F7]" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter italic">
                  Kies je plan
                </h2>
              </div>
              <div className="space-y-4">
                <button
                  onClick={() =>
                    (window.location.href = `/api/stripe/checkout?priceId=price_1TRDtmRK5rzSG2g74m7KLTE0`)
                  }
                  className="w-full group bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl hover:border-[#4FC3F7] transition-all text-left">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-black uppercase tracking-tighter text-sm">
                      Maandelijks
                    </span>
                    <ChevronRight size={16} />
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

        {/* HONDEN SWITCHER */}
        <div className="flex gap-4 mb-8 border-b border-slate-100 pb-6 overflow-x-auto no-scrollbar items-center text-left">
          {allDogs.map((d) => (
            <button
              key={d.id}
              onClick={() => router.push(`/dashboard?dogId=${d.id}`)}
              className={`flex flex-col items-center gap-2 transition-all shrink-0 ${
                String(dogIdFromUrl) === String(d.id) ||
                (!dogIdFromUrl && allDogs[0]?.id === d.id)
                  ? "opacity-100 scale-105"
                  : "opacity-40 hover:opacity-70"
              }`}>
              <div
                className={`h-16 w-16 md:h-20 md:w-20 rounded-[1.5rem] overflow-hidden border-4 shadow-md transition-all ${
                  String(dogIdFromUrl) === String(d.id) ||
                  (!dogIdFromUrl && allDogs[0]?.id === d.id)
                    ? "border-[#4FC3F7]"
                    : "border-white"
                }`}>
                {d.image_url ? (
                  <img
                    src={`${d.image_url}?v=${Date.now()}`}
                    alt={d.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="bg-slate-100 w-full h-full flex items-center justify-center text-xl">
                    🐶
                  </div>
                )}
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter">
                {d.name}
              </span>
            </button>
          ))}
          {allDogs.length < 3 && (
            <Link
              href="/onboarding"
              className="flex flex-col items-center gap-2 shrink-0 group">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-[1.5rem] border-4 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 group-hover:border-[#4FC3F7] transition-all text-slate-300">
                <Plus size={32} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400 group-hover:text-[#4FC3F7]">
                Voeg toe
              </span>
            </Link>
          )}
        </div>

        {/* HEADER */}
        <header className="mb-8 md:mb-12 border-b border-slate-100 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-left">
          <div className="flex items-center gap-5 md:gap-8">
            <div
              key={dog?.image_url}
              className="h-16 w-16 md:h-24 md:w-24 rounded-[2rem] overflow-hidden shadow-xl border-4 border-[#1A1A2E] shrink-0 bg-slate-50 flex items-center justify-center">
              {dog?.image_url ? (
                <img
                  src={`${dog.image_url}?v=${Date.now()}`}
                  alt={dogName}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-4xl">🐶</span>
              )}
            </div>
            <div className="flex flex-col">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4FC3F7] mb-1">
                Welkom terug, {user?.firstName}
              </p>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-[#111827] uppercase italic leading-none mb-3">
                {dogName}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-left">
                {dog?.age && (
                  <span className="text-[11px] font-bold text-[#111827] bg-slate-100 px-2 py-0.5 rounded-md">
                    {dog.age} jaar
                  </span>
                )}
                {dog?.gender && (
                  <span className="text-[11px] font-bold text-[#111827] bg-slate-100 px-2 py-0.5 rounded-md">
                    {dog.gender}
                  </span>
                )}
                {dog?.weight && (
                  <span className="text-[11px] font-bold text-[#111827] bg-slate-100 px-2 py-0.5 rounded-md">
                    {dog.weight} kg
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="shrink-0">
            {rapportData ? (
              <PDFDownloadLink
                document={
                  <RapportPDF
                    brief={rapportData.brief}
                    details={rapportData.details}
                    dogName={dogName}
                  />
                }
                fileName={`Rapport_${dogName}.pdf`}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-[4px_4px_0_0_#065f46]">
                <CheckCircle2 size={16} /> Download Rapport
              </PDFDownloadLink>
            ) : (
              <button
                onClick={genereerRapportData}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-3 bg-[#1A1A2E] rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-[4px_4px_0_0_#4FC3F7] disabled:opacity-50">
                {isGenerating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <FileDown size={16} />
                )}
                {isGenerating ? "Genereren..." : "PDF Rapport"}
              </button>
            )}
          </div>
        </header>

        {!loading && (
          <section className="mb-10 text-left">
            {dossierAlerts.length > 0 ? (
              <div className="p-4 md:p-5 rounded-2xl bg-orange-50 border border-orange-200 flex items-start gap-4 shadow-sm">
                <AlertTriangle className="text-orange-600 shrink-0" size={24} />
                <p className="text-sm md:text-base text-orange-900 font-medium">
                  Het lijkt erop dat <strong>{dogName}</strong> ergens last van
                  heeft. Laat dit beoordelen door een arts.
                </p>
              </div>
            ) : (
              <div className="p-4 md:p-5 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-4 shadow-sm">
                <ShieldCheck className="text-blue-600 shrink-0" size={24} />
                <p className="text-sm md:text-base text-blue-900 font-medium">
                  Alles ziet er goed uit bij <strong>{dogName}</strong>!
                </p>
              </div>
            )}
          </section>
        )}

        {/* --- RECENTE ANALYSES (AANGEPASTE SECTIE) --- */}
        <section className="mb-10 md:mb-12 text-left">
          <h2 className="text-lg md:text-xl font-bold text-[#111827] mb-4 md:mb-6 tracking-tight text-left">
            Recente analyses
          </h2>
          <div className="space-y-3">
            {loading ? (
              <Loader2 className="animate-spin text-[#4FC3F7]" size={28} />
            ) : dossierAlerts.length === 0 ? (
              <div className="p-5 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 bg-slate-50/50 flex items-center gap-3 italic text-sm text-left">
                <Info size={18} className="text-slate-400" /> Geen actieve
                meldingen gevonden.
              </div>
            ) : (
              dossierAlerts.map((item) => (
                <Link
                  key={item.id}
                  href={`/dashboard/dossier?dogId=${dogIdFromUrl}&tab=${item.tool_id}#${item.id}`}
                  className="group flex items-center justify-between p-3.5 md:p-5 bg-white rounded-2xl border-2 border-slate-300 hover:border-[#4FC3F7] transition-all">
                  <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-[#4FC3F7] flex items-center justify-center text-white shrink-0">
                      <Activity size={24} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-baseline md:gap-2 min-w-0 overflow-hidden text-left">
                      <span className="text-sm md:text-lg font-bold text-[#111827] whitespace-nowrap">
                        {dossierVertalingen[item.tool_id] || item.tool_id}:
                      </span>
                      <span className="text-xs md:text-base font-semibold text-red-600 truncate block">
                        {item.summary}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-slate-300 group-hover:text-[#4FC3F7] shrink-0 ml-2"
                  />
                </Link>
              ))
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-10 md:mb-12">
          <Link
            href={`/dashboard/vaccinaties?dogId=${dogIdFromUrl}`}
            className="block group">
            <div
              className={`p-5 md:p-6 rounded-2xl border-2 transition-all h-full text-left ${heeftVerlopenVaccinatie ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-300 group-hover:border-[#4FC3F7]"}`}>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center text-white ${heeftVerlopenVaccinatie ? "bg-red-500" : "bg-[#4FC3F7]"}`}>
                  <Syringe size={22} />
                </div>
                <h3 className="font-bold text-left">Vaccinaties</h3>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                <div className="text-left">
                  <p className="text-[9px] font-black uppercase text-slate-400">
                    Volgende
                  </p>
                  <p className="text-xs md:text-sm font-bold truncate">
                    {eerstvolgendeVac ? eerstvolgendeVac.type : "Geen planning"}
                  </p>
                </div>
                <div className="text-right ml-2 text-left">
                  <p className="text-[9px] font-black uppercase text-slate-400">
                    Datum
                  </p>
                  <p
                    className={`text-xs md:text-sm font-bold ${heeftVerlopenVaccinatie ? "text-red-600" : "text-[#111827]"}`}>
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
            href={`/dashboard/medicatie?dogId=${dogIdFromUrl}`}
            className="block group">
            <div className="p-5 md:p-6 bg-slate-50 rounded-2xl border-2 border-slate-300 group-hover:border-[#4FC3F7] transition-all h-full text-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-[#4FC3F7] flex items-center justify-center text-white">
                  <Pill size={22} />
                </div>
                <h3 className="font-bold text-left">Medicatie</h3>
              </div>
              {actieveMedicatie ? (
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                  <div className="text-left">
                    <p className="text-[9px] font-black uppercase text-slate-400">
                      Lopende kuur
                    </p>
                    <p className="text-xs md:text-sm font-bold text-left">
                      {actieveMedicatie.naam}
                    </p>
                  </div>
                  <div className="text-right ml-2 text-left">
                    <p className="text-[9px] font-black uppercase text-slate-400">
                      Schema
                    </p>
                    <p className="text-[10px] font-bold text-[#4FC3F7]">
                      {actieveMedicatie.frequentie}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[74px] border-2 border-dashed border-slate-300 rounded-xl bg-white/50 text-slate-400 italic text-xs text-left">
                  Geen actieve kuren
                </div>
              )}
            </div>
          </Link>
        </div>

        <footer className="flex flex-col sm:flex-row gap-3 md:gap-4 border-t border-slate-200 pt-8 mb-12 text-left">
          <Link
            href={`/dashboard/dossier?dogId=${dogIdFromUrl}`}
            className="flex-[2] flex items-center justify-center p-4 bg-[#111827] text-white rounded-xl font-bold hover:bg-[#4FC3F7]">
            Open dossier
          </Link>
          <button className="flex-1 flex items-center justify-center p-4 bg-white border-2 border-[#111827] text-[#111827] rounded-xl font-bold hover:bg-red-50">
            <Phone size={18} className="mr-2" /> Contact
          </button>
        </footer>
      </div>
    </main>
  );
}
