import { Button } from "@/components/ui/button";
import { MicIcon, PencilIcon, PlusIcon } from "lucide-react";
import React from "react";


const scoringSystems = [
  {
    key: "vstep",
    label: "Vstep",
    color: "bg-[#3ec6f2] text-white",
    box: "bg-[#eafaff] border-[#3ec6f2] text-[#3ec6f2]",
    rows: [
      {
        icon: <PencilIcon className="w-7 h-7 text-[#3ec6f2]" />,
        label: "Writing",
      },
      {
        icon: <MicIcon className="w-7 h-7 text-[#3ec6f2]" />,
        label: "Speaking",
      },
    ],
  },
  {
    key: "custom",
    label: "My_custom",
    color: "bg-[#6c7cf3] text-white",
    box: "bg-[#f2f4ff] border-[#6c7cf3] text-[#6c7cf3]",
    rows: [
      {
        icon: <PencilIcon className="w-7 h-7 text-[#6c7cf3]" />,
        label: "Writing",
      },
      {
        icon: <MicIcon className="w-7 h-7 text-[#6c7cf3]" />,
        label: "Speaking",
      },
    ],
  },
];

const tasks = [
  { label: "Task 1", value: 0.25, color: "bg-cyan-50 border-cyan-200 text-cyan-600" },
  { label: "Task 2", value: 0.4, color: "bg-pink-50 border-pink-200 text-pink-600" },
  { label: "Task 3", value: 0.35, color: "bg-orange-50 border-orange-200 text-orange-600" },
  { label: "Task 4", value: 0.35, color: "bg-purple-50 border-purple-200 text-purple-600" },
];

export function SettingsPage() {
  return (
    <div className="p-8 bg-[#f7f9fa] min-h-full relative">
      <div className="text-3xl font-bold mb-8">Scoring system</div>
      <div className="flex flex-col gap-8">
        {scoringSystems.map((sys, i) => (
          <div
            key={sys.key}
            className={`border-2 rounded-2xl p-4 ${
              i === 0 ? "border-[#3ec6f2] bg-[#f7fdff]" : "border-[#6c7cf3] bg-[#f7f9fa]"
            }`}
          >
            <div className="mb-4">
              <span className={`px-4 py-1 rounded-lg text-base font-semibold ${sys.color}`}>
                {sys.label}
              </span>
            </div>
  
            <div className="flex flex-col gap-6">
              {sys.rows.map((row, idx) => (
                <div
                key={row.label}
                className="flex items-center bg-white rounded-xl p-3 shadow-sm border border-transparent w-full"
              >
                {/* Icon + Label */}
                <div className="flex flex-col items-center justify-center flex-[1]">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#f7f9fa] border border-[#eaf6fb] mb-2">
                    {row.icon}
                  </div>
                  <span className="font-semibold text-lg text-center">{row.label}</span>
                </div>
              
                {/* Overall */}
                <div className="flex-[1] text-center">
                  <span className="text-base font-medium text-gray-700">Overall</span>
                </div>
              
                {/* Dấu "=" */}
                <div className="flex-[0.5] text-center">
                  <span className="text-2xl font-light text-gray-400">=</span>
                </div>
              
                {/* Tasks */}
                <div className="flex flex-[5] items-center justify-between">
                  {tasks.map((task, tIdx) => (
                    <React.Fragment key={task.label}>
                      <div
                        className={`flex flex-col items-center justify-center w-full max-w-[100px] aspect-square rounded-lg border text-center ${task.color}`}
                      >
                        <span className="text-base font-semibold">{task.label}</span>
                        <span className="text-lg font-bold">{task.value}</span>
                      </div>
                      {tIdx < tasks.length - 1 && (
                        <span className="text-xl text-gray-500 font-light mx-1">+</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              
              ))}
            </div>
          </div>
        ))}
      </div>
  
      {/* Nút thêm hệ thống chấm điểm */}
      <div className="flex justify-end mt-8">
        <Button className="rounded-full px-6 py-2 bg-[#3881A2] text-white flex items-center gap-2 text-base font-semibold shadow-md hover:bg-[#2d6b8a]">
          <PlusIcon className="w-5 h-5 text-white" />
          New Scoring system
        </Button>
      </div>
    </div>
  );
  
}
