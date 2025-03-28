export function OverallPoint({
  point,
}: {
  point: number;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="font-bold text-lg">Overall</div>
      <div>
        <div className="px-12">
          <div className="text-[5.5rem] font-semibold leading-none text-dscl-main">{point}</div>
          <div>points</div>
        </div>
      </div>
    </div>
  );
}
