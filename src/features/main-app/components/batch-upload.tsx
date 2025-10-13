import { Button } from "@/components/ui/button";
import { setFullHeightFromTop } from "@/lib/utils";
import { apiService } from "@/services/api.service";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { notification, Spin } from "antd";
import clsx from "clsx";
import { FileIcon, FileUpIcon, FolderOpen, UploadCloudIcon, XIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { SelectExamSession } from "./select-exam-session";

export function BatchUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

  const [selectedExamSession, setSelectedExamSession] = useState<string>("");
  const [newExamSessionName, setNewExamSessionName] = useState("");

  const { scoringSystem } = useSearch({ from: "/main-app/upload" });
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) {
      return;
    }

    // Validate exam session selection
    if (!selectedExamSession) {
      notification.error({
        message: "Exam Session Required",
        description: "Please select an exam session or create a new one.",
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("scoringSystemId", scoringSystem as string);

      // Add exam session information
      if (selectedExamSession === "new") {
        if (!newExamSessionName.trim()) {
          formData.append("name", newExamSessionName.trim());
        }
      }
      else {
        formData.append("examSessionId", selectedExamSession);
      }

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
    <div
      className="overflow-auto pb-16"
      ref={setFullHeightFromTop}
    >
      <div className="max-w-6xl mx-auto mt-2">
        <SelectExamSession
          onNewExamSessionNameChange={setNewExamSessionName}
          onSelectExamSessionChange={setSelectedExamSession}
        />
      </div>
      <div
        {...getRootProps()}
        className={clsx(
          "border-2 border-dashed border-teal-600 rounded-xl p-10 text-center bg-blue-50 max-w-6xl mx-auto mt-6",
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
