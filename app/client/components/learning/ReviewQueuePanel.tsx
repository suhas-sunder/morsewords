import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ToolButton, ToolPanel, ToolTextarea } from "~/client/components/shared/ToolWorkspace";
import { textToMorse } from "~/client/components/shared/morseUtils";
import AnswerComparison, { type SubmittedAnswer } from "./AnswerComparison";
import { checkReviewAnswer } from "./learningAnswerRules";
import { REVIEW_LIMIT, REVIEW_SOURCE_LABELS, reviewItemKey, type ReviewItem } from "./learningReviewSchema";
import { clearReviewQueue, removeReviewItem, useReviewQueue } from "./learningReviewStore";
import { stageReviewAudio } from "./reviewAudioHandoff";
import { captureReviewAnswer } from "./reviewSubmission";

export default function ReviewQueuePanel() {
  const queue = useReviewQueue();
  const navigate = useNavigate();
  const [confirmClear, setConfirmClear] = useState(false);
  const [deck, setDeck] = useState<ReviewItem[]>([]);
  const [position, setPosition] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState<SubmittedAnswer | null>(null);
  const [checks, setChecks] = useState(0);
  const inputRef = useRef<HTMLDivElement>(null);
  const item = deck[position];
  const audio = item && ["audio-practice", "audio-quiz"].includes(item.source);
  function start(items: ReviewItem[]) {
    setDeck(items.map(value => ({ ...value })));
    setPosition(0); setAnswer(""); setSubmitted(null);
    requestAnimationFrame(() => inputRef.current?.querySelector("textarea")?.focus());
  }
  return <div ref={inputRef} className="mt-4 text-slate-700">
    <p className="max-w-[68ch]">Missed targets stay in this browser, with the most recently marked first. Up to {REVIEW_LIMIT} targets are kept; a new target replaces the oldest when full. Submitted answers are never saved. Custom words are private local items.</p>
    <p className="mt-2 max-w-[68ch]">Review uses the original exercise’s answer rules. Listening items open in audio practice with your audio settings and wait for you to press Play. You decide when to remove an item.</p>
    {queue.notice && <p role="status" className="mt-3 max-w-[68ch]">{queue.notice}</p>}
    <div className="mt-4 flex flex-wrap gap-3">
      <ToolButton tone="dark" disabled={!queue.items.length} onClick={() => start(queue.items)}>Start review</ToolButton>
      <ToolButton disabled={!queue.items.length && !queue.notice} onClick={() => setConfirmClear(true)}>Clear review queue</ToolButton>
    </div>
    {confirmClear && <div className="mt-3">
      <p>Remove all saved review targets from this browser? Scores and custom word lists stay unchanged.</p>
      <div className="mt-2 flex flex-wrap gap-3"><ToolButton onClick={() => { clearReviewQueue(); setConfirmClear(false); setDeck([]); }}>Confirm clear review queue</ToolButton><ToolButton onClick={() => setConfirmClear(false)}>Keep review queue</ToolButton></div>
    </div>}
    {!queue.items.length && <p className="mt-4" role="status">Your review queue is empty. Miss a practice answer or mark a word weak to add a target.</p>}
    {item && <section aria-label="Review exercise" className="mt-6 border-t border-slate-300 pt-5">
      <h3 className="text-2xl font-extrabold text-sky-950">Review item {position + 1} of {deck.length}</h3>
      <p className="mt-2 text-sm">{REVIEW_SOURCE_LABELS[item.source]}{item.private ? " · Private custom target" : ""}</p>
      {audio ? <>
        <p className="mt-3">Listen to this saved target in audio practice. Its answer stays hidden until you check or reveal it.</p>
        <ToolButton className="mt-3" tone="dark" onClick={() => { if (stageReviewAudio(item)) navigate("/morse-code-audio-practice"); }}>Open listening review</ToolButton>
      </> : <form className="mt-3" onSubmit={event => {
        event.preventDefault();
        if (!answer.trim() || submitted?.correct) return;
        const result = checkReviewAnswer(item, answer);
        setSubmitted(captureReviewAnswer({ expected: result.normalizedExpected, attempted: result.normalizedGot, correct: result.ok, kind: item.mode === "text_to_morse" ? "morse" : "text" }, item));
        setChecks(value => value + 1);
      }}>
        <p className="text-sm font-semibold">{item.mode === "text_to_morse" ? "Write this target in Morse" : "Read this Morse pattern"}</p>
        <pre className="mw-static-code mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-xl p-4 font-mono [overflow-wrap:anywhere]">{item.mode === "text_to_morse" ? item.target : textToMorse(item.target)}</pre>
        <ToolPanel className="mt-3" label={<label htmlFor="review-answer">Review answer</label>}>
          <ToolTextarea id="review-answer" value={answer} onChange={event => setAnswer(event.target.value)} />
        </ToolPanel>
        <ToolButton className="mt-3" type="submit" tone="dark" disabled={!answer.trim() || submitted?.correct}>Check review answer</ToolButton>
        {submitted && <AnswerComparison key={checks} answer={submitted} />}
      </form>}
      <div className="mt-4 flex flex-wrap gap-3">
        <ToolButton onClick={() => { setPosition(value => value + 1); setAnswer(""); setSubmitted(null); requestAnimationFrame(() => inputRef.current?.querySelector("textarea")?.focus()); }}>{position + 1 === deck.length ? "Finish review" : "Next review item"}</ToolButton>
        <ToolButton onClick={() => setDeck([])}>Close review exercise</ToolButton>
      </div>
    </section>}
    {deck.length > 0 && !item && <p role="status" className="mt-5">You reached the end of this review list. Targets stay saved until you remove them; reaching the end does not mean every target was answered correctly.</p>}
    {queue.items.length > 0 && <ul className="mt-6 divide-y divide-slate-300" aria-label="Saved review targets">
      {queue.items.map(target => <li key={reviewItemKey(target)} className="flex flex-wrap items-center justify-between gap-3 py-3">
        <div className="min-w-0 flex-1"><p className="truncate font-mono text-sky-950">{target.target}</p><p className="mt-1 text-sm">{REVIEW_SOURCE_LABELS[target.source]} · {target.mode === "text_to_morse" ? "Write Morse" : "Recognize Morse"} · {target.misses} {target.misses === 1 ? "time" : "times"} marked{target.private ? " · Private" : ""}</p></div>
        <div className="flex gap-2"><ToolButton onClick={() => start([target])}>Review target</ToolButton><ToolButton onClick={() => removeReviewItem(reviewItemKey(target))} aria-label={`Remove ${target.target.length > 60 ? target.target.slice(0, 60) + "…" : target.target} from review`}>Remove</ToolButton></div>
      </li>)}
    </ul>}
  </div>;
}
