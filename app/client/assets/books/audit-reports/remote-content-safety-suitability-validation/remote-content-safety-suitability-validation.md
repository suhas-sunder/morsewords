# Remote content-safety and suitability validation

## 1. Executive result

Remote content-safety and suitability validation blocked because /morse-code-books/walden/print returned HTTP 500

## 2. Main commit checked

- caff234d8e0a472bb1c33f6b3f750e9ed1117d1a

## 3. Asset host checked

- https://assets.morsewords.com

## 4. Remote manifest result

- Status: pass
- Remote public-manifest.json and upload-manifest.json are reachable.
- Both remote manifests match the uploaded export content hash.
- Public manifest URL: https://assets.morsewords.com/public-manifest.json
- Upload manifest URL: https://assets.morsewords.com/upload-manifest.json
- Remote manifest books: 519
- Remote upload-manifest files: 521

## 5. Remote payload count result

- Status: pass
- All 519 remote book payloads are reachable and match the uploaded export metadata.
- Expected book payloads: 519
- Reachable book payloads: 519
- Missing expected slugs: 0
- Extra remote slugs: 0

## 6. Remote suitability metadata result

- Status: pass
- Remote manifests and payloads include suitability metadata.
- Suitability counts match expected low/moderate/elevated totals.
- Strict-review candidate metadata is present and matches expected count.
- Low: 98
- Moderate: 311
- Elevated: 110
- Strict-review candidates: 429

## 7. Remote content-safety result

- Status: pass
- Deterministic unsafe findings remaining are 0 by sanitized-export parity.
- All safety-sweep changed payloads match the uploaded sanitized export and do not match the prior export hash.
- Deterministic unsafe findings remaining: 0
- Changed books checked: 91
- Safe replacement occurrences: 425
- Stale changed payloads remaining: 0

## 8. The Call of Cthulhu owner-reported case result

- Status: pass
- The Call of Cthulhu remote payload matches the sanitized uploaded export.
- owner-reported masked racial identity label was sanitized in generated text and previews
- Slug: the-call-of-cthulhu
- Remote URL: https://assets.morsewords.com/books/the-call-of-cthulhu.json

## 9. Changed-books remote verification result

- Status: pass
- All changed books from the safety sweep resolve to the uploaded sanitized export remotely.
- No changed-book payload still matches the prior export hash.
- Changed books checked: 91
- Matching updated export: 91
- Still matching prior export: 0

## 10. Production UI suitability label/filter result

- Status: blocked
- /morse-code-books/walden/print returned HTTP 500
- Sampled routes: 8

## 11. Production full-payload hydration result

- Status: pass
- Sampled production detail and audiobook pages requested full payloads from https://assets.morsewords.com.
- Full payload hydration completed and no sampled live page showed unavailable-book text.
- Sampled routes: 5

## 12. Policy statement verification

- Status: blocked
- /morse-code-books/walden/print returned HTTP 500
- Option B: keep the sanitized historical public-domain library, show suitability notes on book/audiobook/print surfaces, provide a lower-risk filter on library listings, and avoid all-audience/classroom-safe claims.
- All-audience safety is not supported by this validation.
- Classroom/youth-safe-by-default status is not supported by this validation.

## 13. Files intentionally not tracked

- app/client/assets/books/cloudflare-export
- app/client/assets/books/cloudflare-updated-export
- app/client/assets/temp-books
- public/book-previews
- app/client/assets/books/generated

## 14. Remaining blockers

- /morse-code-books/walden/print returned HTTP 500

## 15. Next step

- Remote asset validation passed. Production print-route validation was blocked by a live 500 on /morse-code-books/walden/print. A targeted print-route fix and local regression coverage were added. Production revalidation is required after this branch is merged and deployed.
