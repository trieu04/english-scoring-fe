import { Dropdown, Input, message, Modal } from "antd";
import { MoreVertical, PencilIcon, PlayCircle } from "lucide-react";
import { useState } from "react";

import Illustrations from "@/components/illustrations";
import { apiService } from "@/services/api.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";

export function ExamOverviewComponent() {
  const { examSessionId } = useSearch({ from: "/main-app/scoring" });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
  const handleOpenEditModal = () => {
    setEditedName(examDetailQuery.data?.name || "");
    setIsEditModalOpen(true);
  };

  const updateNameMutation = useMutation({
    mutationFn: (newName: string) => {
      return apiService.patch(`/exam-session/${examSessionId}`, { name: newName });
    },
    onSuccess: () => {
      examDetailQuery.refetch();
      message.success("Exam session name updated successfully!");
      setIsEditModalOpen(false);
    },
    onError: () => {
      message.error("Failed to update exam session name.");
    },
  });

  const handleSaveEdit = () => {
    if (!editedName.trim()) {
      message.warning("Name cannot be empty!");
      return;
    }
    updateNameMutation.mutate(editedName);
  };

  const handleScoreAll = async () => {
    const data = await apiService.post<any[]>(`/exam-session/${examSessionId}/score-all`);
    message.success(`Scoring jobs for all tests have been queued successfully! Total jobs: ${data.length}`);
    setIsDropdownOpen(false);
  };

  const menuItems = [
    {
      key: "edit",
      label: (
        <div className="flex items-center gap-2 py-1">
          <PencilIcon className="w-4 h-4" />
          <span>Edit Name</span>
        </div>
      ),
      onClick: () => {
        handleOpenEditModal();
        setIsDropdownOpen(false);
      },
    },
    {
      key: "score",
      label: (
        <div className="flex items-center gap-2 py-1">
          <PlayCircle className="w-4 h-4" />
          <span>Score All</span>
        </div>
      ),
      onClick: handleScoreAll,
    },
  ];

  return (
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
          <Dropdown
            menu={{
              items: menuItems,
              className: "min-w-[160px]",
            }}
            trigger={["click"]}
            open={isDropdownOpen}
            onOpenChange={setIsDropdownOpen}
            placement="bottomRight"
          >
            <button
              type="button"
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              title="More options"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </Dropdown>
        </div>
      </div>
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
