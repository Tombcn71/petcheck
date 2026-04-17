"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  History,
  User,
  Settings,
  LogOut,
  Menu,
  PlusCircle,
  PawPrint,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Sidebar() {
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

  const NavContent = () => (
    <div className="flex flex-col h-full py-4">
      <div className="px-4 py-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 opacity-70">
          Dashboard Menu
        </p>
        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-4 h-12 rounded-xl font-bold transition-all ${
                    isActive
                      ? "bg-[#E6F1FB] text-[#0288D1] hover:bg-[#E6F1FB]"
                      : "text-[#6B6B8A] hover:bg-slate-50"
                  }`}>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto px-4 pb-4">
        <Separator className="mb-6 opacity-50" />
        <SignOutButton>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-[#6B6B8A] hover:text-red-500 font-bold text-xs uppercase tracking-widest px-4">
            <LogOut size={18} /> Uitloggen
          </Button>
        </SignOutButton>
      </div>
    </div>
  );

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 flex items-center justify-between z-[50]">
        <Link
          href="/"
          className="font-black text-[#1A1A2E] text-xl flex items-center gap-2 tracking-tighter italic"
          style={{ fontFamily: "'Syne', sans-serif" }}>
          <span className="text-[#4FC3F7] not-italic">
            <PawPrint fill="currentColor" size={24} />
          </span>{" "}
          PETCHECK
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex gap-8 text-[11px] font-black text-[#6B6B8A] uppercase tracking-widest">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-[#4FC3F7] transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
          <Separator orientation="vertical" className="h-6 mx-2" />
          <UserButton />
        </div>

        {/* Mobile Menu Trigger */}
        <div className="lg:hidden flex items-center gap-4">
          <UserButton />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-[#1A1A2E]">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0 border-r-none">
              <SheetHeader className="p-6 border-b border-slate-50 text-left">
                <SheetTitle
                  className="font-black italic text-xl tracking-tighter"
                  style={{ fontFamily: "'Syne', sans-serif" }}>
                  <span className="text-[#4FC3F7] not-italic inline-block mr-2">
                    🐾
                  </span>{" "}
                  PETCHECK
                </SheetTitle>
              </SheetHeader>
              <NavContent />
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* DESKTOP SIDEBAR (Static) */}
      <aside className="fixed left-0 top-16 bottom-0 w-72 bg-white border-r border-slate-100 hidden lg:flex flex-col z-[40]">
        <NavContent />
      </aside>

      {/* MOBILE RAIL (Onderaan of zijkant optioneel) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-100 z-[50] flex items-center justify-around px-4">
        {sidebarItems.slice(0, 4).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className="p-2 relative">
              <item.icon
                size={22}
                className={isActive ? "text-[#4FC3F7]" : "text-slate-400"}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#4FC3F7] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </>
  );
}
