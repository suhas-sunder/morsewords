# sun-tzu-on-the-art-of-war

- Source: `app/client/assets/temp-books/Sun Tzŭ on the Art of War.txt`
- Title: Sun Tzŭ on the Art of War: The Oldest Military Treatise in the World
- Author: active 6th century B.C. Sunzi
- Raw words: 86349
- Detected convention: arabic-numbered titled sections
- Confidence: high (0.992)
- Recommended handling: needs manual sectioning review
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| arabic-numbered-title | 414 | 360 | 54 | yes |  |
| all-caps-title | 510 | 509 | 1 | no | weaker than selected strategy arabic-numbered-title |
| roman-numbered-title | 46 | 46 | 0 | no | weaker than selected strategy arabic-numbered-title |
| arabic-only | 16 | 15 | 1 | no | weaker than selected strategy arabic-numbered-title |
| isolated-title-case | 81 | 60 | 21 | no | weaker than selected strategy arabic-numbered-title |
| special-front-back | 4 | 2 | 2 | no | weaker than selected strategy arabic-numbered-title |
| roman-only | 1 | 1 | 0 | no | weaker than selected strategy arabic-numbered-title |

## Body Heading Examples

- L862: 1. 曹操 Ts‘ao Ts‘ao or 曹公 Ts‘ao Kung, afterwards known as 魏武帝 Wei
- L887: 2. 孟氏 Mêng Shih. The commentary which has come down to us under this
- L898: 3. 李筌 Li Ch‘üan of the 8th century was a well-known writer on
- L909: 4. 杜佑 Tu Yu (died 812) did not publish a separate commentary on Sun
- L921: 5. 杜牧 Tu Mu (803–852) is perhaps best known as a poet—a bright star
- L936: 6. 陳皥 Ch‘ên Hao appears to have been a contemporary of Tu Mu. Ch‘ao
- L946: 7. 賈林 Chia Lin is known to have lived under the T‘ang dynasty, for
- L952: 8. 梅堯臣 Mei Yao-ch‘ên (1002–1060), commonly known by his “style”

## Rejected TOC-like Examples

- L1411: 1. 孫子曰兵者國之大事
- L1415: 2. 死生之地存亡之道不可不察也
- L1420: 3. 故經之以五校之以計而索其情
- L1442: 4. 一曰道二曰天三曰地四曰將五曰法
- L1452: 5. 道者令民與上同意也
- L1454: 6. 故可與之死可與之生而民不畏危
- L1466: 7. 天者陰陽寒暑時制也
- L1477: 8. 地者遠近險易廣狹死生也

## Section Size Sanity

- Sections: 360
- Min/median/max words: 10/103/13237
- Notes: many very small sections; headings may include TOC, captions, or fragments; largest section is much bigger than the median section

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- Manifest: `app/client/assets/books/generated/sun-tzu-on-the-art-of-war/manifest.json`
- Sections: 7
- Included sections: 1
- Rights have not been reviewed; generated book is not publish-ready.
- Rights basis "unknown" is not publish-ready.
- Rights gate status is needs_manual_review; generated book is not publish-ready.
- Rights gate did not allow processed public story output.
- Owner-reviewed website approval is missing.
- Website publication is not allowed by the active approval path.
- existing generated output section count is far below likely raw body heading count (7 vs 360)

## Red Flags

- generated output likely collapsed real structure
