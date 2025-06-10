import { useState } from "react";
import Illustrations from "@/components/illustrations";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import clsx from "clsx";
import Icons from "@/components/icons";
import { getExamListData } from "../apis/exams.api";
import { WritingComponent } from "../components/writing";
import { SpeakingComponent } from "../components/speaking";

export function ScoringPage() {
  const [examId, setExamId] = useState<number | null>(null);

  // Get examSession from query param in URL
  const searchParams = new URLSearchParams(window.location.search);
  const examSessionId = searchParams.get("examSession");

  const examListQuery = useQuery({
    queryKey: ["exam-list", examSessionId],
    queryFn: () => getExamListData(Number(examSessionId)),
    enabled: !!examSessionId,
    staleTime: 0,
  });

  return (
    <div className="flex space-x-3 px-3 h-full">
      <nav className="relative shrink-0 h-full flex flex-col w-80">
        <div className="bg-white rounded-xl p-4">
          <div className="flex">
            <Illustrations.ExamIllustration />
            <div className="ml-2">
              <h3>Kỳ thi thử 1</h3>
              <div>Test count: 2</div>
              <div>Scoring system: Vstep</div>
            </div>
          </div>
        </div>
        <div
          className="bg-white rounded-xl mt-4 shrink-0 flex flex-col"
        >
          <div className="flex-1">
            <h2 className="px-4 pt-4 pb-2 border-b-2 border-b-gray-200">List of Test</h2>
            <div
              className="overflow-auto px-4"
              ref={(el) => {
                if (el) {
                  const rect = el.getBoundingClientRect();
                  el.style.height = `calc(100vh - ${rect.top}px)`;
                }
              }}
            >
              {examListQuery.isLoading && <Spin className="w-full" size="small" />}
              {examListQuery.isSuccess
                && (
                  <div className="flex flex-col space-y-2 py-6 max-h-[calc(var(--navbar-height)*0.6)] overflow-y-auto">
                    {
                      examListQuery.data.map(item => (
                        <div key={item.id} className={clsx("p-2 rounded-sm", item.id === examId && "bg-dscl-blue1")}>
                          <div
                            className="flex items-center space-x-2 cursor-pointer"
                            onClick={() => { setExamId(item.id); }}
                          >
                            <Icons.ExamMultipleChoiceIcon />
                            <div>
                              {item.name}
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                )}
            </div>
          </div>
        </div>
      </nav>
      <section className="rounded-lg w-2/3 bg-dscl-white h-fit">
        <WritingComponent examId={examId} />
      </section>
      <section className="rounded-lg w-1/3 bg-dscl-white h-fit">
        <SpeakingComponent examId={examId} />
      </section>
    </div>
  );
}
