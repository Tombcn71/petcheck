"use client";

import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  LogOut,
  Bell,
  CreditCard,
  User,
  Loader2,
  ExternalLink,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

// Importeer hier je PricingModal component (pas het pad aan naar waar jouw bestand staat)
import { PricingModal } from "@/components/PricingModal";

export default function InstellingenPage() {
  const { user, isLoaded } = useUser();
  const { signOut, openUserProfile } = useClerk();

  const [loading, setLoading] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [initialFetchLoading, setInitialFetchLoading] = useState(true);
  const [isPricingOpen, setIsPricingOpen] = useState(false); // Staat om de modal te openen/sluiten

  const [settings, setSettings] = useState({
    name: "",
    email: "",
    marketingEmails: true,
    planStatus: "free",
  });

  // Haal data op: Database eerst, Clerk als backup
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/user/settings");
        const dbData = res.ok ? await res.json() : null;

        setSettings({
          name: dbData?.full_name || user?.fullName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
          marketingEmails: dbData?.notifications ?? true,
          planStatus: dbData?.plan_status || "free",
        });
      } catch (err) {
        console.error("Fout bij ophalen:", err);
        setSettings((prev) => ({
          ...prev,
          name: user?.fullName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
          planStatus: "free",
        }));
      } finally {
        setInitialFetchLoading(false);
      }
    };

    if (isLoaded && user) {
      fetchSettings();
    }
  }, [isLoaded, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: settings.name,
          notifications: settings.marketingEmails,
        }),
      });
      if (!response.ok) throw new Error("Opslaan mislukt");
      alert("Instellingen succesvol bijgewerkt!");
    } catch (err) {
      alert("Er ging iets mis bij het opslaan.");
    } finally {
      setLoading(false);
    }
  };

  const openStripePortal = async () => {
    setStripeLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      alert("Kon betaalomgeving niet laden.");
    } finally {
      setStripeLoading(false);
    }
  };

  if (!isLoaded || initialFetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#4FC3F7]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-jakarta text-[#1A1A2E] antialiased p-6 md:p-12">
      <div className="w-full max-w-4xl text-left ml-0">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-[#1A1A2E] tracking-tighter mb-2 uppercase italic">
            Instellingen
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">
            Beheer je profiel en DoggyScan account
          </p>
        </header>

        <form onSubmit={handleSave} className="space-y-16">
          {/* 1. PROFIEL & VEILIGHEID */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#4FC3F7]">
                <User size={14} /> Persoonlijk
              </h2>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                    Naam
                  </label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) =>
                      setSettings({ ...settings, name: e.target.value })
                    }
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#4FC3F7] outline-none font-bold transition-all text-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    disabled
                    value={settings.email}
                    className="w-full p-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl font-bold text-slate-400 cursor-not-allowed text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#4FC3F7]">
                <Lock size={14} /> Beveiliging
              </h2>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                  Wachtwoord
                </label>
                <button
                  type="button"
                  onClick={() => openUserProfile()}
                  className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-[#1A1A2E] hover:border-[#4FC3F7] hover:bg-slate-50 transition-all flex items-center justify-between text-sm group">
                  Wachtwoord wijzigen
                  <ExternalLink
                    size={16}
                    className="text-slate-300 group-hover:text-[#4FC3F7] transition-colors"
                  />
                </button>
              </div>
            </div>
          </section>

          {/* 2. DYNAMISCH ABONNEMENT */}
          <section className="space-y-6 pt-6 border-t border-slate-50">
            <h2 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#4FC3F7]">
              <CreditCard size={14} /> Facturatie
            </h2>

            {settings.planStatus === "pro" ? (
              /* PRO LAYOUT */
              <div className="p-8 bg-emerald-50/60 border-2 border-emerald-100 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in duration-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-emerald-500">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-black text-[#1A1A2E] uppercase tracking-widest">
                        DoggyScan Pro
                      </p>
                      <span className="bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                        Actief
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                      Je hebt onbeperkt toegang tot alle medische scans en
                      rapporten.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={openStripePortal}
                  disabled={stripeLoading}
                  className="px-8 py-4 bg-white text-[#1A1A2E] font-black text-[10px] uppercase tracking-widest rounded-2xl border-2 border-emerald-100 hover:bg-emerald-50 transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm">
                  {stripeLoading ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <>
                      <ExternalLink size={14} /> Abonnement Beheren
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* GRATIS LAYOUT (OPENT PRICING MODAL) */
              <div className="p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in duration-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400">
                    <User size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-black text-[#1A1A2E] uppercase tracking-widest">
                        DoggyScan Gratis
                      </p>
                      <span className="bg-slate-200 text-slate-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                        Beperkt
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                      Upgrade naar Pro for onbeperkte scans en officiële
                      PDF-rapporten.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPricingOpen(true)} // Zet hier de modal op open!
                  className="px-8 py-4 bg-[#1A1A2E] text-white font-black text-[10px] uppercase tracking-widest rounded-2xl border-2 border-[#1A1A2E] hover:bg-[#4FC3F7] hover:border-[#4FC3F7] transition-all flex items-center gap-2 shadow-md">
                  Upgrade naar Pro
                </button>
              </div>
            )}
          </section>

          {/* 3. NOTIFICATIES */}
          <section className="space-y-6 pt-6 border-t border-slate-50">
            <h2 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#4FC3F7]">
              <Bell size={14} /> Communicatie
            </h2>
            <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border-2 border-slate-100 max-w-xl">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#4FC3F7]">
                  <Mail size={20} />
                </div>
                <div className="flex flex-col text-sm font-bold">
                  E-mail updates
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                    Scans, tips en nieuws
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSettings({
                    ...settings,
                    marketingEmails: !settings.marketingEmails,
                  })
                }
                className={`w-12 h-6 rounded-full transition-all relative ${settings.marketingEmails ? "bg-[#4FC3F7]" : "bg-slate-200"}`}>
                <div
                  className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${settings.marketingEmails ? "right-1 shadow-md" : "left-1"}`}
                />
              </button>
            </div>
          </section>

          {/* ACTIES */}
          <div className="pt-10 flex flex-col md:flex-row gap-6 items-center justify-between border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-16 py-5 bg-[#1A1A2E] text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-[#4FC3F7] transition-all shadow-xl shadow-slate-200 disabled:opacity-70">
              {loading ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                "Opslaan"
              )}
            </button>

            <button
              type="button"
              onClick={() => signOut()}
              className="group flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-red-400 transition-colors">
              <LogOut size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-red-400">
                Uitloggen
              </span>
            </button>
          </div>
        </form>
      </div>
      <div className="h-20" />

      {/* PRICING MODAL COMPONENT */}
      {isPricingOpen && (
        <PricingModal
          isOpen={isPricingOpen}
          onClose={() => setIsPricingOpen(false)}
        />
      )}
    </div>
  );
}
