# Pilot Write 5 Verification

Generated at: 2026-06-17T17:18:23.293Z

## Summary

- Branch: morsewords-book-processing-pilot-write-5-jun-2026
- Commit verified: b97f8dcde72bc34b43e9750a97649055221dc8e2
- Selected books verified: 20
- Pass: 12
- Warn accepted: 8
- Fail: 0
- Corrections made during verification: 0
- Correction needed before main: 0

## Focused Correction Note

- No verification-time corrections were made.

## Results

| Book | Write action | Verification | Accepted for main | Notes |
| --- | --- | --- | --- | --- |
| anna-karenina | accepted without rewrite | pass | yes | none |
| anne-of-green-gables-gutenberg-45 | accepted without rewrite | pass | yes | none |
| candide | corrected | pass | yes | none |
| crime-and-punishment | corrected | pass | yes | none |
| gulliver-s-travels | corrected | pass | yes | none |
| the-bell | accepted without rewrite | warn accepted | yes | Sectioning matches the source structure with review notes.; No explicit includeByDefault sections; verified runtime/startup fallback selects readable sections. |
| the-call-of-cthulhu | corrected | pass | yes | none |
| the-elderbush | accepted without rewrite | warn accepted | yes | Sectioning matches the source structure with review notes.; No explicit includeByDefault sections; verified runtime/startup fallback selects readable sections. |
| the-emerald-city-of-oz | corrected | pass | yes | none |
| the-emperor-s-new-clothes | accepted without rewrite | warn accepted | yes | Sectioning matches the source structure with review notes.; No explicit includeByDefault sections; verified runtime/startup fallback selects readable sections. |
| the-fir-tree | accepted without rewrite | warn accepted | yes | Sectioning matches the source structure with review notes.; No explicit includeByDefault sections; verified runtime/startup fallback selects readable sections. |
| the-leap-frog | accepted without rewrite | warn accepted | yes | Sectioning matches the source structure with review notes.; No explicit includeByDefault sections; verified runtime/startup fallback selects readable sections. |
| the-old-house | corrected | pass | yes | none |
| the-real-princess | accepted without rewrite | warn accepted | yes | Sectioning matches the source structure with review notes.; No explicit includeByDefault sections; verified runtime/startup fallback selects readable sections. |
| the-secret-garden-gutenberg-113 | accepted without rewrite | pass | yes | none |
| the-shoes-of-fortune | accepted without rewrite | warn accepted | yes | Sectioning matches the source structure with review notes.; No explicit includeByDefault sections; verified runtime/startup fallback selects readable sections. |
| the-snow-queen | corrected | pass | yes | none |
| the-swineherd | corrected | pass | yes | none |
| treasure-island | corrected | warn accepted | yes | body headings were found but rejected by the selected strategy |
| wind-in-the-willows | accepted without rewrite | pass | yes | none |

## Corrected Books

### candide

- Previous defect fixed: yes
- First default before: part-002 Part 2
- First default after: chapter-001 Chapter 1
- Section count before/after: 8 -> 30
- Preview after: I HOW CANDIDE WAS BROUGHT UP IN A MAGNIFICENT CASTLE, AND HOW HE WAS EXPELLED THENCE. In a castle of Westphalia, belonging to the Baron of Thunder-ten-Tronckh, lived a youth, whom nature had endowed with the most gentle manners. His countenance was a true pic...
- Final verdict: accepted for main
- Start: First default section starts from real readable generated content.
- End: Generated default playback preserves the readable ending without footer leakage.
- Sectioning: Sectioning matches the selected source structure without fallback collapse.

### crime-and-punishment

- Previous defect fixed: yes
- First default before: chapter-001 Chapter 1
- First default after: chapter-001 Chapter 1
- Section count before/after: 47 -> 40
- Preview after: CHAPTER I On an exceptionally hot evening early in July a young man came out of the garret in which he lodged in S. Place and walked slowly, as though in hesitation, towards K. bridge. He had successfully avoided meeting his landlady on the staircase. His gar...
- Final verdict: accepted for main
- Start: First default section starts from real readable generated content.
- End: Generated default playback preserves the readable ending without footer leakage.
- Sectioning: Sectioning matches the selected source structure without fallback collapse.

### gulliver-s-travels

- Previous defect fixed: yes
- First default before: chapter-001 Chapter 1
- First default after: chapter-001 Chapter 1
- Section count before/after: 49 -> 39
- Preview after: CHAPTER I. The author gives some account of himself and family. His first inducements to travel. He is shipwrecked, and swims for his life, gets safe on shore in the country of Lilliput; is made a prisoner, and carried up the country. My father had a small es...
- Final verdict: accepted for main
- Start: First default section starts from real readable generated content.
- End: Generated default playback preserves the readable ending without footer leakage.
- Sectioning: Sectioning matches the selected source structure without fallback collapse.

### the-call-of-cthulhu

- Previous defect fixed: yes
- First default before: part-002 Part 2
- First default after: chapter-001 Part 1
- Section count before/after: 4 -> 3
- Preview after: The most merciful thing in the world, I think, is the inability of the human mind to correlate all its contents. We live on a placid island of ignorance in the midst of black seas of infinity, and it was not meant that we should voyage far. The sciences, each...
- Final verdict: accepted for main
- Start: First default section starts from real readable generated content.
- End: Generated default playback preserves the readable ending without footer leakage.
- Sectioning: Sectioning matches the selected source structure without fallback collapse.

### the-emerald-city-of-oz

- Previous defect fixed: yes
- First default before: part-002 Part 2
- First default after: chapter-001 Chapter 1
- Section count before/after: 11 -> 30
- Preview after: The Nome King was in an angry mood, and at such times he was very disagreeable. Every one kept away from him, even his Chief Steward Kaliko. Therefore the King stormed and raved all by himself, walking up and down in his jewel-studded cavern and getting angri...
- Final verdict: accepted for main
- Start: First default section starts from real readable generated content.
- End: Generated default playback preserves the readable ending without footer leakage.
- Sectioning: Sectioning matches the selected source structure without fallback collapse.

### the-old-house

- Previous defect fixed: yes
- First default before: part-001 Part 1
- First default after: chapter-001 The Old House
- Section count before/after: 5 -> 9
- Preview after: THE OLD HOUSE In the street, up there, was an old, a very old house--it was almost three hundred years old, for that might be known by reading the great beam on which the date of the year was carved: together with tulips and hop-binds there were whole verses...
- Final verdict: accepted for main
- Start: First default section starts from real readable generated content.
- End: Generated default playback preserves the readable ending without footer leakage.
- Sectioning: Sectioning matches the selected source structure without fallback collapse.

### the-snow-queen

- Previous defect fixed: yes
- First default before: part-001 Part 1
- First default after: chapter-001 Story 1
- Section count before/after: 4 -> 7
- Preview after: STORY THE FIRST WHICH DESCRIBES A LOOKING-GLASS AND ITS BROKEN FRAGMENTS YOU must attend to the beginning of this story, for when we get to the end we shall know more than we now do about a very wicked hobgoblin; he was one of the most mischievous of all spri...
- Final verdict: accepted for main
- Start: First default section starts from real readable generated content.
- End: Generated default playback preserves the readable ending without footer leakage.
- Sectioning: Sectioning matches the selected source structure without fallback collapse.

### the-swineherd

- Previous defect fixed: yes
- First default before: part-001 Part 1
- First default after: chapter-001 The Swineherd
- Section count before/after: 2 -> 1
- Preview after: THE SWINEHERD There was once a poor Prince, who had a kingdom. His kingdom was very small, but still quite large enough to marry upon; and he wished to marry. It was certainly rather cool of him to say to the Emperor's daughter, "Will you have me?" But so he...
- Final verdict: accepted for main
- Start: First default section starts from real readable generated content.
- End: Generated default playback preserves the readable ending without footer leakage.
- Sectioning: Sectioning matches the selected source structure without fallback collapse.

### treasure-island

- Previous defect fixed: yes
- First default before: part-001 Part 1
- First default after: chapter-001 Chapter 1
- Section count before/after: 14 -> 34
- Preview after: I The Old Sea-dog at the Admiral Benbow Squire Trelawney, Dr. Livesey, and the rest of these gentlemen having asked me to write down the whole particulars about Treasure Island, from the beginning to the end, keeping nothing back but the bearings of the islan...
- Final verdict: accepted for main with review notes
- Start: First default section starts from real readable generated content.
- End: Generated default playback preserves the readable ending without footer leakage.
- Sectioning: Sectioning matches the selected source structure without fallback collapse.

## Accepted Without Rewrite

- anna-karenina: dry-run acceptance remains valid; first default chapter-001 Chapter 1; Preview is valid, book-specific, and starts from generated readable content.
- anne-of-green-gables-gutenberg-45: dry-run acceptance remains valid; first default chapter-001 Chapter 1; Preview is valid, book-specific, and starts from generated readable content.
- the-bell: dry-run acceptance remains valid; first default part-001 Part 1; Preview is valid, book-specific, and starts from generated readable content.
- the-elderbush: dry-run acceptance remains valid; first default part-001 Part 1; Preview is valid, book-specific, and starts from generated readable content.
- the-emperor-s-new-clothes: dry-run acceptance remains valid; first default part-001 Part 1; Preview is valid, book-specific, and starts from generated readable content.
- the-fir-tree: dry-run acceptance remains valid; first default part-001 Part 1; Preview is valid, book-specific, and starts from generated readable content.
- the-leap-frog: dry-run acceptance remains valid; first default part-001 Part 1; Preview is valid, book-specific, and starts from generated readable content.
- the-real-princess: dry-run acceptance remains valid; first default part-001 Part 1; Preview is valid, book-specific, and starts from generated readable content.
- the-secret-garden-gutenberg-113: dry-run acceptance remains valid; first default chapter-001 Chapter 1; Preview is valid, book-specific, and starts from generated readable content.
- the-shoes-of-fortune: dry-run acceptance remains valid; first default part-001 Part 1; Preview is valid, book-specific, and starts from generated readable content.
- wind-in-the-willows: dry-run acceptance remains valid; first default chapter-001 Chapter 1; Preview is valid, book-specific, and starts from generated readable content.

## Future Batch Rule

Future book batches fail unless every processed book has:
- valid generated readable content
- first default section from real readable content
- all main readable sections included by default
- valid book-specific startup preview
- no SOS Help!
- no generic preview fallback
- no title/TOC/source/license/contributor/transcriber material as default playback
