"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Menu } from "lucide-react";
import { PricingModal } from "@/components/PricingModal";

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

function LayoutContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // We gebruiken de URL als "global state" voor de modal
  const showPricing = searchParams?.get("showPricing") === "true";
  const dogId = searchParams?.get("dogId") || undefined;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#F8FAFC]">
        <AppSidebar />

        {/* De modal staat hier altijd "bovenop" de hele layout */}
        <PricingModal
          isOpen={showPricing}
          onClose={() => {
            // Verwijder de query parameter uit de URL als we sluiten
            router.replace(
              window.location.pathname + (dogId ? `?dogId=${dogId}` : ""),
            );
          }}
          dogId={dogId}
        />

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
          </header>
          <div className="p-6 lg:p-10">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
