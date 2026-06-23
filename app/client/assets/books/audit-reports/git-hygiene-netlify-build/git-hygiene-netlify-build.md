# Git Hygiene and Netlify Build Audit

Generated: 2026-06-23

Branch: `morsewords-git-hygiene-netlify-build-fix-jun-2026`

## Git Hygiene

`.gitignore` was updated to cover local/build/test artifacts that should not be
committed casually:

- `*.log`
- `*.tmp`
- `/dist/`
- `/.netlify/`
- `/temp/`
- `/coverage/`
- `/playwright-report/`
- `/test-results/`
- `*.trace.zip`
- `*.webm`
- `*.mp4`

Existing ignore coverage already included `/build/`, `/node_modules/`, `/tmp/`,
`.DS_Store`, `test-artifacts/`, local raw source folders, and book media/binary
scratch artifacts.

Suspicious tracked artifacts found and removed from git tracking:

- `.netlify/v1/functions/react-router-server.mjs`: generated Netlify build
  artifact.
- `tmp-dev-server.log`: local dev server log.
- `tmp-dev-server.err.log`: local dev server error log.
- `tatus`: accidental console capture.

No accidental `morse-seo-b1-*.json` or
`morse-seo-b1-word-additions.json` files were found in the repo or in `C:/tmp`.
No suspicious untracked artifact was found that needs to be committed.

## Folder Classifications

- `app/client/assets/books/audit-reports/`: intentional project reports for now.
  The `git-hygiene-netlify-build` report is intentionally added by this branch.
- `app/client/assets/temp-books/`: raw source inventory. Protected; not edited.
- `app/client/assets/books/generated/`: intentional generated app content.
  Protected; validation churn was restored and no final changes remain.
- `public/book-previews/`: intentional preview app content. Protected;
  validation churn was restored and no final changes remain.
- `app/client/assets/books/cloudflare-export/`: generated deployment/export
  artifact currently tracked. It should not receive casual commits and should
  only be modified in an explicit Cloudflare export phase. It was not modified.

## Netlify Build Fix

Root cause:

- SEO summaries were imported as a full JSON module through broad route/component
  code, which made the summary dataset reachable from client and SSR chunks.
- SSR still failed after the first split because production Vite analysis could
  see the development-only generated-book review-content import. That module
  expands `import.meta.glob` over generated manifests and sections, exhausting
  the 4096 MB heap during SSR transform.

Fix strategy:

- Keep the client summary module lightweight: types, constants, and paragraph
  splitting only.
- Load summaries in route loaders through a server-only lookup and pass only the
  current summary or compact description map to client-rendered components.
- Read the summary JSON lazily from disk in the server-only helper instead of
  importing the full JSON as bundled JavaScript.
- Include the summary JSON in Netlify functions as a data file.
- Keep generated-book review content available for development while preventing
  production SSR from statically expanding the generated section glob.

`npm run build:netlify` result: pass.

Protected folders stayed clean in the final diff: raw sources, generated books,
preview assets, and Cloudflare export were not modified.

Summary batch 6 was not started. Cloudflare export was not run.
