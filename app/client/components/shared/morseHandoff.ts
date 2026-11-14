import { useEffect } from "react";
import { useLocation } from "react-router";

// Explicit user-action handoffs only. Nothing is placed in a URL, browser
// storage, history state, analytics, or server. Refresh deliberately clears it.
const routes = new Set(["/", "/morse-code-decoder", "/morse-code-reader", "/morse-code-word-separator"]);
const drafts = new Map<string, { value: string; expires: number }>();
let returnPath: string | null = null;
export const HANDOFF_LIMIT = 100_000;
export function stageDecoderDraft(value: string) {
  if (value.length > HANDOFF_LIMIT) return false;
  drafts.clear();
  returnPath = null;
  drafts.set("/morse-code-decoder", { value, expires: Date.now() + 30 * 60_000 });
  return true;
}
export function stageMorseHandoff(source: string, value: string) {
  if (!routes.has(source) || source === "/morse-code-word-separator" || value.length > HANDOFF_LIMIT) return false;
  drafts.clear();
  const draft = { value, expires: Date.now() + 30 * 60_000 };
  drafts.set(source, draft);
  drafts.set("/morse-code-word-separator", draft);
  returnPath = source;
  return true;
}
export function takeMorseDraft(path: string) {
  const draft = drafts.get(path);
  drafts.delete(path);
  return draft && draft.expires > Date.now() ? draft.value : null;
}
export function returnMorseDraft(value: string) {
  if (!returnPath || value.length > HANDOFF_LIMIT) return null;
  const draft = drafts.get(returnPath);
  if (!draft || draft.expires <= Date.now()) { returnPath = null; return null; }
  drafts.set(returnPath, { ...draft, value });
  return returnPath;
}
export function hasMorseReturn() {
  return !!returnPath && (drafts.get(returnPath)?.expires ?? 0) > Date.now();
}
export function useMorseHandoff(apply: (value: string) => void) {
  const { pathname } = useLocation();
  useEffect(() => {
    const value = takeMorseDraft(pathname);
    if (value !== null) apply(value);
  }, [pathname, apply]);
}
