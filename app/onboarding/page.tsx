"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveOnboardingData } from "./actions";

export default function OnboardingPage() {
  const [dogName, setDogName] = useState("");
  const [count, setCount] = useState(1);
  const [plan, setPlan] = useState("free");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFinish = async () => {
    setLoading(true);
    const result = await saveOnboardingData({ dogName, plan, count });
    if (result.success) {
      router.push("/dashboard");
    } else {
      alert("Fout bij opslaan");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="max-w-sm w-full space-y-8">
        <h1 className="text-3xl font-black uppercase text-center font-syne">
          Wie is je <span className="text-[#4FC3F7]">bestie</span>?
        </h1>

        <input
          type="text"
          placeholder="Naam van je hond..."
          className="w-full p-4 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-[#4FC3F7]"
          onChange={(e) => setDogName(e.target.value)}
        />

        <div className="space-y-4">
          <button
            onClick={() => setPlan("free")}
            className={`w-full p-5 rounded-3xl border-2 text-left ${plan === "free" ? "border-black" : "border-slate-100 opacity-50"}`}>
            <p className="font-bold">Gratis Plan</p>
            <p className="text-xs text-slate-500">1 hond, 1 scan per maand</p>
          </button>

          <div
            className={`w-full p-5 rounded-3xl border-2 ${plan === "premium" ? "border-[#4FC3F7] bg-[#F8FDFF]" : "border-slate-100 opacity-50"}`}>
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setPlan("premium")}>
              <p className="font-bold">Premium</p>
              <p className="font-black">
                €{(9.99 + (count - 1) * 5).toFixed(2)}
              </p>
            </div>
            {plan === "premium" && (
              <div className="mt-4 flex items-center justify-between bg-white p-2 rounded-xl">
                <span className="text-xs font-bold uppercase text-slate-400">
                  Honden
                </span>
                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => count > 1 && setCount(count - 1)}
                    className="px-3 py-1 bg-slate-100 rounded-lg">
                    -
                  </button>
                  <span className="font-bold">{count}</span>
                  <button
                    onClick={() => setCount(count + 1)}
                    className="px-3 py-1 bg-black text-white rounded-lg">
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleFinish}
          disabled={!dogName || loading}
          className="w-full bg-black text-white py-5 rounded-2xl font-bold uppercase tracking-widest disabled:opacity-10">
          {loading ? "Even geduld..." : "Start Bescherming →"}
        </button>
      </div>
    </div>
  );
}
