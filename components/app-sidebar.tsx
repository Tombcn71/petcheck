"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  User,
  Settings,
  PawPrint,
  X,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Nieuwe Scan", url: "/dashboard/scan", icon: PlusCircle },
  { title: "Dossier", url: "/dashboard/dossier", icon: History },
  { title: "Vaccinaties", url: "/dashboard/vaccinaties", icon: History },
  { title: "Medicatie", url: "/dashboard/medicatie", icon: History },
  { title: "Profiel", url: "/dashboard/profiel", icon: User },
  { title: "Instellingen", url: "/dashboard/instellingen", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-slate-100 bg-white relative">
      <SidebarHeader className="h-20 flex flex-row items-center px-6 border-b border-slate-50 bg-white"></SidebarHeader>

      <SidebarContent className="p-4 bg-white relative flex flex-col h-full">
        <SidebarMenu className="gap-2 flex-1">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                className={`h-12 w-full justify-start rounded-xl px-4 ${
                  pathname === item.url
                    ? "bg-blue-50 text-blue-600 font-bold"
                    : "text-[#1A1A2E]"
                }`}>
                <Link href={item.url} onClick={() => setOpenMobile(false)}>
                  <item.icon size={22} />
                  <span className="font-bold">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {/* HET ZWARTE, GROTERE EN DIKKERE KRUISJE RECHTSONDER */}
        <button
          onClick={() => setOpenMobile(false)}
          className="lg:hidden absolute bottom-6 right-6 p-2 text-black hover:opacity-70 transition-opacity"
          type="button"
          aria-label="Sluit menu">
          <X size={32} strokeWidth={3} />
        </button>
      </SidebarContent>
    </Sidebar>
  );
}
