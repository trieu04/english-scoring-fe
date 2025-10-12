export function SkillPoint({
  icon,
  name,
  point,
}: {
  icon: React.ReactNode;
  name: string;
  point: string | number;
}) {
  let displayPoint: any = "-";
  if (typeof point === "number") {
    displayPoint = Math.round(point * 2) / 2;
  }
  if (typeof point === "string" && !Number.isNaN(Number(point))) {
    displayPoint = Math.round(Number(point) * 2) / 2;
  }

  return (
    <div className="flex flex-col items-center space-y-2 w-26">
      <div className="flex items-center space-x-1">
        {icon}
        <span className="font-bold text-md">{name}</span>
      </div>
      <div className="">
        <div className="rounded-md text-center bg-second py-2 w-26">
          <div className="text-[3.5rem] font-semibold leading-none">{displayPoint}</div>
          <div>points</div>
        </div>
      </div>
    </div>
  );
}
