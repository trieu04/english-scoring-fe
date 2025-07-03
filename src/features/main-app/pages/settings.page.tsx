import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { Pane } from "@/components/ui/pane";
import { cn } from "@/lib/utils";
import { apiService } from "@/services/api.service";
import { IPagination } from "@/types/interfaces/pagination";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { notification } from "antd";
import clsx from "clsx";
import { MicIcon, PencilIcon, PlusIcon, SpeakerIcon } from "lucide-react";
import { useMemo, useState } from "react";

interface ScoringSystem {
  id: string;
  name: string;
  writingTaskFactors: number[];
  speakingTaskFactors: number[];
}

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

function getTaskTextColorClass(number: number) {
  const taskColors = [
    "text-t1",
    "text-t2",
    "text-t3",
    "text-t4",
  ];

  return taskColors[number % taskColors.length];
}

function getTaskBgColorClass(number: number) {
  const taskBgColors = [
    "bg-t1bg",
    "bg-t2bg",
    "bg-t3bg",
    "bg-t4bg",
  ];

  return taskBgColors[number % taskBgColors.length];
}

function TasksRow({
  label,
  icon,
  taskFactors,
  className = "",
}: {
  label: string;
  icon: React.ReactNode;
  taskFactors: number[];
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-4 rounded-xl p-6", className)}>
      <div className="flex flex-col justify-center items-center gap-2 min-w-[140px]">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg border">
          {icon}
        </div>
        <span className="font-semibold text-lg">{label}</span>
      </div>
      <span className="ml-2 text-base font-medium text-gray-700">Overall</span>
      <span className="mx-2 text-2xl font-light text-gray-400">=</span>
      <div className="flex gap-4 flex-1">
        {taskFactors.map((taskFactor, idx) => (
          <div
            key={idx}
            className={cn(
              "flex flex-col items-center min-w-[100px] px-4 py-3 rounded-lg border text-center",
              idx > 0 && "ml-2",
              getTaskBgColorClass(idx),
            )}
          >
            <div className={clsx("text-base font-semibold", getTaskTextColorClass(idx))}>{`Task ${idx}`}</div>
            <div className="mt-2">{taskFactor}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SettingsPage() {
  const navigate = useNavigate();
  const listScoringSystemQuery = useQuery({
    queryKey: ["listScoringSystem"],
    queryFn: () => {
      return apiService.get<IPagination<ScoringSystem>>("/scoring-systems", {
        params: {
          limit: 1000,
        },
      });
    },
  });

  interface ScoringSystemRecord {
    key: string;
    label: string;
    writingTaskFactors: number[];
    speakingTaskFactors: number[];
  }

  const scoringSystemData = useMemo<ScoringSystemRecord[]>(() => {
    const blankData = [] as ScoringSystemRecord[];
    const defaultTaskFactors = [1, 1, 1];

    const { isError, isSuccess, data } = listScoringSystemQuery;
    if (isError) {
      notification.error({
        message: "Failed to load scoring systems",
        description: listScoringSystemQuery.error.message,
      });
    }

    if (isSuccess) {
      return data.data.map((item, idx) => ({
        key: item.id,
        label: item.name,
        writingTaskFactors: item.writingTaskFactors || defaultTaskFactors,
        speakingTaskFactors: item.speakingTaskFactors || defaultTaskFactors,
      }));
    }

    return blankData;
  }, [listScoringSystemQuery]);

  return (
    <Pane title="Scoring systems">
      <div className="flex flex-col gap-8">
        {scoringSystemData.map((item, idx) => (
          <div
            key={item.key}
            className={cn(`border rounded-2xl p-4`, "border-gray-200", idx === 0 && "border-vstep", idx === 1 && "border-other")}
          >
            <div className="mb-4 mt-2">
              <span className={cn("px-4 py-2 rounded-md text-base text-white font-semibold", "bg-gray-200", idx === 0 && "bg-vstep", idx === 1 && "bg-other")}>
                {item.label}
              </span>
            </div>
            <div className="flex flex-col gap-6">
              <TasksRow
                label="Writing"
                icon={<PencilIcon className="text-vstep" />}
                taskFactors={item.writingTaskFactors}
                className={cn(
                  "bg-gray-100",
                  idx === 0 && "bg-[#F3FDFF]",
                  idx === 1 && "bg-[#F5F8FF]",
                )}
              />
              <TasksRow
                label="Speaking"
                icon={<MicIcon className="text-vstep" />}
                taskFactors={item.speakingTaskFactors}
                className={cn(
                  "bg-gray-100",
                  idx === 0 && "bg-[#F3FDFF]",
                  idx === 1 && "bg-[#F5F8FF]",
                )}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-8">

        <Button
          onClick={() => { navigate({ to: "/settings/new-scoring-system" }); }}
          className="rounded-full px-6 py-2 bg-[#3881A2] text-white flex items-center gap-2 text-base font-semibold shadow-md hover:bg-[#2d6b8a]"
        >
          <>
            <PlusIcon className="w-5 h-5 text-white" />
            New Scoring system
          </>
        </Button>
      </div>
    </Pane>
  );
}
