# Cloudflare Upload Post-Export Validation

## 1. Executive Result

**Cloudflare upload not run; manual upload required.**

The refreshed local Cloudflare export is ready, but this repo does not currently
provide a safe upload command that performs sync/delete for
`app/client/assets/books/cloudflare-export`. There is no local `wrangler` config
or package upload script, and no remote book-content base URL is configured in
the environment.

## 2. Upload Command/Path Used, Or Why Upload Was Not Run

No upload command was run.

Reason: the repository has owner-managed manual upload guidance in
`docs/morse-books-cloudflare-upload.md`, but no safe repo command for uploading
the export directory with stale-key deletion. An append-only upload would be
unsafe because stale removed, deferred, or source-risk payloads could remain
live.

## 3. Local Export Counts

- Generated books: 519
- SEO summaries: 519
- Startup previews: 519
- Book URLs: 519
- Audiobook URLs: 519
- Local export files: 521
- Book payloads: 519
- Manifest files: 2
- Export location: `app/client/assets/books/cloudflare-export`

## 4. Remote Upload/Sync Result

Not run.

Bucket and prefix are not configured in this repo. The runtime expects the
public base URL to serve:

- `<CLOUDFLARE_BOOKS_BASE_URL>/public-manifest.json`
- `<CLOUDFLARE_BOOKS_BASE_URL>/books/<slug>.json`

## 5. Stale Remote Key Cleanup Result

Not run.

The upload must be sync/delete or equivalent cleanup, not append-only. Remote
keys under the book export prefix that are not present in the 521-file local
export must be deleted.

## 6. Remote Manifest Validation

Blocked until the export is uploaded and a served base URL is configured.

A remote validator was added:

```bash
npm run books:cloudflare-post-upload-validation
```

It requires `VITE_MORSE_BOOK_CONTENT_BASE_URL` or
`PUBLIC_MORSE_BOOK_CONTENT_BASE_URL`.

## 7. Remote Payload Validation

Blocked until upload.

Representative remote payloads to validate after upload:

- `middlemarch`
- `the-bottle-imp`
- `the-masque-of-the-red-death`
- `the-happy-prince`
- `the-leavenworth-case`
- `walden`

## 8. Generated/Local Export/Remote Comparison

Local generated-vs-export comparison passed with
`npm run books:cloudflare-export-audit`.

Remote comparison is blocked until manual upload and base URL configuration.

## 9. Removed/Deferred/Blocked Slug Exclusion Result

Local export: pass.

Remote result: blocked until upload. After upload, no blocked, deferred,
removed, or source-risk slug may remain live remotely.

## 10. Metadata/Source Result

Local export: pass.

Remote result: blocked until upload.

## 11. Section/Content Result

Local export: pass.

Remote result: blocked until upload.

## 12. Bad-Label Scan Result

Local export: pass.

Remote result: blocked until upload.

Blocked public labels remain:

- `Unknown author`
- `Unknown source`
- `Source unavailable`
- `Metadata unavailable`
- `0 sections`
- `Sections: 0`

## 13. Word-Count Result

Local export: pass.

Remote result: blocked until upload.

## 14. Post-Export Route/Chapter/Nav/View-Window Validation

Blocked until the refreshed export is uploaded and served, or until a
production-like Cloudflare base URL is configured.

Required after upload:

- all 519 intended live book routes are reachable where expected
- `/morse-code-books` count is 519
- `/morse-code-audiobooks` count is 519
- no live book route 404s
- removed/deferred/blocked source-risk slugs remain absent or 404
- starter preview renders immediately before full payload hydration
- full Cloudflare payload hydrates when requested
- reader view uses final full payload content, not stale starter preview content
- chapter/section picker reflects final exported sections
- selected section changes update cleaned preview and Morse preview
- view-window controls reflect the selected section/content
- audiobook route behavior is consistent with final exported payload availability

## 15. Remaining Risks Or Manual Steps

Manual upload steps:

1. Run `npm run books:cloudflare-export && npm run books:cloudflare-export-audit`.
2. Upload/sync `app/client/assets/books/cloudflare-export`.
3. Preserve relative paths exactly.
4. Overwrite matching remote keys.
5. Delete stale remote keys under the book export prefix.
6. Configure `VITE_MORSE_BOOK_CONTENT_BASE_URL` or
   `PUBLIC_MORSE_BOOK_CONTENT_BASE_URL` to the public base URL.
7. Run `npm run books:cloudflare-post-upload-validation`.
8. Run the deferred route/chapter/nav/view-window checks against the served
   export path.

## 16. Later Content-Quality Checkpoints

- Sources page trust-copy update
- About page E-E-A-T sentence
- Repeated helper-copy reduction

## 17. Deferred Final Stages

- non-book sitemap pages
- URL/indexability audit
- GSC/meta review
- broad mobile optimization
