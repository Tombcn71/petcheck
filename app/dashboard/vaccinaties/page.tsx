"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Syringe,
  Plus,
  Trash2,
  ArrowLeft,
  Calendar as CalendarIcon,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Loader2,
} from "lucide-react";

interface Vaccinatie {
  id: string;
  type: string;
  datum_gegeven: string; // Let op: underscore voor database matching
  datum_verloop: string;
  dierenarts: string;
}

export default function VaccinatiesPage() {
  const [vaccinaties, setVaccinaties] = useState<Vaccinatie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const [newVac, setNewVac] = useState({
    type: "",
    datum_gegeven: "",
    datum_verloop: "",
    dierenarts: "",
  });

  // 1. DATA OPHALEN UIT NEON BIJ LADEN
  useEffect(() => {
    async function laadVaccinaties() {
      try {
        const res = await fetch("/api/vaccinaties");
        const data = await res.json();
        if (Array.isArray(data)) {
          setVaccinaties(data);
        }
      } catch (err) {
        console.error("Fout bij laden:", err);
      } finally {
        setLoading(false);
      }
    }
    laadVaccinaties();
  }, []);

  // 2. DATA SCHRIJVEN NAAR NEON
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/vaccinaties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVac),
      });

      if (res.ok) {
        const opgeslagenVac = await res.json();
        // Update lokale state met de data uit de database (inclusief het nieuwe ID)
        setVaccinaties((prev) => [...prev, opgeslagenVac]);
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
      alert("Er ging iets mis bij het opslaan.");
    }
  };

  // 3. VERWIJDEREN UIT NEON
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

  const isVerlopen = (datum: string) => {
    return new Date(datum) < new Date();
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#1A1A2E] antialiased p-6 md:p-12">
      <div className="w-full max-w-xl text-left ml-0">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-[#4FC3F7] mb-8 transition-colors">
          <ArrowLeft size={14} /> Terug naar Dashboard
        </Link>

        <header className="mb-10">
          <h1 className="text-2xl font-black text-[#1A1A2E] uppercase tracking-tight italic">
            Vaccinaties{" "}
            <span className="text-[#4FC3F7] not-italic px-2">/</span> Paspoort
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
            Beheer Luna's preventieve zorg en immuniteit
          </p>
        </header>

        {loading ? (
          <div className="py-10 flex justify-center">
            <Loader2 className="animate-spin text-[#4FC3F7]" />
          </div>
        ) : (
          <div className="space-y-4 mb-10">
            {vaccinaties.length === 0 && !isAdding && (
              <p className="text-slate-400 italic text-sm py-10">
                Nog geen vaccinaties geregistreerd.
              </p>
            )}
            {vaccinaties.map((vac) => {
              const verlopen = isVerlopen(vac.datum_verloop);
              return (
                <div
                  key={vac.id}
                  className={`p-6 border rounded-2xl flex items-center justify-between transition-all ${
                    verlopen
                      ? "bg-red-50 border-red-100"
                      : "bg-slate-50 border-slate-100"
                  }`}>
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-1 ${verlopen ? "text-red-500" : "text-green-500"}`}>
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
                            verlopen ? "text-red-600" : "text-[#1A1A2E]"
                          }>
                          {new Date(vac.datum_verloop).toLocaleDateString(
                            "nl-NL",
                          )}
                        </span>
                      </p>
                      <p className="text-[9px] text-slate-400 mt-1 uppercase">
                        Arts: {vac.dierenarts || "Onbekend"}
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
            <Plus size={18} /> Nieuwe Vaccinatie
          </button>
        ) : (
          <form
            onSubmit={handleAdd}
            className="p-8 bg-white border-2 border-[#4FC3F7] rounded-[2.5rem] space-y-5 animate-in slide-in-from-bottom-2">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Type Vaccinatie
              </label>
              <input
                required
                placeholder="bijv. Cocktail of Parvo"
                value={newVac.type}
                onChange={(e) => setNewVac({ ...newVac, type: e.target.value })}
                className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-transparent focus:border-[#4FC3F7]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Datum Gegeven
                </label>
                <input
                  type="date"
                  required
                  value={newVac.datum_gegeven}
                  onChange={(e) =>
                    setNewVac({ ...newVac, datum_gegeven: e.target.value })
                  }
                  className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Geldig tot
                </label>
                <input
                  type="date"
                  required
                  value={newVac.datum_verloop}
                  onChange={(e) =>
                    setNewVac({ ...newVac, datum_verloop: e.target.value })
                  }
                  className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Dierenarts / Kliniek
              </label>
              <input
                placeholder="Naam van de arts"
                value={newVac.dierenarts}
                onChange={(e) =>
                  setNewVac({ ...newVac, dierenarts: e.target.value })
                }
                className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none border border-transparent focus:border-[#4FC3F7]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 py-4 bg-[#1A1A2E] text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-[#4FC3F7] transition-all">
                Opslaan in Dossier
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
      <div className="h-24" />
    </div>
  );
}
