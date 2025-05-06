export function SkillPoint({
  icon,
  name,
  point,
}: {
  icon: React.ReactNode;
  name: string;
  point: number;
}) {
  return (
    <div className="flex flex-col items-center space-y-2 w-32">
      <div className="flex items-center space-x-1">
        {icon}
        <span className="font-bold text-lg">{name}</span>
      </div>
      <div className="">
        <div className="rounded-md text-center bg-dscl-blue1 py-2 w-32">
          <div className="text-[3.5rem] font-semibold leading-none">{point}</div>
          <div>points</div>
        </div>
      </div>
    </div>
  );
}
