import { Button } from "@/components/ui/button";
import { setFullHeightFromTop } from "@/lib/utils";
import { apiService } from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";
import { Alert, Collapse, Spin, Tabs } from "antd";
import { cx } from "class-variance-authority";
import { BoldIcon, BookOpenIcon, LayersIcon, RotateCwIcon } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
import { OverallPoint } from "./overall-point";
import { SkillPoint } from "./skill-point";
import { handleApiError } from "@/lib/error-handle";
import { notification } from "antd";

interface IComponentProps {
  examId?: string;
}

export function WritingComponent({ examId }: IComponentProps) {
  const [isScoring, setIsScoring] = useState(false);
  const [isComparing, setIsComparing] = useState(false);

  const getWritingSubmissionQuery = useQuery({
    queryKey: ["/exam/{examId}/writing-submissions", { examId }],
    queryFn: () => {
      return apiService.get<{
        id: string;
        taskNumber: number;
        questionText: string;
        questionFile: string;
        answerText: string;
        answerFile: string;
        answerFileUrl: string;
        writingResults: {
          model: string;
          version: number;
          overall: number;
          organization: number;
          vocabulary: number;
          grammar: number;
          explanation: string;
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
        currentWritingResultVersion: number;
        writingResultVersionCount: number;
      }[]
      >(`/exam/${examId}/writing-submissions`);
    },
    staleTime: 0,
    enabled: !!examId,
  });

  const handleReScore = async () => {
    setIsScoring(true);
    try {
      await apiService.post(`/exam/${examId}/score-writing`);
      await getWritingSubmissionQuery.refetch();
      notification.success({
        message: "Success",
        description: "Writing scoring completed.",
      });
    }
    catch (error) {
      handleApiError(error, {
        customMessage: "Failed to rescore writing submissions",
      });
    }
    setIsScoring(false);
  };

  const handleCompare = async () => {
    setIsComparing(true);
    try {
      await apiService.post(`/exam/${examId}/score-writing-api`);
      await getWritingSubmissionQuery.refetch();
      notification.success({
        message: "Success",
        description: "Scoring with Gemini 2.5 Pro completed.",
      });
    }
    catch (error) {
      handleApiError(error, {
        customMessage: "Failed to compare writing submissions",
      });
    }
    setIsComparing(false);
  };

  const isRescore = getWritingSubmissionQuery.data?.some(item => item.writingResults.length > 1);

  let statusContent = null;

  if (!examId) {
    statusContent = (
      <div className="">

      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg">
      <div className="pl-4 pt-2 pb-2 pr-2 flex items-center border-b-2 border-b-gray-200">
        <h2 className="grow">Writing</h2>
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
            {getWritingSubmissionQuery.isSuccess && getWritingSubmissionQuery.data?.length !== 0 && (
              <Tabs
                items={getWritingSubmissionQuery.data?.map((item) => {
                  const scores = {
                    overall: "-",
                    pronunciation: "-",
                    organization: "-",
                    vocabulary: "-",
                    grammar: "-",
                    fluency: "-",
                    content: "-",
                    explanation: "",
                    createdAt: "",
                  };

                  const otherModelsScores = {
                    overall: "-",
                    organization: "-",
                    vocabulary: "-",
                    grammar: "-",
                    explanation: "",
                    createdAt: "",
                  };

                  const otherModelsUsageInfo = {
                    processingTime: "-",
                    prompt_tokens: "-",
                    completion_tokens: "-",
                    total_tokens: "-",
                    model: "-",
                    cost_usd: "-",
                  };

                  if (Array.isArray(item.writingResults)) {
                    const sv = item.writingResults.find(s => s.model === "AI4LIFE");
                    if (sv) {
                      Object.assign(scores, sv);
                    }

                    const sv2 = item.writingResults.find(s => s.model !== "AI4LIFE");
                    if (sv2) {
                      Object.assign(otherModelsScores, sv2);
                      otherModelsUsageInfo.processingTime = `${sv2.processingTime?.toFixed(2) || "-"}s`;
                      Object.assign(otherModelsUsageInfo, sv2.usageInfo);
                    }
                  }

                  const answerText = item.answerText || "";
                  const questionText = item.questionText || "";

                  return {
                    key: String(item.id),
                    label: <b>{`Task ${item.taskNumber}`}</b>,
                    children: (
                      <>
                        {questionText && (
                          <>
                            <h3 className="mb-4">Task</h3>
                            <div className="p-4 rounded-md border border-grey1 bg-line mb-4">
                              {questionText.split("\n").map((line, index) => (
                                <p key={index}>{line}</p>
                              ))}
                            </div>
                          </>
                        )}
                        <h3 className="mb-4">Submission</h3>
                        <div className="h-64 overflow-y-auto bg-line p-4 rounded-md">
                          {answerText.split("\n").map((line, index) => (
                            <p key={index}>{line}</p>
                          ))}
                        </div>
                        <div className="py-4">
                          <h3>Score</h3>

                          <div className="mt-3 border-1 border-main rounded-md p-3 flex justify-around gap-3">
                            <OverallPoint point={scores.overall} />
                            <SkillPoint icon={<LayersIcon className="text-main" />} name="Organization" point={scores.organization} />
                            <SkillPoint icon={<BoldIcon className="text-main" />} name="Vocabulary" point={scores.vocabulary} />
                            <SkillPoint icon={<BookOpenIcon className="text-main" />} name="Grammar" point={scores.grammar} />
                          </div>
                        </div>
                        {scores.explanation && (
                          <div className="py-4">
                            <h3>Explaination</h3>
                            <div className="mt-3 p-4 rounded-md border border-grey1">
                              <div className="overflow-y-auto max-h-[40vh] pr-2 prose max-w-full text-md">
                                <Markdown components={{
                                  p: ({ node, ...props }) => <p className="" {...props} />,
                                  h2: ({ node, ...props }) => <h2 className="text-main" {...props} />,
                                  h3: ({ node, ...props }) => <h3 className="text-main" {...props} />,
                                  h4: ({ node, ...props }) => <h4 className="text-main" {...props} />,
                                  li: ({ node, ...props }) => <li className="" {...props} />,
                                }}
                                >
                                  {scores.explanation}
                                </Markdown>
                              </div>
                            </div>
                          </div>
                        )}
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
                                        <span>Score with Gemini 2.5 Pro</span>
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
                                            <span className="text-sm text-gray-600">Organization</span>
                                            <span className="text-lg font-bold">{otherModelsScores.overall}</span>
                                          </div>
                                          <div className="flex flex-col">
                                            <span className="text-sm text-gray-600">Vocabulary</span>
                                            <span className="text-lg font-bold">{otherModelsScores.vocabulary}</span>
                                          </div>
                                          <div className="flex flex-col">
                                            <span className="text-sm text-gray-600">Grammar</span>
                                            <span className="text-lg font-bold">{otherModelsScores.grammar}</span>
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
                                            <span className="text-sm font-semibold">{otherModelsUsageInfo.processingTime}</span>
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
                    ),
                  };
                })}
              />
            )}

            {getWritingSubmissionQuery.isSuccess && getWritingSubmissionQuery.data?.length === 0 && (
              <div className="flex justify-center items-center h-full">
                <Alert
                  message="No writing tasks"
                  type="info"
                />
              </div>
            )}
            {(getWritingSubmissionQuery.isLoading || getWritingSubmissionQuery.isFetching) && (
              <div className="flex justify-center items-center h-full">
                <Spin size="large" />
              </div>
            )}
            {getWritingSubmissionQuery.isError && (
              <div className="flex justify-center items-center h-full">
                <Alert
                  message="Error"
                  description={getWritingSubmissionQuery.error.message}
                  type="error"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
