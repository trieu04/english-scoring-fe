import { BoldIcon, BookOpenIcon, ClockIcon, FileTextIcon, MessageCircleIcon, MicIcon, RotateCwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { handleApiError } from "@/lib/error-handle";
import { apiService } from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";
import { notification } from "antd";
import { cx } from "class-variance-authority";
import { useMemo, useState } from "react";
import { ScoringJobInterface, ScoringJobStatus, ScoringModel, ScoringQueueName, ScoringResultInterface, SubmissionType } from "../types/scoring";
import { OverallPoint } from "./overall-point";
import { SkillPoint } from "./skill-point";

export function SpeakingScoresComponent({
  examId,
}: {
  examId?: string;
}) {
  const [isScoring, setIsScoring] = useState(false);

  // Query for scoring results
  const queryParams = {
    submissionType: SubmissionType.SPEAKING,
    model: ScoringModel.AI4LIFE_SPEAKING,
  };
  const getSpeakingScoringResultQuery = useQuery({
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
    queryKey: ["/scoring/jobs/exam", examId],
    queryFn: () => apiService.get<ScoringJobInterface[]>(
      `/scoring/jobs/exam/${examId}`,
    ),
    enabled: !!examId,
    refetchInterval: (query) => {
      // Auto-refetch every 3 seconds if job is in progress
      const jobs = query.state.data;
      const job = jobs?.find(j => j.submissionType === SubmissionType.SPEAKING && j.queueName?.includes("ai4life"));
      if (job && (job.status === ScoringJobStatus.QUEUED || job.status === ScoringJobStatus.PROCESSING)) {
        return 3000;
      }
      return false;
    },
  });

  const handleReScore = async () => {
    if (!examId)
      return;

    setIsScoring(true);
    try {
      await apiService.post(`/exam/${examId}/scoring-jobs`, {
        queueName: ScoringQueueName.SPEAKING_AI4LIFE_MODEL_SCORING,
        examId,
      });
      notification.success({
        message: "Success",
        description: "Speaking scoring job has been queued.",
      });
      // Refetch jobs to get the latest status
      getScoringJobsQuery.refetch();
    }
    catch (error) {
      handleApiError(error, {
        customMessage: "Failed to queue speaking scoring job",
      });
    }
    finally {
      setIsScoring(false);
    }
  };

  const displayData = useMemo(() => {
    const defaultData = {
      overall: "-",
      pronunciation: "-",
      fluency: "-",
      vocabulary: "-",
      grammar: "-",
      content: "-",
      explanation: "-",
    };
    const result = getSpeakingScoringResultQuery.data || [];
    if (result.length !== 0) {
      Object.assign(defaultData, result[0]);
    }

    return defaultData;
  }, [getSpeakingScoringResultQuery.data]);

  // Get current job status
  const currentJob = useMemo(() => {
    const jobs = getScoringJobsQuery.data || [];
    return jobs.find(j => j.submissionType === SubmissionType.SPEAKING && j.queueName?.includes("ai4life")) || null;
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
    <div className="py-4 mt-2">
      <div className="flex items-center">
        <h3 className="grow">Score</h3>
        <Button size="sm" onClick={handleReScore} disabled={buttonState.disabled}>
          {buttonState.icon}
          <span>{buttonState.text}</span>
        </Button>
      </div>
      <div className="mt-3 px-4 py-4 border-1 border-main rounded-md justify-items-center grid grid-cols-2 gap-4 ">
        <>
          <OverallPoint point={displayData.overall} />
          <SkillPoint icon={<MicIcon className="text-main" />} name="Pronunciation" point={displayData.pronunciation} />
          <SkillPoint icon={<MessageCircleIcon className="text-main" />} name="Fluency" point={displayData.fluency} />
          <SkillPoint icon={<BoldIcon className="text-main" />} name="Vocabulary" point={displayData.vocabulary} />
          <SkillPoint icon={<BookOpenIcon className="text-main" />} name="Grammar" point={displayData.grammar} />
          <SkillPoint icon={<FileTextIcon className="text-main" />} name="Content" point={displayData.content} />
        </>
      </div>
    </div>
  );
}
