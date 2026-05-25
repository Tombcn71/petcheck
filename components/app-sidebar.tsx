"use client";

import * as React from "react";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
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
import { PricingModal } from "@/components/PricingModal";

// HARDCODED CONSTANTE (Geen import nodig, lost je build-fout op)
const TRIAL_DAYS = 7;

function isTrialActive(
  createdAt: string | Date | number,
  trialEndsAt?: string,
) {
  const start = new Date(createdAt).getTime();
  const trialDurationMs = TRIAL_DAYS * 24 * 60 * 60 * 1000;
  const end = trialEndsAt
    ? new Date(trialEndsAt).getTime()
    : start + trialDurationMs;
  return Date.now() < end;
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
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const { user, isLoaded } = useUser();

  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [fallbackDogId, setFallbackDogId] = useState<string | undefined>(
    undefined,
  );

  const urlDogId = searchParams.get("dogId");
  const dogId = urlDogId || fallbackDogId;

  const isPro = user?.publicMetadata?.role === "pro";
  const trialEndsAt = user?.publicMetadata?.trialEndsAt as string | undefined;
  const trialActive = user?.createdAt
    ? isTrialActive(user.createdAt, trialEndsAt)
    : false;

  useEffect(() => {
    async function checkAndFillDogId() {
      if (urlDogId) return;
      try {
        const res = await fetch(`/api/dogs?t=${Date.now()}`, {
          cache: "no-store",
        });
        const hondenData = await res.json();
        if (Array.isArray(hondenData) && hondenData.length > 0) {
          const eersteHondId = String(hondenData[0].id);
          setFallbackDogId(eersteHondId);
          const currentParams = new URLSearchParams(window.location.search);
          currentParams.set("dogId", eersteHondId);
          router.replace(`${pathname}?${currentParams.toString()}`, {
            scroll: false,
          });
        }
      } catch (err) {
        console.error("Fout bij ophalen fallback hond in sidebar:", err);
      }
    }
    if (isLoaded) checkAndFillDogId();
  }, [urlDogId, isLoaded, pathname, router]);

  return (
    <>
      <SidebarHeader className="h-20 flex flex-row items-center px-6 border-b border-slate-50 bg-white" />

      <SidebarContent className="p-4 bg-white relative flex flex-col h-full">
        <SidebarMenu className="gap-2 flex-1">
          {menuItems.map((item) => {
            const finalUrl = dogId ? `${item.url}?dogId=${dogId}` : item.url;

            // Logic: Alleen locked als GEEN Pro EN trial verlopen is
            const isLocked =
              item.requirePro && isLoaded && !isPro && !trialActive;

            return (
              <SidebarMenuItem key={item.title}>
                {isLocked ? (
                  <button
                    type="button"
                    onClick={() => {
                      setOpenMobile(false);
                      setIsPricingOpen(true);
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
