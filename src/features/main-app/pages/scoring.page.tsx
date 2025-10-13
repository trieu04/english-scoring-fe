import Illustrations from "@/components/illustrations";
import { setFullHeightFromTop } from "@/lib/utils";
import { apiService } from "@/services/api.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Modal, Spin, Input, message } from "antd";
import { SpeakingComponent } from "../components/speaking";
import { WritingComponent } from "../components/writing";
import Icons from "@/components/icons";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { PencilIcon } from "lucide-react";

export function ScoringPage() {
  const navigate = useNavigate();
  const { examSessionId, examId } = useSearch({ from: "/main-app/scoring" });
  const queryClient = useQueryClient();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedName, setEditedName] = useState("");

  const examDetailQuery = useQuery({
    queryKey: ["/exam-session/{examSessionId}", { examSessionId }],
    queryFn: () => {
      return apiService.get<{
        id: string;
        name: string;
        description: string;
        scoringSystemName: string;
        totalExams: number;
      }>(`/exam-session/${examSessionId}`);
    },
    enabled: !!examSessionId,
  });

  const examListQuery = useQuery({
    queryKey: ["/exam-session/{examSessionId}/exam-list", { examSessionId }],
    queryFn: () => {
      return apiService.get<{
        id: string;
        name: string;
        createdAt: string;
      }[]>(`/exam-session/${examSessionId}/exam-list`);
    },
    enabled: !!examSessionId,
  });

  const updateNameMutation = useMutation({
    mutationFn: (newName: string) => {
      return apiService.patch(`/exam-session/${examSessionId}`, { name: newName });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/exam-session/{examSessionId}", { examSessionId }],
      });
      message.success("Exam session name updated successfully!");
      setIsEditModalOpen(false);
    },
    onError: () => {
      message.error("Failed to update exam session name.");
    },
  });

  const handleOpenEditModal = () => {
    setEditedName(examDetailQuery.data?.name || "");
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editedName.trim()) {
      message.warning("Name cannot be empty!");
      return;
    }
    updateNameMutation.mutate(editedName);
  };

  useEffect(() => {
    if (!examId && examListQuery.data?.length) {
      navigate({ to: "/scoring", search: { examSessionId, examId: examListQuery.data[0].id }, replace: true });
    }
  }, [examId, examListQuery.data, examSessionId, navigate]);

  return (
    <div className="flex space-x-3 px-3 h-full">
      <nav className="relative shrink-0 h-full flex flex-col w-80">
        <div className="bg-white rounded-xl p-3">
          <div className="flex">
            <Illustrations.ExamIllustration />
            <div className="ml-2 flex grow">
              <div className="flex-1">
                <h3 className="flex text-md w-full">
                  <span className="break-words line-clamp-2 w-44">
                    {examDetailQuery.data?.name}
                  </span>
                </h3>
                <div className="text-md text-gray-700 leading-5">
                  Test count:
                  {examDetailQuery.data?.totalExams}
                </div>
                <div className="leading-5">
                  Scoring system:
                  {examDetailQuery.data?.scoringSystemName}
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleOpenEditModal}
                  title="Edit name"
                >
                  <PencilIcon className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="bg-white rounded-xl mt-4 shrink-0 flex flex-col"
        >
          <div className="flex-1">
            <h2 className="px-4 pt-4 pb-2 border-b-2 border-b-gray-200">List of Test</h2>
            <div
              className="overflow-auto px-4"
              ref={setFullHeightFromTop}
            >
              {examDetailQuery.isLoading && <Spin className="w-full" size="small" />}
              {examDetailQuery.isSuccess
                && (
                  <div className="flex flex-col space-y-2 py-6  overflow-y-auto">
                    {
                      examListQuery.data?.map((item, idx) => (
                        <div key={item.id} className={clsx("p-2 rounded-sm", item.id === examId && "bg-second")}>
                          <div
                            className="flex items-center space-x-2 cursor-pointer"
                            onClick={() => {
                              navigate({ to: "/scoring", search: { examSessionId, examId: item.id }, replace: true });
                            }}
                          >
                            <Icons.ExamMultipleChoiceIcon />
                            <div>
                              {item.name || `Test ${idx + 1}`}
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                )}
            </div>
          </div>
        </div>
      </nav>
      <section className="rounded-lg w-15/24 bg-dscl-white h-fit">
        <WritingComponent examId={examId} />
      </section>
      <section className="rounded-lg w-9/24 bg-dscl-white h-fit">
        <SpeakingComponent examId={examId} />
      </section>

      <Modal
        title="Edit Exam Session Name"
        open={isEditModalOpen}
        onOk={handleSaveEdit}
        onCancel={() => setIsEditModalOpen(false)}
        okText="Save"
        cancelText="Cancel"
        confirmLoading={updateNameMutation.isPending}
      >
        <div className="py-4">
          <label className="block text-sm font-medium mb-2">
            Exam Session Name
          </label>
          <Input
            value={editedName}
            onChange={e => setEditedName(e.target.value)}
            placeholder="Enter exam session name"
            onPressEnter={handleSaveEdit}
          />
        </div>
      </Modal>
    </div>
  );
}
