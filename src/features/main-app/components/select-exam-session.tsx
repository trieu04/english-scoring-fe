import { Input } from "@/components/ui/input";
import { apiService } from "@/services/api.service";
import { PaginatedResult } from "@/types/interfaces/pagination";
import { useQuery } from "@tanstack/react-query";
import { ConfigProvider, Select } from "antd";
import { useEffect, useState } from "react";
import { ExamSession } from "../pages/history.page";

export function SelectExamSession({
  onNewExamSessionNameChange,
  onSelectExamSessionChange,
}: {
  onNewExamSessionNameChange: (value: string) => void;
  onSelectExamSessionChange: (value: string) => void;
}) {
  const [selectedExamSession, setSelectedExamSession] = useState<string>("new");
  const [newExamSessionName, setNewExamSessionName] = useState("");
  useEffect(() => {
    onSelectExamSessionChange(selectedExamSession);
  }, [selectedExamSession, onSelectExamSessionChange]);
  useEffect(() => {
    onNewExamSessionNameChange(newExamSessionName);
  }, [newExamSessionName, onNewExamSessionNameChange]);

  const examSessionsQuery = useQuery({
    queryKey: ["/exam-session"],
    queryFn: async () => {
      const response = apiService.get<PaginatedResult<ExamSession>>("/exam-session");
      return response;
    },
  });

  return (
    <div className="mx-auto">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Exam Session
      </label>
      <ConfigProvider theme={{ components: { Select: { fontSize: 13 } } }}>

        <Select
          style={{
            fontSize: 10,
          }}
          className="w-full"
          placeholder="Select an exam session or create new"
          value={selectedExamSession}
          onChange={(value) => { setSelectedExamSession(value); }}
          loading={examSessionsQuery.isLoading}
          options={[
            {
              label: "➕ Create New",
              value: "new",
            },
            ...(examSessionsQuery.data?.data.map(session => ({
              label: session.name,
              value: session.id,
            })) ?? []),
          ]}
        />
      </ConfigProvider>
      {selectedExamSession === "new" && (
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <Input
            placeholder="Enter exam session name"
            value={newExamSessionName}
            onChange={e => setNewExamSessionName(e.target.value)}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}
