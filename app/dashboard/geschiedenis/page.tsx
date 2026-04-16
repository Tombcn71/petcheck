"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Search,
  Calendar,
  Trash2,
  CameraOff,
} from "lucide-react";

interface Scan {
  id: string;
  tool_id: string;
  summary: string;
  details: string;
  advice: string;
  image_url: string;
  is_ok: boolean;
  created_at: string;
}

const vertalingen: Record<string, string> = {
  alles: "Alles",
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

export default function Geschiedenis() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("alles");

  useEffect(() => {
    async function fetchScans() {
      try {
        const res = await fetch("/api/geschiedenis");
        const data = await res.json();
        setScans(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchScans();
  }, []);

  const uniekeIDs = Array.from(new Set(scans.map((s) => s.tool_id)));
  const categories = ["alles", ...uniekeIDs];

  async function handleDelete(id: string) {
    if (!confirm("Weet je zeker dat je deze scan wilt verwijderen?")) return;
    try {
      const res = await fetch(`/api/geschiedenis/${id}`, { method: "DELETE" });
      if (res.ok) {
        setScans((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  }

  const gefilterd = scans.filter((s) => {
    const vertaaldeNaam = vertalingen[s.tool_id] || s.tool_id;
    const matchesSearch =
      s.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vertaaldeNaam.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "alles" || s.tool_id === activeTab;
    return matchesSearch && matchesTab;
  });

  if (loading)
    return (
      <div className="ml-16 lg:ml-2 flex h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="font-black text-[#4FC3F7] animate-pulse uppercase tracking-widest italic">
          Laden...
        </div>
      </div>
    );

  return (
    <main className="ml-16 lg:ml-2 min-h-screen bg-[#F8FAFC]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&family=DM+Sans:wght@400;500;700&display=swap');
        
        :root {
          --brand-blue: #4FC3F7; /* EXACT HET BLAUW VAN JOUW HOMEPAGE */
        }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        h1, h3 { font-family: 'Syne', sans-serif; }
        body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="p-6 md:p-10">
        {/* HEADER */}
        <div className="mb-8">
          <a
            href="/dashboard"
            className="text-[#4FC3F7] flex items-center gap-1 font-bold mb-4 text-xs italic hover:underline w-fit">
            <ArrowLeft size={14} /> Dashboard
          </a>
          <h1 className="text-4xl md:text-6xl font-black italic uppercase text-[#1A1A2E] leading-none tracking-tighter">
            Scan <span className="text-[#4FC3F7]">Logboek</span>
          </h1>
        </div>

        {/* CATEGORIE TABS */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                activeTab === cat
                  ? "bg-[#4FC3F7] text-white border-[#4FC3F7] shadow-lg shadow-[#4FC3F7]/20"
                  : "bg-white text-slate-400 border-slate-100 hover:border-[#4FC3F7]"
              }`}>
              {vertalingen[cat] || cat.replace(/-/g, " ")}
            </button>
          ))}
        </div>

        {/* ZOEKEN */}
        <div className="relative mb-10 max-w-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
            size={16}
          />
          <input
            className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white border border-slate-100 outline-none text-xs font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-[#4FC3F7]/10 transition-all"
            placeholder="ZOEKEN IN GEGEVENS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* GRID MET KAARTEN */}
        {gefilterd.length === 0 ? (
          <div className="py-20 text-center text-slate-300 font-black uppercase text-xs tracking-widest italic">
            Geen resultaten gevonden.
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {gefilterd.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden hover:shadow-xl hover:border-[#4FC3F7]/30 transition-all duration-300 group">
                {/* IMAGE AREA */}
                <div className="relative h-48 bg-slate-50 border-b border-slate-50 overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt="Scan"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200 bg-slate-100">
                      <CameraOff size={28} />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-2 rounded-full shadow-sm">
                    {item.is_ok ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : (
                      <AlertCircle className="text-amber-500" size={20} />
                    )}
                  </div>
                </div>

                {/* TEXT AREA */}
                <div className="p-7 flex flex-col flex-1">
                  <div className="mb-5">
                    <h3 className="font-black text-xl uppercase italic leading-none text-[#1A1A2E] mb-1.5">
                      {vertalingen[item.tool_id] ||
                        item.tool_id.replace(/-/g, " ")}
                    </h3>
                    <p
                      className={`${item.is_ok ? "text-green-600" : "text-red-600"} font-black text-[11px] uppercase italic leading-tight tracking-tight`}>
                      {item.summary}
                    </p>
                  </div>

                  <div className="bg-slate-50/80 rounded-3xl p-5 mb-5 space-y-4 flex-1">
                    <div>
                      <span className="block font-black text-[9px] uppercase text-slate-400 italic mb-1">
                        Inzicht:
                      </span>
                      <p className="text-slate-600 text-xs leading-relaxed font-medium">
                        {item.details}
                      </p>
                    </div>
                    {item.advice && (
                      <div className="pt-3 border-t border-slate-200/50">
                        <span className="block font-black text-[9px] uppercase text-[#4FC3F7] italic mb-1">
                          AI Advies:
                        </span>
                        <p className="text-slate-700 text-xs font-bold leading-relaxed">
                          {item.advice}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* FOOTER */}
                  <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      <Calendar size={12} className="text-[#4FC3F7]" />
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString(
                            "nl-NL",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )
                        : "—"}
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all p-2.5 rounded-xl shadow-sm"
                      title="Verwijderen">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
