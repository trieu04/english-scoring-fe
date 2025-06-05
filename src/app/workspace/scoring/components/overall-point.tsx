export function OverallPoint({
  point,
}: {
  point: number;
}) {
  return (
    <div className="flex flex-col items-center text-center w-36">
      <div className="font-bold text-lg">Overall</div>
      <div>
        <div className="w-36">
          <div className="text-[4.5rem] font-semibold leading-none text-dscl-main">{point}</div>
          <div>points</div>
        </div>
      </div>
    </div>
  );
}
