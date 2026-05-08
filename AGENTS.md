# AGENTS.md

## Project identity

MorseWords is the friendly way to learn and use Morse code.

The site should still target high-intent Morse code searches such as:

- morse code translator
- morse code decoder
- morse code encoder
- morse code audio
- morse code alphabet
- morse code dictionary
- morse code practice

However, MorseWords should not present itself as only a commodity translator. The broader product identity is beginner-friendly Morse learning and practice.

MorseWords helps beginners translate messages, hear real Morse audio, practice listening, and build confidence one short session at a time.

The site should feel:

- modern
- approachable
- beginner-friendly
- practical
- lightly playful without becoming childish
- less old-school than traditional ham-radio utility sites

Content should naturally connect tool use to learning:

- translate it
- hear it
- understand spacing
- practice the pattern
- review weak spots
- build recognition over time

Use this idea as directional guidance, but do not repeat it everywhere verbatim:

> Learn to hear Morse, not just stare at dots and dashes.

## Visual source of truth

The approved home page is the visual source of truth.

When matching another page to the home page, inspect the actual home implementation and computed styles instead of guessing colors, spacing, button sizes, or layout rhythm.

Follow the existing home page for:

- color palette
- spacing rhythm
- content width
- section rhythm
- heading scale
- button treatment
- input/output panel treatment
- FAQ treatment
- toolkit/related-tools treatment
- static content surface treatment
- overall page polish

Do not create a new design direction.

## Styling rules

Use the exact MorseWords palette already established on the approved home page.

Do not introduce:

- new colors
- gradients
- decorative visual systems
- nested-card layouts
- generic SaaS template styling
- random blue/gray tones
- unrelated icons or illustrations

No outlines.

No shadows, except for the specific approved button shadow treatment already used by approved button components.

No gradients.

No nested cards.

Avoid heavy boxed layouts. Prefer:

- whitespace
- typography
- solid fills from the existing palette
- clean grouping
- simple section rhythm

Content sections, examples, FAQs, callouts, reference blocks, and support sections should be displayed consistently across pages and styled like the approved home page.

## Protected areas

Do not change unless explicitly asked in the current user prompt:

- `app/routes/home.tsx`
- `app/client/components/home/*`
- home page header section
- home page tool logic
- nav components
- nav styles
- footer components
- footer styles
- social media/social links components
- social media/social links styles

Do not mutate the approved home page to make other pages easier to style.

Other pages should move toward the home page system. The home page should not move toward other pages.

## Functionality protection

No backend work unless the current user prompt explicitly asks for it.

Do not break existing:

- route behavior
- canonical setup
- SEO helper behavior
- JSON-LD helper behavior
- conversion logic
- Morse parsing/spacing logic
- audio generation/playback/export logic
- practice/quiz/scoring logic
- typing logic
- worksheet/export/print logic
- word search generation logic
- localStorage keys
- validation logic
- form behavior
- copy/share behavior

Use existing shared Morse utilities where practical for encoding, decoding, timing, spacing, and reference data. Do not create a second inconsistent Morse map when a shared utility already covers the need.

If a task requires changing shared components, inspect every relevant page that uses those components before finishing.

If a shared change could affect completed pages, verify those pages still render and still behave correctly.

## Content quality rules

Write useful, page-specific, human-sounding content.

Do not add filler just to increase word count.

Do not keyword-stuff.

Do not make pages spammy.

Every new section must help the user:

- translate
- decode
- hear
- practice
- troubleshoot
- print
- copy
- verify
- compare
- choose the right MorseWords tool

Each indexed page should have a clear unique purpose.

If two existing pages overlap in intent, do not remove either page unless explicitly asked. Instead:

- clarify the page positioning
- adjust title/meta/H1/intro
- add unique examples
- add unique FAQ
- add distinct internal links
- make the page’s job clearer

Do not add new routes unless explicitly requested.

Do not remove existing routes unless explicitly requested.

## FAQ and JSON-LD rules

Do not duplicate FAQ content across pages.

Do not duplicate FAQPage JSON-LD across pages.

Every FAQPage JSON-LD block must match visible FAQ content on that page.

Do not add FAQPage JSON-LD if the FAQ is not visible.

Do not add schema that claims features or content the page does not actually provide.

For noindex pages, avoid unnecessary rich-result schema.

## Internal linking rules

Use internal links only to existing routes.

Do not link to typo aliases or redirect-only routes unless explicitly required.

Use descriptive anchor text.

Do not rely only on the global toolkit block for internal linking.

Add contextual links only where they genuinely help the user choose the next step.

## Component rules

Reuse existing shared components where appropriate.

Do not add a runtime icon library.

Do not import `@mui/icons-material` or another icon package. Use the project’s existing inline SVG/icon patterns and `currentColor` behavior when an icon is needed.

Do not create unique one-off components when:

- an existing shared component fits, or
- a small safe extension to a shared component would support multiple pages

If a new repeated pattern is needed, make it reusable and verify all affected pages.

Do not make broad shared-component changes without checking all relevant usages.

## Accessibility and interaction rules

Every edited button/control should have:

- `cursor-pointer` where applicable
- readable default state
- readable hover state
- readable active state
- readable focus-visible state
- disabled styling where applicable

Do not create black-text-on-dark-background states.

Do not use hover lift, glow, shadow animation, or transform animation unless explicitly requested.

Avoid `transition: all`.

For toolkit/related cards, hover should be immediate and calm unless the user explicitly asks for animation.

## Strobe and flash warnings

Any flash/light notice must be labelled exactly:

`Strobe warning`

Use calm warning language, not panic/error styling.

Strobe warning copy should be clear and consistent:

`Strobe warning: flashing light may be uncomfortable or unsafe for people with photosensitive epilepsy or light sensitivity. Turn off Flash or use audio-only practice if you are sensitive to strobing.`

Place strobe warnings before or directly beside controls that can start flashing.

Do not style strobe warnings as generic errors.

## Privacy and analytics

Do not send raw user-entered text, puzzle words, worksheet text, Morse messages, or learner answers to analytics.

QR codes should point to canonical MorseWords routes by default.

Do not encode raw custom word lists, worksheet text, puzzle answers, or learner input in a QR code unless the implementation intentionally supports shareable puzzle URLs and handles privacy/content length safely.

## SSR and hydration

Avoid hydration mismatches.

Do not use `Date.now()`, `Math.random()`, or `crypto` to create initial render output that appears in SSR markup.

Use deterministic initial values for SSR-visible output.

Generate random values only in client event handlers when the user intentionally requests a new generated result.

Keep source input state separate from generated output state.

## Testing and verification

After code changes, run:

```bash
npm run typecheck
npm run build
npm run test --if-present
```
