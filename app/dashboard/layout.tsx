import Sidebar from "../../components/Sidebar";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* De Sidebar component die we eerder hebben gemaakt */}
      <Sidebar />

      {/* De main content. 
          Op desktop (lg) geven we een margin-left van 72 (de breedte van de sidebar).
          Op mobiel is de margin 0 omdat de sidebar dan over het scherm schuift.
      */}
      <main className="flex-1 lg:ml-72 min-h-screen">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
