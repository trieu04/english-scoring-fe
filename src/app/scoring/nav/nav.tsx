import Icons from "@/components/icons";
import { Button } from "@/components/ui/button";

export function NavComponent() {
  return (
    <div className="px-4 w-64 max-h-full overflow-y-auto">
      <div className="py-3 border-b-2 border-dscl-blue1 flex items-center">
        <h2 className="grow">File and history</h2>
        <Icons.SidebarIcon />
      </div>
      <div className="p-3">
        <Button className="w-full">
          <Icons.PlusIcon className="stroke-dscl-white" />
          <span>New Scoring</span>
        </Button>
      </div>
      <div>
        <div className="flex justify-center border-b-2 border-dscl-blue1 py-2">
          <h3 className="grow">History</h3>
          <Icons.MoreVerticalIcon />
        </div>
        <div className="flex flex-col space-y-6 py-6">
          {
            [
              { id: 1, name: "Nguyễn Đức Lộc" },
              { id: 2, name: "Kíp 2, 09/10/2024" },
              { id: 3, name: "Nguyễn Đức Lộc" },
              { id: 4, name: "Kíp 2, 09/10/2024" },
              { id: 5, name: "Nguyễn Đức Lộc" },
              { id: 6, name: "Kíp 2, 09/10/2024" },
              { id: 7, name: "Nguyễn Đức Lộc" },
              { id: 8, name: "Kíp 2, 09/10/2024" },
              { id: 9, name: "Nguyễn Đức Lộc" },
              { id: 10, name: "Kíp 2, 09/10/2024" },
              { id: 11, name: "Nguyễn Đức Lộc" },
            ].map(item => (
              <div className="flex items-center space-x-2" key={item.id}>
                <Icons.ExamMultipleChoiceIcon />
                <div>{item.name}</div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
