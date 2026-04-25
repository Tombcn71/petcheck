"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useUser } from "@clerk/nextjs";
import { Save, ArrowLeft, Camera, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Wrapper om useSearchParams heen voor Next.js 13/14/15
function ProfielContent() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const dogId = searchParams.get("dogId");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [dogData, setDogData] = useState({
    name: "",
    breed: "",
    age: "",
    size: "",
    weight: "",
    gender: "",
    sterilized: "",
    image_url: "",
  });

  // 1. DATA OPHALEN VOOR SPECIFIEKE HOND
  useEffect(() => {
    const fetchDogData = async () => {
      if (!dogId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/dogs");
        if (!res.ok) throw new Error("Kon data niet ophalen");
        const data = await res.json();

        // Zoek de specifieke hond in de roedel
        const currentDog = Array.isArray(data)
          ? data.find((d: any) => d.id.toString() === dogId)
          : data;

        if (currentDog) {
          setDogData({
            name: currentDog.name || "",
            breed: currentDog.breed || "",
            age: currentDog.age || "",
            size: currentDog.size || "",
            weight: currentDog.weight || "",
            gender: currentDog.gender || "",
            sterilized: currentDog.sterilized || "",
            image_url: currentDog.image_url || "",
          });
        }
      } catch (error) {
        console.error("Fout bij ophalen:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDogData();
  }, [dogId]);

  // 2. AFBEELDING UPLOADEN
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Image = reader.result as string;
      try {
        // We sturen de PATCH naar de API met het dogId zodat hij de juiste hond update
        const res = await fetch("/api/dogs", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...dogData, dogId, image: base64Image }),
        });
        if (res.ok) {
          const result = await res.json();
          setDogData((prev) => ({ ...prev, image_url: result.url }));
        }
      } catch (error) {
        alert("Uploaden mislukt");
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // 3. PROFIEL OPSLAAN
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/dogs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...dogData, dogId, image: null }),
      });
      if (res.ok)
        alert("Profiel van " + dogData.name + " succesvol bijgewerkt!");
    } catch (error) {
      alert("Er ging iets mis.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-12 flex items-center gap-4 font-black uppercase text-slate-300">
        <Loader2 className="animate-spin" size={20} /> Laden...
      </div>
    );

  if (!dogId)
    return (
      <div className="p-12 font-black uppercase text-red-400">
        Geen hond geselecteerd. Ga terug naar het dashboard.
      </div>
    );

  return (
    <div className="min-h-screen bg-white font-sans text-[#1A1A2E] p-6 md:p-12">
      <div className="w-full max-w-xl text-left ml-0">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-[#4FC3F7] mb-8 group">
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Terug naar Dashboard
        </Link>

        <header className="mb-10">
          <h1 className="text-3xl font-black text-[#1A1A2E] uppercase tracking-tight italic">
            Profiel <span className="text-[#4FC3F7] not-italic px-2">/</span>{" "}
            {dogData.name || "Hond"}
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
            Account: {user?.primaryEmailAddress?.emailAddress}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* FOTO */}
          <div className="flex flex-col gap-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#4FC3F7]">
              Hondenfoto
            </label>
            <div
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className="relative h-32 w-32 rounded-3xl overflow-hidden border-4 border-slate-100 shadow-sm cursor-pointer group bg-slate-50">
              {dogData.image_url ? (
                <img
                  src={dogData.image_url}
                  className="w-full h-full object-cover"
                  alt="Hond"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">
                  🐶
                </div>
              )}
              <div
                className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                  isUploading
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}>
                {isUploading ? (
                  <Loader2 className="text-white animate-spin" />
                ) : (
                  <Camera className="text-white" />
                )}
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NAAM */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Naam
              </label>
              <input
                type="text"
                value={dogData.name}
                onChange={(e) =>
                  setDogData({ ...dogData, name: e.target.value })
                }
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:border-[#4FC3F7]"
                required
              />
            </div>

            {/* RAS */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Ras
              </label>
              <input
                type="text"
                value={dogData.breed}
                onChange={(e) =>
                  setDogData({ ...dogData, breed: e.target.value })
                }
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:border-[#4FC3F7]"
              />
            </div>

            {/* LEEFTIJD */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Leeftijd
              </label>
              <input
                type="number"
                value={dogData.age}
                onChange={(e) =>
                  setDogData({ ...dogData, age: e.target.value })
                }
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:border-[#4FC3F7]"
              />
            </div>

            {/* GEWICHT */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Gewicht (kg)
              </label>
              <input
                type="number"
                value={dogData.weight}
                onChange={(e) =>
                  setDogData({ ...dogData, weight: e.target.value })
                }
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:border-[#4FC3F7]"
              />
            </div>

            {/* GROOTTE SELECTIE */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Formaat
              </label>
              <select
                value={dogData.size}
                onChange={(e) =>
                  setDogData({ ...dogData, size: e.target.value })
                }
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none appearance-none">
                <option value="klein">Klein</option>
                <option value="middel">Middel</option>
                <option value="groot">Groot</option>
              </select>
            </div>

            {/* GESLACHT */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Geslacht
              </label>
              <div className="flex gap-2">
                {["Reu", "Teef"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setDogData({ ...dogData, gender: g })}
                    className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${
                      dogData.gender === g
                        ? "border-[#4FC3F7] bg-blue-50 text-[#1A1A2E]"
                        : "border-slate-100 text-slate-400"
                    }`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* STERILISATIE */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Gecastreerd / Gesteriliseerd
              </label>
              <div className="flex gap-2">
                {["Ja", "Nee"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setDogData({ ...dogData, sterilized: s })}
                    className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${
                      dogData.sterilized === s
                        ? "border-[#4FC3F7] bg-blue-50 text-[#1A1A2E]"
                        : "border-slate-100 text-slate-400"
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving || isUploading}
            className="w-full py-5 bg-[#1A1A2E] text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-[#4FC3F7] transition-all shadow-lg flex items-center justify-center gap-2">
            {isSaving ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            {isSaving ? "Opslaan..." : "Profiel Opslaan"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Default export met Suspense (vereist voor useSearchParams in Next.js)
export default function ProfielPage() {
  return (
    <Suspense fallback={<div>Laden...</div>}>
      <ProfielContent />
    </Suspense>
  );
}
