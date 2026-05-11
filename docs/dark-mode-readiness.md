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
- Current styling still depends heavily on Tailwind color classes, style
  objects, route-local button classes, and global CSS overrides.

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
  use a mix of `PageHero`, `SectionCard`, `SimpleGrid`, manual breadcrumbs,
  and static surfaces.
- They should use the same tokenized link, card, FAQ, and breadcrumb surfaces
  as the rest of the site before final dark QA.

### Sitemap and Static Utility Pages

- `/sitemap` uses route-local section lists and link cards.
- Legal and misc pages use route-local structures and manual breadcrumb blocks.
- These should not be handled with one-off dark styles.

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
- Dark answer panels: `ToolOutputPanel`, `DarkNote`, pre/code blocks, output
  footer buttons, and status text.
- Tool panels: `ToolPanel`, `ToolTextarea`, text inputs, select inputs, range
  inputs, panel headers, badges, and footers.
- Cards: static panels, toolkit cards, related tool cards, reference cards,
  social cards, and route-local cards.
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
- FAQ items: home variant, default variant, non-home shadow suppression, open
  states, answer surfaces, arrow indicators, and JSON-LD parity.
- Breadcrumbs: `BreadcrumbTrail`, manual breadcrumb navs, spacing below related
  tools, text colors, and link hover states.
- Tables and grids: `ReferenceTable`, alphabet chart, phrase lookup table,
  sitemap groups, dictionary tables, and route-local lookup grids.
- Code and Morse output blocks: `mw-static-code`, `mw-static-tile`, dark pre
  blocks, Morse rhythm labels, and inline examples.
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

## C. Current Light-Mode Style Dependencies

### Hard-Coded Colors

- `app/app.css` defines `body` background and the static surface classes with
  fixed cream values.
- `PageBackdrop.tsx` exports `paperBackground` as `#f5f2eb`.
- `MorseAmbientBackground.tsx` uses the homepage-approved hard-coded pale
  sky/navy opacity classes for decorative side accents. These must become
  shared decorative-accent roles during token work rather than route-local
  overrides.
- Shared components use direct classes such as `bg-[#fffdf8]`,
  `bg-[#fffaf2]`, `bg-slate-950`, `text-sky-950`, `text-slate-700`,
  `text-sky-100`, and `bg-neutral-900`.
- Style objects in `pageStyles.ts`, `audioStyles.ts`, and `practiceStyles.ts`
  need a separate pass because inline values cannot switch themes cleanly.

### Hard-Coded Shadows

- `app/app.css` owns `--mw-button-shadow` and
  `--mw-button-shadow-disabled`.
- Cards and panels mostly avoid custom shadows, but buttons and summaries use
  global shadow rules. Dark mode will need a different shadow strategy because
  light-mode shadows may become invisible or muddy.

### Hard-Coded Borders

- Global CSS suppresses many border utilities under `.mw-page-content`.
- This means a future dark mode cannot depend on scattered border utilities
  until the border strategy is intentionally rebuilt.
- Existing focus styles use outline colors rather than borders and should stay
  separate from structural borders.

### Hard-Coded Backgrounds

- Warm surfaces are fixed through `.mw-static-surface`,
  `.mw-static-surface-soft`, `.mw-static-panel`, `.mw-static-tile`, and
  `.mw-static-code`.
- Dark output panels are fixed with `bg-slate-950`.
- Navbar and footer are fixed with `bg-neutral-900`.
- Route-local cards often use direct `bg-[#fffdf8]` or `bg-white` classes.

### Text Colors That Need Dark Treatment

- `text-slate-950`, `text-slate-900`, `text-slate-700`,
  `text-slate-600`, `text-slate-500`, `text-sky-950`, and `text-sky-900`
  will fail on dark surfaces unless they are tokenized.
- Dark panels already use `text-slate-200`, `text-slate-300`, and
  `text-sky-100`; these may need separate dark-theme roles because they are
  already dark-surface values in light mode.

### Page-Specific Classes Instead of Shared Classes

- `TranslatorSectionsBasic` has many local constants that duplicate
  `ToolWorkspace` behavior.
- `MorseAudioTranslator` has route-local button constants and local labeled
  input/select helpers.
- `/morse-code-alphabet` has route-local copy buttons, sections, and cards.
- `/morse-code-words` has a local `CardSection` wrapper and a route-local link
  class.
- `NavBar`, `RelatedTools`, and `FaqSectionGeneric` each own behavior that
  should be tokenized before dark mode.

### Duplicated Button, Card, and Panel Styles

- Shared `toolControlButtonClass` is the best current button primitive, but
  many routes still build button class strings manually.
- `ActionLinks` creates button-like links but has no icon slot or variant map.
- `ToolPanel`, `ToolOutputPanel`, `SectionCard`, `SimpleGrid`,
  `ReferenceSupportSections`, and route-local sections overlap in purpose.
- Static panels use both shared classes and direct Tailwind classes.

### Homepage-Only Components That Should Become Shared Later

- Home `HowItWorks` contains polished section rhythm and surface treatment that
  route support sections partially duplicate.
- The compact home toolkit and full non-home toolkit in `RelatedTools` are
  almost the same shape but use different class names and hover behavior.
- Hero constants in `heroStyles.ts` are the right source for future shared
  hero variants.

## D. Proposed Token Map

Do not implement these yet. Phase 3 should introduce light-mode tokens first
and prove that the rendered site is visually unchanged.

| Token | Light role | Dark-mode role to define later |
| --- | --- | --- |
| `--mw-page-bg` | Current `#f5f2eb` page background | App background |
| `--mw-surface` | Main `#fffdf8` surfaces | Primary raised surface |
| `--mw-surface-muted` | Current `#fffaf2` and soft cream surfaces | Muted surface |
| `--mw-panel-dark` | Current `bg-slate-950` output panel | High-contrast answer panel |
| `--mw-border` | Currently mostly transparent | Subtle structural border |
| `--mw-border-strong` | Rare stronger dividers | Strong divider and outline |
| `--mw-text` | Current `#111317` and slate text | Primary readable text |
| `--mw-text-muted` | Slate 500 to 700 support text | Secondary text |
| `--mw-link` | Current sky/navy link color | Default content link |
| `--mw-link-hover` | Current hover sky/navy behavior | Hover and active link |
| `--mw-button-primary-bg` | `bg-slate-950` primary buttons | Primary button background |
| `--mw-button-primary-text` | `text-sky-100` or white | Primary button text |
| `--mw-button-secondary-bg` | `#fffdf8` and `#fffaf2` buttons | Secondary button background |
| `--mw-button-secondary-text` | Slate/navy secondary text | Secondary button text |
| `--mw-focus-ring` | Sky focus outline | Focus outline for both themes |
| `--mw-shadow-soft` | Button shadow and light depth | Dark-safe soft shadow |
| `--mw-shadow-panel` | Future panel depth if needed | Dark-safe panel depth |

Additional tokens may be useful after consolidation:

- `--mw-output-text`
- `--mw-output-muted`
- `--mw-code-bg`
- `--mw-code-text`
- `--mw-danger-text`
- `--mw-success-text`
- `--mw-warning-text`
- `--mw-nav-bg`
- `--mw-nav-text`
- `--mw-nav-muted`

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
- Keep home and `/audio` visually unchanged.
- Verify route groups with screenshots before and after each extraction.

### Phase 3: Introduce Light-Mode CSS Tokens Without Changing Appearance

- Add semantic CSS variables for light mode only.
- Replace hard-coded colors in shared surfaces first.
- Keep route-local hard-coded colors only where consolidation is intentionally
  deferred and documented.

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
