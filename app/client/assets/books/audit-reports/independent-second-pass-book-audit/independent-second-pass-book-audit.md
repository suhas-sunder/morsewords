# Independent Second-Pass Book Audit

Generated: 2026-06-28T05:04:13.596Z

## Executive summary

This report independently reconstructed the generated book inventory, preview inventory, library manifest, and preview manifest from disk. It did not replay write-batch decisions and did not modify generated books, preview assets, raw sources, or Cloudflare exports.

- Generated book count: 497
- Generated manifest entries: 497
- Preview count: 497
- Preview manifest entries: 497
- Manifest consistency result: pass
- Pass: 432
- Warn-accepted: 65
- Fail-needs-fix: 0
- Manual-review: 0
- Recommended next phase: Proceed with SEO summaries while tracking non-blocking source-resolution debt

## Manifest consistency

- Filesystem, generated manifest, preview manifest, and preview files are consistent.

## Unresolved-source generated books

Count: 9

- a-princess-of-mars: A princess of Mars; preview valid; default start readable; Stay accepted pending future manual source resolution.
- doctor-dolittle: The Story of Doctor Dolittle; preview valid; default start readable; Stay accepted pending future manual source resolution.
- heidi: Heidi; preview valid; default start readable; Stay accepted pending future manual source resolution.
- jabberwocky: Jabberwocky; preview valid; default start readable; Stay accepted pending future manual source resolution.
- nights-with-uncle-remus: Nights With Uncle Remus; preview valid; default start readable; Stay accepted pending future manual source resolution.
- peter-pan: Peter Pan [Peter and Wendy]; preview valid; default start readable; Stay accepted pending future manual source resolution.
- tarzan-of-the-apes: Tarzan of the Apes; preview valid; default start readable; Stay accepted pending future manual source resolution.
- the-thirty-nine-steps: The Thirty-Nine Steps; preview valid; default start readable; Stay accepted pending future manual source resolution.
- wood-folk-at-school: Wood folk at school; preview valid; default start readable; Stay accepted pending future manual source resolution.

These books remain accepted as currently generated, but source resolution is still documented debt. They were not modified.

## Duplicate and near-duplicate findings

- duplicate-title: anne of green gables (anne-of-green-gables, anne-of-green-gables-gutenberg-45)
- duplicate-title: the count of monte cristo (the-count-of-monte-cristo, the-count-of-monte-cristo-gutenberg-1184)
- duplicate-title: the secret garden (the-secret-garden, the-secret-garden-gutenberg-113)
- near-duplicate-slug: anne-of-green-gables (anne-of-green-gables, anne-of-green-gables-gutenberg-45)
- near-duplicate-slug: the-count-of-monte-cristo (the-count-of-monte-cristo, the-count-of-monte-cristo-gutenberg-1184)
- near-duplicate-slug: the-secret-garden (the-secret-garden, the-secret-garden-gutenberg-113)

## Source, header, license, and TOC leakage findings

- No source/header/license/TOC leakage findings in generated defaults.

## Preview findings

- No preview fallback, SOS Help, missing-preview, or preview-manifest defects found.

## Metadata findings

- a-christmas-carol: Rights report status is needs_manual_review. (warn-accepted)
- a-princess-of-mars: Rights report status is needs_manual_review. (warn-accepted)
- alices-adventures-in-wonderland: Rights report status is needs_manual_review. (warn-accepted)
- anna-karenina: Rights report status is needs_manual_review. (warn-accepted)
- anne-of-green-gables-gutenberg-45: Rights report status is needs_manual_review. (warn-accepted)
- astounding-stories-of-super-science: Generated manifest uses broad or unknown author metadata. (warn-accepted)
- botchan: Rights report status is needs_manual_review. (warn-accepted)
- doctor-dolittle: Rights report status is reject. (warn-accepted)
- don-quixote: Rights report status is needs_manual_review. (warn-accepted)
- heidi: Rights report status is needs_manual_review. (warn-accepted)
- jabberwocky: Rights report status is needs_manual_review. (warn-accepted)
- jane-eyre: Rights report status is needs_manual_review. (warn-accepted)
- les-miserables: Rights report status is needs_manual_review. (warn-accepted)
- nights-with-uncle-remus: Rights report status is reject. (warn-accepted)
- peter-pan: Rights report status is needs_manual_review. (warn-accepted)
- rainbow-valley: Rights report status is needs_manual_review. (warn-accepted)
- rinkitink-in-oz: Rights report status is needs_manual_review. (warn-accepted)
- sun-tzu-on-the-art-of-war: Rights report status is needs_manual_review. (warn-accepted)
- tarzan-of-the-apes: Rights report status is needs_manual_review. (warn-accepted)
- the-arabian-nights: Generated manifest has no author metadata. (warn-accepted)
- the-art-of-war: Rights report status is needs_manual_review. (warn-accepted)
- the-bell: Rights report status is needs_manual_review. (warn-accepted)
- the-count-of-monte-cristo: Rights report status is needs_manual_review. (warn-accepted)
- the-count-of-monte-cristo-gutenberg-1184: Rights report status is needs_manual_review. (warn-accepted)
- the-elderbush: Rights report status is needs_manual_review. (warn-accepted)
- the-emperor-s-new-clothes: Rights report status is needs_manual_review. (warn-accepted)
- the-fir-tree: Rights report status is needs_manual_review. (warn-accepted)
- the-happy-family: Rights report status is reject. (warn-accepted)
- the-leap-frog: Rights report status is needs_manual_review. (warn-accepted)
- the-real-princess: Rights report status is needs_manual_review. (warn-accepted)
- the-secret-garden: Rights report status is reject. (warn-accepted)
- the-shoes-of-fortune: Rights report status is needs_manual_review. (warn-accepted)
- the-thirty-nine-steps: Rights report status is needs_manual_review. (warn-accepted)
- through-the-looking-glass: Rights report status is needs_manual_review. (warn-accepted)
- wind-in-the-willows: Rights report status is needs_manual_review. (warn-accepted)
- wood-folk-at-school: Rights report status is reject. (warn-accepted)

## Start, end, and default-section findings

- a-christmas-carol: Earlier readable-looking generated section(s) precede the startup/default section: part-001. (warn-accepted)
- anne-of-avonlea: Earlier readable-looking generated section(s) precede the startup/default section: dedication-001. (warn-accepted)
- anne-of-green-gables-gutenberg-45: Earlier readable-looking generated section(s) precede the startup/default section: title-page-001. (warn-accepted)
- doctor-dolittle: Earlier readable-looking generated section(s) precede the startup/default section: part-001. (warn-accepted)
- don-quixote: Earlier readable-looking generated section(s) precede the startup/default section: introduction-001. (warn-accepted)
- dr-jekyll-and-mr-hyde: Earlier readable-looking generated section(s) precede the startup/default section: part-001. (warn-accepted)
- five-weeks-in-a-balloon: Earlier readable-looking generated section(s) precede the startup/default section: preface-001. (warn-accepted)
- four-day-planet: Earlier readable-looking generated section(s) precede the startup/default section: title-page-001. (warn-accepted)
- heidi: Empty or malformed section(s): part-011. (warn-accepted)
- jane-eyre: Earlier readable-looking generated section(s) precede the startup/default section: title-page-001, preface-001. (warn-accepted)
- les-miserables: Earlier readable-looking generated section(s) precede the startup/default section: preface-001. (warn-accepted)
- macbeth: Earlier readable-looking generated section(s) precede the startup/default section: title-page-001. (warn-accepted)
- moby-dick: Earlier readable-looking generated section(s) precede the startup/default section: title-page-001. (warn-accepted)
- peter-pan: Earlier readable-looking generated section(s) precede the startup/default section: title-page-001. (warn-accepted)
- pointed-roofs: Earlier readable-looking generated section(s) precede the startup/default section: title-page-001. (warn-accepted)
- pygmalion: Earlier readable-looking generated section(s) precede the startup/default section: title-page-001. (warn-accepted)
- rainbow-valley: Earlier readable-looking generated section(s) precede the startup/default section: title-page-001. (warn-accepted)
- rinkitink-in-oz: Earlier readable-looking generated section(s) precede the startup/default section: title-page-001. (warn-accepted)
- sun-tzu-on-the-art-of-war: Earlier readable-looking generated section(s) precede the startup/default section: preface-001, introduction-001. (warn-accepted)
- the-adventures-of-tom-sawyer: Earlier readable-looking generated section(s) precede the startup/default section: title-page-001. (warn-accepted)
- the-art-of-war: Earlier readable-looking generated section(s) precede the startup/default section: title-page-001, introduction-002. (warn-accepted)
- the-great-gatsby: Earlier readable-looking generated section(s) precede the startup/default section: part-001. (warn-accepted)
- the-hound-of-the-baskervilles: Earlier readable-looking generated section(s) precede the startup/default section: title-page-001. (warn-accepted)
- the-king-in-yellow: Earlier readable-looking generated section(s) precede the startup/default section: title-page-001. (warn-accepted)
- the-lost-world: Earlier readable-looking generated section(s) precede the startup/default section: title-page-001. (warn-accepted)
- the-railway-children: Earlier readable-looking generated section(s) precede the startup/default section: title-page-001. (warn-accepted)
- the-red-thumb-mark: Earlier readable-looking generated section(s) precede the startup/default section: title-page-001. (warn-accepted)
- the-sea-wolf: Earlier readable-looking generated section(s) precede the startup/default section: title-page-001. (warn-accepted)
- the-secret-garden-gutenberg-113: Earlier readable-looking generated section(s) precede the startup/default section: title-page-001. (warn-accepted)
- the-tempest: Earlier readable-looking generated section(s) precede the startup/default section: title-page-001. (warn-accepted)
- the-three-musketeers: Earlier readable-looking generated section(s) precede the startup/default section: title-page-001. (warn-accepted)
- through-the-looking-glass: Earlier readable-looking generated section(s) precede the startup/default section: title-page-001. (warn-accepted)
- violet-fairy-book: Earlier readable-looking generated section(s) precede the startup/default section: preface-001. (warn-accepted)
- with-fire-and-sword: Earlier readable-looking generated section(s) precede the startup/default section: introduction-001. (warn-accepted)

## Raw-vs-generated comparison summary

- exact/sampled-pass: 451
- sampled-warn: 8
- unavailable: 38
- not attempted: 0

- astounding-stories-of-super-science: Raw source sample check found start=no, end=yes.
- pride-and-prejudice: Raw source sample check found start=yes, end=no.
- the-brothers-karamazov: Raw source sample check found start=yes, end=no.
- the-federalist-papers: Raw source sample check found start=yes, end=no.
- the-jogi-s-punishment: Raw source sample check found start=no, end=yes.
- the-king-in-yellow: Raw source sample check found start=no, end=yes.
- the-scarlet-letter: Raw source sample check found start=no, end=yes.
- the-tempest: Raw source sample check found start=no, end=yes.

## Batch-12 restoration summary

- Compared: 20
- Remaining raw/generated mismatches: 0
- Status: 20/20 pass; no remaining raw/generated mismatches

## Recent batch 21-23 summary

- Requested slugs: 50
- Found: 50
- Missing: none
- Statuses: {"pass":50,"warn-accepted":0,"fail-needs-fix":0,"manual-review":0}

## Lovecraft titles

- Count: 42
- Statuses: {"pass":42,"warn-accepted":0,"fail-needs-fix":0,"manual-review":0}
- Author metadata warnings: none

## Wells titles

- Count: 54
- Statuses: {"pass":54,"warn-accepted":0,"fail-needs-fix":0,"manual-review":0}
- Author metadata warnings: none

## Known duplicate/boundary raw skips

- the-wind-in-the-willows: exact generated slug absent; Exact raw skip slug absent; documented generated canonical slug wind-in-the-willows exists.
- the-two-magics-the-turn-of-the-screw-covering-end: exact generated slug absent; Exact skip slug is not generated as a separate unintended book.
- japanese-fairy-tales: exact generated slug absent; Exact skip slug is not generated as a separate unintended book.
- the-works-of-edgar-allan-poe: exact generated slug absent; Exact skip slug is not generated as a separate unintended book.
- snow-white-and-rose-red: exact generated slug absent; Exact skip slug is not generated as a separate unintended book.

## Known remaining raw inventory state

- Raw files inspected in triage: 507
- Zero safe deterministic candidates remain: true
- Skipped unsafe raw-only candidates: 46
- Unresolved-source generated books: 11
- Duplicate/near-duplicate raw skips: 3
- Boundary-defect raw skips: 2
- Triage recommendation: Stop book ingestion and move to second-pass audit

## Recommended next phase

Proceed with SEO summaries while tracking non-blocking source-resolution debt

## Later-phase requirements restated only

- Original non-spoiler 300-500+ word SEO summaries after second-pass audit.
- Full site SEO/meta review using GSC data and route intent after summaries.
- Focused rage-click UX pass for /audio, /practice, homepage, and related utility pages after books/SEO.
- SSR heap OOM investigation separately.
- In-app Browser sandbox issue investigation separately.
- Intermittent fullscreen Playwright/UI behavior investigation separately.
- Final cleanup only after the system is stable.

## Protected path confirmation

Report-only audit. No generated books, previews, raw sources, or Cloudflare exports were modified by this script.
