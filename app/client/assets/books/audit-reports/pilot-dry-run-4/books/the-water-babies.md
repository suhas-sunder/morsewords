# Pilot Dry Run 4: the-water-babies

- Title: The Water-Babies: A Fairy Tale for a Land-Baby
- Author: Charles Kingsley
- Source file: `app/client/assets/temp-books/the-water-babies.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: public
- Generated output exists: yes
- Preview asset exists: yes
- Cloudflare JSON path: `app/client/assets/books/cloudflare-export/books/the-water-babies.json`
- Detected structural convention: story or titled-section headings
- Current generated section count: 10
- Proposed section count if correction is needed: 25
- First default section currently: chapter-001 (chapter, 8645 words) Chapter 1
- Expected first readable section: CHAPTER I ONCE upon a time there was a little chimney-sweep, and his name was Tom. That is a short name, and you have heard it before, so you will not have much trouble in remembering it. He lived in a great town in the North
- Current status: needs correction before acceptance
- Recommendation for next pass: controlled rewrite/correction

## Verdicts

- Start boundary: correct: first default aligns with pass-2 readable start
- End boundary: review: last readable section does not tightly match pass-2 end snippet
- Sectioning: needs correction: source headings are clearer than the current generated split
- Cleanup: needs correction: cleanup material appears in readable/default sections
- Preview: valid book-specific startup preview
- All-main-readable default: acceptable: all detected main readable sections are included in current default playback

## Warnings

- last readable section does not tightly align with pass-2 candidate end
- body headings were found but rejected by the selected strategy
- Transcriber/editor notes are present and should stay out of readable defaults.
- Illustration/image placeholders should be cleaned or suppressed later.

## Hard Fail Reasons

- source/TOC/license material leaks into readable/default sections: chapter-002, chapter-004
- clear structure exists in the source but current output is coarse fallback-style sections
- current output has huge readable sections: chapter-009

## Supporting Snippets

- Raw start: ; And much it grieved my heart to think, What man has made of man." WORDSWORTH. CHAPTER I ONCE upon a time there was a little chimney-sweep, and his name was Tom. That is a short name, and you have heard it before, so you will not have much trouble in remem...
- Raw end: . Brandan and his hermits, as they slumbered in the shade; and they moved their good old lips, and sang their morning hymn amid their dreams. But among all the songs one came across the water more sweet and clear than all; for it was the song of a young gir...
- Generated first default: CHAPTER I ONCE upon a time there was a little chimney-sweep, and his name was Tom. That is a short name, and you have heard it before, so you will not have much trouble in remembering it. He lived in a great town in the North country, where there were plent...
- Generated last readable: cold water to wash in; and wash in it too, like a true Englishman. And then, if my story is not true, something better is; and if I am not quite right, still you will be, as long as you stick to hard work and cold water._ _But remember always, as I told you...
- Preview start: CHAPTER I ONCE upon a time there was a little chimney-sweep, and his name was Tom. That is a short name, and you have heard it before, so you will not have much trouble in remembering it. He lived in a great town in the North country, where there were plent...

## Current Section List

| Section | Kind | Label | includeByDefault | Current default | Words | Characters | Listen min | Type | Warnings |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | --- | --- |
| title-page-001 | title-page | Opening section | no | no | 372 | 2948 | 13 | front matter | none |
| chapter-001 | chapter | Chapter 1 | yes | yes | 8645 | 45847 | 270 | body content | none |
| chapter-002 | chapter | Chapter 2 | yes | yes | 7892 | 41377 | 246 | body content | image/illustration placeholder appears in a readable section |
| chapter-003 | chapter | Chapter 3 | yes | yes | 9050 | 47534 | 282 | body content | none |
| chapter-004 | chapter | Chapter 4 | yes | yes | 9278 | 51012 | 303 | body content | image/illustration placeholder appears in a readable section |
| chapter-005 | chapter | Chapter 5 | yes | yes | 7835 | 41917 | 248 | body content | none |
| chapter-006 | chapter | Chapter 6 | yes | yes | 6442 | 33738 | 201 | body content | none |
| chapter-007 | chapter | Chapter 7 | yes | yes | 547 | 2741 | 17 | body content | none |
| chapter-008 | chapter | Chapter 1 | yes | yes | 39 | 256 | 2 | body content | section is very short |
| chapter-009 | chapter | Chapter 2 | yes | yes | 18828 | 101845 | 605 | body content | section exceeds 18000 words |
