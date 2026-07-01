# PostHog Behavior-Friction Review

## 1. Executive result

PostHog behavior-friction review passed.

The CSV identifies where to inspect; it does not prove the exact clicked element.

## 2. Data source summary

- Bounce export: 304 URL rows.
- Primary series: 7,049 visitors, 10,522 views, about 32.7% weighted bounce.
- Secondary series: 3,811 visitors, 7,268 views, about 38.1% weighted bounce.
- Rage/dead/error export: 45 URL rows, 1,419 primary rage clicks, 822 secondary rage clicks.
- Dead clicks: 0.
- Errors: 0.

## 3. Rage-click findings

The largest rage counts were on interactive pages: `/audio`, `/`, `/practice`,
`/morse-code-sound-generator`, sentence practice, MP3/audio tools, and typing.
Those pages naturally invite repeated clicks, replay attempts, answer checks,
and export attempts.

Confirmed issue: `/audio` WAV export had no visible busy, success, or error
status and did not prevent duplicate export clicks during rendering.

## 4. Bounce-rate findings

High-bounce utility/reference pages were inspected as narrow-intent pages, not
treated as broken by default. Encoder, decoder, alphabet, chart, dictionary,
visual quiz, how-to, practice-plan, word-separator, and timing routes already
provide direct answers, tools, or contextual next-step links.

## 5. Pages inspected

- `/audio`
- `/`
- `/practice`
- `/morse-code-sound-generator`
- `/morse-code-sentence-practice`
- `/morse-code-mp3-generator`
- `/morse-code-audio-decoder`
- `/morse-code-audio-practice`
- `/typing`
- `/morse-code-encoder`
- `/morse-code-decoder`
- `/morse-code-alphabet`
- `/morse-code-chart`
- `/dictionary`
- `/morse-code-visual-quiz`
- `/how-to-use`
- `/morse-code-practice-plan`
- `/how-to-separate-words-in-morse-code`
- `/morse-code-timing`

## 6. Confirmed UX issues

`/audio` WAV export could feel unresponsive. The page had solid playback and
copy states, but the export action silently rendered/downloaded or silently
failed.

## 7. Expected repeated-interaction findings

Home, practice, sentence practice, audio practice, visual quiz, typing, sound
generator, MP3 generator, and audio decoder all contain flows where repeated
clicks can be expected: replay, answer checking, skip/next, input controls,
download retries, or file analysis.

## 8. Fixes made

- Added `/audio` WAV export status: `Preparing WAV file...`, `WAV download started.`, and clean failure messages.
- Disabled duplicate `/audio` WAV export clicks while a render is in progress.
- Changed export labels to `Preparing WAV` during rendering.

## 9. Pages intentionally left unchanged

Encoder, decoder, alphabet, chart, dictionary, visual quiz, how-to-use,
practice-plan, word-separator, timing, home, practice, sound generator, MP3
generator, audio decoder, audio practice, and typing were left unchanged because
inspection did not confirm a broken or unclear click target.

## 10. Analytics/instrumentation gaps

The provided export is URL-level. It does not include clicked element labels,
rage-click clusters, session replay context, device class, or viewport size. No
targeted PostHog event naming was added because this branch did not find an
existing local analytics wrapper suitable for a narrow event-only patch.

## 11. Tests added/updated

Added `tests/qa-robustness-review/morse-posthog-friction.spec.ts`.

The test waits for `/audio` hydration, runs a short WAV export, verifies visible
completion feedback, and verifies a real `audio/wav` blob was created.

## 12. Remaining blockers

None.

## 13. Recommended next step

Merge behavior-friction branch to main, then rerun production deploy/final
sanity only after Netlify is serving the latest main.
