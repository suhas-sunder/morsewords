import { useState } from "react";
import { ToolButton } from "~/client/components/shared/ToolWorkspace";
import { textToMorse } from "~/client/components/shared/morseUtils";
import { compareAnswerElements, describeDifference } from "./answerDifferences";
import type { MissedTarget } from "./learningReviewSchema";
import ReviewQueueNotice from "./ReviewQueueNotice";

export type SubmittedAnswer = {
  expected: string;
  attempted: string;
  correct: boolean;
  kind: "text" | "morse";
  reviewTarget?: MissedTarget;
  queued?: boolean;
};

export default function AnswerComparison({ answer, optional = false }: {
  answer: SubmittedAnswer;
  optional?: boolean;
}) {
  const [open, setOpen] = useState(!optional);
  if (!open) return <div className="mt-3"><ToolButton type="button" onClick={() => setOpen(true)}>Compare submitted answer</ToolButton><ReviewQueueNotice answer={answer} /></div>;
  const result = compareAnswerElements(answer.expected, answer.attempted);
  const summary = answer.correct ? "Your answer matches."
    : result.count ? `${result.count}${result.truncated ? " or more" : ""} difference${result.count === 1 ? "" : "s"} in the compared answer.`
      : result.truncated ? "The difference is beyond this shortened comparison."
        : "The normalized patterns match. Check for unsupported characters in your original answer.";
  return <section aria-label="Answer comparison" className="mt-4 text-slate-700">
    <p role="status" className="text-sm font-semibold text-sky-950">{summary}</p>
    <div className="mt-3 grid gap-4 sm:grid-cols-2">
      {([['Expected', result.expected], ['Submitted', result.attempted]] as const).map(([label, value]) => <div key={label}>
        <h3 className="text-sm font-semibold text-sky-950">{label}</h3>
        <p className="mt-1 whitespace-pre-wrap break-words font-mono text-sm [overflow-wrap:anywhere]">{value ? Array.from(value).map((character, index) => {
          const changed = result.differences.some(item => label === "Expected"
            ? item.kind !== "extra" && item.position <= index + 1 && index + 1 < item.position + Array.from(item.expected).length
            : item.kind !== "missing" && item.attemptedPosition <= index + 1 && index + 1 < item.attemptedPosition + Array.from(item.attempted).length);
          return changed ? <mark key={index} className="bg-transparent font-bold text-inherit underline decoration-2 underline-offset-4">{character === " " ? "␠" : character}</mark> : character;
        }) : "(empty)"}{result.truncated ? "…" : ""}</p>
        {answer.kind === "text" && value && <p className="mt-1 break-words font-mono text-sm [overflow-wrap:anywhere]" aria-label={`${label} Morse pattern`}>{textToMorse(value)}</p>}
      </div>)}
    </div>
    {result.differences.length > 0 && <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
      {result.differences.map((item, index) => <li key={index}><strong>{describeDifference(item, answer.kind === "morse")}</strong></li>)}
    </ul>}
    {result.groupCount > 8 && <p className="mt-2 text-sm">Showing the first 8 groups of differences.</p>}
    {result.truncated && <p className="mt-2 text-sm">Comparison is limited to the first 240 characters. Your exercise checks the full answer.</p>}
    <p className="mt-3 max-w-[68ch] text-sm">This compares the submitted answer using this exercise’s formatting rules. Try again or continue when ready.</p>
    <ReviewQueueNotice answer={answer} />
  </section>;
}
