import { cx } from "class-variance-authority";
import { ClockIcon, RotateCwIcon } from "lucide-react";
import { useMemo, useState } from "react";
import Markdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { Collapse, notification } from "antd";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api.service";
import { handleApiError } from "@/lib/error-handle";
import { ScoringJobInterface, ScoringJobStatus, ScoringResultInterface, SubmissionType, ScoringModel } from "../types/scoring";

export function WritingScoresOtherModelComponent({
  examId,
  submissionId,
}: {
  examId?: string;
  submissionId?: string;
}) {
  const [isScoring, setIsScoring] = useState(false);

  // Query for scoring results
  const queryParams = {
    submissionId,
    submissionType: SubmissionType.WRITING,
    model: ScoringModel.GEMINI_PRO,
  };
  const getWritingScoringResultQuery = useQuery({
    queryKey: ["/exam/{examId}/scoring-results", examId, queryParams],
    queryFn: () => apiService.get<ScoringResultInterface[]>(
      `/exam/${examId}/scoring-results`,
      {
        params: queryParams,
      },
    ),
  });

  // Query for scoring jobs
  const getScoringJobsQuery = useQuery({
    queryKey: ["/scoring/jobs/submission/gemini", submissionId],
    queryFn: () => apiService.get<ScoringJobInterface[]>(
      `/scoring/jobs/submission/${submissionId}`,
    ),
    enabled: !!submissionId,
    refetchInterval: (query) => {
      // Auto-refetch every 3 seconds if job is in progress
      const jobs = query.state.data;
      const job = jobs?.find(j => j.queueName?.includes("gemini"));
      if (job && (job.status === ScoringJobStatus.QUEUED || job.status === ScoringJobStatus.PROCESSING)) {
        return 3000;
      }
      return false;
    },
  });

  const handleCompare = async () => {
    if (!examId || !submissionId)
      return;

    setIsScoring(true);
    try {
      await apiService.post(`/scoring/writing/${ScoringModel.GEMINI_PRO}`, {
        examId,
        submissionId,
      });
      notification.success({
        message: "Success",
        description: "Gemini scoring job has been queued.",
      });
      // Refetch jobs to get the latest status
      getScoringJobsQuery.refetch();
    }
    catch (error) {
      handleApiError(error, {
        customMessage: "Failed to queue Gemini scoring job",
      });
    }
    finally {
      setIsScoring(false);
    }
  };

  const displayData = useMemo(() => {
    const defaultData = {
      overall: "-",
      organization: "-",
      vocabulary: "-",
      grammar: "-",
      explanation: "-",
    };
    const result = getWritingScoringResultQuery.data || [];
    if (result.length !== 0) {
      Object.assign(defaultData, result[0]);
    }

    return defaultData;
  }, [getWritingScoringResultQuery.data]);

  // Get current job status
  const currentJob = useMemo(() => {
    const jobs = getScoringJobsQuery.data || [];
    return jobs.find(j => j.queueName?.includes("gemini")) || null;
  }, [getScoringJobsQuery.data]);

  // Determine button state and text
  const buttonState = useMemo(() => {
    if (!currentJob) {
      return {
        text: "Score with Gemini 2.5 Pro",
        disabled: isScoring,
        isAnimating: isScoring,
        icon: <RotateCwIcon className={cx("text-white", isScoring && "animate-spin")} />,
      };
    }

    switch (currentJob.status) {
      case ScoringJobStatus.QUEUED:
        return {
          text: "Queued",
          disabled: true,
          isAnimating: false,
          icon: <ClockIcon className="text-white" />,
        };
      case ScoringJobStatus.PROCESSING:
        return {
          text: "Processing",
          disabled: true,
          isAnimating: true,
          icon: <RotateCwIcon className="text-white animate-spin" />,
        };
      case ScoringJobStatus.DONE:
        return {
          text: "Re-Score with Gemini",
          disabled: isScoring,
          isAnimating: isScoring,
          icon: <RotateCwIcon className={cx("text-white", isScoring && "animate-spin")} />,
        };
      case ScoringJobStatus.ERROR:
        return {
          text: "Retry",
          disabled: isScoring,
          isAnimating: isScoring,
          icon: <RotateCwIcon className={cx("text-white", isScoring && "animate-spin")} />,
        };
      default:
        return {
          text: "Score with Gemini 2.5 Pro",
          disabled: isScoring,
          isAnimating: isScoring,
          icon: <RotateCwIcon className={cx("text-white", isScoring && "animate-spin")} />,
        };
    }
  }, [currentJob, isScoring]);

  const otherModelsUsageInfo = useMemo(() => {
    const result = getWritingScoringResultQuery.data?.[0];
    if (!result || !result.usageInfo) {
      return {
        model: "-",
        processing_time: "-",
        prompt_tokens: "-",
        completion_tokens: "-",
        total_tokens: "-",
        cost_usd: "-",
      };
    }

    return {
      model: result.usageInfo.model || "-",
      processing_time: result.processingTime ? `${result.processingTime}ms` : "-",
      prompt_tokens: result.usageInfo.prompt_tokens?.toString() || "-",
      completion_tokens: result.usageInfo.completion_tokens?.toString() || "-",
      total_tokens: result.usageInfo.total_tokens?.toString() || "-",
      cost_usd: result.usageInfo.cost_usd?.toFixed(6) || "-",
    };
  }, [getWritingScoringResultQuery.data]);

  return (
    <Collapse
      defaultActiveKey={["1"]}
      items={[{
        key: "1",
        label: <h3 className="m-0">Compare with another model</h3>,
        children: (
          <div>
            <div className="mb-4">
              <Button size="sm" onClick={handleCompare} disabled={buttonState.disabled}>
                {buttonState.icon}
                <span>{buttonState.text}</span>
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-main mb-2">Scores</h4>
                <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-md">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Overall</span>
                    <span className="text-lg font-bold text-main">{displayData.overall}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Organization</span>
                    <span className="text-lg font-bold">{displayData.organization}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Vocabulary</span>
                    <span className="text-lg font-bold">{displayData.vocabulary}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Grammar</span>
                    <span className="text-lg font-bold">{displayData.grammar}</span>
                  </div>
                </div>
              </div>
              {displayData.explanation && displayData.explanation !== "-" && (
                <div>
                  <div className="py-4">
                    <h4 className="text-main mb-2">Explanation</h4>
                    <div className="mt-3 p-2 rounded-md border border-grey1 bg-gray-50">
                      <div className="overflow-y-auto max-h-42 pr-2 prose max-w-full text-md">
                        <Markdown components={{
                          p: ({ node, ...props }) => <p className="" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="text-main" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="text-main" {...props} />,
                          h4: ({ node, ...props }) => <h4 className="text-main" {...props} />,
                          li: ({ node, ...props }) => <li className="" {...props} />,
                        }}
                        >
                          {displayData.explanation}
                        </Markdown>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
      }]}
    />
  );
}
