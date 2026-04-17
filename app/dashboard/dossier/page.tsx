"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Search,
  Calendar,
  Trash2,
  CameraOff,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#4FC3F7]" />
          <span className="font-black text-[#1A1A2E] uppercase tracking-widest italic text-xs">
            Gegevens ophalen...
          </span>
        </div>
      </div>
    );

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-6 md:p-10 lg:pl-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="mb-10">
          <h1
            className="text-4xl md:text-6xl font-black  uppercase text-[#1A1A2E] leading-none tracking-tighter"
            style={{ fontFamily: "'Syne', sans-serif" }}>
            Scan <span className="text-[#4FC3F7]">Dossier</span>
          </h1>
        </header>

        {/* CATEGORIE TABS (Scrollable) */}
        <ScrollArea className="w-full whitespace-nowrap mb-8 pb-4">
          <div className="flex w-max space-x-3">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeTab === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab(cat)}
                className={`rounded-full px-6 text-[10px] font-black uppercase tracking-widest h-10 transition-all ${
                  activeTab === cat
                    ? "bg-[#4FC3F7] hover:bg-[#3db0e3] text-white border-none shadow-lg shadow-[#4FC3F7]/20"
                    : "bg-white text-slate-400 border-slate-200 hover:border-[#4FC3F7] hover:text-[#4FC3F7]"
                }`}>
                {vertalingen[cat] || cat.replace(/-/g, " ")}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>

        {/* ZOEKEN */}
        <div className="relative mb-10 max-w-md group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4FC3F7] transition-colors"
            size={18}
          />
          <Input
            className="h-14 pl-12 pr-4 rounded-2xl bg-white border-slate-200 text-xs font-bold placeholder:text-slate-300 focus-visible:ring-[#4FC3F7]/20 transition-all uppercase tracking-widest"
            placeholder="ZOEKEN IN GEGEVENS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* GRID MET KAARTEN */}
        {gefilterd.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem]">
            <p className="text-slate-300 font-black uppercase text-sm tracking-[0.2em] italic">
              Geen resultaten gevonden.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {gefilterd.map((item) => (
              <Card
                key={item.id}
                className="rounded-[2.5rem] border-slate-200/60 shadow-sm overflow-hidden hover:shadow-2xl hover:border-[#4FC3F7]/30 transition-all duration-500 group">
                {/* IMAGE AREA */}
                <div className="relative h-52 bg-slate-100 overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt="Scan Resultaat"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                      <CameraOff size={32} strokeWidth={1.5} />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-sm">
                    {item.is_ok ? (
                      <CheckCircle className="text-emerald-500" size={22} />
                    ) : (
                      <AlertCircle className="text-amber-500" size={22} />
                    )}
                  </div>
                  <Badge className="absolute bottom-4 left-4 bg-[#1A1A2E]/80 backdrop-blur-md text-[9px] font-black uppercase tracking-widest border-none">
                    {vertalingen[item.tool_id] || item.tool_id}
                  </Badge>
                </div>

                <CardContent className="p-7">
                  <div className="mb-5">
                    <h3
                      className="font-black text-xl uppercase italic leading-none text-[#1A1A2E] mb-2 tracking-tight"
                      style={{ fontFamily: "'Syne', sans-serif" }}>
                      {vertalingen[item.tool_id] ||
                        item.tool_id.replace(/-/g, " ")}
                    </h3>
                    <p
                      className={`${item.is_ok ? "text-emerald-600" : "text-rose-600"} font-black text-[11px] uppercase italic tracking-wider`}>
                      {item.summary}
                    </p>
                  </div>

                  <div className="bg-slate-50/80 rounded-3xl p-5 mb-6 space-y-4 border border-slate-100">
                    <div>
                      <span className="block font-black text-[9px] uppercase text-slate-400 italic mb-1 tracking-widest">
                        Inzicht:
                      </span>
                      <p className="text-slate-600 text-[13px] leading-relaxed font-medium">
                        {item.details}
                      </p>
                    </div>
                    {item.advice && (
                      <div className="pt-3 border-t border-slate-200/50">
                        <span className="block font-black text-[9px] uppercase text-[#4FC3F7] italic mb-1 tracking-widest">
                          AI Advies:
                        </span>
                        <p className="text-slate-800 text-[13px] font-bold leading-relaxed">
                          {item.advice}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* FOOTER */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      <Calendar size={14} className="text-[#4FC3F7]" />
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString(
                            "nl-NL",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "—"}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="h-10 w-10 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
