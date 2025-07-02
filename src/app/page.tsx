"use client";

import { useAchieveX } from "@/contexts/AchieveXContext";
import { AuthForm } from "@/components/achievex/AuthForm";
import { ActionForm } from "@/components/achievex/ActionForm";
import { ResultsView } from "@/components/achievex/ResultsView";


export default function Home() {
  const { showContent } = useAchieveX();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 font-sans transition-all duration-500 ease-in-out sm:p-8 md:p-12">
      {!showContent && <AuthForm />}
      {showContent && (
        <div className={`animate__animated animate__fadeInUp animate__faster w-full rounded-2xl bg-white/60 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl`}>
          <div className={`flex w-full`}>
            <ActionForm />
            <ResultsView />
          </div>
        </div>
      )}
    </main>
  );
}
