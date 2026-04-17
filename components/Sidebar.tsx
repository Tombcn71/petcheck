"use client";

import React from "react";
import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, PawPrint, ArrowRight, X } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 w-full bg-white border-b border-slate-100 z-[120]">
      <div className="w-full px-6 lg:px-10">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-[#4FC3F7] text-white w-9 h-9 flex items-center justify-center rounded-xl shadow-sm">
              <PawPrint fill="currentColor" size={20} />
            </div>
            <span className="font-heading italic font-extrabold text-[#1A1A2E] tracking-tighter text-lg uppercase">
              PetCheck<span className="text-[#4FC3F7]">.ai</span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              <a
                href="#features"
                className="text-slate-500 font-bold hover:text-[#4FC3F7] transition-colors text-xs uppercase tracking-widest">
                Mogelijkheden
              </a>
              <a
                href="#pricing"
                className="text-slate-500 font-bold hover:text-[#4FC3F7] transition-colors text-xs uppercase tracking-widest">
                Prijzen
              </a>
              <a
                href="#faq"
                className="text-slate-500 font-bold hover:text-[#4FC3F7] transition-colors text-xs uppercase tracking-widest">
                FAQ
              </a>
            </nav>
            <Show when="signed-out">
              <div className="flex items-center gap-3">
                <SignInButton mode="modal">
                  <button className="font-bold text-slate-700 text-xs uppercase tracking-widest">
                    Inloggen
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="bg-[#1A1A2E] text-white px-6 h-10 rounded-xl font-bold text-xs uppercase tracking-widest">
                    Start nu
                  </Button>
                </SignUpButton>
              </div>
            </Show>
            <Show when="signed-in">
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button className="bg-[#1A1A2E] text-white px-6 h-10 rounded-xl font-bold text-xs uppercase tracking-widest">
                    Dashboard
                  </Button>
                </Link>
                <UserButton />
              </div>
            </Show>
          </div>

          {/* MOBIEL MENU TRIGGER */}
          <div className="md:hidden flex items-center gap-3">
            <Show when="signed-in">
              <UserButton
                appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }}
              />
            </Show>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-0 h-auto w-auto bg-transparent">
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
                <SheetTitle className="sr-only">Navigatiemenu</SheetTitle>

                <div className="p-8 flex flex-col gap-6 flex-1 text-right items-end pt-12">
                  {/* DE LINKS NAAR JE BESTAANDE SECTIES */}
                  <a
                    href="#features"
                    className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1A1A2E] hover:text-[#4FC3F7] transition-colors py-2">
                    Mogelijkheden
                  </a>
                  <a
                    href="#pricing"
                    className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1A1A2E] hover:text-[#4FC3F7] transition-colors py-2">
                    Prijzen
                  </a>
                  <a
                    href="#faq"
                    className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1A1A2E] hover:text-[#4FC3F7] transition-colors py-2">
                    FAQ
                  </a>

                  <div className="mt-auto pb-10 w-full flex flex-col gap-6 items-end">
                    <Show when="signed-out">
                      <SignInButton mode="modal">
                        <button className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-[#1A1A2E]">
                          Inloggen
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <Button className="w-full h-12 bg-[#4FC3F7] text-white rounded-xl font-bold uppercase text-xs tracking-widest shadow-lg">
                          Start nu Gratis
                        </Button>
                      </SignUpButton>
                    </Show>

                    <Show when="signed-in">
                      <Link href="/dashboard" className="w-full">
                        <Button className="w-full h-12 bg-[#4FC3F7] text-white rounded-xl font-bold uppercase text-xs tracking-widest">
                          Naar Dashboard
                        </Button>
                      </Link>
                    </Show>

                    {/* HET DIKKE ZWARTE KRUISJE RECHTSONDER */}
                    <div className="pt-4">
                      <SheetTrigger asChild>
                        <button className="text-black transition-transform active:scale-90 outline-none">
                          <X size={32} strokeWidth={3} />
                        </button>
                      </SheetTrigger>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
