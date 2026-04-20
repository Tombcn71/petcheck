"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Menu,
  PawPrint,
  X,
  LayoutDashboard,
  LogIn,
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <header className="sticky top-0 w-full bg-white border-b border-slate-100 z-[120] font-jakarta">
      <div className="w-full px-6 lg:px-10">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-[#4FC3F7] text-white w-9 h-9 flex items-center justify-center rounded-xl shadow-sm">
              <PawPrint fill="currentColor" size={20} />
            </div>
            <span className="font-extrabold text-[#1A1A2E] tracking-tighter text-lg uppercase">
              Doggy<span className="text-[#4FC3F7]">scan.nl</span>
            </span>
          </Link>

          {/* DESKTOP NAV: Alleen op homepage */}
          {!isDashboard && (
            <nav className="hidden md:flex items-center gap-8 text-slate-500 font-bold text-xs uppercase tracking-widest">
              <a
                href={pathname === "/" ? "#features" : "/#features"}
                className="hover:text-[#4FC3F7] transition-colors">
                Features
              </a>
              <a
                href={pathname === "/" ? "#pricing" : "/#pricing"}
                className="hover:text-[#4FC3F7] transition-colors">
                Prijzen
              </a>
              <a
                href={pathname === "/" ? "#faq" : "/#faq"}
                className="hover:text-[#4FC3F7] transition-colors">
                FAQ
              </a>
            </nav>
          )}

          <div className="flex items-center gap-3">
            {/* AUTH SECTIE DESKTOP */}
            <Show when="signed-out">
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/signin?redirect_url=/dashboard"
                  className="font-bold text-slate-700 text-xs uppercase tracking-widest hover:text-[#4FC3F7] transition-colors">
                  Inloggen
                </Link>
                <Link href="/signup?redirect_url=/onboarding">
                  <Button className="bg-[#1A1A2E] hover:bg-[#4FC3F7] text-white px-6 h-11 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all shadow-md active:scale-95">
                    Start gratis week
                  </Button>
                </Link>
              </div>
            </Show>

            <Show when="signed-in">
              <div className="flex items-center gap-4">
                {!isDashboard && (
                  <Link href="/dashboard" className="hidden md:block">
                    <Button className="bg-[#1A1A2E] text-white px-6 h-10 rounded-xl font-bold uppercase text-[10px] tracking-widest">
                      Dashboard
                    </Button>
                  </Link>
                )}
                <UserButton
                  appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }}
                />
              </div>
            </Show>

            {/* MOBIEL MENU */}
            {!isDashboard && (
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-0 h-auto w-auto">
                      <Menu
                        size={28}
                        strokeWidth={2.5}
                        className="text-[#1A1A2E]"
                      />
                    </Button>
                  </SheetTrigger>

                  <SheetContent
                    side="right"
                    className="w-full sm:w-80 !bg-white p-0 border-l border-slate-100 shadow-xl flex flex-col">
                    <SheetHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between">
                      <SheetTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Navigatie
                      </SheetTitle>
                      <SheetClose className="rounded-full p-2 hover:bg-slate-50">
                        <X size={24} className="text-[#1A1A2E]" />
                      </SheetClose>
                    </SheetHeader>

                    <div className="p-8 flex flex-col gap-2 flex-1 items-end">
                      {/* LINKS MET SHEETCLOSE ZODAT MENU SLUIT */}
                      <SheetClose asChild>
                        <a
                          href={pathname === "/" ? "#features" : "/#features"}
                          className="text-xl font-black uppercase tracking-tighter text-[#111827] py-3 hover:text-[#4FC3F7] italic transition-all">
                          Features
                        </a>
                      </SheetClose>
                      <SheetClose asChild>
                        <a
                          href={pathname === "/" ? "#pricing" : "/#pricing"}
                          className="text-xl font-black uppercase tracking-tighter text-[#111827] py-3 hover:text-[#4FC3F7] italic transition-all">
                          Prijzen
                        </a>
                      </SheetClose>
                      <SheetClose asChild>
                        <a
                          href={pathname === "/" ? "#faq" : "/#faq"}
                          className="text-xl font-black uppercase tracking-tighter text-[#111827] py-3 hover:text-[#4FC3F7] italic transition-all border-b border-slate-50 w-full text-right pb-6">
                          FAQ
                        </a>
                      </SheetClose>

                      {/* MOBIELE AUTH LOGICA */}
                      <div className="w-full mt-8 flex flex-col gap-4 items-end">
                        <Show when="signed-out">
                          <SheetClose asChild>
                            <Link
                              href="/signin?redirect_url=/dashboard"
                              className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-600 mb-2">
                              Inloggen{" "}
                              <LogIn size={18} className="text-[#4FC3F7]" />
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link
                              href="/signup?redirect_url=/onboarding"
                              className="w-full">
                              <Button className="w-full bg-[#1A1A2E] text-white h-14 rounded-2xl font-black uppercase text-xs tracking-widest gap-2 shadow-lg shadow-blue-900/10">
                                <Sparkles size={16} /> Start gratis week
                              </Button>
                            </Link>
                          </SheetClose>
                        </Show>

                        <Show when="signed-in">
                          <SheetClose asChild>
                            <Link href="/dashboard" className="w-full">
                              <Button className="w-full bg-[#4FC3F7] text-white h-14 rounded-2xl font-black uppercase text-xs tracking-widest gap-2 shadow-lg shadow-sky-400/20">
                                <LayoutDashboard size={18} /> Naar Dashboard
                              </Button>
                            </Link>
                          </SheetClose>
                        </Show>
                      </div>
                    </div>

                    <div className="p-8 border-t border-slate-50 bg-slate-50/50">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right leading-relaxed">
                        DoggyScan.nl <br /> 2026 Dashboard Edition
                      </p>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
