"use client";

import * as React from "react";
import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  Settings,
  PawPrint,
  X,
  Loader2,
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
// DEZE MOET HETZELFDE ZIJN OVERAL
import { PricingModal } from "@/components/PricingModal";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  {
    title: "Nieuwe Scan",
    url: "/dashboard/scan",
    icon: PlusCircle,
    requirePro: true,
  },
  { title: "Dossier", url: "/dashboard/dossier", icon: History },
  { title: "Vaccinaties", url: "/dashboard/vaccinaties", icon: History },
  { title: "Medicatie", url: "/dashboard/medicatie", icon: History },
  { title: "Profiel", url: "/dashboard/profiel", icon: PawPrint },
  { title: "Instellingen", url: "/dashboard/instellingen", icon: Settings },
];

function SidebarContentInternal() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setOpenMobile } = useSidebar();
  const { user, isLoaded } = useUser();

  // Eén bron van waarheid voor de modal
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  const dogId = searchParams.get("dogId") || undefined;
  const isPro = user?.publicMetadata?.role === "pro";

  return (
    <>
      <SidebarHeader className="h-20 flex flex-row items-center px-6 border-b border-slate-50 bg-white" />

      <SidebarContent className="p-4 bg-white relative flex flex-col h-full">
        <SidebarMenu className="gap-2 flex-1">
          {menuItems.map((item) => {
            const finalUrl = dogId ? `${item.url}?dogId=${dogId}` : item.url;
            // Alleen blokkeren als de gebruiker NIET pro is
            const isLocked = item.requirePro && isLoaded && !isPro;

            return (
              <SidebarMenuItem key={item.title}>
                {isLocked ? (
                  <button
                    type="button"
                    onClick={() => {
                      setOpenMobile(false);
                      setIsPricingOpen(true); // TRIGGER EXACT DEZE MODAL
                    }}
                    className="h-12 w-full flex items-center gap-3 rounded-xl px-4 text-[#1A1A2E] hover:bg-slate-50 font-bold transition-all">
                    <item.icon size={22} />
                    <span>{item.title}</span>
                  </button>
                ) : (
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className={`h-12 w-full justify-start rounded-xl px-4 ${pathname === item.url ? "bg-blue-50 text-blue-600 font-bold" : "text-[#1A1A2E]"}`}>
                    <Link href={finalUrl} onClick={() => setOpenMobile(false)}>
                      <item.icon size={22} />
                      <span className="font-bold">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* DEZE MODAL IS NU IDENTIEK AAN DIE IN INSTELLINGENPAGE */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        dogId={dogId}
      />
    </>
  );
}

export function AppSidebar() {
  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-slate-100 bg-white relative">
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center p-4">
            <Loader2 className="animate-spin text-slate-300" />
          </div>
        }>
        <SidebarContentInternal />
      </Suspense>
    </Sidebar>
  );
}
