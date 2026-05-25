"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Menu } from "lucide-react";

// De hoofd-layout exporteert nu een Suspense-wrapper
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          Laden...
        </div>
      }>
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  );
}

// Hier staat al jouw logica, nu veilig binnen de Suspense
function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const dogIdFromUrl = searchParams ? searchParams.get("dogId") || "" : "";
  const [allDogs, setAllDogs] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDogs() {
      if (!isLoaded || !user) return;
      try {
        const res = await fetch(`/api/dogs?t=${Date.now()}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setAllDogs(data);
        }
      } catch (err) {
        console.error("Fout bij ophalen honden in layout:", err);
      }
    }
    fetchDogs();
  }, [isLoaded, user]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#F8FAFC]">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <header className="flex h-16 items-center justify-between border-b bg-white px-6 lg:px-10 sticky top-0 z-20 gap-4">
            <div className="flex items-center min-w-0">
              <div className="lg:hidden flex items-center gap-4">
                <SidebarTrigger className="-ml-2 bg-transparent hover:bg-slate-50 text-[#1A1A2E] p-2 h-auto w-auto shadow-none border-none transition-all active:scale-95">
                  <Menu size={28} strokeWidth={2.5} />
                </SidebarTrigger>
                <span className="font-heading font-bold text-[#1A1A2E] text-lg tracking-tight uppercase truncate">
                  Dashboard
                </span>
              </div>
              <div className="hidden lg:block">
                <span className="font-heading font-bold text-[#1A1A2E] text-xl uppercase tracking-tight">
                  Dashboard
                </span>
              </div>
            </div>
            <div className="shrink-0 flex items-center max-w-xs sm:max-w-md md:max-w-lg overflow-x-auto no-scrollbar"></div>
          </header>
          <div className="p-6 lg:p-10">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
