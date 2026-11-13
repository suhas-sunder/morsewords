# 2027 release train ledger

2027 RELEASE TRAIN BASE: `8c83c8214d515565c314ff99bc3df8af88e73121`.

Immediate recovery: production safety gate PASS; normal main push completed. Netlify deploy `6af699314552c4b5a47d0889` published this exact SHA at 2026-11-13 05:01:57 UTC. Immutable [deployment](https://6af699314552c4b5a47d0889--morsewords.netlify.app). Actual production function ZIP is 3,228,235 bytes, Node 22. Live checks passed for home/audio/practice/alphabet, book and two modified audiobook routes, print noindex, the two historical aliases, robots and 1,179-entry sitemap. Local evidence: `output/november-baseline/live-recovery.json`.

Weekly branches are cumulative and remain unmerged. See each Wxx record for its implementation SHA and validation. A committed ledger cannot literally contain its own future commit hash; the final branch heads are captured in the final review report and `git rev-parse release/2027-Wxx-...`. Implementation SHA identifies the tested change; a subsequent ledger-only commit does not alter the built product.

Run gates from a clean checkout with `npm ci`. Current local gate requires `npm run build:netlify`, then `npm run site:local-final-validation`. It uses the actual generated Netlify handler, not the legacy `server.js` production path. Use `npm run serve:netlify-build` for browser inspection of the output. For existing development book tests, first run `npm run books:cloudflare-export`: this creates ignored local payloads from committed sources and performs no remote upload. The old two-book batch validator remains available as `site:historical-final-validation`; its historical upload prerequisites are intentionally not fabricated.

`npm run test:core-product` checks the twenty named core owners in desktop and 390px mobile Chromium. Existing tests continue to own deeper playback/export/preview/ad behavior. Raw SSR and a successful build do not replace these browser tests.

Preview rules: use only deploy previews/branch previews, record exact SHA, and do not infer publication from a successful Git push. If Netlify does not create a preview for a stacked base branch, use local production-equivalent validation and state the limitation. No auto-merge or weekly production deployment is authorized.

## Completed tranche A

All eight weekly branches are pushed as stacked draft PRs #2–#9 and remain unmerged. Read [FINAL-REVIEW.md](FINAL-REVIEW.md) for the complete A–H report, exact implementation SHAs, all 52 roadmap rows, preview evidence, limits and owner decisions. W01 has an exact-SHA ready Netlify preview; W02–W08 use the documented local Netlify-equivalent fallback because no deployments/checks appeared for those stacked PRs. The final W08 documentation-only commit reconciles the ledger without changing the tested application. W09 is not started.
