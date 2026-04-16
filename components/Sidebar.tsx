"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  History,
  User,
  Settings,
  LogOut,
  X,
  Menu,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignOutButton } from "@clerk/nextjs"; // Importeer Clerk componenten

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const pathname = usePathname();

  const sidebarItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Nieuwe Check", href: "/dashboard/check", icon: PlusCircle },
    { name: "Geschiedenis", href: "/dashboard/geschiedenis", icon: History },
    { name: "Profiel", href: "/dashboard/profiel", icon: User },
    { name: "Instellingen", href: "/dashboard/instellingen", icon: Settings },
  ];

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "Prijzen", href: "/prijzen" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <style>{`
        .logo-font { font-family: 'Syne', sans-serif; font-weight: 800; letter-spacing: -1.5px; }
        .nav-text { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between z-[200]">
        <Link
          href="/"
          className="logo-font text-[#1A1A2E] text-xl flex items-center gap-2">
          <span className="text-[#4FC3F7]">🐾</span> PETCHECK
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-[13px] font-bold text-[#6B6B8A] uppercase tracking-widest">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-[#4FC3F7] transition-colors">
              {link.name}
            </Link>
          ))}

          {/* GEFIXTE AVATAR: Hier wordt de Google avatar nu gefetched */}
          <div className="ml-4 flex items-center">
            <UserButton />
          </div>
        </div>

        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="lg:hidden p-2 text-[#1A1A2E]">
          {isNavOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {isNavOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-100 p-6 flex flex-col gap-4 lg:hidden shadow-xl animate-in slide-in-from-top duration-300">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsNavOpen(false)}
                className="text-sm font-bold text-[#1A1A2E] uppercase tracking-wider">
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* MOBILE RAIL */}
      <div className="lg:hidden fixed left-0 top-16 bottom-0 w-16 bg-white border-r border-slate-100 z-[100] flex flex-col items-center py-8">
        <div className="flex flex-col gap-10">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(true)}
                className="relative flex items-center justify-center group">
                <item.icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  className={`transition-all duration-300 ${
                    isActive
                      ? "text-[#4FC3F7] drop-shadow-[0_0_8px_rgba(79,195,247,0.5)]"
                      : "text-slate-400 group-hover:text-[#1A1A2E]"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Avatar ook in de mobiele rail onderaan */}
        <div className="mt-auto mb-6">
          <UserButton />
        </div>

        <button
          onClick={() => setIsSidebarOpen(true)}
          className="mb-4 p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-[#4FC3F7] transition-all">
          <Menu size={20} />
        </button>
      </div>

      {/* OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-[#1A1A2E]/40 backdrop-blur-sm z-[140] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* FULL SIDEBAR */}
      <aside
        className={`fixed left-0 bottom-0 bg-white z-[150] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] lg:top-16 lg:w-72 lg:translate-x-0 lg:border-r lg:border-slate-100 ${
          isSidebarOpen
            ? "translate-x-0 w-80 top-0 shadow-2xl"
            : "-translate-x-full lg:translate-x-0"
        }`}>
        <div className="lg:hidden h-20 flex items-center justify-between px-8">
          <div className="logo-font text-[#1A1A2E] text-2xl">
            <span className="text-[#4FC3F7]">🐾</span> PETCHECK
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-slate-400">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 opacity-50">
            Dashboard Menu
          </p>
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold text-[15px] nav-text ${
                  isActive
                    ? "bg-[#E6F1FB] text-[#0288D1]"
                    : "text-[#6B6B8A] hover:bg-slate-50"
                }`}>
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-slate-50">
          <SignOutButton>
            <button className="flex items-center gap-3 text-[#6B6B8A] hover:text-red-500 font-bold text-xs uppercase tracking-widest transition-colors nav-text w-full">
              <LogOut size={18} /> Uitloggen
            </button>
          </SignOutButton>
        </div>
      </aside>
    </>
  );
}
