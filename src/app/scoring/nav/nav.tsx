import Icons from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function NavComponent() {
  const [pickedHistory, setPickedHistory] = useState<{ id: number; name: string } | null>(null);
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
        {
          !pickedHistory
            ? (
                <>
                  <div className="flex justify-center border-b-2 border-dscl-blue1 py-2">
                    <h3 className="grow">History</h3>
                    <Icons.MoreVerticalIcon />
                  </div>
                  <div className="flex flex-col space-y-6 py-6">
                    {
                      [
                        { id: 2, name: "Kíp 1, 09/10/2024" },
                        { id: 4, name: "Kíp 2, 09/10/2024" },
                        { id: 6, name: "Kíp 3, 09/10/2024" },
                        { id: 8, name: "Kíp 4, 09/10/2024" },
                        { id: 10, name: "Kíp 1, 10/10/2024" },
                      ].map(item => (
                        <div key={item.id}>
                          <div
                            className="cursor-pointer flex items-center space-x-2"
                            onClick={() => {
                              setPickedHistory(item);
                            }}
                          >
                            <Icons.ExamMultipleChoiceIcon />
                            <div>{item.name}</div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </>
              )
            : (
                <>
                  <div className="flex justify-center border-b-2 border-dscl-blue1 py-2">
                    <Icons.ChevronLeftIcon onClick={() => setPickedHistory(null)} className="cursor-pointer mr-1" />
                    <h3 className="grow">{pickedHistory.name}</h3>
                    <Icons.MoreVerticalIcon />
                  </div>
                  <div className="flex flex-col space-y-6 py-6">
                    {
                      [
                        { id: 2, name: "Phách 100" },
                        { id: 4, name: "Phách 101" },
                        { id: 6, name: "Phách 102" },
                        { id: 8, name: "Phách 103" },
                        { id: 10, name: "Phách 104" },
                      ].map(item => (
                        <div key={item.id}>
                          <div
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <Icons.ExamMultipleChoiceIcon />
                            <div>{item.name}</div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </>
              )
        }

      </div>
    </div>
  );
}
