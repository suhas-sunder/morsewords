# Book Section, Metadata, and Source Audit

Generated: 2026-06-29

## 1. Executive result

Ready for Cloudflare export preparation branch.

Cloudflare export was not run. This audit used generated local manifests, generated section JSON, SEO summaries, starter previews, the sitemap, and the book-library decision checkpoint. It did not use Cloudflare export as source of truth.

## 2. Current library counts

- Generated books: 519
- SEO summaries: 519
- Startup previews: 519
- Missing summaries: 0
- Book URLs: 519
- Audiobook URLs: 519

## 3. Section/content audit result

Result: **pass**

Every live generated book has at least one section in its manifest, a positive section count, and readable generated section text.

## 4. Metadata/source audit result

Result: **pass**

The audit blocks empty titles, empty authors, lazy unknown labels, missing source names, missing known source URLs, non-positive word counts, zero sections, and non-approved live status.

## 5. Public-surface "0 sections" result

Result: **pass**

Bad public label occurrences found in audited public data/source surfaces: 0.

## 6. Bad-label scan result

Result: **pass**

The scan covers generated manifests, preview manifests, SEO summary registry metadata, and book/audiobook/listing component source used for public surfaces.

## 7. Source URL coverage result

Result: **warn**

- Source URLs present: 478
- Missing despite known generated Gutenberg ID: 0
- Absent because current generated metadata has no source URL or Gutenberg ID: 41

Absent source URL entries without generated URL evidence:

- the-hound
- from-beyond
- the-other-gods
- the-statement-of-randolph-carter
- dagon
- pickman-s-model
- the-cats-of-ulthar
- the-nameless-city
- a-slip-under-the-microscope
- beyond-the-wall-of-sleep
- celephais
- hypnos
- ibid
- in-the-vault
- nyarlathotep
- polaris
- the-alchemist
- the-beast-in-the-cave
- the-doom-that-came-to-sarnath
- the-moon-bog
- the-outsider
- the-temple
- the-tomb
- the-tree
- the-unnamable
- the-white-ship
- in-the-modern-vein
- the-argonauts-of-the-air
- the-dreams-in-the-witch-house
- the-jilting-of-jane
- the-lost-inheritance
- the-purple-pileus
- the-shadow-out-of-time
- the-strange-high-house-in-the-mist
- the-whisperer-in-darkness
- a-catastrophe
- in-the-abyss
- pollock-and-the-porroh-man
- the-plattner-story
- the-sad-story-of-a-dramatic-critic
- under-the-knife

## 8. Word-count/status result

Result: **pass**

All live generated books have positive word counts and approved/publish-ready/processing-allowed generated status.

## 9. Starter-preview first-render readiness

Result: **pass**

Every live generated book has a matching starter preview asset with readable preview text and matching content hash/version.

## 10. Deferred/blocked slug exclusion result

Result: **pass**

Deferred or blocked raw candidates from the decision checkpoint remain outside the live generated manifest and book/audiobook sitemap routes when their inferred slug is not already a different accepted generated work.

## 11. Fixes made, if any

- the-arabian-nights: author (Generated rights report and source evidence identify this as a traditional story collection edited by Kate Douglas Wiggin and Nora A. Smith; live author label is now the intentional label Various.)
- the-happy-family: source.provider, source.gutenbergId, source.sourceUrl, source.releaseDate (Local source header evidence for The Happy Family identifies Andersen's Fairy Tales, Project Gutenberg ebook 1597, released January 1, 1999.)

## 12. Remaining risks, if any

| Slug | Area | Message |
| --- | --- | --- |
| the-hound | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| from-beyond | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| the-other-gods | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| the-statement-of-randolph-carter | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| dagon | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| pickman-s-model | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| the-cats-of-ulthar | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| the-nameless-city | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| a-slip-under-the-microscope | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| beyond-the-wall-of-sleep | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| celephais | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| hypnos | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| ibid | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| in-the-vault | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| nyarlathotep | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| polaris | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| the-alchemist | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| the-beast-in-the-cave | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| the-doom-that-came-to-sarnath | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| the-moon-bog | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| the-outsider | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| the-temple | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| the-tomb | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| the-tree | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| the-unnamable | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| the-white-ship | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| in-the-modern-vein | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| the-argonauts-of-the-air | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| the-dreams-in-the-witch-house | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| the-jilting-of-jane | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| the-lost-inheritance | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| the-purple-pileus | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| the-shadow-out-of-time | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| the-strange-high-house-in-the-mist | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| the-whisperer-in-darkness | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| a-catastrophe | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| in-the-abyss | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| pollock-and-the-porroh-man | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| the-plattner-story | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| the-sad-story-of-a-dramatic-critic | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |
| under-the-knife | metadata-source | Source URL is absent and current generated metadata has no source URL or Gutenberg ID evidence. |

## Blockers

| Slug | Area | Message |
| --- | --- | --- |
| none | none | none |


## 13. Cloudflare export readiness decision

**Ready for Cloudflare export preparation branch**

## 14. Post-export validation requirements

- Final Cloudflare payloads are current.
- Starter-preview-only content does not replace final full book content.
- Reader view, section picker, cleaned preview, Morse preview, and audiobook behavior use final exported payloads.
- No intended live book route returns 404.
- No deferred or blocked book appears as a live public book.

## 15. Later content-quality checkpoints: Sources page, About page, repeated helper copy

- Sources page trust-copy update for source selection, review, source links, and correction/takedown handling.
- About page E-E-A-T sentence connecting Electrical and Computer Engineering background to Morse code, signal systems, communication systems, encoding, timing, audio, or transmission.
- Repeated helper-copy reduction across tool/helper pages before final quality review.

## 16. Deferred final stages: URL/indexability, GSC/meta review, mobile optimization

- URL/page/indexability implementation remains later.
- GSC/meta review remains later.
- Broad mobile optimization remains the final stage.
