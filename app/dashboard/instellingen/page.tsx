"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  LogOut,
  Globe,
  Bell,
  CreditCard,
  User,
} from "lucide-react";

export default function InstellingenPage() {
  const [settings, setSettings] = useState({
    name: "Jan Jansen",
    email: "jan@voorbeeld.nl",
    language: "Nederlands",
    units: "kg",
    notifications: true,
    reminders: "3-maanden",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Opslaan naar Neon:", settings);
    alert("Instellingen succesvol bijgewerkt.");
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#1A1A2E] antialiased p-6 md:p-12">
      {/* Geen centrering: direct links uitgelijnd tegen de sidebar */}
      <div className="w-full max-w-4xl text-left ml-0">
        <header className="mb-10">
          <h1
            className="text-4xl font-extrabold text-[#1A1A2E] tracking-tight mb-2 uppercase"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Instellingen
          </h1>
          <p className="text-slate-500 font-medium uppercase text-[10px] tracking-widest">
            Beheer account, app-configuratie en betaalmethode
          </p>
        </header>

        <form onSubmit={handleSave} className="space-y-12">
          {/* 1. GEBRUIKER & ACCOUNT */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-100 pb-10">
            <div className="space-y-4">
              <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#4FC3F7]">
                <User size={14} /> Persoonlijk
              </h2>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                  Volledige naam
                </label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) =>
                    setSettings({ ...settings, name: e.target.value })
                  }
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#4FC3F7] outline-none font-bold"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                  E-mailadres
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value })
                  }
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#4FC3F7] outline-none font-bold"
                />
              </div>
            </div>

            {/* 2. APP CONFIGURATIE */}
            <div className="space-y-4">
              <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#4FC3F7]">
                <Globe size={14} /> App-voorkeuren
              </h2>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                  Taal
                </label>
                <select
                  value={settings.language}
                  onChange={(e) =>
                    setSettings({ ...settings, language: e.target.value })
                  }
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none cursor-pointer">
                  <option value="Nederlands">Nederlands</option>
                  <option value="English">English</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                  Metingseenheden
                </label>
                <select
                  value={settings.units}
                  onChange={(e) =>
                    setSettings({ ...settings, units: e.target.value })
                  }
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none cursor-pointer">
                  <option value="kg">Kilogram (kg)</option>
                  <option value="lbs">Ponden (lbs)</option>
                </select>
              </div>
            </div>
          </section>

          {/* 3. MELDINGEN & REMINDERS */}
          <section className="space-y-6 border-b border-slate-100 pb-10">
            <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#4FC3F7]">
              <Bell size={14} /> Notificaties
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-sm font-bold">
                  E-mail notificaties aan
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setSettings({
                      ...settings,
                      notifications: !settings.notifications,
                    })
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.notifications ? "bg-[#4FC3F7]" : "bg-slate-300"}`}>
                  <div
                    className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${settings.notifications ? "right-1" : "left-1"}`}
                  />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                  Scan Frequentie Herinnering
                </label>
                <select
                  value={settings.reminders}
                  onChange={(e) =>
                    setSettings({ ...settings, reminders: e.target.value })
                  }
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none text-sm cursor-pointer">
                  <option value="geen">Geen herinneringen</option>
                  <option value="1-maand">Elke maand</option>
                  <option value="3-maanden">Elke 3 maanden (Aanbevolen)</option>
                </select>
              </div>
            </div>
          </section>

          {/* 4. BETALING */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#4FC3F7]">
              <CreditCard size={14} /> Facturatie
            </h2>
            <div className="p-6 bg-[#F8FAFC] border border-slate-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black text-[#1A1A2E] uppercase tracking-tight">
                  Status: DoggyScan Pro
                </p>
                <p className="text-[10px] text-slate-500 mt-1 font-bold uppercase">
                  Betaalmethode: iDEAL / Bancontact
                </p>
              </div>
              <button
                type="button"
                className="px-6 py-3 bg-white border border-slate-200 text-[#1A1A2E] font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all">
                Beheer via Stripe
              </button>
            </div>
          </section>

          {/* ACTIES */}
          <div className="pt-8 flex flex-col md:flex-row gap-4">
            <button
              type="submit"
              className="px-12 py-5 bg-[#1A1A2E] text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-[#4FC3F7] transition-all shadow-xl">
              Opslaan
            </button>
            <button
              type="button"
              className="px-12 py-5 text-slate-400 font-bold uppercase text-xs tracking-[0.2em] hover:text-red-500 transition-colors">
              Uitloggen
            </button>
          </div>
        </form>
      </div>
      <div className="h-20" />
    </div>
  );
}
