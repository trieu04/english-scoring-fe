import Icons from "@/components/icons";
import { SoundPlayer } from "@/components/media/sound-player";
import { Button } from "@/components/ui/button";
import { OverallPoint } from "../components/overall-point";
import { SkillPoint } from "../components/skill-point";

export function SpeakingComponent() {
  return (
    <div className="px-4">
      <div className="py-3 border-b-2 border-dscl-blue1 flex items-center">
        <h2 className="grow">Speaking</h2>
        <Icons.SidebarIcon />
      </div>

      <div className="flex items-center py-4">
        <h3 className="grow">Submission</h3>
        <Button size="sm">
          <Icons.RotateCwIcon className="stroke-dscl-white" />
          <span>Re-Score</span>
        </Button>
      </div>

      <div>
        <SoundPlayer totalTime={2 * 60 + 56} currentTime={46} />
      </div>

      <div className="py-4">
        <h3>Score</h3>
        <div className="mt-3 border-1 border-dscl-main rounded-md p-4 grid grid-cols-2 space-y-8">
          <OverallPoint point={9} />
          <SkillPoint icon={<Icons.MicIcon className="stroke-dscl-main" />} name="Pronunciation" point={9} />
          <SkillPoint icon={<Icons.BoldIcon className="stroke-dscl-main" />} name="Vocabulary" point={9} />
          <SkillPoint icon={<Icons.BookOpenIcon className="stroke-dscl-main" />} name="Grammar" point={8} />
          <SkillPoint icon={<Icons.MessageCircleIcon className="stroke-dscl-main" />} name="Fluency" point={9} />
          <SkillPoint icon={<Icons.FileTextIcon className="stroke-dscl-main" />} name="Content" point={9} />
        </div>
      </div>

      <div className="py-4">
        <div className="flex items-center">
          <h3 className="grow-1">Score version</h3>
          <Button size="sm">
            <Icons.PlusIcon className="stroke-dscl-white" />
            <span>Save Version</span>
          </Button>
        </div>

        <div className="mt-3 flex flex-col space-y-3">
          {
            [
              { id: 1, name: "Version 4", date: "04/12/2024", time: "12:23" },
              { id: 2, name: "Version 3", date: "04/12/2024", time: "12:23" },
              { id: 3, name: "Version 2", date: "04/12/2024", time: "12:23" },
              { id: 4, name: "Version 1", date: "04/12/2024", time: "12:23" },
            ].map(item => (
              <div className="flex space-x-2 border-1 border-dscl-grey1 p-4 rounded-md items-center" key={item.id}>
                <div className="text-dscl-main font-bold grow">{item.name}</div>
                <Icons.ClockIcon />
                <div className="flex items-center">
                  <span>{item.time}</span>
                  <span className="ml-2">{item.date}</span>
                </div>
                <Button className="rounded-sm py-0">Revert</Button>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
