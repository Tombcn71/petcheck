"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Pill, Plus, Trash2, ArrowLeft, Loader2 } from "lucide-react";

// --- Types ---
interface Medicijn {
  id: string;
  naam: string;
  dosering: string;
  frequentie: string;
  notitie: string;
}

interface Dog {
  id: string;
  name: string;
  image_url?: string;
}

// --- HOOFD EXPORT (Met de vereiste Suspense wrapper voor Vercel) ---
export default function MedicijnenPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="animate-spin text-[#4FC3F7] h-10 w-10" />
        </div>
      }>
      <MedicatieContent />
    </Suspense>
  );
}

// --- DE WERKELIJKE CONTENT COMPONENT ---
function MedicatieContent() {
  const searchParams = useSearchParams();
  const dogId = searchParams.get("dogId");

  const [medicijnen, setMedicijnen] = useState<Medicijn[]>([]);
  const [dog, setDog] = useState<Dog | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const [newMed, setNewMed] = useState({
    naam: "",
    dosering: "",
    frequentie: "1x per dag",
    notitie: "",
  });

  useEffect(() => {
    async function loadData() {
      if (!dogId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [medRes, dogRes] = await Promise.all([
          fetch(`/api/medicatie?dogId=${dogId}`),
          fetch(`/api/dogs?dogId=${dogId}`),
        ]);

        const medData = await medRes.json();
        const dogData = await dogRes.json();

        if (Array.isArray(medData)) setMedicijnen(medData);

        if (Array.isArray(dogData)) {
          setDog(dogData.find((d) => String(d.id) === String(dogId)) || null);
        } else {
          setDog(dogData);
        }
      } catch (err) {
        console.error("Data laden mislukt:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [dogId]);

  const handleAddMedicijn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dogId) return;

    try {
      const res = await fetch("/api/medicatie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newMed, dog_id: dogId }),
      });

      if (res.ok) {
        const savedMed = await res.json();
        setMedicijnen([savedMed, ...medicijnen]);
        setNewMed({
          naam: "",
          dosering: "",
          frequentie: "1x per dag",
          notitie: "",
        });
        setIsAdding(false);
      }
    } catch (err) {
      console.error("Opslaan mislukt:", err);
    }
  };

  const removeMedicijn = async (id: string) => {
    if (!confirm("Medicijn verwijderen?")) return;
    try {
      const res = await fetch(`/api/medicatie/${id}`, { method: "DELETE" });
      if (res.ok) setMedicijnen(medicijnen.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Verwijderen mislukt:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#1A1A2E] antialiased p-6 md:p-12">
      <div className="w-full max-w-xl text-left ml-0">
        <Link
          href={`/dashboard?dogId=${dogId}`}
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
              Medicatie
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
              Beheer het dagschema van {dog?.name || "je hond"}
            </p>
          </div>
        </header>

        <div className="space-y-4 mb-10">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-[#4FC3F7]" />
            </div>
          ) : medicijnen.length === 0 && !isAdding ? (
            <div className="p-10 border-2 border-dashed border-slate-100 rounded-[2rem] text-center">
              <Pill className="mx-auto text-slate-200 mb-3" size={32} />
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                Geen actieve medicatie voor {dog?.name}
              </p>
            </div>
          ) : (
            medicijnen.map((med) => (
              <div
                key={med.id}
                className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="font-black uppercase text-sm text-[#1A1A2E]">
                    {med.naam}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {med.dosering} • {med.frequentie}
                  </p>
                  {med.notitie && (
                    <p className="text-[9px] text-slate-400 mt-1 italic">
                      {med.notitie}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeMedicijn(med.id)}
                  className="p-3 text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-5 border-2 border-[#4FC3F7] text-[#4FC3F7] font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-[#4FC3F7] hover:text-white transition-all flex items-center justify-center gap-2">
            <Plus size={18} /> Medicijn Toevoegen
          </button>
        ) : (
          <form
            onSubmit={handleAddMedicijn}
            className="p-8 bg-white border-2 border-[#4FC3F7] rounded-[2.5rem] space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-slate-400">
                Naam Medicijn
              </label>
              <input
                required
                value={newMed.naam}
                onChange={(e) => setNewMed({ ...newMed, naam: e.target.value })}
                placeholder="bijv. Apoquel"
                className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-400">
                  Dosering
                </label>
                <input
                  required
                  value={newMed.dosering}
                  onChange={(e) =>
                    setNewMed({ ...newMed, dosering: e.target.value })
                  }
                  placeholder="bijv. 16mg"
                  className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-400">
                  Frequentie
                </label>
                <select
                  value={newMed.frequentie}
                  onChange={(e) =>
                    setNewMed({ ...newMed, frequentie: e.target.value })
                  }
                  className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none">
                  <option value="1x per dag">1x per dag</option>
                  <option value="2x per dag">2x per dag</option>
                  <option value="3x per dag">3x per dag</option>
                  <option value="Wekelijks">Wekelijks</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-slate-400">
                Notitie / Instructie
              </label>
              <textarea
                value={newMed.notitie}
                onChange={(e) =>
                  setNewMed({ ...newMed, notitie: e.target.value })
                }
                placeholder="bijv. Innemen met wat voer"
                className="w-full p-4 bg-slate-50 rounded-xl font-bold outline-none h-20 resize-none"
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
                className="px-6 py-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                Annuleer
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
