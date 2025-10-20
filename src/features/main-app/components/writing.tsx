import { setFullHeightFromTop } from "@/lib/utils";
import { WritingScoresComponent } from "../components/writing-scores";
import { WritingScoresOtherModelComponent } from "../components/writing-scores-other-model";
import { WritingSubmissionComponent } from "../components/writing-submission";
import { useQuery } from "@tanstack/react-query";
import { Alert, Spin, Tabs } from "antd";
import { apiService } from "@/services/api.service";
import { WritingSubmissionInterface } from "../types/scoring";

interface IComponentProps {
  examId?: string;
}

export function WritingComponent({ examId }: IComponentProps) {
  const getWritingSubmissionsQuery = useQuery({
    queryKey: ["/exam/{examId}/writing-submissions", { examId }],
    queryFn: () => apiService.get<WritingSubmissionInterface[]>(`/exam/${examId}/writing-submissions`),
    staleTime: 0,
    enabled: !!examId,
  });
  return (
    <div className="bg-white rounded-lg">
      <div className="p-3 border-b-2 border-b-gray-200">
        <h2>Writing</h2>
      </div>

      <div
        className="overflow-auto px-4 mt-2"
        ref={setFullHeightFromTop}
      >
        {(getWritingSubmissionsQuery.isLoading || getWritingSubmissionsQuery.isFetching) && (
          <div className="flex justify-center items-center h-full">
            <Spin size="large" />
          </div>
        )}
        {getWritingSubmissionsQuery.isError && (
          <div className="flex justify-center items-center h-full">
            <Alert
              message="Error"
              description={getWritingSubmissionsQuery.error.message}
              type="error"
            />
          </div>
        )}
        {getWritingSubmissionsQuery.isSuccess && getWritingSubmissionsQuery.data?.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <Alert
              message="No writing tasks"
              type="info"
            />
          </div>
        )}
        {getWritingSubmissionsQuery.isSuccess && getWritingSubmissionsQuery.data?.length > 0 && (
          <Tabs
            items={getWritingSubmissionsQuery.data?.map((item) => {
              const answerText = item.answerText || "";
              const questionText = item.questionText || "";

              return {
                key: String(item.id),
                label: <b>{`Task ${item.taskNumber}`}</b>,
                children: (
                  <div className="max-h-full overflow-auto">
                    <WritingSubmissionComponent
                      questionText={questionText}
                      answerText={answerText}
                    />
                    <WritingScoresComponent
                      examId={examId}
                      submissionId={item.id}
                    />
                    <WritingScoresOtherModelComponent
                      examId={examId}
                      submissionId={item.id}
                    />
                    <div className="pb-[20vh]" />
                  </div>
                ),
              };
            })}
          />
        )}

      </div>
    </div>
  );
}
