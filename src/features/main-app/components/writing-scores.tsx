import { Button } from "@/components/ui/button";
import { handleApiError } from "@/lib/error-handle";
import { apiService } from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";
import { notification } from "antd";
import { cx } from "class-variance-authority";
import { BoldIcon, BookOpenIcon, ClockIcon, LayersIcon, RotateCwIcon } from "lucide-react";
import { useMemo, useState } from "react";
import Markdown from "react-markdown";
import { ScoringJobInterface, ScoringJobStatus, ScoringModel, ScoringQueueName, ScoringResultInterface, SubmissionType } from "../types/scoring";
import { OverallPoint } from "./overall-point";
import { SkillPoint } from "./skill-point";

export function WritingScoresComponent({
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
    model: ScoringModel.AI4LIFE_WRITING,
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
    queryKey: ["/scoring/jobs/submission", submissionId],
    queryFn: () => apiService.get<ScoringJobInterface[]>(
      `/scoring/jobs/submission/${submissionId}`,
    ),
    enabled: !!submissionId,
    refetchInterval: (query) => {
      // Auto-refetch every 3 seconds if job is in progress
      const jobs = query.state.data;
      const job = jobs?.[0];
      if (job && (job.status === ScoringJobStatus.QUEUED || job.status === ScoringJobStatus.PROCESSING)) {
        return 3000;
      }
      return false;
    },
  });

  const handleReScore = async () => {
    if (!examId || !submissionId)
      return;

    setIsScoring(true);
    try {
      await apiService.post(`/exam/${examId}/scoring-jobs`, {
        queueName: ScoringQueueName.WRITING_AI4LIFE_MODEL_SCORING,
        examId,
        submissionId,
      });
      notification.success({
        message: "Success",
        description: "Writing scoring job has been queued.",
      });
      // Refetch jobs to get the latest status
      getScoringJobsQuery.refetch();
    }
    catch (error) {
      handleApiError(error, {
        customMessage: "Failed to queue writing scoring job",
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
    return jobs.length > 0 ? jobs[0] : null;
  }, [getScoringJobsQuery.data]);

  // Determine button state and text
  const buttonState = useMemo(() => {
    if (!currentJob) {
      return {
        text: "Score",
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
          text: "Re-Score",
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
          text: "Score",
          disabled: isScoring,
          isAnimating: isScoring,
          icon: <RotateCwIcon className={cx("text-white", isScoring && "animate-spin")} />,
        };
    }
  }, [currentJob, isScoring]);

  return (
    <>
      <div className="py-4 mt-2">
        <div className="flex items-center">
          <h3 className="grow">Score</h3>
          <Button size="sm" onClick={handleReScore} disabled={buttonState.disabled}>
            {buttonState.icon}
            <span>{buttonState.text}</span>
          </Button>
        </div>

        <div className="mt-3 border-1 border-main rounded-md p-3 flex justify-around gap-3">
          <OverallPoint point={displayData.overall} />
          <SkillPoint icon={<LayersIcon className="text-main" />} name="Organization" point={displayData.organization} />
          <SkillPoint icon={<BoldIcon className="text-main" />} name="Vocabulary" point={displayData.vocabulary} />
          <SkillPoint icon={<BookOpenIcon className="text-main" />} name="Grammar" point={displayData.grammar} />
        </div>
      </div>
      {displayData.explanation && displayData.explanation !== "-" && (
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
                {displayData.explanation}
              </Markdown>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
