import Illustrations from "@/components/illustrations";
import { Button } from "@/components/ui/button";
import { setFullHeightFromTop } from "@/lib/utils";
import { apiService } from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { notification, Spin, Tabs } from "antd";
import clsx from "clsx";
import { FileIcon, FileUpIcon, FolderOpen, TrashIcon, UploadCloudIcon, UploadIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";

export function UploadPage() {
  return (
    <div className="h-full px-4">
      <div className="bg-white p-4 rounded-xl h-full">
        <Tabs
          className=""
          items={[
            {
              label: "File Scoring",
              key: "file",
              children: FileScoring(),
            },
            {
              label: "Batch Scoring",
              key: "batch",
              children: BatchScoring(),
            },
          ]}
        />
      </div>
    </div>
  );
}

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

function FileScoring() {
  const [uploading, setUploading] = useState(false);
  const { scoringSystem } = useSearch({ from: "/main-app/upload" });

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
    setUploading(true);
    const formData = new FormData();

    formData.append("scoringSystemId", getScoringSystemQuery.data?.id ?? "");

    // Loop through each item in the data array
    speakingTasks.forEach((item, index) => {
      formData.append(`speakingTasks[${index}][no]`, String(item.no));
      formData.append(`speakingTasks[${index}][taskType]`, item.taskType);
      formData.append(`speakingTasks[${index}][questionText]`, item.questionText || "");
      formData.append(`speakingTasks[${index}][answerText]`, item.answerText || "");

      if (item.answerFile instanceof File) {
        formData.append(`speakingTasks[${index}][answerFile]`, item.answerFile);
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
        <div className="mb-4 p-3 bg-white rounded-lg flex items-center border border-gray-300">
          {task.questionFile
            ? (
                <>
                  <div className="flex grow items-center space-x-2 mr-4">
                    <Illustrations.TrashIllustration />
                    <div className="flex flex-col">
                      <div className="">
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
                    className="w-full p-2 border rounded border-gray-300"
                    rows={2}
                    placeholder="Type your answer..."
                    value={task.questionText}
                    onChange={(e) => {
                      task.questionText = e.target.value;
                      setRefresh(prev => prev + 1);
                    }}
                  />
                  <label htmlFor={`upload-question-${task.taskType}-${task.no}`} className="cursor-pointer p-4 flex items-center">
                    <UploadIcon />
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
        <div className="p-3 min-h-24 bg-white rounded-lg flex items-center justify-center border border-gray-300">
          {task.answerFile
            ? (
                <>
                  <div className="flex grow items-center space-x-2 mr-4">
                    <Illustrations.TrashIllustration />
                    <div className="flex flex-col">
                      <div className="">
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
                          className="w-full p-2 border rounded border-gray-300"
                          rows={2}
                          placeholder="Type your answer..."
                          value={task.answerText}
                          onChange={(e) => {
                            task.answerText = e.target.value;
                            setRefresh(prev => prev + 1);
                          }}
                        />
                        <label htmlFor={`upload-answer-${task.taskType}-${task.no}`} className="cursor-pointer py-6 px-4 flex items-center">
                          <UploadIcon />
                        </label>
                      </>
                    )}
                  {task.taskType === "speaking"
                    && (
                      <label htmlFor={`upload-answer-${task.taskType}-${task.no}`} className="cursor-pointer py-6 px-4 flex items-center justify-center">
                        <UploadIcon />
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
      <div
        className="flex flex-col md:flex-row gap-16 p-6 "
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
      <div className="p-8 flex justify-end mb-4">
        <Button
          className=""
          size="lg"
          disabled={uploading}
          onClick={handleUpload}
        >
          Upload
        </Button>
      </div>
    </div>
  );
}

function BatchScoring() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

  const { scoringSystem } = useSearch({ from: "/main-app/upload" });
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) {
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("scoringSystemId", scoringSystem as string);

      const response = await apiService.post<{
        examSession: { id: string };
        exams: { id: string }[];
      }>("/exam-session/upload-zip", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadPercent(percent);
          }
        },
      });
      navigate({
        to: "/scoring",
        search: {
          examSessionId: response.examSession.id,
          examId: response.exams[0]?.id,
        },
      });
    }
    catch (error) {
      console.error("Upload failed:", error);
      notification.error({
        message: "Upload failed",
        description: "An error occurred while uploading the file.",
      });
    }
    finally {
      setUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFile(file);

      // Handle file upload logic here
      const reader = new FileReader();
      reader.onload = () => {
        // console.log("File content:", reader.result);
      };
      reader.readAsText(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    multiple: false,
  });

  return (
    <div className="mt-8">

      <div
        {...getRootProps()}
        className={clsx(
          "border-2 border-dashed border-teal-600 rounded-xl p-10 text-center bg-blue-50 max-w-6xl mx-auto",
          isDragActive && "bg-blue-100",
        )}
      >
        <input {...getInputProps()} />
        <div className="flex justify-center">
          <UploadCloudIcon className="text-4xl text-teal-600 mb-2" />
        </div>
        {uploading && (
          <Spin percent={uploadPercent} size="large" />
        )}
        <p className="text-teal-700 font-semibold mb-4">Upload source</p>
        {file === null && (
          <>
            <p className="text-gray-600">Choose a file or Drag and drop it here</p>
            <div className="mt-4">
              <Button
                size="lg"
                onClick={open}
                variant="link"
              >
                <FolderOpen />
                Browse
              </Button>
            </div>
          </>
        )}

        {file && (
          <div>
            <p className="text-sm text-gray-700">
              Selected file:
              {" "}
              <strong>{file.name}</strong>
              {" "}
              <XIcon className="cursor-pointer text-red-400 inline" onClick={() => setFile(null)} />
            </p>
            <Button
              className="mt-4"
              size="lg"
              disabled={!file || uploading}
              onClick={handleUpload}
            >
              <FileUpIcon />
              Upload
            </Button>
          </div>
        )}
      </div>
      <div className="mt-8 max-w-6xl mx-auto">
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-normal mb-4 flex items-center">
            <FileIcon className="mr-2" />
            ZIP File Structure Instructions
          </h3>
          <div className="text-sm  space-y-4">
            <p className="font-medium">Please organize your ZIP file with the following structure:</p>
            <div className="bg-white border border-main rounded p-4 font-mono text-xs overflow-x-auto">
              <div className="whitespace-pre">
                {`file-name.zip
├── student-name-1/
│   ├── speaking/
│   │   ├── part 1.mp3
│   │   ├── part 2.mp3
│   │   └── part 3.mp3
│   └── writing/
│       ├── task 1.docx
│       ├── task 2.docx
│       └── task 3.docx
├── student-name-2/
│   ├── speaking/
│   │   ├── part 1.mp3
│   │   ├── part 2.mp3
│   │   └── part 3.mp3
│   └── writing/
│       ├── task 1.docx
│       ├── task 2.docx
│       └── task 3.docx
└── student-name-3/
    ├── speaking/
    │   ├── part 1.mp3
    │   ├── part 2.mp3
    │   └── part 3.mp3
    └── writing/
        ├── task 1.docx
        ├── task 2.docx
        └── task 3.docx`}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium ">Important Notes:</h4>
              <ul className="list-disc list-inside space-y-1 ">
                <li>Each student should have their own folder named with their full name</li>
                <li>
                  Each student folder must contain exactly two subfolders:
                  <code className="bg-blue-100 px-1 rounded">speaking</code>
                  {" "}
                  and
                  <code className="bg-blue-100 px-1 rounded">writing</code>
                </li>
                <li>
                  Speaking files should be named as:
                  <code className="bg-blue-100 px-1 rounded">part 1.mp3</code>
                  ,
                  <code className="bg-blue-100 px-1 rounded">part 2.mp3</code>
                  ,
                  <code className="bg-blue-100 px-1 rounded">part 3.mp3</code>
                </li>
                <li>
                  Writing files should be named as:
                  <code className="bg-blue-100 px-1 rounded">task 1.docx</code>
                  ,
                  <code className="bg-blue-100 px-1 rounded">task 2.docx</code>
                  ,
                  <code className="bg-blue-100 px-1 rounded">task 3.docx</code>
                </li>
                <li>File names are case-sensitive and must match exactly as shown</li>
                <li>Supported audio formats: .mp3, .wav, .m4a</li>
                <li>Supported document formats: .docx, .doc, .pdf, .txt</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
