# MorseWords SEO Route Quality Audit

Date: 2026-05-14

Scope: final SEO, AdSense, structured-data, snippet, sitemap, noindex, and
content-value remediation pass after the route expansion, dark mode, MP3 route,
icon pass, and nav polish.

## Inventory Summary

- Total React Router entries: 152
- Indexable canonical URLs in XML sitemap: 113
- Noindex/follow support routes: 6
- Redirect aliases: 33
- Duplicate URLs in XML sitemap: 0
- Noindex URLs in XML sitemap: 0
- Redirect aliases in XML sitemap: 0
- Unknown or artifact URLs in XML sitemap: 0

Indexable family counts:

| Family | Count | Notes |
| --- | ---: | --- |
| Home | 1 | Main bidirectional translator and product entry point |
| Core translator, audio, and utility tools | 11 | Translator, encoder, decoder, reader, audio, audio decoder, sound generator, MP3, name converter, international translator, word-search builder |
| Practice and test tools | 9 | Practice, typing, test hub, audio/visual practice, quizzes, sentence practice, word trainer, practice plan |
| Reference hubs | 14 | Chart, alphabet, numbers, punctuation, dictionary, timing, prosigns, Q-codes, reference, word/spacing hubs |
| Guides and task pages | 8 | How-to pages, copy/paste, no-spaces, word-separation, learner path |
| Letter leaves | 26 | A-Z generated letter pages |
| Number leaves | 10 | 0-9 generated number pages |
| Phrase leaves | 14 | Common word, phrase, SOS, CQ, and pangram pages |
| Symbol and spacing leaves | 17 | Punctuation, symbols, space, slash, and separator leaves |
| Support/trust pages | 3 | About, Contact, Sources |

## Route Inventory Table

| Route | Family | Index status | Unique purpose | Duplicate-intent risk | SEO/content status | Action taken | Remaining risk |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Home | Index | Main translator, audio preview, learning path entry | Medium against encoder/decoder | Strong, unique metadata and task completion | Reviewed, unchanged | Monitor query split with encoder/decoder |
| `/audio`, `/morse-code-sound-generator`, `/morse-code-mp3-generator` | Audio tools | Index | Listen/practice, tune/export sound, and MP3 download respectively | Medium | Distinct titles, H1s, descriptions, and sitemap descriptions | Reviewed, unchanged | Watch Search Console if MP3 and sound-generator impressions overlap |
| `/morse-code-audio-decoder` | Audio decoder | Index | Upload clean Morse audio and decode to Morse/text | Medium against reader/decoder | Distinct upload-audio positioning | Reviewed, unchanged | Audio quality expectations should keep being explicit |
| `/morse-code-reader`, `/morse-code-decoder`, aliases | Reader/decoder | Reader and decoder index, aliases redirect | Reader is paste/read typed Morse, decoder is converter intent | Medium | Redirect aliases excluded from sitemaps and internal links | Verified, unchanged | Future consolidation only if Search Console shows cannibalization |
| `/morse-code-encoder` | Encoder | Index | Text-only encoding task | Medium against home | Single-purpose title, H1, and canonical URL | Reviewed, unchanged | None beyond natural overlap with home |
| `/morse-code-chart`, `/morse-code-alphabet`, `/morse-code-numbers`, `/morse-code-punctuation`, `/morse-code-printable-chart` | Reference hubs | Index | Complete chart, focused symbol groups, and printable worksheet/export workflow | Medium | Distinct metadata and page purposes | Reviewed, unchanged | Keep printable route from drifting into generic chart copy |
| `/dictionary`, `/international-morse-code-reference`, `/morse-code-prosigns`, `/morse-code-q-codes` | Reference hubs | Index | Terms, full reference, procedural signals, and Q-code lookup | Low | Page-specific reference value retained | Reviewed, unchanged | None |
| `/morse-code-word-separator`, `/how-to-separate-words-in-morse-code`, `/space-in-morse-code`, `/slash-in-morse-code`, `/morse-code-without-spaces` | Spacing cluster | Index | Tool, guide, symbol leaves, and ambiguity explainer | Medium | Existing contextual links and metadata distinguish tasks | Reviewed, unchanged | Watch for query overlap between guide and separator tool |
| `/morse-code-words` and phrase leaves | Phrase hub and leaves | Index | Hub plus copy/audio examples for specific phrases | Medium within generated family | Unique titles and descriptions verified | Reviewed, unchanged | Avoid adding more near-duplicate phrase leaves |
| Symbol and punctuation leaves | Symbol leaves | Index | One symbol per page with examples and tool CTAs | Medium within generated family | Unique title/description metadata verified; FAQPage schema suppressed | Reviewed, unchanged | Keep schema suppression policy in place |
| A-Z letter pages | Letter leaves | Index | One letter per page with Morse, audio, examples, and practice links | Medium within generated family | Unique metadata verified; FAQPage schema suppressed | Reviewed, unchanged | Generated-family snippets should rely on unique examples, not global toolkit copy |
| 0-9 number pages | Number leaves | Index | One digit per page with pattern, examples, and practice links | Medium within generated family | Unique metadata verified; FAQPage schema suppressed | Reviewed, unchanged | Same generated-family risk as letters |
| `/morse-code-test`, `/practice`, `/typing`, quiz and practice routes | Practice and tests | Index | Test hub, open practice, typing, scored quizzes, and focused drills | Medium | Existing copy separates test vs practice modes | Replaced public "Result model" labels with "Result summary" | Watch overlap between test hub and specific quiz routes |
| `/about`, `/contact`, `/sources` | Support/trust | Index | Public trust, feedback/contact, and source references | Low | Useful public pages, sitemap included | Reviewed, unchanged | None |
| `/sitemap`, `/misc`, `/misc/privacy-policy`, `/misc/terms-of-service`, `/misc/cookies-policy`, `/misc/socials` | Support/legal/misc | Noindex, follow | Navigation, legal, policy, and related-link support | Low for search, high if indexed | Excluded from XML sitemap; noindex verified | Removed noindex legal/support links from HTML sitemap main inventory; adjusted socials metadata | Keep footer access while preventing snippet pollution |
| Redirect aliases | Redirects | 301 | Legacy or typo URL preservation | Low | Excluded from XML and HTML sitemaps | Verified by tests | Add aliases only when canonical target is clear |

## Duplicate-Intent Clusters

| Cluster | Routes involved | Current risk | Action taken | Remaining recommendation |
| --- | --- | --- | --- | --- |
| Audio generation | `/audio`, `/morse-code-sound-generator`, `/morse-code-mp3-generator` | Medium | Verified distinct indexable metadata and sitemap descriptions | Monitor MP3 and sound-generator query overlap |
| Audio/text decoding | `/morse-code-audio-decoder`, `/morse-code-reader`, `/morse-code-decoder` | Medium | Verified audio upload, paste reader, and text converter positioning | Consider future canonical language only if rankings split |
| Reader aliases | `/morse-code-reader`, `/morse-to-english`, `/morse-code-to-english`, `/morse-reader`, `/read-morse-code` | Low | Redirect aliases remain 301-only and excluded | Keep aliases out of internal links |
| Home vs encoder/decoder | `/`, `/morse-code-encoder`, `/morse-code-decoder` | Medium | Reviewed, no rewrite needed | Watch home snippets for single-direction queries |
| Chart/reference | `/morse-code-chart`, `/morse-code-alphabet`, `/morse-code-numbers`, `/morse-code-punctuation`, `/morse-code-printable-chart` | Medium | Reviewed, no route removal | Keep printable and chart pages clearly separated |
| Spacing | `/morse-code-word-separator`, `/how-to-separate-words-in-morse-code`, `/space-in-morse-code`, `/slash-in-morse-code`, `/morse-code-without-spaces` | Medium | Reviewed contextual pathways | Monitor guide/tool split |
| Practice/testing | `/morse-code-test`, `/practice`, `/typing`, `/morse-code-audio-quiz`, `/morse-code-visual-quiz` | Medium | Replaced implementation-style result labels | Keep hub as chooser and quizzes as scored tests |

## Boilerplate And Snippet Findings

| Component/block | Pages affected | Action taken | Notes |
| --- | --- | --- | --- |
| Global related tools | Repeated across routed pages | Verified `data-nosnippet` wrapper in root | Keeps toolkit links visible without dominating snippets |
| Footer and social block | Global footer | Verified `data-nosnippet` wrapper in root | Footer links remain crawlable and accessible |
| HTML sitemap support links | `/sitemap` | Removed noindex legal/social/policy links from main sitemap inventory | Footer still links to legal/support pages |
| Social links page | `/misc/socials` | Kept noindex/follow and reduced "official profile" overclaim | Page remains accessible from footer |
| Legal/support copy | `/misc/*` | Kept noindex/follow and excluded from XML sitemap | Fixed broken cookie policy URL and admin wording |

## Metadata Findings

- All 113 XML-sitemap routes were checked for title, description, canonical URL,
  OG URL, and robots status.
- No duplicate title tags were found among XML-sitemap URLs.
- No duplicate meta descriptions were found among XML-sitemap URLs.
- Canonical URLs and OG URLs match the sitemap URL for every indexable route.
- No indexable XML-sitemap URL emits a `noindex` robots meta tag.
- `/misc/socials` metadata was changed from official-profile wording to a
  support-link description that matches the actual page.

## Noindex And Sitemap Findings

- `noindex,follow` is verified for `/sitemap`, `/misc`,
  `/misc/privacy-policy`, `/misc/terms-of-service`, `/misc/cookies-policy`, and
  `/misc/socials`.
- `/about`, `/how-to-use`, `/sources`, and `/contact` remain indexable because
  they provide public trust, usage, contact, and source value.
- XML sitemap and HTML/app sitemap now agree on the 113 indexable canonical
  routes.
- Redirect aliases are excluded from both sitemap surfaces.
- `robots.txt` references `https://morsewords.com/sitemap.xml` and does not
  block noindex pages.

## JSON-LD And FAQ Findings

- BreadcrumbList schema is present on routed content pages covered by smoke
  tests.
- Breadcrumb URLs use canonical URLs, not redirect aliases.
- Redirect aliases are redirect-only and do not expose standalone JSON-LD.
- Generated leaf families remain without FAQPage schema.
- Visible FAQ/schema alignment remains covered by existing structured-data
  tests.
- No rating, review, or unsupported authority schema was added.

## Internal-Link Findings

- Core pages rely on contextual links plus the shared toolkit rather than link
  clouds.
- Existing redirect-only aliases remain excluded from sitemap and nav surfaces.
- The HTML sitemap duplicate entries for `/cq-in-morse-code` and
  `/i-love-you-in-morse-code` were removed by relying on the generated phrase
  inventory instead of explicit duplicate entries.
- Legal and socials pages remain accessible from the footer, but are no longer
  presented as indexable sitemap inventory.

## Public Copy Findings

- Public scan was run for: Codex, OpenAI, AI-generated, internal dialogue,
  model, prompt, placeholder, lorem ipsum, TODO, FIXME, fake, dummy,
  cookiecollection, official profile wording, and mojibake markers.
- Remaining `prompt` and `placeholder` matches are functional UI/tool language.
- Remaining `model` matches are normal nouns such as hardware model, growth
  model, or vehicle make/model, not implementation-process copy.
- Public "Result model" labels were changed to "Result summary".
- Footer sign-off Morse was changed to ASCII Morse text.

## Pages Improved In This Pass

- `/sitemap`: removed noindex support/legal/social pages from the main
  indexable inventory and removed two duplicate phrase links.
- `/misc/socials`: adjusted metadata and page heading copy to avoid official
  profile overclaims.
- `/misc/privacy-policy`: fixed an obsolete cookie-policy URL.
- `/misc/terms-of-service`: replaced public "MorseWords admin" wording and
  avoided a public `fake` scan hit.
- `/morse-code-audio-quiz`: changed visible "Result model" label to "Result
  summary".
- `/morse-code-visual-quiz`: changed visible "Result model" label to "Result
  summary".
- Global footer: replaced emoji sign-off with ASCII Morse for "made with love".

## Pages Reviewed And Left Unchanged

- Home, audio, sound generator, MP3 generator, audio decoder, reader, decoder,
  encoder, chart, alphabet, numbers, punctuation, dictionary, international
  reference, prosigns, Q-codes, word separator, spacing guides, phrase leaves,
  symbol leaves, letter leaves, number leaves, practice, typing, test hub, and
  public trust pages.

## Remaining Low-Value Risk

- Generated leaf families still have natural template risk. Current mitigation:
  unique title/description metadata, unique examples, visible page-specific
  value, and no FAQPage schema on generated leaves.
- Audio generation routes should be monitored for query cannibalization because
  users may search for audio, sound, and MP3 with overlapping language.
- Reader/decoder pages should be monitored for query split, but no redirect is
  recommended without Search Console evidence.

## Final Recommendation Before Deploy

Ready for deploy after validation passes. Submit the XML sitemap in Search
Console if needed, then monitor AdSense policy center, Search Console indexing,
query cannibalization across audio and decoder clusters, and snippets for
generated leaf families.
