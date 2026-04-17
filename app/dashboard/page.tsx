"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="max-w-6xl">
      <section className="bg-white rounded-[2rem] border border-slate-100 p-10 md:p-16 shadow-sm">
        <div className="max-w-2xl text-left">
          {/* Badge */}
          <div className="bg-[#E6F1FB] text-[#0288D1] inline-block px-4 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-widest mb-6">
            Next-Gen Veterinary AI
          </div>

          {/* Title - Syne font via class (zorg dat deze in je tailwind config of globals staat) */}
          <h1 className="font-syne text-3xl md:text-7xl font-extrabold text-[#1A1A2E] tracking-tighter leading-[1.05] mb-8">
            Nieuwe <br />
            <span className="text-[#4FC3F7]">Gezondheidsscan</span>
          </h1>

          {/* Description */}
          <p className="text-[#6B6B8A] text-xl font-medium mb-10 leading-relaxed max-w-md">
            Scan ogen, gebit, huid of ontlasting in seconden.
          </p>

          {/* CTA Link */}
          <Link
            href="/dashboard/check"
            className="bg-[#1A1A2E] hover:opacity-90 text-white px-10 py-6 rounded-2xl font-bold text-lg transition-all flex items-center gap-4 w-fit shadow-xl active:scale-95">
            Start Scan
            <ArrowRight size={22} />
          </Link>
        </div>
      </section>
    </div>
  );
}
