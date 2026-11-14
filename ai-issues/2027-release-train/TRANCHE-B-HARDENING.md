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
