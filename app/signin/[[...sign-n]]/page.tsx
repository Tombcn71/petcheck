import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-[100dvh] bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black uppercase tracking-tighter">
          Welkom <span className="text-[#4FC3F7]">Terug</span>
        </h1>
      </div>

      <SignIn 
        appearance={{
          elements: {
            card: "border-4 border-[#1A1A2E] shadow-[8px_8px_0_0_#4FC3F7] rounded-3xl",
            headerTitle: "font-black uppercase tracking-tight",
            formButtonPrimary: "bg-[#1A1A2E] hover:bg-[#4FC3F7] text-white font-black uppercase rounded-xl transition-all",
            footerActionLink: "text-[#4FC3F7] hover:text-[#1A1A2E] font-bold"
          }
        }}
        // 'afterSignInUrl' is nu 'forceRedirectUrl'
        forceRedirectUrl="/dashboard"
      />
    </div>
  );
}