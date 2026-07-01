# Video Export Preview Parity

## 1. Executive result

Video export preview parity passed.

## 2. Root cause of preview/export mismatch

The live `/morse-code-video-generator` preview was already correct, but it was not
the renderer used for downloads. The live preview uses DOM/CSS through the shared
preview component. Downloads were produced by a separate canvas renderer with its
own layout, word placement, active styling, and recorder defaults.

That separate canvas path had drifted from the preview: active words were colored
instead of drawn inside the rounded preview-style highlight, slash separators were
not drawn between centered Morse word groups, the signal/text composition used
different vertical placement, and MediaRecorder used browser default bitrate
settings.

## 3. Preview preservation result

Passed. The visible preview markup and styling were not redesigned. The only
shared-preview change was extracting the existing word-window sizing constants
into a helper so the exporter can use the same frame model.

## 4. Export renderer fix

The canvas export now builds an export frame plan from the same canonical active
frame state used by the preview. The export renderer now uses the shared preview
word-window sizing, draws rounded active word containers, draws the separators
between word groups, and positions the signal/text stack from one export layout
plan instead of scattered per-function offsets.

## 5. Resolution/quality options

Passed. The generator now exposes export quality as:

- 720p (1280 x 720), default
- 1080p (1920 x 1080)

The selected quality is visible near the export controls and controls the canvas
backing dimensions used for recording.

## 6. Sharpness/blur fix

The export path records from native target canvas dimensions instead of relying on
CSS scaling. It also waits for Space Mono and Space Grotesk before recording and
uses resolution-aware MediaRecorder bitrates: 5 Mbps for 720p and 9 Mbps for
1080p.

## 7. Export parity validation

Passed:

- `npm run typecheck`
- `npm run test --if-present`
- `npm run build:netlify`
- `npx playwright test tests/qa-robustness-review/morse-video-export.spec.ts --project=desktop-chromium --reporter=line`
- `npx playwright test tests/qa-robustness-review/morse-video-generator.spec.ts --project=desktop-chromium --reporter=line`
- `npx playwright test tests/qa-robustness-review/morse-mobile-smoke.spec.ts --project=desktop-chromium --reporter=line`
- `npx playwright test tests/qa-robustness-review/morse-book-suitability.spec.ts --project=desktop-chromium --reporter=line`
- `git diff --check`

The new export tests verify native 720p/1080p canvas dimensions, recorder
bitrates, shared preview word-window sizing, and active highlight data in the
export frame plan.

## 8. Book preview regression risk

Low. Book preview appearance is not changed. The shared preview component keeps
the same DOM/CSS styling and only imports the extracted word-window helper with
the previous constants. Book preview smoke validation remains part of final
branch validation.

## 9. Files changed

- `app/client/components/morse-code-video-generator/MorseVideoGeneratorTool.tsx`
- `app/client/components/shared/video/MorseVideoPreviewControls.tsx`
- `app/client/components/shared/video/morseVideoExport.ts`
- `app/client/components/shared/video/morseVideoPresets.ts`
- `app/client/components/shared/video/morseVideoRenderer.ts`
- `tests/qa-robustness-review/morse-video-export.spec.ts`
- `tests/qa-robustness-review/morse-video-generator.spec.ts`
- `app/client/assets/books/audit-reports/video-export-preview-parity/video-export-preview-parity.json`
- `app/client/assets/books/audit-reports/video-export-preview-parity/video-export-preview-parity.md`

## 10. Remaining blockers

None identified.

## 11. Recommended next step

Review exported 720p and 1080p videos manually against the live preview, then
merge to main if acceptable.
