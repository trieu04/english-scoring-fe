export function OverallPoint({
  point,
}: {
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
    <div className="flex flex-col items-center text-center w-30">
      <div className="font-bold text-lg">Overall</div>
      <div>
        <div className="w-30">
          <div className="text-[4.5rem] font-semibold leading-none text-main">{displayPoint}</div>
          <div>points</div>
        </div>
      </div>
    </div>
  );
}
