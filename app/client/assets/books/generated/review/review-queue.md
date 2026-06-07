# Morse book manual review queue

## Summary

- Total books: 74
- Approved: 16
- Needs manual review: 51
- Rejected: 7
- Processing allowed: 16
- Processing blocked: 58
- Missing author death year: 11
- Translator/editor/intro review: 9
- Duplicate Gutenberg group books: 14
- Approval candidates: 37

## Manual Workflow

1. Run npm run books:review-queue.
2. Fill approved people metadata only after manual verification.
3. Fix duplicate Gutenberg ID metadata manually.
4. Run npm run books:rights-report.
5. Run npm run books:build.
6. Only approved and processing_allowed books can become public.

## Queue

- a-childs-garden-of-verses: reject; processing blocked; next: Reject or remove modern/permission-based text.
- a-christmas-carol: needs_manual_review; processing blocked; next: Add original publication metadata.
- a-princess-of-mars: needs_manual_review; processing blocked; next: Add original publication metadata.
- alices-adventures-in-wonderland: needs_manual_review; processing blocked; next: Review illustration/image references.
- anna-karenina: needs_manual_review; processing blocked; next: Add original publication metadata.
- anne-of-green-gables: approved; processing allowed; next: Review duplicate Gutenberg ID group.
- anne-of-green-gables-gutenberg-45: needs_manual_review; processing blocked; next: Review duplicate Gutenberg ID group.
- around-the-world-in-eighty-days: needs_manual_review; processing blocked; next: Add original publication metadata.
- black-beauty: needs_manual_review; processing blocked; next: Add original publication metadata.
- botchan: needs_manual_review; processing blocked; next: Add original publication metadata.
- candide: needs_manual_review; processing blocked; next: Check editor/introduction author identity and death year.
- crime-and-punishment: approved; processing allowed; next: Manual final approval required before any public exposure.
- doctor-dolittle: reject; processing blocked; next: Reject or remove modern/permission-based text.
- don-quixote: needs_manual_review; processing blocked; next: Check editor/introduction author identity and death year.
- dr-jekyll-and-mr-hyde: approved; processing allowed; next: Manual final approval required before any public exposure.
- dracula: reject; processing blocked; next: Reject or remove modern/permission-based text.
- five-little-peppers-and-how-they-grew: needs_manual_review; processing blocked; next: Add original publication metadata.
- frankenstein: approved; processing allowed; next: Manual final approval required before any public exposure.
- grimm-s-fairy-tales: needs_manual_review; processing blocked; next: Check translator identity and death year.
- gulliver-s-travels: approved; processing allowed; next: Manual final approval required before any public exposure.
- heidi: needs_manual_review; processing blocked; next: Add original publication metadata.
- jabberwocky: needs_manual_review; processing blocked; next: Add original publication metadata.
- jack-and-jill: needs_manual_review; processing blocked; next: Add original publication metadata.
- jane-eyre: needs_manual_review; processing blocked; next: Add original publication metadata.
- les-miserables: needs_manual_review; processing blocked; next: Add original publication metadata.
- little-women: needs_manual_review; processing blocked; next: Check editor/introduction author identity and death year.
- new-treasure-seekers: needs_manual_review; processing blocked; next: Add original publication metadata.
- nights-with-uncle-remus: reject; processing blocked; next: Reject or remove modern/permission-based text.
- peter-pan: needs_manual_review; processing blocked; next: Add original publication metadata.
- pride-and-prejudice: needs_manual_review; processing blocked; next: Add original publication metadata.
- rainbow-valley: needs_manual_review; processing blocked; next: Add original publication metadata.
- rinkitink-in-oz: needs_manual_review; processing blocked; next: Add original publication metadata.
- sense-and-sensibility: needs_manual_review; processing blocked; next: Add original publication metadata.
- sun-tzu-on-the-art-of-war: needs_manual_review; processing blocked; next: Add approved author death year metadata.
- tarzan-of-the-apes: needs_manual_review; processing blocked; next: Add original publication metadata.
- the-arabian-nights: needs_manual_review; processing blocked; next: Add approved author death year metadata.
- the-art-of-war: needs_manual_review; processing blocked; next: Add approved author death year metadata.
- the-bell: needs_manual_review; processing blocked; next: Review duplicate Gutenberg ID group.
- the-book-of-dragons: needs_manual_review; processing blocked; next: Add original publication metadata.
- the-call-of-cthulhu: needs_manual_review; processing blocked; next: Review content-brand safety before education use.
- the-call-of-the-wild: approved; processing allowed; next: Manual final approval required before any public exposure.
- the-count-of-monte-cristo: needs_manual_review; processing blocked; next: Review duplicate Gutenberg ID group.
- the-count-of-monte-cristo-gutenberg-1184: needs_manual_review; processing blocked; next: Review duplicate Gutenberg ID group.
- the-divine-comedy: needs_manual_review; processing blocked; next: Add original publication metadata.
- the-elderbush: needs_manual_review; processing blocked; next: Review duplicate Gutenberg ID group.
- the-elements-of-style: needs_manual_review; processing blocked; next: Add original publication metadata.
- the-emerald-city-of-oz: approved; processing allowed; next: Manual final approval required before any public exposure.
- the-emperor-s-new-clothes: needs_manual_review; processing blocked; next: Review duplicate Gutenberg ID group.
- the-federalist-papers: needs_manual_review; processing blocked; next: Check editor/introduction author identity and death year.
- the-fir-tree: needs_manual_review; processing blocked; next: Review duplicate Gutenberg ID group.
- the-great-gatsby: approved; processing allowed; next: Manual final approval required before any public exposure.
- the-happy-family: reject; processing blocked; next: Keep blocked until the rejection reason is manually resolved.
- the-jungle-book: approved; processing allowed; next: Manual final approval required before any public exposure.
- the-leap-frog: needs_manual_review; processing blocked; next: Review duplicate Gutenberg ID group.
- the-legend-of-sleepy-hollow: needs_manual_review; processing blocked; next: Add original publication metadata.
- the-old-house: needs_manual_review; processing blocked; next: Review duplicate Gutenberg ID group.
- the-picture-of-dorian-gray: approved; processing allowed; next: Manual final approval required before any public exposure.
- the-princess-and-the-goblin: approved; processing allowed; next: Manual final approval required before any public exposure.
- the-railway-children: approved; processing allowed; next: Manual final approval required before any public exposure.
- the-real-princess: needs_manual_review; processing blocked; next: Review duplicate Gutenberg ID group.
- the-sea-wolf: approved; processing allowed; next: Manual final approval required before any public exposure.
- the-secret-garden: reject; processing blocked; next: Reject or remove modern/permission-based text.
- the-secret-garden-gutenberg-113: approved; processing allowed; next: Manual final approval required before any public exposure.
- the-shoes-of-fortune: needs_manual_review; processing blocked; next: Review duplicate Gutenberg ID group.
- the-snow-queen: needs_manual_review; processing blocked; next: Review duplicate Gutenberg ID group.
- the-swineherd: needs_manual_review; processing blocked; next: Review duplicate Gutenberg ID group.
- the-thirty-nine-steps: needs_manual_review; processing blocked; next: Add original publication metadata.
- the-three-musketeers: approved; processing allowed; next: Manual final approval required before any public exposure.
- the-water-babies: needs_manual_review; processing blocked; next: Add original publication metadata.
- the-wonderful-wizard-of-oz: needs_manual_review; processing blocked; next: Add original publication metadata.
- through-the-looking-glass: needs_manual_review; processing blocked; next: Add original publication metadata.
- treasure-island: approved; processing allowed; next: undefined
- wind-in-the-willows: needs_manual_review; processing blocked; next: Add original publication metadata.
- wood-folk-at-school: reject; processing blocked; next: Reject or remove modern/permission-based text.
