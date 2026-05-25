"use client";

import * as React from "react";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  Settings,
  PawPrint,
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

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Nieuwe Scan", url: "/dashboard/scan", icon: PlusCircle },
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

  const [fallbackDogId, setFallbackDogId] = useState<string | undefined>(
    undefined,
  );
  const urlDogId = searchParams.get("dogId");
  const dogId = urlDogId || fallbackDogId;

  useEffect(() => {
    async function checkAndFillDogId() {
      if (urlDogId) return;
      try {
        const res = await fetch(`/api/dogs?t=${Date.now()}`);
        const hondenData = await res.json();
        if (Array.isArray(hondenData) && hondenData.length > 0) {
          const eersteHondId = String(hondenData[0].id);
          setFallbackDogId(eersteHondId);
          router.replace(`${pathname}?dogId=${eersteHondId}`);
        }
      } catch (err) {
        console.error("Fout bij ophalen hond:", err);
      }
    }
    checkAndFillDogId();
  }, [urlDogId, pathname, router]);

  return (
    <>
      <SidebarHeader className="h-20 flex flex-row items-center px-6 border-b border-slate-50 bg-white" />
      <SidebarContent className="p-4 bg-white relative flex flex-col h-full">
        <SidebarMenu className="gap-2 flex-1">
          {menuItems.map((item) => {
            const finalUrl = dogId ? `${item.url}?dogId=${dogId}` : item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  className={`h-12 w-full justify-start rounded-xl px-4 ${pathname === item.url ? "bg-blue-50 text-blue-600 font-bold" : "text-[#1A1A2E]"}`}>
                  <Link href={finalUrl} onClick={() => setOpenMobile(false)}>
                    <item.icon size={22} />
                    <span className="font-bold">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
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
          <div className="p-4">
            <Loader2 className="animate-spin" />
          </div>
        }>
        <SidebarContentInternal />
      </Suspense>
    </Sidebar>
  );
}
