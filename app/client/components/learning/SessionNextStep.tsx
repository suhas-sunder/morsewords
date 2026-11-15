import { Link } from "react-router";
import { useEffect, useRef } from "react";
import { useReviewQueue } from "./learningReviewStore";

export function useSessionResultFocus(finished: boolean) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (finished) ref.current?.focus(); }, [finished]);
  return ref;
}

export default function SessionNextStep() {
  const { items } = useReviewQueue();
  return <p className="mt-4 max-w-[68ch] text-sm leading-relaxed text-slate-700">
    {items.length ? <>Your local review queue has {items.length} {items.length === 1 ? "target" : "targets"}. <Link to="/practice#review-queue" className="font-semibold text-sky-900 underline underline-offset-4">Review missed items when you are ready</Link>.</>
      : <>Ready for another skill? <Link to="/learn-morse-code" className="font-semibold text-sky-900 underline underline-offset-4">Choose your next learning path</Link>.</>}
    {" "}You can stop here and return another time.
  </p>;
}
