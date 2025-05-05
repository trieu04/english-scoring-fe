import Icons from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Alert, Spin, Tabs } from "antd";
import { OverallPoint } from "../components/overall-point";
import { SkillPoint } from "../components/skill-point";
import { getMockWritingSubmissionsData, IWritingSubmissionItem } from "@/mocks/writing-submissions";

interface IComponentProps {
  examId: number | null;
}

export function WritingComponent({ examId }: IComponentProps) {
  const dataQuery = useQuery<IWritingSubmissionItem[]>({
    queryKey: ["writing-submission", examId],
    queryFn: () => getMockWritingSubmissionsData(examId as number),
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

  if (dataQuery.isError) {
    statusContent = (
      <div className="flex justify-center items-center h-full">
        <Alert
          message="Error"
          description={dataQuery.error.message}
          type="error"
        />
      </div>
    );
  }

  if (dataQuery.isLoading || dataQuery.isFetching) {
    statusContent = (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="pb-3 mb-2 border-b-2 border-dscl-blue1">
        <h2>Writing</h2>
      </div>
      {statusContent || (
        <>
          <div className="py-4">
            <div className="flex items-center">
              <h3 className="grow">Submission</h3>
              <Button size="sm">
                <Icons.RotateCwIcon className="stroke-dscl-white" />
                <span>Re-Score</span>
              </Button>
            </div>
            <div className="mt-3 px-4 pb-2 bg-dscl-line rounded-md">
              <div className="overflow-y-auto pr-2">
                {dataQuery.isLoading && <p>Loading...</p>}
                {dataQuery.isError && (
                  <p>
                    Error:
                    {dataQuery.error.message}
                  </p>
                )}
                {dataQuery.isSuccess && (
                  <Tabs
                    defaultActiveKey="2"
                    items={dataQuery.data.map((item) => {
                      return {
                        key: String(item.id),
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
          <div className="py-4">
            <h3>Score</h3>
            <div className="mt-3 border-1 border-dscl-main rounded-md p-4 flex justify-around">
              <OverallPoint point={9} />
              <SkillPoint icon={<Icons.LayersIcon className="stroke-dscl-main" />} name="Organization" point={9} />
              <SkillPoint icon={<Icons.BoldIcon className="stroke-dscl-main" />} name="Vocabulary" point={9} />
              <SkillPoint icon={<Icons.BookOpenIcon className="stroke-dscl-main" />} name="Grammar" point={8} />
            </div>
          </div>
          <div className="py-4">
            <h3>Explaination</h3>
            <div className="mt-3 p-4 rounded-md border border-dscl-grey1">
              <div className="overflow-y-auto max-h-[40vh] pr-2">
                <p>Tổ chức bài viết (Coherence and Organization):</p>
                <ul className="list-outside list-disc pl-6">
                  <li>Điểm: 9/10</li>
                  <li>Lý do: Bài viết của bạn có cấu trúc rõ ràng và mạch lạc. Bạn đã mở đầu bằng một luận điểm chính (work from home có thể hiệu quả), sau đó đưa ra các lý do ủng hộ và phản đối. Cuối cùng, bạn đã kết luận một cách hợp lý với gợi ý về giải pháp hybrid. Điểm trừ nhỏ có thể là việc có thể phát triển thêm ví dụ chi tiết cho mỗi luận điểm.</li>
                </ul>

                <p>Ngữ pháp và chính tả (Grammar and Spelling):</p>
                <ul className="list-outside list-disc pl-6">
                  <li>Điểm: 9/10</li>
                  <li>Lý do: Bài viết không có lỗi chính tả và rất ít lỗi ngữ pháp. Các câu đều được viết đúng ngữ pháp và dễ hiểu. Tuy nhiên, có thể sử dụng một số cấu trúc ngữ pháp phức tạp hơn để làm tăng sự phong phú và đa dạng.</li>
                </ul>

                <p>Từ vựng (Vocabulary):</p>
                <ul className="list-outside list-disc pl-6">
                  <li>Điểm: 8/10</li>
                  <li>Lý do: Từ vựng bạn sử dụng khá phong phú và phù hợp với chủ đề. Các thuật ngữ như "flexibility," "work-life balance," "productivity," "social interaction," "collaboration," và "hybrid approach" đều là những từ vựng phù hợp với ngữ cảnh. Tuy nhiên, bạn có thể cải thiện thêm bằng cách sử dụng nhiều từ đồng nghĩa hơn hoặc các cụm từ nâng cao để tạo sự ấn tượng mạnh hơn.</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
