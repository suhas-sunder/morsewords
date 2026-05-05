import * as React from "react";

export default function StatsBar({
  correct,
  total,
  streak,
}: {
  correct: number;
  total: number;
  streak: number;
}) {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  const chip =
    "inline-flex items-center rounded-md bg-[#fffdf8] px-3 py-1 text-sm font-semibold text-slate-900";

  return (
    <div className="flex flex-wrap gap-3">
      <span className={chip}>
        Attempts: <span className="ml-1 font-extrabold">{total}</span>
      </span>
      <span className={chip}>
        Correct: <span className="ml-1 font-extrabold">{correct}</span>
      </span>
      <span className={chip}>
        Accuracy: <span className="ml-1 font-extrabold">{accuracy}%</span>
      </span>
      <span className={chip}>
        Streak: <span className="ml-1 font-extrabold">{streak}</span>
      </span>
    </div>
  );
}
