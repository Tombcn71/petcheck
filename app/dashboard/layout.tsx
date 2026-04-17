import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#F8FAFC]">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <header className="flex h-16 items-center border-b bg-white px-6 lg:px-10 sticky top-0 z-20">
            {/* Mobiele sectie: Trigger + Tekst */}
            <div className="lg:hidden flex items-center gap-3">
              <SidebarTrigger className="bg-transparent hover:bg-slate-50 text-[#1A1A2E] p-0 h-auto w-auto shadow-none border-none" />

              <span className="font-heading font-bold text-[#1A1A2E] text-lg tracking-tight uppercase">
                Dashboard
              </span>
            </div>

            {/* Desktop titel (optioneel) */}
            <div className="hidden lg:block">
              <span className="font-heading font-bold text-[#1A1A2E] text-xl uppercase tracking-tight">
                Dashboard
              </span>
            </div>
          </header>

          <div className="p-6 lg:p-10">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
