"use client";

import { useState } from "react";
import { X, Send, Loader2, CheckCircle } from "lucide-react";

const CATEGORIEEN = [
  { value: "bug", label: "🐛 Bug" },
  { value: "idee", label: "💡 Idee" },
  { value: "compliment", label: "❤️ Compliment" },
];

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [categorie, setCategorie] = useState("idee");
  const [bericht, setBericht] = useState("");
  const [magReageren, setMagReageren] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verstuurd, setVerstuurd] = useState(false);

  const verstuur = async () => {
    if (!bericht.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categorie, bericht, magReageren }),
      });
      setVerstuurd(true);
      setBericht("");
      setTimeout(() => {
        setVerstuurd(false);
        setOpen(false);
      }, 2000);
    } catch {
      alert("Versturen mislukt, probeer opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center">
      {/* Uitschuivend paneel */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "w-72 opacity-100" : "w-0 opacity-0"
        }`}>
        <div className="w-72 bg-white shadow-xl border border-slate-100 rounded-l-3xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <span className="text-xs font-black uppercase tracking-widest text-[#1A1A2E]">
              Feedback
            </span>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-red-100 hover:text-red-500 text-slate-400 transition-all flex items-center justify-center">
              <X size={14} strokeWidth={2.5} />
            </button>
          </div>

          {verstuurd ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-[#4FC3F7]">
              <CheckCircle size={32} />
              <p className="text-sm font-black uppercase tracking-widest">Bedankt!</p>
            </div>
          ) : (
            <div className="p-5 space-y-4">
              <div className="flex gap-2">
                {CATEGORIEEN.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setCategorie(c.value)}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase border-2 transition-all ${
                      categorie === c.value
                        ? "border-[#4FC3F7] bg-blue-50 text-[#1A1A2E]"
                        : "border-slate-100 text-slate-400 hover:border-slate-200"
                    }`}>
                    {c.label}
                  </button>
                ))}
              </div>
              <textarea
                value={bericht}
                onChange={(e) => setBericht(e.target.value)}
                placeholder="Deel je gedachten of ervaring..."
                rows={4}
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-[#4FC3F7] resize-none placeholder:text-slate-300 transition-all"
              />
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    checked={magReageren}
                    onChange={(e) => setMagReageren(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border-2 transition-all flex items-center justify-center ${magReageren ? "bg-[#4FC3F7] border-[#4FC3F7]" : "border-slate-200 bg-white"}`}>
                    {magReageren && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-600 leading-tight">
                  Ik geef toestemming om een reactie te ontvangen
                </span>
              </label>

              <button
                onClick={verstuur}
                disabled={!bericht.trim() || loading}
                className="w-full py-3 bg-[#4FC3F7] hover:bg-[#0288D1] text-white font-black uppercase text-xs tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                {loading ? "Versturen..." : "Versturen"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Verticale tab */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="bg-[#4FC3F7] hover:bg-[#0288D1] text-white transition-all rounded-l-xl flex items-center justify-center shrink-0"
        style={{ width: "42px", height: "110px" }}>
        <span
          className="font-black uppercase text-[10px] tracking-widest whitespace-nowrap"
          style={{ transform: "rotate(-90deg)" }}>
          Feedback
        </span>
      </button>
    </div>
  );
}
