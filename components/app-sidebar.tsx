"use client";

import * as React from "react";
import { Suspense, useState, useEffect } from "react";
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
// Importeer hier je centrale component!
import { PricingModal } from "@/components/PricingModal";

const SIDEBAR_TRIAL_DAYS = 7;

function checkIsTrialExpired(
  createdAt: string | Date | number,
  trialEndsAt?: string,
) {
  const start = new Date(createdAt).getTime();
  const trialDurationMs = SIDEBAR_TRIAL_DAYS * 24 * 60 * 60 * 1000;
  const end = trialEndsAt
    ? new Date(trialEndsAt).getTime()
    : start + trialDurationMs;
  return Date.now() > end;
}

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

  const [showSidebarPricing, setShowSidebarPricing] = useState(false);

  const dogId = searchParams.get("dogId") || undefined;
  const isPro = user?.publicMetadata?.role === "pro";
  const trialEndsAt = user?.publicMetadata?.trialEndsAt as string | undefined;

  const isExpired = user?.createdAt
    ? checkIsTrialExpired(user.createdAt, trialEndsAt)
    : false;

  return (
    <>
      <SidebarHeader className="h-20 flex flex-row items-center px-6 border-b border-slate-50 bg-white"></SidebarHeader>

      <SidebarContent className="p-4 bg-white relative flex flex-col h-full">
        <SidebarMenu className="gap-2 flex-1">
          {menuItems.map((item) => {
            const finalUrl = dogId ? `${item.url}?dogId=${dogId}` : item.url;
            const fallbackToDashboardPopup =
              item.requirePro && isLoaded && !isPro && isExpired;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  className={`h-12 w-full justify-start rounded-xl px-4 ${
                    pathname === item.url
                      ? "bg-blue-50 text-blue-600 font-bold"
                      : "text-[#1A1A2E]"
                  }`}>
                  {fallbackToDashboardPopup ? (
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMobile(false);
                        setShowSidebarPricing(true);
                      }}>
                      <item.icon size={22} />
                      <span className="font-bold">{item.title}</span>
                    </button>
                  ) : (
                    <Link href={finalUrl} onClick={() => setOpenMobile(false)}>
                      <item.icon size={22} />
                      <span className="font-bold">{item.title}</span>
                    </Link>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        <button
          onClick={() => setOpenMobile(false)}
          className="lg:hidden absolute bottom-6 right-6 p-2 text-black hover:opacity-70 transition-opacity"
          type="button"
          aria-label="Sluit menu">
          <X size={32} strokeWidth={3} />
        </button>
      </SidebarContent>

      {/* --- CENTRALE PRICING MODAL MET WITTE BLUR EN LOGO --- */}
      <PricingModal
        isOpen={showSidebarPricing}
        onClose={() => setShowSidebarPricing(false)}
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
