"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu, PawPrint, X, Sparkles } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <header className="sticky top-0 w-full bg-white border-b border-slate-100 z-[120] font-sans">
      <div className="w-full px-6 lg:px-10">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex flex-col group">
            <div className="flex items-center gap-3">
              <div className="bg-[#4FC3F7] text-white w-9 h-9 flex items-center justify-center rounded-xl shadow-sm">
                <PawPrint fill="currentColor" size={20} />
              </div>
              <span className="font-extrabold text-[#1A1A2E] tracking-tighter text-lg uppercase">
                Doggy<span className="text-[#4FC3F7]">scan.nl</span>
              </span>
            </div>
            <span className="text-[10px] font-black text-black uppercase tracking-[0.2em] ml-[48px]">
              Betaversie
            </span>
          </Link>

          {!isDashboard && (
            <nav className="hidden md:flex items-center gap-8 text-slate-500 font-bold text-xs uppercase tracking-widest">
              <a href="#features" className="hover:text-[#4FC3F7]">
                Features
              </a>
              <a href="#pricing" className="hover:text-[#4FC3F7]">
                Prijzen
              </a>
              <a href="#faq" className="hover:text-[#4FC3F7]">
                FAQ
              </a>
            </nav>
          )}

          <div className="flex items-center gap-4">
            <Show when="signed-out">
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/signin?redirect_url=/dashboard"
                  className="font-bold text-slate-700 text-xs uppercase hover:text-[#4FC3F7]">
                  Inloggen
                </Link>
                <Link href="/signup?redirect_url=/onboarding">
                  <Button className="bg-[#1A1A2E] hover:bg-[#4FC3F7] text-white px-6 h-11 rounded-xl font-bold uppercase text-[10px]">
                    Start gratis week
                  </Button>
                </Link>
              </div>
            </Show>

            <Show when="signed-in">
              <UserButton />
            </Show>

            {!isDashboard && (
              <div className="md:hidden flex items-center gap-4">
                <Show when="signed-out">
                  <Link
                    href="/signin?redirect_url=/dashboard"
                    className="font-bold text-[10px] uppercase text-slate-700">
                    Inloggen
                  </Link>
                </Show>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu size={28} />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-full sm:w-80 bg-white">
                    <SheetHeader className="p-6 border-b flex flex-row items-center justify-between">
                      <SheetTitle className="text-[10px] font-black uppercase text-slate-400">
                        Navigatie
                      </SheetTitle>
                      <SheetClose className="p-2">
                        <X size={24} />
                      </SheetClose>
                    </SheetHeader>
                    <div className="p-8 flex flex-col gap-6">
                      <SheetClose asChild>
                        <a
                          href="/#features"
                          className="text-xl font-bold uppercase">
                          Features
                        </a>
                      </SheetClose>
                      <SheetClose asChild>
                        <a
                          href="/#pricing"
                          className="text-xl font-bold uppercase">
                          Prijzen
                        </a>
                      </SheetClose>
                      <SheetClose asChild>
                        <a href="/#faq" className="text-xl font-bold uppercase">
                          FAQ
                        </a>
                      </SheetClose>
                      <Show when="signed-out">
                        <SheetClose asChild>
                          <Link href="/signup?redirect_url=/onboarding">
                            <Button className="w-full bg-[#1A1A2E] text-white h-14 rounded-2xl font-bold uppercase">
                              <Sparkles size={16} className="mr-2" /> Start
                              gratis week
                            </Button>
                          </Link>
                        </SheetClose>
                      </Show>
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
