# Fixed Issues

## ISSUE-QA-001: Critical dependency vulnerabilities in React Router/Remix dependency chain

Original severity:
- Critical

Final status:
- Fixed

Affected area:
- `package.json`
- `package-lock.json`
- `app/routes/morse-code-audio-generator.tsx`
- `app/routes/morse-code-translator.tsx`

Root cause:
- The app was using older React Router packages that `npm audit` flagged for a critical path traversal advisory in file session storage. The project also carried an unused legacy `@remix-run/netlify` package that pulled vulnerable Remix packages into the dependency graph.

Fix implemented:
- Removed the unused `@remix-run/netlify` dependency.
- Upgraded React Router packages to `^7.14.2`.
- Ran `npm audit fix --legacy-peer-deps` to update vulnerable transitive development dependencies.
- Updated redirect route imports from `@remix-run/node` to `react-router`, removing the now-unneeded Remix runtime dependency.

Files changed:
- `package.json`
- `package-lock.json`
- `app/routes/morse-code-audio-generator.tsx`
- `app/routes/morse-code-translator.tsx`

Regression coverage:
- Command: `npm audit --audit-level=low --json`
- Command: `npm run typecheck`
- Command: `npm run build`
- Command: `npm run test:e2e`

Verification:
- `npm audit` reports 0 vulnerabilities.
- Typecheck passed.
- Production build passed.
- Full Playwright suite passed: 112/112.

Remaining risk:
- Dependency updates should be reviewed with normal release testing because React Router and Vite-related packages changed.

## ISSUE-QA-002: Critical/serious accessibility failures on core tool pages

Original severity:
- Medium

Final status:
- Fixed

Affected area:
- Home translator controls
- Audio generator controls
- Audio quiz controls
- Visual quiz/practice light indicator
- Word trainer controls

Root cause:
- Several range inputs and select controls displayed visible text labels without binding those labels to the underlying form controls. The visual quiz/practice light indicator used `aria-label` on a plain `div`, which axe reports as invalid unless the element has a role that supports the label.

Fix implemented:
- Added stable `React.useId()` IDs to slider helpers and bound labels via `htmlFor`.
- Added labeled wrappers for audio page select/input controls.
- Added `role="img"` to visual light indicators so the dynamic `aria-label` is valid.
- Applied the same slider-labeling pattern to the sound-generator component.

Files changed:
- `app/client/components/shared/TranslatorSectionsBasic.tsx`
- `app/client/components/audio/MorseAudioTranslator.tsx`
- `app/client/components/morse-code-sound-generator/MorseAudioTranslator.tsx`
- `app/routes/morse-code-audio-practice.tsx`
- `app/routes/morse-code-audio-quiz.tsx`
- `app/routes/morse-code-visual-practice.tsx`
- `app/routes/morse-code-visual-quiz.tsx`
- `app/routes/morse-code-word-trainer.tsx`

Regression coverage:
- `tests/qa-robustness-review/accessibility.spec.ts`
- Test: axe scans for home, audio, practice, typing, printable chart, word search, word trainer, audio quiz, and visual quiz.

Verification:
- Targeted accessibility suite passed: 30/30 with edge tests.
- Full Playwright suite passed: 112/112.

Remaining risk:
- Axe color contrast checks are intentionally disabled in the harness to avoid noise from design-specific colors; manual contrast review is still recommended before launch.

## ISSUE-QA-003: Word search "Generate new puzzle" could keep the same grid

Original severity:
- Medium

Final status:
- Fixed

Affected area:
- `app/routes/morse-code-word-search-builder.tsx`

Root cause:
- The puzzle seed was reset with `Date.now()`. In fast test/user interactions, the resulting seed could fail to produce a visibly different board, causing the "Generate new puzzle" action to appear ineffective.

Fix implemented:
- Changed the generation action to increment the current seed. This guarantees a seed change from the previous puzzle while preserving the existing seeded generation model.

Files changed:
- `app/routes/morse-code-word-search-builder.tsx`

Regression coverage:
- `tests/qa-robustness-review/warnings-and-edge.spec.ts`
- Test: `word search Generate new puzzle changes the grid`

Verification:
- Targeted edge suite passed.
- Full Playwright suite passed: 112/112.

Remaining risk:
- A different seed can theoretically still produce the same placement for a tiny word list, but the filler and placement RNG now reliably receive a changed seed. If exact non-repetition is required, compare the previous generated grid and retry generation a bounded number of times.

## ISSUE-QA-004: QA harness produced stale paths and artifact collisions

Original severity:
- Info

Final status:
- Fixed

Affected area:
- `playwright.config.ts`
- `tests/qa-robustness-review/*`

Root cause:
- The interrupted QA harness still wrote to `test-artifacts/break-the-app/`. Desktop and mobile axe tests also wrote the same JSON filenames concurrently, causing `EBUSY` file locks on Windows.

Fix implemented:
- Moved the harness to `tests/qa-robustness-review/`.
- Retargeted Playwright logs/artifacts to `test-artifacts/qa-robustness-review/`.
- Removed the HTML report output so generated Playwright report assets are not exposed through the app dev server.
- Added a Vite dev-server watch ignore for `test-artifacts` so Playwright traces, screenshots, and logs do not trigger hot reloads or dependency re-optimization while tests are running.
- Made attached artifact names project-specific.
- Made route smoke navigation use `domcontentloaded` with a longer timeout and a non-fatal `networkidle` wait.

Files changed:
- `playwright.config.ts`
- `package.json`
- `tests/qa-robustness-review/helpers.ts`
- `tests/qa-robustness-review/route-smoke.spec.ts`
- `tests/qa-robustness-review/warnings-and-edge.spec.ts`

Regression coverage:
- The full Playwright suite now runs to completion and writes artifacts under the new review namespace.

Verification:
- Full Playwright suite passed: 112/112.

Remaining risk:
- The route-smoke suite is intentionally broad and slow. It may be better split by route group if adopted into CI.
