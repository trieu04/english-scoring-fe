import Icons from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Alert, Spin } from "antd";
import { getSpeakingScoringData, getSpeakingSubmissionData, getSpeakingVersioningData, ISpeckingScoring, ISpeckingSubmission } from "../../apis/speaking.api";
import { OverallPoint } from "../overall-point";
import { SkillPoint } from "../skill-point";
import { AudioPlayer } from "./audio-player";

interface IComponentProps {
  examId: number | null;
}

export function SpeakingComponent({ examId }: IComponentProps) {
  const getSpeakingSubmissionQuery = useQuery<ISpeckingSubmission>({
    queryKey: ["scoring-submission", examId],
    queryFn: () => getSpeakingSubmissionData(examId as number),
    staleTime: 0,
    enabled: !!examId,
  });

  const getSpeakingScoringQuery = useQuery<ISpeckingScoring>({
    queryKey: ["scoring-query", examId],
    queryFn: () => getSpeakingScoringData(examId as number),
    staleTime: 0,
    enabled: !!examId,
  });

  const getSpeakingVersioningQuery = useQuery({
    queryKey: ["scoring-versioning", examId],
    queryFn: () => getSpeakingVersioningData(examId as number),
    staleTime: 0,
    enabled: !!examId,
  });

  let statusContent = null;

  if (!examId) {
    statusContent = (
      <div>
        <Alert
          message="Let choose an exam"
          description="Please choose an exam to start scoring."
          type="info"
        />
      </div>
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
    <div className="p-4">
      <div className="pb-3 mb-2 border-b-2 border-dscl-blue1 flex items-center">
        <h2 className="grow">Speaking</h2>
        <Icons.SidebarIcon />
      </div>
      {statusContent || (
        <>
          <div className="flex items-center py-4">
            <h3 className="grow">Submission</h3>
            <Button size="sm" onClick={() => getSpeakingScoringQuery.refetch()}>
              <Icons.RotateCwIcon className="stroke-dscl-white" />
              <span>Re-Score</span>
            </Button>
          </div>

          {getSpeakingSubmissionQuery.isLoading && (
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

          {getSpeakingSubmissionQuery.isSuccess && (
            <div>
              <AudioPlayer url={getSpeakingSubmissionQuery.data.audioUrl} />
            </div>
          )}

          <div className="py-4">
            <h3>Score</h3>
            {(getSpeakingScoringQuery.isLoading || getSpeakingScoringQuery.isFetching) && (
              <div className="flex justify-center items-center h-16">
                <Spin size="large" />
              </div>
            )}
            {getSpeakingScoringQuery.isError && (
              <div className="flex justify-center items-center h-full">
                <Alert
                  message="Error"
                  description={getSpeakingScoringQuery.error.message}
                  type="error"
                />
              </div>
            )}
            {getSpeakingScoringQuery.isSuccess && (
              <div className="mt-3 py-3 border-1 border-dscl-main rounded-md justify-items-center grid grid-cols-2 gap-0 space-y-8">
                <>
                  <OverallPoint point={getSpeakingScoringQuery.data.scoringDetails.overall} />
                  <SkillPoint icon={<Icons.MicIcon className="stroke-dscl-main" />} name="Pronunciation" point={getSpeakingScoringQuery.data.scoringDetails.pronunciation} />
                  <SkillPoint icon={<Icons.BoldIcon className="stroke-dscl-main" />} name="Vocabulary" point={getSpeakingScoringQuery.data.scoringDetails.vocabulary} />
                  <SkillPoint icon={<Icons.BookOpenIcon className="stroke-dscl-main" />} name="Grammar" point={getSpeakingScoringQuery.data.scoringDetails.grammar} />
                  <SkillPoint icon={<Icons.MessageCircleIcon className="stroke-dscl-main" />} name="Fluency" point={getSpeakingScoringQuery.data.scoringDetails.fluency} />
                  <SkillPoint icon={<Icons.FileTextIcon className="stroke-dscl-main" />} name="Content" point={getSpeakingScoringQuery.data.scoringDetails.content} />
                </>
              </div>
            )}
          </div>
          <div className="py-4">
            <div className="flex items-center">
              <h3 className="grow-1">Score version</h3>
              <Button size="sm">
                <Icons.PlusIcon className="stroke-dscl-white" />
                <span>Save Version</span>
              </Button>
            </div>

            {(getSpeakingVersioningQuery.isLoading || getSpeakingVersioningQuery.isFetching) && (
              <div className="flex justify-center items-center h-16">
                <Spin size="large" />
              </div>
            )}

            {getSpeakingVersioningQuery.isError && (
              <div className="flex justify-center items-center h-full">
                <Alert

                  message="Error"

                  description={getSpeakingVersioningQuery.error.message}
                  type="error"
                />
              </div>
            )}
            {getSpeakingVersioningQuery.isSuccess && (
              <div className="mt-3 flex flex-col space-y-3">
                {
                  getSpeakingVersioningQuery.data.versions.map(item => (
                    <div className="flex space-x-2 border-1 border-dscl-grey1 p-4 rounded-md items-center" key={item.id}>
                      <div className="text-dscl-main font-bold grow cursor-pointer">
                        Version
                        {" "}
                        {item.version}
                      </div>
                      <Icons.ClockIcon />
                      <div className="flex items-center">
                        <span>{item.time}</span>
                        <span className="ml-2">{item.date}</span>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
}
