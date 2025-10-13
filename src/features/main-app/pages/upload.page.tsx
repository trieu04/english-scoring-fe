import { Tabs } from "antd";
import { BatchUpload } from "../components/batch-upload";
import { FileUpload } from "../components/file-upload";

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
              children: <FileUpload />,
            },
            {
              label: "Batch Scoring",
              key: "batch",
              children: <BatchUpload />,
            },
          ]}
        />
      </div>
    </div>
  );
}
