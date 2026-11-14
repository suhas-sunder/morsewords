# Tranche B final owner review — W01–W16

Status: VALIDATED / READY FOR OWNER REVIEW. Nothing in this review is released. W17 was not started.

## A. CURRENT PRODUCTION

Starting and final fetched origin/main: `8c83c8214d515565c314ff99bc3df8af88e73121` (reviewed audiobook metadata correction preserved). Netlify production deploy `6af699314552c4b5a47d0889` remains READY, context production, commit_ref equal to that SHA; published 2026-11-13T05:01:57.770Z. The project connector still identifies that deploy as current. Rechecked after implementation and the rejected draft-preview attempt. No main push/merge, production deploy, force push or automation operation occurred.

Original user checkout HEAD: `8627d04ec3b6d2f561a29032f508f5f3410b11d5`, with dirty Anne/Monte work. It was not used for implementation. Work ran in `morsewords-2027-tranche-b`, with an isolated detached hardened-A measurement worktree. Protected-state snapshots and the final 191-file hash/status check are recorded below.

## B. TRANCHE A HARDENING

[Full amendment evidence](TRANCHE-A-HARDENING.md). Review base `33ff79215cc303b66c5f37b9ddaaa954edbd405e`; hardening final head `ffce7ae259a600c418ad210a6399a0a9c18a587e`, draft PR [#10](https://github.com/suhas-sunder/morsewords/pull/10).

- W05 reproduced ambiguous literal-space/transmission-time wording; corrected text notation versus three/seven dot-unit silences: `f3a3e32c38f935796e151edb5a108e3d2fd82ba5`.
- W06 reproduced repetitive ordinary-character citations; compact ordinary authority note while retaining extension/collision details: `dcf88d35385c8e85ce9ea0f2db7e8497da2b2a1c`, `ca9f244f70ec30cbfe9f8969e2708e83ebe9648e`.
- W07 replaced repeat giant evidence dumps with compact inventory/findings, canonical hashes/bytes and deltas; explicit full snapshots remain ignored; historical inventory unchanged: `8a3652d683f301c64ab63c24615bae46625f1718`.
- W08 reproduced loading/ready heading movement and short loading surfaces; stabilized geometry with genuine bounded loading space and compact terminal failures: `afd68084ceac5b6123c7833f44753e7299027437`. H1 movement 16/8 px -> 0; controlled LayoutShift observations fell to 0 / about .0013 / at most .0023. These are lab observations, not field CLS.
- Release architecture, calendar, manifest and revised priorities: `ffce7ae259a600c418ad210a6399a0a9c18a587e`.

Hardening checks: 42 focused cumulative W02–W07, 36 book startup/failure/loading/parity, 28 smoke, 40 core and 32 built-handler checks; typecheck, build/package and three SEO audits pass. Earlier focused subsets are not added again as unique tests. Actual multi-width/theme screenshots were reviewed. No old weekly branch was rewritten.

## C. RELEASE CALENDAR

Every slot is Sunday **10:00 America/Toronto**, including daylight-saving changes. These are owner decision windows, not automatic deployments. W01 rides with W02; W07 rides with W08. Fifty user-facing package windows plus two unassigned/default-skip contingencies make 52 Sundays. No invented W53/W54. W17–W52 remain proposals, not implementation authorization.

Create each production candidate from then-current origin/main, apply only approved original/amendment commits and shipped or explicitly included prerequisites, resolve fresh conflicts, rerun gates, publish an immutable exact-SHA non-production preview, obtain the explicit owner release decision, then verify the production deploy. Never merge this cumulative review stack wholesale. Blocked packages are skipped; no automatic double payload, future-code borrowing or dependency bypass. Rollbacks use reviewed reverts on current main, never restore an old deploy that discards intervening fixes.

| Slot | Date | Local time / zone | Reviewed packages | Prerequisite | Fresh candidate | Preview | Owner decision | Status | Blocked behavior |
|---|---|---|---|---|---|---|---|---|---|
| S01 | 2027-01-03 | 10:00 America/Toronto | W01, W02 | W01 included; fresh production verification | `ship/2027-W02-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S02 | 2027-01-10 | 10:00 America/Toronto | W03 | W02 | `ship/2027-W03-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S03 | 2027-01-17 | 10:00 America/Toronto | W04 | W03 | `ship/2027-W04-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S04 | 2027-01-24 | 10:00 America/Toronto | W05 | W04 | `ship/2027-W05-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S05 | 2027-01-31 | 10:00 America/Toronto | W06 | W05 | `ship/2027-W06-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S06 | 2027-02-07 | 10:00 America/Toronto | W07, W08 | W06 shipped; W07 included | `ship/2027-W08-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S07 | 2027-02-14 | 10:00 America/Toronto | W09 | W08, TRANCHE-A-HARDENING | `ship/2027-W09-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S08 | 2027-02-21 | 10:00 America/Toronto | W10 | W09 | `ship/2027-W10-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S09 | 2027-02-28 | 10:00 America/Toronto | W11 | W10 | `ship/2027-W11-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S10 | 2027-03-07 | 10:00 America/Toronto | W12 | W11 | `ship/2027-W12-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S11 | 2027-03-14 | 10:00 America/Toronto | W13 | W12 | `ship/2027-W13-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S12 | 2027-03-21 | 10:00 America/Toronto | W14 | W12, W13 | `ship/2027-W14-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S13 | 2027-03-28 | 10:00 America/Toronto | W15 | W03, W12, W14 | `ship/2027-W15-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S14 | 2027-04-04 | 10:00 America/Toronto | W16 | W09, W10, W11, W12, W13, W14, W15 | `ship/2027-W16-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S15 | 2027-04-11 | 10:00 America/Toronto | W17 | W16 | `ship/2027-W17-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S16 | 2027-04-18 | 10:00 America/Toronto | W18 | W17 | `ship/2027-W18-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S17 | 2027-04-25 | 10:00 America/Toronto | W19 | W18 | `ship/2027-W19-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S18 | 2027-05-02 | 10:00 America/Toronto | W20 | W19 | `ship/2027-W20-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S19 | 2027-05-09 | 10:00 America/Toronto | W21 | W20 | `ship/2027-W21-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S20 | 2027-05-16 | 10:00 America/Toronto | W22 | W21 | `ship/2027-W22-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S21 | 2027-05-23 | 10:00 America/Toronto | W23 | W19, W22 | `ship/2027-W23-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S22 | 2027-05-30 | 10:00 America/Toronto | W24 | W17, W23 | `ship/2027-W24-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S23 | 2027-06-06 | 10:00 America/Toronto | W25 | W06, W24 | `ship/2027-W25-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S24 | 2027-06-13 | 10:00 America/Toronto | W26 | W25 | `ship/2027-W26-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S25 | 2027-06-20 | 10:00 America/Toronto | W27 | W26 | `ship/2027-W27-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S26 | 2027-06-27 | 10:00 America/Toronto | W28 | W27 | `ship/2027-W28-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S27 | 2027-07-04 | 10:00 America/Toronto | W29 | W28 | `ship/2027-W29-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S28 | 2027-07-11 | 10:00 America/Toronto | W30 | W04, W29 | `ship/2027-W30-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S29 | 2027-07-18 | 10:00 America/Toronto | W31 | W27, W29 | `ship/2027-W31-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S30 | 2027-07-25 | 10:00 America/Toronto | W32 | W25, W31 | `ship/2027-W32-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S31 | 2027-08-01 | 10:00 America/Toronto | W33 | W07, W32 | `ship/2027-W33-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S32 | 2027-08-08 | 10:00 America/Toronto | W34 | W33 | `ship/2027-W34-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S33 | 2027-08-15 | 10:00 America/Toronto | W35 | W34 | `ship/2027-W35-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S34 | 2027-08-22 | 10:00 America/Toronto | W36 | W08, W35 | `ship/2027-W36-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S35 | 2027-08-29 | 10:00 America/Toronto | W37 | W06, W36 | `ship/2027-W37-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S36 | 2027-09-05 | 10:00 America/Toronto | W38 | W07, W37 | `ship/2027-W38-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S37 | 2027-09-12 | 10:00 America/Toronto | W39 | W38 | `ship/2027-W39-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S38 | 2027-09-19 | 10:00 America/Toronto | W40 | W39 | `ship/2027-W40-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S39 | 2027-09-26 | 10:00 America/Toronto | W41 | W24, W32 | `ship/2027-W41-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S40 | 2027-10-03 | 10:00 America/Toronto | W42 | W41 | `ship/2027-W42-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S41 | 2027-10-10 | 10:00 America/Toronto | W43 | W06, W32 | `ship/2027-W43-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S42 | 2027-10-17 | 10:00 America/Toronto | W44 | W43 | `ship/2027-W44-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S43 | 2027-10-24 | 10:00 America/Toronto | W45 | W32, W43 | `ship/2027-W45-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S44 | 2027-10-31 | 10:00 America/Toronto | W46 | W45 | `ship/2027-W46-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S45 | 2027-11-07 | 10:00 America/Toronto | W47 | W11, W46 | `ship/2027-W47-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S46 | 2027-11-14 | 10:00 America/Toronto | W48 | W47 | `ship/2027-W48-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S47 | 2027-11-21 | 10:00 America/Toronto | W49 | W48 | `ship/2027-W49-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S48 | 2027-11-28 | 10:00 America/Toronto | W50 | W09, W16, W49 | `ship/2027-W50-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S49 | 2027-12-05 | 10:00 America/Toronto | W51 | W50 | `ship/2027-W51-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S50 | 2027-12-12 | 10:00 America/Toronto | W52 | W01, W51 | `ship/2027-W52-theme` | Required, exact SHA | Required | PLANNED / NOT RELEASED | S |
| S51 | 2027-12-19 | 10:00 America/Toronto | Unassigned contingency | Owner-selected scope + proven dependencies | `ship/2027-S51-approved-repair` | Required, exact SHA | Required | UNASSIGNED / DEFAULT SKIP | S |
| S52 | 2027-12-26 | 10:00 America/Toronto | Unassigned contingency | Owner-selected scope + proven dependencies | `ship/2027-S52-approved-repair` | Required, exact SHA | Required | UNASSIGNED / DEFAULT SKIP | S |

Each completed row must later link the actual candidate/base SHA, selected original/amendment SHAs, preview ID/URL/checks, owner decision, production deploy SHA/ID and live smoke. Empty fields are not permission to release.

## D. W09–W16

All packages are IMPLEMENTED, VALIDATED and READY FOR OWNER REVIEW. Each weekly ledger records files, routes, tests, measurements, preview, SEO effect, rollback and limits. Review branch names are the actual pushed refs. Final W16 code head below excludes subsequent documentation-only finalization; the exact cumulative review commit is the containing commit of this document and the pushed W16 PR head, reported explicitly in the owner response. A document cannot embed its own containing Git hash.

| Package | Branch | Base | Final code/review SHA | Draft PR |
|---|---|---|---|---|
| W09 | `release/2027-W09-global-payload` | `ffce7ae259a600c418ad210a6399a0a9c18a587e` | `f9d6e7ca8eda7714d3d0f1c96f35db1697a35dc9` | [#11](https://github.com/suhas-sunder/morsewords/pull/11) |
| W10 | `release/2027-W10-translator-diagnostics` | `f9d6e7ca8eda7714d3d0f1c96f35db1697a35dc9` | `16a776958ea4fa7039a0a3bb58f2ecd5fd04f205` | [#12](https://github.com/suhas-sunder/morsewords/pull/12) |
| W11 | `release/2027-W11-decoder-boundaries` | `16a776958ea4fa7039a0a3bb58f2ecd5fd04f205` | `7c58cfa96c01b4eaf6b0e652ad1b6d47634011f4` | [#13](https://github.com/suhas-sunder/morsewords/pull/13) |
| W12 | `release/2027-W12-playback-lifecycle` | `7c58cfa96c01b4eaf6b0e652ad1b6d47634011f4` | `dff39b499e51c75a89104cddb018f85172cf732b` | [#14](https://github.com/suhas-sunder/morsewords/pull/14) |
| W13 | `release/2027-W13-export-recovery` | `dff39b499e51c75a89104cddb018f85172cf732b` | `8c7ad40b1ac8e2ec43aa893f6ff38365b87b50c0` | [#15](https://github.com/suhas-sunder/morsewords/pull/15) |
| W14 | `release/2027-W14-preset-comparison` | `8c7ad40b1ac8e2ec43aa893f6ff38365b87b50c0` | `04c0ae090aaced7168441ec3f3a61b6304083349` | [#16](https://github.com/suhas-sunder/morsewords/pull/16) |
| W15 | `release/2027-W15-decoder-inspection` | `04c0ae090aaced7168441ec3f3a61b6304083349` | `95b84f82099f5a68c3fae9e7af2e3189fd5e9efe` | [#17](https://github.com/suhas-sunder/morsewords/pull/17) |
| W16 | `release/2027-W16-audio-integration` | `95b84f82099f5a68c3fae9e7af2e3189fd5e9efe` | `754c83c0627f7afa770b0c5848977aec8f11db48` | [#18](https://github.com/suhas-sunder/morsewords/pull/18) |

### W09 — Global payload architecture

Status: VALIDATED / READY FOR OWNER REVIEW. Not released.
Branch: `release/2027-W09-global-payload`. Base: `ffce7ae259a600c418ad210a6399a0a9c18a587e`.
Implementation: `31425946b27c35a643a99e0bb426cda071fbddd2`.

Users retain all 524 searchable books, author/collection matching, both library hubs and keyboard navigation. A validated 42,220-byte discovery index loads on first menu opening, caches successful results, and offers a focus-restoring Retry on failure. Empty search presents the two library hubs. Queries never leave the browser. A generated-index freshness gate shares canonical publish eligibility rather than duplicating policy. The full book manifest no longer enters the global navigation graph. Home's existing featured cards now receive minimal loader data; their text, order, links and layout remain intact.

Files: navigation/NavBar and navigationBooks; data/morseBookEligibility and morseBooks; routes/home; scripts/books/navigation-index; public/navigation-books.json; package scripts and node TS includes; focused navigation/home tests; evidence/w09-payload.json.
Routes: shared shell, home, audio, practice, alphabet, books and audiobooks.

Validation: typecheck and production Netlify build pass; 36 navigation cases across Chromium/WebKit light/dark; final retry-focus refinement 20/20; 28 homepage tests; 40 core; 28 smoke; 32 built-handler checks. Twelve home visual cases at 390/768/1440, both engines/themes, plus navigation loading/failure/search screenshots reviewed. No overflow or page errors. Existing three-column menu assertion now explicitly tests searched titles, while empty search asserts hubs. A stale server initially caused retry-focus failures; stopping its owned PID and testing a fresh built handler passed without weakening assertions.

Measurement: exact hardened-A detached baseline built with identical dependencies; raw and gzip loaded JS, inert SSR and three cold/warm menu trials per width retained in evidence/w09-payload.json. Home initial JS 1,650,605 -> 817,620 bytes; /audio 1,645,549 -> 812,963; /practice 1,598,975 -> 766,389. Home SSR 221,380 -> 222,663 bytes from compact card props. Library pages still require their runtime manifest; no false claim of reducing library-route JS. Navigation timing varies under local load: payload reduction is established, field CWV or universal latency improvement is not. Index gzip 12,182 bytes loads only on demand. No dynamic-import-only workaround that still preloads the manifest; no deleted discovery capability.

Preview: actual local Netlify built handler; no hosted weekly preview claimed. SEO/index: substantive SSR, canonical links and sitemap unchanged; no new route. Protected ads, root/global CSS, robots and Netlify configuration unchanged.
Rollback: revert this increment and dependent consumers from a fresh release candidate; no user-storage migration. Remaining limitations: full library runtime and relatively large detail SSR remain later performance concerns; real Safari audio not certified by Windows WebKit. See final review for pushed draft PR and cumulative head. Future production candidates start from then-current main, never blindly merge this review stack.

### W10 — Translator input diagnostics

Status: VALIDATED / READY FOR OWNER REVIEW; not released.
Branch: `release/2027-W10-translator-diagnostics`. Base: `f9d6e7ca8eda7714d3d0f1c96f35db1697a35dc9`.
Implementation: `f58d08cce9a704967021c765aae2c2219c8cfa9f`.

Outcome: home and encoder users can locate each unsupported or meaningfully normalized occurrence in their original paste. Native Select actions use original UTF-16 spans; displayed line/column positions count Unicode characters. Repeated emoji, combining accents, compatibility characters, pasted punctuation repairs and whitespace are tracked through the same canonical rules. Ordinary case folding stays quiet. A collapsed disclosure reports complete counts, at most 12 entries per kind, and a bounded scroll region. Announcements debounce to avoid reading every keystroke. No encoding behavior changed.

International transliteration has whole-word and script-specific semantics. Its diagnostics explicitly locate positions in a selectable transliterated preview, never falsely map those offsets back to the original script. The shared encoding engine remains authoritative. No input enters URLs, telemetry, network requests or new persistent storage.

Files: shared morseUtils paste-rule registry, textDiagnostics, TextInputDiagnostics, TranslatorSectionsBasic; diagnostics regression and existing fuzz test. Routes: home, encoder, international translator and all existing shared-translator consumers (decode surface unchanged this week).

Tests: npm run typecheck, npm run build:netlify, npm test (28/28), git diff --check. Focused Playwright matrix: 52/52 across Chromium/WebKit light/dark, three widths 390/768/1440, original-span selections and stable encoded output, empty state, Unicode/paste and long input. A 100,000-character paste with 10,000 repeated unsupported occurrences completed around 95–110ms locally; bounded entries <=24. Fuzz round trips/paste repairs unchanged. One old separator label assertion was updated to assert the same 3-word/3-group behavior using the hardened W05 wording. Initial WebKit interactions raced hydration; final checks wait for the existing enabled hydration control. No assertions were removed.

Visual review: inspected light/dark mobile/desktop diagnostics and international preview; replaced tiny whitespace glyphs with readable names and bounded the list after finding overlong expanded panels. All 36 route/width/theme-engine screenshots are retained under the ignored review artifacts. Real Safari and screen-reader hardware behavior remain unverified; semantic labels, native disclosure, focus and polite status are browser-tested.

Preview: built Netlify handler only; final cumulative hosted preview considered at W16. SEO/index: no route/canonical/sitemap change. Protected files: ads, root/global CSS, Netlify config, books and source assets unchanged. Rollback: revert this increment from a fresh candidate; no storage migration. Diff reviewed against W09; no W11–W16 implementation included.

### W11 — Decoder boundaries and local handoff

Status: VALIDATED / READY FOR OWNER REVIEW; not released.
Branch: `release/2027-W11-decoder-boundaries`. Base: `16a776958ea4fa7039a0a3bb58f2ecd5fd04f205`.
Implementation: `8ee1ee7632aac9f46064644eb6fea618b65f0439`.

Outcome: shared translator/decoder, reader and separator distinguish genuine ..--.. question marks from unknown placeholders. Canonical decode issues retain each failed token and normalized word/group coordinates. At most 12 groups and 240 visible marks per group render in a bounded list; Copy preserves a full failed group. No boundaries are guessed. Reader no longer diagnoses valid question marks as unknown; decoder FAQ/schema use the same corrected explanation.

Explicit handoff to the separator preserves the original input in module memory for 30 minutes and supports Back restoration or returning formatted Morse. It writes no raw data to URLs, history state, persistent browser storage, analytics or a server. Refresh clears it. The 100,000-character handoff guard never truncates input or changes conversion/copy. New handoffs clear stale drafts. Audio decoder's existing raw-Morse query-string link is replaced by a same-tab memory handoff; clean uploaded WAV still reaches the real text decoder intact. Existing query-prefill compatibility remains; an explicit local handoff takes priority.

Files: shared MorseBoundaryDiagnostics/morseHandoff/morseUtils/TranslatorSectionsBasic; reader/separator/audio-decoder tools; decoder FAQ; focused boundary and existing reader/audio regressions. Routes remain separate: decoder is two-way conversion/playback, reader is a simpler text reading task, separator inspects and rewrites boundaries, audio decoder detects signals. Audio-to-reader discovery exists through the expanded shared toolkit; overlap is evidence for later review, not grounds for merging routes.

Validation: typecheck and Netlify build pass; npm test 28/28; boundary/spacing review matrix 32/32 across Chromium/WebKit light/dark, 390/768/1440; reader/separator/audio decoder and real-WAV onboarding 74/74. Tests assert exact unknown tokens/coordinates, punctuation distinction, bounded handoff, retained input through Back, formatted return, no raw query/request data, and existing outputs. A legacy reader discovery assertion selected a hidden toolkit link: the corrected test opens the real toolkit disclosure and still requires a visible canonical link. All assertion goals retained. git diff --check passes.

Visual: screenshots inspected in both engines/themes at mobile and desktop; long visible copy labels initially cramped mobile rows, corrected to compact labels with full accessible names. Three-width matrix has no overflow or page errors. Original diagnostic data is not logged; PostHog autocapture/session recording remain disabled in the existing provider.

Preview: local built Netlify adapter; no weekly hosted preview claimed. SEO/index: same routes, canonicals, sitemap and robots; FAQ content/schema remain aligned. Ads, Netlify config, source/rights assets unchanged. Rollback: revert increment and dependents through a fresh candidate; no persisted key migration. Limits: handoff is intentionally same-tab and ephemeral, not shareable; browser refresh does not preserve drafts or uploaded audio. Real Safari hardware not certified. Diff reviewed against W10 with no later-week implementation.

### W12 — Playback lifecycle

Status: VALIDATED / READY FOR OWNER REVIEW; not released.
Implementation: `c6df055b86a7bd08c4dd31ebe6e0a42189bbbd07`.
Branch: `release/2027-W12-playback-lifecycle`.
Base: `7c58cfa96c01b4eaf6b0e652ad1b6d47634011f4`.

Outcome: one explicit playback owner across shared players, reference samples and decoder recording preview. Starting a competing player stops the previous owner; route departure and pagehide stop playback. Hidden documents clear flash and suppress new flash events without forcing background audio off. Stop/unmount resolve outstanding waits, silence scheduled sources and invalidate late context-resume callbacks. Contexts remain lazy and reusable. Reference sample completion also stops queued sources if its context was suspended.

The shared player returns completed/cancelled/unavailable outcomes. Book, audiobook, uploaded-book and video previews only advance or mark the timeline complete for a completed run. Idle resume still unlocks book/video audio synchronously under the user gesture before their intentional start buffer. No tone/timing/setting/storage changes. Timing lab has no separate playback engine; it consumes canonical timing and links to audio. Text practice has no audio graph; audio practice and quizzes use the shared engine.

Files: playbackOwnership, PlaybackLifecycleBoundary, useMorseAudio, playMorsePattern, root boundary mount; audio decoder, book, book translator and video preview completion consumers; lifecycle/browser tests. Root layout, ads and page styling are unchanged.

Evidence: deterministic API-boundary browser matrix covers suspended/rejected unlock, rapid starts, stop during pending resume, pause/resume, repeat/mute/settings, competing references, all 13 presets and 77 reference routes. Native Chromium additionally verifies one context across three Play/Stop cycles with zero active sources after each Stop. WebKit uses the API-boundary harness; Windows WebKit is not hardware Safari certification. Book segment advancement, stale completion, startup preview and audiobook parity run on the development server because their existing advancement hook is DEV-only: 24/24 passed with HMR disabled. Initial dev run was interrupted by Vite reloads caused by test-file edits; the stable rerun passed without assertion weakening.

Visual: actual screenshots inspected at 390, 768 and 1440 in light/dark across Chromium/WebKit. Primary Sound/Repeat/Flash controls, adjacent lamp, Pause/Stop and advanced disclosure stay visible with no overflow. No visual redesign. A temporary implementation regression that skipped idle context unlocking was reproduced and fixed before validation. Existing tests were corrected to open real advanced controls, verify canonical alias sanitization and use a long enough sample for Stop; their behavioral assertions remain.

Preview: local built Netlify adapter; no hosted weekly preview claimed. SEO/index, canonical routes, sitemap, rights/source content, remote assets and Netlify configuration unchanged. Rollback: revert this increment and dependents through a fresh candidate from current main; no storage migration. Background audio can still be throttled by the browser/OS; no claim of uninterrupted hardware playback.

Final gates: typecheck and production build pass; lifecycle matrix 126 passed, 2 explicitly unsupported native-WebKit checks skipped; default smoke 28/28, core product 40/40, built-handler gate 32/32. git diff --check passes. Protected original checkout reverified: all 191 hashes and exact status unchanged.

### W13 — Export job recovery

Status: VALIDATED / READY FOR OWNER REVIEW; not released.
Implementation: `c2610bb026ab5f0f7fadfefd90179e8f4ed098d2`.
Browser capability test amendment: `9400be3db37ab3cf477ab8a15160c5e9f4f02f76`.
Branch: `release/2027-W13-export-recovery`.
Base: `dff39b499e51c75a89104cddb018f85172cf732b`.

The sequential audio/video runner now rechecks cancellation after progress callbacks and immediately before finalization, rejects stale/nonfinite/backward renderer progress, and measures remaining time from work performed in the current attempt. Actual completed indexes remain authoritative; the audio/video callers no longer infer completion from a count or assume a contiguous prefix. Finalizers guard job identity and abort state before requesting browser downloads. Rendering still processes one part at a time and drops its heavy blob reference before the next renderer.

Audio cancellation exposes Continue remaining parts after cleanup. Failure retains Retry part, and completed filenames/counts remain inspectable in a bounded disclosure. A request is explicitly not proof that the browser saved a file. Progress stays below 100% before completion. MP3 and WAV use their real chunk renderers; completed parts are skipped on retry, with stable original naming/order. Input/settings reset recovery. Video cancellation exposes the same resume path using its existing sequential runner; no unsupported MIME type is enabled.

Book/audiobook part exports recheck cancellation after finalizing progress and wrap download failures with the exact part identity. Their time estimate excludes previously completed duration. Uploaded-book retries are now bound to the exact source and immutable plan, fixing the old filenames/settings-only identity that could skip parts after source replacement. All book finalizers guard source/job change or unmount. Their existing download button explains Continue remaining audio parts only while that original plan remains valid. ZIP batches retain their existing truthful whole-batch retry; worksheet exports do not share this queue and are unchanged.

Protected behavior: explicit oversized No split guard remains; duration splitting remains available. No changes to timing, samples, presets, storage keys, source privacy, routes, sitemap/canonical ownership, ads, Netlify configuration or remote book assets. No giant full-selection render was introduced.

Validation evidence includes real WAV part-2 failure and retry at 390/768/1440, actual MP3 cancellation and continue, book cancellation at finalization, replaced-source recovery, sparse completed indexes, stale callbacks, monotonic finite progress, retry ETA and object URL revocation. Download failures are injected at the browser request boundary; the canonical renderers run normally. Existing No split test expected no plan, contradicting the already-protected warning; corrected assertions require one file, visible warning and disabled download before explicit duration splitting enables it. The new book test caught a stale Continue label after source replacement, fixed by checking the original plan/source.

Visual: failure/progress/retry screenshots inspected at mobile/tablet/desktop and both themes; shared controls remain readable, wrap on mobile and preserve page geometry. Completed filenames stay local in a bounded list. Preview: local built Netlify adapter, no hosted weekly preview claimed. Rollback: revert increment and dependent weeks through a fresh candidate from current main; no data migration. Limits: browser may block multiple downloads or fail to save after accepting a request; recovery skips requests already issued, and refresh intentionally discards the in-memory job. Real hardware Safari and native OS download completion are not certified.

Final verification: typecheck/build and diff check pass; 48/48 built-handler recovery/home export matrix, 28/28 default smoke. Existing long-form/book/video-scene export run: 78 passed; its two obsolete No split assertions were corrected and all eight homepage matrix checks then passed within the 48. Video MIME/cancellation/URL suite: 24 passed initially, two WebKit harness checks passed after respecting the already-disabled audio toggle; two native recording cases explicitly skipped only after verifying MediaRecorder is absent, WebM download disabled, MP4 option disabled and explanatory copy visible. Chromium native recordings passed real MIME/file/frame assertions. WebKit option state is asserted by its native disabled attribute (the generic locator enabled matcher did not recognize it). No product capability was disabled to satisfy a test. Logs and screenshots are ignored local evidence under output/tranche-b and test-artifacts; no raw source data enters runtime evidence or telemetry.

### W14 — Sound/preset comparison

Status: VALIDATED / READY FOR OWNER REVIEW; not released.
Branch: `release/2027-W14-preset-comparison`.
Base: `8c7ad40b1ac8e2ec43aa893f6ff38365b87b50c0`.
Implementation: `c4d7813c8789a12586b8787e250c83b97973c5d1`.

Outcome: Compare two tones in the existing advanced settings on /audio and /morse-code-sound-generator. Both A and B render the complete canonical registry with the same 13 IDs, labels, order and standard/creative groups. A and B use the current message, speed, Farnsworth spacing, pitch, volume and envelope; each audition plays once with sound only. Primary controls and saved preset/settings are preserved. Choices are local, not a new preference or route.

A placement-neutral component and small coordination hook reuse the route's existing player. The normal live-settings effect defers only while comparison owns that player, preventing it from overwriting the audition preset. No extra AudioContext is created: opening controls creates zero contexts, and repeated A/B auditions reuse one. Starting B stops A. Source, settings or feedback changes, closing the comparison or advanced section, route departure and unmount cancel comparison. Muted/empty input disables audition honestly. Rejected unlock reports an actionable status. The existing primary playback/flash/export flows remain intact.

Files: TonePresetComparison.tsx, usePresetComparison.ts, two route tool integrations, preset-comparison.spec.ts. No root/global style change. MP3 generator is a separate component and remains unchanged; it is covered by shared audio regressions. No preset-specific SEO routes, new storage keys, microphone access, telemetry or remote input transmission.

Validation: typecheck/build pass. Built Chromium/WebKit light/dark matrix: 24 route/width cases (390/768/1440), four feedback/settings/navigation cases and four rejected-unlock cases, all passing. Tests assert full registry identity, actual engine oscillator configuration/frequency and equal scheduled timing for A/B, zero overlapping prior nodes, no context on disclosure, one reused context, all 13 auditionable presets, keyboard Enter, saved preset/settings after reload and equivalent-route navigation, invalid input and no overflow. Existing audio consolidation 60/60 and default smoke 28/28 pass. Initial test setup cleared storage on every reload and used the audio label on the sound route; corrected setup now preserves the storage being tested and uses each real accessible label.

Actual screenshots inspected in light/dark at all three widths, including WebKit. Shared dropdowns/buttons stay readable; mobile stacks A/B cleanly. The new section is collapsed by default inside existing advanced settings and introduces no nested decorative cards. No home styling/layout changes. Local built Netlify preview only; final cumulative hosted preview handled at W16. Canonicals/sitemap/robots, ad architecture, source/rights assets, remote loading and Netlify configuration unchanged. Rollback: revert this increment and dependents in a fresh current-main candidate; no migration. Limits: deterministic API-boundary coverage does not certify real Safari hardware; output timbre remains the existing canonical engine and its documented pitch/envelope exceptions.

### W15 — Audio decoder signal inspection

Status: VALIDATED / READY FOR OWNER REVIEW; not released.
Branch: `release/2027-W15-decoder-inspection`.
Base: `04c0ae090aaced7168441ec3f3a61b6304083349`.
Implementation: `3fe850101c1f66699040d66a8d0420ebfd825bfc`.

Outcome: Optional Inspect detected signal disclosure on /morse-code-audio-decoder exposes actual smoothed RMS peaks, cleaned tone occupancy, tone-on/off thresholds, noise floor and letter/word decision boundaries. Selected timing is distinguished from estimated timing. A text summary explains counts, duration, limitations and how to compare raw Morse. Silent recordings receive flat evidence; rejected inputs receive no invented chart. Existing decode, preview, copy, download and private handoff remain available without opening the view.

Architecture: at most 512 equal-duration bins preserve peaks and accumulate tone overlap. Four SVG paths replace any per-sample DOM/canvas allocation. The former percentage was an uncalibrated timing/noise heuristic; UI/download now use descriptive Signal check labels and explicitly deny an accuracy probability. Internal heuristic/status thresholds remain. One generator owns unchanged arithmetic, consumed by synchronous callers and cancellable cooperative browser analysis. Indexed sample summation avoids the former slow iterator. Analysis and stereo mixing yield between 65,536-sample chunks, with an 8 ms scheduling target; final bounded frame analysis can exceed that target. Mono analysis reuses decoded samples without an additional full-size copy. Clear, replacement upload, new jobs and unmount abort old analysis; job identity rejects late native decode completions. No worker, permission, storage, telemetry or audio upload.

Validation: typecheck/build pass; fresh built-handler signal matrix 24/24 across Chromium/WebKit, light/dark and 390/768/1440; existing decoder suite 48/48; default smoke 28/28. Tests cover real sample decoding, exact sync/async equivalence through 180 seconds, cancellation, channel-mix equivalence, peak/occupancy bounds, selected timing, silence, keyboard, clear and no overflow. Windows Playwright WebKit lacks AudioContext: unsupported-browser copy was observed; its visual matrix uses an explicit test-only PCM WAV adapter feeding real generated samples to the production analyzer. Chromium uses native WAV decoding. This does not certify physical Safari audio support.

Actual screenshots inspected at all widths/themes/engines. View stays collapsed below existing outputs; readable flat composition and no first-screen displacement. No home/global style edits.

Performance: same 48 kHz fixture, before synchronous 180-second warm median 95.5 ms; after cooperative median 44.6 ms at normal CPU. 30-second median 15.4 -> 3.7 ms. At 180 seconds result JSON grows from 806 to 20,510 bytes for bounded evidence with no samples. Unthrottled instrumented maximum generator step 18.1 ms and timer gap 21.9 ms. Simulated 4x total elapsed is variable and does NOT establish a speedup: a blank-page control also produced 296.5 ms timer gaps. After 4x results include timer gaps up to 331.9 ms; instrumented runs reached 451.9 ms. Physical low-end/mobile timing remains unverified. Measurements retained in evidence/w15-signal-performance.json. Initial MessageChannel scheduling was replaced by timer yields before final validation. An initial test used the wrong slider label; corrected to the actual Character speed control and keyboard operation.

Files: audioDecodeUtils.ts, MorseAudioDecoderTool.tsx, SignalInspectionView.tsx, signal-inspection.spec.ts and ledger/evidence/manifest. Local built Netlify handler verified; cumulative hosted preview handled at W16. Canonical, robots, sitemap, ads, remote books, source/rights and Netlify configuration unchanged. Rollback: revert this increment and dependents on a fresh current-main candidate; no migration. No microphone capture.

### W16 — Audio integration, parity and performance review

Status: VALIDATED / READY FOR OWNER REVIEW; not released.
Branch: `release/2027-W16-audio-integration`.
Base: `95b84f82099f5a68c3fae9e7af2e3189fd5e9efe`.
Implementation: `6a52b6fae01daf8692009c63b1b62ee410c41c53`.
WebKit preview amendment: `754c83c0627f7afa770b0c5848977aec8f11db48`.

User outcomes: visiting any equivalent short audio tool first now preserves known legacy translator/sound-generator preferences before canonical defaults can overwrite them. Canonical values win, old keys remain, and explicit legacy adapter priority is preserved. All 13 preset identities now survive the translator context sanitizer, matching its actual picker/engine. Closing comparison cancels synchronously rather than waiting for the queued native toggle event. Shared book/video preview bulbs retain their responsive dimensions without invalid SVG attributes in WebKit.

Files: shared audioPreferenceStorage/audioPresetRegistry/TranslatorSectionsBasic/TonePresetComparison; shared video/MorseVideoPreviewControls; durable AGENTS migration guidance; focused audio integration, preset/settings, comparison, video/book and reference test fixtures; review-runner React environment; parity evidence and release records. The complete setting/range/default/storage/migration/consumer matrix and deliberate decoder/reference/book/video exceptions are in [w16-audio-parity.md](evidence/w16-audio-parity.md).

No new route or indexed surface. Home/audio/sound/MP3/audio practice/audio quiz/timing lab share appropriate preferences. Book/audiobook, uploaded-book and video profiles retain their distinct existing namespaces and defaults. Fixed reference samples and decoder analysis remain intentionally different. No new raw-input persistence, URL transport, telemetry, microphone permission, remote asset change or ad configuration.

Validation details and final same-method performance comparisons are in [TRANCHE-B-FINAL-REVIEW.md](TRANCHE-B-FINAL-REVIEW.md). Regression tests reproduced first-route legacy loss and creative translator fallback before the fix. Comparison close checks active nodes in the same activation task. The WebKit SVG error was reproduced by existing console-cleanliness checks; protected native export geometry still passes after CSS sizing.

Initial cumulative failures are retained in ignored logs, not erased: old Farnsworth assertions described a different page than current production; MP3 format controls needed their existing disclosure opened; built fixtures had mixed development React with production react-dom; Windows WebKit cannot grant clipboard permissions or create native AudioContext; the video API probe lacked AudioNode.disconnect. Corrected fixtures continue checking the actual production task, FAQ/schema equality, copy payload, full-content retry/settings protection and capability-disabled states. Book live advancement initially timed out under competing runs; unchanged assertions passed 16/16 in two sequential desktop/mobile repetitions. No claim of physical Safari audio certification.

Preview: full Node 22 production-context Netlify CLI build and packaged SSR function verified locally. Authorized draft deploy attempt returned `Unauthorized: could not retrieve project`; no hosted preview or deployment was created. This is the allowed Netlify-equivalent fallback, not hosted approval for production. Every future production candidate still needs its own exact-SHA hosted preview and owner decision.

Rollback: revert W16 amendments and implementation on a fresh current-main candidate in dependency order, retain user keys and saved data, and revalidate. No reset to an old deploy. No W17 work.

Final validation: typecheck and production-context Netlify build/package pass; final cumulative correction/video/library/comparison matrix 318 passed / 6 intentional skips, plus its desktop-only geometry case 1/1 separately; final default smoke 28/28, core product 40/40, built-handler gate 32/32. Earlier W16 integration/preset/settings matrix 84/84, ad lifecycle 10/10, unchanged book segment assertions 16/16. Broad early and audio matrices initially passed 170/176 and 289/304 (2 skips); their failures are superseded by corrected final suites, with exact history in the final review. Canonical, metadata and sitemap audits pass.

Same-method final loaded JS (raw): home 828,196; audio 819,651; practice 767,049; alphabet 965,947; Alice book 1,744,901; audiobook 1,745,233 bytes. Home remains 49.8% below hardened A, with 10,576 bytes added after W09. Core SSR grows only by bounded feature markup; library-route runtime/SSR remains large. Final ZIP 3,250,515 bytes / 223 entries / 12,733,115 uncompressed; required summary once, excluded full payload/chart/evidence zero. 24 final home/audio views have no overflow; ad screenshots cover blocked/unfilled/filled mobile/tablet/desktop, both themes, with page-wide fallback suppression. Repeated 20-cycle native audio uses one context and returns active oscillators to zero. Timing observations are local lab only; field ranking/CWV impact remains unknown.

## E. PERFORMANCE

[Raw/gzip, SSR, chunk, navigation, CPU and memory evidence](evidence/w16-performance.json); [W09 baseline evidence](evidence/w09-payload.json). Identical built-handler response-body method, same dependencies, 390/1440 widths and blocked external services. Both widths produced the same byte counts below; all responses were 200 with substantive SSR, expected canonical/H1 and no page errors. Raw loaded JavaScript, not merely gzip, establishes the removal of the global book manifest dependency.

| Route | A JS raw | W09 JS raw | W16 JS raw | A SSR | W09 SSR | W16 SSR |
|---|---:|---:|---:|---:|---:|---:|
| / | 1,650,605 | 817,620 | 828,196 | 221,380 | 222,663 | 223,245 |
| /audio | 1,645,549 | 812,963 | 819,651 | 207,802 | 207,514 | 207,855 |
| /practice | 1,598,975 | 766,389 | 767,049 | 178,505 | 178,217 | 178,489 |
| /morse-code-alphabet | 1,797,873 | 965,287 | 965,947 | 250,257 | 249,969 | 250,243 |
| /morse-code-books/alices-adventures-in-wonderland | 1,740,868 | 1,742,702 | 1,744,901 | 397,574 | 397,432 | 397,784 |
| /morse-code-audiobooks/alices-adventures-in-wonderland | 1,741,198 | 1,743,032 | 1,745,233 | 296,030 | 295,888 | 296,207 |

Home loaded JS gzip: 357,828 -> 274,126 -> 278,551 bytes. Final home raw JS is 49.8% below hardened A; audio about 50.2% lower; practice about 52.0% lower. W10–W16 add 10,576 bytes to home and 6,688 to audio over W09, explicit bounded feature cost rather than zero growth. Home SSR adds 582 bytes after W09. No full book manifest re-enters core initial loading.

NavBar -> `navigationBooks` now fetches the automatically generated 42,220-byte / 12,182-gzip title/author/link index only on first open, caches it, retains loading/retry/focus behavior and canonical library hubs. Home uses compact featured props. Full library runtime remains on library routes: the final book manifest chunk is 832,411 raw / 83,554 gzip; the router manifest is 393,346 raw / 19,837 gzip. Library detail SSR remains about 398/296 KB and JS about 1.74 MB. These remain later performance work, not claimed improvements.

Navigation medians (3 trials per combination):

| Width/state | A open ms | W09 open ms | W16 open ms | W16 search ms |
|---|---:|---:|---:|---:|
| 390 cold | 58.95 | 52.91 | 60.03 | 15.1 |
| 390 warm | 52.03 | 61.39 | 63.87 | 6.63 |
| 1440 cold | 74.04 | 56.32 | 49.44 | 18.89 |
| 1440 warm | 34.59 | 54.68 | 40.17 | 6.58 |

Final navigation resource counts are three higher than W09, reflecting split feature modules; no repeated book-index request. Local latency is mixed, not evidence of a universal speedup. Supplemental single-observation 4x CPU simulation: home DOMContentLoaded 552 -> 532 ms, audio 445 -> 488, practice 405 -> 416. Host/throttling noise and one observation prevent causal claims; physical low-end devices and field CWV are unverified. W15's separate control also showed simulated timer stalls on an empty page.

Audio stays lazy: opening comparison creates zero contexts; repeated use shares one. Twenty native Chromium start/stop cycles returned active oscillators to zero every time; first click-to-node 87.8 ms, later median 32.4 ms includes automation overhead. Post-GC heap 4.98 MB before initialization, 6.06 MB after five cycles, 6.21 MB after twenty, with diminishing increments. This is bounded short-run evidence, not proof of no leaks. W15 normal-CPU 180-second analysis warm median 95.5 -> 44.6 ms and 30-second 15.4 -> 3.7 ms; chart evidence remains 512 bins/four paths. Simulated 4x and physical Safari limits are explicitly retained.

## F. SEARCH / INDEX

Sitemap before/after: **1,179 URLs = 524 books + 524 audiobooks + 131 other; zero print URLs**, no duplicates, malformed URLs, redirect-only URLs or support/noindex URLs. Existing print noindex/self-canonical behavior passes. No route registry, robots, sitemap, bulk indexing, rights, content ingestion or search query page changes. Canonical/metadata/sitemap audit commands pass. This assignment cannot establish ranking recovery; ranking impact is unknown.

W07 unresolved review queues remain 41 missing source links and 341 flagged title records. Six live remote payloads were probed in hardening; the other 518 were not silently declared healthy. No title was deleted/deindexed or reclassified from those queues. Later library decisions require separate evidence and owner approval.

## G. SAFETY

Final Node 22 production-context Netlify CLI build succeeds: build:netlify, build/client, adapter SSR catch-all, 6144 MB NODE_OPTIONS and summary include-files unchanged. ZIP **3,250,515 bytes**, **223 entries**, **12,733,115 uncompressed bytes**; SHA-256 `6c42eb2346dabe4ee465ce8ce15d2ac8043cd9a65ec6174e3122f8c42bb4cbe9`. Required SEO summary exactly once; full book payload/section corpus, chart assets and audit evidence zero. No hidden giant generated runtime artifact. The historical 4.2 MB W07 inventory remains historical evidence and is not imported or bundled.

The connected Netlify plugin can inspect deployments but does not provide the needed local artifact upload. The authorized CLI draft deploy (no --prod) returned **Unauthorized: could not retrieve project** before deployment. No hosted URL/preview is claimed. Actual locally served Netlify SSR handler plus complete production-equivalent package is the permitted fallback. A future production release still requires hosted exact-SHA validation and owner approval.

Ad source/configuration is unchanged. Ten protected lifecycle tests pass; actual blocked/unfilled/filled screenshots reviewed at 390/768/1536 in light/dark. Sidebars retain labels while unfilled; one simulated filled creative suppresses every fallback/Advertisements label page-wide; mobile creatives remain centered/unclipped. Simulation does not certify live ad delivery. Final home/audio screenshot matrix: 24 views, 390/768/1440, Chromium/WebKit, light/dark, zero overflow. Comparison, decoder inspection, loading/failure and video geometry screenshots also reviewed in package passes.

Storage keys and algorithms retained; only canonical-first migration is extended. No raw user text, decoded messages or learner answers sent to telemetry. Explicit local handoff uses bounded expiring module memory, no raw query/history/storage/server payload. Exports remain sequential/cancellable with exact completed-part tracking. Explicit oversized No split guard remains; segmented download remains available. Remote assets were read only for authorized probes; no upload or corpus mutation.

Original dirty checkout: all **191 recorded hashes match**, exact `git status --porcelain --untracked-files=all` matches, HEAD unchanged. Other worktrees/branches retained; no reset/stash/clean/delete. Detached A baseline remains at ffce7ae. The existing stale auxiliary worktree pointer was not repaired or removed. Final branch is clean after documentation commit; only ignored review artifacts remain.

Cumulative validation (counts overlap; do not sum as unique tests):

| Evidence | Result |
|---|---|
| Final typecheck / Netlify build+package / diff check | PASS |
| Final smoke / core / actual built-handler | 28 / 40 / 32 PASS |
| W16 integration, registry and settings | 84 PASS |
| Final correction, comparison, video, long export, library, provenance and timing matrix | 318 PASS, 6 intentional skips |
| Desktop-only protected export geometry | 1 PASS separately (4 alternate-project matrix skips) |
| Native recording unavailable in Windows WebKit | 2 matrix skips after unsupported UI assertions |
| Book segment advance, two sequential desktop/mobile repetitions | 16 PASS, unchanged assertions |
| Ad lifecycle | 10 PASS |
| Canonical / metadata / sitemap audits | PASS |

Initial cumulative early suite: 170 pass / 6 failures; audio suite: 289 pass / 13 failures / 2 native-audio skips. Final corrected matrix covers every failing case. Intermediate correction run: 306 pass / 12 failures / 6 skips, then fixture-targeted 24 pass, then final clean 318/6. Failures are not hidden: actual legacy migration/preset/close/SVG defects fixed; stale page expectations/API doubles and unsupported native capabilities corrected explicitly. Initial book runs failed under competing jobs, while an isolated case and two serial full repetitions passed without weakening assertions; exact contention attribution is not proven. Raw logs remain in ignored output/tranche-b, detailed screenshots/traces in test-artifacts.

Reviewed successive diffs A-base -> hardening -> W09 -> W10 -> W11 -> W12 -> W13 -> W14 -> W15 -> W16 and production -> cumulative head. Package boundaries map to manifest SHAs. No unrelated work, future-week implementation, sitemap/index/ad architecture changes or dirty-work loss found. Runtime changes after 754c83c are prohibited in documentation finalization; any new code would require new validation.

## H. OPEN ISSUES

Hosted draft upload is blocked by CLI authentication, precisely isolated from local package validation. No unresolved implementation/test failure remains in the authorized tranche. Physical Safari/iOS audio, native recording on this Windows WebKit build, real ads, field CWV, large library-route payload/SSR and host-sensitive CPU timings remain unverified or deferred concerns. No ranking recovery claim.

Microphone capture remains deferred beyond W16 and evidence-gated: permissions/privacy UX, device variability, mobile browser limits and substantial audio QA require a separate case. Competitor availability alone is insufficient. Later library review/rights/source decisions remain separate. W50 is the second performance-budget review; W17–W52 were not started.

## I. FINAL STATES

origin/main and current production SHA remain `8c83c8214d515565c314ff99bc3df8af88e73121`; production deploy remains `6af699314552c4b5a47d0889`, READY. Hardening head ffce7ae; weekly exact heads/bases and draft PRs above. Final cumulative W16 runtime code head `754c83c0627f7afa770b0c5848977aec8f11db48`; implementation `6a52b6fae01daf8692009c63b1b62ee410c41c53`. Documentation-only final review head is the containing commit and pushed W16 draft PR head, supplied as an exact SHA in the final owner response; no self-referential commit hash is invented here.

**TRANCHE A HARDENING: PASS**

**TRANCHE B W09–W16: PASS** (authorized Netlify-equivalent fallback; hosted upload limitation explicit).

**PRODUCTION SAFETY / ISOLATION GATE: PASS**

**NO W09–W16 CODE WAS MERGED OR DEPLOYED TO PRODUCTION.**

STOP AFTER THIS REPORT. DO NOT START W17.
