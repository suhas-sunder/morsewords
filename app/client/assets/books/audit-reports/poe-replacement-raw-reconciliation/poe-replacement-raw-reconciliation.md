# Poe Replacement Raw Reconciliation

## Counts

- Previous generated count: 465
- New generated count: 488
- Previous SEO summary count: 465
- Summaries removed with broad Poe entries: 0
- Summaries added for new Poe entries: 23
- New SEO summary count: 488
- Missing summaries after branch: 0

## Broad Poe Collections

- Found in generated output: none
- Removed from generated output: none
- Raw broad collection files absent from current temp-books: The Works of Edgar Allan Poe.txt, The Works of Edgar Allan Poe, The Raven Edition.txt

## New Poe Stories

- a-descent-into-the-maelstrom: A Descent into the Maelstrom
- berenice: Berenice
- hop-frog: Hop-Frog
- ligeia: Ligeia
- morella: Morella
- ms-found-in-a-bottle: MS. Found in a Bottle
- some-words-with-a-mummy: Some Words with a Mummy
- the-black-cat: The Black Cat
- the-cask-of-amontillado: The Cask of Amontillado
- the-facts-in-the-case-of-m-valdemar: The Facts in the Case of M. Valdemar
- the-fall-of-the-house-of-usher: The Fall of the House of Usher
- the-man-of-the-crowd: The Man of the Crowd
- the-murders-in-the-rue-morgue: The Murders in the Rue Morgue
- the-oblong-box: The Oblong Box
- the-oval-portrait: The Oval Portrait
- the-pit-and-the-pendulum: The Pit and the Pendulum
- the-premature-burial: The Premature Burial
- the-purloined-letter: The Purloined Letter
- the-sphinx: The Sphinx
- the-system-of-doctor-tarr-and-professor-fether: The System of Doctor Tarr and Professor Fether
- the-tell-tale-heart: The Tell-Tale Heart
- thou-art-the-man: Thou Art the Man
- william-wilson: William Wilson

## Already Present

- the-masque-of-the-red-death: The Masque of the Red Death

## Skipped Or Manual Review

- None

## Preview Policy

- New/changed preview policy: starter text only, roughly around 1 KB where practical.
- Existing preview/loading architecture blocker: yes
- Blocker note: Existing broad preview builder/audit defaults still target long local previews (3600 seconds). This branch writes small starter previews only for new Poe entries and does not rewrite the global preview/loading architecture.

## Checkpoints

- Remaining raw-candidate checkpoint: 44 prior tracked raw candidates still require later review after the two broad Poe collection raw files were removed from current temp-books; newly accepted Poe individual stories are generated in this branch.
- Unresolved-source generated-book checkpoint: 11 unresolved-source generated books remain documented and were not processed in this branch.
- URL/page/indexability blocker: URL/page/indexability/planned-page implementation remains a final-release blocker; no planned URL policy work was started.
- Cloudflare export checkpoint: Cloudflare export was not run and app/client/assets/books/cloudflare-export remains outside this branch's changes.
- Mobile final-stage checkpoint: Broad mobile optimization remains the very last stage and was not started.

## Recommended Next Major Phase

Do not start export yet. Next major phase should handle remaining raw-candidate review and unresolved-source generated-book review.

## Validation Results

- Status: pass
- Route/UI checks: pass. The new Tell-Tale Heart book page renders, its summary appears below Source notes, the small starter preview is visible, the book and audiobook indexes show 488 items, and mobile checks found no horizontal overflow.
- New Poe audiobook behavior: `/morse-code-audiobooks/the-tell-tale-heart` is deferred and shows the expected not-available-right-now public export state until Cloudflare export is run.
- Typecheck: pass
- SEO summary audit: pass, 488/488 summaries
- Startup preview audit: pass, 488 valid and 0 preview updates
- Independent second-pass audit: pass, 0 fail-needs-fix
- Linking/sitemap audit: pass, 488 book URLs, 488 audiobook URLs, 0 orphans, 0 broken internal links
- Test suite: pass, 23/23 after stopping the local browser-check server that occupied port 3101
- Netlify build: pass
- Dedicated Morse book Playwright: pass, 38/38 after updating stale 465-count expectations and the preview-fallback assertion
- `git diff --check`: pass with line-ending warnings only
- Title/start/default audit note: pass; the audit produced 12 unrelated generated/preview corrections, and those were restored before staging.
- Protected folders: `temp-books` clean, `cloudflare-export` clean, generated changes limited to the manifest and 23 new Poe story directories, previews limited to the manifest and 23 new small starter previews.
- Cloudflare oversized payload note: no validation or route/UI failure was attributed to an oversized Cloudflare-loaded file.
