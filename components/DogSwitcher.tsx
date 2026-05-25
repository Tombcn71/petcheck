"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

interface Dog {
  id: string;
  name: string;
  image_url?: string;
}

interface DogSwitcherProps {
  allDogs: Dog[];
  dogIdFromUrl: string;
}

export function DogSwitcher({ allDogs = [], dogIdFromUrl }: DogSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex flex-row flex-wrap items-center gap-3">
      {/* Toon avatars ALLEEN als er meer dan 1 hond is */}
      {allDogs.length > 1 &&
        allDogs.map((d) => {
          const isActive =
            String(dogIdFromUrl) === String(d.id) ||
            (!dogIdFromUrl && allDogs[0]?.id === d.id);

          return (
            <button
              key={d.id}
              onClick={() => router.push(`${pathname}?dogId=${d.id}`)}
              className={`flex items-center gap-3 px-3 py-1.5 rounded-xl transition-all border text-left cursor-pointer ${
                isActive
                  ? "bg-blue-50/60 border-blue-100 opacity-100 font-bold text-blue-600 shadow-xs"
                  : "bg-white border-slate-100 opacity-60 hover:opacity-100 text-[#1A1A2E]"
              }`}>
              <div
                className={`h-8 w-8 rounded-lg overflow-hidden border shadow-xs shrink-0 bg-white ${isActive ? "border-blue-200" : "border-slate-200"}`}>
                {d.image_url ? (
                  <img
                    src={d.image_url}
                    alt={d.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm">
                    🐶
                  </div>
                )}
              </div>
              <span className="text-xs font-semibold pr-1">{d.name}</span>
            </button>
          );
        })}

      {/* Toon de plus-knop altijd (zolang er < 3 honden zijn) */}
      {allDogs.length < 3 && (
        <Link
          href="/onboarding"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 hover:border-[#4FC3F7] transition-all text-slate-400 group h-[46px]">
          <div className="h-8 w-8 rounded-lg border border-dashed border-slate-200 flex items-center justify-center shrink-0 group-hover:border-[#4FC3F7] bg-white">
            <Plus
              size={14}
              strokeWidth={2.5}
              className="group-hover:text-[#4FC3F7]"
            />
          </div>
          <span className="text-xs group-hover:text-[#4FC3F7] hidden sm:inline">
            Hond toevoegen
          </span>
        </Link>
      )}
    </div>
  );
}
