# Startup Generated Content Fixes 1

Generated at: 2026-06-16T22:21:37.483Z

This targeted generated-content pass corrected only the six startup-preview audit failures. It did not process a new batch, did not touch raw source files, and did not touch Cloudflare exports.

## Summary

- Books reviewed: 6
- Books written: 6
- Books skipped: 0
- Preview assets updated: 6

## Books

| Slug | Result | Sections | First default after | Preview valid | Recommendation |
| --- | --- | ---: | --- | --- | --- |
| don-quixote | written | 127 | Chapter 1 - Which Treats Of The Character And Pursuits Of The Famous Gentleman Don Quixote Of La Mancha | yes | accepted for review |
| les-miserables | written | 364 | Chapter 1 - Book First-A Just Man - M Myriel | yes | accepted for review |
| sun-tzu-on-the-art-of-war | written | 15 | Chapter 1 - Laying Plans | yes | accepted for review |
| the-count-of-monte-cristo | written | 117 | Chapter 1 - Marseilles-The Arrival | yes | accepted for review |
| the-count-of-monte-cristo-gutenberg-1184 | written | 117 | Chapter 1 - Marseilles-The Arrival | yes | needs manual review |
| the-happy-family | written | 1 | Chapter 1 - The Happy Family | yes | accepted for review |

## don-quixote

- Written or skipped: written
- Source file used: app/client/assets/temp-books/Don Quixote.txt
- Prior startup audit issue: recommendation: generated book needs processing correction later | first default: chapter-001 Chapter 3 (80 words) | warnings: Preview asset content hash/version is stale.; chapter-001 is labeled Chapter 3, which suggests chapter order damage.
- Real start boundary used: line 2666: CHAPTER I.
- Real end boundary used: line 42939: *** END OF THE PROJECT GUTENBERG EBOOK DON QUIXOTE ***
- Selected structural convention: two-volume chapter sequence with roman-numeral chapter headings
- First default before correction: Chapter 3 (80 words)
- First default after correction: Chapter 1 - Which Treats Of The Character And Pursuits Of The Famous Gentleman Don Quixote Of La Mancha (2030 words)
- Section count: 127
- Preview asset updated: yes
- Startup preview now valid: yes
- Remaining warnings: none
- Final recommendation: accepted for review

First five sections:
- Introduction - Introduction Prefatory: 20413 words
- Chapter 1 - Which Treats Of The Character And Pursuits Of The Famous Gentleman Don Quixote Of La Mancha: 2030 words
- Chapter 2 - Which Treats Of The First Sally The Ingenious Don Quixote Made From Home: 2368 words
- Chapter 3 - Wherein Is Related The Droll Way In Which Don Quixote Had Himself Dubbed A Knight: 2523 words
- Chapter 4 - Of What Happened To Our Knight When He Left The Inn: 2604 words

Last five sections:
- Chapter 122 - Which Follows Sixty-Nine And Deals With Matters Indispensable For The Clear Comprehension Of This History: 2873 words
- Chapter 123 - Of What Passed Between Don Quixote And His Squire Sancho On The Way To Their Village: 2355 words
- Chapter 124 - Of How Don Quixote And Sancho Reached Their Village: 1876 words
- Chapter 125 - Of The Omens Don Quixote Had As He Entered His Own Village, And Other Incidents That Embellish And Give A Colour To This Great History: 1889 words
- Chapter 126 - Of How Don Quixote Fell Sick, And Of The Will He Made, And How He Died: 2694 words

Cleanup actions applied:
- excluded editor notes, title material, and table of contents from playable defaults
- restarted generated defaults at the first real Chapter I body heading
- preserved sequential chapter defaults without the stale Chapter 3 startup
- removed illustration/image marker lines from generated playable text
- normalized Morse source punctuation and diacritics for playback while preserving display prose

## les-miserables

- Written or skipped: written
- Source file used: app/client/assets/temp-books/Les Misérables.txt
- Prior startup audit issue: recommendation: generated book needs processing correction later | first default: chapter-001 Chapter 4 (20954 words) | warnings: Preview asset content hash/version is stale.; chapter-001 is labeled Chapter 4, which suggests chapter order damage.
- Real start boundary used: line 1117: CHAPTER I—M. MYRIEL
- Real end boundary used: line 73240: *** END OF THE PROJECT GUTENBERG EBOOK LES MISÉRABLES ***
- Selected structural convention: volume/book/chapter hierarchy with roman-numeral chapter headings
- First default before correction: Chapter 4 (20954 words)
- First default after correction: Chapter 1 - Book First-A Just Man - M Myriel (1057 words)
- Section count: 364
- Preview asset updated: yes
- Startup preview now valid: yes
- Remaining warnings: none
- Final recommendation: accepted for review

First five sections:
- Preface - Preface: 114 words
- Chapter 1 - Book First-A Just Man - M Myriel: 1057 words
- Chapter 2 - M Myriel Becomes M Welcome: 1748 words
- Chapter 3 - A Hard Bishopric For A Good Bishop: 774 words
- Chapter 4 - Works Corresponding To Words: 2922 words

Last five sections:
- Chapter 359 - Last Flickerings Of A Lamp Without Oil: 623 words
- Chapter 360 - A Pen Is Heavy To The Man Who Lifted The Fauchelevent’S: 1126 words
- Chapter 361 - A Bottle Of Ink Which Only Succeeded In Whitening: 6983 words
- Chapter 362 - A Night Behind Which There Is Day: 3857 words
- Chapter 363 - The Grass Covers And The Rain Effaces: 3523 words

Cleanup actions applied:
- excluded title pages, illustration list, and table of contents from playable defaults
- restarted generated defaults at Volume I, Book First, Chapter I body content
- kept volume and book context in section titles instead of selecting front matter
- removed image marker lines from generated playable text
- normalized Morse source punctuation and diacritics for playback while preserving display prose

## sun-tzu-on-the-art-of-war

- Written or skipped: written
- Source file used: app/client/assets/temp-books/Sun Tzŭ on the Art of War.txt
- Prior startup audit issue: recommendation: generated book needs processing correction later | first default: chapter-001 Chapter 28 (4623 words) | warnings: Preview asset content hash/version is stale.; chapter-001 is labeled Chapter 28, which suggests chapter order damage.
- Real start boundary used: line 1443: I. 計篇
- Real end boundary used: line 9093: CHINESE CONCORDANCE
- Selected structural convention: thirteen numbered treatise chapters followed by concordance/index end matter
- First default before correction: Chapter 28 (4623 words)
- First default after correction: Chapter 1 - Laying Plans (2109 words)
- Section count: 15
- Preview asset updated: yes
- Startup preview now valid: yes
- Remaining warnings: none
- Final recommendation: accepted for review

First five sections:
- Preface - Preface: 1097 words
- Introduction - Sun Wu And His Book: 11768 words
- Chapter 1 - Laying Plans: 2109 words
- Chapter 2 - Waging War: 2404 words
- Chapter 3 - Attack By Stratagem: 2675 words

Last five sections:
- Chapter 9 - The Army On The March: 6232 words
- Chapter 10 - Terrain: 3888 words
- Chapter 11 - The Nine Situations: 12007 words
- Chapter 12 - The Attack By Fire: 3311 words
- Chapter 13 - The Use Of Spies: 4932 words

Cleanup actions applied:
- excluded transcriber note, title material, contents, preface, and introduction from playable defaults
- restarted generated defaults at treatise chapter I, Laying Plans
- stopped generated playable content before Chinese concordance and index end matter
- normalized Morse source punctuation, diacritics, and unsupported heading glyphs for playback

## the-count-of-monte-cristo

- Written or skipped: written
- Source file used: app/client/assets/temp-books/The Count of Monte Cristo.txt
- Prior startup audit issue: recommendation: generated book needs processing correction later | first default: chapter-001 Chapter 116 - The Pardon (4 words) | warnings: Preview asset content hash/version is stale.; First default section does not look like readable book content.; chapter-001 is labeled Chapter 116, which suggests chapter order damage.
- Real start boundary used: line 176: Chapter 1. Marseilles—The Arrival
- Real end boundary used: line 61330: *** END OF THE PROJECT GUTENBERG EBOOK THE COUNT OF MONTE CRISTO ***
- Selected structural convention: 117 Arabic-numbered chapters after title/contents front matter
- First default before correction: Chapter 116 - The Pardon (4 words)
- First default after correction: Chapter 1 - Marseilles-The Arrival (3137 words)
- Section count: 117
- Preview asset updated: yes
- Startup preview now valid: yes
- Remaining warnings: none
- Final recommendation: accepted for review

First five sections:
- Chapter 1 - Marseilles-The Arrival: 3137 words
- Chapter 2 - Father And Son: 2496 words
- Chapter 3 - The Catalans: 3886 words
- Chapter 4 - Conspiracy: 2212 words
- Chapter 5 - The Marriage Feast: 5521 words

Last five sections:
- Chapter 113 - The Past: 4226 words
- Chapter 114 - Peppino: 3721 words
- Chapter 115 - Luigi Vampa’S Bill Of Fare: 2163 words
- Chapter 116 - The Pardon: 1721 words
- Chapter 117 - The Fifth Of October: 5443 words

Cleanup actions applied:
- excluded title page and contents from playable defaults
- restarted generated defaults at Chapter 1, Marseilles-The Arrival
- repaired stale Chapter 116/117 boundary damage that swallowed earlier chapters
- normalized Morse source punctuation and diacritics for playback while preserving display prose

## the-count-of-monte-cristo-gutenberg-1184

- Written or skipped: written
- Source file used: app/client/assets/temp-books/The Count of Monte Cristo.txt (declared app/client/assets/temp-books/the-count-of-monte-cristo.txt was missing)
- Prior startup audit issue: recommendation: generated book needs processing correction later | first default: chapter-001 Chapter 116 - The Pardon (4 words) | warnings: Preview asset content hash/version is stale.; First default section does not look like readable book content.; chapter-001 is labeled Chapter 116, which suggests chapter order damage.
- Real start boundary used: line 176: Chapter 1. Marseilles—The Arrival
- Real end boundary used: line 61330: *** END OF THE PROJECT GUTENBERG EBOOK THE COUNT OF MONTE CRISTO ***
- Selected structural convention: duplicate Gutenberg 1184 generated route using the 117-chapter Count of Monte Cristo source
- First default before correction: Chapter 116 - The Pardon (4 words)
- First default after correction: Chapter 1 - Marseilles-The Arrival (3137 words)
- Section count: 117
- Preview asset updated: yes
- Startup preview now valid: yes
- Remaining warnings: Declared source candidate app/client/assets/temp-books/the-count-of-monte-cristo.txt was missing; used app/client/assets/temp-books/The Count of Monte Cristo.txt.
- Final recommendation: needs manual review

First five sections:
- Chapter 1 - Marseilles-The Arrival: 3137 words
- Chapter 2 - Father And Son: 2496 words
- Chapter 3 - The Catalans: 3886 words
- Chapter 4 - Conspiracy: 2212 words
- Chapter 5 - The Marriage Feast: 5521 words

Last five sections:
- Chapter 113 - The Past: 4226 words
- Chapter 114 - Peppino: 3721 words
- Chapter 115 - Luigi Vampa’S Bill Of Fare: 2163 words
- Chapter 116 - The Pardon: 1721 words
- Chapter 117 - The Fifth Of October: 5443 words

Cleanup actions applied:
- used the canonical temp-books Count of Monte Cristo raw source because the duplicate metadata raw filename is absent
- excluded title page and contents from playable defaults
- restarted generated defaults at Chapter 1, Marseilles-The Arrival
- repaired stale Chapter 116/117 boundary damage that swallowed earlier chapters
- normalized Morse source punctuation and diacritics for playback while preserving display prose

## the-happy-family

- Written or skipped: written
- Source file used: app/client/assets/temp-books/The Happy Family.txt
- Prior startup audit issue: recommendation: generated book needs processing correction later | first generated section: part-001 Part 1 (29 words) | warnings: Preview asset content hash/version is stale.; No main readable sections are included by default.; Generated content is a placeholder rather than source body text.
- Real start boundary used: line 44: Really, the largest green leaf in this country is a dock-leaf; if one
- Real end boundary used: line 175: End of Project Gutenberg's Andersen's Fairy Tales, by Hans Christian Andersen
- Selected structural convention: single short story bounded before Project Gutenberg footer
- First default before correction: Part 1 (29 words)
- First default after correction: Chapter 1 - The Happy Family (1307 words)
- Section count: 1
- Preview asset updated: yes
- Startup preview now valid: yes
- Remaining warnings: none
- Final recommendation: accepted for review

First five sections:
- Chapter 1 - The Happy Family: 1307 words

Last five sections:
- Chapter 1 - The Happy Family: 1307 words

Cleanup actions applied:
- replaced placeholder generated content with the real short-story body from the source file
- excluded Project Gutenberg footer/license material from playable defaults
- normalized Morse source punctuation and diacritics for playback while preserving display prose
