# MorseWords Practice and Typing Control Map

This is an audit and planning document for the next Phase 2 consolidation
batch. It maps practice, typing, quiz, trainer, and related result-control
surfaces before any behavior-heavy controls are refactored.

Runtime behavior was not changed for this pass. This document does not
introduce dark mode, theme tokens, route changes, content changes, or new
visual systems.

## Scope Summary

- Inspected active practice, typing, sentence-practice, trainer, audio quiz,
  visual quiz, visual practice, audio practice, and word-search controls.
- Inspected shared action controls in
  `app/client/components/shared/ActionControls.tsx`.
- Inspected shared icons in `app/client/assets/svg/Icons.tsx`.
- Found several safe shared-control users, especially result share controls.
- Found several local control groups that are tightly coupled to scoring,
  timers, reveal state, audio playback, flash timers, and print/share output.
- Found helper components that are not rendered directly but still expose types
  used by active pages.

## Route and Component Inventory

| Route or surface | Main file | Child/control files | Controls present | State present | Persistence/query | Shared action use |
| --- | --- | --- | --- | --- | --- | --- |
| `/practice` | `app/routes/practice.tsx` -> `app/client/components/practice/PracticePage.tsx` | `PromptCard.tsx`, `PracticeControls.tsx` types, `practiceEngine.ts`, `ToggleChip`, `ShareResultsButton.tsx` | mode, pool, answer input, check, next, clear, skip, restart, share | scoring, attempts, completed count, streak, best streak, solved state, prompt state | localStorage for pool, per-pool mode, per-pool best streak. No query params found. | Uses `ShareResultsButton`, which uses `ActionControls`. Uses `ToolButton`, `ToggleChip`, and `toolControlButtonClass` locally. |
| practice helper surface | `app/client/components/practice/PracticeControls.tsx` | `Button`, `ToggleChip` | mode, pool, new prompt, reset stats | props only | No persistence. Imported for `DrillMode` and `Pool` types by active code. Default component is not rendered by active page. | Does not use `ActionControls`. Leave until a separate type/helper cleanup pass. |
| practice stats helper | `app/client/components/practice/StatsBar.tsx` | none | static stat chips | props only | No persistence. No active import found. | No action controls. Leave until a separate removal validation pass. |
| `/typing` | `app/routes/typing.tsx` -> `app/client/components/typing/TypingPage.tsx` | `TypingControls.tsx` type, `typingEngine.ts`, `Button`, `typing/components/ShareResultsButton.tsx` | duration buttons, pause/resume, reset, input-mode buttons, stats toggle, textarea, copy decoded, clear, on-screen keys, completion modal, share/download result controls | timer/session machine, raw input, decoded output, mode, stats visibility, completion modal, elapsed time, remaining time | localStorage for input mode, stats visibility, duration. No query params found. | Uses `copyTextToClipboard`. Uses local `Button`. Typing share modal does not yet use `ActionControls`. |
| typing helper surface | `app/client/components/typing/TypingControls.tsx` | `ToggleChip` | input mode, show/hide stats | props only | No persistence. Imported for `InputMode` type by active page. Default component is not rendered by active page. | Does not use `ActionControls`. Leave until a separate type/helper cleanup pass. |
| typing stats helper | `app/client/components/typing/TypingStatsBar.tsx` | none | static stats | interval clock | No active import found. | No action controls. Leave until a separate removal validation pass. |
| `/morse-code-sentence-practice` | `app/routes/morse-code-sentence-practice.tsx` -> `app/client/components/morse-code-sentence-practice/SentencePracticePage.tsx` | `SentencePracticeData.ts`, `SentencePracticeFaq.tsx`, `ShareResultsButton.tsx`, local `CopyButton`, local `ToggleButton` | mode, difficulty, set filter, answer textarea, check, next, clear, hints, reveal, skip, restart, share, library copy | scoring, attempts, skipped count, completed count, streak, best streak, active prompt, reveal/hint flags, answer feedback | localStorage for mode, difficulty, set, best streak. No query params found. | Uses shared `copyTextToClipboard` and shared practice `ShareResultsButton`. Local copy button already wraps `ActionButton`. |
| `/morse-code-word-trainer` | `app/routes/morse-code-word-trainer.tsx` | local `ChoiceButton`, local `ToolButton`, `FeedbackCard`, `SliderRow`, `MiniLink`, shared practice `ShareResultsButton` | shuffle, reset, practice weak words, word-list choices, custom input, answer mode, play, reveal, mark weak, answer input, check, try again, skip/next, new round, weak-word copy/clear/play | deck source, deck seed, prompt index, answer state, feedback, show answer, weak words, scoring, streak, best streak, round complete, audio settings | localStorage for custom words and best streak. No query params found. | Uses `copyTextToClipboard` for weak words and shared practice `ShareResultsButton`. Most action buttons are route-local. |
| `/morse-code-audio-practice` | `app/routes/morse-code-audio-practice.tsx` | `useMorseAudio`, `audioPromptBank`, local `TogglePill`, local `SliderRow`, `StrobeWarning` | difficulty, answer textarea, play, stop, check, reveal, next, skip, reset, advanced settings, sound/repeat/flash toggles, sliders | audio player state, hidden prompt, feedback, attempts, completed, skipped, correct, streak, best streak, flash event state, advanced panel | localStorage for difficulty and best streak. No query params found. | Does not use `ActionControls` for primary controls. Uses shared icons and `toolControlButtonClass`. |
| `/morse-code-audio-quiz` | `app/routes/morse-code-audio-quiz.tsx` | `useMorseAudio`, `audioPromptBank`, `QuizComplete`, local `TogglePill`, local `SliderRow`, shared practice `ShareResultsButton` | difficulty, share, answer textarea, play, stop, check, next/finish, skip, try again, advanced settings, sound/repeat/flash toggles, sliders | fixed deck, deck seed, index, feedback, scoring, skipped count, streak, best streak, run start, game over, audio player state, flash event state | localStorage for difficulty and best streak. No query params found. | Uses shared practice `ShareResultsButton`. Other controls are local. |
| `/morse-code-visual-practice` | `app/routes/morse-code-visual-practice.tsx` | local `useVisualPlayback`, local `SliderRow`, `StrobeWarning` | message input, flash message, reveal/hide answer, speed sliders | flash timers, active light, show answer, has-flashed warning gate | No localStorage and no query params found. | Does not use `ActionControls`. Uses shared icons and `toolControlButtonClass`. |
| `/morse-code-visual-quiz` | `app/routes/morse-code-visual-quiz.tsx` | local `useFlash`, local `SliderRow`, shared practice `ShareResultsButton`, `StrobeWarning` | flash prompt, answer input, check, next/finish, skip, try again, share, speed sliders | flash timers, fixed prompts, checked flag, solved flag, scoring, streak, best streak, run start, game over, has-flashed warning gate | localStorage for best streak. No query params found. | Uses shared practice `ShareResultsButton`. Other controls are local. |
| `/morse-code-vidual-quiz` | `app/routes/morse-code-vidual-quiz.tsx` | redirect only | none | none | redirects to `/morse-code-visual-quiz` | none |
| `/morse-code-word-search-builder` | `app/routes/morse-code-word-search-builder.tsx` | local `ToolButton`, `CheckToggle`, `ControlGroup`, `StatusNotice`, `WordSearchPreview`, print/share helpers | generate, reveal answer, word textarea, title, instructions, name/date toggles, grid slider, difficulty buttons, backwards toggle, print-output buttons, print, share, branding/QR toggles | puzzle seed, parsed word list, grid result, answer key, print selection, QR generation, status, share loading | No localStorage and no query params found. Share fallback copies canonical URL. | Uses `copyTextToClipboard` for share fallback. Most controls are local. |
| `/morse-code-practice-plan` | `app/routes/morse-code-practice-plan.tsx` | `ActionLinks`, `PlanList` | content navigation links only | none | no behavior-heavy control state | Uses shared `ActionLinks`; not a target for this pass. |

## Control-State Matrix

### General Practice: `/practice`

| Control | Type and current style | State behavior | Handler and state dependencies | Accessibility and keyboard | Consolidation note |
| --- | --- | --- | --- | --- | --- |
| Text -> Morse, Morse -> Text, Mixed | Buttons using `toolControlButtonClass`, responsive flex row | Active mode is persisted per pool. Changing mode resets prompt and answer state. | `setMode`, mode localStorage, prompt reset helpers | Native buttons with visible text and `aria-pressed` where rendered locally. | B: consolidate only after screenshots because mode changes reset drill state. |
| Pool chips | `ToggleChip` buttons | Active pool changes prompt bank and stored mode key. | `setPool`, `randomPrompt`, pool localStorage | Native toggle-style buttons, visible labels | B: shared chip extraction can wait for all practice pool surfaces. |
| Answer input | Text input or textarea in tool panel | Enter checks when unsolved and moves next when solved. | `answer`, `solvedThisQuestion`, `doCheck`, `next` | Labelled as practice answer. Keyboard logic is part of scoring flow. | C: leave local. |
| Check | `ToolButton` dark | Disabled when answer is empty. Counts every check as an attempt. First correct answer locks the question. | `doCheck`, `answer`, `attempts`, `correct`, `streak`, `bestStreak`, `solvedThisQuestion` | Native button with accessible label. | C: scoring side effects make this local. |
| Next / Finish | `ToolButton` dark | Replaces Check after solved. Completes or advances session. | `next`, `completed`, `TOTAL_QUESTIONS`, `solvedThisQuestion` | Enter key also advances after solved. | C: tied to solved and session completion state. |
| Clear | `ToolButton` light | Disabled while empty. Clears current answer only. | `setAnswer("")` | Native disabled behavior. | A/B: simple, but batch with related practice controls only. |
| Skip | `ToolButton` light | Disabled after question is solved. Unsolved skip breaks streak and advances. | `next`, `solvedThisQuestion`, `streak`, `completed` | Native disabled behavior. | C: skip is part of scoring/streak logic. |
| Restart / Try again | `ToolButton` light or dark depending location | Resets stats, prompt, answer, and run state. | `resetStats` | Native button with visible text and labels. | B: can use shared visual control later, but only with interaction tests. |
| Share | Shared practice `ShareResultsButton` | Opens canvas preview modal, optional native share, download PNG. | `runStartedAt`, attempts, correct, progress, streak, best streak | Trigger has accessible name. Dialog has modal roles. | Already consolidated. |

### Typing Practice: `/typing`

| Control | Type and current style | State behavior | Handler and state dependencies | Accessibility and keyboard | Consolidation note |
| --- | --- | --- | --- | --- | --- |
| Duration presets | Raw buttons with active route-local classes | Clicks are ignored while session is running but buttons are not native-disabled. Duration persists locally. | `setDurationSec`, `sessionState`, duration localStorage | Visible labels and `aria-label`. Focusable while running by design. | C: preserve unusual disabled behavior until a dedicated pass. |
| Pause / Resume | Shared `Button` | Enabled only while running or paused. Toggles timer state. | `pauseSession`, `resumeSession`, `sessionState`, remaining time refs | Native disabled button with changing visible text and aria-label. | C: timer state makes this local. |
| Reset | Shared `Button` ghost | Disabled when idle and raw input is empty. Clears timer and input. | `resetSession`, `sessionState`, `raw` | Native disabled button. | B: possible later with timer interaction tests. |
| Input mode buttons | Raw buttons | Changes dotdash vs F/J input mode. Persists locally. | `setInputMode`, `LS_INPUT_MODE` | Native buttons with `aria-pressed` and visible text. | B: could use shared chip once typing screenshots are locked. |
| Hide / Show stats | Raw button | Toggles stats section and persists locally. | `setShowStats`, `LS_SHOW_STATS` | Native button with visible text and aria-label. | B: simple but visual surface is route-specific. |
| Typing textarea | Textarea | Read-only when paused or done. Blocks newlines. Maps F/J keys in F/J mode. Focus is restored in several flows. | `handleInputChange`, `handleTypingKeyDown`, `appendSymbol`, `sessionState`, `inputMode` | Labelled "Morse typing input". Escape globally refocuses the input. | C: leave local. |
| Copy decoded | Shared `Button` plus `copyTextToClipboard` | Copies decoded output and refocuses input. No visible copied state today. | `copyDecoded`, `decoded.decoded`, input ref | Native button with accessible label. | D: possible shared helper for copy-with-refocus, not a visual component. |
| Clear scratchpad | Shared `Button` ghost | Disabled when raw input is empty. Clears raw input and output. | `resetSession`, `raw` | Native disabled button. | B: possible later with typing input regression tests. |
| On-screen Dit/Dah/Space/Word/Backspace/Clear | Shared `Button` controls | Dot/dash/space/word start session. Backspace and clear have special behavior. Disabled/read-only behavior comes from session guard. | `appendSymbol`, `ensureRunning`, `sessionState`, `raw` | Native buttons with visible text. | C: leave local due auto-start and keyboard equivalence. |
| Completion modal close | Raw icon/text button | Hides modal only. Does not reset session. | `setShowEndScreen(false)` | Close button currently relies on visible symbol/text behavior. | B: only with modal screenshot and a11y check. |
| Completion restart | Shared `Button` | Resets session from done state. | `resetSession` | Native button with accessible label. | B: safe only with done-state tests. |
| Typing share/download | `typing/components/ShareResultsButton.tsx`, local `Button` and raw anchor | Opens preview, generates PNG, supports native share, and downloads `morse-typing-results.png`. | `open`, `pngBlob`, `pngUrl`, `busy`, `canShare`, `renderShareImage` | Trigger and native share button have aria-labels. Dialog has role and title. | A: safest next consolidation target. Use `ActionButton` and `ActionLinkButton` without changing canvas or filenames. |

### Sentence Practice: `/morse-code-sentence-practice`

| Control | Type and current style | State behavior | Handler and state dependencies | Accessibility and keyboard | Consolidation note |
| --- | --- | --- | --- | --- | --- |
| Mode buttons | Buttons using `toolControlButtonClass` | Mode changes reset active drill after initial sync. | `setMode`, storage sync, prompt reset effect | Native buttons with visible labels and active styling. | B: only after setting-reset tests. |
| Difficulty and set filters | Local `ToggleButton` around `toolControlButtonClass` | Changing filter changes drill pool and resets run. | `setDifficulty`, `setSetFilter`, reset effect | Native toggle buttons. | B: similar to other chips but stateful. |
| Answer textarea | Textarea | Disabled after solved or game over. Ctrl/Cmd+Enter checks or advances. | `answer`, `gameOver`, `solvedThisQuestion`, `doCheck`, `nextQuestion` | Labelled answer field. Keyboard shortcut affects scoring flow. | C: leave local. |
| Check sentence | Shared `Button` primary | Disabled while answer is empty. Counts attempts and sets feedback. | `doCheck`, `answer`, `feedback`, scoring state | Native disabled button. | C: scoring side effects. |
| Next sentence | Shared `Button` primary | Replaces Check after solved. Uses lock ref to avoid double advance. | `nextQuestion`, `advanceLockedRef`, completed count | Native button. | C: lock and session completion risk. |
| Clear | Shared `Button` secondary | Disabled for empty or solved answer. Clears answer and feedback. | `setAnswer`, `setFeedback` | Native disabled button. | B: small but should stay with sentence route tests. |
| Show hints | Shared `Button` ghost | Toggles hint panel, no scoring change. | `setShowHint` | Native button with visible state text. | A/B: visually safe, but route screenshot needed. |
| Reveal answer | Shared `Button` ghost | Toggles answer reveal and does not score. | `setShowAnswer` | Native button with visible state text. | B: reveal semantics need tests. |
| Skip sentence | Shared `Button` ghost | Disabled when solved. Increments skipped and advances. | `skipQuestion`, `advanceQuestion`, `skipped`, `streak` | Native disabled button. | C: scoring and skip state. |
| Library copy | Local `CopyButton` with `ActionButton` | Copies sentence text, shows copied state for 1200ms. | `copyTextToClipboard`, `copied`, timeout | Native button. | Already partly consolidated. |
| Share and restart | Shared practice share and `Button` | Share image uses stats. Restart resets run. | `ShareResultsButton`, `resetRun` | Dialog accessible through shared component. | Share already consolidated. Restart is B. |

### Word Trainer: `/morse-code-word-trainer`

| Control | Type and current style | State behavior | Handler and state dependencies | Accessibility and keyboard | Consolidation note |
| --- | --- | --- | --- | --- | --- |
| Shuffle deck | Local `ToolButton` | Disabled if deck is empty. Updates seed and prompt. | `shuffleDeck`, `deck.length`, `deckSeed` | Native disabled button. | B: visual-safe but deck regression needed. |
| Reset session | Local `ToolButton` | Clears scoring, answer, feedback, prompt index, and deck source. | `resetSession` | Native button. | C: broad state reset. |
| Practice weak words | Local `ToolButton` | Disabled when no weak words. Switches deck source. | `practiceWeakWords`, `weakWords` | Native disabled button. | C: deck-source behavior. |
| Word list and answer mode choices | Local `ChoiceButton` | Changes source words or prompt direction and reseeds. | `setSelectedList`, `setMode`, `deckSeed` | Native active buttons. | B: only with trainer screenshots. |
| Custom word textarea | Textarea | Updates custom word list and resets deck. | `updateCustomWords`, localStorage | Labelled text input. | C: content and deck behavior. |
| Play word | Local `ToolButton` with `PlayIcon` | Disabled with no active word. Starts audio playback. | `playActiveWord`, `activeWord`, audio settings | Native disabled button. | C: audio behavior. |
| Reveal / Hide answer | Local `ToolButton` with visibility icons | Disabled with no active word. Toggles answer panel. | `setShowAnswer`, `activeWord` | Native disabled button. | B/C: reveal state is tied to feedback. |
| Mark weak | Local `ToolButton` | Disabled with no active word. Adds word to weak set and advances. | `markWeakAndContinue`, `activeWord`, `weakWords`, `nextWord` | Native disabled button. | C: scoring and deck progression. |
| Check answer | Local `ToolButton` with `CheckCircleIcon` | Disabled for no active word or empty answer. Correct answer sets show answer. | `checkAnswer`, `feedback`, `answer`, scoring state | Enter key also checks or advances. | C: scoring side effects. |
| Try again | Local `ToolButton` | Disabled when there is nothing to clear. Clears answer and feedback. | `setAnswer`, `setFeedback` | Native disabled button. | B: possible with interaction tests. |
| Skip / next | Local `ToolButton` | Advances prompt or finishes round. | `nextWord`, `roundComplete`, `activeWord` | Native disabled behavior. | C: deck progression. |
| Weak word play/copy/clear | Raw icon buttons and local `ToolButton`s | Individual play starts audio. Copy uses clipboard status. Clear empties weak list. | `playWord`, `copyWeakWords`, `clearWeakWords`, `weakWordCopyStatus` | Buttons have visible text or icon titles. | B for copy/clear only, C for play. |
| Share results | Shared practice `ShareResultsButton` | Uses stats, not custom word text. | `runStartedAt`, scoring state | Shared modal semantics. | Already consolidated. |

### Audio Practice: `/morse-code-audio-practice`

| Control | Type and current style | State behavior | Handler and state dependencies | Accessibility and keyboard | Consolidation note |
| --- | --- | --- | --- | --- | --- |
| Difficulty buttons | Raw buttons using `toolControlButtonClass` | Persisted locally. Changing difficulty resets prompt, answer, feedback, and stops player after initial sync. | `setDifficulty`, prompt pool, localStorage, `player.stop` | Native buttons with `aria-pressed` and title text. | B: state reset and audio stop require tests. |
| Answer textarea | Textarea | Ctrl/Cmd+Enter checks. Editing clears feedback except reveal. | `answer`, `setFeedback`, `checkAnswer` | Labelled by surrounding label. | C: check/reveal coupling. |
| Play prompt | Raw button dark with `PlayIcon` | Restarts when already playing. Uses current timing and sound settings. | `playPrompt`, `player.play`, audio options | Native button with visible text. | C: audio player state. |
| Stop | Raw button with `StopIcon` | Disabled when player state is idle. | `player.stop`, `player.state` | Native disabled button. | B/C: simple visual but tied to player. |
| Check answer | Raw button with `CheckCircleIcon` | Disabled if answer empty, already correct, or revealed. Counts attempts. | `checkAnswer`, `normalizedAnswer`, `feedback`, scoring state | Native disabled button. | C: scoring and reveal lock. |
| Reveal answer | Raw button with `VisibilityIcon` | Disabled unless feedback is idle. Reveals answer and resets streak. | `revealAnswer`, `feedback`, `streak` | Native disabled button. | C: reveal/scoring semantics. |
| Next prompt / Skip / Reset | Raw buttons using `toolControlButtonClass` | Next increments completed. Skip increments skipped and resets streak. Reset clears stats and stops player. | `nextPrompt`, `resetSession`, player state | Native buttons. | C: scoring and audio reset. |
| Advanced settings toggle | Full-width raw button | Shows or hides local settings. | `setAdvancedOpen` | Native button with visible state text. | A/B: simple, but batch with audio settings only. |
| Sound, Repeat, Flash | Local `TogglePill` | Flash adds strobe warning and event listener display. | `setSoundOn`, `setRepeat`, `setFlash`, strobe ID | `aria-pressed`; flash uses `aria-describedby` only when warning visible. | C: flash warning placement is high-risk. |
| Sliders and preset select | Inputs/select | Some disabled when sound is off or sounder preset is active. | audio timing and sound states | Native form controls, range focus custom class | C: keep local until settings primitive exists. |

### Audio Quiz: `/morse-code-audio-quiz`

| Control | Type and current style | State behavior | Handler and state dependencies | Accessibility and keyboard | Consolidation note |
| --- | --- | --- | --- | --- | --- |
| Difficulty buttons | Raw buttons using `toolControlButtonClass` | Persisted locally. Changing difficulty resets quiz after initial hydration. | `setDifficulty`, `resetQuiz`, localStorage | Native buttons with `aria-pressed`. | B/C: quiz reset risk. |
| Share results | Shared practice `ShareResultsButton` | Available in stats row and final results. | scoring state and `runStartedAt` | Shared modal semantics. | Already consolidated. |
| Answer textarea | Textarea | Read-only after feedback. Ctrl/Cmd+Enter checks or advances. | `answer`, `feedback`, `checkAnswer`, `nextQuestion` | Labelled answer field. | C: leave local. |
| Play / Stop | Raw buttons with audio icons | Play starts run timer if needed. Stop disabled while idle. | `playPrompt`, `player.stop`, `player.state`, `runStartedAt` | Native buttons. | C: audio/run-start behavior. |
| Check answer | Raw button | Disabled while answer is empty. Counts attempts once per prompt. | `checkAnswer`, `normalizedAnswer`, `feedback`, scoring state | Native disabled button. | C: scoring side effects. |
| Next / Finish | Raw button dark | Replaces Check after feedback. Completes quiz at question ten. | `nextQuestion`, `completed`, `TOTAL_QUESTIONS` | Native button. | C: progression. |
| Skip question | Raw button | Disabled after feedback. Idle skip increments skipped and completed. | `nextQuestion`, `feedback`, `skipped`, `streak` | Native disabled button. | C: score model. |
| Try again | Raw button dark in final results | Resets deck and stats. | `resetQuiz` | Native button. | B: final state tests needed. |
| Advanced settings, toggles, sliders | Same local pattern as audio practice | Flash warning and disabled audio sliders are stateful. | `advancedOpen`, audio options, `flash` | Same a11y model as audio practice. | C: keep local for now. |

### Visual Practice: `/morse-code-visual-practice`

| Control | Type and current style | State behavior | Handler and state dependencies | Accessibility and keyboard | Consolidation note |
| --- | --- | --- | --- | --- | --- |
| Flash message | Raw dark button with `LightBulbIcon` | Starts visual timer sequence and then shows strobe warning for future state. | `flashMessage`, `useVisualPlayback`, `hasFlashed`, timers | `aria-describedby` points to warning after first flash. | C: flash timing and warning behavior. |
| Message input | Input | Changing message hides answer. | `setMessage`, `setShowAnswer(false)` | Labelled by visible "Message" text. | C: input behavior. |
| Speed sliders | Range inputs | Drive visual event timing. | `wpm`, `farnsworthWpm`, `morseVisualEvents` | Native range controls. | C: keep with timing logic. |
| Reveal / Hide answer | Raw button with visibility icons | Toggles message and Morse answer display. | `setShowAnswer`, `message`, `morse` | Native button, visible text changes. | B: simple but tied to reveal panel screenshot. |
| Visual light | `role="img"` status circle | Active class toggles from timers. | `active` from `useVisualPlayback` | aria-label changes on/off. | C: not an action control. |

### Visual Quiz: `/morse-code-visual-quiz`

| Control | Type and current style | State behavior | Handler and state dependencies | Accessibility and keyboard | Consolidation note |
| --- | --- | --- | --- | --- | --- |
| Share results | Shared practice `ShareResultsButton` | Available during run and final results. | scoring state and `runStartedAt` | Shared modal semantics. | Already consolidated. |
| Try again | Raw dark button in final results | Resets score, prompt index, answer, checked/solved, run start, and flash warning. | `resetQuiz` | Native button. | B/C: reset covers many states. |
| Flash prompt | Raw dark button with `LightBulbIcon` | Starts visual timer sequence and shows strobe warning after first flash. | `flashPrompt`, `useFlash`, `hasFlashed` | `aria-describedby` only after warning appears. | C: flash timing and strobe warning. |
| Answer input | Input | Enter checks when unsolved and advances when solved. Typing clears checked state. | `answer`, `solved`, `checked`, `checkAnswer`, `nextPrompt` | Labelled by visible text. | C: leave local. |
| Check answer | Raw button with `CheckCircleIcon` | Disabled when answer is empty. Counts attempts, locks if correct. | `checkAnswer`, `answer`, `solved`, scoring state | Native disabled button. | C: scoring logic. |
| Next / Finish | Raw dark button | Replaces Check after solved. | `nextPrompt`, `completed`, `TOTAL_QUESTIONS` | Native button. | C: progression. |
| Skip | Raw button with `RefreshIcon` | Disabled when solved. Unsolved skip breaks streak and advances. | `nextPrompt`, `solved`, `streak` | Native disabled button. | C: score model. |
| Speed sliders | Range inputs | Drive visual timer sequence. | `wpm`, `farnsworthWpm`, `morseVisualEvents` | Native range controls. | C: keep local. |

### Word Search Builder: `/morse-code-word-search-builder`

| Control | Type and current style | State behavior | Handler and state dependencies | Accessibility and keyboard | Consolidation note |
| --- | --- | --- | --- | --- | --- |
| Generate new puzzle | Local `ToolButton` with `ShuffleIcon` | Increments seed and clears answer key. | `generateNewPuzzle`, `puzzleSeed`, status | Native button. | B: visual wrapper can consolidate after puzzle test. |
| Reveal / Hide answer | Local `ToolButton` with visibility icon | Toggles preview and changes print selection to answer key when revealing. | `toggleAnswerKey`, `showAnswerKey`, `setPrintSelection` | Native button. | C: print-selection side effect. |
| Word list and detail inputs | Textarea/inputs | Updates parsed words, clears answer key and status. Enforces length limits. | `updatePuzzleInput`, `setTitle`, `setInstructions`, parser | Labelled controls. | C: not action controls. |
| Name/date/branding/QR toggles | Local `CheckToggle` buttons | Toggle settings that affect print HTML and preview. | setting state setters | `aria-pressed`, check/close icons with titles. | B: possible after print/preview screenshots. |
| Grid slider and difficulty buttons | Range and buttons | Rebuilds puzzle and clears answer key/status. | `updateSize`, `updateDifficulty`, puzzle memo | Native controls. | B/C: generation behavior. |
| Print output buttons | Local buttons in radiogroup | Changes `printSelection`. | `setPrintSelection` | `role="radiogroup"`, active via `aria-pressed`. | B: can consolidate only if visual parity holds. |
| Print selected output | Local `ToolButton` with `PrintIcon` | Disabled without placements. Builds print HTML and opens hidden iframe print view. | `printPuzzle`, `buildWordSearchPrintHtml`, `printHtml`, status | Native disabled button. | C: generated output and print behavior are high-risk. |
| Share puzzle | Local `ToolButton` with `ShareIcon` | Disabled without placements or while preparing. Generates PNG, tries Web Share with file, then URL, then download plus copied canonical link. | `sharePuzzle`, `isSharing`, `renderWordSearchShareImage`, `downloadBlob`, `copyTextToClipboard` | Native disabled button. | B/C: styling can consolidate only with generated filename/content checks. |
| Status notice | Static notice with icons | Shows success, info, or error after actions. | `status` | Not interactive. | C: static surface, not part of action controls. |

## Behavior-Risk Notes

### Scoring and Progression

- `/practice` increments attempts on every check and only locks after the first
  correct answer. Skipping before solving breaks the streak and advances.
- `/morse-code-sentence-practice` uses `advanceLockedRef` to prevent double
  advancement. This is a high-risk state transition to preserve.
- `/morse-code-word-trainer` has multiple progression paths: correct answer,
  try again, skip/next, mark weak, new round, and weak-word round.
- `/morse-code-audio-quiz` uses a fixed ten-question deck. Idle skip counts as
  skipped and advances progress without adding an attempt.
- `/morse-code-visual-quiz` keeps an incorrect prompt active. Misses count as
  attempts, but the user can keep trying before moving on.

### Timers and Playback

- `/typing` has the most complex timer state: idle, running, paused, done,
  pause offsets, remaining time, completion modal state, and a global Escape
  shortcut that refocuses the input.
- `/morse-code-audio-practice` and `/morse-code-audio-quiz` use
  `useMorseAudio`, live option syncing, player state, and stop behavior.
- `/morse-code-visual-practice` and `/morse-code-visual-quiz` manage timeout
  arrays for flash playback and must clear timers on unmount.
- Audio and visual flash controls also control strobe-warning visibility.

### Reveal, Check, and Skip Logic

- Reveal is not uniform across pages. Audio practice reveal sets feedback to
  `revealed` and disables checking. Sentence practice reveal only displays the
  answer and does not score. Word trainer reveal changes the answer panel while
  feedback can still matter. Visual practice reveal is unscored and open-ended.
- Skip is also not uniform. It can advance with a skipped count, break streak,
  or move to the next prompt without adding an attempt depending on route.
- Some controls change visible text instead of using separate buttons, such as
  Check -> Next, Play prompt -> Restart prompt, and Reveal -> Hide.

### Disabled and Keyboard Behavior

- Most disabled controls use native `disabled`, but `/typing` duration preset
  buttons intentionally remain focusable while running and ignore clicks rather
  than using native disabled behavior.
- `/typing` textarea uses `readOnly` when paused or done, not disabled, so it
  can preserve focus behavior and keyboard guards.
- Several Enter shortcuts call different handlers depending on solved or
  feedback state. These shortcuts must be covered before refactoring controls.

### Persistence and Hydration

- Practice, sentence practice, audio practice, audio quiz, visual quiz, typing,
  and word trainer read or write localStorage.
- No query-param dependency was found in the inspected practice, typing,
  trainer, quiz, or word-search surfaces. Query-prefill remains in translator
  and audio translator surfaces, outside this audit scope.
- Pages that read localStorage during initial state or hydration must preserve
  SSR-safe guards.

### Sharing, Download, and Print Output

- Shared practice `ShareResultsButton` intentionally excludes custom raw user
  text and only renders score-like stats.
- Typing share output is separate and currently downloads
  `morse-typing-results.png`.
- Word search share output generates a PNG filename from the title, attempts
  Web Share with file, falls back to URL share, then falls back to image
  download plus copying the canonical URL.
- Word search print output uses generated HTML and a hidden iframe. Any change
  to print controls must verify generated content and filenames remain
  unchanged.

## Consolidation Opportunities

| Class | Control group | Target component or helper | Exact files | Expected visual impact | Tests and screenshots needed |
| --- | --- | --- | --- | --- | --- |
| A | Typing result share modal buttons and download link | `ActionButton`, `ActionLinkButton`, shared `ShareIcon`/`SaveIcon` | `app/client/components/typing/components/ShareResultsButton.tsx` | None. Should match practice share modal control treatment. | `/typing` desktop/mobile screenshots in completed state and share modal. Interaction smoke for modal open, native share disabled/fallback state, and `morse-typing-results.png` download link. |
| A | Sentence library copy buttons are already using `ActionButton` and `copyTextToClipboard` | No source change needed | `app/client/components/morse-code-sentence-practice/SentencePracticePage.tsx` | None | Keep as reference for future copy controls. |
| B | Practice Clear/Restart visual buttons | `ActionButton` or existing `ToolButton` alignment only | `PracticePage.tsx` | Should be none, but verify button row wrapping. | `/practice` desktop/mobile, check answer, clear, skip, restart, share modal. |
| B | Word trainer weak-word Copy/Clear buttons | `ActionButton`, possibly `ActionRow` | `app/routes/morse-code-word-trainer.tsx` | Should be none if classes are preserved. | `/morse-code-word-trainer` desktop/mobile, weak-word creation, copy status, clear. |
| B | Word search non-print toggles and top buttons | `ActionButton` only where local `ToolButton` maps exactly | `app/routes/morse-code-word-search-builder.tsx` | Should be none, but answer-key and preview state must match. | Existing word-search tests plus screenshots before/after. |
| B | Audio and visual advanced settings show/hide controls | `ActionButton` or `ActionRow` only after settings snapshot | audio/visual practice and quiz route files | Should be none. | Strobe-warning tests plus screenshots with advanced settings open and closed. |
| C | Check, Next, Skip, Reveal, Play, Flash, and timer controls that affect scoring, playback, or reveal state | Leave local for now | practice, sentence, trainer, audio quiz/practice, visual quiz/practice, typing | None | Need route-specific interaction tests before any visual replacement. |
| D | Type-only helper cleanup for `PracticeControls.tsx` and `TypingControls.tsx` | Move `DrillMode`, `Pool`, and `InputMode` to small type modules | `PracticeControls.tsx`, `practiceEngine.ts`, `PracticePage.tsx`, `TypingControls.tsx`, `TypingPage.tsx` | None | Typecheck/build. No screenshots unless rendered components are deleted. |
| D | Copy helper that restores focus after copy | Small helper, not a visual component | `TypingPage.tsx` first, possibly other copy inputs later | None | Copy interaction test and focus assertion. |
| E | Removal of inactive `StatsBar.tsx` and `TypingStatsBar.tsx` | More investigation before deletion | `app/client/components/practice/StatsBar.tsx`, `app/client/components/typing/TypingStatsBar.tsx` | None if truly unused | Confirm no imports, typecheck, build, route smoke. Do not mix with visual control refactor. |

## Suggested Next Refactor Batch

Recommended next batch: consolidate only the typing result share controls.

Files:

- `app/client/components/typing/components/ShareResultsButton.tsx`

Routes/screens:

- `/typing`

Why this is the smallest safe batch:

- It is isolated from typing timer, input, keyboard, and scoring state.
- It duplicates the already-consolidated practice share modal control pattern.
- It should not touch generated canvas output, share text, file name, session
  timing, raw input, decoded output, or completion logic.
- It can reuse `ActionButton`, `ActionLinkButton`, and shared icons without
  adding variants.

Required checks for that batch:

- Before/after screenshots of `/typing` desktop and mobile after reaching a
  completed session state.
- Before/after screenshots of the typing share modal.
- Interaction smoke that the modal opens, closes, shows the generated preview,
  and keeps the download filename `morse-typing-results.png`.
- Existing validation: typecheck, build, lint if present, tests if present, and
  `git diff --check`.

Explicitly not in the next batch:

- Duration buttons.
- Pause/resume/reset timer controls.
- On-screen keyboard controls.
- Textarea keyboard mapping.
- Audio, flash, check, reveal, skip, or scoring controls.

## Dark-Mode Implications

These surfaces should be token-ready later, but no tokens should be implemented
until shared surfaces are stable:

- Disabled practice buttons, especially dark-panel disabled states.
- Correct, incorrect, missed, revealed, copied, status, and error messages.
- Score, streak, timer, progress, and best-streak badges.
- Typing completion modal and share-preview modal surfaces.
- Answer input fields, read-only fields, textarea placeholders, and range
  controls.
- Audio controls, sound/repeat/flash toggles, and strobe warning placement.
- Visual flash panels and active/inactive light states.
- Reveal answer panels and expected-answer output blocks.
- Word trainer weak-word lists, feedback cards, and custom word input.
- Word search preview, answer-key highlights, status notices, print/share
  buttons, and QR/branding panels.

Dark mode risk remains highest anywhere a route currently combines warm static
surfaces, dark output panels, disabled buttons, and scoring feedback in the same
view. These pages should receive shared component consolidation before any
dark-token rollout.

## Remaining Risks

- Practice and quiz controls are visually similar but behaviorally different.
  Consolidating by label alone would likely break scoring or disabled logic.
- Typing controls include timer and focus behavior that is easy to regress.
- Audio and visual flash controls are coupled to strobe-warning compliance.
- Word search print/share controls generate user-visible files and browser
  print behavior, so visual button consolidation must also verify output
  parity.
- Inactive helper files should not be deleted in the same pass as visual
  control consolidation. Move type exports first, validate, then remove dead
  rendered helpers only if still unused.
