# japanese-fairy-tales

- Source: `app/client/assets/temp-books/Japanese Fairy Tales.txt`
- Title: Japanese Fairy Tales
- Author: Yei Theodora Ozaki
- Raw words: 74354
- Detected convention: story or titled-section headings
- Confidence: high (0.901)
- Recommended handling: process with warnings
- Fallback required: no
- Fallback reason: not required
- Fallback legitimacy: not required

## Candidate Patterns

| Pattern | Candidates | Body-like | TOC-like | Selected | Rejection reason |
| --- | ---: | ---: | ---: | --- | --- |
| all-caps-title | 58 | 30 | 28 | yes |  |
| isolated-title-case | 17 | 16 | 1 | no | weaker than selected strategy all-caps-title |
| special-front-back | 3 | 1 | 2 | no | weaker than selected strategy all-caps-title |

## Body Heading Examples

- L3: COMPILED BY
- L83: Y. T. O.
- L87: JAPANESE FAIRY TALES
- L90: MY LORD BAG OF RICE
- L332: THE TONGUE-CUT SPARROW
- L672: THE STORY OF URASHIMA TARO, THE FISHER LAD
- L1144: THE FARMER AND THE BADGER
- L1380: THE “SHINANSHA,” OR THE SOUTH POINTING CARRIAGE

## Rejected TOC-like Examples

- L13: JAPANESE FAIRY TALES
- L14: MY LORD BAG OF RICE
- L15: THE TONGUE-CUT SPARROW
- L16: THE STORY OF URASHIMA TARO, THE FISHER LAD
- L17: THE FARMER AND THE BADGER
- L18: THE “SHINANSHA,” OR THE SOUTH POINTING CARRIAGE
- L19: THE ADVENTURES OF KINTARO, THE GOLDEN BOY
- L20: THE STORY OF PRINCESS HASE. A STORY OF OLD JAPAN

## Section Size Sanity

- Sections: 30
- Min/median/max words: 2/2424/6324
- Notes: section sizes look plausible for the selected strategy

## Boundary Confidence

- Start: high
- End: high
- No cleaning warnings.

## Generated Comparison

- No existing generated manifest found for this slug.

## Red Flags

- None.
