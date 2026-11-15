# Tranche C final owner review — W17–W24

Review-only stack. Stop after W24; W25–W52 remain proposed. Validation means a
review candidate passed the recorded local gates; it does not mean released.
The final receipt commit records the documentation commit without self-referential
SHA claims. The final application bundle is `8a859fd39fd4ad2c5ad676a5a0a2ea62262c2eb0`;
subsequent changes are tests and release documentation only.

## A. Production state

Starting and final `origin/main`: `8c83c8214d515565c314ff99bc3df8af88e73121`.
Read-only Netlify checks confirm published deploy `6af699314552c4b5a47d0889`
is READY/current on main and has that exact commit. The W16 review base is
`689d8ea38965b37d70138d761f5407cd01bffcb1`. Review work is isolated from both.

## B. Tranche B hardening

Branch `review/2027-tranche-b-hardening`, draft PR [19](https://github.com/suhas-sunder/morsewords/pull/19).
Commits, in order:

- `602802276910ddf5fe3ca083c11acc1155217a77`: navigation-index freshness in the normal release gate.
- `050fd3c12146145acbc5b7129c51a8840139b806`: deterministic CRLF-aware comparison.
- `949f27729626f445cdeb3764cffd34191b314503`: authority, schema, validator and persistent gates.
- `bc73402dbc2cee734dfb80a0c9cb7405ac0a3f3b`: hardening evidence and review record.

These are internal infrastructure dependencies, not an extra public weekly release.
See [hardening evidence](TRANCHE-B-HARDENING.md).

## C. AGENTS authority resolution

The 2027 master release train, production calendar and package manifest are the
ordered authority. The competing legacy priority sequence is retired; durable
visual, storage, audio/export, privacy, rights and ad protections remain.
No one-off W24 prompt was pasted into AGENTS. Its authority check is part of the
read-only package validator and integrity tests.

## D. Package-manifest schema and gates

Schema v2 gives every W01–W52 record the same fields: status, scope, dependencies,
implementation/amendment/documentation commits, common/focused gates, evidence,
review branch and PR. Explicit hardening records participate in dependencies.
`commitOrder` lists every assigned commit exactly once. The validator rejects
unknown/cyclic dependencies, malformed/duplicate SHAs, illegal status, incomplete
validated records and RELEASED without actual deployment/owner evidence.
W01–W24 are review packages; none is relabeled RELEASED. W25–W52 stay proposed.
The final documentation receipt cannot contain its own future SHA; it is not an
application package and is identified by the branch head in the owner response.

## E. Navigation-index release invariant

`books:navigation-index:check` runs in `site:local-final-validation` and is an
always-on persistent gate introduced by W09. It compares deterministic generated
content, normalizing line endings only. Stale, missing and corrupted content fail;
the check does not regenerate files. The compact index remains 42,220 bytes.
The shared-audio W12 gate and library-runtime W17 gate are selected for affected
surfaces, so future packages cannot silently omit those protections.

## F. W17 payload architecture

Pure `morseBookRuntime` and data-free canonical paths serve client consumers.
Server-only detail lookup provides the current book/profile and at most four
related cards. The runtime uses the current book asset directly and rejects a
wrong-slug payload. Full catalog and bulk suitability profiles stay out of initial
book/audiobook detail chunks. Shared algorithms, content, rights and canonical
routes are preserved. See [W17](W17.md).

## G. W17 before/after measurements

W16 → W17 loaded book JS: 1,744,901 → 928,549 raw bytes; 383,289 → 305,181 gzip.
Audiobook: 1,745,233 → 928,916 raw; 383,449 → 305,362 gzip.
The 832,411-byte catalog chunk disappeared from those entries. All five measured
core routes were byte-identical at W17. Full-content fetches fell from two/three
to one. Detail HTML grew 478–791 bytes to retain useful server context.
[Compact evidence](evidence/w17-library-payload.json) includes baseline/final SHAs,
390/1440 measurements, serialized state, largest chunks and limitations.

## H. W18 — choose a useful start

`036a148dc639adaa02cedd6952b144a049c47b4e`: a shared chooser on existing guide/practice
routes starts the appropriate existing exercise, including ETANIMSO beginner work.
Intent is bounded, one-use, in memory and expires; no learner content enters URLs.
Hydration and input-focus styling preserve existing storage and home behavior.
See [W18](W18.md).

## I. W19 — answer feedback

`60f7af157c9fb99a42bf362a5f94bdcb9d20c5e6`: optional submitted-answer comparison on
six exercise routes preserves their distinct grading/spacing rules. Differences
are bounded to 240 code points/eight groups, underline and text labels do not rely
on color alone, and submitted feedback clears with the next task. See [W19](W19.md).

## J. W20 — local weak-spot review

`76cc6479721b39c84f1798b94e86df85946b446e`: bounded versioned local review queue,
100 targets at most, never submitted answers. Private custom targets remain
private; damaged data is preserved until explicit clear. Review uses original
exercise grading, explicit removal/clear, lazy UI and one-use audio handoff.
See [W20](W20.md).

## K. W21 — honest session completion

`08676b25e882d001f71a1a04c13b699a45a29616`, test amendment
`685ed837db245dc567aee0f55da62854a03ae2bb`: short sessions and early finishes count
actual completed/checked work once. Listening retains open-ended practice. Typing
excludes hidden time, resumes explicitly and finishes truthfully at its deadline.
Nested dialogs preserve focus/Escape ownership, including WebKit download focus.
See [W21](W21.md).

## L. W22 — sound-first progression

`cfaffdf5161b83cdcb912b31cafe1ccb383ff34a`: optional manually selected 2/4/6/8/12/18/26
letter sets, starting ETANIMSO. Ten-round counts are practice history, not a mastery
or certification claim. Static presentation, full tone registry, existing audio
engine and settings stay available; no autoplay. Saved data is selected set and
seven bounded counts only. See [W22](W22.md).

## M. W23 — accessible non-flash practice

`dcd07dfd62ec6ed9539f523afc02b73b0fb30bc3`: static visual targets, shared cancellable
visual playback, warnings before flash starts, preserved toggle/lamp grouping,
reduced-motion defaults and global-disable protection. Same targets and grading.
Scoped support contrast and semantics fixes preserve home. An opt-in caption
color adjustment affects learning-route fallback text only; no ad lifecycle,
placement, format, dimension or global suppression behavior changed. See [W23](W23.md).

## N. W24 — portability

`8a859fd39fd4ad2c5ad676a5a0a2ea62262c2eb0`: lazy local export/import UI on the existing
guide. Strict versioned JSON, 1 MiB before-read limit, exact allowlisted learning
keys, preview, explicit private opt-in, previous-values download, partial-failure
rollback and stale-safe undo. No new persistent key, network upload, settings
migration or book/cookie/ad data in files. Missing sections stay unchanged; null
clears only listed values. See [W24](W24.md) for concurrency and recovery details.

## O. Final learning journeys and test accounting

Final portability matrix: 80/80 passed across Chromium/WebKit, light/dark and
390/768/1440 widths. Real file downloads were read back. Beginner flow includes
first error → comparison → correct → early finish → review → export → clear →
preview → restore → reopened review. Listening flow includes explicit native
Chromium playback, selected set, static answer, completion and saved weak review.

| Gate group | Result |
|---|---|
| Final application typecheck/build/offline Netlify package | PASS |
| Smoke (`npm test`) | 28 passed |
| Core product (`npm run test:core-product`) | 40 passed |
| Built release validation | 33 passed |
| Library payload / all detail SSR | 3 routes / 524 details passed |
| Release integrity | 19 passed; final manifest validator passed |
| Existing review matrix | Initially 1,122 passed, 8 skipped, 10 failed; affected reruns below |
| Learning matrix | Initially 435 passed, 4 native-audio skips, 1 readiness failure; corrected feedback cases passed in rerun |
| Existing default Chromium matrix | 218 passed, 6 print fixture/environment failures; development rerun below |
| Readiness + decoder + suitability rerun | 230 passed, 2 native-listening skips, 4 test-boundary failures |
| Corrected decoder boundary rerun | 131 passed, 1 built-chunk interception failure |
| Final onboarding rerun | 12 passed, including deterministic blocked-render cancellation |
| Reference audio resource rerun | 4 passed |
| Sequential book export rerun | 4 passed |
| Ad lifecycle focused gate | 20 passed |

Test-only amendment: `707f872445e1d66153a29a5c04cf0f6e710fd44b`.
The initial failures were investigated individually: pre-hydration interactions;
Chromium `ERR_INSUFFICIENT_RESOURCES` loading a shared chunk; absent native WebKit
AudioContext; an adapter property that initially prevented a delayed decoder stub
from replacing it; a deliberate revoked-blob fetch counted as an application
console error; an intercept matching development module URLs but not built chunks;
and completion just beyond the default assertion deadline for seven sequential
real WAV renders. Fixes preserve output, score, storage, privacy and cancellation
assertions. The final interception explicitly proves the renderer request is
blocked before cancellation. No product assertion was removed or weakened.

The eight existing-review skips are four project-name-specific desktop geometry
cases plus Windows WebKit native recording/audio cases. The protected geometry
case is run separately under its required desktop project, recorded below.

Counts are overlapping groups, not one unique grand total. Failure history and
reruns are retained rather than adding their counts together. Native Windows
WebKit audio is unavailable: native listening tests skip explicitly. Decoder
coverage uses the existing signal-inspection PCM WAV boundary adapter only when
the API is absent, retaining real sample generation and detector math; Chromium
remains native. A separate test verifies the real unsupported-API message and
clear behavior. No native WebKit audio claim is made.

## P. Cumulative performance

| Route | W16 JS raw/gzip | W24 JS raw/gzip |
|---|---:|---:|
| Home | 828,196 / 278,551 | 834,255 / 281,423 |
| Audio | 819,651 / 275,901 | 825,717 / 278,766 |
| Practice | 767,049 / 255,487 | 786,740 / 264,489 |
| Learn | 786,337 / 257,501 | 795,177 / 261,712 |
| Audio practice | 805,414 / 270,764 | 829,699 / 280,798 |
| Alice book | 1,744,901 / 383,289 | 934,608 / 308,037 |
| Alice audiobook | 1,745,233 / 383,449 | 934,975 / 308,215 |

All 30 final observations have no page/hydration errors. Initial detail catalog
flag is false. Learning additions cost 6,059–24,285 raw / 2,853–10,034 gzip bytes
relative to W17, depending on route. Review/portability panels stay lazy; shared
storage registration and dialog dependencies explain the small common increase.
No substantive SSR content was moved client-side. The largest shared chunks
remain React, UI/animation and routing. Future optimization should be measured,
not used to postpone an actual regression. These are lab bytes and local fixture
readiness observations, not field CWV/INP/LCP. See [final evidence](evidence/w24-performance.json).

## Q. Library regression

All 524 accepted detail routes passed structural SSR checks. Three built payload
gates passed; Time Machine print loads 801,648 JS bytes. Runtime coverage includes
startup, full/delayed/missing assets, retry/failure context, settings restoration,
book/audio parity, section advance, playback, segmented export, print noindex,
metadata/schema/source and bounded related books. Representative measurements
include Alice, Time Machine, Christmas Carol, Anne of Green Gables, Count of Monte
Cristo, the shortest title, Secret Garden and Grimm's Fairy Tales. The historical
Count Gutenberg alias resolves to the retained canonical title.
Development-only live-player/print group: initially 13/14 passed. A cold QR-code
prebundle triggered a Vite reload/duplicate React context on the first Walden print
case; warmed unchanged print rerun passed 6/6 across desktop/mobile. All eight
segment-advance cases passed, including stale completion and manual next-section
ownership. These resolve the six earlier built-only print fixture failures.

The ignored local harness uses fixed source with HMR/file watching disabled and
the exact built production CSS/fonts. This avoids Windows artifact-watcher churn
and CSS module timeouts without changing application source. Development serves
approved existing local book fixtures; no books were ingested. The initial harness
startup attempts and cold prebundle failure are retained in local logs. Protected
desktop video DOM/export geometry also passed its separately required project: 1/1.

## R. Sitemap and index footprint

1,179 entries: 524 books + 524 audiobooks + 131 other routes; zero print URLs.
Canonical/indexability, metadata/content quality and sitemap reconciliation audits
passed. No bulk indexing, noindex, deletion, rights, catalog or ingestion change
was introduced by W17–W24. The footprint matches the approved W16 review stack.
Generated historical audit reports were not added to the release diff.

## S. Netlify package and preview limitation

Node 22.23.4 offline production build/package passed using cached Netlify CLI
27.17.0. ZIP: 3,291,907 bytes; 224 entries; 12,844,060 uncompressed bytes. Exactly
one required SEO-summary asset; zero full-book payloads, chart PNGs or audit
reports. Build configuration remains 6 GB and includes required summary/SSR
handler/catch-all behavior. Typecheck, React Router production build and offline
Netlify packaging passed. The earlier one-time CLI auth failure was not retried;
there is no new hosted preview. The offline built handler was tested locally.
This is not production deployment evidence.

## T. Ad safety and visual review

Focused protected-placement regression: 20/20 passed (desktop/mobile Chromium).

Screenshots cover blocked/unfilled/filled states at 390/768/1536 in both themes.
Every simulated filled state has zero visible fallback captions and no overflow.
Desktop fallback rails stay labeled when unfilled. Actual screenshot inspection
confirmed independent centered creatives and removal of fallback chrome. Final
home/audio reference matrix: 24 observations, Chromium/WebKit, light/dark,
390/768/1440; zero horizontal overflow and approved typography/layout retained.
No AdSense lifecycle, protection, format or global safety-guard changes.

## U. Privacy

Learner answers are not persisted or sent to analytics. Review stores targets
only, private custom content is flagged, and local JSON excludes it by default.
Import/export never uploads files or filenames; request sentinels verify this.
Malformed/unknown/oversized imports fail before mutation, private imports require
explicit consent, and unrelated storage is excluded. Private-capacity overflow
rejects instead of silently evicting private targets. Downloaded backups may
contain private text and the UI labels that fact. No server-side account sync.

## V. Branch and draft PR inventory

| Package | Branch | Draft PR | Application SHA |
|---|---|---|---|
| Hardening | `review/2027-tranche-b-hardening` | [19](https://github.com/suhas-sunder/morsewords/pull/19) | `949f27729626f445cdeb3764cffd34191b314503` |
| W17 | `release/2027-W17-library-detail-payload` | [20](https://github.com/suhas-sunder/morsewords/pull/20) | `6b059417459a40c3c243d18748aecd3e13d24860` |
| W18 | `release/2027-W18-learning-start` | [21](https://github.com/suhas-sunder/morsewords/pull/21) | `036a148dc639adaa02cedd6952b144a049c47b4e` |
| W19 | `release/2027-W19-answer-feedback` | [22](https://github.com/suhas-sunder/morsewords/pull/22) | `60f7af157c9fb99a42bf362a5f94bdcb9d20c5e6` |
| W20 | `release/2027-W20-weak-spot-review` | [23](https://github.com/suhas-sunder/morsewords/pull/23) | `76cc6479721b39c84f1798b94e86df85946b446e` |
| W21 | `release/2027-W21-session-completion` | [24](https://github.com/suhas-sunder/morsewords/pull/24) | `08676b25e882d001f71a1a04c13b699a45a29616` |
| W22 | `release/2027-W22-sound-first-progression` | [25](https://github.com/suhas-sunder/morsewords/pull/25) | `cfaffdf5161b83cdcb912b31cafe1ccb383ff34a` |
| W23 | `release/2027-W23-non-flash-practice` | [26](https://github.com/suhas-sunder/morsewords/pull/26) | `dcd07dfd62ec6ed9539f523afc02b73b0fb30bc3` |
| W24 | `release/2027-W24-learning-portability-review` | [27](https://github.com/suhas-sunder/morsewords/pull/27) | `8a859fd39fd4ad2c5ad676a5a0a2ea62262c2eb0` |

Each draft is based on the previous package; PR19 is based on W16. Do not merge
the entire stack as one production release. Actual weekly releases start from
fresh current main and require the calendar's gates and owner decision.

## W. Unresolved risks and practical limits

No hosted Netlify preview due to the one-time auth limitation. Native Windows
WebKit audio is unverified; static workflows and adapted detector math are tested.
LocalStorage has no cross-tab atomic transaction; stale checks plus close-other-
practice-tabs instructions reduce overwrites, and backups provide recovery.
Rollback can fail when storage itself is unavailable, which is reported honestly.
No automated test certifies learning effectiveness or guarantees search recovery.
All observed application regression cases are covered by passing focused reruns.
The initial matrices were not silently relabeled clean runs. Remaining skips and
hosted/native-platform limits above are explicit release-review limitations.

## X. Deferred work

W25–W52 remain proposed in their established order. No new route family, account,
cloud sync, adaptive mastery system, book ingestion or search-ranking promise.
Production readiness requires future fresh-main reconciliation and release gates;
this assignment does not authorize production rollout or scheduling automation.

## Y. Production/main unchanged

No main push, merge, force-push, production deploy, old-deploy restoration or
rollback was performed. Read-only Git/Netlify checks match section A.
**NO W17–W24 CODE WAS MERGED OR DEPLOYED TO PRODUCTION.**

## Z. Protected original worktree verification

Original checkout remains at `8627d04ec3b6d2f561a29032f508f5f3410b11d5`.
All 191 recorded file hashes and the complete porcelain status match the protected
baseline exactly. No reset, stash, clean, deletion or write was performed there.
The isolated Tranche C checkout contains the review stack. Netlify configuration,
lockfile, approved home/audio implementations, book assets/rights/catalogs,
canonical route registry and ad implementation remain protected.

## Verdicts

- TRANCHE B HARDENING: PASS
- W17 LIBRARY PAYLOAD ISOLATION: PASS
- TRANCHE C W18–W24: PASS
- PACKAGE RELEASE-GATE INTEGRITY: PASS
- PRODUCTION SAFETY / ISOLATION GATE: PASS

These are local review/isolation verdicts with the stated platform/hosted-preview
limits, not production release approval. Compact safety evidence is in
[evidence/w24-release-checks.json](evidence/w24-release-checks.json).
