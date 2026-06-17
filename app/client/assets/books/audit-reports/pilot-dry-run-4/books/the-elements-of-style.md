# Pilot Dry Run 4: the-elements-of-style

- Title: The Elements of Style
- Author: William Strunk
- Source file: `app/client/assets/temp-books/The Elements of Style.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: public
- Generated output exists: yes
- Preview asset exists: yes
- Cloudflare JSON path: `app/client/assets/books/cloudflare-export/books/the-elements-of-style.json`
- Detected structural convention: roman-numbered titled sections
- Current generated section count: 4
- Proposed section count if correction is needed: 20
- First default section currently: part-002 (part, 4889 words) Part 2
- Expected first readable section: III. ELEMENTARY PRINCIPLES OF COMPOSITION 8. Make the paragraph the unit of composition: one paragraph to each topic.
- Current status: needs correction before acceptance
- Recommendation for next pass: controlled rewrite/correction

## Verdicts

- Start boundary: review: first default is readable, but it does not tightly match pass-2 start snippet
- End boundary: review: last readable section does not tightly match pass-2 end snippet
- Sectioning: needs correction: source headings are clearer than the current generated split
- Cleanup: needs correction: suspicious source/catalog material remains outside defaults
- Preview: valid book-specific startup preview
- All-main-readable default: acceptable: all detected main readable sections are included in current default playback

## Warnings

- first default section does not tightly align with pass-2 candidate start
- last readable section does not tightly align with pass-2 candidate end
- suspicious non-default sections remain: part-001
- body headings were found but rejected by the selected strategy
- generated output likely collapsed real structure
- Existing generated output needs boundary/default-section correction later.

## Hard Fail Reasons

- part-001 appears to mix opening readable content with front/source material and is skipped by default
- clear structure exists in the source but current output is coarse fallback-style sections

## Supporting Snippets

- Raw start: ved valor, he was entrusted with the defence of the city. Young and inexperienced, the task seemed easy to me. Young and inexperienced, I thought the task easy. Without a friend to counsel him, the temptation proved irresistible. Without a friend to counsel...
- Raw end: fore, was the first object of my search. Happily, some embers were found upon the hearth, together with potato-stalks and dry chips. Of these, with much difficulty, I kindled a fire, by which some warmth was imparted to our shivering limbs. 18. In this conn...
- Generated first default: Dead leaves covered the ground. The sound of a guitar somewhere in the house could be heard. Somewhere in the house a guitar hummed sleepily. The reason that he left college was that his health became impaired. Failing health compelled him to leave college....
- Generated last readable: ould follow the "ordered") is _bade_. "ordered," is _bade_. =Effect.= As noun, means _result_; as verb, means t_o bring about_, =Effect.= As noun, means _result_; as verb, means _to bring about_, incontestable they ma ybe, are not properly facts. incontesta...
- Preview start: Dead leaves covered the ground. The sound of a guitar somewhere in the house could be heard. Somewhere in the house a guitar hummed sleepily. The reason that he left college was that his health became impaired. Failing health compelled him to leave college....

## Current Section List

| Section | Kind | Label | includeByDefault | Current default | Words | Characters | Listen min | Type | Warnings |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | --- | --- |
| part-001 | part | Part 1 | no | no | 4846 | 29985 | 170 | suspicious | source/license/catalog/transcriber material appears in this section |
| part-002 | part | Part 2 | no | yes | 4889 | 29926 | 175 | body content | none |
| part-003 | part | Part 3 | no | yes | 4175 | 26116 | 153 | body content | none |
| part-004 | part | Part 4 | no | no | 0 | 1 | 1 | optional | none |
