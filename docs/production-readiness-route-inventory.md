# MorseWords Production Readiness Route Inventory

Date: 2026-05-09

## Architecture Decision

MorseWords is configured as a static-first React Router SPA for Netlify:

- `react-router.config.ts` sets `ssr: false`.
- Netlify publishes `build/client`.
- `public/_redirects` and `netlify.toml` provide static redirects and SPA fallback.
- Route-specific server-rendered HTML is limited in this architecture. Route meta, canonical links, JSON-LD, and page content remain defined in code, but the deployed static entry is the SPA document.
- No Express server, custom `server.js`, account API, submissions API, R2 runtime fetch, S3 helper, JWT auth, or admin/editor backend remains.
- `@react-router/node` and `isbot` remain only because React Router build tooling requires them to resolve the default SPA build entry. They are not used by a custom server runtime.

## Restored Blog/Lore Source

The current `morsewords` git history did not contain an exact `last-best-version`
branch. The sibling repository `D:\PROJECTS-and-WORK\work-projects\all_projects\WordSkull`
does contain `last-best-version`, and its blog/lore archive was selectively restored.

Restored source paths:

- `app/routes/blog._index.tsx` -> `app/routes/blog.tsx`
- `app/routes/blog.wordskull-vs-absurdle-outwitting-the-adversarial-puzzle.tsx`
- `app/routes/blog.wordskull-vs-nyt-connections.tsx`
- `app/routes/blog.wordskull-vs-nyt-spelling-bee.tsx`
- `app/routes/blog.wordskull-vs-quordle-multi-grid-madness.tsx`
- `app/routes/blog.wordskull-vs-wordle-fantasy-twist.tsx`
- `app/routes/lore._index.tsx` -> `app/routes/lore.tsx`
- `app/routes/lore.wordskull-chapter-1-the-wizards-rise-who-was-atriocsoul.tsx`
- `app/client/components/navigation/BlogSidebar.tsx`
- `app/client/components/navigation/LoreSidebar.tsx`

Adaptations made after restore:

- Converted Remix imports to current React Router imports.
- Repaired canonical domains to `https://morsewords.com`.
- Repaired old internal WordSkull game and word-list links so they point to live MorseWords routes.
- Removed random sidebar ordering to avoid hydration-visible randomness.
- Restyled restored routes through current MorseWords warm/static surfaces and sky/slate text rules.

## Typo Route Decision

`/morse-code-vidual-quiz` is preserved as a public legacy typo URL. It is not an
indexable duplicate page:

- Netlify redirects it to `/morse-code-visual-quiz` with `301`.
- The React route remains registered for local/dev fallback and client-navigates to `/morse-code-visual-quiz`.
- The route exposes `noindex,follow` and a canonical link to `/morse-code-visual-quiz`.

## Route Inventory

All current public routes are registered in `app/routes.ts`. Redirect routes are
also covered by `public/_redirects` and `netlify.toml`.

Core and tools:

- `/`
- `/audio`
- `/practice`
- `/typing`
- `/how-to-use`
- `/dictionary`
- `/about`
- `/morse-code-encoder`
- `/morse-code-decoder`
- `/the-quick-brown-fox-morse-code`
- `/morse-code-word-separator`
- `/morse-code-words`
- `/morse-code-alphabet`
- `/morse-code-printable-chart`
- `/morse-code-international-translator`
- `/morse-code-sos`
- `/morse-code-sentence-practice`
- `/learn-morse-code`
- `/morse-code-timing`
- `/farnsworth-timing`
- `/morse-code-word-trainer`
- `/sources`
- `/morse-code-prosigns`
- `/morse-code-q-codes`
- `/morse-code-punctuation`
- `/morse-code-practice-plan`
- `/international-morse-code-reference`
- `/morse-code-audio-practice`
- `/morse-code-word-search-builder`
- `/morse-code-visual-practice`
- `/morse-code-audio-quiz`
- `/morse-code-visual-quiz`
- `/morse-code-sound-generator`
- `/sitemap` (`noindex,follow`)

Redirect and legacy routes:

- `/morse-code-translator` -> `/`
- `/morse-code-audio-generator` -> `/audio`
- `/morse-code-vidual-quiz` -> `/morse-code-visual-quiz`

Legal/misc:

- `/misc`
- `/misc/cookies-policy`
- `/misc/privacy-policy`
- `/misc/socials`
- `/misc/terms-of-service`

Restored archive routes:

- `/blog`
- `/blog/wordskull-vs-absurdle-outwitting-the-adversarial-puzzle`
- `/blog/wordskull-vs-nyt-connections`
- `/blog/wordskull-vs-nyt-spelling-bee`
- `/blog/wordskull-vs-quordle-multi-grid-madness`
- `/blog/wordskull-vs-wordle-fantasy-twist`
- `/lore`
- `/lore/wordskull-chapter-1-the-wizards-rise-who-was-atriocsoul`

404 handling:

- Unknown paths use the root `ErrorBoundary` through the SPA fallback.

## Verification Checklist

Run before release:

- `npm ci` when dependency state needs a clean install.
- `npm run build`
- `npm run typecheck`
- `npm run lint`
- `npm run test --if-present`
- Manual smoke of `/`, Play, `/blog`, one blog detail, `/lore`, one lore detail, `/morse-code-words`, a 404 URL, and a repeat visit with localStorage/cache.
