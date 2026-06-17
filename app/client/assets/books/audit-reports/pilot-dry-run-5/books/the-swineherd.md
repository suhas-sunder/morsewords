# Pilot Dry Run 5: the-swineherd

- Title: Andersen's Fairy Tales
- Author: H. C. Andersen
- Source file: `app/client/assets/temp-books/The Swineherd.txt`
- Source folder: `app/client/assets/temp-books`
- Public/restricted status: public
- Generated output exists: yes
- Preview asset exists: yes
- Cloudflare JSON path: `app/client/assets/books/cloudflare-export/books/the-swineherd.json`
- Detected structural convention: isolated titled sections
- Current generated section count: 2
- Proposed section count if correction is needed: 8
- First default section currently: part-001 (part, 1486 words) Part 1
- Expected first readable section: There was once a poor Prince, who had a kingdom. His kingdom was very small, but still quite large enough to marry upon; and he wished to marry. It was certainly rather cool of him to say to the Emperor's daughter, ?Will you have me?? But so he did; for his...
- Current status: needs correction before acceptance
- Recommendation for next pass: controlled rewrite/correction

## Verdicts

- Start boundary: correct: first default aligns with pass-2 readable start
- End boundary: review: last readable section does not tightly match pass-2 end snippet
- Sectioning: needs correction: source headings are clearer than the current generated split
- Cleanup: acceptable: no cleanup artifacts detected in readable/default sections
- Preview: valid book-specific startup preview
- All-main-readable default: acceptable: all detected main readable sections are included in current default playback

## Warnings

- last readable section does not tightly align with pass-2 candidate end
- Real opening or ending content may be at risk around the audited boundary.

## Hard Fail Reasons

- clear structure exists in the source but current output is coarse fallback-style sections

## Supporting Snippets

- Raw start: ns Christian Andersen THE SWINEHERD There was once a poor Prince, who had a kingdom. His kingdom was very small, but still quite large enough to marry upon; and he wished to marry. It was certainly rather cool of him to say to the Emperor's daughter, ?Will ...
- Raw end: e sake of a trumpery plaything. Thou art rightly served.? He then went back to his own little kingdom, and shut the door of his palace in her face. Now she might well sing, ?Ach! du lieber Augustin, Alles ist weg, weg, weg!? End of Project Gutenberg's Ander...
- Generated first default: ANDERSEN'S FAIRY TALES By Hans Christian Andersen THE SWINEHERD There was once a poor Prince, who had a kingdom. His kingdom was very small, but still quite large enough to marry upon; and he wished to marry. It was certainly rather cool of him to say to th...
- Generated last readable: olor from his face, threw off his dirty clothes, and stepped forth in his princely robes; he looked so noble that the Princess could not help bowing before him. ?I am come to despise thee,? said he. ?Thou would'st not have an honorable Prince! Thou could'st...
- Preview start: ANDERSEN'S FAIRY TALES By Hans Christian Andersen THE SWINEHERD There was once a poor Prince, who had a kingdom. His kingdom was very small, but still quite large enough to marry upon; and he wished to marry. It was certainly rather cool of him to say to th...

## Current Section List

| Section | Kind | Label | includeByDefault | Current default | Words | Characters | Listen min | Type | Warnings |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | --- | --- |
| part-001 | part | Part 1 | no | yes | 1486 | 8167 | 49 | body content | none |
| part-002 | part | Part 2 | no | no | 9 | 55 | 1 | optional | section is very short |
