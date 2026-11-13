# Library evidence and index-value decisions

`library-quality-inventory.json` contains one record per retained title and two page observations per record. It is an inspectable evidence inventory, not an automatic quality grade or index recommendation. The report changes no application data, sitemap, robots, redirects, rights decisions, or remote assets.

Run after building, with no concurrent build deleting its chunks:

```powershell
npm run build:netlify
npm run books:quality-report -- --ssr=all --payloads=sample --output=ai-issues/2027-release-train/evidence/library-quality-inventory.json
```

Defaults use six representative titles for SSR and live payloads. `--ssr=none|sample|all` and `--payloads=none|sample|all` are independent. `--base-url=https://...` can probe an explicitly chosen deployed preview instead of the local built handler. Verify that deployment's SHA separately; the report's checkout SHA does not certify a remote deploy. Without `--base-url`, the actual built Netlify handler is used, not the legacy server entry point. The installed Playwright Chromium runtime parses inert response HTML; it does not execute/hydrate it. No live browser metrics are claimed.

The full run covers 524 titles, 1,048 paired detail URLs and the current 1,179-URL sitemap. There are 131 other sitemap routes and no printable book details. Six live payload probes cover short/long works and chapter structures. The other 518 payloads remain **not probed**. A transient network failure is **unavailable**, not a false success. Successful SSR, a visible button, or an available payload does not prove successful browser playback/export.

## Record contract (schemaVersion 1)

| Field | Evidence and interpretation |
|---|---|
| `title`, `authors`, `language`, `source` | Current generated library metadata; missing source URLs stay null. No invented provenance. |
| `rights` | Recorded status, basis, review/publish flags and approval source. This is neither a new rights review nor worldwide legal clearance. |
| `preview` | Local starter file content, character/word amount, truncation, section ID and source hash agreement. |
| `summary` | Stored reviewed-summary availability, word amount, description and exact-text hash. Textual uniqueness does not establish editorial usefulness. |
| `sections` | Declared/observed/default-selected counts, kinds, three sample labels and missing local section files. |
| `contentAmount` | Manifest word/character counts; no minimum-count quality score. |
| `duplicates` | Normalized title, shared source URL and identical-summary candidate lists. Shared anthology sources are often intentional. |
| `payload` | Explicit observed/unavailable/not-probed state, HTTP status, byte/section/word amount, CORS and version evidence. The export envelope is compared with the live export manifest; the nested source manifest is compared with checkout source metadata. These hashes have different definitions. Declared version agreement is not a fresh content-integrity or editorial audit. |
| `pages[].ssr` | Actual raw-response title, description, canonical, robots, H1, main-text amount, task copy, workspace/fallback state, summary amount/hash, control labels and internal links. HTML scripts are removed before inspection. No hydration, autoplay, export or Core Web Vitals test is implied. |
| `pages[].functionality` | Explicitly not interaction-tested by this report; points to existing startup/parity browser suites. Results of those suites must be reported separately. |
| `distinction` | Observed book/audio title, description, task-copy and summary comparisons plus reciprocal links. Metadata differences alone do not justify two indexable pages. |
| `findings` | Named review observations, with no weighting, numeric score or automatic index action. |

The generation timestamp, checkout SHA, dirty tracked paths and probe scope are included. The committed W07 inventory observes the W06 application build: W07 adds tooling/documentation only. Future application changes require a new build and new SSR observations. This snapshot must not be silently relabelled as a later deployment.

## Review queues

- **Source repair:** 41 records have neither a source URL nor Gutenberg ID. A provider label and recorded approval are not a substitute for an inspectable edition/source link. Verify sources individually before altering claims or rights policy.
- **Shared source review:** 297 titles share a source URL with another title. Many are individual stories from the same collection; compare boundaries, titles and tasks before proposing consolidation.
- **Title variants:** `the-secret-garden` and `the-secret-garden-gutenberg-113` share a normalized title. Their current metadata distinguishes the source variant. Inspect actual editions, content, internal links, external links and search demand before any URL-level proposal.
- **Pair value:** all 524 pairs have different titles, descriptions and task copy, reciprocal links, and the same work summary. This supports a real workflow distinction but leaves a substantive shared-content footprint. User usefulness and search value still need per-title review.
- **Technical availability:** the full SSR run observed all 1,048 pages returning 200 with the expected canonical/index contract, one H1, title-specific summary and initial workspace, rather than loading-only shells. The maximum sampled-across-all initial HTML was 432,312 bytes. This does not certify browser completion or field performance.
- **Asset version review:** all six sampled payloads returned 200, allowed the production origin, and matched the live export manifest. Five nested source hashes match this checkout; `a-christmas-carol` differs. This is a concrete version-review item, not proof of broken delivery. Compare the deployed edition and content with the checkout before proposing an asset replacement; no remote asset was modified.

## Index-value framework

KEEP INDEXED requires a distinct user job, substantive working content/functionality, usefulness without search traffic, technical health and deliberate internal linking. REPAIR applies when the job is valuable but its implementation/content is weak. CONSOLIDATE REVIEW applies to materially interchangeable siblings. NOINDEX REVIEW applies when a useful user page adds little separate search value. REMOVE/REDIRECT REVIEW applies to obsolete duplicates or historical aliases. None is inferred from a numeric score.

| Family | Current decision support | Evidence needed before changing the footprint |
|---|---|---|
| Home translator | KEEP INDEXED; protect the broad two-way owner. | Real conversion success, input clarity, query ownership; no competing generic translator. |
| Encoder / text decoder | KEEP INDEXED for distinct one-direction tasks; REPAIR failures. | Actual encoding/decoding behavior and query/task demand. |
| Reader / separator | REPAIR spacing understanding; reader remains CONSOLIDATE REVIEW only if its task is interchangeable in use. | URL-level usage, user journey, internal/external links, distinct paste/read value. |
| Audio / sound / MP3 / video | KEEP INDEXED for hub, tone, export and visual-output tasks. | Real playback/export completion, shared settings, accessibility, demand by intent. |
| Audio decoder | KEEP INDEXED after onboarding repair; distinct file-to-text task. | Real-file success/failure, uncertainty, codec support, no false decoding claims. |
| Practice / typing / drills / quizzes | KEEP INDEXED for working differentiated exercises; REPAIR weak feedback. | Recall task, completion, useful next session and honest progress behavior. |
| Alphabet / numbers / punctuation / dictionary | KEEP INDEXED for practical lookup; REPAIR weak provenance or interactions. | Verified mappings, examples, copy/play, source scope and readable tables. |
| Timing / Farnsworth / prosigns / Q-codes | KEEP INDEXED for distinct timing and operating-reference jobs. | Correct timing/continuous-signal distinctions and primary-source scope. |
| Charts / worksheets / printable hubs | KEEP INDEXED for distinct chart download and exercise creation. | Actual printable output, preview/download parity and no duplicate thin wrappers. |
| Printable book details | Preserve existing `noindex,follow`, excluded from sitemap. | A separate search job would require owner review; printing remains available. |
| Languages / international text | KEEP INDEXED where adaptation/transliteration is accurate and useful; REPAIR unsupported claims. | System-specific primary sources, explicit loss/limits, actual input behavior. |
| Book and audiobook details | REPAIR source/failure evidence; per-title KEEP / CONSOLIDATE REVIEW / NOINDEX REVIEW remains an owner decision. | This inventory plus real task success, editorial usefulness, edition/rights evidence, URL-level search and external-link data. No blanket preservation or removal. |
| Library hubs / collections | KEEP INDEXED where curated discovery is useful; REPAIR weak selection guidance. | Intentional browse paths, current assets and meaningful group boundaries. |
| About / Sources / contact / policy | Keep trust/user resources available; indexing reviewed by their actual job. | Accurate maintainer/source/policy claims; no invented credentials. |
| Historical aliases / obsolete variants | Existing canonical redirects preserved; REMOVE/REDIRECT REVIEW only with evidence. | Exact source/target inventory, inbound links, query preservation and rollback map. |

Any bulk indexing proposal must include an affected URL list, the concrete evidence, internal-link analysis, external-link risk, Search Console evidence when accessible, explicit owner approval and a reversible URL-level map. GSC Wizard is currently unavailable because the account returned `payment_required`; missing data is not a reason to guess. No such mutation is authorized or performed by this report.
