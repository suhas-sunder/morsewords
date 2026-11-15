import type { SubmittedAnswer } from "./AnswerComparison";
import type { MissedTarget } from "./learningReviewSchema";
import { recordMissedTarget } from "./learningReviewStore";

// Call only from a submitted-answer event, never from render or an effect.
export function captureReviewAnswer(answer: SubmittedAnswer, target: MissedTarget): SubmittedAnswer {
  const queued = !answer.correct && recordMissedTarget(target);
  return { ...answer, reviewTarget: target, queued };
}
