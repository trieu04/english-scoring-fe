import Logos from "@/components/logos";
import { WritingComponent } from "./writing/writing";
import { SpeakingComponent } from "./speaking/speaking";
import { NavComponent } from "./nav/nav";

export function ScoringPage() {
  return (
    <div className="bg-dscl-blue1 min-h-screen">
      <header className="flex items-center h-[var(--header-height)] sticky top-0 bg-dscl-blue1 z-50">
        <div className="mx-3">
          <Logos.EnglishScoringLogo1 />
        </div>
      </header>
      <div className="flex space-x-3 px-3">
        <nav className="bg-dscl-white relative shrink-0">
          <div className="sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))]">
            <NavComponent />
          </div>
        </nav>
        <section className="rounded-lg w-2/3 bg-dscl-white h-fit">
          <WritingComponent />
        </section>
        <section className="rounded-lg w-1/3 bg-dscl-white h-fit">
          <SpeakingComponent />
        </section>
      </div>
    </div>
  );
}
