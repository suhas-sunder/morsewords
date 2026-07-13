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
- Static discovery/content cards with nested heading, badge, or description
  text must not use dark hover flips unless every descendant color is explicitly
  tested on that dark hover state. Prefer the safe light-card hover
  `hover:bg-[#fffaf2] hover:text-sky-950` for these cards.
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

- `PageBackdrop` renders `MorseAmbientBackground`, the shared subtle Morse side
  accent surface.
- Accents use `paperBackground` (`#f5f2eb`) and pale sky/navy text.
- Accents use the homepage-approved implementation on every route and show
  from `min-[1360px]:block`.
- Side rail width: `max(0px, calc((100vw - 1160px) / 2 - 48px))`.
- Accent labels use mono uppercase, low opacity (`text-sky-950/34` and
  `text-sky-950/40`).
- Accents should remain subtle and must not crowd content.
- Do not let accents cause horizontal overflow.
- Do not make accents disappear unnecessarily on resize when there is room.
- Do not add dotted/noisy background patterns outside approved PageBackdrop
  behavior.

## 11. Shared component rules

- Inspect all consumers before changing a shared component.
- New changes must not break existing behavior, routes, controls, storage keys,
  or page contracts unless the user explicitly asks for the breaking change and
  the impact is documented.
- Prefer variants when home must remain protected.
- If changing shared components for one page, verify all affected pages.
- Avoid route-local duplication when a shared component exists.
- Do not create one-off components for repeated patterns.
- If a shared change touches toolkit, FAQ, breadcrumb, hero, nav, footer,
  PageBackdrop, or tool primitives, verify home plus at least one affected
  non-home route.
- Shared Morse utilities should remain the source for Morse encoding, decoding,
  spacing, timing, and reference behavior.
- Equivalent engine features must share one canonical range, step, default,
  formatter, sanitizer, persistence/migration behavior, and engine-consumed
  value. Do not introduce weaker route-local caps or preset subsets.
- Tone presets come from the canonical preset registry. A route may use a narrow
  adapter only for a documented engine limitation and must test that exception.
- Validate parity in rendered browsers, including persistence across equivalent
  routes, rather than relying only on source-level constants.
- Shared components must be placement-neutral. They own behavior and semantics;
  routes retain composition where their task genuinely differs.
- Use the homepage as the visual source when the workflow is equivalent, while
  preserving a stronger capability found on another route by sharing it.
- Commit history does not override an explicit current product requirement.

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
- Do not disable, remove, rename, or materially change existing controls or
  old user flows while making new changes unless that behavior change is
  explicit in the task. If a control must be guarded for safety or invalid
  input, preserve the prior enabled/disabled contract everywhere else and
  verify the old flow alongside the new flow.
- Strobe warning label should be exactly `Strobe warning`.
- Strobe warning copy should be calm and explicit:
  `Strobe warning: flashing light may be uncomfortable or unsafe for people
  with photosensitive epilepsy or light sensitivity. Turn off Flash or use
  audio-only practice if you are sensitive to strobing.`
- Place strobe warnings before or directly beside controls that can start
  flashing.
- Editable textareas must retain the same content fill and internal geometry on
  focus. Put keyboard focus outside the content surface; do not add internal
  blue lines, pale fills, or focus tint.
- Read-only Morse outputs must keep a high-contrast deep output surface in all
  states. Do not allow browser input, focus, disabled, or text-fill styling to
  turn them pale or reduce readability.
- On equivalent playback workflows, Sound, Repeat, and Flash Light remain in
  the primary controls. Secondary synthesis choices stay in the shared advanced
  disclosure, with customization labels such as `Flash color` when applicable;
  never leave an orphan swatch or indicator.

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

## 19. AdSense placement and placeholder lifecycle rules

Ad placements are a protected revenue surface. Do not reintroduce disappearing
desktop sidebars or filled ads wrapped in fallback chrome.

- The above-header ad, left sidebar, right sidebar, and Explore toolkit ad are
  protected placements. They should not be route-excluded unless the user
  explicitly changes the ad architecture.
- Desktop sidebars must remain mounted and visibly labeled with
  `Advertisements` while pending, blocked, or unfilled. They should disappear
  only when the viewport is below the sidebar breakpoint or when a filled ad is
  shown and the fallback chrome is hidden.
- A filled ad must never render at the same time as fallback UI: no dashed
  border, no placeholder background, and no `Advertisements` label above,
  below, behind, or around the creative.
- Normal eligible placements should show the fallback immediately on initial
  render, reserve stable space, and then either keep that fallback when blocked
  or unfilled or hide it completely when filled.
- Do not use placeholder dimensions as a max-height or clipping box for filled
  creatives. Keeping a stable minimum reserved height is acceptable; clipping
  filled ads is not.
- Do not add collapse-on-unfilled behavior to the protected sidebars. This has
  repeatedly caused side rail placeholders to flash and disappear.
- Visual QA for AdSense changes must include simulated filled creatives and
  blocked/unfilled states at mobile and desktop widths. DOM assertions alone are
  not enough.
- The user deliberately chose a page-wide fallback safety guard: once any live
  creative is detected, hide every fallback frame and `Advertisements` label on
  that page immediately. This is intentional protection against a real ad and
  placeholder rendering together. Do not replace it with per-slot fallback
  visibility without explicit user approval.
- Only the above-header slot is deliberately non-auto (`horizontal`). Every
  other AdSense unit must keep `data-ad-format="auto"` and
  `data-full-width-responsive="true"` so AdSense can adapt the creative for
  its container, including mobile. Do not reintroduce kind-based format
  overrides such as `rectangle`, `vertical`, or `horizontal` for non-top slots.
- Placeholder dimensions are visual fallback dimensions only. They may reserve
  stable fallback space, but must never set a height, max-height, overflow clip,
  or width cap on the live `ins.adsbygoogle` surface or creative. Keep all
  fallback frames and filled creatives centered independently.
- Treat user-authored AdSense lifecycle and mobile-delivery changes as
  intentional protected behavior. Compare against the latest user commit before
  modifying this area; do not revert them while fixing an adjacent regression.

## 20. Audio/video export pipeline rules

MorseWords audio/video export is a core product feature. Do not treat it as a secondary convenience feature.

### Export must not be blocked just because the selection is long

* Small selections should export as a single file.
* Long selections should automatically export in smaller parts.
* Very long selections should create more parts, not disable export.
* If one planned part is still too large, split that part smaller.
* The hard safety guard is only allowed to prevent a single unsafe internal render operation.
* The user-facing download path must remain available whenever a technically viable segmented export exists.
* Do not tell users to manually choose fewer chapters as the primary path.
* Do not disable MP3, WAV, MP4, or WebM download only because the selected text is long.

Preferred large-selection copy:

`This selection has a lot of text, so the download may take a while. MorseWords will prepare it in smaller parts to keep the export reliable.`

Optional second line:

`Keep this tab open while the files are being prepared.`

Avoid user-facing wording such as:

* `browser-safe file`
* `too long for a single browser export`
* `choose fewer chapters`
* `export by chapter for a safer download`

Those can be internal concepts, not the main user message.

### Do not rely on giant in-memory renders

Codex must not “fix” export failures by only adding a lower limit or a disabled state.

Audit and avoid:

* one giant full-selection audio buffer
* one giant full-selection video blob
* full-book typed-array allocation
* accumulating all parts in memory before download
* recalculating the entire Morse timeline for every part
* blocking the UI thread for long periods
* exposing raw runtime errors such as typed-array allocation failures

The preferred architecture is:

* Build one canonical Morse timing timeline.
* Use that same timeline for audio, bulb flashing, Morse highlight, text highlight, timeline playhead, preview, and export.
* Split long exports by chapter/section boundaries first.
* Split oversized chapters by duration/text segment.
* Render/download parts sequentially.
* Release memory between parts where possible.
* Report progress from actual rendered duration, frames, chunks, or samples.
* Use native browser APIs where reliable before adding dependencies.
* Consider workers for expensive generation/encoding when the refactor is safe and measurable.
* Consider MediaRecorder chunking/timeslice for long video/WebM paths where applicable.
* Consider WebCodecs only if support/fallback behavior is clear.
* Do not add ffmpeg.wasm or another large encoder unless the benefit is measured and documented.

### Export quality requirements

An export is not complete unless it is correct, playable, and usable.

For audio exports:

* Dots, dashes, character gaps, word gaps, WPM, Farnsworth timing, pitch, and volume must match the selected settings.
* MP3/WAV output must contain the full selected text or full planned part.
* Part boundaries must not cut tones incorrectly.
* Filenames must be clean and ordered.

For video exports:

* The bulb must flash exactly during dots and dashes.
* The bulb must remain off during gaps.
* Morse symbols, plain text, bulb state, playhead, and audio must stay synchronized.
* Preview and exported video must use the same canonical timing schedule.
* MP4/WebM labels must reflect the actual produced format.
* Long exports must show part count, current part, elapsed time, progress, and ETA where practical.

### Large export estimates

Do not show `Available after export` for normal export states.

For large selections, show:

* total runtime
* estimated total file size
* planned number of parts
* estimated render time where reasonably calculable

Example:

`Runtime: 3h 50m`
`Parts: 6`
`Estimate: ~53 MB across 6 parts`

If ETA is unreliable, show elapsed time instead of fake precision.

### Export failure behavior

Unexpected failures must be clean and recoverable.

* Never show raw JavaScript errors to users.
* Show which part failed.
* Re-enable controls after failure.
* Allow retry where practical.
* Preserve already completed parts where browser constraints allow.
* Do not leave buttons stuck in `Rendering...`.

## 21. Book processing pipeline rules

Book processing must be done in small reviewable batches. Do not process the full library in one large Codex pass.

### Batch size

* Process books in batches of 5.
* Do not continue to the next batch until the previous batch has a reviewable report.
* Each batch must make it easy to verify whether parsing, chapter structure, URLs, and export behavior are correct.

### Required batch report

Each batch must include a report with, per book:

* title
* author
* source file
* source folder
* public/restricted status
* detected top-level structure
* whether the book contains nested books, volumes, parts, or sections
* resulting public URL or URLs
* chapter/section list
* chapter title
* chapter type
* character length per chapter
* word count per chapter
* estimated Morse runtime per chapter
* default audio/video selection state
* whether each section is front matter, body content, back matter, or optional
* suspicious parsing warnings
* Cloudflare JSON path

Reports should be saved in a clear docs or generated-report location and summarized in Codex’s final response.

### Section parsing quality

Do not accept obviously broken section detection.

Flag and fix or explicitly report:

* prefaces with enormous word counts
* front matter swallowing body content
* duplicate ambiguous labels such as multiple `Preface` sections
* chapters appearing out of order
* missing Chapter 1 when later chapters exist
* table of contents treated as ordinary reading content
* illustration/title-page markers selected as primary reading content
* Gutenberg boilerplate leaking into reading/export content
* fake headings incorrectly treated as real chapters

Observed examples that must be caught:

* `Preface` with hundreds of thousands of words
* `Chapter 4` appearing before `Chapter 1`
* duplicate `Preface` labels where one is actually a wrapper or parsing error

### Nested books, volumes, and parts

Some public-domain works contain real internal books or volumes.

When a work has genuine major divisions such as:

* `Book One`
* `Book Two`
* `Volume I`
* `Volume II`
* `Part One`
* `Part Two`

Codex should consider creating separate public URLs for those divisions.

Rules:

* Do not blindly split every occurrence of the word `book`.
* Split only real structural divisions.
* Preserve parent/source relationships.
* Use stable, readable slugs.
* Update sitemap, schema, internal links, manifests, audiobook pages, print pages, and Cloudflare export consistently.
* If a division is ambiguous, report it instead of inventing structure.

### Default selection behavior

For audio/video defaults:

* Select real readable body content by default.
* Do not select obvious front matter by default.
* Keep optional/front-matter sections manually selectable.
* `Select all` must still select everything when explicitly used.
* Print/PDF behavior may include fuller front matter later, but audio/video should prioritize listenable content.

Skip by default where possible:

* table of contents
* title page
* illustration-only markers
* publisher/copyright/front matter
* transcriber notes
* production notes
* Gutenberg boilerplate
* very short metadata-like opening sections

## 21. Empirical export validation for book batches

Book processing is not complete until export behavior is tested on representative chapters.

For each processed batch, Codex should validate exports where practical:

* MP3 for each chapter or representative chapters if full testing is too costly
* MP4 or WebM for each chapter or representative chapters if browser support allows
* record whether the file downloads successfully
* record export duration
* record output file size
* record source chapter runtime
* record failures
* record whether the output was direct single-file or split into parts

Use measured results to improve estimates shown to users.

Do not claim guaranteed performance based only on formulas. Estimated render time should be based on:

* measured chapter export timing where available
* selected format
* selected runtime
* output mode
* browser constraints
* historical local measurement if stored safely

If empirical export testing is too slow for a Codex pass, test a representative sample, document the limitation, and do not pretend the whole batch was validated.

## 22. Book images are deferred

Cover/image matching for Morse books is currently deferred.

Do not process `temp-books/images` unless explicitly asked.

For now:

* do not match cover images
* do not add image paths to book metadata
* do not add `books/images/*` to Cloudflare upload manifests
* do not modify image folders
* keep existing placeholder cover behavior

This may be revisited later if the Morse book pages gain traction.

## 23. Current high-priority remaining work

Keep the following work tracked and do not lose it across Codex passes.

### Active priority: export pipeline correctness

The export pipeline must be corrected before major book expansion continues.

Required outcome:

* long audio/video exports work through automatic split parts
* MP3/WAV/MP4/WebM are not disabled just because the selection is long
* rendering is optimized to avoid giant memory allocation
* progress, elapsed time, ETA, and part count are visible
* output quality and timing are verified
* preview/export timing remains synchronized
* raw allocation errors never appear in the UI

### Then: Morse Code by Language expansion

Planned language work should be done in batches, starting with high-value pages such as:

* German
* French
* Spanish
* Korean
* Italian
* Portuguese

Later likely candidates:

* Dutch
* Swedish
* Norwegian
* Danish
* Finnish
* Polish
* Hebrew
* Arabic
* Turkish
* Czech
* Hungarian
* Romanian
* Ukrainian
* Bulgarian

Each language page must be accurate about whether it is an established adaptation, International Morse with added letters, or transliteration-based practical use. Do not invent official status.

### Then: Contact, support, and legal

Use `support@morsewords.com`.

Still needed:

* footer/contact/legal email updates
* Contact page
* Resend server-side contact form
* categories for business, general, feature request, bug report, and source/content/copyright issues
* safe attachment handling
* spam/rate limiting
* validation
* privacy-safe behavior

### Then: book processing in batches of 5

Use the batch rules above.

Respect:

* `No-Restriction` books are public candidates.
* `Not-Allowed-In-Canada` books are restricted/hidden by default unless geo-gating and rights rules are explicitly implemented.
* Restricted books must not appear in public hub pages, book pages, audiobook pages, print pages, sitemap, schema, public manifests, or Cloudflare export.
* Do not touch raw source folders except to read them.

### Then: book SEO, audiobook SEO, printable SEO

After reliable processing:

* add unique book-specific content
* add audiobook-specific content
* add printable-specific content
* avoid template spam
* avoid copied summaries
* keep content human, specific, useful, and accurate

### Then: schema/canonical/sitemap audit

Audit all public pages after major additions.

### Then: AdSense readiness and human-first content quality pass

The final content pass must reduce robotic AI-SEO patterns and keep pages useful, natural, and task-focused.

### Then: deploy, Cloudflare upload, and production checks

Do not deploy before content, legal/contact, schema, sitemap, and export behavior are production-ready.

### Then: final optimization sweep

Final performance optimization happens after the product is complete and deploy-ready.
