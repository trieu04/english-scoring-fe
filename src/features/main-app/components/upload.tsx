import React, { useState } from "react";
import { Upload, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";

interface ComponentProps {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
}

export function UploadPopup({ isOpen, setIsOpen }: ComponentProps) {
  const [_fileList, setFileList] = useState<UploadFile[]>([]);

  const _handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };
  const handleOk = () => {
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Modal
        title="Upload Files"
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Upload"
      >
        <div className="flex">
          <div className="flex flex-col space-y-2 mr-4 w-1/2">
            <h3>Writing</h3>
            <div className="rounded-lg p-2 h-18 bg-dscl-line">
              <Upload className="w-full h-full" maxCount={1}>
                <div className="flex items-center space-x-2">
                  <label className="">Task 1</label>
                  <span className="px-4 border-1 border-dscl-grey1 rounded-md cursor-pointer"><UploadOutlined /></span>
                </div>
              </Upload>
            </div>
            <div className="rounded-lg p-2 h-18 bg-dscl-line">
              <Upload className="w-full h-full" maxCount={1}>
                <div className="flex items-center space-x-2">
                  <label className="">Task 2</label>
                  <span className="px-4 border-1 border-dscl-grey1 rounded-md cursor-pointer"><UploadOutlined /></span>
                </div>
              </Upload>
            </div>
            <div className="rounded-lg p-2 h-18 bg-dscl-line">
              <Upload className="w-full h-full" maxCount={1}>
                <div className="flex items-center space-x-2">
                  <label className="">Task 3</label>
                  <span className="px-4 border-1 border-dscl-grey1 rounded-md cursor-pointer"><UploadOutlined /></span>
                </div>
              </Upload>
            </div>
          </div>
          <div className="flex flex-col space-y-2 mr-4 w-1/2">
            <h3>Speaking</h3>
            <div className="rounded-lg p-2 bg-dscl-line h-full">
              <Upload className="w-full h-full" maxCount={1}>
                <div className="flex items-center space-x-2">
                  <label className="">Speak</label>
                  <span className="px-4 border-1 border-dscl-grey1 rounded-md cursor-pointer"><UploadOutlined /></span>
                </div>
              </Upload>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
