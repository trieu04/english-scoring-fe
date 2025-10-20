import clsx from "clsx";
import { useEffect } from "react";
import Icons from "@/components/icons";
import { setFullHeightFromTop } from "@/lib/utils";
import { apiService } from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { RotateCw, RotateCwIcon } from "lucide-react";

export function ExamListComponent() {
  const navigate = useNavigate();
  const { examSessionId, examId } = useSearch({ from: "/main-app/scoring" });

  const examListQuery = useQuery({
    queryKey: ["/exam-session/{examSessionId}/exam-list", { examSessionId }],
    queryFn: () => {
      return apiService.get<{
        id: string;
        name: string;
        createdAt: string;
      }[]>(`/exam-session/${examSessionId}/exam-list`);
    },
    enabled: !!examSessionId,
  });

  useEffect(() => {
    if (!examId && examListQuery.data?.length) {
      navigate({ to: "/scoring", search: { examSessionId, examId: examListQuery.data[0].id }, replace: true });
    }
  }, [examId, examListQuery.data, examSessionId, navigate]);
  return (
    <div className="flex-1">
      <div className="flex px-4 pt-4 pb-2 border-b-2 border-b-gray-200">
        <h2 className="grow">List of Test</h2>
      </div>
      <div
        className="overflow-auto px-4"
        ref={setFullHeightFromTop}
      >
        <div className="flex flex-col space-y-2 py-6  overflow-y-auto">
          {examListQuery.data?.map((item, idx) => (
            <div key={item.id} className={clsx("p-2 rounded-sm", item.id === examId && "bg-second")}>
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => {
                  navigate({ to: "/scoring", search: { examSessionId, examId: item.id }, replace: true });
                }}
              >
                <Icons.ExamMultipleChoiceIcon />
                <div>
                  {item.name || `Test ${idx + 1}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
