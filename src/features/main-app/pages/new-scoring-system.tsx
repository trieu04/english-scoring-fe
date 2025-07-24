import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pane } from "@/components/ui/pane";
import { handleApiError } from "@/lib/error-handle";
import { cn } from "@/lib/utils";
import { apiService } from "@/services/api.service";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { notification } from "antd";
import clsx from "clsx";
import { MicIcon, PencilIcon } from "lucide-react";
import { useState } from "react";

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
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  taskFactors: number[];
  className?: string;
  onChange: (index: number, value: number) => void;
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
            <div className="mt-2">
              <Input
                type="number"
                value={taskFactor}
                onChange={e => onChange(idx, Number(e.target.value))}
                className="w-20 text-center shadow-none appearance-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NewScoringSystemPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [numberOfWritingTasks, setNumberOfWritingTasks] = useState(3);
  const [numberOfSpeakingTasks, setNumberOfSpeakingTasks] = useState(3);

  const [writingTaskFactors, setWritingTaskFactors] = useState<number[]>(Array.from<number>({ length: numberOfWritingTasks }).fill(0));
  const [speakingTaskFactors, setSpeakingTaskFactors] = useState<number[]>(Array.from<number>({ length: numberOfSpeakingTasks }).fill(0));

  const handleNumberOfWritingTasksChange = (value: number) => {
    const newFactors = Array.from<number>({ length: value }).map((_, idx) =>
      writingTaskFactors[idx] !== undefined ? writingTaskFactors[idx] : 0,
    );
    setWritingTaskFactors(newFactors);
    setNumberOfWritingTasks(value);
  };

  const handleNumberOfSpeakingTasksChange = (value: number) => {
    const newFactors = Array.from<number>({ length: value }).map((_, idx) =>
      speakingTaskFactors[idx] !== undefined ? speakingTaskFactors[idx] : 0,
    );
    setSpeakingTaskFactors(newFactors);
    setNumberOfSpeakingTasks(value);
  };

  const handleWritingTaskFactorChange = (index: number, value: number) => {
    const newFactors = [...writingTaskFactors];
    newFactors[index] = value;
    setWritingTaskFactors(newFactors);
  };

  const handleSpeakingTaskFactorChange = (index: number, value: number) => {
    const newFactors = [...speakingTaskFactors];
    newFactors[index] = value;
    setSpeakingTaskFactors(newFactors);
  };

  const [formData, setFormData] = useState({
    name: "New Scoring System",
    writingTaskFactors,
    speakingTaskFactors,
  });

  const handleCreateScoringSystem = async () => {
    try {
      await apiService.post("/scoring-system", {
        ...formData,
        writingTaskFactors,
        speakingTaskFactors,
      });
      notification.success({
        message: "Scoring system created successfully",
      });
      await queryClient.invalidateQueries({ queryKey: ["/scoring-system"] });
      navigate({ to: "/settings" });
    }
    catch (error) {
      handleApiError(error, {
        customMessage: "Failed to create scoring system",
      });
    }
  };

  return (
    <Pane title="New Scoring System">
      <div className="flex flex-col gap-8">
        <div>
          <label>Name</label>
          <Input
            type="text"
            placeholder="Enter scoring system name"
            className="max-w-sm"
            defaultValue="New Scoring System"
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <div className="mb-4 mt-2">
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <label>Number of Writing Tasks</label>
              <Input
                type="number"
                value={numberOfWritingTasks}
                onChange={e => handleNumberOfWritingTasksChange(Number(e.target.value))}
                className="max-w-sm"
              />
            </div>
            <TasksRow
              label="Writing"
              icon={<PencilIcon className="text-vstep" />}
              taskFactors={writingTaskFactors}
              onChange={handleWritingTaskFactorChange}
              className={cn("bg-[#F3FDFF]")}
            />
            <div>
              <label>Number of Speaking Tasks</label>
              <Input
                type="number"
                value={numberOfSpeakingTasks}
                onChange={e => handleNumberOfSpeakingTasksChange(Number(e.target.value))}
                className=" max-w-sm"
              />
            </div>
            <TasksRow
              label="Speaking"
              icon={<MicIcon className="text-vstep" />}
              taskFactors={speakingTaskFactors}
              onChange={handleSpeakingTaskFactorChange}
              className={cn("bg-[#F3FDFF]")}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-8 gap-4">

        <Button
          variant="outline"
          onClick={() => { navigate({ to: "/settings" }); }}
        >
          <>
            Cancel
          </>
        </Button>
        <Button
          onClick={() => { handleCreateScoringSystem(); }}
        >
          <>
            Create Scoring System
          </>
        </Button>
      </div>
    </Pane>
  );
}
