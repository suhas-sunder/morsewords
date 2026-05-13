# MorseWords Dark Mode Readiness

This document maps the current light-mode UI surfaces that need consolidation
before dark mode is implemented. It is a planning artifact only. This pass does
not add a theme toggle, dark tokens, route-level dark styles, or dark-mode CSS.

## Current Scope

- Light mode remains the only implemented theme.
- The approved homepage remains the visual source of truth.
- `/audio` remains the closest approved tool-page reference.
- The shared icon library is `app/client/assets/svg/Icons.tsx`.
- The decorative Morse side accents are shared through
  `MorseAmbientBackground` and rendered by `PageBackdrop`; future theme work
  should treat that as one shared decorative surface, not a route-local patch.
- Hero, page-heading, section-heading, and eyebrow surfaces are mapped in
  `docs/hero-heading-surface-map.md`. Future theme work should use that map
  before changing heading colors or introducing tokens.
- The first low-risk support-section eyebrow batch now uses
  `SectionEyebrow`, covering audio, encoder, decoder, word-separator, and
  sound-generator support sections.
- The dedicated `ToolHowItWorks` consumer pass now maps those consumers in
  `docs/tool-how-it-works-consumer-map.md` and routes `ToolHowItWorks`,
  `/practice`, and `/typing` static support-section labels through
  `SectionEyebrow`.
- The first static surface consolidation pass now routes exact-match
  non-interactive wrapper patterns through shared `StaticPanel`, `StaticTile`,
  `StaticSectionPanel`, and `StaticCodeBlock` primitives in
  `MorseLearningLayout`. Migrated surfaces include shared reference support
  cards, generated leaf/reference example cards, encoder support panels, and
  word-separator support panels.
- The FAQ/toolkit visual-surface pass now centralizes FAQ header/list/item
  wrappers inside `FaqSectionGeneric` and routes home/full `RelatedTools`
  rendering through one variant map while preserving current FAQPage JSON-LD
  policy.
- The visible breadcrumb UI pass now centralizes simple breadcrumb link,
  separator, current-page, and spacing variants in `BreadcrumbTrail` while
  preserving the route-owned BreadcrumbList JSON-LD policy.
- The utility/legal wrapper pass now routes the repeated privacy, terms, and
  cookies policy shell/header/content-panel surfaces through
  `UtilityPageShell`, `UtilityPageHeader`, and `UtilityContentPanel`. The
  remaining privacy and terms top breadcrumbs also use `BreadcrumbTrail` via a
  legal-header variant that preserves the existing Misc parent crumb and `>`
  separator treatment.
- The light-mode tokenization pass is complete for the major shared surfaces.
  `app/app.css` now owns the semantic `--mw-*` light tokens, shared utility
  classes, and token-backed global focus, shadow, static-surface, FAQ, toolkit,
  breadcrumb, nav, footer, and form rules.
- Shared components now layer semantic `mw-*` classes or `var(--mw-*)` values
  over the existing Tailwind classes so current light-mode output stays visually
  aligned while the next pass can swap token values centrally.
- Some route-local interactive tools still contain hard-coded Tailwind color
  classes. Those were intentionally left in place when they are behavior-heavy,
  generated-output-specific, or isolated route art rather than shared visual
  primitives.

## A. Page Groups

### Homepage and Tool Hub

- `/` uses `TranslatorSectionsBasic`, `HowItWorks`, home FAQ, and the compact
  `RelatedTools` toolkit.
- The homepage uses `PageBackdrop`, the main cream page background, warm input
  panels, dark output panels, and homepage-specific toolkit hover behavior.
- The home page should be protected during token work. Token introduction must
  first reproduce the current appearance exactly.

### Encoder, Decoder, and Audio Tools

- Main translator surface: `TranslatorSectionsBasic`.
- Audio page: `app/client/components/audio/MorseAudioTranslator.tsx`.
- Word separator: `WordSeparatorTool`.
- Older route-local surfaces still exist in `morse-code-sound-generator` and
  some route-local tool implementations.
- These tools combine warm panels, dark output panels, sliders, toggles, copy
  buttons, export/download buttons, strobe warnings, and localStorage-backed
  controls.

### Learning, Practice, and Typing Pages

- Practice and typing pages use `practiceStyles`, route-local controls, and
  practice-specific components.
- Audio practice, audio quiz, visual quiz, word trainer, sentence practice, and
  word-search builder all use their own button and panel patterns.
- These pages should be grouped for dark QA because they contain interactive
  states, scoring feedback, reveal/check flows, strobe warnings, and progress
  status UI.

### Hubs and Reference Pages

- Hubs include `/morse-code-alphabet`, `/morse-code-numbers`,
  `/morse-code-words`, `/morse-code-punctuation`, `/dictionary`,
  `/international-morse-code-reference`, and `/sitemap`.
- These pages use tables, grids, cards, copy controls, inline code surfaces,
  and reference-style links.
- They should migrate to shared reference table, card, and action primitives
  before dark mode.

### Leaf Pages

- Letter, number, phrase, and symbol pages are routed through
  `MorseContentSections`.
- Representative routes include `/a-in-morse-code`, `/0-in-morse-code`,
  `/hello-in-morse-code`, `/space-in-morse-code`, and `/colon-in-morse-code`.
- Their shared surfaces are `MorseAnswerCard`, `SectionCard`, `SimpleGrid`,
  `ReferenceSupportSections`, `FaqSectionGeneric`, and `BreadcrumbTrail`.

### Guides

- Routes such as `/how-to-read-morse-code` and
  `/how-to-separate-words-in-morse-code` use `MorseGuidePage` and shared guide
  support sections.
- They are lower interaction risk, but they contain many links, static panels,
  inline code, FAQ items, and breadcrumbs.

### Contact and Trust Pages

- `/contact`, `/about`, `/sources`, privacy, terms, cookies, and socials pages
  use a mix of `PageHero`, `SectionCard`, `SimpleGrid`,
  utility-policy primitives, shared breadcrumbs, and route-specific static
  surfaces.
- They should use the same tokenized link, card, FAQ, and breadcrumb surfaces
  as the rest of the site before final dark QA.

### Sitemap and Static Utility Pages

- `/sitemap` uses route-local section lists and link cards.
- Privacy, terms, and cookies policy documents now share their wrapper
  primitives. `/misc`, `/misc/socials`, and `/sitemap` remain route-local
  because their support-hub, external-link, and directory semantics differ
  from policy documents.
- These remaining route-local utility surfaces should be tokenized explicitly,
  not handled with one-off dark styles.

## B. Shared UI Surfaces

These surfaces need planned light and dark theme coverage.

- Body and page background: `body`, `PageBackdrop.paperBackground`,
  `MorseAmbientBackground`, and `styles.page`.
- Navbar: desktop links, More dropdown, search input, active states, mobile
  overlay, mobile search, close/open buttons, and logo area.
- Footer and social area: neutral footer, social cards, image-backed social
  icons, link hover states, and footer copy.
- Hero sections: `ToolHero`, `PageHero`, hero eyebrow line, H1, lead text,
  aside panels, and header action rows.
- Section headings: left-aligned section eyebrows, centered FAQ eyebrows,
  support-section H2s, route-local reference section headings, and toolkit
  headings. These need consolidation before heading color tokens are applied.
  `SectionEyebrow` is the first shared primitive for the left-aligned
  support-section eyebrow role, including the `ToolHowItWorks` route family.
- Dark answer panels: `ToolOutputPanel`, `DarkNote`, pre/code blocks, output
  footer buttons, and status text.
- Tool panels: `ToolPanel`, `ToolTextarea`, text inputs, select inputs, range
  inputs, panel headers, badges, and footers.
- Cards: `StaticPanel`, `StaticTile`, `StaticSectionPanel`, toolkit cards,
  related tool cards, reference cards, social cards, and route-local cards.
- Nested output and input areas: Morse output blocks, inline code chips,
  static tiles, table cells, and generated preview areas.
- Forms: inputs, textareas, selects, labels, placeholders, disabled fields,
  focus outlines, and validation helper text.
- Copy, download, upload, delete buttons: shared action buttons, dark-panel
  buttons, route-local buttons, export buttons, and copied/success states.
- Primary and secondary buttons: `toolControlButtonClass`, `ToolButton`,
  route-local button strings, `ActionLinks`, and FAQ summaries.
- Disabled buttons: dark-panel disabled treatment, light disabled treatment,
  `aria-disabled` links, and native disabled buttons.
- Focus rings: global `.mw-page-content` focus rules, input focus suppression,
  range input focus, and route-local focus classes.
- FAQ items: `FaqSectionGeneric` now owns shared header/list/item wrappers for
  the home and default variants, including non-home shadow suppression, open
  states, answer surfaces, arrow indicators, and JSON-LD parity.
- Breadcrumbs: `BreadcrumbTrail`, its standalone/page-bottom/content-footer
  spacing variants, legal-header variant, spacing below related tools, text
  colors, separators, focus rings, and link hover states.
- Tables and grids: `ReferenceTable`, alphabet chart, phrase lookup table,
  sitemap groups, dictionary tables, and route-local lookup grids.
- Code and Morse output blocks: `StaticCodeBlock`, `mw-static-code`,
  `mw-static-tile`, dark pre blocks, Morse rhythm labels, and inline examples.
- Alert, error, and success states: strobe warnings, unsupported character
  messages, copied feedback, puzzle notices, quiz feedback, and status banners.
- Shadows, borders, and dividers: button shadow variables, shadow suppression,
  transparent border overrides, divider lines, and card outlines if added later.
- Icons: all rendered icons should come from `Icons.tsx`, use `currentColor`,
  and inherit the parent button or link color.
- Links: content links, action links, related links, footer/nav links, and
  external social links.
- Tooltips, popovers, and dropdowns: More dropdown, mobile nav, details/summary
  sections, and any future theme menu.

## C. Current Light-Mode Token State

### Tokenized Shared Colors

- `app/app.css` defines the semantic light-mode token set in `:root`.
- `body`, `PageBackdrop.paperBackground`, shared static surface classes, global
  focus rules, button shadows, range accent color, and FAQ/toolkit hover rules
  now read from `--mw-*` tokens.
- `MorseAmbientBackground` now uses shared ambient-accent token classes instead
  of hard-coded pale sky/navy opacity classes.
- Shared style objects in `pageStyles.ts`, `audioStyles.ts`, and
  `practiceStyles.ts` now reference CSS variables for their light values.
- Shared component classes still keep their existing Tailwind color utilities
  beside semantic classes for reviewability and fallback, but the semantic
  classes own the final computed color via the central CSS token layer.

### Tokenized Shadows

- `app/app.css` now maps `--mw-button-shadow` and
  `--mw-button-shadow-disabled` through `--mw-shadow-soft` and
  `--mw-shadow-soft-disabled`.
- Cards and panels still mostly avoid custom shadows, preserving the current
  light-mode design. Dark mode can adjust shadow tokens centrally if needed.

### Tokenized Borders

- Global CSS suppresses many border utilities under `.mw-page-content`.
- Border, divider, panel-border, and outline roles now exist as semantic tokens,
  with light mode intentionally keeping most structural borders transparent.
- Existing focus styles use outline colors rather than borders and should stay
  separate from structural borders.

### Tokenized Backgrounds

- Warm surfaces are fixed through `.mw-static-surface`,
  `.mw-static-surface-soft`, `.mw-static-panel`, `.mw-static-tile`, and
  `.mw-static-code`; those classes now read from semantic tokens.
- Exact-match non-interactive static wrappers now have shared component
  boundaries through `StaticPanel`, `StaticTile`, `StaticSectionPanel`, and
  `StaticCodeBlock`, and those primitives are token-backed.
- Dark output panels, navbar, footer, social cards, utility policy panels,
  support bands, translator shell surfaces, and shared card opacities now have
  semantic light tokens.
- Route-local cards still sometimes use direct `bg-[#fffdf8]`, `bg-[#fffaf2]`,
  `bg-white`, or slate classes. These are intentionally deferred when they are
  page-specific or behavior-heavy rather than shared surfaces.

### Tokenized Text Colors

- Shared headings, body copy, muted text, faint labels, content links,
  dark-panel text, output text, code text, nav text, footer text, social text,
  and breadcrumb text now use semantic classes or CSS variables.
- Dark panels still use their current light-mode dark-surface text roles. They
  are separate tokens because output panels need to remain high contrast in
  both light and future dark themes.

### Page-Specific Classes That Remain

- `TranslatorSectionsBasic` has many local constants that duplicate
  `ToolWorkspace` behavior, but its central visual constants now use semantic
  light tokens.
- Hero and heading duplication is mapped in
  `docs/hero-heading-surface-map.md`; repeated line-plus-label eyebrow markup
  is being consolidated before heading colors are tokenized. The first
  `SectionEyebrow` batches cover low-risk support sections, `ToolHowItWorks`
  consumers, and `/practice` plus `/typing` static support labels.
- `MorseAudioTranslator` and the sound-generator tool still have route-local
  button constants, labeled input/select helpers, and export controls. They
  remain intentionally local because they are behavior-heavy audio/export
  surfaces and should be refactored only with interaction coverage.
- `/morse-code-alphabet`, printable chart, practice, typing, quiz, trainer,
  audio-practice, and word-search builder still include route-local color
  classes in behavior-heavy controls or dense reference/output areas.
- `NavBar`, `RelatedTools`, `FaqSectionGeneric`, and `BreadcrumbTrail` now have
  token-backed shared class maps and global hover/focus rules.
- `BreadcrumbTrail` now owns simple visible breadcrumb variants and the
  noindex privacy/terms legal-header breadcrumb. Cookies and socials keep their
  existing shared bottom breadcrumb text and route-owned JSON-LD semantics.

### Remaining One-Off Hard-Coded Colors

- Generated SVG card colors inside `TranslatorSectionsBasic` are intentionally
  still hard-coded because they define exported image output, not the page UI.
  Changing them would alter tool output behavior.
- Flash overlays remain `bg-white` in audio tools because the strobe behavior
  is an intentional light flash, not a theme surface.
- Some success and error statuses still use route-local utility classes such as
  copied feedback on dark panels. These should become state tokens in the dark
  pass only where screenshots confirm the current contrast is preserved.
- Practice, typing, quiz, audio, printable chart, and word-search route-local
  controls still contain direct Tailwind colors where behavior and state
  handling are tightly coupled.

### Homepage-Only Components That Should Become Shared Later

- Home `HowItWorks` contains polished section rhythm and surface treatment that
  route support sections partially duplicate.
- The compact home toolkit and full non-home toolkit in `RelatedTools` now use
  one renderer with different class names and hover behavior preserved through
  the variant map.
- Hero constants in `heroStyles.ts` are the right source for future shared
  hero variants.

## D. Implemented Light Token Map

The light-mode token layer is implemented in `app/app.css`. Dark values are not
implemented yet. The next pass should add dark token values and theme wiring
without re-tokenizing each route.

| Token | Current light value | Intended surface | Main consumers |
| --- | --- | --- | --- |
| `--mw-page-bg` | `#f5f2eb` | Page background | `body`, `PageBackdrop`, style objects |
| `--mw-page-bg-soft` | `rgba(255, 250, 242, 0.35)` | Soft full-width bands | home support sections |
| `--mw-surface` | `#fffdf8` | Primary warm surface | buttons, strobe warning, static rows |
| `--mw-surface-muted` | `#fffaf2` | Muted warm surface | secondary buttons, table rows |
| `--mw-surface-card` | `rgba(255, 253, 248, 0.86)` | Toolkit and card surfaces | `RelatedTools`, shared cards |
| `--mw-static-surface-bg` | `rgba(247, 244, 238, 0.72)` | Static content surface | `.mw-static-surface`, phrase table header |
| `--mw-static-panel-bg` | `rgba(247, 244, 238, 0.58)` | Static panels | `StaticPanel`, `StaticSectionPanel` |
| `--mw-heading` | `#082f49` | Main heading text | hero constants, sections, FAQ, toolkit |
| `--mw-text-muted` | `#334155` | Body/support text | shared content sections, cards, breadcrumbs |
| `--mw-text-soft` | `#475569` | Softer helper text | form helpers, utility copy |
| `--mw-text-faint` | `#64748b` | Small metadata labels | badges, eyebrows, footer faint text |
| `--mw-link` | `#0c4a6e` | Content links | breadcrumbs, legal links, support links |
| `--mw-panel-dark` | `#020617` | Dark output panels | `ToolOutputPanel`, dark notes, quick links |
| `--mw-output-text` | `#e0f2fe` | Text on dark panels | output blocks, dark-panel labels |
| `--mw-output-soft` | `#e2e8f0` | Secondary dark-panel text | output panel helper copy |
| `--mw-code-bg` | `#f2eee6` | Static code and tiles | `StaticCodeBlock`, `.mw-static-code` |
| `--mw-button-primary-bg` | `#020617` | Primary controls | `toolControlButtonClass`, action controls |
| `--mw-button-secondary-bg` | `#fffdf8` | Secondary controls | shared buttons, FAQ summaries |
| `--mw-button-dark-panel-bg` | `rgba(51, 65, 85, 0.95)` | Output-panel buttons | copy/clear/export controls |
| `--mw-button-disabled-bg` | `rgba(255, 255, 255, 0.55)` | Disabled light controls | `toolControlButtonClass` |
| `--mw-input-bg` | `rgba(255, 255, 255, 0.88)` | Tool input panels | `ToolPanel`, translator panels |
| `--mw-output-bg` | `#020617` | Tool output panels | `ToolOutputPanel`, translator output |
| `--mw-focus-ring` | `#38bdf8` | Focus ring | global focus, range controls |
| `--mw-shadow-soft` | Existing button shadow | Button depth | `.mw-page-content` button shadow |
| `--mw-nav-bg` | `#171717` | Navbar | `NavBar` desktop and mobile |
| `--mw-footer-bg` | `#171717` | Footer | `Footer` |
| `--mw-ambient-accent` | `rgba(8, 47, 73, 0.34)` | Decorative Morse accents | `MorseAmbientBackground` |

## E. Risk Areas

### Navy and Dark Panels

- `bg-slate-950` is already used as a brand/action surface in light mode.
- A dark page background may make these panels blend into the page unless
  output panels get a separate contrast token.
- Dark hover flips on light buttons need special handling because the hover
  target may match the dark page background.

### Shadows

- Current button shadows are tuned for cream backgrounds.
- In dark mode, the same shadow can look muddy or disappear.
- Focus rings must remain visible without relying on shadow.

### Dark Cards Against Cream Backgrounds

- Toolkit quick links and output panels rely on contrast against a cream page.
- In dark mode, these may need a different role such as elevated dark panel,
  not simply the same slate color on a dark page.

### Icons

- Icons now inherit `currentColor`, which is correct for theming.
- Low-contrast risk remains where a parent button uses muted text colors in
  disabled or inactive states.
- Future theme toggle icons should use `MoonIcon` and `ThemeSunIcon` from the
  shared library, not inline SVG.

### Inputs, Textareas, and Output Blocks

- Input-like fields suppress focus shadows globally.
- Textareas and selects use transparent or cream backgrounds and fixed text
  classes.
- Output panels use dark backgrounds in light mode, so their dark-mode design
  needs a separate semantic role.

### Duplicated Components

- Route-local buttons and cards will make page-by-page dark mode tempting.
- Consolidate before token rollout to avoid scattered `dark:` classes and
  inconsistent hover, focus, and disabled states.

## F. Proposed Phased Implementation Plan

### Phase 1: Icon System and Audit

- Add all provided icons to the shared React icon module.
- Use icons only in existing actions where they improve clarity.
- Document dark-mode and consolidation risks.
- Do not add theme state, theme toggle, or dark tokens.

### Phase 2: Component and Style Consolidation With No Visual Change

- Move repeated button, action-link, card, static-panel, FAQ, breadcrumb, and
  reference-table patterns into shared components.
- Continue static surface consolidation in narrow route-family batches. The
  first `StaticPanel`/`StaticTile`/`StaticSectionPanel`/`StaticCodeBlock` batch
  is complete for low-risk exact matches; remaining local surfaces should be
  migrated only after screenshot-backed parity checks.
- Consolidate the mapped hero, heading, and eyebrow primitives in small
  screenshot-backed batches. The first `SectionEyebrow` batch is complete,
  `ToolHowItWorks` now uses that primitive, and the FAQ/toolkit surface pass is
  complete. Keep hero wrappers, trainer workspace headers, and behavior-heavy
  practice or typing controls in later focused batches.
- Keep the shared `BreadcrumbTrail` spacing variants stable until token work;
  do not reintroduce route-local Home/current or legal-header breadcrumb markup.
- Treat the utility/legal wrapper audit as closed for tokenization: privacy,
  terms, and cookies policy documents are consolidated, while `/misc/socials`
  and `/sitemap` remain intentionally route-local because they are not policy
  document layouts.
- Keep home and `/audio` visually unchanged.
- Verify route groups with screenshots before and after each extraction.

### Phase 3: Introduce Light-Mode CSS Tokens Without Changing Appearance

- Completed. Semantic CSS variables now exist for light mode only.
- Completed. Major shared surfaces now consume token-backed classes or CSS
  variables.
- Completed. Route-local hard-coded colors are documented where consolidation
  remains intentionally deferred.
- No dark selector, theme toggle, localStorage persistence, `dark` classes, or
  dark-mode behavior was added.

### Phase 4: Implement Dark Tokens and Navbar Toggle

- Add dark token values after Phase 3 proves light-mode parity.
- Add a navbar theme toggle using `MoonIcon` and `ThemeSunIcon`.
- Persist the chosen theme locally.
- Keep light mode as the default.

### Phase 5: Visual QA and Route-Group Regression Testing

- QA desktop and mobile screenshots for each route group.
- Exercise keyboard focus, copy/download, audio toggles, disabled states,
  dropdowns, FAQ open states, forms, and strobe warning placement.
- Run typecheck, build, route smoke, accessibility smoke, and focused e2e
  before shipping.
