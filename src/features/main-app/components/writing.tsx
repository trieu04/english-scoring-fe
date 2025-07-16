import { Button } from "@/components/ui/button";
import { setFullHeightFromTop } from "@/lib/utils";
import { apiService } from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";
import { Alert, notification, Spin, Tabs } from "antd";
import { cx } from "class-variance-authority";
import { BoldIcon, BookOpenIcon, LayersIcon, RotateCwIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { OverallPoint } from "./overall-point";
import { SkillPoint } from "./skill-point";

interface IComponentProps {
  examId: number | null;
}

export function WritingComponent({ examId }: IComponentProps) {
  const [isScoring, setIsScoring] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<number | null>(null);

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
          version: number;
          overall: number;
          organization: number;
          vocabulary: number;
          grammar: number;
          explanation: string;
          createdAt: string;
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
    }
    catch (error) {
      notification.error({
        message: "Failed to score the submissions.",
        description: `${error instanceof Error ? error.message : ""}`,
      });
    }
    setIsScoring(false);
  };

  useEffect(() => {
    setCurrentVersion(getWritingSubmissionQuery.data?.[0]?.currentWritingResultVersion || null);
  }, [getWritingSubmissionQuery.data]);

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
            <div className="">
              {getWritingSubmissionQuery.isSuccess && (
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

                    if (Array.isArray(item.writingResults)) {
                      let sv = item.writingResults.find(s => s.version === currentVersion);
                      if (!sv) {
                        sv = item.writingResults[0];
                      }
                      if (sv) {
                        Object.assign(scores, sv);
                      }
                    }

                    const answerText = item.answerText || "";

                    return {
                      key: String(item.id),
                      label: <b>{`Task ${item.taskNumber}`}</b>,
                      children: (
                        <>
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
                        </>
                      ),
                    };
                  })}
                />
              )}
            </div>
            {(getWritingSubmissionQuery.isLoading || getWritingSubmissionQuery.isFetching) && (
              <div className="flex justify-center items-center h-20">
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
