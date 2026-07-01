# Production Deploy Staleness Diagnosis

Generated: 2026-07-01T18:38:17.808Z

## 1. Executive result

Production deploy staleness diagnosis blocked because production sitemap has 1651 URLs and 488 print URLs; expected 1682 URLs and 519 print URLs

## 2. Local main/HEAD result

- Current branch: morsewords-production-deploy-staleness-diagnosis-jun-2026
- Local HEAD: 91d26bcccca43d1e0fbbe5c5bb318355d68e704e
- Local HEAD matches origin/main: pass
- Local HEAD contains expected main 91d26bcccca43d1e0fbbe5c5bb318355d68e704e: pass
- Print-route lightweight SSR fix: pass
- Sitemap 1,682 correction: pass
- support@morsewords.com readiness changes: pass

## 3. Origin main result

- origin/main HEAD: 91d26bcccca43d1e0fbbe5c5bb318355d68e704e
- Expected main HEAD for this diagnosis: 91d26bcccca43d1e0fbbe5c5bb318355d68e704e

## 4. Expected latest-main production behavior

- Sitemap URL count: 1682
- Book URL count: 519
- Audiobook URL count: 519
- Print URL count: 519
- Sampled print routes return HTTP 200 and show suitability notes.
- /contact and /sources expose support@morsewords.com plus source concern paths.

## 5. Current live production behavior

- Home: HTTP 200
- /contact: HTTP 200; support email pass
- /sources: HTTP 200; support/correction/takedown/report concern path pass

## 6. Sitemap freshness result

- Local sitemap: 1682 total, 519 print, 519 book, 519 audiobook, 125 non-book
- Live sitemap: 1651 total, 488 print, 519 book, 519 audiobook, 125 non-book
- Live sitemap latest: fail

## 7. Print-route freshness result

- /morse-code-books/walden/print: HTTP 500; suitability note missing; no unavailable copy
- /morse-code-books/the-call-of-cthulhu/print: HTTP 500; suitability note missing; no unavailable copy
- /morse-code-books/the-adventures-of-roderick-random/print: HTTP 500; suitability note missing; no unavailable copy

## 8. Contact/policy freshness result

- Contact support email: pass
- Contact mailto: pass
- Sources support email: pass
- Sources correction path: pass
- Sources takedown path: pass
- Sources report/concern path: pass

## 9. Netlify/config inspection result

- Netlify build command: npm run build:netlify
- Netlify publish directory: build/client
- public/sitemap.xml exists locally: pass
- build/client sitemap snapshot, if present: 1682 total, 519 print, 519 book, 519 audiobook, 125 non-book
- React Router Netlify function present: pass
- React Router Netlify function preferStatic: pass
- GitHub workflow files found locally: 0
- Production branch is not declared in netlify.toml; verify it in the Netlify dashboard.

## 10. Netlify CLI/dashboard availability

- Netlify CLI available: fail
- Netlify CLI detail: netlify is not available
- Dashboard verification required: pass

## 11. Exact likely cause

Production is still serving deploy behavior older than origin/main 91d26bcccca43d1e0fbbe5c5bb318355d68e704e. Local code and public/sitemap.xml contain the expected fixes. Netlify CLI is unavailable locally, so the Netlify dashboard must be used to confirm whether a production deploy from origin/main has completed.

## 12. Fixes made, if any

- Added deploy staleness diagnosis automation and report.
- No app code, sitemap policy, book content, generated book payload, public preview, or Cloudflare export change was made.

## 13. Remaining blockers

- production sitemap has 1651 URLs and 488 print URLs; expected 1682 URLs and 519 print URLs
- /morse-code-books/walden/print returns HTTP 500
- /morse-code-books/the-call-of-cthulhu/print returns HTTP 500
- /morse-code-books/the-adventures-of-roderick-random/print returns HTTP 500

## 14. Required owner action

Trigger or wait for a Netlify production deploy from origin/main at 91d26bcccca43d1e0fbbe5c5bb318355d68e704e or newer, then rerun npm run site:final-production-sanity-check from the final production sanity branch.

## 15. Recommended next step

Verify the latest Netlify production deploy in the dashboard, then rerun the final production sanity check branch after production serves latest main behavior.

## Live HTTP headers useful for deploy/cache identification

### Home

- age: 0
- cache-control: no-cache
- cf-cache-status: DYNAMIC
- date: Wed, 01 Jul 2026 18:38:21 GMT
- server: cloudflare
- x-nf-request-id: 01KWFFK5BAEZ428A08WVPZGQRA

### Sitemap

- age: 4106
- cache-control: public,max-age=0,must-revalidate
- cf-cache-status: DYNAMIC
- date: Wed, 01 Jul 2026 18:38:21 GMT
- etag: "66579809185d8c0bbd174defa97c3712-ssl-df"
- server: cloudflare
- x-nf-request-id: 01KWFFK5BPPJT569807120PXQ8

### First sampled print route

- age: 0
- cache-control: no-cache
- cf-cache-status: DYNAMIC
- date: Wed, 01 Jul 2026 18:38:21 GMT
- server: cloudflare
- x-nf-request-id: 01KWFFK5B7KASCSAV40VBP4K1Q
