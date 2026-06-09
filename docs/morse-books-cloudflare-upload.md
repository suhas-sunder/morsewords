# Morse Book Cloudflare Upload Readiness

This repo keeps the public Morse book runtime ready for owner-managed
Cloudflare-style hosting without deploying or uploading from the build scripts.

## What is tracked

The generated book JSON under `app/client/assets/books/` is intentionally
tracked right now. It is needed for:

- local fallback when no Cloudflare base URL is configured
- local development and Playwright tests
- fresh-clone `npm run build` after `npm install`
- the approved public summary manifest used by book, audiobook, and print pages

Do not ignore or remove the tracked JSON/metadata under these paths unless the
runtime is refactored to no longer need local fallback data:

- `app/client/assets/books/generated/`
- `app/client/assets/books/cloudflare-export/`

## What is ignored

These folders and raw files are local reference inputs only and should not be
committed:

- `app/client/assets/temp-books/`
- `app/client/assets/asdf/`
- `app/client/assets/text/*.txt`

The `.gitignore` also blocks generated media and PDF/ZIP files under
`app/client/assets/books/`. Book audio, video, and PDF exports are user
downloads, not repository assets.

## Build behavior

A fresh clone can run:

```bash
npm install
npm run build
```

The committed generated manifests and Cloudflare export JSON provide local
fallback data for the public book pages.

Run `npm run books:build` only when intentionally regenerating the book corpus
from the owner-managed raw references. That command expects the local
`app/client/assets/temp-books/` reference folder to exist and contain the source
`.txt` files. The folder is ignored, so it is not provided by a fresh clone.

## Owner Upload Folder

Upload from:

```text
app/client/assets/books/cloudflare-export/
```

Preserve the relative object paths exactly.

Upload these files:

- `public-manifest.json`
- `upload-manifest.json`
- every `books/*.json` file

For the current 74-book export, that means 76 files total:

- 1 public manifest
- 1 upload manifest
- 74 whole-book JSON files

Do not upload:

- `app/client/assets/temp-books/`
- `app/client/assets/asdf/`
- `app/client/assets/text/*.txt`
- `app/client/assets/books/generated/review/`
- generated MP3/WAV/WebM/MP4/PDF/ZIP files

## Runtime Base URL

Configure one of these environment variables when the exported files are hosted:

- `VITE_MORSE_BOOK_CONTENT_BASE_URL`
- `PUBLIC_MORSE_BOOK_CONTENT_BASE_URL`

Use the public base URL that contains `public-manifest.json` and the `books/`
folder. A trailing slash is fine; the runtime normalizes it.

Expected URLs:

```text
<CLOUDFLARE_BOOKS_BASE_URL>/public-manifest.json
<CLOUDFLARE_BOOKS_BASE_URL>/books/<slug>.json
```

No final Cloudflare domain is hardcoded in the app. If no base URL is
configured, the app uses the committed local fallback JSON through the local
book-content route.
