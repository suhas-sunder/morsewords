# Tranche B owner hardening

Review branch: `review/2027-tranche-b-hardening`.
Base: `689d8ea38965b37d70138d761f5407cd01bffcb1` (final W16).
Status: VALIDATED / READY FOR OWNER REVIEW. Not released.
Draft PR: [#19](https://github.com/suhas-sunder/morsewords/pull/19).

## Authority and release records

AGENTS now places the roadmap, production calendar, package manifest and latest
accepted owner review in an explicit authority order near the top. The obsolete
export → language → contact → books → final optimization sequence is retired.
Durable export, language accuracy, support address, rights, raw-source and content
rules remain. A regression test rejects reintroduced legacy sequencing headings.

Manifest schema 2 gives all W01–W52 consistent implementation/amendment/documentation,
review, gate and rollback fields. W13's capability test correction is an amendment.
All historical implementation/amendment SHAs were compared with the W16 manifest;
none was lost. All mapped commit objects, test paths and W01–W16 remote branch heads
were verified. Internal hardening dependencies are explicit records. `commitOrder`
records each assigned SHA once in chronological order; it does not authorize replay.
Future packages remain PROPOSED with empty commit arrays and no release claims.

The read-only validator covers schema, 52-week coverage, IDs, legal status,
implementation evidence, full SHA syntax, duplicate assignment, dependencies/cycles,
focused/common gates, routes/surfaces, rollback, proposed records and production
proof for RELEASED. Tests exercise invalid cases. The optional gate selector only
prints commands: W09 freshness persists; W12 lifecycle applies to shared-audio
changes; W17 payload isolation applies to library-runtime changes after inclusion.
No Git/deploy mutation or command execution occurs in either helper.

W01–W16 focused suites are now explicit in the manifest. W05–W08 include their
owner-hardening regressions; W09–W16 cover payload, translator diagnostics,
boundary/handoff, lifecycle, export recovery, comparisons, signal inspection and
integration/settings/format/preset/timing/video/book contracts respectively.
W17–W24 roadmap/calendar themes are corrected; W24 folds portability and integration.
Sunday 10:00 America/Toronto dates and the general W25+ sequence are preserved.
No scheduling automation was created.

## Append-only commits

- W09 normal-gate freshness: `602802276910ddf5fe3ca083c11acc1155217a77`.
- W09 Windows newline compatibility: `050fd3c12146145acbc5b7129c51a8840139b806`.
- Authority/schema/validator/focused gates: `949f27729626f445cdeb3764cffd34191b314503`.

The first freshness test exposed Git CRLF conversion in a fresh Windows checkout.
The follow-up accepts only newline conversion, not stale content. Valid, missing,
stale and CRLF fixtures verify that checking never creates or rewrites the index.
Explicit generation remains separate; no production build regeneration was added.
The normal current-product gate now checks freshness before starting the server.

## Verification and protection

19/19 release-integrity cases, typecheck, production build, 33/33 built-handler
checks and 28/28 default smoke pass. 36/36 Chromium/WebKit light/dark navigation cases, 40/40 core-product cases and all
three canonical/meta/sitemap audits pass. Desktop results and mobile failure screenshots
were inspected; keyboard/retry/search and preserved layout remain intact.
There is no application UI, algorithm, storage, ad, route, sitemap, rights, raw
source, remote asset or Netlify configuration change. Baseline W17 measurements
were taken before any application edit: 26 Chromium observations, zero page or
hydration errors, seven representative book titles plus Alice audio and five core
routes, at 390/1440. Detailed ignored evidence: `output/tranche-c/w17-before-payload.json`.
Alice book JS is 1,744,901 raw / 383,289 gzip bytes; its manifest-containing chunk
is 832,411 raw / 83,465 gzip. Alice audio JS is 1,745,233 raw / 383,449 gzip.
Loader JSON is 40,584/40,589 bytes respectively; no related records are serialized
in the old loader. These are local lab observations, not field performance.

Current origin/main and the READY production deploy still identify
`8c83c8214d515565c314ff99bc3df8af88e73121`, deploy `6af699314552c4b5a47d0889`.
The original dirty worktree and historical worktrees were inventoried read-only.
Implementation uses a new clean worktree. Existing Netlify CLI authorization is
known unavailable; no repeated authentication/deploy attempt was made.

Rollback: revert these selected amendments/infrastructure changes on a fresh
current-main candidate in dependency order, preserving user data and subsequent
emergency fixes. Revalidate and follow the owner release procedure. No main merge
or production deployment is authorized by this review.


## Final release-selector amendment after W24 owner review

Base: `164bef1d3d0a98461c1aa4b01aac4d629a8e5e34`.
Implementation: `380b4135ecc5a6a298c923d5e4e90c7e3d2a7435` on
`review/2027-release-selector-hardening`, in its own clean isolated worktree.
This is an amendment to Tranche B infrastructure, not a weekly product package.
The separate documentation receipt records the implementation SHA once in this
internal package and `commitOrder`; it does not try to record its own future SHA.

The old selector checked direct dependencies only for selected packages and built
availability only from explicit IDs. Included packages could therefore hide
missing prerequisites, and genuinely released gate owners were not recognized
unless manually re-listed. The selector now validates all explicit IDs/statuses,
adds only actual RELEASED records to availability, and recursively checks every
selected/included dependency chain, including internal hardening records. Missing
prerequisites report the full chain. PROPOSED, BLOCKED and IN_PROGRESS inclusions
fail; VALIDATED is never treated as shipped. Traversal also checks the prerequisites
of a released dependency reached from a candidate root.

Persistent always gates activate for released or explicit owners. Affected gates
still require an operator-reviewed surface; there is no filename inference. The
selector still only validates, reads and prints commands. It does not execute
listed tests, mutate the manifest or perform any Git/deployment action. Common
and focused command listing remains scoped to explicitly selected packages.

Eleven added regression tests cover the requested A–H cases, unreviewed included
statuses, immutable inputs and command deduplication. The W09 test removes the
same command from common/focused gates to prove activation comes from persistence.
Synthetic release evidence exists only in test clones/ignored CLI fixtures.
Current-manifest W19 + W18 fails at W17. W19 + W17,W18 alone also fails at W16:
W17's existing prerequisites cannot be bypassed. Success includes W01–W18 and
both hardening records, or recognizes genuinely released prerequisites. No
checked-in dependency or status was weakened to make a shortened example pass.

Validation: typecheck, build, manifest validator, navigation freshness and
`git diff --check` passed. Release-integrity tests: 30/30 passed. Five direct CLI
exercises verified incomplete-chain failure, complete-chain success, released W09
always gate, released W12 affected gate with shared-audio, and its absence without
that surface. `npm test` against the local production build: 28/28 smoke tests passed.

Weekly statuses remain W01–W24 VALIDATED (24), W25–W52 PROPOSED (28), zero RELEASED.
The protected original checkout still matches all 191 file hashes and exact dirty
status. W17–W24 application code, UI, runtime, sitemap, rights and production
configuration are unchanged; W25 was not started. Origin/main remains
`8c83c8214d515565c314ff99bc3df8af88e73121`. No main push, merge or deploy.
