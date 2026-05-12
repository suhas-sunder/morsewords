# MorseWords Component Consolidation Plan

This document identifies consolidation opportunities that should be handled
before dark mode. It is a planning artifact only. This pass does not perform a
broad component refactor.

## Consolidation Goals

- Preserve the approved homepage and `/audio` visual system.
- Reduce route-local button, card, panel, and section class strings.
- Create shared surfaces that can receive future light and dark tokens.
- Keep route content, route structure, and tool logic unchanged during
  consolidation.
- Avoid page-by-page dark-mode patches.

## Phase 2 Progress Notes

- Completed the first shared action-control pass in commit `59800a1`, covering
  the main translator, audio, word separator, name tool, answer cards, and
  alphabet copy controls.
- Completed a follow-up action-control pass for the remaining safe copy,
  share, and action patterns in dictionary, phrase lookup, number cards,
  practice share controls, typing, sentence practice, word trainer, word-search
  sharing, and sound-generator copy behavior.
- Completed the printable chart action cleanup by moving export, share,
  quick-preset, and uploaded-logo remove controls to shared action controls
  without changing chart behavior or file output.
- Completed the practice, typing, quiz, trainer, audio/visual practice, and
  word-search control-state mapping in `docs/practice-typing-control-map.md`
  before starting behavior-heavy control consolidation.
- Completed the narrow typing result share/download modal cleanup by replacing
  its local modal action controls with shared action controls while preserving
  typing timer, scoring, generated image, filename, and share behavior.
- Completed the narrow word-trainer weak-word result-review cleanup by moving
  only the Copy weak words and Clear weak words controls to shared
  `ActionButton` while preserving generated copy text, copied/error status,
  weak-list clearing, button order, and visual classes.
- Completed the narrow `/practice` reset-action cleanup by moving only the
  active Clear, active Restart, and completed-results Try again controls to
  shared `ActionButton` while preserving scoring, session state, disabled
  states, keyboard behavior, and visual button bounds.
- Completed the shared visual-surface pass for the decorative Morse background
  by extracting the homepage-approved side accents into
  `MorseAmbientBackground` and rendering it through `PageBackdrop` on all
  routes. This removed the stale non-home breakpoint and rail-width branch
  while keeping the homepage visual output unchanged.
- Completed the hero and heading surface mapping in
  `docs/hero-heading-surface-map.md`. This documented the current `ToolHero`,
  `PageHero`, `Eyebrow`, section-heading, FAQ-heading, and toolkit-heading
  surfaces without changing runtime source. The next safe implementation batch
  is a narrow left-aligned section-eyebrow primitive pass for low-risk tool
  support sections.
- Completed the first `SectionEyebrow` implementation pass by adding
  `app/client/components/shared/SectionEyebrow.tsx` and reusing it in the
  audio, encoder, decoder, word-separator, and sound-generator support
  sections. Homepage and touched page screenshots were byte-identical before
  and after.
- Completed the `ToolHowItWorks` consumer map in
  `docs/tool-how-it-works-consumer-map.md` and migrated the shared
  `ToolHowItWorks`, `/practice`, and `/typing` static support-section eyebrow
  labels to `SectionEyebrow` without moving section wrappers, cards, controls,
  scoring, timers, playback, generated output, or route content.
- Completed the first static surface consolidation pass by adding shared
  `StaticPanel`, `StaticTile`, `StaticSectionPanel`, and `StaticCodeBlock`
  primitives in `MorseLearningLayout` and reusing them in generated
  leaf/reference examples, shared reference support cards, encoder support
  panels, and word-separator support panels. The batch only replaced exact
  non-interactive wrapper patterns and left FAQ, toolkit, printable chart,
  rounded-2xl, opacity-specific, and behavior-heavy surfaces local.
- Completed the dedicated FAQ/toolkit visual-surface pass. `FaqSectionGeneric`
  now centralizes its centered header, item, and list wrappers while preserving
  the home/default visual variants, and `RelatedTools` now uses one toolkit
  renderer with a home/full class map plus `SectionEyebrow`. FAQPage JSON-LD
  policy and visible FAQ content were left unchanged.
- Completed the visible breadcrumb UI consolidation pass. `BreadcrumbTrail`
  now owns the shared link, separator, current-page, and spacing variants for
  standalone bottom breadcrumbs, page-bottom breadcrumbs, and content-footer
  breadcrumbs. Simple manual Home/current breadcrumb blocks were migrated to
  that shared surface while BreadcrumbList JSON-LD generation was left
  unchanged.
- Left `/practice` Check, Next/Finish, Skip, mode/pool chips, and share controls
  out of that batch: Check, Next/Finish, and Skip are scoring/session
  transitions; mode and pool chips reset prompt state; share was already using
  the shared result-action component.
- Removed legacy `TranslatorSections.tsx` after search confirmed active routes
  and components import `TranslatorSectionsBasic` instead.
- Remaining duplicated controls are mostly behavior-specific practice, quiz,
  typing, trainer, audio/visual practice, and word-search controls. The map
  keeps scoring, timer, playback, reveal, skip, and flash controls local for
  now. The next implementation batch should stay similarly narrow, such as
  sentence-practice clear/restart visual buttons after focused interaction
  coverage, or a non-visual type-helper cleanup.

## Duplicated Homepage-Only or Home-Like Components

### Decorative Morse Background

- `MorseAmbientBackground` is now the shared implementation for the subtle
  Morse side accents.
- `PageBackdrop` owns root rendering of that shared surface so routes do not
  need page-local decorative Morse markup.
- Verified routes in this pass: `/`, `/audio`, `/morse-code-encoder`,
  `/morse-code-decoder`, `/morse-code-sound-generator`,
  `/name-to-morse-code`, and `/a-in-morse-code`.
- Future work should not add new page-specific Morse background arrays or
  route-local decorative accent components. Adjust the shared surface only
  after visual checks against the homepage.

### Hero and Header Patterns

- `ToolHero` and `PageHero` both use the same hero constants from
  `heroStyles.ts`, but some pages still build headers manually.
- `docs/hero-heading-surface-map.md` is the current detailed map for hero,
  page-heading, section-heading, and eyebrow surfaces.
- `TranslatorSectionsBasic` manually renders the live translator header.
- `WordSeparatorTool` manually renders a hero using the same hero constants.
- Repeated section eyebrow markup exists in home support sections, audio/tool
  support sections, FAQ headings, related tools, and selected route files.
- `SectionEyebrow` now covers the first low-risk support-section batch:
  `HowItWorksAudio`, encoder support, decoder support, word-separator support,
  and sound-generator support.
- Remaining section-eyebrow consolidation should stay batch-specific.
  `ToolHowItWorks` now uses `SectionEyebrow` internally across its six active
  consumers. Full `/practice` and `/typing` support-section migration remains
  deferred because their bodies intentionally differ from `ToolHowItWorks`.
- Longer-term consolidation target: evaluate whether `ToolHero` and `PageHero`
  need a shared lower-level primitive with optional action row and optional
  aside, while preserving current spacing.

### Homepage Support Sections

- Home `HowItWorks` is polished and route-specific.
- `ReferenceSupportSections` repeats similar section rhythm for guide,
  examples, mistakes, comparison, and next-step blocks.
- Route pages such as `/morse-code-words` add local wrappers on top of shared
  `SectionCard`.
- Consolidation target: keep home-specific educational copy unique, but move
  reusable section rhythm and card choices into shared components.

### Toolkit and Related Tools

- `RelatedTools` now uses a shared toolkit renderer with an explicit home/full
  class map.
- Home and non-home hover behavior, badges, and shadow hooks remain separate
  through the existing `mw-toolkit-*` and `mw-related-*` classes.
- The compact-path set remains route-driven and should be audited separately
  before any navigation or route expansion work.

## Duplicated Button Patterns

### Shared Primitives

- `toolControlButtonClass` is the best current button primitive.
- `ToolButton` wraps that primitive for actual buttons.
- `ActionLinks` turns links into button-like controls but has no icon slot or
  centralized action semantics.

### Route-Local Buttons

- `/morse-code-alphabet` has a local `CopyButton`.
- `MorseAudioTranslator` uses route-local class strings for some buttons even
  though `ToolButton` exists.
- `TranslatorSectionsBasic` uses local constants instead of
  `toolControlButtonClass` for many controls.
- Practice, typing, audio quiz, audio practice, word trainer, visual quiz, and
  word-search builder each have local button variants.

### Recommended Button Consolidation

- Add an icon slot to shared action-link primitives only after visual parity is
  locked.
- Move repeated dark-panel buttons to `ToolWorkspace`.
- Move repeated copy-button behavior into a small shared copy button helper.
- Keep high-interaction practice/game buttons unique until their states are
  mapped separately.

## Duplicated Card and Panel Patterns

### Static Surfaces

- `mw-static-surface`, `mw-static-surface-soft`, `mw-static-panel`,
  `mw-static-tile`, and `mw-static-code` exist in `app/app.css`.
- Many routes still add direct `bg-[#fffdf8]`, `bg-[#fffaf2]`, `bg-white`, and
  `rounded-xl` combinations.
- First shared wrappers now exist in `MorseLearningLayout`:
  `StaticPanel`, `StaticTile`, `StaticSectionPanel`, and `StaticCodeBlock`.
- Migrated low-risk exact matches in `ReferenceSupportSections`,
  `MorseContentSections`, encoder support content, and word-separator support
  content.
- Intentionally left local in this pass: rounded-2xl wrapper sections,
  `p-5 sm:p-7` route-specific panels, opacity-adjusted cards, smaller inline
  `p-3` code examples, printable chart surfaces tied to output generation, FAQ
  items, toolkit cards, and practice/typing/quiz panels.
- Consolidation target: continue replacing exact static wrappers in small
  route-family batches, then token the shared wrappers before route-local
  leftovers.

### Tool Panels

- `ToolPanel`, `ToolOutputPanel`, and `ToolTextarea` cover the main tool
  surface.
- `MorseAudioTranslator` and `TranslatorSectionsBasic` duplicate parts of
  those styles locally.
- `WordSeparatorTool` uses shared tool panels and is a good model.

### Reference Cards and Tables

- `ReferenceTable` exists in `MorseLearningLayout`.
- `/morse-code-alphabet` has its own alphabet card and chart section.
- `MorsePhraseLookupTable` is a separate reference surface.
- `SimpleGrid` handles linked and non-linked support tiles.
- Consolidation target: a shared reference-grid or reference-card primitive
  with copy/play action slots.

## Duplicated CTA and Action Rows

- `ActionLinks` is used across route heroes and next-step sections.
- `MorseAnswerCard` has its own next-action row.
- `NameToMorseTool` has tool-output action links.
- Audio and translator surfaces have footer action rows inside output panels.
- Consolidation target: shared `ActionRow` with button/link support, optional
  icon, disabled handling, and dark-panel variants.

## Duplicated Section Wrappers

- `SectionCard` handles split and stacked content sections.
- `ReferenceSupportSections` composes repeated guide sections.
- `/morse-code-words` defines `CardSection`.
- Misc/legal/static routes use manual section wrappers.
- Consolidation target: keep `SectionCard` as the base, then migrate local
  wrappers to shared variants without changing spacing.

## Duplicated FAQ, Breadcrumb, and Toolkit Usage

### FAQ

- `FaqSectionGeneric` has home and default variants, now backed by shared
  internal header, list, and item wrappers.
- Some pages pass `variant="home"` to align with the current route system.
- FAQ shadows are controlled by route and global CSS.
- FAQPage JSON-LD policy remains unchanged: generated leaf pages keep visible
  FAQs without reintroducing FAQPage schema.

### Breadcrumbs

- `BreadcrumbTrail` exists and is used by many expanded routes.
- `BreadcrumbTrail` is the active visible breadcrumb component. There is no
  duplicate `navigation/BreadcrumbTrail` component.
- The simple manual Home/current blocks on `/audio`, `/morse-code-alphabet`,
  `/about`, `/dictionary`, `/how-to-use`, `/misc`, `/practice`, `/typing`,
  `/morse-code-sentence-practice`, and `/morse-code-sound-generator` now use
  `BreadcrumbTrail` with the existing spacing preserved.
- Noindex legal utility pages keep their local top breadcrumbs for now because
  they include a Misc parent crumb and a different separator/font treatment.
- BreadcrumbList JSON-LD remains route-owned and was not rewritten in this
  visual-only pass.

### Toolkit

- Related tools are global in `root.tsx`.
- Compact content pages are selected by path in `RelatedTools`.
- The compact and full variants now share one renderer while preserving their
  existing class hooks.
- The compact-path set should be reviewed after route expansion so future
  route additions do not require hidden layout decisions.

## Duplicated Icon Usage After This Pass

- Shared icon source: `app/client/assets/svg/Icons.tsx`.
- New icons added in this pass:
  `SparklesIcon`, `SmartSettingsIcon`, `SignalPathIcon`, `SunIcon`,
  `TrashIcon`, `UploadIcon`, `EqualizerIcon`, `DownloadIcon`,
  `CheckCircleIcon`, `TuneIcon`, `VolumeIcon`, `VolumeOffIcon`,
  `HeadphonesIcon`, `MoonIcon`, and `ThemeSunIcon`.
- Existing `DownloadIcon`, `CheckCircleIcon`, and `TuneIcon` were updated in
  place to avoid duplicate semantic exports.
- Current icon use is still split across shared components and route-local
  tools. That is acceptable for now because every visible SVG import comes from
  the shared library.
- Future consolidation target: keep icon sizing tied to button size presets,
  not route-specific one-off values.

## Components That Should Remain Unique For Now

- `NavBar`: contains routing, More dropdown search, mobile overlay, scroll
  locking, active-state logic, and future theme-toggle placement.
- `PageBackdrop`: owns the shared root backdrop and should not be merged into
  page sections or replaced with route-local decorative markup.
- `TranslatorSectionsBasic`: central translator logic is mature but dense.
  Refactor it only in small, verified slices.
- `MorseAudioTranslator`: audio export, timing, localStorage, strobe warning,
  and generated WAV behavior make it high-risk.
- Practice, quiz, typing, word trainer, and word-search builder pages: keep
  behavior-specific controls local unless the limited control-state map in
  `docs/practice-typing-control-map.md` marks the batch safe.
- `SocialLinks`: image-backed external links need a separate asset and brand
  review before being generalized.

## Recommended Extraction Order

### 1. Copy and Action Buttons

- Extract shared copy-button behavior with copied state, clipboard fallback,
  icon switching, and dark/light variants.
- Verify on `/`, `/audio`, `/name-to-morse-code`,
  `/morse-code-alphabet`, `/morse-code-numbers`, and one leaf page.

### 2. Action Links and Action Rows

- Add an optional icon slot and dark-panel variant to shared action rows.
- Migrate `ActionLinks`, `MorseAnswerCard` next actions, and name-tool output
  links only after visual parity screenshots.

### 3. Tool Panel Controls

- Move clear, copy, play, export, sound toggle, repeat toggle, flash toggle,
  advanced settings, and slider row patterns into shared tool primitives.
- Verify homepage and `/audio` first because they are source-of-truth surfaces.

### 4. Reference Tables and Copy Cards

- Consolidate alphabet cards, number cards, punctuation reference rows, phrase
  lookup rows, and dictionary rows around shared reference primitives.
- Verify table readability on mobile and desktop.

### 5. Static Panels and Section Wrappers

- The first exact-match static wrapper batch is complete for shared reference
  sections, generated Morse content pages, encoder support sections, and
  word-separator support sections.
- Continue replacing route-local `bg-[#fffdf8]`, `bg-[#fffaf2]`, and
  `bg-[#f7f4ee]` wrapper patterns only where visual parity is direct.
- Keep content unchanged and compare screenshots route by route.
- The manual `ToolHero`/`PageHero` and heading usage map now lives in
  `docs/hero-heading-surface-map.md`. Do not move broad page wrappers until
  the section-eyebrow pass and hero-spacing screenshot coverage are complete.

### 5a. Hero and Heading Primitives

- The first left-aligned line-plus-label section eyebrow batch is complete.
- Do not include section margins, H2 classes, FAQ centered headings, toolkit
  headings, action rows, or broad hero wrappers in follow-up eyebrow batches.
- Verified `/`, `/audio`, `/morse-code-encoder`, `/morse-code-decoder`,
  `/morse-code-sound-generator`, and `/morse-code-word-separator` on desktop
  and mobile with byte-identical before/after screenshots.
- Leave `TranslatorSectionsBasic`, home support headings, practice, typing,
  sentence-practice headings, and remaining utility/static route headings for
  later dedicated passes.
- Next safe target: audit manual breadcrumb UI wrappers or remaining
  static-utility/legal route surfaces with screenshot and structured-data
  checks.

### 6. FAQ, Breadcrumb, and Toolkit

- Manual Home/current breadcrumbs are migrated to `BreadcrumbTrail`; remaining
  legal utility breadcrumbs need a dedicated utility-route pass if they should
  adopt the shared surface.
- Keep the unified toolkit renderer stable while later passes audit compact
  path selection.
- Preserve bottom breadcrumb placement and related-tools spacing.

### 7. Token Introduction

- Introduce light-mode tokens only after the shared surfaces above are stable.
- Replace hard-coded colors in shared components first, then route-local
  leftovers.

## Regression Risks

- Home visual drift from changing shared hero, toolkit, FAQ, or button classes.
- `/audio` layout drift from changing export or advanced controls.
- Broken disabled behavior on links that use `aria-disabled` instead of native
  `disabled`.
- Copy state regressions if clipboard fallback behavior is centralized without
  matching existing routes.
- Strobe warning placement drift when flash controls are refactored.
- Focus-visible changes from moving classes into shared components.
- Broken More dropdown or mobile nav if navbar is changed while preparing the
  future theme toggle.
- Breadcrumb spacing changes above the footer or related tools.
- Dark output panels losing contrast if treated as ordinary cards.

## Tests and Screenshots Needed By Refactor Step

### Copy and Action Buttons

- `npm run typecheck`
- `npm run build`
- Focused route smoke for `/`, `/audio`, `/name-to-morse-code`,
  `/morse-code-alphabet`, `/a-in-morse-code`, and `/contact`.
- Desktop and mobile screenshots for changed button surfaces.
- Clipboard interaction smoke for at least one light button and one dark-panel
  button.

### Tool Panel Controls

- Exercise play, pause, stop, clear, copy, sound toggle, repeat toggle, flash
  warning, advanced settings, and export where supported.
- Screenshot `/` and `/audio` before and after.
- Run focused accessibility smoke if available.

### Reference Tables and Cards

- Screenshot `/morse-code-alphabet`, `/morse-code-numbers`,
  `/morse-code-punctuation`, and `/morse-code-words`.
- Check mobile wrapping, copy button alignment, table readability, and link
  hit areas.

### FAQ, Breadcrumb, and Toolkit

- Screenshot home, one guide, one leaf page, `/audio`, and `/contact`.
- Check FAQ open state, breadcrumb gap above and below, related-tool hover
  state, and mobile layout.

### Navbar and Theme Toggle Phase

- Do not start this until dark tokens exist.
- Screenshot desktop navbar, More dropdown, mobile nav, active route, and
  future theme toggle states.
- Verify keyboard focus, Escape close, outside click close, scroll close, and
  mobile scroll locking.
