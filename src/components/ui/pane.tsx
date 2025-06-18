import { setFullHeightFromTop } from "@/lib/utils";

interface Props {
  header: string;
  children: React.ReactNode;
}

export function Pane(props: Props) {
  return (
    <div className="bg-white rounded-xl shrink-0 flex flex-col mx-4">
      <h2 className="px-4 pt-6 pb-4 border-b-2 border-b-gray-200 text-3xl">{props.header}</h2>
      <div
        className="overflow-auto p-4"
        ref={setFullHeightFromTop}
      >
        {props.children}
      </div>
    </div>
  );
}
