import { Button } from "@/components/ui/button";
import { setFullHeightFromTop } from "@/lib/utils";
import { apiService } from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";
import { Alert, Collapse, notification, Spin, Tabs } from "antd";
import { cx } from "class-variance-authority";
import { BoldIcon, BookOpenIcon, ClockIcon, FileTextIcon, MessageCircleIcon, MicIcon, RotateCwIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { AudioPlayer } from "./audio-player";
import { OverallPoint } from "./overall-point";
import { SkillPoint } from "./skill-point";
import { handleApiError } from "@/lib/error-handle";

interface IComponentProps {
  examId?: string;
}

export function SpeakingComponent({ examId }: IComponentProps) {
  const [isScoring, setIsScoring] = useState(false);
  const [isComparing, setIsComparing] = useState(false);

  const getSpeakingSubmissionQuery = useQuery({
    queryKey: ["/exam/{examId}/speaking-submissions", { examId }],
    queryFn: () => {
      return apiService.get<{
        id: string;
        taskNumber: number;
        questionText: string;
        questionFile: string;
        answerText: string;
        answerFile: string;
        answerFileUrl: string;
        speakingResults: {
          version: number;
          model: string;
          overall: string | number;
          pronunciation: string | number;
          organization: string | number;
          vocabulary: string | number;
          grammar: string | number;
          fluency: string | number;
          content: string | number;
          explanation?: string;
          createdAt: string;
          processingTime: number;
          usageInfo: {
            prompt_tokens: number;
            completion_tokens: number;
            total_tokens: number;
            model: string;
            cost_usd: number;
          };
        }[];
        speakingResultVersionCount: number;
        currentSpeakingResultVersion: number;
      }[]>(`/exam/${examId}/speaking-submissions`);
    },
    staleTime: 0,
    enabled: !!examId,
  });

  const handleReScore = async () => {
    setIsScoring(true);
    try {
      await apiService.post(`/exam/${examId}/score-speaking`);
      await getSpeakingSubmissionQuery.refetch();
      notification.success({
        message: "Success",
        description: "Speaking scoring completed.",
      });
    }
    catch (error) {
      handleApiError(error);
      notification.error({
        message: "Error",
        description: "Failed to rescore speaking submissions.",
      });
    }
    setIsScoring(false);
  };

  const handleCompare = async () => {
    setIsComparing(true);
    try {
      await apiService.post(`/exam/${examId}/score-speaking-api`);
      await getSpeakingSubmissionQuery.refetch();
      notification.success({
        message: "Success",
        description: "Scoring with ChatGPT 4o audio completed.",
      });
    }
    catch (error) {
      handleApiError(error);
      notification.error({
        message: "Error",
        description: "Failed to compare speaking submissions.",
      });
    }
    setIsComparing(false);
  };

  const isRescore = getSpeakingSubmissionQuery.data?.some(item => item.speakingResults.length > 1);

  let statusContent = null;

  if (!examId) {
    statusContent = (
      <div></div>
    );
  }

  if (getSpeakingSubmissionQuery.isError) {
    statusContent = (
      <div className="h-full w-full">
        <Alert
          message="Error"
          description={getSpeakingSubmissionQuery.error.message}
          type="error"
        />
      </div>
    );
  }

  if (getSpeakingSubmissionQuery.isLoading || getSpeakingSubmissionQuery.isFetching) {
    statusContent = (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  const speakingParts = [] as { taskNumber: number; url: string }[];
  const scores = {
    overall: "-",
    pronunciation: "-",
    fluency: "-",
    vocabulary: "-",
    grammar: "-",
    content: "-",
  };
  const otherModelsScores = {
    overall: "-",
    pronunciation: "-",
    fluency: "-",
    vocabulary: "-",
    grammar: "-",
    content: "-",
  };
  const otherModelsUsageInfo = {
    model: "-",
    processing_time: "-",
    prompt_tokens: "-",
    completion_tokens: "-",
    total_tokens: "-",
    cost_usd: "-",
  };
  getSpeakingSubmissionQuery.data?.forEach((item) => {
    speakingParts.push({
      taskNumber: item.taskNumber,
      url: item.answerFileUrl,
    });
    const sv = item.speakingResults.find(r => r.model === "AI4LIFE");
    if (sv) {
      Object.assign(scores, sv);
    }
    const sv2 = item.speakingResults.find(r => r.model !== "AI4LIFE");
    if (sv2) {
      Object.assign(otherModelsScores, sv2);

      Object.assign(otherModelsUsageInfo, {
        ...sv2.usageInfo,
        processing_time: `${sv2.processingTime?.toFixed(2) || "-"}s`,
      });
    }
  });

  return (
    <div className="bg-white rounded-lg">
      <div className="pl-4 pt-2 pb-2 pr-2 flex items-center  border-b-2 border-b-gray-200">
        <h2 className="grow">Speaking</h2>
        <Button size="sm" onClick={handleReScore} disabled={isScoring}>
          <RotateCwIcon className={cx("text-white", isScoring && "animate-spin")} />
          <span>{isRescore ? "Re-Score" : "Score"}</span>
        </Button>
      </div>
      <div
        className="overflow-auto px-4 mt-2"
        ref={setFullHeightFromTop}
      >
        {statusContent || (
          <>
            {(getSpeakingSubmissionQuery.isLoading || getSpeakingSubmissionQuery.isFetching) && (
              <div className="flex justify-center items-center h-16">
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

            <>
              <h3>Submission</h3>
              {
                speakingParts.map(part => (
                  <div key={part.taskNumber}>
                    <div className="mt-3 ">
                      <AudioPlayer url={part.url} name={`Part ${part.taskNumber}`} />
                    </div>
                  </div>
                ))
              }

              <div className="py-4">

                <h3>Score</h3>
                <div className="mt-3 px-4 py-4 border-1 border-main rounded-md justify-items-center grid grid-cols-2 gap-4 ">
                  <>
                    <OverallPoint point={scores.overall} />
                    <SkillPoint icon={<MicIcon className="text-main" />} name="Pronunciation" point={scores.pronunciation} />
                    <SkillPoint icon={<MessageCircleIcon className="text-main" />} name="Fluency" point={scores.fluency} />
                    <SkillPoint icon={<BoldIcon className="text-main" />} name="Vocabulary" point={scores.vocabulary} />
                    <SkillPoint icon={<BookOpenIcon className="text-main" />} name="Grammar" point={scores.grammar} />
                    <SkillPoint icon={<FileTextIcon className="text-main" />} name="Content" point={scores.content} />
                  </>
                </div>
              </div>

              <div className="py-4">
                <Collapse
                  defaultActiveKey={["1"]}
                  items={[
                    {
                      key: "1",
                      label: <h3 className="m-0">Compare with another model</h3>,
                      children: (
                        <div>
                          <div className="mb-4">
                            <Button size="sm" onClick={handleCompare} disabled={isComparing}>
                              <RotateCwIcon className={cx("text-white", isComparing && "animate-spin")} />
                              <span>Score with GPT-4o Audio</span>
                            </Button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h4 className="text-main mb-2">Scores</h4>
                              <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-md">
                                <div className="flex flex-col">
                                  <span className="text-sm text-gray-600">Overall</span>
                                  <span className="text-lg font-bold text-main">{otherModelsScores.overall}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm text-gray-600">Pronunciation</span>
                                  <span className="text-lg font-bold">{otherModelsScores.pronunciation}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm text-gray-600">Fluency</span>
                                  <span className="text-lg font-bold">{otherModelsScores.fluency}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm text-gray-600">Vocabulary</span>
                                  <span className="text-lg font-bold">{otherModelsScores.vocabulary}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm text-gray-600">Grammar</span>
                                  <span className="text-lg font-bold">{otherModelsScores.grammar}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm text-gray-600">Content</span>
                                  <span className="text-lg font-bold">{otherModelsScores.content}</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-main mb-2">Usage Information</h4>
                              <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-md">
                                <div className="flex flex-col">
                                  <span className="text-sm text-gray-600">Model</span>
                                  <span className="text-sm font-semibold">{otherModelsUsageInfo.model}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm text-gray-600">Processing Time</span>
                                  <span className="text-sm font-semibold">{otherModelsUsageInfo.processing_time}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm text-gray-600">Prompt Tokens</span>
                                  <span className="text-sm font-semibold">{otherModelsUsageInfo.prompt_tokens}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm text-gray-600">Completion Tokens</span>
                                  <span className="text-sm font-semibold">{otherModelsUsageInfo.completion_tokens}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm text-gray-600">Total Tokens</span>
                                  <span className="text-sm font-semibold">{otherModelsUsageInfo.total_tokens}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm text-gray-600">Cost</span>
                                  <span className="text-sm font-semibold">
                                    {otherModelsUsageInfo.cost_usd !== "-" && `$`}
                                    {otherModelsUsageInfo.cost_usd}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            </>
          </>
        )}

      </div>
    </div>
  );
}
