# Netlify function size fix

## 1. Executive result

Ready to redeploy on Netlify.

This branch fixes the deploy-blocking `react-router-server` function upload size
risk without deleting the refreshed Cloudflare export, regenerating books, or
changing book counts.

## 2. Original Netlify error

- Stage: function upload
- Function: `react-router-server`
- Error: `The function exceeds the maximum size of 250 MB`

## 3. Root cause evidence

Classification: cloudflare-export included in server function package.

Evidence:

- `app/client/assets/books/cloudflare-export` is about 299.22 MB.
- `app/client/assets/books/generated` is about 590.78 MB.
- `public/book-previews` is about 4.72 MB.
- `app/client/assets/books/seo-summaries` is about 1.17 MB.
- Before the fix, `app/routes/morse-book-content.books.$slug.tsx` imported the
  Cloudflare export public manifest and used a static filesystem path rooted at
  `app/client/assets/books/cloudflare-export`.
- Before the fix, the production server bundle contained that static local
  export path in the `/morse-book-content/books/:slug` fallback route.
- The built React Router server bundle itself was about 4 MB, so the deploy
  failure matched Netlify function packaging/upload tracing the large local
  export directory rather than a TypeScript or Vite build failure.

## 4. Files/package paths inspected

- `app/client/assets/books/cloudflare-export`
- `app/client/assets/books/generated`
- `public/book-previews`
- `app/client/assets/books/seo-summaries`
- `app/routes/morse-book-content.books.$slug.tsx`
- `app/client/data/morseBooks.ts`
- `app/client/data/morseBookContentConfig.ts`
- `app/client/components/morse-code-books/MorseBookPage.tsx`
- `app/client/components/morse-code-books/bookTranslatorSource.ts`
- `build/server/server.js`
- `.netlify/v1/functions/react-router-server.mjs`
- `netlify.toml`
- `package.json`

## 5. Fixes made

- Production no longer serves the local `/morse-book-content/books/:slug`
  fallback unless `MORSEWORDS_ENABLE_LOCAL_BOOK_CONTENT_ROUTE=1` is explicitly
  set.
- The local fallback route now reads `public-manifest.json` dynamically only
  after the dev/explicit-enable guard, instead of importing the Cloudflare export
  manifest at module scope.
- Runtime fallback to `/morse-book-content` is now dev-only unless
  `VITE_ENABLE_LOCAL_BOOK_CONTENT_ROUTE=1` is explicitly set.
- Added `npm run books:netlify-function-size-audit`.

## 6. Function-size result

`npm run books:netlify-function-size-audit` passed.

- `.netlify/v1/functions`: 251 B, 1 file, no bulk Cloudflare export book
  payloads or generated section payloads found.
- `build/server/server.js`: 4.00 MB.
- The server bundle no longer contains the previous static filesystem path to
  `app/client/assets/books/cloudflare-export`.
- `build/client` does not contain copied Cloudflare export payloads.

Local Netlify output exposes a small shim rather than the exact zipped
production upload package. The deploy-blocking trace was removed from the server
bundle, which is the relevant local evidence available before redeploy.

## 7. Book/export invariants

- Generated books: 519
- SEO summaries: 519/519
- Startup previews: 519
- Book URLs: 519
- Audiobook URLs: 519
- Cloudflare export files: 521
- Cloudflare book payloads: 519
- Cloudflare manifest files: 2
- Cloudflare export artifacts remain committed and valid.

## 8. Validation results

- `npm run typecheck`: pass
- `npm run books:seo-summary-audit`: pass, 519/519
- `npm run books:startup-preview-audit`: pass, 519 valid
- `npm run books:section-metadata-source-audit`: pass, 0 blockers
- `npm run books:cloudflare-export`: pass, 521 files and 519 book payloads
- `npm run books:cloudflare-export-audit`: pass, 0 blockers
- `npm run books:post-export-book-route-validation`: pass locally; real remote
  Cloudflare validation still requires the served base URL
- `npm run books:independent-second-pass-audit`: pass, 0 fail-needs-fix
- `npm run books:linking-sitemap-audit`: pass, 519 book URLs and 519 audiobook
  URLs
- `npm run test --if-present`: pass, 23 smoke tests
- `npm run build:netlify`: pass
- `npm run books:netlify-function-size-audit`: pass
- Playwright Morse book page suite: pass, 39/39

## 9. Remaining risks

- Local Netlify artifact inspection does not produce the exact production zip,
  but the static path that caused packaging to include the 299 MB local export
  directory has been removed.
- Real remote Cloudflare/R2 validation is still blocked until the actual served
  base URL is available. This branch does not claim remote validation passed.

## 10. Next manual Cloudflare/R2 upload gate

Before claiming remote validation:

1. Set `VITE_MORSE_BOOK_CONTENT_BASE_URL` or
   `PUBLIC_MORSE_BOOK_CONTENT_BASE_URL` to the real served export base URL.
2. Run `npm run books:cloudflare-post-upload-validation`.
3. Confirm remote upload was sync/delete, not append-only, with stale remote
   keys removed under the book export prefix.

## 11. Later stages preserved

- Non-book sitemap/page work was not started.
- URL/indexability audit was not started.
- GSC/meta review was not started.
- Sources/About/repeated-helper-copy content work was not started.
- Broad mobile optimization was not started.
