"use client";

import * as React from "react";
import {
  LayoutDashboard,
  History,
  User,
  Settings,
  LogOut,
  PlusCircle,
  PawPrint,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignOutButton } from "@clerk/nextjs";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Nieuwe Check", href: "/dashboard/check", icon: PlusCircle },
  { name: "Geschiedenis", href: "/dashboard/geschiedenis", icon: History },
  { name: "Profiel", href: "/dashboard/profiel", icon: User },
  { name: "Instellingen", href: "/dashboard/instellingen", icon: Settings },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-100">
      {/* BOVENKANT: LOGO */}
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-slate-50">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-[#4FC3F7] p-1.5 rounded-lg text-white">
            <PawPrint size={20} fill="currentColor" />
          </div>
          <span className="font-black italic tracking-tighter text-[#1A1A2E] group-data-[collapsible=icon]:hidden">
            PETCHECK
          </span>
        </Link>
      </SidebarHeader>

      {/* MIDDEN: MENU ITEMS */}
      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.name}
                  isActive={isActive}
                  className={`h-11 transition-all ${
                    isActive
                      ? "bg-[#E6F1FB] text-[#0288D1] hover:bg-[#E6F1FB] hover:text-[#0288D1]"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}>
                  <Link href={item.href}>
                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="font-bold">{item.name}</span>
                    {isActive && <ChevronRight className="ml-auto w-4 h-4" />}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* ONDERKANT: USER & LOGOUT */}
      <SidebarFooter className="p-4 border-t border-slate-50">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
            <UserButton />
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <SignOutButton>
                <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors">
                  Uitloggen
                </button>
              </SignOutButton>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* DE RAIL: De inklap-knop voor desktop */}
      <SidebarRail />
    </Sidebar>
  );
}
