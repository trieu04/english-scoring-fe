import Logos from "@/components/logos";
import { WritingComponent } from "./components/writing/writing";
import { SpeakingComponent } from "./components/speaking/speaking";
import { NavComponent } from "./components/nav/nav";
import { useState } from "react";

export function ScoringPage() {
  const [examId, setExamId] = useState<number | null>(null);

  return (
    <div className="bg-dscl-blue1 min-h-screen">
      <header className="flex items-center h-[var(--header-height)] sticky top-0 bg-dscl-blue1 z-50 shadow-md mb-2">
        <div className="mx-3">
          <Logos.EnglishScoringLogo />
        </div>
      </header>
      <div className="flex space-x-3 px-3">
        <nav className="relative shrink-0">
          <div className="bg-dscl-white sticky top-[var(--header-margin)] h-[var(--navbar-height)] rounded-t-lg">
            <NavComponent setExamId={setExamId} examId={examId} />
          </div>
        </nav>
        <section className="rounded-lg w-2/3 bg-dscl-white h-fit">
          <WritingComponent examId={examId} />
        </section>
        <section className="rounded-lg w-1/3 bg-dscl-white h-fit">
          <SpeakingComponent examId={examId} />
        </section>
      </div>
    </div>
  );
}
