# MorseWords Export Pipeline Audit

Branch: `morsewords-export-pipeline-correctness-jun-2026`

Correction base commit: `9d032c9d35d674cdcb2a72781071166274e56927`

## Corrected product model

- Selections with estimated runtime of 1 hour or less export as one direct file.
- Selections over 1 hour use duration-based media parts targeting 30 minutes.
- Multi-part exports download as ZIP batches by default. The batch target is about
  2 hours, so a normal batch contains roughly four 30-minute media parts plus
  `manifest.json`.
- The public split UI is intentionally simple: `No split` and `By duration`.
  Source sections can still be used internally as clean boundary hints when
  making duration-based parts, but `By source sections` is no longer a public
  mode.
- Video is the default output type for new users. Saved local preferences can
  still restore Audio when the user chose it earlier.
- Public book video export exposes MP4 only when the browser reports real
  MediaRecorder MP4 support. MorseWords does not relabel WebM output as MP4.

## Current MP3/WAV path

- Selected book text is cleaned in `BookTranslatorTool.tsx` or
  `MorseBookPage.tsx`, then planned by `buildBookExportPlan`.
- Morse timing comes from `buildBookSignalEvents`, which converts cleaned text
  into Morse events with the shared timing utilities.
- Normal direct and ZIP audio rendering now uses chunked Int16 signal generation
  instead of first building one full-selection Float32 PCM buffer.
- MP3 encoding feeds those chunks through `@breezystack/lamejs` sequentially.
  WAV output writes a header and ordered PCM chunks.
- The older full-buffer helpers remain for compatibility, but the book export
  path avoids one giant full-selection audio buffer for user downloads.

## Current MP4 path

- Video frames are generated in `shared/video/morseVideoRenderer.ts`.
- Book video uses `buildBookVideoTimeline` in `bookVideoRenderer.ts`, reusing the
  same Morse event schedule used for audio.
- Video recording uses `canvas.captureStream`, `MediaRecorder`, and an optional
  Web Audio track from `AudioContext.createMediaStreamDestination`.
- The code uses MP4 only if the browser reports a supported MP4 MediaRecorder
  MIME type. If MP4 support is absent, the book export UI disables MP4 instead
  of showing WebM as a replacement.
- Short exports can use 1080p when the selected browser MP4 path supports it.
  Long exports may still need smaller batches or a future encoder if real-world
  browser testing shows instability.

## Preview/export parity

- Preview remains the reference behavior.
- `getMorseVideoCanonicalFrameState` is the shared pure state model for a
  timestamp. It returns tone/gap state, bulb state, active Morse/text tokens,
  visible Morse/plain text windows, word window, and progress.
- Export rendering now reads bulb/tone state from that same canonical state.
- Tests compare canonical preview and export state for fixed timestamps across
  `SOS HELP`, `THE QUICK BROWN FOX`, a short chapter excerpt, and a part-boundary
  sample. Canvas tests also assert that each video frame starts with a clear and
  repaint before drawing overlays, preventing stale or duplicated text.

## ZIP manifest

Each ZIP batch includes media files in order plus `manifest.json`. The manifest
contains:

- app/source identifier (`MorseWords`) and timestamp
- title, author, filename, and source type where available
- selected format, output type, MIME type, and total selected runtime
- batch number, total batches, part count in the batch, and global part count
- each part filename, runtime, ordered index, and approximate source coverage
- export settings such as WPM, Farnsworth WPM, tone, pitch, volume, part target,
  and video resolution/style/toggles

## Progress and estimates

- The UI shows estimated render/conversion time before starting when there is
  enough runtime and format information.
- While rendering, progress uses rendered duration where available, with current
  batch, current part, total parts in the batch, percent, elapsed time, and an
  honest ETA once progress has enough signal.
- Before ETA is reliable, the UI shows elapsed time plus
  `estimating time remaining...`.
- Failures are wrapped with readable part numbers and controls are reset so the
  user can retry.

## Render metadata proposal

No book JSON or Cloudflare exports were regenerated in this correction. A size
check of `app/client/assets/books/cloudflare-export/books` found 74 JSON files
totaling about 113.9 MiB, averaging about 1.54 MiB each. The largest current file
is about 9.65 MiB.

Future generated book JSON could safely include small render-helpful metadata:

- section character counts and word counts
- Morse unit counts per section
- estimated runtime per default timing preset
- recommended split-point hints aligned to chapters, sections, paragraphs, or
  safe text offsets

Avoid adding full pre-tokenized Morse per section by default; it can substantially
increase JSON size and duplicates data that can be derived locally. A compact
timing skeleton may be feasible if it stores counts and boundary offsets that can
scale with WPM/Farnsworth settings.

For local reuse, IndexedDB is a better fit than localStorage for parsed/tokenized
cache entries keyed by content hash and settings. localStorage should keep only
small preferences; it must not store full book text, generated audio/video,
base64 media, or uploaded source content.

## Deferred work

- Web Workers could improve responsiveness for audio encoding, but video capture
  still depends on DOM canvas and MediaRecorder behavior.
- MediaRecorder chunk streaming already reduces recorder chunk size, but browsers
  still expose memory-backed blobs. True streaming downloads need a separate
  browser-capability design.
- WebCodecs may improve deterministic video encoding where available, but it
  needs container, codec, and fallback decisions.
- `ffmpeg.wasm` remains deferred because of bundle size, startup cost, and memory
  pressure. It should only be added after measured evidence shows it is worth the
  tradeoff.
