# ToolHowItWorks Consumer Map

This map records the current `ToolHowItWorks` consumers and nearby
"how it works" support-section patterns for the dedicated migration pass. No
dark mode, theme tokens, route changes, SEO changes, copy changes, or tool
behavior changes are part of this pass.

## 1. Inventory

| Route | Component or file | Uses `ToolHowItWorks` | Uses `SectionEyebrow` | Heading text | Structure | Cards or steps | Visual differences | Behavior dependencies | Dark-mode relevance | Safety |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/morse-code-audio-practice` | `app/routes/morse-code-audio-practice.tsx` | Yes | Through `ToolHowItWorks` after migration | `How hidden Morse audio practice works` | Full-width soft support section, two-column header and dark reference panel, chip nav, summary grid, detail sections | 3 summary cards, 4 detail sections | Matches current shared `ToolHowItWorks` surface | Reference value is static; section is below stateful audio controls | High, contains support heading, dark reference panel, chip links | A |
| `/morse-code-audio-quiz` | `app/routes/morse-code-audio-quiz.tsx` | Yes | Through `ToolHowItWorks` after migration | `How this Morse code audio quiz works` | Same shared `ToolHowItWorks` surface | 3 summary cards, 4 detail sections | Matches current shared `ToolHowItWorks` surface | Section follows scored quiz controls but does not own scoring or playback | High, quiz pages need consistent support surfaces before tokens | A |
| `/morse-code-visual-practice` | `app/routes/morse-code-visual-practice.tsx` | Yes | Through `ToolHowItWorks` after migration | `How this visual Morse practice tool works` | Same shared `ToolHowItWorks` surface | 3 summary cards, 4 detail sections | Reference panel value can reflect `active`, but markup is shared | Reads `active` for display only; no control ownership in the section | High, visual practice has flash-state context | B |
| `/morse-code-visual-quiz` | `app/routes/morse-code-visual-quiz.tsx` | Yes | Through `ToolHowItWorks` after migration | `How this visual Morse quiz works` | Same shared `ToolHowItWorks` surface | 3 summary cards, 4 detail sections | Reference panel value can reflect `active`, but markup is shared | Reads `active` for display only; no scoring or timing ownership in the section | High, quiz surfaces need shared heading roles | B |
| `/morse-code-word-trainer` | `app/routes/morse-code-word-trainer.tsx` | Yes | Through `ToolHowItWorks` after migration | `How this Morse code word trainer works` | Same shared `ToolHowItWorks` surface | 3 summary cards, 4 detail sections | Reference panel value reads current active Morse pattern | Reads `activeMorse` for display only; trainer state stays local | High, trainer review and weak-word states need separate dark QA | B |
| `/morse-code-word-search-builder` | `app/routes/morse-code-word-search-builder.tsx` | Yes | Through `ToolHowItWorks` after migration | `How this Morse code word search works` | Same shared `ToolHowItWorks` surface | 3 summary cards, 4 detail sections | Matches current shared `ToolHowItWorks` surface | Section is static; generated puzzle controls are above it | High, printable/puzzle support needs shared cards before tokens | A |
| `/practice` | `app/client/components/practice/HowItWorksPractice.tsx` | No | After migration for eyebrow only | `How Morse Code Practice works` | Full-width soft support section, two-column header, dark sample prompt, summary row, several local detail sections | 3 summary items plus 5 detail sections | Similar to `ToolHowItWorks`, but max width, gaps, summary cards, and detail grids differ | Static explanatory section only; no scoring, validation, timer, or answer state ownership | High, practice states need dark-mode separation later | B for eyebrow only, D for full `ToolHowItWorks` migration |
| `/typing` | `app/client/components/typing/HowItWorksTyping.tsx` | No | After migration for eyebrow only | `How MorseWords Typing Practice works` | Static support panel, chip links, tile grid, long local detail sections | 3 top tiles plus 6 details and quick reference | Similar eyebrow, but body structure and dark reference panel differ from `ToolHowItWorks` | Static explanatory section only; typing timer, focus, and result logic are elsewhere | High, typing input and result states need separate token work | B for eyebrow only, D for full `ToolHowItWorks` migration |
| `/morse-code-sentence-practice` | `app/client/components/morse-code-sentence-practice/SentencePracticePage.tsx` | No | No direct local eyebrow target in the inspected support sections | Uses `ReferenceSupportSections` headings such as `Sentence guide` | Shared content support sections plus route-local spacing explanation | Several shared reference sections and custom static sections | Already relies on shared reference support for the main guide surface | Sentence scoring and answer validation are behavior-heavy and local | High, but needs a separate sentence-practice pass | D |
| `/morse-code-practice-plan` | `app/routes/morse-code-practice-plan.tsx` | No | Through `SectionCard` and `ReferenceSupportSections` | Multiple plan and routine headings | Shared `SectionCard` and `ReferenceSupportSections` surfaces | Multiple static cards and linked tiles | Already uses shared content surfaces rather than `ToolHowItWorks` | No stateful controls in the mapped support sections | Medium, mostly static content tokens later | D |
| `/audio` | `app/client/components/shared/HowItWorksAudio.tsx` | No | Yes | `How this Morse code audio generator works` | Polished audio support section | Worked examples and related support content | Separate approved audio support reference | Static support section, no playback ownership | High, already migrated to `SectionEyebrow` | D |
| `/morse-code-encoder` | `app/client/components/morse-code-encoder/HowItWorks.tsx` | No | Yes | `How this Morse code encoder works` | Static panel support section | Static explanatory content | Already in the first `SectionEyebrow` batch | No tool state ownership | Medium | D |
| `/morse-code-decoder` | `app/client/components/morse-code-decoder/HowItWorks.tsx` | No | Yes | `How this Morse code decoder works` | Static panel support section | Static explanatory content | Already in the first `SectionEyebrow` batch | No tool state ownership | Medium | D |
| `/morse-code-word-separator` | `app/client/components/morse-code-word-separator/HowItWorks.tsx` | No | Yes | `Word separators in Morse code` | Static panel support section | Static explanatory content | Already in the first `SectionEyebrow` batch | No tool state ownership | Medium | D |
| `/morse-code-sound-generator` | `app/client/components/morse-code-sound-generator/SoundGeneratorGuide.tsx` | No | Yes | `How this Morse code sound generator works` | Audio-like support guide section | Static examples and related links | Already in the first `SectionEyebrow` batch | No playback ownership in the guide | Medium | D |
| `/morse-code-vidual-quiz` | `app/routes/morse-code-vidual-quiz.tsx` | No | No | Redirect only | Redirects to `/morse-code-visual-quiz` | None | Not a rendered support surface | Redirect behavior only | None for this pass | D |

## 2. Candidate Classification

### A. Safe to Migrate Now

- `app/client/components/shared/ToolHowItWorks.tsx`: replace the local
  line-plus-label eyebrow markup with `SectionEyebrow`. This preserves the
  same classes while making all six existing consumers use the shared eyebrow
  primitive.
- Existing `ToolHowItWorks` consumers that only receive the shared internal
  markup change:
  `/morse-code-audio-practice`, `/morse-code-audio-quiz`, and
  `/morse-code-word-search-builder`.

### B. Safe Only With Screenshot Comparison

- `/morse-code-visual-practice`, `/morse-code-visual-quiz`, and
  `/morse-code-word-trainer`: these use `ToolHowItWorks`, but the reference
  panel reads live display state. The migration is still markup-only and safe
  with screenshots because no event handlers or state transitions move.
- `app/client/components/practice/HowItWorksPractice.tsx`: migrate only the
  existing static eyebrow to `SectionEyebrow`. Do not migrate the whole section
  to `ToolHowItWorks` because its max width, summary treatment, and detail
  rhythm intentionally differ.
- `app/client/components/typing/HowItWorksTyping.tsx`: migrate only the
  existing static eyebrow to `SectionEyebrow`. Do not migrate the whole section
  because it has typing-specific chip links, static tiles, long detail blocks,
  and no dark reference panel.

### C. Needs Dedicated Behavior Tests First

- None selected for migration in this pass. Any migration that touches quiz,
  trainer, visual flash, answer validation, playback, or generated output
  controls needs a separate behavior-focused pass.

### D. Leave Local Because Structure or Behavior Differs

- `SentencePracticePage`: keep sentence-specific sections local or in
  `ReferenceSupportSections` because the page owns answer validation and
  sentence spacing behavior.
- `morse-code-practice-plan`: already uses `SectionCard` and
  `ReferenceSupportSections`; do not force it into `ToolHowItWorks`.
- `HowItWorksAudio`, encoder support, decoder support, word-separator support,
  and sound-generator support: already migrated to `SectionEyebrow` in the
  prior pass and should remain visually stable.
- Word-search builder "Puzzle builder" header and word-trainer workspace
  headers: leave local because they sit beside active controls and generated
  state.
- Home, FAQ, toolkit, nav, footer, and hero wrappers: out of scope.

### E. Needs More Investigation

- A future static panel/card pass should inspect older route-local support
  surfaces such as printable chart help sections, static utility pages, and
  sitemap groups. They are not `ToolHowItWorks` consumers.

## 3. Exact Migration List for This Pass

1. `app/client/components/shared/ToolHowItWorks.tsx`
   - Import `SectionEyebrow`.
   - Replace only the local eyebrow `div/span/span` block with
     `<SectionEyebrow>{eyebrow}</SectionEyebrow>`.
2. `app/client/components/practice/HowItWorksPractice.tsx`
   - Import `SectionEyebrow`.
   - Replace only the local `Practice spec` eyebrow block with
     `<SectionEyebrow>Practice spec</SectionEyebrow>`.
3. `app/client/components/typing/HowItWorksTyping.tsx`
   - Import `SectionEyebrow`.
   - Replace only the local `Typing tool spec` eyebrow block with
     `<SectionEyebrow>Typing tool spec</SectionEyebrow>`.

No cards, H2 elements, chip links, section wrappers, controls, state variables,
handlers, storage keys, generated output, scoring, timing, playback, or route
content will move.

## 4. Migration Result

- `ToolHowItWorks` now uses `SectionEyebrow` internally, so its six active
  consumers share the same left-aligned eyebrow primitive.
- `/practice` and `/typing` now use `SectionEyebrow` for their static
  explanatory support-section labels only.
- Full section migration to `ToolHowItWorks` was intentionally not performed
  for `/practice` or `/typing` because their body structures differ.
- The visual and behavioral acceptance evidence for this pass lives in the
  final implementation report and the generated before/after screenshots.

## 5. Deferred List

- Full migration of `/practice` to `ToolHowItWorks`: deferred because the
  existing support section has different spacing, summary-card treatment, and
  local detail flow.
- Full migration of `/typing` to `ToolHowItWorks`: deferred because the section
  is a typing-specific documentation surface, not the shared dark-reference
  support pattern.
- `SentencePracticePage`: deferred because it uses `ReferenceSupportSections`
  and owns behavior-heavy sentence state.
- `/morse-code-practice-plan`: deferred because it already uses shared content
  primitives and is not a `ToolHowItWorks` shape.
- Word trainer and word-search workspace headers: deferred because those
  headers live inside active tool surfaces with controls and generated state.
- FAQ, toolkit, nav, footer, broad hero wrappers, and route SEO surfaces:
  deferred by task scope.

## 6. Next Recommended Pass

The next smallest useful pass should be a static panel/card wrapper audit for
the non-interactive support surfaces that still repeat `mw-static-panel`,
`mw-static-tile`, `bg-[#fffdf8]`, and `bg-[#f7f4ee]` combinations. Keep FAQ,
toolkit, hero wrappers, and behavior-heavy practice or quiz controls out of
that pass unless their own maps are updated first.
