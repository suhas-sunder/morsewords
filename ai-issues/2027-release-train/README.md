# 2027 implementation packages and production releases

Audit base: `8c83c8214d515565c314ff99bc3df8af88e73121`; ready production deploy `6af699314552c4b5a47d0889`. This remains the historical baseline, not a future release branch base.

## Review branches are package history

The W01–W08 stacked draft PRs #2–#9 remain open, unmerged historical review surfaces. Their code/evidence remains useful; their cumulative branches must not be merged directly into main months later. `review/2027-tranche-a-hardening` records append-only owner amendments from W08 head `33ff79215cc303b66c5f37b9ddaaa954edbd405e`. W09–W16 review branches start cumulatively from each preceding validated package. None is a standing production branch. The historical [FINAL-REVIEW.md](FINAL-REVIEW.md) describes the prior assignment and is superseded by this procedure for release mechanics.

W01 is **FOUNDATION / RELEASE INFRASTRUCTURE**. W07 is **RESEARCH / EVIDENCE CHECKPOINT**. Preserve their IDs and attach them to adjacent user-facing releases. Consult [package-manifest.json](package-manifest.json) for exact implementation/amendment SHAs, dependencies, tests and rollback. Empty future commit arrays mean unimplemented, never implicit authorization.

## Fresh release candidate procedure

1. Fetch `origin/main`, inventory worktrees, verify the ready production deploy and exact SHA. Investigate any mismatch. Protect uncommitted work.
2. Select only the dated reviewed package(s) and their recorded amendments from the [production calendar](PRODUCTION-CALENDAR.md). Verify each dependency is already shipped or expressly included. A blocked dependency requires a skip unless an explicit dependency review proves independence.
3. Create `ship/2027-Wxx-theme` from **current** `origin/main`, where Wxx identifies the primary implementation package. Record the actual base SHA. Incorporate intervening emergency fixes through this fresh base.
4. Inspect and apply only the selected commits/amendments. Resolve conflicts against current product requirements; do not blindly replay cumulative history. Review the incremental diff for accidental future work. The manifest is evidence, not an executable cherry-pick/push script.
5. Run typecheck, tests, `build:netlify`, current built-handler gate, core-product tests, canonical/meta/sitemap audits, focused regression and affected-consumer browser QA. Perform functional, visual/content/transitions, then regression/SEO/accessibility/performance passes. Audit the actual production-equivalent Netlify ZIP: summaries present, full corpus/evidence absent, architecture and ad safeguards preserved.
6. Commit the candidate and create an immutable **non-production** preview of that exact SHA. Verify the deployment SHA and perform hosted SSR, browser, resource and asset checks. A local equivalent alone does not authorize a future production release.
7. Present the exact candidate SHA, preview, evidence, risk/rollback and package list for the owner release decision. No automation or production release is authorized by this document.
8. Only after that decision, integrate the fresh candidate without accidentally including future packages. Recheck main if it moved; regenerate/revalidate the candidate rather than assuming old preview evidence applies.
9. Verify the ready production deployment's exact SHA, run live smoke, and record deploy ID, URL, time, results and shipped package/amendment SHAs. Never mark a review package RELEASED before this evidence exists.

## Required commands and evidence

Use `npm ci`. For local book browser fixtures, `npm run books:cloudflare-export` writes ignored local output from existing sources; it performs no upload. Then run:

```text
npm run release:validate-package-manifest
npm run test:release-integrity
npm run books:navigation-index:check
npm run typecheck
npm test
npm run build:netlify
npm run site:local-final-validation
npm run test:core-product
npm run pages:url-indexability-canonical-audit
npm run pages:gsc-meta-content-quality-audit
npm run pages:sitemap-count-print-indexability-audit
```

Also run package-specific tests, current book startup/audiobook parity, ad-state regressions, and `git diff --check`. Do not rebuild concurrently with built-handler tests. The historical batch validator remains separately available; do not substitute it for the current product gate. Netlify build command/publish path/adapter/memory/include-files stay protected. Real ads and real Safari audio cannot be certified by deterministic mocks or Windows WebKit.

## Blocking and rollback

Blocked means skip the affected package/window. Do not automatically double next week's payload, borrow future code, or bypass a blocked prerequisite. Reschedule explicitly with fresh evidence and owner review. Emergency fixes go through their own approved flow and become part of all subsequent fresh-from-main candidates.

Rollback is a reviewed revert of the applied increment/amendments against current main, in dependency-safe order, followed by all relevant gates, an exact-SHA preview, owner decision and verified production deployment. Preserve storage/user data. Never restore an old deployment that discards later emergency fixes.

This assignment authorizes review branches/draft PRs and safe non-production previews only. No main merge, force push, production deployment or scheduling automation.

## Manifest schema and focused gates

Schema 2 assigns each SHA exactly once to implementation, amendment or documentation
commits. `commitOrder` records chronological application order across weekly and
explicit internal hardening records; it is evidence for reviewed selection, never
an executable replay script. W13's browser capability correction is an amendment.
Documentation commits that reconcile several earlier weeks are owned once by the
closing package. Empty future arrays mean proposed, unimplemented work.

`npm run release:validate-package-manifest` is read-only. It checks all 52 IDs,
commit assignment, dependencies/cycles, statuses, gates, rollback and the AGENTS
source-of-truth section. RELEASED additionally requires actual candidate/deploy,
owner-decision and live-check evidence. VALIDATED is review readiness only.

The optional `release:select-gates` command is advisory/read-only and only prints
commands; it never executes tests or a release, or changes files, commits, branches
or deployments. Packages with actual `RELEASED` status and validated production
evidence are recognized automatically. `VALIDATED` alone does not mean shipped.
Use `--included` for validated prerequisites intentionally shipped in this same
fresh candidate, not to re-list historical releases. For example, with the current
unreleased manifest: `npm run release:select-gates -- --packages=W02 --included=W01`.

Dependency closure is checked recursively for every selected and explicitly
included package, including internal hardening dependencies. Missing prerequisites
fail with the dependency chain; the selector does not silently add them. W19 with
W18 alone fails at W17; W17 and W18 also require their complete earlier chain
unless those prerequisites are actually released. Selected/included packages must
be VALIDATED or RELEASED. Run common and focused gates for every package being
shipped, not merely for the primary package named in one selector invocation.

Persistent gates activate when their introducing package is RELEASED or explicitly
selected/included: W09 navigation freshness is always on; W12 lifecycle/parity
requires `--surfaces=shared-audio`; W17 payload isolation requires
`--surfaces=library-runtime`. Surfaces remain operator-reviewed against the actual
candidate diff, never inferred from filenames. Omission is not a waiver.

The navigation check is also inside the normal built-handler release gate. It
accepts Git's LF/CRLF checkout newlines, rejects stale/missing content and never
regenerates it. Only the explicit `books:navigation-index` command generates it.

## Tranche C review evidence

The W17–W24 review stack and its cumulative local validation are recorded in
[TRANCHE-C-FINAL-REVIEW.md](TRANCHE-C-FINAL-REVIEW.md). These remain draft review
packages, not production releases. The existing fresh-main, exact-SHA hosted
preview and owner-decision procedure still applies. W25–W52 remain proposed.
