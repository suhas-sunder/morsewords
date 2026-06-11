# MorseWords Export Pipeline Audit

Branch: `morsewords-export-pipeline-correctness-jun-2026`

Base main commit: `4f24cfb69480fb73d9fa191cb6851c66c7ee90e3`

## Current MP3/WAV path

- Selected book text is cleaned in `BookTranslatorTool.tsx` or `MorseBookPage.tsx`, then split by `segmentBookText` in `bookSegmentation.ts`.
- Morse timing is generated in `bookBundleExport.ts` by `buildBookSignalEvents`, which converts text to a Morse transcript with `buildMorseTranscript`, then calls the shared `buildMorseEvents` timing utility.
- Audio is generated in `renderBookPartPcm`, which currently creates one `Float32Array` PCM buffer for the whole planned part.
- WAV export then creates one additional full `ArrayBuffer` for the part. MP3 export iterates through that PCM buffer with `@breezystack/lamejs`, accumulating MP3 chunks into one `Blob`.
- The previous guard blocked any planned part over about 45 minutes or 512 MB of Float32 PCM. That prevented the worst allocation crash, but it also disabled long exports instead of splitting them.
- Typed-array allocation failures come from a full-selection or oversized-part PCM buffer such as `new Float32Array(totalSamples)`, and from WAV output allocating a full encoded `ArrayBuffer`.
- Current long-export complexity is O(events + samples) for the planned part, with memory O(samples) plus encoded output. ZIP bundles also hold every rendered part in memory before one final download.
- Rendering can be chunked by part without changing Morse timing because all splits happen on source text boundaries before timing events are built. A part boundary never cuts a dot or dash when the text segment is re-timed independently.

## Current MP4/WebM path

- Video frames are generated in `shared/video/morseVideoRenderer.ts`.
- Book video uses `buildBookVideoTimeline` in `bookVideoRenderer.ts`, which reuses `buildBookSignalEvents` and converts those events into a timed video timeline.
- Video recording uses `canvas.captureStream`, `MediaRecorder`, and an optional Web Audio track from `AudioContext.createMediaStreamDestination`.
- Audio is combined with video by adding the destination audio track to the recorded `MediaStream`, while tones are scheduled from the same timeline events used for frame rendering.
- The recorder currently accumulates `Blob` chunks and resolves one in-memory `Blob` per part. Multi-part ZIP export then reads each video blob into memory and zips all parts together.
- MP4 is browser-dependent. The code only offers MP4 when `MediaRecorder.isTypeSupported` reports a supported MP4 MIME type; WebM is the reliable browser-native path.
- Preview and export mostly share timing data. Preview uses a capped timeline from shared video preview helpers; export builds a full part timeline from the same Morse timing utilities.

## Timing correctness

- The shared Morse timing source is `buildMorseEvents` in `shared/morseTiming.ts`.
- Audio export, video export, audio preview strips, video preview frames, text highlight, Morse highlight, and the playhead all derive from Morse timing events or video timeline tokens.
- Real-time preview uses `performance.now`, `setInterval`, `setTimeout`, and Web Audio scheduling. It clamps seek positions to the preview duration.
- Video export uses `requestAnimationFrame` with `performance.now`, while audio tones are scheduled by absolute `AudioContext` times. That keeps audio and visual timing tied to the same event schedule, although long recordings still depend on browser real-time performance.
- Exact end-time handling is already clamped in the shared preview controls and in `getMorseVideoPreviewFrame`; tests should keep verifying that the final frame is inactive instead of wrapping to the start.

## Progress correctness

- Existing UI progress is mostly part-count progress. Audio export does not report rendered samples or duration while PCM/WAV/MP3 work is happening.
- Video export reports elapsed recorded duration from `recordMorseVideoCanvas`, which is closer to real work, but ZIP bundling still hides memory-heavy finalization.
- This branch should add actual rendered-duration progress for audio parts and keep video elapsed-duration progress. If ETA cannot be honest, the UI should show elapsed time.

## Optimization opportunities

- Safe and in scope: plan long exports into parts automatically, split oversized chapters internally, render parts sequentially, download automatic parts one at a time, and release per-part blobs after each download.
- Safe and in scope: reuse the already computed part plan in the UI and export runner instead of asking the user to manually choose split settings.
- Safe and in scope: add progress callbacks during PCM, WAV, MP3, and video rendering.
- Deferred: Web Workers. They would help responsiveness, but moving lamejs, canvas recording, and Web Audio scheduling into worker-compatible code is a larger refactor and video recording still needs DOM/canvas APIs.
- Deferred: MediaRecorder timeslice streaming to disk. The recorder already uses timeslices, but browsers still expose chunks through memory-backed blobs. Streaming download would need a different browser capability and careful fallbacks.
- Deferred: WebCodecs. It may improve deterministic video encoding where available, but it needs codec/container fallback behavior for browsers without WebCodecs.
- Deferred: `ffmpeg.wasm`. It would add significant bundle, memory, and startup cost, and it would not solve the existing large in-memory render problem by itself.

## Planned algorithm

- Small export: one planned part that is under the safe part threshold and has no requested sidecars exports as one direct MP3, WAV, WebM, or MP4 file.
- Long export: any selection whose planned part exceeds the safe part threshold is automatically re-planned into parts. The download button stays enabled when media APIs are available.
- Audio safe part limit: 20 minutes, additionally bounded by a Float32 PCM estimate of 256 MB. At 44.1 kHz this is below the memory ceiling, and at 48 kHz the 20-minute cap is still below 256 MB PCM.
- Video safe part limit: 8 minutes for 720p and 5 minutes for 1080p. This keeps MediaRecorder blobs and real-time recording sessions shorter while preserving the existing WebM/MP4 fallback behavior.
- Section grouping: prefer source sections when available, otherwise split by paragraph. If a source section is too large, split by paragraph, then sentence, then word, then a final text chunk fallback.
- Oversized chapters: split internally before rendering. The max-part check is applied after splitting, so one unsafe planned part becomes smaller planned parts.
- Filenames: keep lowercase sanitized base names and ordered `part-001`, `part-002`, etc. Automatic parts use the same sortable part filenames as explicit split parts.
- Downloads: automatic multi-part exports with no sidecars render one part, start that download, yield, then render the next part. Explicit sidecar bundles can still use ZIP, but the default long-export path avoids holding all generated media in one ZIP blob.
- Failure: if a part fails, report the part number with friendly copy, re-enable controls, and let the user retry the download. Raw allocation errors are never shown.
- Progress: audio progress uses actual rendered duration/samples/chunks where available. Video progress uses recorded elapsed duration and part count. If ETA is not reliable, show elapsed time.
- Tests: cover planning thresholds, text coverage, oversized chapter splitting, UI labels/copy, enabled long buttons, progress state, raw-error sanitization, preview end clamping, and persistence regressions.
