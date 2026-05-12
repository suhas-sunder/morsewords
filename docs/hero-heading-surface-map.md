# MorseWords Hero and Heading Surface Map

This document maps the current hero, page-heading, section-heading, and
eyebrow surfaces before a broader visual-surface refactor. It is a planning
artifact. No dark mode, theme tokens, route changes, copy changes, metadata
changes, or tool behavior changes are implemented here.

## Scope and Outcome

- Source pass type: audit, planning, and narrow primitive extraction.
- Runtime source changes from follow-up implementation passes:
  `SectionEyebrow` was added and reused in selected low-risk support sections,
  then wired into `ToolHowItWorks`, `/practice`, and `/typing` static support
  labels.
- Existing shared hero assets found:
  - `app/client/components/shared/heroStyles.ts`
  - `app/client/components/shared/ToolWorkspace.tsx`
  - `app/client/components/shared/MorseLearningLayout.tsx`
  - `app/client/components/shared/MorseAmbientBackground.tsx`
  - `app/client/components/shared/PageBackdrop.tsx`
- Current approved decorative Morse background:
  `MorseAmbientBackground`, rendered by `PageBackdrop`.
- Tiny extraction decision: completed for the first low-risk support-section
  batches. Home, hero, FAQ, toolkit, sentence-practice, and other customized
  labels remain local for later focused passes.

## 1. Inventory of Current Hero and Heading Systems

### Hero Source Constants

| Surface | File | Routes using it | Purpose | Heading usage | Eyebrow usage | Max width and spacing | Homepage match | Duplication | Safe to consolidate | Dark-mode relevance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hero constants | `app/client/components/shared/heroStyles.ts` | Home, audio, encoder, decoder, sound generator, name tool, content pages, practice and typing surfaces | Shared class source for top hero rhythm | `HERO_TITLE_CLASS` for H1 | `HERO_EYEBROW_*` classes | Defines header padding, title scale, lead width, and eyebrow line | Yes | Used directly and through components | Already shared | High, because these classes hold hero text colors and spacing |
| Tool hero primitive | `app/client/components/shared/ToolWorkspace.tsx` | `/audio`, `/morse-code-sound-generator`, `/name-to-morse-code` | Tool-page H1, eyebrow, and intro copy | H1 only | Line-plus-label from constants | Header only, parent owns outer section and action rows | Yes where parent matches home | Some routes still render same markup manually | Safe only with route screenshots | High, because tool pages should receive future heading tokens through this layer |
| Page hero primitive | `app/client/components/shared/MorseLearningLayout.tsx` | Guides, leaf pages, contact, about, dictionary, reference hubs, word trainer, word search builder, many newer routes | Content/reference page H1 with optional actions and aside | H1 only | Shared `Eyebrow` component | Wraps `mw-tool-section mt-0`, header spacing, optional side grid | Mostly matches the home heading style, with content-page layout needs | Coexists with `ToolHero` and manual hero shells | Safe only by route family | High, because most content pages already flow through this surface |
| Learning layout eyebrow | `app/client/components/shared/MorseLearningLayout.tsx` | `PageHero`, `SectionCard` | Shared line-plus-label primitive | None | Approved line, text size, tracking, and color | No outer spacing by itself | Matches homepage eyebrow styling | Same markup still duplicated elsewhere | Candidate for next narrow batch | High, because one token-ready eyebrow surface would remove many scattered text color classes |
| Section eyebrow primitive | `app/client/components/shared/SectionEyebrow.tsx` | `/audio`, `/morse-code-encoder`, `/morse-code-decoder`, `/morse-code-word-separator`, `/morse-code-sound-generator`, `/practice`, `/typing`, and `ToolHowItWorks` consumers | Shared support-section line-plus-label primitive | None | Imports approved hero eyebrow constants | No margins or wrapper layout beyond the existing eyebrow row | Matches homepage eyebrow styling | First low-risk batches consolidated | Completed for selected support sections | High, because future heading color work can target this shared surface |

### Homepage Source-of-Truth Surfaces

| Surface | File | Routes using it | Purpose | Heading usage | Eyebrow usage | Max width and spacing | Homepage match | Duplication | Safe to consolidate | Dark-mode relevance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Home route shell | `app/routes/home.tsx` | `/` | Renders translator, support sections, FAQ, and social sections | Delegates top H1 to `TranslatorSectionsBasic` | Delegates hero eyebrow to translator | Main tool wrapper is `max-w-[1120px]` with home padding rhythm | Source of truth | Home-specific composition only | Leave unique | High, must be protected during all shared changes |
| Live translator hero | `app/client/components/shared/TranslatorSectionsBasic.tsx` | `/`, `/morse-code-encoder`, `/morse-code-decoder` through route props | Mature translator hero and tool surface | Manual H1 with `HERO_TITLE_CLASS` | Manual line-plus-label classes | `mw-tool-section mt-0`, `tool-header px-0 pb-1 pt-2 sm:pt-3` | Yes on home | Duplicates `ToolHero` classes manually | Needs dedicated implementation pass | High, because this is the home H1 and primary conversion surface |
| Home how-it-works heading | `app/client/components/home/HowItWorks.tsx` | `/` | Homepage support section heading | H2 `text-3xl sm:text-4xl` | Manual approved eyebrow | Full-width warm support section rhythm | Source for support-section rhythm | Duplicated by audio and tool support guides | Leave home unique, extract primitive later | Medium, support headings need tokens after surface consolidation |

### Tool Page Hero and Heading Surfaces

| Surface | File | Routes using it | Purpose | Heading usage | Eyebrow usage | Max width and spacing | Homepage match | Duplication | Safe to consolidate | Dark-mode relevance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Audio tool hero | `app/client/components/audio/MorseAudioTranslator.tsx` | `/audio` | Main audio tool header | `ToolHero` H1 | `ToolHero` eyebrow | Parent section uses `mw-tool-section mt-0`; actions below hero | Yes, approved tool reference | Uses shared hero but local support headings remain | Already aligned for hero | High, approved tool-page reference |
| Sound generator tool hero | `app/client/components/morse-code-sound-generator/MorseAudioTranslator.tsx` | `/morse-code-sound-generator` | Sound tool header | `ToolHero` H1 | `ToolHero` eyebrow | Parent section matches tool pattern | Yes for hero | Support guide duplicates section headings | Already aligned for hero | High, audio-like controls and headings need future tokens |
| Name tool hero | `app/routes/name-to-morse-code.tsx` | `/name-to-morse-code` | Name conversion route header | `ToolHero` H1 | `ToolHero` eyebrow | Uses route main wrapper and action links below hero | Yes for hero | Section support uses shared and route-local surfaces | Already aligned for hero | Medium |
| Word separator hero | `app/client/components/morse-code-word-separator/WordSeparatorTool.tsx` | `/morse-code-word-separator` | Word separator tool header | Manual H1 with hero constants | Manual eyebrow constants | Similar to tool section, integrated with tool state | Matches the hero scale | Duplicates `ToolHero` markup | Safe only with screenshot and query smoke | High, tool-wrapper work should include it later |
| Encoder/decoder support headings | `app/client/components/morse-code-encoder/HowItWorks.tsx`, `app/client/components/morse-code-decoder/HowItWorks.tsx` | `/morse-code-encoder`, `/morse-code-decoder` | Tool support and SEO sections | H2 `text-3xl sm:text-4xl` | Manual approved eyebrow | `mw-static-panel mw-how-section` | Similar to home support rhythm | Duplicated line-plus-label and H2 stack | Candidate for a small section-eyebrow pass | Medium |
| Sound generator support headings | `app/client/components/morse-code-sound-generator/SoundGeneratorGuide.tsx` | `/morse-code-sound-generator` | Sound guide sections | H2 `text-3xl sm:text-4xl` and smaller H2s | Manual approved eyebrow in first section | Soft full-width section style | Similar to audio support rhythm | Duplicated eyebrow and H2 stack | Candidate after audio screenshots | Medium |

### Learning, Guide, Leaf, and Reference Surfaces

| Surface | File | Routes using it | Purpose | Heading usage | Eyebrow usage | Max width and spacing | Homepage match | Duplication | Safe to consolidate | Dark-mode relevance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Content page renderer | `app/client/components/content/MorseContentSections.tsx` | `/how-to-read-morse-code`, `/how-to-separate-words-in-morse-code`, `/a-in-morse-code`, `/0-in-morse-code`, `/hello-in-morse-code`, `/space-in-morse-code`, number pages | Shared guide, leaf, letter, number, and phrase page layout | `PageHero` H1 | `PageHero` and `SectionCard` eyebrow | `styles.page` and `PageHero` section rhythm | Matches heading style, content layout differs by intent | Good shared base, little hero duplication inside this file | Leave as shared base | High, large route family |
| SectionCard | `app/client/components/shared/MorseLearningLayout.tsx` | Content pages, contact, punctuation, reference support sections | Shared support section wrapper | H2 in stacked or split size | Shared `Eyebrow` | Rounded static panel, optional aside, split or stacked variant | Matches homepage section label style, not identical wrapper | Some route-local wrappers still duplicate it | Already shared, migrate local wrappers later | High |
| Reference support sections | `app/client/components/shared/ReferenceSupportSections.tsx` | Leaf and guide support areas, name page, audio page | Shared next-step and explanatory sections | Delegates H2 to `SectionCard` | Delegates eyebrow to `SectionCard` | Uses grid/list variants inside `SectionCard` | Mostly aligned | Good shared target, not duplicate | Leave as shared base | Medium |
| Alphabet route sections | `app/routes/morse-code-alphabet.tsx` | `/morse-code-alphabet` | Alphabet chart and page sections | `PageHero` H1, local H2 for chart section | `PageHero` only | Route-local static panel sections | Hero matches, lower sections are local | Local `Section` duplicates static-panel heading shape | Safe only with chart screenshots | Medium |
| Words route sections | `app/routes/morse-code-words.tsx` | `/morse-code-words` | Word and phrase lookup page | `PageHero` H1, local `CardSection` over shared `SectionCard` | `PageHero` and `SectionCard` | Adds route-local wrapper around shared section card | Hero matches | Wrapper duplication around `SectionCard` | Safe only in a reference-page batch | Medium |
| Punctuation route sections | `app/routes/morse-code-punctuation.tsx` | `/morse-code-punctuation` | Punctuation reference | `PageHero` H1 with aside, `SectionCard` H2 | Shared `Eyebrow` through `PageHero` and `SectionCard` | Shared content layout | Matches current content system | No urgent duplication in hero layer | Leave as shared base | Medium |
| Contact route sections | `app/routes/contact.tsx` | `/contact` | Contact and trust page | `PageHero` H1, `SectionCard` H2 | Shared `Eyebrow` | Shared content layout | Matches current content system | No urgent duplication in hero layer | Leave as shared base | Medium |

### Practice, Typing, Quiz, and Trainer Heading Surfaces

| Surface | File | Routes using it | Purpose | Heading usage | Eyebrow usage | Max width and spacing | Homepage match | Duplication | Safe to consolidate | Dark-mode relevance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Practice page hero | `app/client/components/practice/PracticePage.tsx` | `/practice` | Practice intro and session setup | Manual H1 with hero constants | Manual hero constants | Practice-specific shell and stateful controls | Visually related | Duplicates `PageHero`/`ToolHero`, but tied to behavior-heavy page | Leave for later | High, due disabled states, scoring, and feedback surfaces |
| Typing page hero | `app/client/components/typing/TypingPage.tsx` | `/typing` | Typing test intro and controls | Manual H1 with hero constants | Manual hero constants | Typing-specific shell and result lifecycle | Visually related | Duplicates hero markup | Leave for later | High, due timer and result states |
| Sentence practice hero | `app/client/components/morse-code-sentence-practice/SentencePracticePage.tsx` | `/morse-code-sentence-practice` | Sentence practice intro and results | Manual H1 with hero constants | Manual hero constants | Stateful practice page layout | Visually related | Duplicates hero markup | Leave for later | High |
| Word trainer route hero | `app/routes/morse-code-word-trainer.tsx` | `/morse-code-word-trainer` | Trainer intro, session, and weak-word review | `PageHero` H1 plus local H2 sections | `PageHero`, plus manual section eyebrow | Shared hero, local support heading | Mixed | Local section heading duplication | Safe only for non-state support section later | High |

### FAQ, Toolkit, Breadcrumb, and Static Utility Heading Surfaces

| Surface | File | Routes using it | Purpose | Heading usage | Eyebrow usage | Max width and spacing | Homepage match | Duplication | Safe to consolidate | Dark-mode relevance |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FAQ section heading | `app/client/components/shared/FaqSectionGeneric.tsx` | Home and many non-home pages | FAQ heading and accordion wrapper | H2 centered | Centered line-plus-label with two side lines | Variant-specific margins and FAQ styling | Home variant is approved | Home/default branches duplicate much of the heading markup | Dedicated FAQ heading pass | Medium |
| Related tools headings | `app/client/components/navigation/RelatedTools.tsx` | Global related tools area | Toolkit and navigation headings | H2 `text-3xl sm:text-4xl` | Manual approved eyebrow | Home and full toolkit variants differ | Home toolkit is source | Duplicate headings in compact/full toolkit blocks | No-go for this pass, toolkit pass later | High |
| Breadcrumb headings and utility pages | `app/routes/sitemap.tsx`, misc legal routes, socials route | Sitemap, legal, static utility pages | Static utility page headings | Mixed H1/H2, some use `PageHero`, some manual | Mixed manual eyebrows | Route-local legal/static wrappers | Often not homepage-like | Duplicated, but utility routes need separate audit | Leave for static utility pass | Low to medium |

## 2. Homepage Source-of-Truth Notes

### Top Hero Spacing

- The approved top hero starts close to the navbar with breathing room.
- Shared constants define the core rhythm:
  - `HERO_SECTION_CLASS`: `mw-tool-section mt-0`
  - `HERO_HEADER_CLASS`: `tool-header pb-1 pt-2 sm:pt-3`
- `TranslatorSectionsBasic` adds `px-0` to the tool header. That difference
  should be preserved unless a dedicated translator hero pass proves it can be
  removed without visual drift.

### Eyebrow and Overline Style

- Approved left-aligned eyebrow:
  - wrapper: `flex items-center gap-3`
  - line: `h-px w-8 bg-sky-800`
  - text: `font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900`
- `MorseLearningLayout.Eyebrow` already renders this exact line-plus-label
  pattern for `PageHero` and `SectionCard`.
- The same markup is manually repeated in home support sections, tool support
  sections, FAQ headings, related tools, and some practice/trainer pages.

### H1 Sizing

- Approved H1 class:
  `mt-3 text-4xl font-black leading-tight tracking-tight text-sky-950 sm:text-5xl lg:text-6xl`.
- The H1 source is `HERO_TITLE_CLASS`.
- Pages using `ToolHero`, `PageHero`, or direct hero constants generally keep
  the same H1 scale.
- Some legal/static utility pages still use older manual H1 classes and should
  be audited separately.

### Intro Text Sizing

- Approved hero lead class:
  `mt-4 max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg`.
- The lead source is `HERO_LEAD_CLASS`.
- Tool and content pages mostly align when they use `ToolHero`, `PageHero`, or
  direct constants.

### Action Row Placement

- Home translator action chips and samples sit inside the translator tool
  surface, not inside a generic hero wrapper.
- `PageHero` supports action rows through `children`, while `ToolHero` leaves
  action rows to the parent.
- A future hero consolidation should not force all action rows into the same
  slot. Tool pages and content pages use different action-row relationships.

### Tool Panel Relationship

- On home and tool pages, the hero text introduces the tool surface directly.
- `TranslatorSectionsBasic` is dense and owns both hero and main translator
  behavior, so it should not be refactored in the same batch as broad content
  page headings.
- `ToolHero` is already a safer primitive for simpler tool pages like `/audio`
  and `/name-to-morse-code`.

### Decorative Background Relationship

- `MorseAmbientBackground` is the shared decorative Morse side-accent system.
- `PageBackdrop` renders it behind all pages.
- Hero or heading components should not add separate decorative Morse text.
- Decorative accents must remain `aria-hidden`, non-interactive, and below
  interactive controls.

### Section Heading Rhythm

- Common support-section rhythm:
  - eyebrow above heading
  - H2 with `text-3xl sm:text-4xl`, `font-extrabold`, `tracking-tight`,
    `text-sky-950`
  - support copy with `text-base leading-relaxed text-slate-700 sm:text-lg`
- `SectionCard` has two approved size variants:
  - stacked: larger H2, broader intro text
  - split: smaller H2, narrower sidebar intro
- Route-local support sections vary in margins, backgrounds, and description
  widths. A heading primitive should not flatten those wrapper differences.

## 3. Duplicate Patterns

### Manual Hero Shells

- `app/client/components/shared/TranslatorSectionsBasic.tsx`
  manually renders the same eyebrow, H1, and lead classes that `ToolHero` uses.
- `app/client/components/morse-code-word-separator/WordSeparatorTool.tsx`
  manually renders the same hero constants inside a stateful tool.
- `app/client/components/practice/PracticePage.tsx`,
  `app/client/components/typing/TypingPage.tsx`, and
  `app/client/components/morse-code-sentence-practice/SentencePracticePage.tsx`
  manually render hero constants inside behavior-heavy pages.
- These differences appear mostly accidental at the markup level, but the
  pages have different state and first-screen relationships. They should not
  be collapsed in one pass.

### Repeated Section Eyebrow Markup

Repeated class group:

```tsx
<div className="flex items-center gap-3">
  <span className="h-px w-8 bg-sky-800" />
  <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900">
    ...
  </span>
</div>
```

Found in:

- `app/client/components/home/HowItWorks.tsx`
- `app/client/components/shared/HowItWorksAudio.tsx` now uses
  `SectionEyebrow`.
- `app/client/components/shared/ToolHowItWorks.tsx` now uses
  `SectionEyebrow`.
- `app/client/components/morse-code-encoder/HowItWorks.tsx` now uses
  `SectionEyebrow`.
- `app/client/components/morse-code-decoder/HowItWorks.tsx` now uses
  `SectionEyebrow`.
- `app/client/components/morse-code-word-separator/HowItWorks.tsx` now uses
  `SectionEyebrow`.
- `app/client/components/morse-code-sound-generator/SoundGeneratorGuide.tsx`
  now uses `SectionEyebrow`.
- `app/client/components/practice/HowItWorksPractice.tsx` now uses
  `SectionEyebrow` for the static support label only.
- `app/client/components/typing/HowItWorksTyping.tsx` now uses
  `SectionEyebrow` for the static support label only.
- `app/client/components/navigation/RelatedTools.tsx`
- selected route files such as `morse-code-word-trainer.tsx`,
  `morse-code-word-search-builder.tsx`, `morse-code-sos.tsx`,
  `morse-code-international-translator.tsx`, and sitemap sections.

The repeated visual pattern is intentional. The first safe route-local copies
were replaced with `SectionEyebrow`, which uses the same classes and leaves all
outer section layout untouched.

### Repeated Section H2 Classes

Common H2 class group:

```tsx
text-3xl font-extrabold tracking-tight text-sky-950 sm:text-4xl
```

Common variants:

- with `mt-3` in shared section cards and many route sections
- with `mt-4 max-w-[18ch]` in `HowItWorksAudio`
- with `max-w-4xl` on some route-level support headings
- smaller `text-2xl sm:text-3xl` for secondary reference sections

These should be mapped into a heading primitive only after the eyebrow pass,
because H2 spacing and max-width differ by section type.

### FAQ Heading Duplication

- `FaqSectionGeneric` renders a centered eyebrow with two side lines.
- The home and default branches duplicate much of the heading markup, but their
  wrapper margins and FAQ item classes differ.
- This is a good future target, but it should stay in a dedicated FAQ pass
  because FAQ trigger shadows and open-state spacing are easy to regress.

### Toolkit Heading Duplication

- `RelatedTools` repeats similar toolkit heading markup in home and full
  toolkit variants.
- This is intentionally left out of the current pass because toolkit rendering
  is a no-go area for this audit and needs its own visual QA.

### Static Utility Heading Drift

- Legal, socials, sitemap, and some static utility pages use older manual H1
  or H2 structures.
- These pages are lower priority than the main tool, reference, guide, and leaf
  surfaces, but they should be included before token rollout so dark mode does
  not require page-local patches.

## 4. Consolidation Recommendations

| Candidate | Classification | Reason | Exact files to change later | Tests and screenshots needed |
| --- | --- | --- | --- | --- |
| `SectionEyebrow` primitive for left-aligned line-plus-label sections | A, completed for low-risk support batches | Existing `Eyebrow` proved the class stack; `SectionEyebrow` now reuses the same constants without margins | Completed in `HowItWorksAudio.tsx`, encoder, decoder, word-separator, sound-generator, `ToolHowItWorks.tsx`, `HowItWorksPractice.tsx`, and `HowItWorksTyping.tsx` | Desktop/mobile screenshots covered each changed batch |
| Centered FAQ eyebrow/header primitive | B, safe only with screenshot comparison | FAQ wrapper margins and trigger styling differ by variant | `FaqSectionGeneric.tsx` only at first | Home and one non-home FAQ screenshot with closed and open FAQ state |
| Reuse `ToolHero` in `TranslatorSectionsBasic` | C, needs dedicated implementation pass | This protects the homepage H1 and primary translator first viewport | `TranslatorSectionsBasic.tsx` | Home, encoder, decoder screenshots, query-prefill checks, translator interaction smoke |
| Reuse `ToolHero` in `WordSeparatorTool` | B, safe only with screenshot comparison | It is a simple duplicate hero, but the page owns tool state and query behavior | `WordSeparatorTool.tsx` | `/morse-code-word-separator` desktop/mobile screenshots and interaction smoke |
| Unify `ToolHero` and `PageHero` into one broader hero API | C, needs dedicated implementation pass | Tool pages and content pages place action rows and asides differently | `ToolWorkspace.tsx`, `MorseLearningLayout.tsx`, selected routes | Broad route screenshot batch after smaller primitives are stable |
| Section H2 component for static support sections | C, needs dedicated implementation pass | H2 margin, max width, and size variants are meaningful | Home support, audio support, guide support files | Section-by-section screenshots, no content changes |
| Toolkit heading consolidation | C, needs dedicated implementation pass | RelatedTools has home/full variants and hover behavior | `RelatedTools.tsx` | Home and non-home toolkit screenshots, hover/focus check |
| Practice/typing hero consolidation | D, leave unique for now | The pages are behavior-heavy and current instruction excludes practice/typing controls | Practice, typing, sentence-practice components | Separate stateful-page pass after control consolidation |
| Static utility/legal heading cleanup | E, needs more investigation | Some pages are older and may intentionally differ from the core product surfaces | misc/legal, sitemap, socials | Static route screenshot audit |

## 5. Completed Batch and Next Target

Completed batch: consolidate the left-aligned section eyebrow primitive for
selected low-risk support sections only.

### Proposed Scope

- Created `app/client/components/shared/SectionEyebrow.tsx`.
- Keep the rendered markup and classes identical:
  - `flex items-center gap-3`
  - `h-px w-8 bg-sky-800`
  - `font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900`
- Updated only low-risk support sections first:
  - `app/client/components/shared/HowItWorksAudio.tsx`
  - `app/client/components/morse-code-encoder/HowItWorks.tsx`
  - `app/client/components/morse-code-decoder/HowItWorks.tsx`
  - `app/client/components/morse-code-word-separator/HowItWorks.tsx`
  - `app/client/components/morse-code-sound-generator/SoundGeneratorGuide.tsx`
- `ToolHowItWorks.tsx` now uses `SectionEyebrow` internally after its
  consumer map and screenshot batch.
- Home, FAQ, toolkit, practice, typing, sentence-practice, and translator hero
  wrappers remain unchanged. Practice and typing support-section bodies remain
  local; only their static eyebrow labels moved to `SectionEyebrow`.

### Routes to Screenshot

- `/`
- `/audio`
- `/morse-code-encoder`
- `/morse-code-decoder`
- `/morse-code-sound-generator`
- `/morse-code-word-separator`

Optional comparison routes:

- `/name-to-morse-code`

### Visual Impact

- None. The component renders the same elements with the same classes.
- Before and after screenshots were byte-identical for required desktop and
  mobile pages.
- No section wrapper, H2, description, spacing, or layout classes moved.

### Risks

- Accidental spacing drift if the primitive includes margins or wrapper layout.
- Import churn if the existing `Eyebrow` name is reused too broadly.
- Over-generalizing before FAQ, toolkit, and content headings are mapped into
  their own variants.

### Tests Needed

- `npm run typecheck`
- `npm run build`
- `npm run lint --if-present`
- `npm run test --if-present`
- Focused route smoke for changed routes.
- Focused accessibility smoke confirming the headings remain visible text and
  do not alter keyboard focus.
- `git diff --check`

## 6. Dark-Mode Implications

- Hero headings centralize the highest-visibility text color classes:
  `text-sky-950`, `text-sky-900`, and `text-slate-700`.
- Section eyebrows repeat `text-sky-900`, `bg-sky-800`, and mono uppercase
  tracking across route-local files. They should become one shared surface
  before token work.
- Section H2 and support copy classes should be tokenized only after the
  wrappers are consolidated enough to avoid scattered route-level overrides.
- FAQ and toolkit headings need separate variants because their centered
  headings, shadows, cards, and hover states affect dark-mode contrast.
- Practice and typing hero headings should remain local until behavior-heavy
  controls are stable, but their text color and disabled states will matter in
  later dark QA.
- Decorative Morse accents are already centralized in `MorseAmbientBackground`;
  hero and heading work should not reintroduce route-local decorative text.

## 7. Pages and Components Inspected

### Required Routes

- `/`
- `/audio`
- `/morse-code-encoder`
- `/morse-code-decoder`
- `/morse-code-sound-generator`
- `/name-to-morse-code`
- `/how-to-read-morse-code`
- `/how-to-separate-words-in-morse-code`
- `/morse-code-alphabet`
- `/morse-code-numbers`
- `/morse-code-words`
- `/morse-code-punctuation`
- `/morse-code-word-separator`
- `/a-in-morse-code`
- `/0-in-morse-code`
- `/hello-in-morse-code`
- `/space-in-morse-code`
- `/contact`

### Key Source Files

- `app/routes/home.tsx`
- `app/routes/audio.tsx`
- `app/routes/morse-code-encoder.tsx`
- `app/routes/morse-code-decoder.tsx`
- `app/routes/morse-code-sound-generator.tsx`
- `app/routes/name-to-morse-code.tsx`
- `app/routes/morse-code-alphabet.tsx`
- `app/routes/morse-code-numbers.tsx`
- `app/routes/morse-code-words.tsx`
- `app/routes/morse-code-punctuation.tsx`
- `app/routes/contact.tsx`
- `app/client/components/shared/heroStyles.ts`
- `app/client/components/shared/ToolWorkspace.tsx`
- `app/client/components/shared/MorseLearningLayout.tsx`
- `app/client/components/shared/PageBackdrop.tsx`
- `app/client/components/shared/MorseAmbientBackground.tsx`
- `app/client/components/shared/TranslatorSectionsBasic.tsx`
- `app/client/components/shared/ReferenceSupportSections.tsx`
- `app/client/components/shared/ToolHowItWorks.tsx`
- `app/client/components/shared/HowItWorksAudio.tsx`
- `app/client/components/home/HowItWorks.tsx`
- `app/client/components/audio/MorseAudioTranslator.tsx`
- `app/client/components/morse-code-sound-generator/MorseAudioTranslator.tsx`
- `app/client/components/morse-code-sound-generator/SoundGeneratorGuide.tsx`
- `app/client/components/morse-code-encoder/HowItWorks.tsx`
- `app/client/components/morse-code-decoder/HowItWorks.tsx`
- `app/client/components/morse-code-word-separator/WordSeparatorTool.tsx`
- `app/client/components/morse-code-word-separator/HowItWorks.tsx`
- `app/client/components/content/MorseContentSections.tsx`
- `app/client/components/navigation/RelatedTools.tsx`
- `app/client/components/shared/FaqSectionGeneric.tsx`

## 8. Current Decision

`SectionEyebrow` is now the shared primitive for the selected low-risk
left-aligned support-section labels, including the `ToolHowItWorks` route
family. Remaining eyebrow duplication is intentional until each broader surface
has its own focused screenshot-backed pass. The next recommended target is a
static panel/card wrapper audit or a centered FAQ heading pass contained to
`FaqSectionGeneric`.
