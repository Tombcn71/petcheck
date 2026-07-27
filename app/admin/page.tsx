"use client";

import { useState } from "react";
import { Loader2, MessageSquare, Lock, Mail } from "lucide-react";

const categorieLabelMap: Record<string, string> = {
  bug: "🐛 Bug",
  idee: "💡 Idee",
  compliment: "❤️ Compliment",
};

interface FeedbackItem {
  id: number;
  user_email: string | null;
  categorie: string;
  bericht: string;
  mag_reageren: boolean;
  created_at: string;
}

export default function AdminPage() {
  const [wachtwoord, setWachtwoord] = useState("");
  const [items, setItems] = useState<FeedbackItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [fout, setFout] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFout(false);
    try {
      const res = await fetch(`/api/feedback?pw=${encodeURIComponent(wachtwoord)}`);
      if (!res.ok) { setFout(true); return; }
      setItems(await res.json());
    } catch {
      setFout(true);
    } finally {
      setLoading(false);
    }
  };

  if (items) {
    return (
      <div className="min-h-screen bg-white font-jakarta p-6 md:p-12">
        <header className="mb-10">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-[#1A1A2E] italic">
            Feedback <span className="text-[#4FC3F7]">/ Overzicht</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
            {items.length} reactie{items.length !== 1 ? "s" : ""}
          </p>
        </header>

        {items.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem]">
            <MessageSquare className="mx-auto text-slate-200 mb-3" size={32} />
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              Nog geen feedback ontvangen
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-w-2xl">
            {items.map((item) => (
              <div key={item.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#4FC3F7]">
                    {categorieLabelMap[item.categorie] ?? item.categorie}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    {new Date(item.created_at).toLocaleString("nl-NL")}
                  </span>
                </div>
                <p className="text-sm font-bold text-[#1A1A2E] leading-relaxed">{item.bericht}</p>
                <div className="flex items-center justify-between flex-wrap gap-2 mt-1">
                  {item.user_email && (
                    <p className="text-[10px] text-slate-400 font-bold">{item.user_email}</p>
                  )}
                  {item.mag_reageren && item.user_email && (
                    <a
                      href={`mailto:${item.user_email}?from=info@doggyscan.nl&subject=Reactie op jouw feedback (Doggyscan)&body=Hoi,%0A%0ABedankt voor je feedback!%0A%0A---%0AJouw bericht:%0A"${encodeURIComponent(item.bericht)}"%0A---`}
                      className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-[#4FC3F7]/10 text-[#0288D1] hover:bg-[#4FC3F7]/20 px-3 py-1.5 rounded-full transition-colors">
                      <Mail size={11} /> Reageren
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center font-jakarta">
      <form onSubmit={login} className="w-full max-w-sm space-y-4 p-8">
        <div className="flex items-center justify-center w-14 h-14 bg-[#4FC3F7]/10 rounded-2xl mx-auto mb-6">
          <Lock size={24} className="text-[#4FC3F7]" />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tighter text-center text-[#1A1A2E]">
          Admin
        </h1>
        <input
          type="password"
          value={wachtwoord}
          onChange={(e) => setWachtwoord(e.target.value)}
          placeholder="Wachtwoord"
          className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-[#4FC3F7] transition-all"
          autoFocus
        />
        {fout && (
          <p className="text-red-400 text-xs font-black uppercase tracking-widest text-center">
            Wachtwoord onjuist
          </p>
        )}
        <button
          type="submit"
          disabled={!wachtwoord || loading}
          className="w-full py-4 bg-[#4FC3F7] hover:bg-[#0288D1] text-white font-black uppercase text-xs tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? <Loader2 size={14} className="animate-spin" /> : "Inloggen"}
        </button>
      </form>
    </div>
  );
}
