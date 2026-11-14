# Tranche A owner hardening

Status: VALIDATED / READY FOR OWNER REVIEW. Review branch `review/2027-tranche-a-hardening`; base `33ff79215cc303b66c5f37b9ddaaa954edbd405e`. Append-only history; no original weekly branch rewritten. This record is not a production release.

## Amendments

| Package | Correction | Implementation SHA |
|---|---|---|
| W05 | Label the separator's one-letter/seven-word literal text spaces as MorseWords text notation. Explain transmitted character/word silences as three/seven dot units. Clarify nearby translator helper copy without changing its existing three/seven-space output. | `f3a3e32c38f935796e151edb5a108e3d2fd82ba5` |
| W06 | Ordinary dictionary A–Z/0–9 and listed punctuation use one compact linked authority note. Inline source details remain for extensions and operating-signal collisions; the dedicated punctuation reference remains detailed. Registry and encoding unchanged. | `dcf88d35385c8e85ce9ea0f2db7e8497da2b2a1c`, `ca9f244f70ec30cbfe9f8969e2708e83ebe9648e` |
| W07 | Default compact inventory, finding queues and human summary; deterministic canonical full-report hash/byte manifest, optional delta from full or compact evidence, explicit ignored-only `--full-snapshot`. Refuse to overwrite the historical W07 inventory. | `8a3652d683f301c64ab63c24615bae46625f1718` |
| W08 | Match loading/ready hero positioning and reserve bounded genuine-loading space, without interactive placeholders or terminal-error whitespace. Preserve independent preview-content identity, settings, progress, retry and explicit No split behavior. | `afd68084ceac5b6123c7833f44753e7299027437` |

The release-system amendment updates README, calendar, manifest and roadmap, and links W05–W08 ledgers to these SHAs. Its commit follows these implementations and is identifiable in Git. W09–W16 are revised as global payload, input diagnostics, boundary recovery, playback lifecycle, export recovery, sound comparison, signal inspection, and integration review. Microphone capture is deferred. W17–W52 remain future proposals; W50 is the second performance review.

## Three review passes

1. **Functional:** 14 spacing/provenance checks and 32 existing separator/reference/evidence checks passed. The final cumulative W02–W07 focused set passes 42 checks, including canonical timing and real decoder sample behavior. All 36 book startup/failure/loading/parity checks pass; excerpt failure does not overwrite full-book settings, Retry restores the full selection, and the existing duration-split path remains available.
2. **Visual/content/transitions:** home/audio source and computed typography/palette were inspected. Generated 48 Chromium/WebKit views at 390/768/1440 in light/dark, no overflow; inspected actual screenshots and refined dictionary copy to one compact note. Generated and checked a further 24 delayed-preview/full-loading cases across both book modes, widths, themes and engines. Heading position is stable; no fake player controls exist during loading; terminal errors have `min-height: 0px`. Primary ITU M.1677-1 and ARRL FSD-218/FSD-220 references were rechecked; their scope remains unchanged.
3. **Regression/SEO/accessibility/performance:** typecheck, build:netlify, production-context Netlify build/package, 28 smoke, 40 core-product built-browser checks, 32 current built-handler checks, three canonical/meta/sitemap audits, scoped axe within focused suites, and four protected ad fallback/creative checks pass. No new route, canonical ownership, bulk indexing, ad lifecycle or asset upload change.

The initial development-server core run passed 38/40; two language-hub links disappeared after hydration while Vite dependency optimization/reloading was active. The unchanged suite against the actual built Netlify application passed 40/40, including both language-hub cases. No assertion or route was weakened. Development server startup contention during follow-up was isolated from built-handler tests. Review matrix screenshots now have their own artifact directory so default suites cannot erase them.

## Loading measurements (local lab, not field CWV)

At 844px viewport height, baseline loading panels were 172px at 390 width and 146px at 768/1440. Loading-to-ready H1 top moved 16px/8px. After the correction, reserved heights are 633px mobile and 576px tablet/desktop, bounded by viewport/rem limits, and H1 top changes by zero. Observed Chromium LayoutShift totals were 0 at 390, about 0.0091 at 768 and up to 0.0145 at 1440 before; after they were 0, about 0.0013, and at most about 0.0023. These controlled observations are not field CLS; removed/replaced elements and unsupported WebKit LayoutShift reporting limit interpretation. Windows WebKit does not certify actual Safari audio support.

## Evidence and packaging

Fresh full scope: 524 titles / 1,048 actual built SSR page observations / 1,179 sitemap URLs, six live payload probes, 41 missing source links and 341 flagged title records. Findings are review queues, not removal recommendations; the other 518 live payloads remain unprobed. The historical 4.2 MB report is unchanged. The no-network compact run is 171,421 bytes plus a 1,065-byte summary; the all-SSR comparison delta is 568,952 bytes, with the optional canonical full snapshot only in ignored output. Probe-scope changes never count as improvement.

Production-equivalent Node 22 Netlify function ZIP: **3,236,690 bytes**, **223 entries**, **12,686,819 uncompressed bytes**. Required summary JSON appears exactly once; full book payload/section corpus, chart binaries and W07 evidence/report files appear zero times. `netlify.toml`, adapter, SSR catch-all, publish path, memory setting and include-files remain unchanged.

Local evidence lives under `output/tranche-b/`: `a-*-tests.log`, `a-focused.log`, `a-weekly.log`, `a-core-built.log`, `a-local-final.log`, `a-loading-baseline-results.json`, `a-book-test-results.json`, `a-loading-matrix-final.log`, `a-final-evidence.*`, `a-package-audit.json`, and the visual screenshots. The independent matrix results/screenshots are under `test-artifacts/review-matrix*`. They are reproducible artifacts, not runtime imports.

## Isolation, calendar and rollback

Fetched origin/main remains `8c83c8214d515565c314ff99bc3df8af88e73121`. The original dirty checkout retains all 191 recorded hashes and identical status; no reset, stash, cleanup or edit there. The five clean historical auxiliary worktrees and pre-existing broken D-drive worktree pointer remain untouched. The W01–W08 draft PRs remain historical review surfaces, not future production branches.

The calendar defines 52 Sunday windows, January 3–December 26, 2027, at 10:00 America/Toronto. W01 accompanies W02 and W07 accompanies W08; two year-end contingency windows are unassigned/default skip. Every production candidate must start from then-current origin/main and receive exact-SHA preview/hosted validation and owner approval. A blocked package is skipped, never automatically doubled or bypassed.

Rollback: revert the selected amendments in reverse dependency order against current main through a fresh validated candidate; preserve original package work, storage and user data. No historical deploy restore. No main merge, production deployment, automation or W17 implementation is authorized here. Continue with W09 only after this corrected Tranche A gate.
