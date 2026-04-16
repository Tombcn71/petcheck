"use client";
import { useState } from "react";
import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    /* We halen 'fixed' weg, dus de Hero zakt automatisch naar de juiste plek */
    <header className="relative w-full bg-white border-b border-gray-100 z-[1000]">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex justify-between items-center h-20">
          {" "}
          {/* Iets hogere navbar voor meer rust */}
          {/* LOGO LINKS */}
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setIsOpen(false)}>
            <div className="bg-[#4FC3F7] text-white w-9 h-9 flex items-center justify-center rounded-lg text-lg shadow-sm">
              🐾
            </div>
            <span
              className="font-extrabold text-xl tracking-tighter text-[#1A1A2E]"
              style={{ fontFamily: "'Syne', sans-serif" }}>
              PetCheck.ai
            </span>
          </Link>
          {/* HAMBURGER RECHTS */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#1A1A2E] p-2 text-3xl">
              {isOpen ? "✕" : "☰"}
            </button>
          </div>
          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-gray-500 font-medium hover:text-[#1A1A2E] transition-colors text-sm">
              Mogelijkheden
            </a>

            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="text-[#1A1A2E] font-semibold text-sm">
                  Inloggen
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-[#1A1A2E] text-white px-7 py-3 rounded-[14px] font-bold text-sm hover:bg-black transition-all">
                  Start nu →
                </button>
              </SignUpButton>
            </Show>

            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="bg-[#1A1A2E] text-white px-7 py-3 rounded-[14px] font-bold text-sm">
                Dashboard →
              </Link>
              <UserButton
                appearance={{ elements: { userButtonAvatarBox: "w-10 h-10" } }}
              />
            </Show>
          </div>
        </div>
      </div>

      {/* MOBIEL MENU - Schuift nu netjes onder de navbar uit */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 absolute w-full left-0 p-6 shadow-xl z-[999]">
          <div className="flex flex-col gap-6">
            <a
              href="#features"
              className="text-gray-700 font-bold py-2 border-b border-gray-50"
              onClick={() => setIsOpen(false)}>
              Mogelijkheden
            </a>

            <Show when="signed-out">
              <div className="flex flex-col gap-4">
                <SignInButton mode="modal">
                  <button
                    className="w-full text-left font-bold text-[#1A1A2E]"
                    onClick={() => setIsOpen(false)}>
                    Inloggen
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    className="w-full bg-[#1A1A2E] text-white py-4 rounded-[16px] font-bold text-center"
                    onClick={() => setIsOpen(false)}>
                    Start nu Gratis Check →
                  </button>
                </SignUpButton>
              </div>
            </Show>

            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="w-full bg-[#1A1A2E] text-white py-4 rounded-[16px] font-bold text-center"
                onClick={() => setIsOpen(false)}>
                Dashboard →
              </Link>
              <div className="flex justify-center pt-2">
                <UserButton
                  appearance={{
                    elements: { userButtonAvatarBox: "w-12 h-12" },
                  }}
                />
              </div>
            </Show>
          </div>
        </div>
      )}
    </header>
  );
}
