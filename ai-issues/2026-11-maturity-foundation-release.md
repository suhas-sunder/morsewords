# Bounded audiobook metadata recovery

Branch: `recovery/2026-11-maturity-foundation`.
Base: `9f4121b1b532eae0f79f1f08c5dea1100f105892`.

The route's always-nonempty generic description made all reviewed descriptions unreachable in both HTML metadata and WebPage schema. The fix uses the existing reviewed work description with a short listening-intent prefix. An empty/missing review still receives a useful audio-specific fallback. Titles, canonical URLs, robots, sitemap, visible player, algorithms, settings and content assets are unchanged. No claim is made that this defect caused the Google collapse.

Changed implementation: `app/routes/morse-code-audiobooks.$slug.tsx` and the pure `app/client/data/morseAudiobookMetadata.ts` adapter. Regression coverage: `tests/qa-robustness-review/audiobook-metadata-recovery.spec.ts` checks all 524 reviewed descriptions, fallback handling, two raw SSR metadata descriptions and matching WebPage schema.

Validation evidence is retained locally in `output/november-baseline/`. Typecheck, ordinary build, Netlify build, production-context offline Netlify CLI build (Node 22), default 28-test suite, metadata tests, all current startup-preview contracts, audiobook controls/export/migration tests and four existing ad-safety tests passed. Function ZIP: 3,228,635 bytes; uncompressed 12,657,762 bytes; required SEO summary JSON included; no full book-content payloads packaged. Netlify configuration remains byte-for-byte unchanged.

Raw built-handler probes cover home, audio, practice, alphabet, audio decoder, chart hub, print, and six paired book/audio titles, including Anne and Monte Cristo. All return 200 with one H1 and expected canonical; print remains noindex/follow. The historical translator/audio aliases retain redirects. Six live remote payloads returned 200 with matching manifest hashes and multiple sections. Chromium and WebKit screenshots were reviewed at 1440, 768 and 390 pixels on home/audio/modified audiobook; no overflow or page exceptions in the final local harness.

Harness qualifications: the fresh checkout lacked ignored local export artifacts. Existing audiobook tests initially reached the one-chapter fallback; regenerating the export with the repository's existing exporter made the unchanged tests pass. Production asset CORS permits `https://www.morsewords.com`, not localhost; the local browser harness fetched real remote bodies and relaxed only CORS. This is not a CORS production change. The historical `site:local-final-validation` script remains unsuitable for current main (old batch/count assumptions); its replacement is a W01 reliability deliverable, not part of this hotfix.

Source URL/meta/sitemap audits pass with 1,179 unique sitemap entries, 524 books, 524 audiobooks, 131 other URLs and zero print entries. Generated historical audit-report churn is excluded. The broad roadmap remains on the weekly train. The original dirty worktree is untouched.

Rollback: revert this bounded commit and let Git CI deploy the revert. Do not restore an old Netlify deploy. Production push is permitted only after the final explicit safety gate; actual commit/deployment/live verification are recorded in the release-train ledger after publication.
