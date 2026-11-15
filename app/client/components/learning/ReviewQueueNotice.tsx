import { Link } from "react-router";
import type { SubmittedAnswer } from "./AnswerComparison";
import { removeReviewItem, useReviewQueue } from "./learningReviewStore";
import { reviewItemKey } from "./learningReviewSchema";
import { ToolButton } from "~/client/components/shared/ToolWorkspace";

export default function ReviewQueueNotice({ answer }: { answer: SubmittedAnswer }) {
  const queue = useReviewQueue();
  if (!answer.reviewTarget) return null;
  const key = reviewItemKey(answer.reviewTarget);
  const saved = queue.items.some(item => reviewItemKey(item) === key);
  if (!saved && !answer.queued) return null;
  return <div className="mt-3 text-sm text-slate-700">
    <p>{saved ? "This target is in your local review queue." : "This target has been removed from your review queue."} <Link className="font-semibold text-sky-900 underline underline-offset-4" to="/practice#review-queue">Review missed items</Link></p>
    {saved && answer.correct && <ToolButton className="mt-2" onClick={() => removeReviewItem(key)}>Remove this review item</ToolButton>}
    {queue.notice && <p role="status" className="mt-2 max-w-[68ch]">{queue.notice}</p>}
  </div>;
}
