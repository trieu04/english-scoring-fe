import { setFullHeightFromTop } from "@/lib/utils";
import { apiService } from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";
import { Alert, Spin } from "antd";
import { SpeakingScoresOtherModelComponent } from "../components/speaking-score-other-model";
import { SpeakingScoresComponent } from "../components/speaking-scores";
import { SpeakingSubmissionComponent } from "../components/speaking-submission";
import { SpeakingSubmissionInterface } from "../types/scoring";

interface IComponentProps {
  examId?: string;
}

export function SpeakingComponent({ examId }: IComponentProps) {
  const getSpeakingSubmissionQuery = useQuery({
    queryKey: ["/exam/{examId}/speaking-submissions", { examId }],
    queryFn: () => apiService.get<SpeakingSubmissionInterface[]>(`/exam/${examId}/speaking-submissions`),
    staleTime: 0,
    enabled: !!examId,
  });
  return (
    <div className="bg-white rounded-lg">
      <div className="p-3 border-b-2 border-b-gray-200">
        <h2>Speaking</h2>
      </div>
      <div
        className="overflow-auto px-4 mt-2"
        ref={setFullHeightFromTop}
      >
        {(getSpeakingSubmissionQuery.isLoading || getSpeakingSubmissionQuery.isFetching) && (
          <div className="flex justify-center items-center h-full">
            <Spin size="large" />
          </div>
        )}
        {getSpeakingSubmissionQuery.isError && (
          <div className="flex justify-center items-center h-full">
            <Alert
              message="Error"
              description={getSpeakingSubmissionQuery.error.message}
              type="error"
            />
          </div>
        )}
        {getSpeakingSubmissionQuery.isSuccess && getSpeakingSubmissionQuery.data?.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <Alert
              message="No speaking tasks"
              type="info"
            />
          </div>
        )}
        {getSpeakingSubmissionQuery.isSuccess && getSpeakingSubmissionQuery.data?.length > 0 && (
          <>
            <SpeakingSubmissionComponent speakingSubmissions={getSpeakingSubmissionQuery.data} />
            <SpeakingScoresComponent examId={examId} />
            <SpeakingScoresOtherModelComponent examId={examId} />
            <div className="pb-[20vh]" />
          </>
        )}

      </div>
    </div>
  );
}
