import { SignUp } from "@clerk/nextjs";
import { ShieldCheck, Lock } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-[100dvh] bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-[#1A1A2E]">
      {/* VERTROUWEN-HEADER */}
      <div className="mb-8 text-center max-w-[420px]">
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-3">
          Start je <span className="text-[#4FC3F7]">gratis week</span>
        </h1>

        <div className="flex flex-col gap-3 items-center">
          <p className="text-slate-500 font-medium text-sm">
            Maak een account aan en scan direct de gezondheid van je hond.
          </p>

          {/* De "Geruststellings" Badge - Nu met 'betaalgegevens' */}
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-2 rounded-full border border-emerald-100 shadow-sm">
            <ShieldCheck size={16} className="shrink-0" />
            <span className="text-[11px] font-black uppercase tracking-wider">
              Geen betaalgegevens nodig
            </span>
          </div>
        </div>
      </div>

      {/* CLERK SIGN UP BOX */}
      <SignUp
        appearance={{
          elements: {
            card: "border-4 border-[#1A1A2E] shadow-[12px_12px_0_0_rgba(79,195,247,0.15)] rounded-[2.5rem] overflow-hidden bg-white",
            headerTitle: "hidden",
            headerSubtitle:
              "text-slate-400 font-medium text-center w-full mb-4",
            formButtonPrimary:
              "bg-[#1A1A2E] hover:bg-[#4FC3F7] text-white font-black uppercase rounded-xl py-6 transition-all shadow-lg text-sm tracking-widest",
            footerActionLink: "text-[#4FC3F7] hover:text-[#1A1A2E] font-bold",
            dividerLine: "bg-slate-100",
            dividerText: "text-slate-300 font-bold text-[10px] uppercase",
            formFieldLabel:
              "font-black text-[#1A1A2E] uppercase text-[10px] tracking-widest mb-1",
            formFieldInput:
              "border-2 border-slate-100 rounded-xl focus:border-[#4FC3F7] focus:ring-0 transition-all h-12",
            identityPreviewText: "font-bold",
            formResendCodeLink: "text-[#4FC3F7] font-bold",
          },
        }}
        forceRedirectUrl="/onboarding"
      />

      {/* SUBTIELE FOOTER INFO */}
      <div className="mt-10 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 opacity-40 grayscale">
        <div className="flex items-center gap-2">
          <Lock size={12} />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Veilig & AVG Proof
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={12} />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Direct opzegbaar
          </span>
        </div>
      </div>
    </div>
  );
}
