# MorseWords full fix prompt

You are working in the MorseWords React Router / Remix-style project from the uploaded zip. Treat `app/routes/home.tsx`, `app/client/components/shared/pageStyles.ts`, `app/client/components/shared/MorseLearningLayout.tsx`, and the repo's agent guidance file (`AGENT.md` or `AGENTS.md`, whichever exists in the working tree) as the source of truth for product direction, spacing, card styling, copy tone, SEO structure, and overall polish.

Do not redesign randomly. Fix the requested issues, preserve existing routes and working behavior, and make each tool feel like a polished browser-based Morse education product. Inspect the relevant file before editing it. Work one page at a time.

## Current high-priority problems found in the zip

1. `app/client/assets/svg/Icons.tsx` only has a small icon set: `LightBulbIcon`, `SoundIcon`, `VibrateIcon`, `LoopIcon`, `SaveIcon`, `CopyIcon`, `PauseIcon`, `PlayIcon`, `StopIcon`, `ShareIcon`. New buttons need direct inline SVG icons added there.
2. `app/routes/morse-code-word-search-builder.tsx` is currently a thin placeholder:
   - It displays the answer list by default.
   - The clue list is plain words instead of Morse code.
   - `parseWords` allows digits even though the grid should be alphabet letters.
   - `buildGrid` uses deterministic filler and simple horizontal/vertical placement only.
   - Long words are silently sliced with `word.slice(0, size)`.
   - There is no placement metadata, no answer-key rendering, no real shuffle/new-puzzle behavior, no QR code, no branding, and print uses `window.print()` on the whole app.
   - The CTA links include duplicate links to `/morse-code-printable-chart` with different labels.
3. `app/routes/morse-code-word-trainer.tsx` is functional but not good enough as a product page. It needs a stronger training flow, better deck/session controls, weak-word workflows, richer feedback, icons, and deeper content.
4. `app/routes/morse-code-practice-plan.tsx` has a basic shell but needs a much richer SEO/use-case section.
5. Flash/light-related warnings across routes/components must consistently be labelled as **Strobe warning**, not generic error/warning UI. They need the right icon and clearer placement before flashing interactions.
6. Several buttons across routes lack icons, `cursor-pointer`, hover states, focus states, or action clarity.
7. `app/routes/morse-code-printable-chart.tsx` is the quality bar for print/export output. Mirror its offscreen print HTML approach where needed, but do not copy its whole route blindly.
8. `app/routes.ts` includes the typo route `morse-code-vidual-quiz` as a redirect. Keep the redirect working, but do not add new canonical/internal links to the typo URL.
9. The uploaded zip includes a root `package.json` with `typecheck` and `build` scripts. Run `npm run typecheck` and `npm run build` after code changes. There is no `lint` or `test` script in the uploaded package unless the live repo has added one; if unavailable, state that honestly.

## External product baseline to match for word search builders

Users expect a word-search builder to support a custom word list, title, grid size, difficulty/directions, printable student copy, answer key/solved copy, and a way to regenerate or scramble the layout. Keep implementation browser-side and avoid backend logic.

## Global rules

- No backend work.
- Do not add a runtime icon library.
- Do not import `@mui/icons-material` or any icon package.
- Use free Material/MUI-style icon paths by rendering SVG directly inside `app/client/assets/svg/Icons.tsx` through the existing `SvgIconBase` wrapper.
- Use `currentColor` icons.
- Use accessible `title` props when icons are used inside meaningful buttons.
- Do not add decorative icons everywhere. Add icons where they clarify action: play, stop, print, download, shuffle, reset, reveal, hide, check, copy, QR, settings, warning, clear.
- Every edited button/control needs `cursor-pointer`, visible hover, visible focus, and disabled styling where applicable.
- Keep the primary tool UI focused. Put long explanations in SEO/how-it-works/FAQ sections.
- Keep copy practical. Avoid generic filler and keyword stuffing.
- Internal links must point only to existing routes.
- Preserve canonical URLs and structured data patterns.
- Do not send raw user-entered text, puzzle words, worksheet text, or Morse messages to analytics.
- Flat design rule: do not add borders, shadows, or gradients unless the user explicitly asks for them.
- Prefer spacing, typography, contrast, and solid fills from the existing MorseWords palette over outlines or elevation.
- Avoid nested cards wherever possible; use whitespace and a single flat background fill when content needs grouping.
- Do not reintroduce border-style divider lines in tool headers, SEO sections, FAQ sections, navigation blocks, or shared cards after they have been removed.

## Extra implementation guardrails before editing

- Complete the direct requested work first: strobe warnings/icons, word-search rebuild, word-trainer overhaul, and practice-plan expansion.
- The all-route audit is for targeted consistency fixes only. Do not rewrite unrelated pages, create new routes, or make broad SEO/content changes outside the requested scope unless there is an obvious bug, broken link, misleading warning, missing icon on a clear action button, or accessibility issue.
- Keep route names, exported route functions, canonical URLs, structured-data URLs, localStorage keys, and existing analytics event names stable unless a direct bug requires changing them.
- Use the existing shared Morse utilities from `~/client/components/shared/morseUtils` for Morse encoding/decoding wherever possible. Do not create a second inconsistent Morse map for the word-search clues.
- Avoid hydration mismatches. Do not use `Date.now()`, `Math.random()`, or `crypto` to create initial render output that appears in SSR markup. Use a deterministic initial seed for the first puzzle, then generate new seeds only in client event handlers such as `Generate new puzzle`.
- Keep source input state separate from generated output state. The printed puzzle and answer key must render from the exact `PuzzleResult` being displayed, not from stale ambient state.
- QR codes should point to the canonical MorseWords route by default. Do not encode raw custom word lists, worksheet text, puzzle answers, or learner input in a QR code unless the implementation intentionally supports shareable puzzle URLs and handles privacy/content length safely.
- If a requested internal link does not exist in the working tree, omit it or replace it with the closest existing route. Do not add dead links.

## Add missing inline SVG icons

Update `app/client/assets/svg/Icons.tsx`.

Add at minimum:

- `WarningIcon` or `ReportProblemIcon` — strobe warnings and validation notices
- `PrintIcon` — print actions
- `DownloadIcon` — download/export actions
- `ShuffleIcon` — generate new puzzle / shuffle deck
- `RefreshIcon` or `RestartIcon` — reset session / restart quiz
- `VisibilityIcon` — reveal answer / show answers
- `VisibilityOffIcon` — hide answer / hide answers
- `QrCodeIcon` — QR code and branding controls
- `CheckCircleIcon` or `CheckIcon` — check answer / correct state
- `CloseIcon` or `ClearIcon` — clear/remove actions
- `SearchIcon` — word search / puzzle search actions
- `ListIcon` or `FormatListBulletedIcon` — word list / answer list controls
- `TuneIcon` or `SettingsIcon` — settings panels
- `SchoolIcon` or `AssignmentIcon` — worksheet/classroom CTAs if useful
- Optional: `KeyboardIcon` for typing/input practice

Implementation requirements:

- Use the existing `SvgIconBase` wrapper.
- Export every new icon individually.
- Add every new icon to the exported `Icons` map.
- Keep icons React.memo-wrapped like the existing icons.
- Keep sizing and `currentColor` behavior consistent.

Button/icon mapping:

- Play audio or flash prompt: `PlayIcon` or `LightBulbIcon`
- Stop audio: `StopIcon`
- Copy: `CopyIcon`
- Save/share result: existing `SaveIcon` / `ShareIcon`
- Print: `PrintIcon`
- Download/export: `DownloadIcon`
- Generate new puzzle / shuffle deck: `ShuffleIcon`
- Reset/restart: `RefreshIcon` or `LoopIcon`
- Reveal/show: `VisibilityIcon`
- Hide: `VisibilityOffIcon`
- Warning/strobe: `WarningIcon`
- Settings/difficulty/options: `TuneIcon` or `SettingsIcon`
- Check answer: `CheckCircleIcon`
- Clear/remove: `CloseIcon`
- QR: `QrCodeIcon`

## Fix warning and error messages

Audit and update at least:

- `app/client/components/shared/TranslatorSectionsBasic.tsx`
- `app/client/components/audio/MorseAudioTranslator.tsx`
- `app/client/components/morse-code-sound-generator/MorseAudioTranslator.tsx`
- `app/routes/morse-code-audio-practice.tsx`
- `app/routes/morse-code-audio-quiz.tsx`
- `app/routes/morse-code-visual-practice.tsx`
- `app/routes/morse-code-visual-quiz.tsx`
- `app/routes/morse-code-sos.tsx`
- `app/routes/morse-code-printable-chart.tsx` for alert/status wording
- Any edited page with print/export/copy/generation failure states

Requirements:

- Any flash/light notice must be labelled exactly `Strobe warning`.
- Use `WarningIcon` next to strobe warnings.
- Strobe warning copy should be consistent:
  `Strobe warning: flashing light may be uncomfortable or unsafe for people with photosensitive epilepsy or light sensitivity. Turn off Flash or use audio-only practice if you are sensitive to strobing.`
- Do not style strobe warnings as an error/failure state. Use calm warning styling, not red panic styling.
- Strobe warnings should appear before or directly beside controls that can start flashing, not only after the user has already enabled the behavior.
- Add `aria-describedby` where a flash toggle/button has a nearby warning.
- Error messages should state the exact known issue and next action:
  - `Audio could not start because the browser blocked playback. Tap Play again.`
  - `Clipboard copy failed. Select the text and copy it manually.`
  - `The image export could not be generated in this browser. Try PDF export or remove uploaded images.`
  - `Add at least one valid A-Z word to generate a puzzle.`
  - `Could not place RADIO in a 10 × 10 grid. Increase the grid size or turn on more directions.`
- Replace `window.alert` with inline status messages where practical, especially in polished tool pages. If a browser alert remains, use clear user-facing text.

## Major rebuild: `app/routes/morse-code-word-search-builder.tsx`

This page needs the largest fix. Make it a polished Morse-specific printable puzzle builder.

### Correct game concept

The puzzle must work like this:

1. The user enters normal plain words, e.g. `MORSE`, `SIGNAL`, `RADIO`.
2. The student-facing clue list displays those words in Morse code.
3. The grid displays alphabet letters A-Z only.
4. The learner mentally translates each Morse clue into the word, then finds that alphabetic word in the grid.
5. Plain answer words are hidden by default.
6. A setting can display the plain answer list on the student copy if a teacher wants that.
7. A `Reveal answer` / `Hide answer` control toggles the on-screen answer key.
8. `Print puzzle` prints the student version.
9. `Print answered version` prints the solved/highlighted version with answer key.
10. `Generate new puzzle` changes the seed and reshuffles placements/filler letters.
11. The board must update when words, grid size, direction settings, or puzzle seed change.

### Parsing and validation

Implement helpers instead of burying logic in JSX:

- `parseWordSearchInput(input: string): ParsedWordSearchInput`
- `normalizeWordSearchWord(raw: string): string`
- `createSeededRandom(seed: number): () => number`
- `buildWordSearchPuzzle(options): PuzzleResult`
- `getAllowedDirections(settings): Direction[]`
- `canPlaceWord(grid, word, row, col, direction): boolean`
- `placeWord(grid, word, row, col, direction): CellCoordinate[]`
- `fillEmptyCells(grid, rng): string[][]`
- `getAnswerCells(placements): Set<string>`

Rules:

- Accept words split by new lines and commas.
- Normalize to uppercase.
- Keep A-Z only for placed grid words.
- Strip unsupported punctuation/digits from puzzle words or reject those tokens clearly. Do not place digits in the grid.
- Deduplicate words.
- Enforce sensible limits:
  - min word length: 2
  - max words: 20
  - max title length: 80
  - grid size: 10-20 or 10-18, whichever fits layout best
- Validate words too long for the selected grid and report them.
- Do not silently slice words.
- Show skipped/cleaned-word notices:
  - `Unsupported characters were removed from 2 entries.`
  - `Some words are too long for the current grid and were left out.`
  - `Add at least one valid A-Z word to generate a puzzle.`

### Puzzle generation

Replace current `buildGrid` with a real seeded placement engine.

Requirements:

- Store `puzzleSeed` in state.
- Build the puzzle with `useMemo` from parsed words, grid size, direction settings, and seed.
- Changing words/size/directions should rebuild the board.
- Clicking `Generate new puzzle` should:
  - set a new seed
  - hide the answer key again
  - preserve the word list/settings
  - generate different placements/filler letters when possible
- Place longer words first.
- Allow overlaps only when existing letters match.
- Use seeded randomness for direction, row, column, and filler letters.
- Try enough placements per word, e.g. `size * size * directions.length * 4` or a fixed high cap.
- If a word cannot be placed, return it in `skippedWords` with a specific reason.
- Return placement metadata:
  - word
  - Morse clue
  - start row/col
  - direction label
  - full cell coordinates
- Fill remaining cells with random A-Z letters.
- Keep the generated answer key tied to the exact generated grid.

Suggested direction presets:

- Easy: horizontal left-to-right and vertical top-to-bottom only.
- Standard: easy + diagonals.
- Challenge: all directions including backwards/reverse.
- Also allow manual toggles for horizontal, vertical, diagonal, and backwards if that fits the UI.

### Suggested route state

Use practical state similar to:

```ts
const [title, setTitle] = React.useState("Morse Code Word Search");
const [instructions, setInstructions] = React.useState(
  "Translate each Morse clue into a word, then find that word in the letter grid.",
);
const [input, setInput] = React.useState(
  "MORSE\nSIGNAL\nRADIO\nPRACTICE\nCOPY\nAUDIO\nLIGHT",
);
const [size, setSize] = React.useState(12);
const [difficulty, setDifficulty] = React.useState<
  "easy" | "standard" | "challenge"
>("standard");
const [allowBackwards, setAllowBackwards] = React.useState(false);
const [showPlainAnswersOnStudentCopy, setShowPlainAnswersOnStudentCopy] =
  React.useState(false);
const [showAnswerKey, setShowAnswerKey] = React.useState(false);
const [includeBranding, setIncludeBranding] = React.useState(true);
const [includeQrCode, setIncludeQrCode] = React.useState(true);
const [brandName, setBrandName] = React.useState("MorseWords");
const [includeStudentNameLine, setIncludeStudentNameLine] =
  React.useState(true);
const [includeDateLine, setIncludeDateLine] = React.useState(true);
const [puzzleSeed, setPuzzleSeed] = React.useState(DEFAULT_WORD_SEARCH_SEED);
```

When input, size, difficulty, or direction settings change, hide the visible answer key unless the change is specifically a display-only setting.

Define `DEFAULT_WORD_SEARCH_SEED` as a stable constant so the initial SSR/client render matches. Use `Date.now()`, `crypto.getRandomValues`, or another client-only source only inside click handlers that intentionally generate a new puzzle.

### UI layout

Make the page look like a real worksheet builder, not a chaotic toy.

Use home/shared patterns:

- Hero section with clear description and useful links.
- Main builder card with controls on the left and a paper-style preview on the right.
- Controls grouped into readable sections:
  1. Word list
  2. Puzzle details
  3. Grid and difficulty
  4. Answers and print
  5. Branding / QR
- Preview should look like paper:
  - Title
  - student name/date line if enabled
  - instructions
  - Morse clue list
  - alphabet grid
  - optional plain answer list
  - optional answer-key overlay/highlight if revealed
  - footer with MorseWords branding and QR code when enabled
- Add a stats row:
  - valid words
  - placed words
  - skipped words
  - grid size
  - difficulty
- Use icons for Generate, Print, Reveal, Hide, Settings, QR, and Answer Key.
- On small screens, keep controls before preview but make print/reveal/generate actions easy to find.

### Print behavior

Use `app/routes/morse-code-printable-chart.tsx` as the reference quality bar.

Implement:

- `buildWordSearchPrintHtml({ puzzle, settings, mode, qrCodeDataUrl })`
- `buildWordSearchPageHtml(...)`
- `buildWordSearchGridHtml(...)`
- `buildWordSearchClueListHtml(...)`
- `buildWordSearchAnswerKeyHtml(...)`
- `printHtml(html)` via offscreen iframe or equivalent

Print modes:

- `student`: Morse clues + alphabet grid; plain answers only if `showPlainAnswersOnStudentCopy` is true.
- `answerKey`: Morse clues + alphabet grid with highlighted answer cells + plain answer list + placement table.

Print CSS requirements:

- Letter-size friendly layout.
- Print-safe colors.
- `print-color-adjust: exact` and `-webkit-print-color-adjust: exact`.
- Page margins and page breaks that avoid clipping.
- No app chrome or controls in print output.
- The grid should be legible when printed.
- Answer highlighting should still be readable in grayscale.
- Include MorseWords branding, URL, and QR code in a footer.
- Use the existing `qrcode` dependency like `morse-code-printable-chart.tsx`; do not add another QR package.

### Word-search SEO/content section

The route is missing a proper SEO/product explanation section. Add it after the builder using `SectionCard`, `ToolHowItWorks`, or matching home-page patterns.

Cover:

- What a Morse code word search is.
- Why the clues are in Morse and the grid is alphabet letters.
- How students solve it: translate clue first, then search grid.
- How teachers can use it for warm-ups, stations, homework, sub plans, review, and low-prep classroom activities.
- How to choose grid size and difficulty.
- How answer keys and printed versions work.
- How to pair it with word trainer, audio practice, printable chart, alphabet chart, and practice plan pages.

Use internal links to existing routes only:

- `/morse-code-word-trainer`
- `/morse-code-audio-practice`
- `/morse-code-printable-chart`
- `/morse-code-alphabet`
- `/morse-code-practice-plan`
- `/morse-code-timing`
- `/farnsworth-timing` if timing is mentioned

Update FAQ and schema so they match the visible content. Keep canonical path `/morse-code-word-search-builder`.

## Major overhaul: `app/routes/morse-code-word-trainer.tsx`

Keep the working logic, but rebuild the UX so it feels like a real training tool.

### Preserve existing useful behavior

Do not lose:

- Built-in word lists from `WORD_LISTS`
- Custom words
- `morse_to_text` and `text_to_morse` modes
- Audio playback through `playMorsePattern`
- WPM and Farnsworth controls
- Weak-word tracking
- Share results
- Best streak localStorage
- Canonical URL and schema

### Fix and improve behavior

Add:

- A real deck/session model instead of only `index % words.length`.
- `deck` state or memoized shuffled deck tied to a `deckSeed`.
- `Shuffle deck` / `New round` button.
- `Reset session` button.
- `Practice weak words` button that swaps the deck to weak words when weak words exist.
- Progress indicator based on deck length and completed prompts.
- Optional session goal if simple to add.
- Better empty-state handling when custom list is empty.
- Better parsing for custom words:
  - split by newline/comma
  - trim
  - dedupe
  - optionally normalize unsupported characters or show a notice
- Optional persistence for custom list if consistent with site patterns; keep it local-only.
- Do not allow stale answer state after list/mode changes.

### Improve answer feedback

Current feedback is too thin. Replace with a stronger result card.

Correct state:

- Check/correct icon.
- `Correct.`
- Show word and Morse answer.
- Primary next action: `Next word`.

Incorrect state:

- Clear non-color-only feedback.
- `Not quite. Expected: WORD / MORSE.`
- Add the word to weak review.
- Offer `Try again`, `Reveal answer`, and `Next word`.

Reveal state:

- Use `VisibilityIcon` / `VisibilityOffIcon`.
- Show both plain word and Morse.

### Make weak words actionable

Weak words should not be a passive list.

Add:

- Copy weak words button with `CopyIcon` and inline copy status.
- Play each weak word with `PlayIcon`.
- `Practice weak words` button with `ShuffleIcon` or `RefreshIcon`.
- `Clear weak words` button with `CloseIcon`.
- Links/actions to send the list to:
  - `/morse-code-word-search-builder`
  - `/morse-code-printable-chart`
  - `/morse-code-audio-practice`

If direct transfer is not implemented, use links and tell users to paste the copied weak list.

### Layout direction

Use a setup → prompt → answer → review flow.

Suggested layout:

- Hero with current list/stat aside.
- Main tool section:
  - Left/top: deck setup card: list, mode, custom words, new round, weak words round.
  - Center: strong prompt card with current prompt, play button, progress, and answer input.
  - Right/below: session stats and weak words.
- Audio settings should be available but not dominate; consider a compact card or collapsible details.
- On mobile, prompt and answer input should appear quickly.

### Word-trainer SEO/content expansion

Add richer content after the tool:

- What word-level Morse practice does that alphabet drills do not.
- When to use Morse-to-text vs text-to-Morse.
- Why weak-word loops improve retention.
- How audio playback and Farnsworth spacing fit into word practice.
- How to move from word trainer to audio practice, sentence practice, word search, and printable worksheets.

Use internal links:

- `/morse-code-audio-practice`
- `/morse-code-sentence-practice`
- `/morse-code-word-search-builder`
- `/morse-code-printable-chart`
- `/practice`
- `/morse-code-practice-plan`

## Expand `app/routes/morse-code-practice-plan.tsx`

The current plan page is okay structurally but too shallow. Add a much richer SEO/use-case section.

Keep:

- Existing canonical path.
- Existing hero pattern.
- Existing 2-week and 6-week plan concept.
- FAQ schema if FAQ remains visible.

Add content sections covering:

- Who the plan is for:
  - beginners
  - students
  - homeschoolers
  - teachers
  - radio learners
  - puzzle/worksheet users
- A practical 10-minute daily structure:
  - 2 minutes alphabet/weak-symbol review
  - 3 minutes quick recall drills
  - 3 minutes word/audio practice
  - 2 minutes quiz/worksheet/sentence proof
- More concrete 2-week reset guidance.
- More concrete 6-week build guidance.
- When to use each MorseWords tool:
  - `/morse-code-alphabet`
  - `/practice`
  - `/morse-code-word-trainer`
  - `/morse-code-audio-practice`
  - `/morse-code-visual-practice`
  - `/morse-code-sentence-practice`
  - `/typing`
  - `/morse-code-audio-quiz`
  - `/morse-code-visual-quiz`
  - `/morse-code-printable-chart`
  - `/morse-code-word-search-builder`
- How to handle weak symbols and weak words.
- How to use Farnsworth spacing without changing character rhythm.
- How teachers can adapt the plan for warm-ups, stations, homework, and review sheets.

Do not keyword-stuff. The page should be useful even if nobody cared about SEO.

## Global page-by-page audit

After the major changes, inspect every route one at a time. Do not skip this. Make small consistency fixes only unless this prompt specifically calls for a page overhaul.

For each route/page, check:

- Does it match the home page visual rhythm?
- Does the H1 match page intent?
- Is meta title/description unique and useful?
- Is canonical URL correct?
- Is structured data consistent with visible content?
- Do internal links point to real routes only?
- Do important buttons have appropriate icons?
- Do buttons have cursor, hover, focus, and disabled states?
- Are warnings/errors specific and calm?
- Are strobe warnings labelled as `Strobe warning`?
- Are inputs labelled?
- Is keyboard operation preserved?
- Is mobile layout usable?
- Is print/export output clean where relevant?
- Is user-generated text kept out of analytics?

### Route-specific audit checklist

#### `app/routes/home.tsx` and translator components

- Keep home page as source of truth.
- Audit `TranslatorSectionsBasic.tsx` warning/error copy.
- Flash warnings must use `Strobe warning` + `WarningIcon`.
- Unsupported character messages should be specific.
- Copy/share/audio/save buttons should use suitable icons.

#### `app/routes/audio.tsx`, `app/routes/morse-code-sound-generator.tsx`, and related audio components

- Audit `app/client/components/audio/MorseAudioTranslator.tsx` and `app/client/components/morse-code-sound-generator/MorseAudioTranslator.tsx`.
- Use icons for play, stop, copy, save/export, settings, clear, flash, and warning.
- Strobe warning should be visible near the flash toggle.
- Export errors should be specific and inline.
- Do not send raw message content to analytics.

#### `app/routes/morse-code-audio-practice.tsx`

- Strobe warning copy and icon.
- Flash toggle/button must be clearly tied to warning.
- Play/repeat/reset buttons need appropriate icons and focus styles.
- SEO/how-it-works should remain useful and not bloated.

#### `app/routes/morse-code-audio-quiz.tsx`

- Strobe warning copy and icon.
- Quiz buttons need icons where useful: play, check, next, reset, share.
- Check answer feedback should be non-color-only.
- Ensure quiz reset/share behavior still works.

#### `app/routes/morse-code-visual-practice.tsx`

- Warning should appear before or directly beside `Flash message`.
- Use `WarningIcon` for strobe warning.
- `Reveal answer` / `Hide answer` should use visibility icons.
- Flash button should have focus styles.
- Keep short-message guidance.

#### `app/routes/morse-code-visual-quiz.tsx`

- Same strobe warning/icon/focus requirements.
- `Check answer`, `Next prompt`, `Skip`, and `Try again` need appropriate icons where helpful.
- Keep share results working.
- Keep typo redirect separate; no internal links to `/morse-code-vidual-quiz`.

#### `app/routes/morse-code-word-search-builder.tsx`

- Perform the major rebuild described above.
- This route should become print-quality and Morse-specific.

#### `app/routes/morse-code-word-trainer.tsx`

- Perform the major overhaul described above.

#### `app/routes/morse-code-practice-plan.tsx`

- Add expanded SEO/use-case content described above.

#### `app/routes/morse-code-printable-chart.tsx`

- Keep this as the print/export quality bar.
- Add icons to quick buttons, download, share, remove logo, answer key toggles where useful.
- Replace browser alerts with inline status where practical.
- Do not break PDF/image export.

#### `app/routes/practice.tsx` and `app/client/components/practice/PracticePage.tsx`

- Audit icons on start/check/next/share/reset controls.
- Feedback should be specific and non-color-only.
- Preserve weak-symbol behavior and best-streak behavior.

#### `app/routes/typing.tsx` and typing components

- Audit icons for start/reset/share controls.
- Preserve typing behavior and stats.
- Check focus management and mobile usability.

#### `app/routes/morse-code-sentence-practice.tsx` and sentence components

- Audit icons and button states.
- Feedback should be clear.
- Preserve sentence drill and share results.

#### Reference and learning routes

Inspect these one by one and make only consistency fixes unless a bug is found:

- `app/routes/morse-code-alphabet.tsx`
- `app/routes/morse-code-words.tsx`
- `app/routes/morse-code-word-separator.tsx`
- `app/routes/morse-code-timing.tsx`
- `app/routes/farnsworth-timing.tsx`
- `app/routes/learn-morse-code.tsx`
- `app/routes/international-morse-code-reference.tsx`
- `app/routes/morse-code-prosigns.tsx`
- `app/routes/morse-code-q-codes.tsx`
- `app/routes/morse-code-punctuation.tsx`
- `app/routes/morse-code-sos.tsx`
- `app/routes/the-quick-brown-fox-morse-code.tsx`
- `app/routes/how-to-use.tsx`
- `app/routes/dictionary.tsx`
- `app/routes/about.tsx`
- `app/routes/sources.tsx`

Check:

- Meta/canonical/schema.
- CTA links.
- Icon usage on buttons.
- Warning/error wording if any.
- Layout consistency with home.

#### Redirect/legal/sitemap routes

Inspect but do not over-edit:

- `app/routes/morse-code-translator.tsx`
- `app/routes/morse-code-audio-generator.tsx`
- `app/routes/morse-code-vidual-quiz.tsx`
- `app/routes/sitemap.tsx`
- `app/routes/misc/misc.tsx`
- `app/routes/misc/misc.cookies-policy.tsx`
- `app/routes/misc/misc.privacy-policy.tsx`
- `app/routes/misc/misc.socials.tsx`
- `app/routes/misc/misc.terms-of-service.tsx`

Keep redirects and legal copy stable unless there is a clear link/route bug.

## Acceptance criteria

The work is done only when:

- Word-search clues are Morse; the grid is alphabet letters.
- Plain answer list is hidden by default.
- Word-search answer reveal works.
- Student print and answered print are separate and clean.
- Word-search board updates when words/settings change.
- `Generate new puzzle` genuinely reshuffles placements/filler letters.
- Placement failures are specific and actionable.
- Word-search route has QR code and MorseWords branding in print output.
- Word-search route has a real SEO/use-case section.
- Word trainer has a much better training flow, deck controls, weak-word flow, and richer feedback.
- Practice plan has a much richer practical SEO/use-case section.
- New direct inline SVG icons exist in `Icons.tsx` and are used appropriately.
- No runtime icon library was added.
- Strobe warnings are labelled and styled correctly everywhere flash/light output exists.
- Warning/error messages are specific and not misleading.
- Buttons have correct icons, cursor, hover, focus, and disabled states.
- Internal links point to existing routes only.
- Canonical URLs are unchanged unless a direct bug required a fix.
- The typo visual quiz redirect remains functional but is not linked internally.
- Print/export features still work.
- Mobile layouts are not cramped.
- Accessibility basics are preserved or improved.
- Raw user input is not sent to analytics.

## Verification

Run the available checks in the actual repo:

- `npm run typecheck`
- `npm run build`
- `npm run lint` only if the live repo has that script
- tests only if the live repo has test commands

If `package.json` or a command is missing in the actual environment, report that explicitly. Do not claim checks passed if they were not run.

Also manually verify:

1. Add a new word to the word-search input and confirm the grid updates.
2. Click `Generate new puzzle` and confirm placements/filler letters change.
3. Reveal answers and confirm highlighted cells match placement metadata.
4. Print student puzzle and confirm no plain answers unless enabled.
5. Print answered version and confirm solved grid + answer list appear.
6. Toggle QR/branding and confirm print output follows the setting.
7. Use word trainer in both modes.
8. Use custom word list and weak-word review.
9. Use audio and visual flash controls and confirm strobe warning is visible and labelled.
10. Check mobile layout for word search, word trainer, and practice plan.
