import { cn } from "@/lib/utils";
import { Popover, Slider } from "antd";
import Icons from "../icons";
import { format, set } from "date-fns";
import { useEffect, useState } from "react";

function formatDuration(seconds: number) {
  const date = new Date(seconds * 1000);
  return format(date, "mm:ss");
};

export function SoundPlayer({
  currentTime,
  totalTime,
  onChange,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  currentTime: number;
  totalTime: number;
  onChange?: (value: number) => void;
}) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    setValue(currentTime);
  }, []);
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "bg-dscl-second text-black flex items-center space-x-2 rounded-xl p-6",
        className,
      )}
      {...props}
    >
      <div className="rounded-full bg-dscl-main p-4 cursor-pointer">
        <Icons.PlayIcon className="stroke-dscl-white" />
      </div>
      <div className="grow flex flex-col space-y-1">
        <Slider
          className="grow"
          onChange={v => setValue(v)}
          max={totalTime}
          value={value}
          tooltip={{ formatter: v => formatDuration(Number(v)) }}
        />
        <div className="flex justify-between">
          <span>{formatDuration(value)}</span>
          <span>{formatDuration(totalTime)}</span>
        </div>

      </div>
      <Popover
        content={(
          <div>
            <a>Download</a>
          </div>
        )}
        title="Options"
        trigger="click"
        open={open}
        onOpenChange={(newOpen) => { setOpen(newOpen); }}
      >
        <div className="cursor-pointer">
          <Icons.MoreVerticalIcon />
        </div>
      </Popover>
    </div>
  );
}
