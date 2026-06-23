# ZERO public landing — design QA

- Source visual truth: `docs/landing-reference.png`
- Rendered implementation: `docs/landing-implementation.png`
- Full-view comparison evidence: `docs/landing-qa-comparison.png`
- Focused implementation evidence: `docs/landing-bottom-implementation.png`, `docs/landing-mobile-implementation.png`
- Desktop viewport: 1247 px browser content width; 21,776 px rendered document height
- Mobile viewport: 390 × 844 px target; 375 px content width after scrollbar allocation
- State: public landing at `/`, first architecture layer expanded; `/app` navigation verified

## Findings

No actionable P0, P1 or P2 findings remain.

- Fonts and typography: Libre Caslon Text, DM Sans and DM Mono preserve the selected editorial hierarchy. Display type remains readable and intentional at desktop and mobile widths; no truncation was found.
- Spacing and layout rhythm: the implementation intentionally expands the compact source into 19 paced chapters, matching the user's approved direction. Major sections use large vertical intervals, actors use three rows, and each architecture layer has its own chapter-sized block.
- Colors and visual tokens: near-black, warm paper, cyan proof, amber capital/human authorization and green confirmation states map consistently to the source and the existing Command Center.
- Image quality and asset fidelity: existing ZERO documentary assets and paper texture are used at native aspect-appropriate crops with grayscale treatment. No visible placeholder, CSS illustration or handcrafted SVG substitute is present.
- Copy and content: the protocol is defined before the La Bocana example. The sequence clearly covers essence, universal problem, inputs, transformation, outputs, boundaries, actors, trust, example, architecture, traceability, business model and future applications.
- Icons: one consistent Phosphor icon family is used with restrained thin weights and semantic coloring.
- Interaction states: sticky chapter navigation, smooth chapter jumps, mobile menu, architecture accordions, external explorer link and all `/app` entry links are implemented. The second architecture accordion was expanded and verified; the primary header CTA navigated to `/app` successfully.
- Responsiveness and accessibility: desktop and mobile document widths match their client widths with no horizontal overflow. Semantic headings, buttons, links, `aria-expanded`, focus-visible states and descriptive content imagery are present.

## Patches made during QA

- Added horizontal overflow containment after the first bottom-of-page capture exposed a scrollbar.
- Corrected the final documentary image alternative text.
- Confirmed the mobile hero, final manifesto, route separation and expandable architecture behavior after patching.

## Follow-up polish

- [P3] Commission unique documentary imagery for every future application when ZERO has real field programs in those domains; the MVP intentionally reuses the approved ZERO documentary asset set.
- [P3] Add reduced-motion media rules if richer scroll animation is introduced later. The current implementation uses native smooth scrolling only.

## Final result

final result: passed
