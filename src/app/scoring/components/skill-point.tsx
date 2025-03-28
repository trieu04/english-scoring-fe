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
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-center space-x-1">
        {icon}
        <span className="font-bold text-lg">{name}</span>
      </div>
      <div className="">
        <div className="rounded-lg text-center bg-dscl-blue1 py-2 px-12">
          <div className="text-[4rem] font-semibold leading-none">{point}</div>
          <div>points</div>
        </div>
      </div>
    </div>
  );
}
