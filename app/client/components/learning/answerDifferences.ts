export type AnswerDifference = {
  kind: "replace" | "missing" | "extra";
  position: number;
  attemptedPosition: number;
  expected: string;
  attempted: string;
};

// Inputs are the exercise's own normalized values. This explains its existing
// verdict; it must never become a second grader with different spacing rules.
export function compareAnswerElements(expected: string, attempted: string) {
  const limit = 240;
  const a = Array.from(expected.slice(0, limit * 2)).slice(0, limit);
  const b = Array.from(attempted.slice(0, limit * 2)).slice(0, limit);
  const rows = Array.from({ length: a.length + 1 }, () => new Uint16Array(b.length + 1));
  for (let i = 0; i <= a.length; i++) rows[i][0] = i;
  for (let j = 0; j <= b.length; j++) rows[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
    rows[i][j] = a[i - 1] === b[j - 1] ? rows[i - 1][j - 1]
      : 1 + Math.min(rows[i - 1][j - 1], rows[i - 1][j], rows[i][j - 1]);
  }
  const differences: AnswerDifference[] = [];
  let i = a.length, j = b.length;
  while (i || j) {
    if (i && j && a[i - 1] === b[j - 1]) { i--; j--; continue; }
    if (i && j && rows[i][j] === rows[i - 1][j - 1] + 1) {
      differences.push({ kind: "replace", position: i, attemptedPosition: j, expected: a[--i], attempted: b[--j] });
    } else if (i && rows[i][j] === rows[i - 1][j] + 1) {
      differences.push({ kind: "missing", position: i, attemptedPosition: j + 1, expected: a[--i], attempted: "" });
    } else {
      differences.push({ kind: "extra", position: i + 1, attemptedPosition: j, expected: "", attempted: b[--j] });
    }
  }
  differences.reverse();
  const grouped: AnswerDifference[] = [];
  for (const item of differences) {
    const previous = grouped[grouped.length - 1];
    const adjacent = previous && previous.kind === item.kind &&
      item.position === previous.position + Array.from(previous.expected).length &&
      item.attemptedPosition === previous.attemptedPosition + Array.from(previous.attempted).length;
    if (adjacent) { previous.expected += item.expected; previous.attempted += item.attempted; }
    else grouped.push({ ...item });
  }
  const expectedPreview = a.join("");
  const attemptedPreview = b.join("");
  return { differences: grouped.slice(0, 8), count: differences.length, groupCount: grouped.length,
    truncated: expected.length > expectedPreview.length || attempted.length > attemptedPreview.length,
    expected: expectedPreview, attempted: attemptedPreview };
}

export function describeDifference(item: AnswerDifference, morse: boolean) {
  const label = (value: string) => value === " " ? "space" : value === "/" ? "word gap"
    : morse && value === "." ? "dot" : morse && value === "-" ? "dash" : `“${value.slice(0, 32)}${value.length > 32 ? "…" : ""}”`;
  const length = Array.from(item.expected).length;
  const position = length > 1 ? `Positions ${item.position}–${item.position + length - 1}` : `Position ${item.position}`;
  if (item.kind === "missing") return `${position}: missing ${label(item.expected)}.`;
  if (item.kind === "extra") return `Before position ${item.position}: extra ${label(item.attempted)}.`;
  return `${position}: expected ${label(item.expected)}, entered ${label(item.attempted)}.`;
}
