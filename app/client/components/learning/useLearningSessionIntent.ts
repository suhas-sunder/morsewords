import * as React from "react";
import { takeLearningSession, type LearningSession } from "./learningSessions";

// Call the returned reader from a hydration effect. Keep the consumed intent
// through StrictMode effect replay without consuming anything during SSR render.
export function useLearningSessionIntent(destination: string) {
  const consumed = React.useRef<{ destination: string; value: LearningSession | null } | null>(null);
  return React.useCallback(() => {
    if (!consumed.current || consumed.current.destination !== destination) {
      consumed.current = { destination, value: takeLearningSession(destination) };
    }
    return consumed.current.value;
  }, [destination]);
}
