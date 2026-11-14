import { normalizeTextForMorse, PASTED_MARK_RULES, TEXT_TO_MORSE } from "./morseUtils";

export type TextDiagnostic = {
  start: number; end: number; line: number; column: number;
  source: string; normalized: string; omitted: string; kind: "unsupported" | "normalized";
};
export const TEXT_DIAGNOSTIC_LIMIT = 12;

/** UTF-16 ranges target native textarea selections, never normalized-word offsets. */
export function diagnoseTextInput(input: string) {
  let value = input;
  let spans = Array.from({ length: input.length }, (_, start) => ({ start, end: start + 1 }));
  for (const [pattern, replacement] of PASTED_MARK_RULES) {
    const next: typeof spans = [];
    let cursor = 0;
    value = value.replace(pattern, (match, offset: number) => {
      for (let i = cursor; i < offset; i++) next.push(spans[i]);
      for (let i = 0; i < replacement.length; i++) next.push({ start: spans[offset].start, end: spans[offset + match.length - 1].end });
      cursor = offset + match.length;
      return replacement;
    });
    for (let i = cursor; i < spans.length; i++) next.push(spans[i]);
    spans = next;
  }
  const issues: TextDiagnostic[] = [];
  let unsupported = 0, normalized = 0;
  // Graphemes keep combining accents and emoji sequences together. ASCII runs use
  // a fast path so long ordinary prose does not allocate a segment per character.
  const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
  for (const chunk of value.matchAll(/\s+|\S+/gu)) {
    const chunkIndex = chunk.index!;
    if (/^[\x21-\x7e]+$/.test(chunk[0]) && [...chunk[0]].every(ch => Object.hasOwn(TEXT_TO_MORSE, ch.toUpperCase())) &&
        input.slice(spans[chunkIndex].start, spans[chunkIndex + chunk[0].length - 1].end) === chunk[0]) continue;
    const segments = /^\s+$/.test(chunk[0]) ? [{ segment: chunk[0], index: 0 }] : segmenter.segment(chunk[0]);
    for (const part of segments) {
      const index = chunkIndex + part.index;
      const start = spans[index].start, end = spans[index + part.segment.length - 1].end;
      const source = input.slice(start, end);
      const whitespace = /^\s+$/.test(part.segment);
      const output = whitespace ? (index === 0 || index + part.segment.length === value.length ? "" : " ") : normalizeTextForMorse(part.segment);
      const omitted = [...output].filter(ch => ch !== " " && !Object.hasOwn(TEXT_TO_MORSE, ch)).join("");
      const changed = whitespace ? source !== output : output !== source.toUpperCase() || source !== part.segment;
      if (!omitted && !changed) continue;
      if (omitted) unsupported++; else normalized++;
      // Reserve room for both kinds, even if a paste starts with many spaces.
      if (issues.filter(item => item.kind === (omitted ? "unsupported" : "normalized")).length >= TEXT_DIAGNOSTIC_LIMIT) continue;
      const before = input.slice(0, start).split(/\r\n|\r|\n/);
      issues.push({ start, end, line: before.length, column: [...before.at(-1)!].length + 1,
        source, normalized: output, omitted, kind: omitted ? "unsupported" : "normalized" });
    }
  }
  return { issues, unsupported, normalized, normalizedInput: normalizeTextForMorse(input) };
}

export function describeDiagnosticText(value: string) {
  if (!value) return "removed";
  return value.slice(0, 32).replace(/ /g, "[space]").replace(/\r/g, "[return]").replace(/\n/g, "[newline]").replace(/\t/g, "[tab]") + (value.length > 32 ? "…" : "");
}
