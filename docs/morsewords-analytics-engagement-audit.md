# MorseWords Analytics Engagement Audit - June 2026

Branch: `morsewords-analytics-engagement-audit-jun-2026`
Base requested: `main` at `58201b72c96f44b0564dd54e88a70a6b4855b587`

## Inputs

- Bounce-rate data: provided in the task prompt and used for prioritization.
- Frustrated-click, rage-click, dead-click, and error rows: not available to
  this local Codex run. No rows were found in the repo/session search, so this
  report accounts for the missing table explicitly and does not invent values.
- iLoveSVG analytics: not used.

## Method

- Read `AGENTS.md` first.
- Inspected route/component code for priority and benchmark pages.
- Ran the local app at `http://localhost:3101` for initial inspection, then
  used the production build on `http://localhost:3201` for final Playwright
  validation to avoid the noisy Vite watcher around the existing temp folder.
- Used rendered browser checks for first viewport visibility, mobile overflow,
  console errors/warnings, and obvious control/link state.
- Confirmed fixes only where local inspection showed a real issue.

## Audited Pages

| Path | Type | Analytics reason | Visitors / views / bounce | Frustrated / rage clicks | Dead clicks | Errors | Bounce read | Confirmed issue | Fix status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/morse-code-encoder` | tool | Highest meaningful-traffic bounce among tools | 155 / 160 / 97.2% | Unavailable | Unavailable | Unavailable locally; rendered console clean | Suspicious | Primary input/output, copy, share, save, examples, and tool controls render above the fold on desktop; mobile shows input above fold but output below due normal stacking. No page-level bug confirmed. | Left unchanged unless later tests reveal an interaction bug. |
| `/morse-code-chart` | reference | High bounce with meaningful traffic | 29 / 38 / 90.9% | Unavailable | Unavailable | Unavailable locally; rendered console clean | Suspicious | Chart is visible quickly on desktop, but mobile first viewport spent space on duplicate printable-chart CTAs and did not expose audio-practice or language next steps requested by the audit. | Removed the duplicate printable CTA, added Audio practice to chart navigation, moved Morse by Language to lower next steps, and tightened nav spacing so the A-Z section enters the first mobile viewport. |
| `/morse-code-numbers` | reference | High bounce with meaningful traffic | 57 / 70 / 74.5% | Unavailable | Unavailable | Unavailable locally; rendered console clean | Suspicious | Direct answer is above the fold; 0-9 chart starts in the first desktop viewport and is linked on mobile. Examples and practice links already exist. | Left unchanged. |
| `/morse-code-alphabet` | reference | Meaningful traffic and high bounce | 113 / 146 / 59.2% | Unavailable | Unavailable | Unavailable locally; rendered console clean | Mildly suspicious | A-Z chart is visible quickly, but useful next links to printable chart, audio practice, language reference, and punctuation were missing. | Added focused next-step links without pushing the A-Z chart farther down the first screen. |
| `/dictionary` | reference | Meaningful traffic and high bounce | 41 / 84 / 60.4% | Unavailable | Unavailable | Unavailable locally; rendered console clean | Suspicious | Search is obvious, but a no-match filter left empty sections/tables with no recovery message or clear action. | Added live match count, clear filter action, and per-section no-match messages. |
| `/international-morse-code-reference` | reference | High bounce reference hub | 26 / 33 / 65.4% | Unavailable | Unavailable | Unavailable locally; rendered console clean | Suspicious | The page works as a hub, but top quick navigation omitted numbers, punctuation, prosigns, and practice links expected for this intent. | Added number chart, punctuation, prosigns, and practice quick links. |
| `/how-to-use` | navigation/help | High bounce, low traffic | 12 / 27 / 80% | Unavailable | Unavailable | Unavailable locally; rendered console clean | Suspicious but tiny sample | First viewport is action-oriented and links to translate, decode, hear, and practice. No confirmed issue beyond low-sample bounce. | Left unchanged. |
| `/how-to-separate-words-in-morse-code` | direct-answer | High bounce, low traffic | 15 / 17 / 78.6% | Unavailable | Unavailable | Unavailable locally; rendered console clean | Suspicious but tiny sample | Immediate answer and examples exist; word separator was linked, but timing was missing from the top related links despite timing being part of the query. | Added Timing guide to the related links. |
| `/morse-code-visual-quiz` | quiz/practice | 100% bounce and interaction expectation | 14 / 23 / 100% | Unavailable | Unavailable | Unavailable locally; rendered console clean | Suspicious | On mobile, the share-results button appeared before the actual flash/check workflow, and the `Flash prompt` start action was below the first viewport. The strobe warning only appeared after flashing had started. | Added a first-screen Start quiz link, hid Share results until progress exists, and show the strobe warning before the flash control. |
| `/morse-code-practice-plan` | navigation/help | 100% bounce, tiny direct-answer sample | 8 / 8 / 100% | Unavailable | Unavailable | Unavailable locally; rendered console clean | Suspicious but tiny sample | First viewport has clear Start practice, Audio practice, and Print review actions; routine content is specific and substantial. | Left unchanged. |
| `/contact` | contact | 100% bounce, tiny sample; do not build form | 7 / 8 / 100% | Unavailable | Unavailable | Unavailable locally; rendered console clean | Suspicious but tiny sample | Existing email contact path is obvious and no Resend/form work is appropriate for this branch. | Left unchanged. |
| `/audio` | tool benchmark | Good engagement comparison | 1973 / 2939 / 21.1% | Unavailable | Unavailable | Unavailable locally; rendered console clean | Normal | Tool-first layout, visible input, audio/export controls, and next links are strong benchmark patterns. | Benchmark only. |
| `/practice` | quiz/practice benchmark | Good engagement comparison | 167 / 287 / 18.4% | Unavailable | Unavailable | Unavailable locally; rendered console clean | Normal | Start controls are obvious above the fold. | Benchmark only. |
| `/morse-code-sound-generator` | tool benchmark | Good engagement comparison | 205 / 269 / 11.9% | Unavailable | Unavailable | Unavailable locally; rendered console clean | Normal | Tool layout matches audio-style controls and keeps input/actions high on page. | Benchmark only. |
| `/morse-code-audio-decoder` | tool benchmark | Moderate bounce comparison | 49 / 102 / 25.5% | Unavailable | Unavailable | Unavailable locally; rendered console clean | Normal | Upload and decode controls appear in the first viewport. | Benchmark only. |
| `/morse-code-book-translator` | tool benchmark | Good engagement comparison | 8 / 114 / 12.5% | Unavailable | Unavailable | Unavailable locally; rendered console clean | Normal | Long-text tool shows source input in first viewport. | Benchmark only. |
| `/morse-code-books` | navigation/reference benchmark | 0% bounce, tiny visitor count | 3 / 131 / 0% | Unavailable | Unavailable | Unavailable locally; rendered console clean | Normal but tiny sample | Library search and book cards are visible quickly. | Benchmark only. |

## Confirmed Fix List

1. `/dictionary`: add no-match feedback and recovery action for the filter.
2. `/morse-code-visual-quiz`: make the start action clear on mobile before
   sharing, and show the strobe warning before the flashing control.
3. `/morse-code-chart`: remove duplicate printable-chart first-screen CTA, add
   useful next-step links requested by the audit, and keep the A-Z chart section
   inside the first mobile viewport.
4. `/morse-code-alphabet`: add focused next links to printable chart, audio
   practice, language reference, and punctuation.
5. `/international-morse-code-reference`: add top quick links for numbers,
   punctuation, prosigns, and practice.
6. `/how-to-separate-words-in-morse-code`: add the timing guide as a relevant
   next step.
