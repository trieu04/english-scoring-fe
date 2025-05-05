import Icons from "@/components/icons";
import { Button } from "@/components/ui/button";
import { getExamSessionListData, getExamListData } from "@/mocks/exams";
import { useQuery } from "@tanstack/react-query";
import { Alert, Spin } from "antd";
import clsx from "clsx";
import { useState } from "react";

interface IComponentProps {
  examId: number | null;
  setExamId: (id: number | null) => void;
}

export function NavComponent({ examId, setExamId }: IComponentProps) {
  const [pickedExamSession, setPickedExamSession] = useState<{ id: number; name: string } | null>(null);

  const examSessionsQuery = useQuery({
    queryKey: ["exam-sessions"],
    queryFn: () => getExamSessionListData(),
    staleTime: 5000,
  });

  const examListQuery = useQuery({
    queryKey: ["exam-list", pickedExamSession?.id],
    queryFn: () => getExamListData(pickedExamSession?.id as number),
    enabled: !!pickedExamSession,
  });

  return (
    <div className="px-4 w-64 max-h-full overflow-y-auto">
      <div className="py-3 border-b-2 border-dscl-blue1 flex items-center">
        <h2 className="grow">File and history</h2>
        <Icons.SidebarIcon />
      </div>
      <div className="p-3">
        <Button className="w-full">
          <Icons.PlusIcon className="stroke-dscl-white" />
          <span>New Scoring</span>
        </Button>
      </div>
      <div>
        {
          !pickedExamSession
            ? (
                <>
                  <div className="flex justify-center border-b-2 border-dscl-blue1 py-2">
                    <h3 className="grow">History</h3>
                    <Icons.MoreVerticalIcon />
                  </div>
                  {examSessionsQuery.isLoading && <Spin className="w-full" tip="Loading" size="small" />}
                  {examSessionsQuery.isSuccess && (
                    <div className="flex flex-col space-y-6 py-6">
                      {
                        examSessionsQuery.data.map(item => (
                          <div key={item.id}>
                            <div
                              className={clsx("cursor-pointer flex items-center space-x-2")}
                              onClick={() => { setPickedExamSession({ id: item.id, name: item.name }); }}
                            >
                              <Icons.ExamMultipleChoiceIcon />
                              <div>
                                {item.name}
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>

                  )}
                </>
              )
            : (
                <>
                  <div className="flex justify-center border-b-2 border-dscl-blue1 py-2">
                    <Icons.ChevronLeftIcon onClick={() => setPickedExamSession(null)} className="cursor-pointer mr-1" />
                    <h3 className="grow">{pickedExamSession.name}</h3>
                    <Icons.MoreVerticalIcon />
                  </div>
                  {examListQuery.isLoading && <Spin className="w-full" tip="Loading" size="small" />}
                  {examListQuery.isSuccess
                    && (
                      <div className="flex flex-col space-y-2 py-6">
                        {
                          examListQuery.data.map(item => (
                            <div key={item.id} className={clsx("p-2 rounded-sm", item.id === examId && "bg-dscl-blue1")}>
                              <div
                                className="flex items-center space-x-2 cursor-pointer"
                                onClick={() => { setExamId(item.id); }}
                              >
                                <Icons.ExamMultipleChoiceIcon />
                                <div>
                                  {item.name}
                                </div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    )}

                </>

              )
        }

      </div>
    </div>
  );
}
