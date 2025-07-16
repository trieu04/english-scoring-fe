import { Button } from "@/components/ui/button";
import { setFullHeightFromTop } from "@/lib/utils";
import { apiService } from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";
import { Alert, Spin, Tabs } from "antd";
import { cx } from "class-variance-authority";
import { BoldIcon, BookOpenIcon, ClockIcon, FileTextIcon, MessageCircleIcon, MicIcon, RotateCwIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { AudioPlayer } from "./audio-player";
import { OverallPoint } from "./overall-point";
import { SkillPoint } from "./skill-point";

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
    await apiService.post(`/exam/${examId}/score-speaking`);
    await getSpeakingSubmissionQuery.refetch();
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

            <Tabs
              defaultActiveKey="1"
              items={getSpeakingSubmissionQuery.data?.map((item) => {
                const scores = {
                  overall: "-",
                  pronunciation: "-",
                  organization: "-",
                  vocabulary: "-",
                  grammar: "-",
                  fluency: "-",
                  content: "-",
                  explanation: "",
                };

                if (Array.isArray(item.speakingResults)) {
                  const sv = item.speakingResults.find(s => s.version === currentVersion);
                  if (sv) {
                    Object.assign(scores, sv);
                  }
                }

                return {
                  key: item.id,
                  label: <b>{`Task ${item.taskNumber}`}</b>,
                  children: (
                    <>
                      <div>
                        <h3>Submission</h3>
                        <div className="mt-3 ">
                          <AudioPlayer url={item.answerFileUrl} />
                        </div>
                      </div>
                      <div className="py-4">

                        <h3>Score</h3>
                        <div className="mt-3 pt-4 border-1 border-main rounded-md justify-items-center grid grid-cols-2 gap-0 space-y-8">
                          <>
                            <OverallPoint point={scores.overall} />
                            <SkillPoint icon={<MicIcon className="text-main" />} name="Pronunciation" point={scores.pronunciation} />
                            <SkillPoint icon={<BoldIcon className="text-main" />} name="Vocabulary" point={scores.vocabulary} />
                            <SkillPoint icon={<BookOpenIcon className="text-main" />} name="Grammar" point={scores.grammar} />
                            <SkillPoint icon={<MessageCircleIcon className="text-main" />} name="Fluency" point={scores.fluency} />
                            <SkillPoint icon={<FileTextIcon className="text-main" />} name="Content" point={scores.content} />
                          </>
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
                        <div className="flex items-center">
                          <h3 className="grow-1">Score version</h3>
                        </div>
                        <div className="mt-3">
                          {item.speakingResults.map(result => (
                            <div
                              className={cx(
                                "mt-2 flex space-x-2 border-1 border-gray-200 p-4 rounded-md items-center",
                                result.version === currentVersion && "bg-second",
                              )}
                              key={item.id}
                            >
                              <div
                                className="text-main font-bold grow cursor-pointer"
                                onClick={() => {
                                  setCurrentVersion(result.version);
                                }}
                              >
                                Version
                                {" "}
                                {result.version}
                              </div>
                              <ClockIcon />
                              <div className="flex items-center">
                                <span>{new Date(result.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                                <span>{new Date(result.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div>
                        </div>
                      </div>
                    </>
                  ),
                };
              })}
            />
          </>
        )}

      </div>
    </div>
  );
}
