import Icons from "@/components/icons";
import { Popover, Slider } from "antd";
import { DownloadIcon, PauseIcon, PlayIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface IComponentProps {
  url: string;
  name?: string;
}

export function AudioPlayer({ url, name }: IComponentProps) {
  const [open, setOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // State to manage the play/pause status
  const [currentTime, setCurrentTime] = useState<number>(0); // State to manage the current time of the track
  const [duration, setDuration] = useState<number>(0); // State to manage the duration of the track
  const audioRef = useRef<HTMLAudioElement | null>(null); // Ref to manage the audio element

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
    else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = url;
      audioRef.current.load();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-[#FFF7E7] px-6 py-4  rounded-md">
      <div className="font-semibold">
        {name}
      </div>

      <div className="text-black flex items-center space-x-2">
        <audio
          ref={audioRef}
          onTimeUpdate={handleAudioTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
        <div className="rounded-full bg-main p-2 cursor-pointer" onClick={() => handlePlayPause()}>
          {isPlaying
            ? <PauseIcon className="text-white" />
            : <PlayIcon className="text-white" />}
        </div>
        <div className="grow flex flex-col space-y-1">
          <Slider
            className="grow"
            onChange={v => handleTimeUpdate(v)}
            max={duration}
            value={currentTime}
            tooltip={{ formatter: v => formatTime(Number(v)) }}
          />
          <div className="flex justify-between">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

        </div>
        <Popover
          content={(
            <div>
              <a href={url} target="_blank" download className="flex items-center space-x-2">
                <DownloadIcon className="mr-2 size-6" />
                Download
              </a>
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
    </div>
  );
}
