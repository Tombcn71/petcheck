"use client";

import React from "react";
import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, PawPrint, ArrowRight } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-[100]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-[#4FC3F7] text-white w-10 h-10 flex items-center justify-center rounded-xl shadow-lg shadow-[#4FC3F7]/20 group-hover:rotate-12 transition-transform">
              <PawPrint fill="currentColor" size={22} />
            </div>
            <span
              className="font-black text-xl tracking-tighter text-[#1A1A2E] uppercase italic"
              style={{ fontFamily: "'Syne', sans-serif" }}>
              PetCheck<span className="text-[#4FC3F7]">.ai</span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-8 mr-4">
              <a
                href="#features"
                className="text-slate-500 font-bold hover:text-[#4FC3F7] transition-colors text-[11px] uppercase tracking-widest">
                Mogelijkheden
              </a>
            </nav>

            <Show when="signed-out">
              <div className="flex items-center gap-3">
                <SignInButton mode="modal">
                  <Button
                    variant="ghost"
                    className="font-bold text-slate-700 hover:text-[#4FC3F7] text-xs uppercase tracking-widest">
                    Inloggen
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="bg-[#1A1A2E] hover:bg-black text-white px-6 h-11 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md">
                    Start nu <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </SignUpButton>
              </div>
            </Show>

            <Show when="signed-in">
              <div className="flex items-center gap-6">
                <Link href="/dashboard">
                  <Button className="bg-[#1A1A2E] hover:bg-black text-white px-6 h-11 rounded-xl font-bold text-xs uppercase tracking-widest">
                    Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox:
                        "w-10 h-10 border-2 border-[#4FC3F7]/20 hover:border-[#4FC3F7] transition-all",
                    },
                  }}
                />
              </div>
            </Show>
          </div>

          {/* MOBIEL MENU TRIGGER */}
          <div className="md:hidden flex items-center gap-4">
            <Show when="signed-in">
              <UserButton
                appearance={{ elements: { userButtonAvatarBox: "w-9 h-9" } }}
              />
            </Show>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-[#1A1A2E]">
                  <Menu size={28} />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="top"
                className="w-full h-auto p-8 rounded-b-[2.5rem] border-none shadow-2xl">
                <SheetHeader className="mb-8 text-left">
                  <SheetTitle
                    className="font-black italic text-xl tracking-tighter"
                    style={{ fontFamily: "'Syne', sans-serif" }}>
                    <span className="text-[#4FC3F7] not-italic inline-block mr-2">
                      🐾
                    </span>{" "}
                    PETCHECK
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-6">
                  <a
                    href="#features"
                    className="text-lg font-black uppercase italic text-slate-700 tracking-tight">
                    Mogelijkheden
                  </a>

                  <Show when="signed-out">
                    <div className="flex flex-col gap-4 pt-4 border-t border-slate-50">
                      <SignInButton mode="modal">
                        <Button
                          variant="outline"
                          className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest">
                          Inloggen
                        </Button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <Button className="w-full h-14 bg-[#1A1A2E] text-white rounded-2xl font-bold uppercase tracking-widest">
                          Start nu Gratis Check
                        </Button>
                      </SignUpButton>
                    </div>
                  </Show>

                  <Show when="signed-in">
                    <div className="flex flex-col gap-4 pt-4 border-t border-slate-50">
                      <Link href="/dashboard" className="w-full">
                        <Button className="w-full h-14 bg-[#1A1A2E] text-white rounded-2xl font-bold uppercase tracking-widest">
                          Naar Dashboard
                        </Button>
                      </Link>
                    </div>
                  </Show>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
