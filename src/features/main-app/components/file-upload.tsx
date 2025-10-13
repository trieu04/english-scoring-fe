import { Button } from "@/components/ui/button";
import { setFullHeightFromTop } from "@/lib/utils";
import { apiService } from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { notification } from "antd";
import { FilePlusIcon, FileTextIcon, TrashIcon, UploadIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SelectExamSession } from "./select-exam-session";

interface ITask {
  no: number;
  taskType: "writing" | "speaking";
  questionText?: string;
  questionFileInputRef?: React.RefObject<HTMLInputElement>;
  questionFile?: File;
  answerText?: string;
  answerFileInputRef?: React.RefObject<HTMLInputElement>;
  answerFile?: File;
};

export function FileUpload() {
  const [uploading, setUploading] = useState(false);
  const { scoringSystem } = useSearch({ from: "/main-app/upload" });
  const [selectedExamSession, setSelectedExamSession] = useState<string | null>(null);
  const [newExamSessionName, setNewExamSessionName] = useState("");

  const getScoringSystemQuery = useQuery({
    queryKey: ["/scoring-system/{scoringSystem}", { scoringSystem }],
    queryFn: async () => {
      const response = await apiService.get<{
        id: string;
        createdAt: string;
        updatedAt: string;
        userId: string | null;
        name: string;
        description: string | null;
        speakingTaskFactors: number[];
        writingTaskFactors: number[];
      }>(`/scoring-system/${scoringSystem}`);
      return response;
    },
    enabled: !!scoringSystem,
  });

  const writingTask = useMemo(
    () => getScoringSystemQuery.data?.writingTaskFactors ?? [],
    [getScoringSystemQuery.data?.writingTaskFactors],
  );
  const speakingTask = useMemo(
    () => getScoringSystemQuery.data?.speakingTaskFactors ?? [],
    [getScoringSystemQuery.data?.speakingTaskFactors],
  );

  const navigate = useNavigate();
  const [writingTasks, setWritingTask] = useState<ITask[]>([]);
  const [speakingTasks, setSpeakingTask] = useState<ITask[]>([]);
  const [, setRefresh] = useState(0);
  useEffect(() => {
    if (!getScoringSystemQuery.data)
      return;

    const newWritingTasks: ITask[] = writingTask.map((_, index) => ({
      no: index + 1,
      taskType: "writing",
      questionText: "",
      answerText: "",
    }));
    setWritingTask(newWritingTasks);

    const newSpeakingTasks: ITask[] = speakingTask.map((_, index) => ({
      no: index + 1,
      taskType: "speaking",
      questionText: "",
      answerText: "",
    }));

    setSpeakingTask(newSpeakingTasks);
  }, [writingTask, speakingTask, getScoringSystemQuery.data]);

  const handleUpload = async () => {
    // Validate exam session selection
    if (!selectedExamSession) {
      notification.error({
        message: "Exam Session Required",
        description: "Please select an exam session or create a new one.",
      });
      return;
    }

    setUploading(true);
    const formData = new FormData();

    formData.append("scoringSystemId", getScoringSystemQuery.data?.id ?? "");

    // Add exam session information
    if (selectedExamSession === "new") {
      if (newExamSessionName.trim() !== "") {
        formData.append("name", newExamSessionName.trim());
      }
    }
    else {
      formData.append("examSessionId", selectedExamSession);
    }

    // Loop through each item in the data array
    speakingTasks.forEach((item, index) => {
      formData.append(`speakingTasks[${index}][no]`, String(item.no));
      formData.append(`speakingTasks[${index}][taskType]`, item.taskType);
      formData.append(`speakingTasks[${index}][questionText]`, item.questionText || "");
      formData.append(`speakingTasks[${index}][answerText]`, item.answerText || "");

      if (item.answerFile instanceof File) {
        formData.append(`speakingTasks[${index}][answerFile]`, item.answerFile);
      }
      if (item.questionFile instanceof File) {
        formData.append(`speakingTasks[${index}][questionFile]`, item.questionFile);
      }
    });

    writingTasks.forEach((item, index) => {
      formData.append(`writingTasks[${index}][no]`, String(item.no));
      formData.append(`writingTasks[${index}][taskType]`, item.taskType);
      formData.append(`writingTasks[${index}][questionText]`, item.questionText || "");
      formData.append(`writingTasks[${index}][answerText]`, item.answerText || "");

      if (item.answerFile instanceof File) {
        formData.append(`writingTasks[${index}][answerFile]`, item.answerFile);
      }
      if (item.questionFile instanceof File) {
        formData.append(`writingTasks[${index}][questionFile]`, item.questionFile);
      }
    });

    try {
      const response = await apiService.post<{
        examSession: { id: string };
        exam: { id: string };
      }>("/exam-session", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate({
        to: "/scoring",
        search: {
          examSessionId: response.examSession.id,
          examId: response.exam.id,
        },
      });
    }
    catch (error) {
      console.error("Upload failed:", error);
      notification.error({
        message: "Upload Failed",
        description: "An error occurred while uploading. Please try again.",
      });
    }
    setUploading(false);
  };

  const renderTasks = (tasks: ITask[], section: "writing" | "speaking") =>
    tasks.map(task => (
      <div
        key={task.taskType + task.no}
        className={`border-1 rounded-xl p-4 mb-6 ${section === "writing" ? "border-[#3881A2]" : "border-[#FF9500]"
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">
            {section === "writing" && "Task"}
            {section === "speaking" && "Part"}
            &nbsp;
            {task.no}
          </h3>
        </div>
        <p className="mb-2">Question</p>
        <div className="mb-4 p-2 bg-white rounded-lg flex items-center border border-gray-300">
          {task.questionFile
            ? (
                <>
                  <div className="flex grow items-center space-x-2 mr-4 py-1">
                    <FileTextIcon className="size-8 text-neutral-600" />
                    <div className="flex flex-col">
                      <div className="font-bold">
                        {task.questionFile.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {`${(task.questionFile.size / 1024).toFixed(2)} KB`}
                      </div>
                    </div>
                  </div>
                  <div
                    className="cursor-pointer p-2"
                    onClick={() => {
                      task.questionFile = undefined;
                      if (task.questionFileInputRef?.current)
                        task.questionFileInputRef.current.value = "";
                      setRefresh(prev => prev + 1);
                    }}
                  >
                    <TrashIcon />
                  </div>
                </>
              )
            : (
                <>
                  <textarea
                    className="w-full p-1 border rounded border-gray-300"
                    rows={2}
                    placeholder="Question text (optional)"
                    value={task.questionText}
                    onChange={(e) => {
                      task.questionText = e.target.value;
                      setRefresh(prev => prev + 1);
                    }}
                  />
                  <label htmlFor={`upload-question-${task.taskType}-${task.no}`} className="cursor-pointer p-4 flex items-center">
                    <FilePlusIcon />
                  </label>
                </>
              )}
          <input
            placeholder="Upload your file"
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file)
                return;
              task.questionFile = file;
              setRefresh(prev => prev + 1);
            }}
            hidden
            id={`upload-question-${task.taskType}-${task.no}`}
          />
        </div>
        <p className="mb-2">
          {section === "writing" && "Answer"}
          {section === "speaking" && "Your Recording"}
        </p>
        <div className="p-2 bg-white rounded-lg flex items-center justify-center border border-gray-300">
          {task.answerFile
            ? (
                <>
                  <div className="flex grow items-center space-x-2 mr-4 py-1">
                    <FileTextIcon className="size-8 text-neutral-600" />
                    <div className="flex flex-col">
                      <div className="font-bold">
                        {task.answerFile.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {`${(task.answerFile.size / 1024).toFixed(2)} KB`}
                      </div>
                    </div>
                  </div>
                  <div
                    className="cursor-pointer p-2"
                    onClick={() => {
                      task.answerFile = undefined;
                      if (task.answerFileInputRef?.current)
                        task.answerFileInputRef.current.value = "";
                      setRefresh(prev => prev + 1);
                    }}
                  >
                    <TrashIcon />
                  </div>
                </>
              )
            : (
                <>
                  {task.taskType === "writing"
                    && (
                      <>
                        <textarea
                          className="w-full p-1 border rounded border-gray-300"
                          rows={2}
                          placeholder="Type your answer..."
                          value={task.answerText}
                          onChange={(e) => {
                            task.answerText = e.target.value;
                            setRefresh(prev => prev + 1);
                          }}
                        />
                        <label htmlFor={`upload-answer-${task.taskType}-${task.no}`} className="cursor-pointer px-4 flex items-center">
                          <FilePlusIcon />
                        </label>
                      </>
                    )}
                  {task.taskType === "speaking"
                    && (
                      <label htmlFor={`upload-answer-${task.taskType}-${task.no}`} className="cursor-pointer py-4 px-4 flex items-center justify-center">
                        <FilePlusIcon />
                      </label>
                    )}

                </>
              )}
          <input
            placeholder="Upload your file"
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file)
                return;
              task.answerFile = file;
              setRefresh(prev => prev + 1);
            }}
            hidden
            id={`upload-answer-${task.taskType}-${task.no}`}
          />
        </div>
      </div>
    ));

  return (
    <div
      className="overflow-auto"
      ref={setFullHeightFromTop}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mt-2">
          <SelectExamSession
            onNewExamSessionNameChange={setNewExamSessionName}
            onSelectExamSessionChange={setSelectedExamSession}
          />
        </div>
        <div
          className="flex flex-col md:flex-row gap-16 py-6"
        >
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-bold text-[#3881A2] mb-4 text-center">Writing</h2>
            {renderTasks(writingTasks, "writing")}
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-bold text-[#FF9500] mb-4 text-center">Speaking</h2>
            {renderTasks(speakingTasks, "speaking")}
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            className=""
            size="lg"
            disabled={uploading}
            onClick={handleUpload}
          >
            <UploadIcon />
            Upload
          </Button>
        </div>
        <div className="py-16"></div>
      </div>
    </div>
  );
}
