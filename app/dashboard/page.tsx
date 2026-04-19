"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
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
} from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { RapportPDF } from "@/components/RapportPDF";

// Interfaces
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
  const { user } = useUser();
  const [dog, setDog] = useState<any>(null);
  const [dossierAlerts, setDossierAlerts] = useState<DossierItem[]>([]);
  const [vaccinaties, setVaccinaties] = useState<Vaccinatie[]>([]);
  const [medicaties, setMedicaties] = useState<Medicatie[]>([]);
  const [loading, setLoading] = useState(true);

  // PDF State
  const [rapportData, setRapportData] = useState<{
    brief: string;
    details: any[];
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Gebruik de naam uit de database, anders fallback
  const dogName = dog?.name || "Je hond";

  useEffect(() => {
    async function laadDashboardData() {
      try {
        const [dogRes, dossierRes, vacRes, medRes] = await Promise.all([
          fetch("/api/dogs"),
          fetch("/api/geschiedenis"),
          fetch("/api/vaccinaties"),
          fetch("/api/medicatie"),
        ]);

        const dogData = await dogRes.json();
        const dossierData = await dossierRes.json();
        const vacData = await vacRes.json();
        const medData = await medRes.json();

        if (dogData) setDog(dogData);
        if (Array.isArray(dossierData)) {
          setDossierAlerts(
            dossierData.filter((item: DossierItem) => !item.is_ok),
          );
        }
        if (Array.isArray(vacData)) setVaccinaties(vacData);
        if (Array.isArray(medData)) setMedicaties(medData);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    laadDashboardData();
  }, []);

  const genereerRapportData = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch(`/api/rapport?name=${dogName}`);
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
        {/* HEADER */}
        <header className="mb-8 md:mb-12 border-b border-slate-100 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5 md:gap-8">
            {/* HONDENFOTO */}
            <div className="h-16 w-16 md:h-24 md:w-24 rounded-[2rem] overflow-hidden shadow-xl border-4 border-[#1A1A2E] shrink-0 bg-slate-50 flex items-center justify-center">
              {dog?.image_url ? (
                <img
                  src={dog.image_url}
                  alt={dogName}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-4xl">🐶</span>
              )}
            </div>

            {/* NAAM EN STATS */}
            <div className="flex flex-col">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4FC3F7] mb-1">
                Welkom terug, {user?.firstName}
              </p>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-[#111827] uppercase italic leading-none mb-3">
                {dogName}
              </h1>

              {/* STATS BAR */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {dog?.age && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-[#111827] bg-slate-100 px-2 py-0.5 rounded-md leading-none">
                      {dog.age} jaar
                    </span>
                  </div>
                )}{" "}
                {dog?.gender && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-[#111827] bg-slate-100 px-2 py-0.5 rounded-md leading-none">
                      {dog.gender}
                    </span>
                  </div>
                )}
                {dog?.weight && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-[#111827] bg-slate-100 px-2 py-0.5 rounded-md leading-none">
                      {dog.weight} kg
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PDF KNOP */}
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
                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-[4px_4px_0_0_#065f46] active:translate-y-1 active:shadow-none transition-all">
                <CheckCircle2 size={16} /> Download Rapport
              </PDFDownloadLink>
            ) : (
              <button
                onClick={genereerRapportData}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-3 bg-[#1A1A2E] rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-[4px_4px_0_0_#4FC3F7] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50">
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

        {/* STATUS MELDING */}
        {!loading && (
          <section className="mb-10">
            {dossierAlerts.length > 0 ? (
              <div className="p-4 md:p-5 rounded-2xl bg-orange-50 border border-orange-200 flex items-start gap-4 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="text-orange-600" size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm md:text-base text-orange-900 leading-relaxed font-medium">
                    Het lijkt erop dat <strong>{dogName}</strong> ergens last
                    van heeft. Het is verstandig om dit even door een dierenarts
                    te laten beoordelen.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 md:p-5 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-4 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="text-blue-600" size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm md:text-base text-blue-900 leading-relaxed font-medium">
                    Alles ziet er goed uit bij <strong>{dogName}</strong>!
                  </p>
                </div>
              </div>
            )}
          </section>
        )}

        {/* RECENTE ANALYSES */}
        <section className="mb-10 md:mb-12">
          <h2 className="text-lg md:text-xl font-bold text-[#111827] mb-4 md:mb-6 tracking-tight">
            Recente analyses
          </h2>

          <div className="space-y-3">
            {loading ? (
              <div className="py-6 flex justify-start">
                <Loader2 className="animate-spin text-[#4FC3F7]" size={28} />
              </div>
            ) : dossierAlerts.length === 0 ? (
              <div className="p-5 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 bg-slate-50/50 flex items-center gap-3">
                <Info size={18} className="text-slate-400" />
                <span className="italic text-sm">
                  Geen actieve meldingen geregistreerd voor {dogName}.
                </span>
              </div>
            ) : (
              dossierAlerts.map((item) => (
                <Link
                  key={item.id}
                  href={`/dashboard/dossier?tab=${item.tool_id}#${item.id}`}
                  className="group flex items-center justify-between p-3.5 md:p-5 bg-white rounded-2xl border-2 border-slate-300 hover:border-[#4FC3F7] transition-all">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-[#4FC3F7] flex items-center justify-center text-white shrink-0">
                      <Activity
                        className="w-5 h-5 md:w-6 md:h-6"
                        strokeWidth={2.5}
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-sm md:text-lg font-bold text-[#111827] truncate">
                          {dossierVertalingen[item.tool_id] || item.tool_id}:
                        </span>
                        <span className="text-xs md:text-base font-semibold text-red-600 truncate">
                          {item.summary}
                        </span>
                      </div>
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

        {/* PREVENTIE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-10 md:mb-12">
          {/* VACCINATIE CARD */}
          <Link href="/dashboard/vaccinaties" className="block group">
            <div
              className={`p-5 md:p-6 rounded-2xl border-2 transition-all h-full ${heeftVerlopenVaccinatie ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-300 group-hover:border-[#4FC3F7]"}`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center text-white shrink-0 ${heeftVerlopenVaccinatie ? "bg-red-500" : "bg-[#4FC3F7]"}`}>
                    <Syringe className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-[#111827]">
                    Vaccinaties
                  </h3>
                </div>
                {heeftVerlopenVaccinatie ? (
                  <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                )}
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                    Volgende
                  </p>
                  <p className="text-xs md:text-sm font-bold text-[#111827] truncate">
                    {eerstvolgendeVac ? eerstvolgendeVac.type : "Geen planning"}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                    Datum
                  </p>
                  <p
                    className={`text-xs md:text-sm font-bold ${heeftVerlopenVaccinatie ? "text-red-600" : "text-[#111827]"}`}>
                    {eerstvolgendeVac
                      ? new Date(
                          eerstvolgendeVac.datum_verloop,
                        ).toLocaleDateString("nl-NL", {
                          day: "2-digit",
                          month: "short",
                        })
                      : "--"}
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* MEDICATIE CARD */}
          <Link href="/dashboard/medicatie" className="block group">
            <div className="p-5 md:p-6 bg-slate-50 rounded-2xl border-2 border-slate-300 group-hover:border-[#4FC3F7] transition-all h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-[#4FC3F7] flex items-center justify-center text-white shrink-0">
                  <Pill className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-[#111827]">
                  Medicatie
                </h3>
              </div>
              {actieveMedicatie ? (
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                      Lopende kuur
                    </p>
                    <p className="text-xs md:text-sm font-bold text-[#111827] truncate">
                      {actieveMedicatie.naam}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                      Schema
                    </p>
                    <p className="text-[10px] font-bold text-[#4FC3F7]">
                      {actieveMedicatie.frequentie}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[74px] border-2 border-dashed border-slate-300 rounded-xl bg-white/50 text-slate-400 italic text-xs">
                  Geen actieve kuren
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* FOOTER */}
        <footer className="flex flex-col sm:flex-row gap-3 md:gap-4 border-t border-slate-200 pt-8 mb-12">
          <Link
            href="/dashboard/dossier"
            className="flex-[2] flex items-center justify-center p-4 bg-[#111827] text-white rounded-xl font-bold text-sm md:text-base hover:bg-[#4FC3F7] transition-all">
            Open volledig dossier
          </Link>
          <button className="flex-1 flex items-center justify-center p-4 bg-white border-2 border-[#111827] text-[#111827] rounded-xl font-bold text-sm md:text-base hover:bg-red-50 hover:text-red-600 hover:border-red-600 transition-all">
            <Phone size={18} className="mr-2" /> Contact
          </button>
        </footer>
      </div>
    </main>
  );
}
