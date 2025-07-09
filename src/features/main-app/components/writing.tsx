import Icons from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Alert, Spin, Tabs } from "antd";
import { OverallPoint } from "./overall-point";
import { SkillPoint } from "./skill-point";
import { getWritingScoringData, getWritingSubmissionsData, IWritingScoring, IWritingSubmission } from "../apis/writing.api";
import { setFullHeightFromTop } from "@/lib/utils";

interface IComponentProps {
  examId: number | null;
}

export function WritingComponent({ examId }: IComponentProps) {
  const getWritingSubmissionQuery = useQuery<IWritingSubmission>({
    queryKey: ["writing-submission", examId],
    queryFn: () => getWritingSubmissionsData(examId as number),
    staleTime: 0,
    enabled: !!examId,
  });

  const getWritingScoringQuery = useQuery<IWritingScoring>({
    queryKey: ["writing-scoring", examId],
    queryFn: () => getWritingScoringData(examId as number),
    staleTime: 0,
    enabled: !!examId,
  });

  let statusContent = null;

  if (!examId) {
    statusContent = (
      <div className="">

      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg">
      <h2 className="px-4 pt-4 pb-2 border-b-2 border-b-gray-200">Writing</h2>
      <div
        className="overflow-auto px-4 mt-2"
        ref={setFullHeightFromTop}
      >
        {statusContent || (
          <>
            <div className="">
              <div className="flex items-center">
                <h3 className="grow">Submission</h3>
                <Button size="sm" onClick={() => getWritingScoringQuery.refetch()}>
                  <Icons.RotateCwIcon className="stroke-dscl-white" />
                  <span>Re-Score</span>
                </Button>
              </div>
              <div className="mt-3 px-4 pb-2 bg-dscl-line rounded-md">
                <div className="overflow-y-auto pr-2">
                  {(getWritingSubmissionQuery.isLoading || getWritingSubmissionQuery.isFetching) && (
                    <div className="flex justify-center items-center h-16">
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
                  {getWritingSubmissionQuery.isSuccess && (
                    <Tabs
                      items={getWritingSubmissionQuery.data.tasks.map((item) => {
                        return {
                          key: String(item.no),
                          label: <b>{`Task ${item.no}`}</b>,
                          children: (
                            <div className="h-64 overflow-y-auto">
                              {item.text.split("\n").map((line, index) => (
                                <p key={index}>{line}</p>
                              ))}
                            </div>
                          ),
                        };
                      })}
                    />
                  )}
                </div>
              </div>
            </div>
            {(getWritingScoringQuery.isLoading || getWritingScoringQuery.isFetching) && (
              <div className="flex justify-center items-center h-20">
                <Spin size="large" />
              </div>
            )}
            {getWritingScoringQuery.isError && (
              <div className="flex justify-center items-center h-full">
                <Alert
                  message="Error"
                  description={getWritingScoringQuery.error.message}
                  type="error"
                />
              </div>
            )}
            {getWritingScoringQuery.isSuccess && (
              <>
                <div className="py-4">
                  <h3>Score</h3>

                  <div className="mt-3 border-1 border-dscl-main rounded-md p-3 flex justify-around">
                    <OverallPoint point={getWritingScoringQuery.data.scoringDetails.overall} />
                    <SkillPoint icon={<Icons.LayersIcon className="stroke-dscl-main" />} name="Organization" point={getWritingScoringQuery.data.scoringDetails.organization} />
                    <SkillPoint icon={<Icons.BoldIcon className="stroke-dscl-main" />} name="Vocabulary" point={getWritingScoringQuery.data.scoringDetails.vocabulary} />
                    <SkillPoint icon={<Icons.BookOpenIcon className="stroke-dscl-main" />} name="Grammar" point={getWritingScoringQuery.data.scoringDetails.vocabulary} />
                  </div>
                </div>
                <div className="py-4">
                  <h3>Explaination</h3>
                  <div className="mt-3 p-4 rounded-md border border-dscl-grey1">
                    <div className="overflow-y-auto max-h-[40vh] pr-2">
                      {getWritingScoringQuery.isSuccess && (
                        <div dangerouslySetInnerHTML={{ __html: getWritingScoringQuery.data.explaination }}></div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
