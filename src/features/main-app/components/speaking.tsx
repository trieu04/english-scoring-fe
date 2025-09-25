import { Button } from "@/components/ui/button";
import { setFullHeightFromTop } from "@/lib/utils";
import { apiService } from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";
import { Alert, notification, Spin, Tabs } from "antd";
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
  const [currentVersion, setCurrentVersion] = useState<number | null>(null);

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
          overall: string | number;
          pronunciation: string | number;
          organization: string | number;
          vocabulary: string | number;
          grammar: string | number;
          fluency: string | number;
          content: string | number;
          explanation?: string;
          createdAt: string;
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

  useEffect(() => {
    setCurrentVersion(getSpeakingSubmissionQuery.data?.[0]?.currentSpeakingResultVersion || null);
  }, [getSpeakingSubmissionQuery.data]);

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
  const resultVersions = [] as { version: number; createdAt: string }[];
  const sumResults = {
    overall: 0,
    pronunciation: 0,
    fluency: 0,
    vocabulary: 0,
    grammar: 0,
    content: 0,
    count: 0,
  };
  getSpeakingSubmissionQuery.data?.forEach((item) => {
    speakingParts.push({
      taskNumber: item.taskNumber,
      url: item.answerFileUrl,
    });
    item.speakingResults.forEach((result) => {
      if (!resultVersions.some(r => r.version === result.version)) {
        resultVersions.push({ version: result.version, createdAt: result.createdAt });
      }
    });
    const sv = item.speakingResults.find(r => r.version === currentVersion);
    if (sv) {
      sumResults.overall += Number(sv.overall) || 0;
      sumResults.pronunciation += Number(sv.pronunciation) || 0;
      sumResults.fluency += Number(sv.fluency) || 0;
      sumResults.vocabulary += Number(sv.vocabulary) || 0;
      sumResults.grammar += Number(sv.grammar) || 0;
      sumResults.content += Number(sv.content) || 0;
      sumResults.count += 1;
    }
  });
  const scores = {
    overall: sumResults.overall / sumResults.count || 0,
    pronunciation: sumResults.pronunciation / sumResults.count || 0,
    fluency: sumResults.fluency / sumResults.count || 0,
    vocabulary: sumResults.vocabulary / sumResults.count || 0,
    grammar: sumResults.grammar / sumResults.count || 0,
    content: sumResults.content / sumResults.count || 0,
  };

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
                <div className="mt-3 pt-4 pb-4 border-1 border-main rounded-md justify-items-center grid grid-cols-2 gap-0 space-y-8">
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
                <div className="flex items-center">
                  <h3 className="grow-1">Score version</h3>
                </div>
                <div className="mt-3">
                  {resultVersions.map((version, idx) => (
                    <div
                      className={cx(
                        "mt-2 flex space-x-2 border-1 border-gray-200 p-4 rounded-md items-center",
                        version.version === currentVersion && "bg-second",
                      )}
                      key={idx}
                    >
                      <div
                        className="text-main font-bold grow cursor-pointer"
                        onClick={() => {
                          setCurrentVersion(version.version);
                        }}
                      >
                        Version
                        &nbsp;
                        {version.version}
                      </div>
                      <ClockIcon />
                      <div className="flex items-center">
                        <span>{new Date(version.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        &nbsp;
                        <span>{new Date(version.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                </div>
              </div>
            </>
          </>
        )}

      </div>
    </div>
  );
}
