import { setFullHeightFromTop } from "@/lib/utils";
import { BarLoader } from "react-spinners";

interface Props {
  header: string;
  children: React.ReactNode;
  isLoading?: boolean;
}

export function Pane(props: Props) {
  return (
    <div className="bg-white rounded-xl shrink-0 flex flex-col mx-4">
      <h2 className="px-4 pt-6 pb-4 text-3xl">{props.header}</h2>
      <div className="h-0.5 w-full bg-gray-200">
        {props.isLoading && <BarLoader width="100%" height="100%" />}
      </div>
      <div
        className="overflow-auto"
        ref={setFullHeightFromTop}
      >
        <div className="p-4">
          {props.children}
        </div>
      </div>
    </div>
  );
}
