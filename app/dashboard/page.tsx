"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link"; // Vergeet deze import niet

export default function Dashboard() {
  return (
    <div className="max-w-6xl">
      <style>{`
        h1 { font-family: 'Syne', sans-serif; }
        .text-brand-light { color: #4FC3F7; }
        .bg-brand-button { background: #1A1A2E; }
        .badge-brand { background: #E6F1FB; color: #0288D1; }
      `}</style>

      <section className="bg-white rounded-[2rem] border border-slate-100 p-10 md:p-16 shadow-sm">
        <div className="max-w-2xl text-left">
          <div className="badge-brand inline-block px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wider mb-6">
            Next-Gen Veterinary AI
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-[#1A1A2E] tracking-tighter leading-[1.05] mb-8">
            Nieuwe <br />
            <span className="text-brand-light">Gezondheidscheck</span>
          </h1>

          <p className="text-[#6B6B8A] text-xl font-medium mb-10 leading-relaxed max-w-md">
            Scan ogen, gebit, huid of ontlasting in seconden.
          </p>

          {/* Nu een Link in plaats van een button */}
          <Link
            href="/dashboard/check"
            className="bg-brand-button hover:opacity-90 text-white px-10 py-6 rounded-2xl font-bold text-lg transition-all flex items-center gap-4 w-fit">
            Start Gratis Check
            <ArrowRight size={22} />
          </Link>
        </div>
      </section>
    </div>
  );
}
