"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";

const BANNER_KEY = "topbanner-early-bird-dismissed";

export function TopBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(BANNER_KEY)) setVisible(true);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    localStorage.setItem(BANNER_KEY, "1");
    setVisible(false);
  };

  return (
    <div className="w-full bg-[#1A1A2E] text-white text-center px-4 py-2.5 flex items-center justify-center gap-3 relative">
      <p className="text-xs font-black uppercase tracking-wide">
        🏷️ Early Bird deal: Eerste groep baasjes krijgen{" "}
        <span className="text-[#4FC3F7]">50% korting</span> op het
        jaarabonnement!{" "}
        <Link
          href="/#pricing"
          className="underline underline-offset-2 hover:text-[#4FC3F7] transition-colors ml-1">
          Bekijk prijzen →
        </Link>
      </p>
      <button
        onClick={dismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-1">
        <X size={14} />
      </button>
    </div>
  );
}
