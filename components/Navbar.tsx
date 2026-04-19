"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // 1. Importeer de pathname hook
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, PawPrint, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname(); // 2. Haal de huidige route op
  const isDashboard = pathname?.startsWith("/dashboard"); // 3. Check of je in dashboard bent

  return (
    <header className="sticky top-0 w-full bg-white border-b border-slate-100 z-[120]">
      <div className="w-full px-6 lg:px-10">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-[#4FC3F7] text-white w-9 h-9 flex items-center justify-center rounded-xl shadow-sm">
              <PawPrint fill="currentColor" size={20} />
            </div>
            <span className="font-heading  font-extrabold text-[#1A1A2E] tracking-tighter text-lg uppercase">
              Doggy<span className="text-[#4FC3F7]">scan.nl</span>
            </span>
          </Link>

          {/* DESKTOP NAV: Alleen tonen als NIET in dashboard */}
          {!isDashboard && (
            <nav className="hidden md:flex items-center gap-8 text-slate-500 font-bold text-xs uppercase tracking-widest">
              <a
                href="#features"
                className="hover:text-[#4FC3F7] transition-colors">
                Features
              </a>
              <a
                href="#pricing"
                className="hover:text-[#4FC3F7] transition-colors">
                Prijzen
              </a>
              <a href="#faq" className="hover:text-[#4FC3F7] transition-colors">
                FAQ
              </a>
            </nav>
          )}

          <div className="flex items-center gap-3">
            {/* AUTH SECTIE */}
            <Show when="signed-out">
              <div className="hidden md:flex items-center gap-6">
                {/* Link naar je eigen inlogpagina */}
                <Link
                  href="/signin?redirect_url=/dashboard"
                  className="font-bold text-slate-700 text-xs uppercase tracking-widest hover:text-[#4FC3F7] transition-colors">
                  Inloggen
                </Link>

                {/* Link naar je eigen registratiepagina met de juiste CTA */}
                <Link href="/signup?redirect_url=/onboarding">
                  <Button className="bg-[#1A1A2E] hover:bg-[#4FC3F7] text-white px-6 h-11 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all shadow-md active:scale-95">
                    Start gratis week
                  </Button>
                </Link>
              </div>
            </Show>

            <Show when="signed-in">
              <div className="flex items-center gap-4">
                {/* Dashboard knop alleen tonen op homepage */}
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

            {/* MOBIEL MENU: Verberg hamburger volledig in dashboard */}
            {!isDashboard && (
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-0 h-auto w-auto bg-transparent border-none outline-none focus:ring-0">
                      <Menu
                        size={28}
                        strokeWidth={2.5}
                        className="text-[#1A1A2E]"
                      />
                    </Button>
                  </SheetTrigger>

                  <SheetContent
                    side="right"
                    className="w-64 !bg-white p-0 border-l border-slate-100 shadow-xl flex flex-col fixed top-16 h-[calc(100vh-64px)] z-[110]">
                    <SheetHeader className="sr-only">
                      <SheetTitle>Navigatiemenu</SheetTitle>
                    </SheetHeader>

                    <div className="p-8 flex flex-col gap-6 flex-1 text-right items-end pt-10">
                      <a
                        href="#features"
                        className="text-sm font-bold uppercase tracking-widest text-[#1A1A2E] hover:text-[#4FC3F7] py-2">
                        Features
                      </a>
                      <a
                        href="#pricing"
                        className="text-sm font-bold uppercase tracking-widest text-[#1A1A2E] hover:text-[#4FC3F7] py-2">
                        Prijzen
                      </a>
                      <a
                        href="#faq"
                        className="text-sm font-bold uppercase tracking-widest text-[#1A1A2E] hover:text-[#4FC3F7] py-2">
                        FAQ
                      </a>

                      <div className="mt-auto pb-10 w-full flex flex-col gap-6 items-end">
                        <Show when="signed-out">
                          <SignInButton mode="modal">
                            <button className="text-sm font-bold uppercase tracking-widest text-slate-500 py-2">
                              Inloggen
                            </button>
                          </SignInButton>
                        </Show>
                        <div className="pt-4">
                          <SheetTrigger asChild>
                            <button className="text-black outline-none">
                              <X size={32} strokeWidth={3} />
                            </button>
                          </SheetTrigger>
                        </div>
                      </div>
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
