# Local Artifact Gitignore Hygiene

## Executive Result

Cloudflare export artifacts are now treated as local generated upload artifacts. The export directory is ignored by git, removed from tracking, and still regenerates and audits locally.

Result: ready to redeploy on Netlify after the deploy-blocker function-size fix and this artifact hygiene cleanup.

## Branch Purpose

Branch: `morsewords-local-artifact-gitignore-hygiene-jun-2026`

Purpose: keep local/generated upload artifacts out of git, especially `app/client/assets/books/cloudflare-export`.

## Ignored Local Artifact Paths

- `/app/client/assets/books/cloudflare-export/`
- `/.netlify/`
- `/build/`
- `/dist/`
- `/coverage/`
- `.env`
- `.env.*`
- `!.env.example`

## Cloudflare Export Tracking Result

- Previously tracked: yes
- Export files untracked from git: 521
- `git ls-files app/client/assets/books/cloudflare-export` after cleanup: 0
- Local export directory preserved: yes
- Local export files: 521
- Book payloads: 519
- Manifest files: 2

## Export Workflow Result

- `npm run books:cloudflare-export`: pass
- `npm run books:cloudflare-export-audit`: pass

The local export remains available for manual Cloudflare/R2 sync/delete upload, but it is no longer a repo payload directory.

## Source-of-Truth Tracking

- Generated books remain tracked.
- SEO summaries remain tracked.
- Startup previews remain tracked.
- Raw temp-books were not modified.

## Book Invariants

- Generated books: 519
- SEO summaries: 519/519
- Startup previews: 519
- Book URLs: 519
- Audiobook URLs: 519

## Netlify Deploy Readiness

The deploy-blocker branch was merged first. The Netlify function-size fix keeps bulk book export payloads out of `react-router-server`, and this branch removes the committed local export artifacts from git tracking.

Decision: ready to redeploy on Netlify.

## Remaining Cloudflare/R2 Gate

Remote Cloudflare/R2 validation remains blocked until a real served book-content base URL is available. This branch does not claim remote validation passed and does not add credentials or secrets.

## Preserved Later Stages

- Non-book sitemap/page work was not started.
- URL/indexability audit was not started.
- GSC/meta review was not started.
- Sources/About/repeated-copy content work was not started.
- Broad mobile optimization was not started.
