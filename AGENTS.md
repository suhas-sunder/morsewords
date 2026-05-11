# MorseWords Agent Guidance

This file is durable repo guidance for future Codex passes. Keep it current with
the implementation. Do not paste one-off phase prompts here.

## 1. Project identity

- MorseWords is the friendly way to learn and use Morse code.
- It should still target high-intent search terms such as "Morse code
  translator", "Morse code decoder", "Morse code encoder", "Morse code audio",
  "Morse code alphabet", "Morse code dictionary", and "Morse code practice".
- MorseWords should not feel like only a commodity translator. The product is a
  beginner-friendly Morse learning and practice system.
- Product flow: translate it -> hear it -> practice it -> review weak spots ->
  return for a short session.
- The site should feel modern, approachable, beginner-friendly, practical,
  lightly playful, and less old-school than traditional ham-radio utilities.
- Do not overclaim adaptive learning, certification, official status, full
  fluency, community/cohort features, or real-content practice if those features
  are not implemented.

## 2. Source-of-truth process

- The current approved home page is the visual source of truth.
- The current polished `/audio` page can be used as a tool-page consistency
  reference where it matches the home system.
- Before matching another page to home or audio, inspect the actual
  implementation and computed styles. Do not guess colors, spacing, button
  sizes, line heights, or layout rhythm.
- If another page differs from home, move that page toward home, not the other
  way around.
- If a shared component affects home, preserve home behavior exactly.
- Use these source files first when checking the current system:
  `app/routes/home.tsx`, `app/client/components/home/*`,
  `app/client/components/shared/heroStyles.ts`,
  `app/client/components/shared/ToolWorkspace.tsx`,
  `app/client/components/shared/TranslatorSectionsBasic.tsx`,
  `app/client/components/shared/MorseLearningLayout.tsx`,
  `app/client/components/navigation/RelatedTools.tsx`,
  `app/client/components/shared/FaqSectionGeneric.tsx`,
  `app/client/components/shared/PageBackdrop.tsx`, `app/app.css`,
  `app/root.tsx`, `app/client/components/navigation/NavBar.tsx`, and
  `app/client/components/navigation/Footer.tsx`.

## MorseWords page design rules

- The homepage is the visual source of truth for new pages.
- New SEO/content routes must not use narrow article containers unless the
  homepage uses that pattern for the same job.
- Avoid nested cards, decorative background boxes inside cards, and filled
  mini-surfaces that do not function as inputs, outputs, or code/reference
  blocks.
- Reuse shared site sections before creating new ones. Do not invent separate
  toolkit, all-tools, or social sections when existing shared components can be
  reused or given a small variant.
- Match homepage spacing, max widths, section rhythm, and card padding before
  adjusting route-specific details.
- Buttons and interactive elements must use shared button patterns, include
  `cursor-pointer`, visible hover behavior, focus-visible states, and honest
  disabled behavior.
- New pages must provide user-first content that directly answers the query,
  gives practical examples, and offers a useful next action without thin SEO
  filler.
- Route-specific content should be substantial enough for search quality while
  staying specific, accurate, and not spammy.
- Before completing any new route, compare it visually against the homepage and
  at least one approved tool page such as `/audio`.

## 3. Color profile

Use the existing palette only.

- Page background: `#f5f2eb`, defined by `paperBackground` in
  `PageBackdrop.tsx` and by `body` in `app/app.css`.
- Warm static surface: `rgba(247, 244, 238, 0.72)` via `.mw-static-surface`.
- Soft warm surface: `rgba(255, 250, 242, 0.48)` via
  `.mw-static-surface-soft`.
- Static panel: `rgba(247, 244, 238, 0.58)` via `.mw-static-panel`.
- Static tile/code surface: `#f2eee6` via `.mw-static-tile` and
  `.mw-static-code`.
- Main off-white panel/button surface: `#fffdf8`.
- Secondary warm off-white: `#fffaf2`.
- Main body text in style objects: `#111317`.
- Heading navy in style objects: `#08324f`; Tailwind page headings usually use
  `text-sky-950`.
- Main dark output/action panel: `bg-slate-950` (Tailwind slate-950).
- Dark hover/action state: `#0f172a` or `bg-slate-900`.
- Body/support text: `text-slate-700`.
- Muted text: `text-slate-600`, `text-slate-500`, or style-object `#5a616c`.
- Accent blue: `#38bdf8` for range inputs and focus color mixing; section
  lines commonly use `bg-sky-800`.
- Nav/footer background: `bg-neutral-900`.
- Nav/footer active or secondary text: `text-sky-200`.
- Dark-panel internal buttons: `bg-slate-700/95 text-slate-100`, hovering to
  `bg-slate-800 text-white`.
- Disabled dark-panel buttons: `bg-slate-800/60 text-slate-500`.
- Disabled light buttons: `bg-white/55 text-slate-400` or
  `bg-[#fffaf2] text-slate-400`.
- Strobe/flash warning copy is calm warning text; do not introduce new warning
  colors unless specifically requested.
- No random blues or grays. Prefer existing `sky`, `slate`, `neutral`, and warm
  cream tokens/classes already present.
- No gradients.
- No new colors unless the user explicitly requests them.

## 4. Typography profile

- Fonts are loaded in `app/root.tsx` and defined in `app/app.css`:
  `--font-sans` / `--font-body` = DM Sans, `--font-heading` = Space Grotesk,
  and `--font-mono` = Space Mono.
- Headings use Space Grotesk through `:where(h1, h2, h3, .font-heading)`.
- Home/audio H1 source: `HERO_TITLE_CLASS` in `heroStyles.ts`:
  `mt-3 text-4xl font-black leading-tight tracking-tight text-sky-950
  sm:text-5xl lg:text-6xl`.
- Computed desktop H1 at 1440px is about `60px` font size, `75px` line height,
  `font-weight: 900`, and `letter-spacing: -1.5px`.
- H2/H3 support headings commonly use `text-3xl sm:text-4xl` for section
  titles and `text-2xl` for subsection titles, with `font-extrabold` and
  `text-sky-950`.
- Eyebrow labels use a short sky line plus mono uppercase label:
  `font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-900`.
- Smaller subsection metadata labels use `font-mono text-xs font-bold uppercase
  tracking-[0.14em] text-slate-500`.
- Body/support text commonly uses `text-base leading-relaxed text-slate-700`;
  many lead/support paragraphs use `sm:text-lg`.
- Hero lead source: `HERO_LEAD_CLASS` =
  `mt-4 max-w-[68ch] text-base leading-relaxed text-slate-700 sm:text-lg`.
- Header intro text can be wider where it matches the home/audio hero.
- Body, support, FAQ answers, SEO sections, and explanatory paragraphs should
  generally stay around 80 characters per line or less. Use `max-w-[58ch]`,
  `max-w-[68ch]`, grid columns, or layout constraints. Do not insert awkward
  manual line breaks.
- Links inside content use descriptive text, `font-semibold text-sky-900`, and
  `underline-offset-4 hover:underline` where currently used.
- Metadata/badges should remain mono, small, uppercase, and non-button-like
  unless the element is actually interactive.

## 5. Layout and spacing profile

- Root layout: `app/root.tsx` renders `NavBar`, then a `relative min-h-screen
  overflow-hidden` page background with `PageBackdrop`, then
  `.mw-page-content`, followed by footer inside `data-nosnippet`.
- Shared page wrap from `pageStyles.ts` / `audioStyles.ts`: max width `1120`,
  margin `0 auto`, padding `8px clamp(16px, 3vw, 32px) 36px`.
- Home route main tool wrapper: `max-w-[1120px] px-4 pb-0 pt-2 sm:px-6 sm:pt-4
  lg:px-8`.
- Home/audio/content hero starts close to the nav but with breathing room. At a
  1440px viewport, computed nav-to-eyebrow spacing is around 20-28px depending
  on route wrapper.
- Hero section source: `HERO_SECTION_CLASS = "mw-tool-section mt-0"` and
  `HERO_HEADER_CLASS = "tool-header pb-1 pt-2 sm:pt-3"`.
- Content/support wide sections commonly use max width `1160px`, full-width
  soft backgrounds via `relative left-1/2 w-screen max-w-[100vw]
  -translate-x-1/2`, and vertical padding around `py-8` to `py-12`.
- Home how-it-works section uses `bg-[#fffaf2]/35 px-4 pb-8 pt-9 sm:px-6
  sm:pb-10 sm:pt-12 lg:px-8`, max width `1160px`.
- Audio support section uses `mt-14`, full-width soft background
  `bg-[#fffaf2]/35`, and `py-12`.
- The primary toolkit section uses max width `1040px`, `px-4 sm:px-6 lg:px-8`,
  with inner `pb-8 sm:pb-10`; home overrides the surrounding background to
  transparent.
- Breadcrumbs use `BreadcrumbTrail` / audio route pattern:
  `mx-auto w-full max-w-[1120px] px-4 pb-12 text-sm text-slate-600 sm:px-6
  lg:px-8`.
- Breadcrumb spacing below should visually match the space below the all-tools
  section. Do not guess this gap; inspect the current rendered page.
- FAQ sections use `mt-10 sm:mt-12` by default and `mt-8 sm:mt-10` on home.
- Social/footer spacing: `SocialLinks` uses `px-4 pb-20 pt-10 sm:px-6 sm:pb-24
  sm:pt-12`; footer inner uses `max-w-6xl px-4 py-10 sm:px-6 lg:px-8`.
- Two-column support grids should have enough gap. Home examples use `gap-7`,
  `gap-8`, `lg:gap-12`, or `lg:gap-16` depending on section width.
- Mobile should stack cleanly with `grid gap-*`, `sm:grid-cols-*`, and
  `lg:grid-cols-*`. Avoid desktop-only spacing that causes mobile blank bands.
- Avoid random large blank bands and uneven background-color transition gaps.
- Do not compress headers or tool rows to preserve extra sample buttons.

## 6. Button and interaction profile

Approved button treatment is centralized by `app/app.css` and
`ToolWorkspace.tsx`.

- Approved button shadow variable:
  `--mw-button-shadow: 0 1px 1px rgba(15, 23, 42, 0.14), 0 2px 3px
  rgba(11, 36, 71, 0.13)`.
- Disabled button shadow:
  `--mw-button-shadow-disabled: 0 1px 1px rgba(15, 23, 42, 0.08), 0 2px 3px
  rgba(11, 36, 71, 0.07)`.
- Global interactive selector in `.mw-page-content` applies the button shadow to
  `button`, `[role="button"]`, `summary`, and `.mw-button-outline`.
- Do not apply button shadows to textareas, inputs, outputs, static panels,
  metadata badges, or non-interactive surfaces.
- `ToolButton` size presets:
  - `sm`: `min-h-10 px-3 py-1.5 text-sm`
  - `md`: `min-h-11 px-4 py-2 text-sm`
  - `lg`: `min-h-12 px-4 py-2`
- `ToolButton` radii: default `rounded-lg`, optional `rounded-xl` or
  `rounded-full`.
- Active/dark tool buttons: `bg-slate-950 text-sky-100`, hover
  `bg-slate-800 text-white`.
- Light tool buttons: `bg-[#fffdf8] text-slate-900`, hover
  `bg-[#fffaf2] text-sky-950` in non-home contexts where overridden.
- Home/global light buttons may dark-hover through app.css; do not add a new
  dark hover pattern.
- Output-panel buttons: `bg-slate-700/95 text-slate-100`, hover
  `bg-slate-800 text-white`, disabled `bg-slate-800/60 text-slate-500`.
- Home/audio mode buttons and sample chips use small button sizing, `px-3 py-2`
  or `px-3 py-1.5`, font-semibold, and the approved shadow.
- Toolkit quick links are dark cards: `bg-slate-950 text-sky-100`, hover
  `bg-slate-800 text-white`.
- FAQ triggers are button-like accordions. Home FAQ uses the approved shadow;
  non-home FAQ shadows are suppressed in `app/app.css`.
- No hover glow.
- No hover lift or transform.
- No slow hover animation.
- Avoid `transition-all`; the current global CSS suppresses broad transitions.
- Hover should be instant or very restrained.
- No dark hover flip on light cards unless the current approved home/toolkit
  pattern already does it.
- Metadata labels/badges should not look like buttons unless interactive.

## 7. Input/output/tool profile

- Tool pages should follow the home/audio structure unless function requires a
  different layout.
- Tool panels use `ToolPanel` / `ToolOutputPanel` where practical.
- Input panel source: `ToolPanel` = `overflow-hidden rounded-xl bg-white/88`.
- Tool panel header: `px-4 py-3`, label `text-sm font-extrabold
  text-sky-950`, badge `font-mono text-[11px] font-bold uppercase
  tracking-[0.12em] text-slate-500`.
- Tool textarea source: `ToolTextarea` = `min-h-[10rem] w-full resize-y border-0
  bg-transparent p-4 font-mono text-slate-950 outline-none focus:ring-0
  focus-visible:outline-none`.
- Dark output panel source: `ToolOutputPanel` = `overflow-hidden rounded-xl
  bg-slate-950`.
- Dark output panel label: `text-sm font-extrabold text-slate-200`; badge:
  `text-slate-300`.
- Dark output pre blocks use `font-mono`, sky-tinted text, and no extra button
  shadow.
- Helper text such as spacing notes belongs in panel footers or support
  sections, not scattered through crowded control rows.
- Slider controls use native range inputs with `accent-color: #38bdf8`; focus
  outline for ranges is a controlled `2px solid rgba(11, 36, 71, 0.38)`.
- Audio/playback controls should group title/label on the left and toggles on
  the right when there is room; stack/wrap on mobile.
- Advanced settings and export sections should use clean full-width trigger
  buttons and simple grids. Do not add nested cards for advanced controls.
- Save/export/copy/share actions should reuse the approved button patterns.
- Avoid cluttered microcopy in the tool UI. Move explanatory details into
  support/SEO sections when the tool area becomes crowded.
- Preserve localStorage keys and tool algorithms.

## 8. Static surface and card profile

- Static content should use spacing and composition, not nested cards.
- No nested cards.
- No heavy boxed layouts.
- No unnecessary outer background containers around support/SEO content.
- Do not place secondary action panels beside a primary answer panel when that
  creates cramped columns, awkward dead space, or a weaker first screen. Prefer
  a full-width answer panel with below-panel action rows when it uses desktop
  space more cleanly.
- Avoid decorative filled cards inside other content surfaces. Use simple
  columns, rows, dividers, or inline notes unless the nested surface is a real
  input, output, code block, or warning.
- Static surfaces should not look interactive.
- Dark backgrounds are reserved for actual output/code/reference signal panels,
  not generic support copy.
- Generic support content should not use dark card backgrounds.
- Use `mw-static-surface`, `mw-static-surface-soft`, `mw-static-panel`,
  `mw-static-tile`, and `mw-static-code` according to current usage.
- Related/toolkit links should match the approved toolkit pattern.
- White/off-white cards use `rounded-xl` and warm surfaces; do not introduce
  new border, outline, or shadow systems.
- Repeated expanded toolkit items should be smaller descriptive subcards with a
  title, short description, and small badge, not thin button rows.

## 9. Section-specific guidelines

### Hero/header

- Use `ToolHero` or the constants in `heroStyles.ts` where possible.
- Keep the eyebrow line + mono label, large Space Grotesk H1, and restrained
  lead copy.
- Do not compress the header row to keep too many buttons.

### Navigation/header dropdown

- Keep direct top-nav links focused on highest-value destinations: All tools,
  Translator, Audio, Practice, Worksheets, Typing, How to use, and More.
- Secondary destinations belong in the More/tools dropdown, grouped by user
  intent. Do not promote niche/reference pages into the top nav unless the user
  explicitly asks.
- The More dropdown must follow the approved home palette, spacing, typography,
  and button behavior. When it opens from the dark header, prefer a dark
  nav-matched surface with sky text; no gradients, outlines, nested cards, or
  new shadow systems.
- As the page count grows, the dropdown should support lightweight client-side
  search and stay easy to scan on desktop without breaking mobile navigation.
- Top-nav hit areas should be forgiving like normal website navigation. Increase
  clickable padding without changing the visible text styling.

### How-it-works/support/SEO

- Follow home and audio: generous spacing, max width `1160px`, readable
  paragraphs, and soft full-width backgrounds only where they clarify section
  rhythm.
- Avoid text lines over roughly 80 characters in support content.
- Use max-widths and grids rather than manual line breaks.

### Quick answers/formatting tables

- Quick answers should not be cramped when horizontal space is available.
- Tables should remain readable and not force narrow columns.
- Use static warm surfaces, not nested card containers.

### FAQ

- FAQ transition spacing should be balanced with the preceding section.
- Visible FAQ content must match FAQ JSON-LD when FAQPage schema is present.
- Non-home FAQ triggers intentionally have no shadow in current CSS.

### Toolkit/related tools

- Primary cards sit above quick access.
- Quick access uses dark cards.
- Expanded items use smaller descriptive subcards.
- Keep the all-tools section background transparent on home.
- Do not reintroduce old thin button-list styling.
- Internal links must point to existing canonical routes, not typo aliases.

### Footer

- Footer link area is restrained: logo-style home link plus About, Sitemap,
  Sources, Socials, Privacy, Terms, and Cookies.
- Preserve the lower footer copy/brand line and small Morse detail.
- Footer and social blocks are wrapped in `data-nosnippet` in `app/root.tsx`.

## 10. Background accents

- `PageBackdrop` controls the subtle Morse side accents.
- Accents use `paperBackground` (`#f5f2eb`) and pale sky/navy text.
- Home accents show from `min-[1360px]:block`; non-home accents show from
  `min-[1900px]:block`.
- Home side rail width: `max(0px, calc((100vw - 1160px) / 2 - 48px))`.
- Non-home side rail width: `max(0px, calc((100vw - 1480px) / 2 - 64px))`.
- Accent labels use mono uppercase, low opacity (`text-sky-950/34` and
  `text-sky-950/40`).
- Accents should remain subtle and must not crowd content.
- Do not let accents cause horizontal overflow.
- Do not make accents disappear unnecessarily on resize when there is room.
- Do not add dotted/noisy background patterns outside approved PageBackdrop
  behavior.

## 11. Shared component rules

- Inspect all consumers before changing a shared component.
- Prefer variants when home must remain protected.
- If changing shared components for one page, verify all affected pages.
- Avoid route-local duplication when a shared component exists.
- Do not create one-off components for repeated patterns.
- If a shared change touches toolkit, FAQ, breadcrumb, hero, nav, footer,
  PageBackdrop, or tool primitives, verify home plus at least one affected
  non-home route.
- Shared Morse utilities should remain the source for Morse encoding, decoding,
  spacing, timing, and reference behavior.

## 12. Content/product-positioning rules

- Preserve high-intent SEO terms.
- Connect tools to learning where natural.
- Product flow: translate -> hear -> practice -> review -> return.
- Do not overclaim features.
- No filler.
- No keyword stuffing.
- Page copy should remain human, practical, and page-specific.
- Every indexed page should answer what the user can do here, why it matters
  for learning or using Morse, and what the next useful step is.
- Reference pages help users verify patterns; practice pages help users build
  recall. Keep that distinction clear.

## 13. Accessibility/interaction rules

- Edited buttons need readable default, hover, active, focus-visible, and
  disabled states.
- Buttons and CTA links on SEO/content pages must use the same homepage-aligned
  button patterns as the tools. Do not make static cards look like buttons, and
  do not make actionable links look like passive content.
- No black text on dark backgrounds.
- No nested buttons.
- No nested links.
- Do not break keyboard interactions.
- Do not remove functional labels required for accessibility.
- Flash/light controls must keep the strobe warning behavior.
- Strobe warning label should be exactly `Strobe warning`.
- Strobe warning copy should be calm and explicit:
  `Strobe warning: flashing light may be uncomfortable or unsafe for people
  with photosensitive epilepsy or light sensitivity. Turn off Flash or use
  audio-only practice if you are sensitive to strobing.`
- Place strobe warnings before or directly beside controls that can start
  flashing.

## 14. Privacy/analytics rules

- Do not send raw user text, worksheet text, puzzle words, Morse messages, or
  learner answers to analytics.
- QR codes should point to canonical routes unless explicit shareable content
  support is implemented safely.
- Do not encode raw custom word lists, worksheet text, puzzle answers, or
  learner input in a QR code unless the implementation intentionally supports
  shareable puzzle URLs and handles privacy/content length safely.
- Playback/export language should truthfully describe local browser behavior
  only where that behavior is implemented.

## 15. SSR/hydration rules

- Do not render random SSR-visible output using `Math.random()`, `Date.now()`,
  or `crypto`.
- Use deterministic initial render values.
- Generate random values only after hydration or in explicit user actions.
- Do not read `window`, `document`, `navigator`, `localStorage`, or
  `sessionStorage` during SSR-visible render unless guarded so server and first
  client render match.
- Preserve storage keys.
- Do not use broad `suppressHydrationWarning` as a shortcut.
- JSON-LD should be deterministic between SSR and first client render.
- Fix invalid HTML nesting instead of suppressing warnings.

## 16. Testing/reporting expectations

- After code changes, run:
  - `npm run typecheck`
  - `npm run build`
  - `npm run test --if-present`
- For frontend changes, browser-check affected pages.
- For shared component changes, check shared side effects.
- For visual matching, inspect the current home/audio implementation and
  rendered computed styles before editing.
- Visual QA for new content pages must use actual screenshots. Class or
  component consistency is not enough if the rendered page still looks cramped,
  card-heavy, or generic.
- Breadcrumbs need intentional spacing above and below them. They should not be
  jammed against FAQ, related tools, or footer sections.
- SEO sections should be substantial and useful for the query without generic
  padding, repeated article filler, or decorative markup.
- Report files changed, protected files, and verification results.
- Do not claim success from a build alone when rendered behavior was part of the
  task.

## 17. MorseWords page design rules

- Homepage is the source of truth for page width, spacing, buttons, toolkit
  sections, social sections, and footer rhythm.
- Do not create Wave-specific or route-specific toolkit, all-tools, or social
  sections when a homepage or shared version exists.
- Extract homepage sections into shared components when reuse is needed.
- Do not use narrow article containers for tool or reference pages.
- Do not use decorative nested cards.
- Do not use random card-like buttons or chip-like CTAs.
- Buttons must reuse shared homepage-aligned styles.
- SEO sections must provide actual user value: concrete explanations, examples,
  mistakes, practice guidance, and next actions.
- Every new page must be visually checked against the homepage before
  completion.
- Passing tests is not enough. Screenshots must be reviewed.

## 18. Dark mode, icons, and refactor readiness

- Do not implement dark mode page-by-page.
- Consolidate shared surfaces before adding dark tokens.
- Dark mode must use shared tokens and shared classes, not scattered `dark:`
  classes across route files.
- Light mode must remain the default.
- Theme choice must eventually persist locally.
- The theme toggle must live in the navbar and use the shared Moon and Sun
  icons.
- Icons must come from the shared icon library.
- Do not paste inline SVGs into route or page files.
- Icons must use `currentColor`, accessible labels where needed, and consistent
  sizing.
- Component refactors must preserve existing logic, layout, and styling unless
  the task explicitly allows visual changes.
