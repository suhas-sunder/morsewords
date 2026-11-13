# November search evidence and independent current-state audit

Audit date: 2026-11-12. Baseline: `9f4121b1b532eae0f79f1f08c5dea1100f105892`, fetched origin/main and the ready Netlify production deploy `6ad02cd5cc90dffdb498d98c`. These are measurements of that revision, not a claim that the cause of the July collapse is known. See the release ledger for subsequent changes.

## Evidence boundaries and protected work

The existing local main was `8627d04ec3b6d2f561a29032f508f5f3410b11d5`, with 191 modified/deleted/untracked paths when including individual untracked files. It contains intentional duplicate-book consolidation and related assets. It was not reset, stashed, cleaned, or used for implementation. Status, hashes, and patches are under the sibling `morsewords-november-protected-state` directory. Implementation uses a separate `morsewords-2027-rebuild` worktree from fetched main. Six older auxiliary worktrees were inventoried; five were clean, and the old `main-netlify-toolworkspace-fix` directory has a broken git pointer to a D: drive checkout. That pointer was left untouched. There were no open GitHub PRs or existing 2027 release branches at inventory time.

GSC Wizard returned `payment_required` (inactive trial/subscription). It was not repeatedly retried. The following search data is **owner supplied**, not a fresh API extraction. No current URL Inspection, manual-action, crawl-log, backlink, or field Core Web Vitals evidence is available. Local browser timing is not field INP/LCP or proof of search quality.

## Search evidence

| Google window (2026) | Clicks | Impressions | CTR | Average position |
|---|---:|---:|---:|---:|
| May 11–Jun 7 | 2,048 | 89,693 | 2.28% | 7.39 |
| Jun 8–Jul 5 | 4,036 | 315,885 | 1.28% | 7.71 |
| Jul 7–Aug 3 | 490 | 5,629 | 8.70% | 24.30 |
| Aug 4–Aug 31 | 274 | 4,775 | 5.74% | 44.31 |
| Sep 1–Sep 28 | 118 | 2,191 | 5.39% | 36.09 |
| Oct 1–Oct 28 | 107 | 2,620 | 4.08% | 52.46 |
| Oct 14–Nov 10 | 90 | 2,372 | 3.79% | 48.33 |

The last window versus Jun 8–Jul 5 is a 97.8% click decline and 99.2% impression decline. Rising CTR after the cliff is consistent with a much smaller surviving query set; it is not recovery. September technical repairs did not restore observed Google visibility.

| Bing window (2026) | Clicks | Impressions |
|---|---:|---:|
| May 13–Jun 9 | 800 | 86,328 |
| Jun 10–Jul 7 | 806 | 55,195 |
| Jul 8–Aug 4 | 791 | 44,901 |
| Aug 5–Sep 1 | 810 | 55,950 |
| Sep 2–Sep 29 | 777 | 38,160 |
| Oct 1–Oct 28 | 740 | 27,372 |
| Oct 14–Nov 10 | 696 | 26,757 |

Bing breadth also weakened, but its clicks did not collapse with Google. A universal sustained outage is therefore an unlikely complete explanation. Google-specific ranking reassessment/index selection remains a hypothesis, not proof of a penalty. The [Google Search status history](https://status.search.google.com/products/rGHU1u87FJnkP6W2GwMi/history) was checked: the June spam update ran June 24–26; the observed July 6–7 break follows it, without establishing causation. The November core update began November 10; rollout fluctuations cannot validate this program.

| Six-month landing page | Clicks | Impressions |
|---|---:|---:|
| /audio | 4,560 | 41,532 |
| / | 1,763 | 194,071 |
| /practice | 213 | 2,574 |
| /morse-code-numbers | 98 | 24,849 |
| /morse-code-word-separator | 55 | 54,828 |
| /morse-code-sound-generator | 51 | 791 |
| /dictionary | 48 | 3,445 |
| /how-to-write-in-morse-code | 41 | 15,899 |
| /morse-code-mp3-generator | 36 | 498 |
| /morse-code-alphabet | 35 | 33,611 |
| /typing | 35 | 595 |
| /morse-code-decoder | 31 | 2,434 |
| /morse-code-printable-chart | 27 | 1,351 |
| /morse-code-punctuation | 23 | 20,840 |

Audio CTR/position were 10.98%/5.63; home 0.91%/11.17; practice CTR 8.28%; word separator position 4.31. Proven queries include sound generator (878 clicks/2,832 impressions/2.59 position), translator audio (469/10,306), generator audio (352/1,388/3.09), translator (291/101,330/9.09), audio generator (263/1,090/2.75), audio (197/1,375/4.62), to audio (134/460/3.73), and sound (130/1,809/5.90). Preserve these existing owners and workflows.

## Architecture and index footprint

Measured sitemap: **1,179 unique URLs**, comprising **524 book details, 524 audiobook details, 131 other routes, zero print details**. Library pairs occupy 88.9% of the sitemap. The owner export reports book activity on 138 pages (6 clicks/1,195 impressions), audiobook activity on 135 (1/559), and 15 historical print pages (0/44). Activity rows are not a complete indexed-URL census. Low demand does not establish that the library caused the collapse.

`app/routes.ts` supplies routing, `app/client/data/routes.ts` supplies canonical ownership/aliases, `app/client/seo.ts` supplies the production origin, and robots points to the public sitemap. Source audits found no duplicate sitemap URLs, unexpected alias inclusion, missing canonical owners, or broken registry links. The library manifest and startup preview manifest each contain 524 records. Preserve the registry rather than creating spelling variants. Bulk ingestion remains prohibited.

| Family / job | Current utility and independent assessment | Index decision support |
|---|---|---|
| Home translator | Immediate two-way text/Morse panels, playback, visible unknown groups. Strong real utility; duplicated support sections make the full page long. | Keep indexed; protect primary broad ownership. |
| Encoder, decoder, reader, separator | Shared encoder/decoder engine; reader simplifies pasted signals; separator exposes formats. Written separators versus audio units can confuse learners. Reader overlap deserves usage review, not an automatic merge. | Keep/repair; reader consolidate review only after URL evidence. |
| Audio, sound, MP3, video | Audio is the proven hub; sound has synthesis intent; MP3 has export intent; video has visual output. Shared timing/presets and segmented exports are valuable. | Keep indexed; no cap reductions or route consolidation. |
| Audio decoder | File-to-signal tool, raw output and uncertainty, local processing, explicit limitations. No built-in example means a new visitor cannot evaluate it without finding a recording. | Repair onboarding; keep file decoding owner distinct. |
| Practice, typing, word/sentence drills, quizzes | Interactive recall, accuracy feedback, custom weak-word work. Real tasks, but long-term progression needs evidence and careful local persistence. | Keep indexed; no unsupported adaptive/certification claims. |
| Alphabet, numbers, punctuation, dictionary | Lookup, copy and sound functions plus printable resources. Source note exists. ITU-defined punctuation and common extensions need row-level differentiation. | Keep/repair provenance, not more boilerplate. |
| Timing/Farnsworth | Correct core ratios and worked examples, but mostly fixed text; learners cannot inspect their own speed choices in place. | Repair with a canonical-engine timing demonstration. |
| Prosigns/Q codes | Operational reference distinct from ordinary letters. Concatenated prosigns must remain distinct from spaced letter encoding. | Keep; inspect standards/usage scope per entry. |
| Charts/worksheets/printable pages | Ready-made reference charts, custom exercises, and long text print each have separate jobs. 39 chart assets already exist. | Keep hubs; preserve noindex print details. |
| Languages/international text | Language adaptation lookup and transliteration are distinct tasks. Transliteration is lossy, not a new universal Morse alphabet. | Keep; sources and limits must stay explicit. |
| Book/audio pairs | Title-specific initial excerpt, chapter selection, local playback/export, source and summaries. Pair task differences are real, but common player/summary content is substantial; search contribution is very small. | Repair and per-title review. No blanket keep/noindex rule. |
| About/Sources/legal/contact | Maintainer identity and standards/source links already exist. Public-domain status must stay source/jurisdiction-qualified. | Keep trust resources; no invented editorial board or review date. |

## Reproduced findings

1. **Confirmed metadata defect, immediate candidate.** `morse-code-audiobooks.$slug.tsx` computes a reviewed-description fallback then always takes a nonempty generic function. All 524 audiobook descriptions use one sentence template with only title/source substitution. WebPage JSON-LD repeats it. Book metadata already uses reviewed descriptions. Repair with one pure audio-intent adapter, preserving reviewed work-specific information and using a genuine fallback only when absent/blank. Do not claim ranking causality or rewrite the corpus.
2. **Confirmed mobile keyboard defect.** At 390px the mobile dialog opens while focus remains on the trigger outside it; Escape leaves the dialog open. `NavBar.tsx` locks body scrolling but has no mobile initial focus, focus containment, or Escape listener. Desktop More also needs deliberate return focus. Repair in W02, test nested display settings and route navigation.
3. **Confirmed stale validation entrypoint.** `site:local-final-validation` throws ENOENT for ignored `cloudflare-updated-export/upload-manifest.json`. It also pins historical counts (702 routes/130 nonbook URLs), a historical commit, and a two-book upload batch. It cannot honestly certify the current checkout. Preserve it as a historical batch validator and build a current checkout gate, not fabricated ignored artifacts or blindly increased constants.
4. **Confirmed fallback substance gap.** If both initial preview and full payload are unavailable, `MorseBookRuntimeState` receives the title but not the already-available reviewed summary. Users get an animated loading shell/error and Retry, with no useful work context/source. Preserve recovery behavior and expose truthful available context in W08.
5. **Confirmed navigation intent mismatch.** Audio-decoder terms are search keywords on the text decoder item, while the dedicated audio decoder is absent from the conversion group. Route users to the actual file-decoding task in W02.
6. **Decorative SSR boilerplate, not a proven ranking defect.** Ambient plain keyword labels are in raw HTML before the H1 inside aria-hidden decoration. They are visually subtle and approved. No snippet misuse has been observed. Do not remove/reword them in the hotfix. A later semantic `data-nosnippet` change needs zero-visual-difference verification and is not recovery evidence.
7. **Tool tryout and reference gaps.** Audio decoder has no example, timing has no interactive calculation, and separator output does not explain which boundaries/unknown groups it found. These are product opportunities observed in source and rendered pages, not broken core algorithms.

## Historical repairs verified, not repeated

Registry/redirect tests verify `/morse-code-translator` -> `/` and `/morse-code-audio-generator` -> `/audio`, including query preservation. Print details remain outside the sitemap and noindex/follow. Duplicate Anne/Monte Cristo paths resolve through the current canonical registry, not new content records. All nine September-repaired starter preview assets pass the runtime startup contract. Current 524 preview assets are independently checked by existing tests. The Netlify adapter produces `build/server/server.js`; its default handler responds with real SSR. The old standalone `server.js` expects nonexistent `build/server/index.js` and is not the deployed Netlify entrypoint. Chart/worksheet separation, 39 chart downloads, theme tokens, shared surfaces and browser settings already exist; do not present them as new work.

## Render, accessibility and performance evidence

Baseline artifacts are under ignored `output/november-baseline/`: raw HTML, browser.json and full-page screenshots for 34 representative routes at 1440 and 390 pixels. Pages rendered 200, a single intended H1, useful main content and no horizontal overflow in this sample. H1 computed desktop/mobile sizes follow shared home/audio typography. Screenshot review finds tool-first home/audio, an especially long mobile discovery/support tail, and cramped multi-column reference support at desktop widths. Any refinement must use the approved home system, not a redesign. External requests were blocked in this deterministic run: missing remote chart images and ad fallback are **harness conditions**, not established production image failures. Development `WebSocket closed without opened` errors were isolated; production handler checks must not suppress real application exceptions.

Baseline build and typecheck passed; default npm test passed 28 tests. Client warning: `morseBooks` chunk 832.63 kB raw/83.32 kB gzip; primary index chunk 438.02 kB raw/181.28 kB gzip. These are bundle measurements, not a field performance score. Shared global navigation imports library summaries; future payload reduction must preserve discoverability and search. Full-book JSON must remain outside SSR/client bundles; only current compact summary/preview is serialized. Local HTTP/navigation times include a cold dev server and blocked hosts and cannot establish competitor speed rankings.

## Live comparative review

All 15 requested queries were searched. Results are representative retrieved pages, **not a verified localized Google rank ordering**. Pages below were inspected; no lab speed benchmark was run and no competitor code/copy was copied.

| Queries covered | Inspected primary page | Concrete comparison / opportunity |
|---|---|---|
| translator, sound generator, audio generator, decoder | [Morse Code World translator](https://morsecode.world/international/translator.html) | Compact convert/play/config/save workflow and sharing. MW offers a wider connected practice/print/book system and segmented downloads; retain that advantage while making next tasks clear. |
| audio decoder | [Morse Code World adaptive decoder](https://morsecode.world/international/decoder/audio-decoder-adaptive.html) | Microphone/file input and signal/timing controls, with experimental limitations. MW file-only scope is legitimate; a known clean sample would make capability and uncertainty immediately testable. Microphone is a separate later feature, not a hotfix. |
| learn, practice | [Morse Code Ninja course](https://morsecode.ninja/learn/index.html) | Cumulative sound-first learning and progression, including fast characters/slower effective speed. MW has flexible drills and local weak-word work; later curriculum must measure actual skills rather than claim adaptive mastery. |
| alphabet, chart, international Morse | [MorseCode.live chart](https://morsecode.live/morse-code-chart/) | Early pattern lookup, playable entries and explicit standard/common distinction. MW already has 39 downloadable sheets and several scripts; improve provenance precision rather than add another chart URL. |
| numbers | [Morse24 numbers](https://morse24.com/morse-code-numbers/) | Explains five-element patterns and distinguishes abbreviated cut numbers. MW has copy/play examples; later comparison should guard against presenting radio shorthand as the ordinary encoder. |
| punctuation | [MorseCodeNow punctuation](https://morsecodenow.com/morse-code-punctuation/) | Standard versus convention is exposed beside symbols. MW's general source note is weaker than entry-level source scope. Verify against ITU before adding annotations. |
| word separator, timing, prosigns | [Morse Code World timing](https://morsecode.world/international/timing/) and translator | Ratios and word-speed explanations help users separate written separators from timed silence. MW's spacing tool is useful but can show what it parsed, and a timing lab can make its own engine behavior inspectable. Prosign-specific search results were retrieved; their detailed editorial accuracy was not independently established. |

Additional source inspection: [Morse Code World's International reference](https://morsecode.world/international/morse2.html) explicitly distinguishes continuous prosigns from spaced Q codes and labels nonstandard punctuation. [MorseCoder's prosign guide](https://morsecoder.us/morse-code-prosigns/) offers QSO examples, but its classification of CQ as a continuous prosign conflicts with the spaced-abbreviation distinction; it is not a factual source for implementation. This reinforces the need for primary-source verification rather than copying a ranking competitor.

The complete local inventory also found 524 distinct reviewed descriptions, no missing authors, 41 records without a source URL, and two title-equivalent Secret Garden records. All 524 records are marked approved in the supplied rights metadata; this is a recorded approval status, not an independent legal finding. Work lengths range from 250 to 563,505 words and 1 to 364 sections; those numbers describe workload, not quality scores. Missing provenance and duplicate-source variants require explicit human review in W07.

## Risk register and release decision rules

| Risk | Evidence / control |
|---|---|
| Wrong cause attribution | No manual action or causal experiment; use hypotheses and cohorts, never “penalized for books.” |
| Large low-demand index footprint | 1,048 paired details/7 reported clicks; per-page evidence review, no expansion or bulk mutation. |
| Damaging proven audio intent | Shared canonical engine, presets, persistence and segmented export unchanged; regression tests on siblings. |
| Deploy/SSR packaging regression | Test actual Netlify output, required summary JSON, compact payload, representative raw SSR and deployed SHA. |
| Ad account safety | Ad lifecycle/config/placements are protected; preserve page-wide hide-all fallback guard and run existing invariants. |
| Dirty work loss | Separate worktree; hashes and status verification at end. No unrelated restore/reset. |
| False gate confidence | Historical source audits passed despite unreachable summary; add rendered assertions, do not trust build alone. |
| Unverifiable rights/source claims | Report supplied rights status/source URL, never imply worldwide legal clearance. |
| Private input leakage | No raw messages, answers, custom lists, or filenames in analytics; no new external input transmission. |

The metadata defect qualifies for a bounded immediate candidate. Mobile navigation and substantive tooling belong in staged weekly releases. No route/index/ad changes qualify now. Production authorization remains conditional on the full gate; the release ledger records the actual decision, not this candidate assessment.

## Measurement specification

Weekly: exact deployed SHA, SSR/status/redirect probes, preview/full-payload availability, console/errors, download completion, and protected ad behavior. Do not attribute rank movement to the latest commit.

Every 28 days: compare Google and Bing separately with equal windows, query/page breadth, position bands, index coverage where available, core audio/translator/practice/reference groups, chart image-search activity, and privacy-safe tool completion/internal navigation if instrumentation is available. Preserve raw export dates and sampling limits.

Every eight weeks: review release cohorts, distinguish repaired technical failures from search response, and examine library titles individually with demand/links/source/utility evidence. Quarterly: reconsider route ownership and indexing proposals with an affected-URL inventory, internal/external-link risk and a rollback map. Bulk indexing requires owner approval. No numeric quality score can trigger automatic noindex or deletion.
