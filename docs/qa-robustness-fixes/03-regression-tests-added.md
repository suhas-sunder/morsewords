# Regression Tests Added

## Playwright configuration

- Added `playwright.config.ts`.
- Test directory: `tests/qa-robustness-review/`.
- Artifacts: `test-artifacts/qa-robustness-review/`.
- Projects:
  - Desktop Chromium
  - Mobile Chromium

## Tests

- `tests/qa-robustness-review/route-smoke.spec.ts`
  - Visits all known public routes.
  - Verifies HTTP status < 400.
  - Captures route screenshots.
  - Captures console warnings/errors.

- `tests/qa-robustness-review/accessibility.spec.ts`
  - Runs axe on high-risk pages.
  - Fails on critical/serious accessibility violations.

- `tests/qa-robustness-review/warnings-and-edge.spec.ts`
  - Verifies strobe warnings are hidden until flash is enabled/triggered.
  - Verifies printable content-limit notices appear only when content is actually omitted.
  - Verifies word-search oversized-word notices, answer reveal, and puzzle regeneration.
  - Verifies SVG logo upload remains accepted by the printable chart UI.

- `tests/qa-robustness-review/morse-utils.fuzz.spec.ts`
  - Property-based round-trip tests for supported letters/numbers.
  - Generated-input safety checks for Morse normalization/decoding.
  - Smart punctuation normalization check.

## Scripts

- `npm run test:e2e`
- `npm run test:fuzz`

