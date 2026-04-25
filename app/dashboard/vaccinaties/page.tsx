"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  Trash2,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  Loader2,
} from "lucide-react";

// --- Interfaces ---
interface Vaccinatie {
  id: string;
  type: string;
  datum_gegeven: string;
  datum_verloop: string;
  dierenarts: string;
}

interface Dog {
  id: string;
  name: string;
  image_url?: string;
}

// --- HOOFD EXPORT (De Wrapper voor Next.js Build) ---
export default function VaccinatiesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="animate-spin text-[#4FC3F7] h-10 w-10" />
        </div>
      }>
      <VaccinatiesContent />
    </Suspense>
  );
}

// --- DE WERKELIJKE CONTENT COMPONENT ---
function VaccinatiesContent() {
  const searchParams = useSearchParams();
  const dogIdFromUrl = searchParams.get("dogId");

  const [vaccinaties, setVaccinaties] = useState<Vaccinatie[]>([]);
  const [dog, setDog] = useState<Dog | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const [newVac, setNewVac] = useState({
    type: "",
    datum_gegeven: "",
    datum_verloop: "",
    dierenarts: "",
  });

  useEffect(() => {
    async function loadData() {
      if (!dogIdFromUrl) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [vacRes, dogRes] = await Promise.all([
          fetch(`/api/vaccinaties?dogId=${dogIdFromUrl}&t=${Date.now()}`),
          fetch(`/api/dogs?dogId=${dogIdFromUrl}`),
        ]);

        const vacData = await vacRes.json();
        const dogData = await dogRes.json();

        if (Array.isArray(vacData)) setVaccinaties(vacData);

        if (Array.isArray(dogData)) {
          setDog(
            dogData.find((d) => String(d.id) === String(dogIdFromUrl)) || null,
          );
        } else {
          setDog(dogData);
        }
      } catch (err) {
        console.error("Fout bij laden:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [dogIdFromUrl]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dogIdFromUrl) return alert("Geen hond geselecteerd.");

    try {
      const res = await fetch("/api/vaccinaties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newVac,
          dog_id: dogIdFromUrl,
        }),
      });

      if (res.ok) {
        const opgeslagenVac = await res.json();
        setVaccinaties((prev) => [opgeslagenVac, ...prev]);
        setIsAdding(false);
        setNewVac({
          type: "",
          datum_gegeven: "",
          datum_verloop: "",
          dierenarts: "",
        });
      }
    } catch (err) {
      console.error("Opslaan mislukt:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Zeker weten?")) return;
    try {
      const res = await fetch(`/api/vaccinaties/${id}`, { method: "DELETE" });
      if (res.ok) {
        setVaccinaties(vaccinaties.filter((v) => v.id !== id));
      }
    } catch (err) {
      console.error("Verwijderen mislukt:", err);
    }
  };

  const isVerlopen = (datum: string) => new Date(datum) < new Date();

  return (
    <div className="min-h-screen bg-white font-sans text-[#1A1A2E] antialiased p-6 md:p-12">
      <div className="w-full max-w-xl text-left ml-0">
        <Link
          href={`/dashboard?dogId=${dogIdFromUrl}`}
          className="inline-flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-[#4FC3F7] mb-8 transition-colors">
          <ArrowLeft size={14} /> Terug naar Dashboard
        </Link>

        <header className="mb-10 flex items-center gap-5">
          <div className="h-16 w-16 md:h-20 md:w-20 rounded-3xl overflow-hidden border-4 border-slate-50 shadow-sm bg-slate-100 shrink-0">
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
            <h1 className="text-2xl md:text-3xl font-black text-[#1A1A2E] uppercase tracking-tight italic leading-none">
              {dog?.name || "Laden..."}{" "}
              <span className="text-[#4FC3F7] not-italic px-1">/</span>{" "}
              Vaccinaties
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
              Gezondheidsstatus & Paspoort van {dog?.name || "je hond"}
            </p>
          </div>
        </header>

        {loading ? (
          <div className="py-10 flex justify-center text-[#4FC3F7]">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="space-y-4 mb-10">
            {vaccinaties.length === 0 && !isAdding && (
              <p className="text-slate-400 italic text-sm py-10">
                Geen vaccinaties gevonden voor {dog?.name}.
              </p>
            )}
            {vaccinaties.map((vac) => {
              const verlopen = isVerlopen(vac.datum_verloop);
              return (
                <div
                  key={vac.id}
                  className={`p-6 border rounded-2xl flex items-center justify-between ${verlopen ? "bg-red-50 border-red-100" : "bg-slate-50 border-slate-100"}`}>
                  <div className="flex items-start gap-4">
                    <div
                      className={verlopen ? "text-red-500" : "text-green-500"}>
                      {verlopen ? (
                        <AlertTriangle size={20} />
                      ) : (
                        <ShieldCheck size={20} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-black uppercase text-sm text-[#1A1A2E] leading-tight">
                        {vac.type}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">
                        Geldig tot:{" "}
                        <span
                          className={
                            verlopen
                              ? "text-red-600 font-black"
                              : "text-[#1A1A2E]"
                          }>
                          {new Date(vac.datum_verloop).toLocaleDateString(
                            "nl-NL",
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(vac.id)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-5 border-2 border-[#4FC3F7] text-[#4FC3F7] font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-[#4FC3F7] hover:text-white transition-all flex items-center justify-center gap-2">
            <Plus size={18} /> Nieuwe Vaccinatie Toevoegen
          </button>
        ) : (
          <form
            onSubmit={handleAdd}
            className="p-8 bg-white border-2 border-[#4FC3F7] rounded-[2.5rem] space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Type Vaccinatie
              </label>
              <input
                required
                value={newVac.type}
                onChange={(e) => setNewVac({ ...newVac, type: e.target.value })}
                placeholder="bijv. Rabiës"
                className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-400">
                  Datum Gegeven
                </label>
                <input
                  type="date"
                  required
                  value={newVac.datum_gegeven}
                  onChange={(e) =>
                    setNewVac({ ...newVac, datum_gegeven: e.target.value })
                  }
                  className="p-4 bg-slate-50 rounded-xl font-bold outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-400">
                  Geldig tot
                </label>
                <input
                  type="date"
                  required
                  value={newVac.datum_verloop}
                  onChange={(e) =>
                    setNewVac({ ...newVac, datum_verloop: e.target.value })
                  }
                  className="p-4 bg-slate-50 rounded-xl font-bold outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-slate-400">
                Dierenarts / Kliniek
              </label>
              <input
                placeholder="Naam van de kliniek"
                value={newVac.dierenarts}
                onChange={(e) =>
                  setNewVac({ ...newVac, dierenarts: e.target.value })
                }
                className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 py-4 bg-[#1A1A2E] text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-[#4FC3F7] transition-all">
                Opslaan
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-6 py-4 text-slate-400 font-bold uppercase text-[10px]">
                Annuleer
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
