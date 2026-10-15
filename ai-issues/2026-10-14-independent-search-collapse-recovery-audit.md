# MorseWords — Independent Search Collapse Forensics and Recovery Backlog

**Date:** October 14, 2026
**Site:** https://www.morsewords.com
**Repository:** https://github.com/suhas-sunder/morsewords
**Code-tree baseline:** 40b83a2969a54d3c10c7748a259b104ccd1674cc
**Status:** RESEARCH AND RELEASE PLANNING ONLY. No production implementation, SEO directive, sitemap, existing issue, or content changed.

## Owner directive: AdSense placeholder overlap prevention (all ad-supported sites)

**PRODUCTION-SAFETY REQUIREMENT — overrides cosmetic ad-placeholder proposals in this report.** The owner previously observed a serious production failure: loading/empty-ad placeholders visibly **overlaid actual rendered advertisements**, despite agent reports claiming the UI was fixed. Such overlap creates material advertising-account/policy risk. The owner's deliberate protective behavior is to **hide all placeholders once the first real advertisement renders**, accepting somewhat less polished empty-space UX in exchange for a safer production state. This policy applies across the owner's ad-supported sites, not just this repository.

- **Preserve the existing global first-ad-render → hide-placeholders safety behavior** wherever placeholders exist. Do **not** reintroduce per-slot placeholders, placeholder overlays, independently reappearing fallbacks, or “fix” empty ad gaps by undoing the global suppression. Do not change ad fill detection, race handling, hydration transitions, or sitewide hiding as an incidental styling/SEO improvement.
- Any ad layout/spacing adjustment is **investigation-only** unless it can demonstrably retain this invariant. Never overlay placeholders on creatives, permit ads to be confused with primary actions, cover a rendered ad with an element, or allow layout collapse/re-expansion to shift active creatives into controls. A genuinely absent/disabled ad may have unused wrapper spacing investigated, but speculative changes to temporarily empty or slow-loading ad slots are prohibited.
- **Approval gate:** request an explicit owner decision before modifying placeholder display policy. To propose an alternative, first obtain real production-equivalent proof across ads blocked, pending, unfilled, first fill, multiple fills, delayed fills, navigation, resize, mobile/desktop, and site theme states; include screenshots/video/DOM stacking checks, actual ad-network behavior, and a rollback. Passing local mocks or an agent PASS report alone is **not** enough. Never represent any unverified implementation as guaranteed AdSense-compliant.
- In release plans, prioritize **ad-account safety over minor whitespace/cosmetic gains**. This requirement does not prevent unrelated SEO/content/tool work; avoid touching the ad lifecycle for those tasks.

## Executive diagnosis

MorseWords is already a substantive product: two-way Morse translation, standalone encoding/decoding, reading, hearing and exporting Morse audio, MP3/video, audio decoding, charts, technical standards and other alphabets, flash/visual practice, quizzes, typing, teaching aids, printables, books and Morse audiobooks. This audit is about a search-visibility collapse rather than proposing routine aesthetic changes, generic generated content, or a second copy of existing features.

### Date-specific search loss

Earlier owner-supplied Google Search Console analysis placed the abrupt sitewide fall around **July 6–7, 2026**: from approximately **15,000–22,000 impressions per day** to **284 impressions on July 7**. One previous 28-day comparison reported 316,745 impressions versus 4,625 (roughly -98.5%) and average position 7.74 versus 26.77. **These are historical observations from prior work, not freshly queried October 2026 figures.** Source/raw periods should be recovered and independently reconciled in the first milestone.

Official Google Search Status Dashboard history does not show a core or spam update **starting** July 6–7. A May 2026 core update and June 2026 spam update are not evidence of a July 6 launch. The owner’s hypothesis of a content/update-related fall is plausible, but it must compete with deploy/indexing/HTTP events, Google-selected canonical changes, large URL expansion, delayed algorithmic reassessment, and SERP market shifts. Do NOT label the site hit with a verified “helpful content penalty” or promise recovery from an algorithm update.

Important later distinction: another earlier site-specific comparison dated September 9 found clicks falling from 436 to 246, with 190 lost clicks concentrated on /audio (393 to 203). Example prior queries: “morse code sound generator” 150 to 51 clicks (average position about 2.4 to 3.0) and “morse code audio generator” 35 to 5 clicks (about 2.86 to 8.2). This narrower second downturn is not automatically the same cause as the July sitewide cliff. Both sets must be date-reconciled before decisions.

### Confirmed sitemap expansion preceding collapse

| Source checkpoint | Total declared XML URLs | Book details | Audiobook details | Book print details | Other |
| --- | ---: | ---: | ---: | ---: | ---: |
| May 14 internal SEO audit | 113 indexable | — | — | — | 113 |
| July 2 Git snapshot 8e2d0cd8f | 1,682 | 519 | 519 | 519 | 125 |
| July 5 Git snapshot 28e25127a | 1,686 | 519 | 519 | 519 | 129 |
| July 7 Git snapshot 92c09c383 | 1,707 | 526 | 526 | 526 | 129 |
| Current main, October 14 | 1,179 | 524 | 524 | **0** | 131 |

Counts were parsed directly from XML loc entries in the named repository revisions. The May figure is the earlier documented crawl/inventory audit, not the same exact source build. On current main, all 1,179 sitemap locations are distinct; 1,048 of them (about 88.9%) are paired book/audiobook details. **A sitemap URL is not proof of an indexed page.** Later source changes removed print details from the sitemap and marked existing print routes noindex,follow; that work is already done. Do not propose removing those print locations again.

The hundreds of new book URLs were present *before* the July collapse. They have genuine literary text conversion, source/rights checks, playback, original editorial summaries, and print/audio utility, so mere numerical growth does not prove scaled-content abuse or an algorithmic demotion. However, Google may select only a subset for indexing if the pages do not convey sufficiently distinct human-visible or server-rendered value, particularly with paired variants. The investigation must measure, not assume, that risk.

### Evidence boundaries

- The connected GSC Wizard currently reports an expired trial/no active subscription; fresh Search Console click, impression, indexing, manual-action and Google-selected canonical data were **not available** in this pass. Account page: https://tool.gscwizard.com/settings/subscription .
- A June 2026 internal analytics-engagement audit is valid historical evidence, not the present audience.
- Several publicly retrieved, crawler-readable book/audiobook snapshots show **“Loading book text…”** and related loading copy. They may be stale or differ from Google’s JavaScript-rendered index. They are a valid **reproduction target**, not proof Google only indexed spinners.
- The repository already contains extensive SEO, rights, payload, quality and browser audits. Reproduce old issues before reopening them.
- Current public/robots.txt explicitly allows Googlebot and Bingbot and lists https://www.morsewords.com/sitemap.xml. Blocks on third-party SEO bots do **not** explain Google exclusion. Current sitemap has no duplicate loc entries.
- The intended brand and visual baseline are the polished homepage and /audio, as the repository AGENTS.md specifies.

## P0 — Root-cause forensics before any rewrite

### MW-R01. Reconstruct daily Google Search Console loss and page/query cohorts
**Priority P0; read only; must precede speculative changes.**

Export daily Search Console data June 1–July 31, plus monthly/daily follow-through to October: Web, query+page **joined**, country, device, clicks, impressions, CTR, position. Group generic translator/encoder/decoder, sound/audio/MP3, learning/chart, symbol/phrase, and book/audiobook. Isolate the top 30 previously successful queries and top 30 entrypoint pages; compare their day-before/day-after positions and impressions, not only clicks. Segment US, CA, UK, AU separately (priority advertising countries), but also check whether one geographic segment alone collapsed. Compare Bing and analytics engagement to distinguish Google-only ranking/indexing from general site availability.

**Deliverable:** dated graphs and export references, one ranked table of primary lost queries/pages, core vs books shares before/after, and explicit certainty level for whether core search lost rankings, pages disappeared from the index, or search behavior moved elsewhere. Reconcile historical 98.5% loss against raw date ranges and later /audio loss separately.

### MW-R02. Production deployment and HTTP-event timeline, July 1–12
**Priority P0; read-only forensic, not confirmed outage.**

Collect actual DigitalOcean/Caddy/hosted deployment timestamps and Git SHAs, DNS and TLS errors, upstream 500/502/503, redirects, stale release branches, CDN/cache changes, content security, request logs, and Googlebot status classes. Compare before/during/after July 6–7. Prior work referred to a brief HTTP 500 incident but does not prove it coincided with the drop; recover its actual date and duration.

Git history includes July 1–3 sitemap/production-sanity and alias changes; July 4–7 guide/nav, social, homepage/book and playback changes. The **first July 7 AdSense placement source commit, 8dc02c412 at 15:20 UTC**, is not proof that advertising was deployed before the July 6–7 decline. Subsequent July 8–10 ad lifecycle corrections are also temporally distinct. Deployment timestamps and observed page availability outrank commit timestamps.

**Deliverable:** chronological table (UTC date, deployed SHA, user-visible change, HTTP status, Googlebot errors, GSC impressions, confidence). If an actionable outage or directive appears, fix that exact issue first; no blind multi-week rollback.

### MW-R03. Google index status, manual actions and selected canonicals
**Priority P0; owner-controlled Search Console read.**

Check Manual Actions, Security Issues, Page Indexing groups (Indexed, Crawled currently not indexed, Discovered currently not indexed, Duplicate/Google chose different canonical, noindex, 404, soft 404, server errors, redirect), sitemap history, URL Inspection of both indexed and live version, and dates of last Google crawl. Sample /, /audio, /morse-code-encoder, /morse-code-decoder, /morse-code-chart, /morse-code-alphabet, an alphabet leaf, a phrase leaf, several paired books/audiobooks, and an old print page. Check both www and relevant domain properties, and compare Google-selected canonical vs declared.

**Deliverable:** page-level evidence, with no claim of manual penalty unless explicitly present. “site:” query counts, keyword rank tools and sitemap count cannot replace this.

### MW-R04. Initial server HTML and book/audiobook starter preview
**Priority P0 investigation; bug not established current; fix underlying SSR path only if reproduced.**

Public text snapshots of book and audiobook pages (including Pride and Prejudice, The Silver Key, and Anne of Green Gables) have exposed a title then “Loading this Morse audiobook…”, “Fetching book data”, “Loading book text…”, followed by much repeated global navigation. If modern rendered first content remains a loading shell for many title pages, their search-visible text may be undifferentiated despite good JavaScript functionality.

**Critical nonduplication:** This was already addressed in a **June 28 starter-preview fix**, documented at app/client/assets/books/audit-reports/book-starter-preview-first-render/book-starter-preview-first-render.md. The current book and audiobook route loaders DO call local /book-previews/<slug>.preview.json and supply initial preview data; app/client/data/morseBookPreviews.ts catches failed preview fetches and returns null. Do not have an agent “add server preload” again.

Instead, determine if the fixed SHA was deployed, whether same-origin server fetch/proxy, preview-asset 404/CORS, JSON validation, network timeouts, full R2 hydration replacement, React streaming or old search snapshots explain the symptom. Compare (a) raw HTTP HTML with JS disabled, (b) after hydration, (c) Google Search Console rendered HTML/screenshot, and (d) network status at exact slugs. Check a dozen titles with different lengths and sources. Test Cloudflare full payload absent/slow and local preview absent/malformed independently.

**Acceptance:** every approved URL shows genuinely title-specific starter summary/source, real preview or listen-specific task and usable navigation in initial served HTML or documented Google-renderable content. Do not conceal filler from users, add bot-only cloaking, or replace the content with fake “SEO body”. Preserve June 28 fix and real payload fallback.

### MW-R05. Index-value audit of paired library content, not automatic mass noindex
**Priority P0 investigation; require data before indexing change.**

For each family compare: GSC indexed/eligible/excluded, impressions/clicks/query relevance, conversion/play/read task success, unique human-visible initial text, raw page/JS rendering, editorial synopsis, chapter/source, intrinsic educational Morse use and visitor pathways. Sample 25–40 varied book/audiobook pairs, including very famous and obscure books, story vs novel, short/long, duplicate titles, source variants, and title-specific summaries.

An audiobook view and a book-reading view can legitimately deserve separate indexable URLs. But if their HTTP bodies are predominantly identical boilerplate/loading shell, verify and improve distinct task value before assuming both must index. Examine residual printable links: they were intentionally noindexed, but Google must be able to crawl them to see the directive.

**Disposition matrix:** KEEP indexed; REPAIR server initial task/summary; improve on-page use case/link; REVIEW for noindex; REVIEW for consolidation (only proven interchangeable); PAUSE expansion. Any bulk noindex, redirect, removal or canonical mutation requires owner approval, Query+Page evidence and a rollback plan; no such mutation is authorized by this report.

## P1 — Specific code and product findings

### MW-T01. Reviewed audiobook SEO description is unreachable
**Confirmed source defect in app/routes/morse-code-audiobooks.$slug.tsx, not proven cause of collapse.**

The route derives an SEO-summary fallback but then uses audiobookMetaDescription(book) OR fallbackDescription. The audiobookMetaDescription helper always produces a nonempty title-substitution sentence; therefore the richer pre-reviewed SEO summary cannot appear in the audiobook route's meta description. Approximately 524 audiobook pages have generic sentence-shaped metadata despite substantial investment in distinct book summaries.

Review whether a summary best used in the audio meta needs a listen/chapters focus, not merely a plot synopsis. Implement a small truthful change if approved, test page-level human-readable snippet variability across different works, and preserve semantic separation from book page. Google may ignore meta descriptions; do not claim this alone caused a 98.5% drop or bulk rewrite titles.

### MW-T02. Repeated decorative keyword text precedes meaningful page content
**Confirmed source pattern; potential crawler/snippet cleanliness only.**

The aria-hidden, visually decorative Morse side rails in app/client/components/shared/MorseAmbientBackground.tsx render repeated “morse code translator”, “decode morse code”, “text to morse”, “sos” and other Morse strings on every route. Public extraction can surface these before H1 and title-specific text, especially bad when a book body is just loading. This is not a confirmed spam violation. Preserve the approved design; compare raw HTML, Google-rendered DOM, accessibility and snippet extraction before choosing a semantic/decorative rendering adjustment. Do not strip useful visual branding on speculation.

### MW-T03. Global related directory dominates if core book body does not render
**Confirm source, conditional UI problem.**

app/client/components/navigation/RelatedTools.tsx contains many universal link groups, already placed inside data-nosnippet by prior SEO QA. Their crawlable links are helpful. However, if book page SSR returns only generic loading text, the sitewide directory may dominate the page's visible substance. First fix actual page content, then measure small task-specific related links and leave an exhaustive accessible sitemap.

### MW-T04. Canonical host, redirects and server status need live verification
**Investigate; code baseline appears intentional.**

app/client/data/routes.ts canonical origin is https://www.morsewords.com and app/root.tsx strips trailing slashes with a 301; public robots explicitly allows Googlebot. Verify public apex/www/http/https redirect chains, canonical and robots/X-Robots-Tag, redirect-only aliases, actual 200 vs 404/5xx and homepage status via raw HEAD+GET and Googlebot logs. No blanket canonical-host change or redirects without reproduced defects.

### MW-T05. Former ~526 indexable print pages and historical sitemap residue
**Historic scope confirmed; cleanup already implemented.**

At July 2–7, there were approximately 519–526 print pages in the XML sitemap along with paired book/audio pages. Current book print route meta correctly says noindex,follow and is not in sitemap; existing script scripts/audit-sitemap-count-print-indexability.ts covers decision and tests. Verify Search Console's current old-URL state, Google crawled the noindex, valid direct routes still serve actual printable content, and nothing is blocked prematurely by robots. Do NOT reintroduce print to sitemap or remove the page just for SEO metrics.

### MW-T06. Cloudflare exported book payload and text/section integrity
**Historic owner-reported anomalies; remote state unverified.**

The prior hydration report documented 519 locally valid served exports and previews with 36 suspicious truncation warnings, but did not claim complete live Cloudflare host acceptance. Independently test a bounded set of current book and audiobook pages for correct /book-previews startup content, assets.morsewords.com full content, JSON/CORS/cache, sections, text completeness and fallback. Historical owner-observed Call of Cthulhu unavailable text and Chapter 1-only selections should be retested. Preserve rights and approved content; no enormous regeneration without concrete defect.

### MW-T07. Verify true query cannibalization, not route-name resemblance
**Investigate.**

Potential overlaps identified in May SEO report: homepage vs encoder/decoder; /audio vs Morse sound generator/MP3; decoder vs reader/audio decoder; alphabet/chart/printable; word/space/symbol leaves; practice vs quiz. These have distinct implemented functions. Only compare joined current Query+Page, selected canonical and task behavior before consolidation. Protect existing high-value URLs.

### MW-T08. Defend /audio and core translator separately from book footprint
**P1 product and historic-traffic priority.**

June internal engagement report lists /audio at 1,973 visitors and 2,939 views with 21.1% bounce, /practice 167/287 at 18.4%, and sound generator 205/269 at 11.9%. Encoder had 155/160 and 97.2% bounce with no first-viewport code bug found. High bounce on a direct-answer Morse page can be legitimate, so avoid treating bounce alone as a quality failure. Validate first translate/decode, copy, playback, WPM/tone, export and mobile performance, but change live defaults only with a reproduced concern. Inspect September /audio query-specific decline with actual recent results before adjusting headlines.

### MW-T09. Clarify literal output spaces vs official Morse timing units
**P2 small editorial only.**

MorseWords discusses “three spaces between letters” and “seven spaces between words”. For ITU Morse, 3/7 specify *silence durations in dot units*, not necessarily literal ASCII spaces in a copied text encoding. The site's textual notation can be a deliberate reversible format. Clarify when a statement describes MorseWords' string convention versus sound timing; never silently change encoder/decoder round-trip representation or educational material. Reference https://www.itu.int/rec/R-REC-M.1677 .

### MW-T10. Ads timing and page-experience check, without post hoc blame
**P2.**

First July7 AdSense source commit occurred close to or after the reported cliff onset. Check actual deployed chronology before attributing cause. Measure mobile first viewport, LCP/CLS/INP, blocked/unfilled ads, interaction time-to-first Morse result and sitewide content accessibility. **The current all-placeholders-disappear-after-first-real-ad-render rule is a deliberate owner-enforced safety workaround for verified production placeholder-over-creative overlays, not a UX defect.** Preserve it: never re-enable per-slot placeholders or allow any placeholder to cover a live ad for the sake of tidier spacing. Any proposed alternative requires the explicit owner approval and production-state acceptance gate above. No ad-position or RPM “fix” in search-recovery stage unless verified. Keep creatives separate from tool actions.

### MW-T11. Real sources, truthful expertise and useful provenance
**P2 editorial trust.**

Existing About/Sources content, public-domain/rights decisions, ITU references and author information have already been worked on. Verify page-level claims about International vs Wabun/Cyrillic/Greek Morse, radio context, audio decoding limitations, authorship, rights, review dates and copy. Do not create fake specialists, automatic refreshed dates, or hundreds of interchangeable explanations.

### MW-T12. Audit historical alias destinations and soft 404s
**P1 only when R01/R02 directs it.**

Many small legacy route files implement redirect-only aliases. Verify genuine 301 status, no loops, proper target, Google-selected canonical and historic links. A high count of aliases itself is not evidence of poor quality. Preserve historic bookmarks and successful query landing paths.

## Differentiated improvement opportunities AFTER forensic diagnosis

| ID | Candidate | Current feature coverage / constraint | Evaluation |
| --- | --- | --- | --- |
| MW-S01 | Beginner first-result examples and concise tips | Main 2-way translator already works | Test confusion, not generic rewording |
| MW-S02 | /audio-specific intent refresh | Already complete sound generator, MP3, playback options | Measure actual source queries/CTR and preserve winning copy |
| MW-S03 | Clear audio decoder limitations and example files | Audio upload/decode exists | User-task failures first |
| MW-S04 | Guided audio practice progression | Typing, practice, drills, test, sentence practice already | Retention-specific, optional |
| MW-S05 | Curated *starter* books and learner-specific listening choices | 524 book/audio pairs already | Build entrypoint trust and practical difficulty labels; no new 500-page batch |
| MW-S06 | Practical CW/radio examples | Already timing, Farnsworth, prosigns, Q-codes, CW guide | Demonstrably distinct examples; no fake licensing claim |
| MW-S07 | Classroom print selection clarity | Chart library, worksheet generator and print book pages already | Improve first worksheet task |
| MW-S08 | Contextual next-practice recommendation after task completion | Existing global nav/related and practice tools | Measure real next steps |
| MW-S09 | Book chapter resume and controls | Full book reader, playback, local state and MP3 already | No implied cloud account |
| MW-S10 | New content only for verified unanswered search intents | Existing extensive tools and guides | One reviewed distinct job at a time |

**Not missing:** encoder/decoder, audio/MP3/video, visual/audio practice, dictionary/chart/letters/phrases, word separators, word search, print worksheets/charts, International Morse by language, books/audiobooks, quiz/test/typing, named learning plans and source/trust pages. Another tool page with a new spelling variant is not the solution.

## Bounded weekly program

| Track | Scope | Completion gate |
| --- | --- | --- |
| **W1 — Loss reconstruction** | MW-R01 exact July daily Query+Page and recent follow-up; MW-R02 production deployment/HTTP timeline; MW-R03 manual actions/selected canonicals | Evidence-based ranked causes, confidence and unresolved blockers. **No production change** |
| **W2 — SSR book rendering** | MW-R04 raw HTTP and Google rendered HTML for 12+ pairs, existing June28 fix/deploy status; MW-T06 previews and full payload | Either reproduce exact pipeline fault + minimal fix plan, or PASS; no repeat of old work |
| **W3 — Index-value mapping** | MW-R05 family indexing, retention/quality sample; MW-T05 formerly indexed print behavior | Per-family KEEP/FIX/REVIEW dispositions only. No mass deindex |
| **W4 — Narrow technical correction** | Implement only reproduced server/canonical/HTTP failures | Actual prod-equivalent 200/SSR/robots/Google inspection tests plus rollback |
| **W5 — Winning tools** | MW-T08 protect and investigate /audio, translator, practice; query-intent review | No unrelated redesign or broad metadata rewrite |
| **W6 — Library usefulness** | Sample titles from book/audio, MW-T01 audiobook descriptions if proven advantageous | Specific page differentiation and user task, no massive copy regeneration |
| **W7 — Page cleanliness** | MW-T02 decorative content, MW-T03 contextual links, MW-T09 notation clarity | Preserve appearance, crawlability, audio correctness |
| **W8+ — Monitor and targeted growth** | Real post-recrawl Query+Page data; pilot one validated S-series improvement | No speculative promise of immediate ranking recovery |

## Detailed acceptance and safety policies

1. Read AGENTS.md, May SEO audit, June analytics audit, the June28 book starter-preview report, book payload hydration report, current source and approved sitemap/indexability policy before proposing any change. Reproduction replaces guesses.
2. Verify all time-sensitive findings in current live HTTP, deployed SHA and GSC. Historical Git snapshots establish source changes, not automatically what production served.
3. Preserve working audio, direct answer copy, user privacy, technical Morse standard semantics, bookmarks, export formats, rights approvals and developer-approved book text. Keep original homepage visual baseline.
4. Never batch-remove, redirect, noindex or re-canonicalize the 1,048 book/audio pages based on footprint alone; do not regenerate all book source assets or process sensitive copyright candidates for SEO. Request explicit owner authorization after impact analysis.
5. A rendering defect must be corrected at human-visible **server/browser data path**, not with crawler-only content, cosmetic client shims or fabricated SEO paragraphs.
6. Test all changed routes for real 200, primary content initial HTML, title/H1, intended robot/canonical, JSON-LD, functional controls and 390px/desktop behavior, and use the repo's existing tests under scripts/ and tests/qa-robustness-review before adding a new framework.
7. Use exact GSC/Google-selected canonical and Google Search status dates when attributing causation. Separate the July sitewide visibility cliff from the later /audio click decline.
8. This document is not authorization to deploy. Future fixes should be bounded and audited with a local rollback plan, and one release should not combine bulk content, ad changes and canonical changes.
9. For future weekly work report: CONFIRMED OPEN / HISTORICAL FIX VERIFIED / DEPLOYMENT MISMATCH / DATA NEEDED / OWNER DECISION / COMPLETE, with baseline SHA, evidence, scoped diff and tests.

## References and limitations

**Primary repository evidence:** app/routes.ts; app/client/data/routes.ts; app/root.tsx; app/client/seo.ts; public/robots.txt; public/sitemap.xml; app/routes/morse-code-books.$slug.tsx; app/routes/morse-code-audiobooks.$slug.tsx; app/routes/morse-code-books.$slug.print.tsx; app/client/data/morseBookPreviews.ts; app/client/data/morseBooks.ts; app/client/components/shared/MorseAmbientBackground.tsx; app/client/components/navigation/RelatedTools.tsx; scripts/books/sync-book-sitemap.ts; scripts/audit-sitemap-count-print-indexability.ts.

**Preexisting report evidence:** docs/seo-route-quality-audit.md (May14); docs/morsewords-analytics-engagement-audit.md (June); app/client/assets/books/audit-reports/book-starter-preview-first-render/book-starter-preview-first-render.md (June28); app/client/assets/books/audit-reports/book-payload-hydration-completeness-blocker/book-payload-hydration-completeness-blocker.md; app/client/assets/books/audit-reports/book-seo-summary-batch-9/book-seo-summary-batch-9.md; app/client/assets/books/audit-reports/book-sitemap-nav-internal-linking/book-sitemap-nav-internal-linking.md.

**Git evidence:** https://github.com/suhas-sunder/morsewords/commits/main ; inspected sitemap at commits 8e2d0cd8f (July2), 28e25127a (July5), 92c09c383 (July7), b7adc81dd (July8). Public snapshots of a few book pages were search-indexed at older dates, not guaranteed current.

**Google documentation:** https://status.search.google.com/products/rGHU1u87FJnkP6W2GwMi/history ; https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops ; https://developers.google.com/search/docs/appearance/core-updates ; https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics ; https://developers.google.com/search/docs/essentials/spam-policies ; https://developers.google.com/crawling/docs/crawl-budget .

**Competitor reference:** https://morsecode.world/ and https://morsecode.world/international/trainer/help/ . These compare capability, not verified traffic or search positions.

**Final assessment:** The timing of the extraordinary visibility cliff plus the inventory/deploy changes is reason for a genuine forensics sprint. The sharp change cannot responsibly be attributed to a specific Google update or the size of the new book library without Query+Page reports, HTTP/deploy history, current URL Inspection and raw/rendered HTML. One precise audiobook description code defect is confirmed; book loading shells and cross-site ranking loss require current-state validation. Protect core content and functionality until those investigations resolve.
