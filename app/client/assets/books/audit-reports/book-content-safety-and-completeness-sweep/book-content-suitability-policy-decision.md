# Book Content Suitability Policy Decision

Executive result: Ready for owner upload review under a sanitized historical-library policy; not approved as all-audience/classroom-safe by default.

## 1. Executive result

Ready for owner upload review under a sanitized historical-library policy; not approved as all-audience/classroom-safe by default.

## 2. Normal policy result

The normal policy keeps all 519 sanitized public-domain books live. Deterministic unsafe-term findings are 0, owner-review blockers are 0, and deferral/removal recommendations are 0.

## 3. Strict classroom/youth policy result

Strict classroom/younger-user mode flagged 429 books for owner review. That mode is intentionally broader than the normal public-domain library policy and does not support presenting all 519 books as youth-safe by default.

## 4. Why the current 519-book set is not all-audience safe by default

- The second-pass audit found 421 age/audience concern records after deterministic cleanup.
- Normal post-cleanup risk levels include 110 elevated books and 311 moderate books.
- Strict mode flagged 429 books for classroom/younger-user review, including many public-domain classics with violence, period language, stereotypes, horror intensity, or mature themes.
- The audit cleared the books under a sanitized historical-library policy, not under a classroom/youth-safe content policy.
- The audit is rule-based and source-derived; it is not a substitute for a human age-rating review.

## 5. Options considered

| Option | Summary | Status |
| --- | --- | --- |
| Option A | Keep all 519 books, but label the library as public-domain/historical and not guaranteed youth/classroom-safe. | Acceptable as a minimal policy if the owner wants all books live without filtering, but it gives users less control than Option B. |
| Option B | Keep all 519 books, add content suitability labels/notes and a lower-risk listing filter. | Recommended and implemented in this branch as the safest minimal product behavior. |
| Option C | Defer strict-mode candidates from the public index, leaving only lower-risk books live. | Not implemented. It would remove or hide 429 books and needs explicit owner policy approval. |
| Option D | Manually review strict-mode candidates before upload. | Valid for a stricter classroom/youth-safe policy, but not completed in this branch. |

## 6. Recommended product policy

Option B: keep the sanitized historical public-domain library, show suitability notes on book/audiobook/print surfaces, provide a lower-risk filter on library listings, and avoid all-audience/classroom-safe claims.

## 7. Books affected by strict-mode review

Strict mode flagged 429 books. The table lists the highest-priority candidates without graphic excerpts or uncensored offensive terms.

| Slug | Normal risk | Strict-mode reasons | Known-risk groups |
| --- | --- | --- | --- |
| don-quixote | elevated | horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | colonial-adventure-travel, deterministic-sweep-changed, high-horror-signal, period-language-risk, war-crime-conflict |
| les-miserables | elevated | horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | colonial-adventure-travel, deterministic-sweep-changed, high-horror-signal, war-crime-conflict |
| middlemarch | elevated | horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | deterministic-sweep-changed, high-horror-signal, period-language-risk, war-crime-conflict |
| the-count-of-monte-cristo | elevated | horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | deterministic-sweep-changed, high-horror-signal, period-language-risk, war-crime-conflict |
| candide | elevated | horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | colonial-adventure-travel, deterministic-sweep-changed, high-horror-signal, period-language-risk, satire-political-philosophical, war-crime-conflict |
| gulliver-s-travels | elevated | horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | colonial-adventure-travel, deterministic-sweep-changed, high-horror-signal, period-language-risk, satire-political-philosophical, war-crime-conflict |
| the-brothers-karamazov | elevated | horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | deterministic-sweep-changed, high-horror-signal, war-crime-conflict |
| the-count-of-monte-cristo-gutenberg-1184 | elevated | horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | deterministic-sweep-changed, high-horror-signal, war-crime-conflict |
| moby-dick | elevated | horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | deterministic-sweep-changed, high-horror-signal, period-language-risk, war-crime-conflict |
| the-king-in-yellow | elevated | horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | colonial-adventure-travel, deterministic-sweep-changed, high-horror-signal, lovecraft-and-early-horror, period-language-risk, war-crime-conflict |
| jane-eyre | elevated | horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | high-horror-signal, period-language-risk, war-crime-conflict |
| grimm-s-fairy-tales | elevated | children's/classroom suitability review candidate; fairy-tale/folklore suitability review candidate; horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | deterministic-sweep-changed, folklore-fairy-tale-myth, high-horror-signal, older-childrens-literature, war-crime-conflict |
| the-arabian-nights | elevated | fairy-tale/folklore suitability review candidate; horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | colonial-adventure-travel, deterministic-sweep-changed, folklore-fairy-tale-myth, high-horror-signal, war-crime-conflict |
| the-case-of-charles-dexter-ward | elevated | horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | colonial-adventure-travel, deterministic-sweep-changed, high-horror-signal, lovecraft-and-early-horror, war-crime-conflict |
| treasure-island | elevated | horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | colonial-adventure-travel, deterministic-sweep-changed, high-horror-signal, period-language-risk, war-crime-conflict |
| romeo-and-juliet | elevated | horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | deterministic-sweep-changed, war-crime-conflict |
| the-three-musketeers | elevated | horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | deterministic-sweep-changed, high-horror-signal, period-language-risk, war-crime-conflict |
| wuthering-heights | elevated | horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | deterministic-sweep-changed, high-horror-signal, period-language-risk, war-crime-conflict |
| the-water-babies | elevated | children's/classroom suitability review candidate; fairy-tale/folklore suitability review candidate; horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | deterministic-sweep-changed, folklore-fairy-tale-myth, older-childrens-literature, period-language-risk, war-crime-conflict |
| hero-myths-and-legends-of-the-british-race | elevated | fairy-tale/folklore suitability review candidate; horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | colonial-adventure-travel, folklore-fairy-tale-myth, high-horror-signal, war-crime-conflict |
| violet-fairy-book | elevated | children's/classroom suitability review candidate; fairy-tale/folklore suitability review candidate; horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | colonial-adventure-travel, folklore-fairy-tale-myth, high-horror-signal, older-childrens-literature, period-language-risk |
| the-adventures-of-roderick-random | elevated | horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | deterministic-sweep-changed, high-horror-signal, war-crime-conflict |
| the-federalist-papers | elevated | horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | colonial-adventure-travel, deterministic-sweep-changed, period-language-risk, satire-political-philosophical, war-crime-conflict |
| the-oblong-box | elevated | horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | colonial-adventure-travel, deterministic-sweep-changed, lovecraft-and-early-horror, period-language-risk, war-crime-conflict |
| five-weeks-in-a-balloon | elevated | horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | colonial-adventure-travel, deterministic-sweep-changed, high-horror-signal, period-language-risk, war-crime-conflict |
| the-life-and-adventures-of-robinson-crusoe | elevated | horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | colonial-adventure-travel, deterministic-sweep-changed, high-horror-signal, period-language-risk, war-crime-conflict |
| the-scarlet-letter | elevated | horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | colonial-adventure-travel, high-horror-signal, war-crime-conflict |
| macbeth | elevated | horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | deterministic-sweep-changed, high-horror-signal, period-language-risk, war-crime-conflict |
| the-buccaneer | elevated | horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | high-horror-signal, war-crime-conflict |
| the-history-of-sir-richard-calmady-a-romance | moderate | horror/violence intensity above a stricter classroom threshold; multiple medium-risk categories; one or more high-risk categories after deterministic cleanup; persistent historical stereotype or period-language concern | colonial-adventure-travel, deterministic-sweep-changed, high-horror-signal, war-crime-conflict |

## 8. Product changes needed before upload

- Implemented in this branch: show content-suitability notes on book detail, audiobook detail, and printable book pages.
- Implemented in this branch: show compact suitability labels on book and audiobook listing cards.
- Implemented in this branch: provide a lower-risk listing filter that hides elevated/strict-review books.
- Implemented in this branch: include suitability fields in the regenerated full replacement Cloudflare updated export.
- Implemented in this branch: update Sources copy so the library is described as historical public-domain content, not all-audience safe by default.

## 9. Upload recommendation

Upload can proceed only under the sanitized historical-library policy after owner review of this decision packet. Do not describe the 519-book set as classroom/youth-safe by default. A stricter classroom policy would require owner review or deferral of strict-mode candidates before upload.

## 10. Remaining owner decision points

- Decide whether the site policy is sanitized historical-library (implemented here) or stricter classroom/youth-safe.
- If the owner wants classroom/youth-safe by default, choose between manually reviewing strict-mode candidates or deferring them from public index/export.
- After upload, rerun production content-safety and payload validation against https://assets.morsewords.com.
