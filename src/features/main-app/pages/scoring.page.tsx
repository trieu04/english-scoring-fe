import { useSearch } from "@tanstack/react-router";
import { ExamListComponent } from "../components/exam-list";
import { ExamOverviewComponent } from "../components/exam-overview";
import { WritingComponent } from "../components/writing";
import { SpeakingComponent } from "../components/speaking";

export function ScoringPage() {
  const { examId } = useSearch({ from: "/main-app/scoring" });
  return (
    <div className="flex space-x-3 px-3 h-full">
      <nav className="relative shrink-0 h-full flex flex-col w-80">
        <div className="bg-white rounded-xl p-3">
          <ExamOverviewComponent />
        </div>
        <div className="bg-white rounded-xl mt-4 shrink-0 flex flex-col">
          <ExamListComponent />
        </div>
      </nav>
      <section className="rounded-lg w-15/24 bg-dscl-white h-fit">
        <WritingComponent examId={examId} />
      </section>
      <section className="rounded-lg w-9/24 bg-dscl-white h-fit">
        <SpeakingComponent examId={examId} />
      </section>
    </div>
  );
}
