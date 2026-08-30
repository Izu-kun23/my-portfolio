# Design System

## Direction

Monochrome creative portfolio influenced by Zentro's image-led studio rhythm. The opening is cinematic and black; the body shifts to warm paper. A scattered collage of real product screenshots frames a three-line product-building statement. Opposing marquees, full-width work, progressive text fill, and expanding capability rows create the signature sequence.

## Color

- Ink: `oklch(0.12 0.006 80)`
- Paper: `oklch(0.965 0.006 95)`
- Muted ink: `oklch(0.48 0.008 80)`
- Hairline: `oklch(0.12 0.006 80 / 0.16)`
- Inverse text: `oklch(0.965 0.006 95)`

Use a restrained monochrome strategy. No decorative gradients or colored UI accents.

## Typography

Bricolage Grotesque is the identity and body family already established in the portfolio. Use light-to-medium display weights, tightly tracked oversized headings, compact labels, and body copy capped near 70 characters.

## Layout

- Mobile: 4-column logic, 20px gutters.
- Tablet: 8-column logic, 32px gutters.
- Desktop: 12-column logic, 48–80px gutters, max width 1600px.
- Sections alternate between full-bleed image fields and strict ruled content grids.
- Vertical rhythm varies from compact metadata groups to 160–220px section separations.

## Components

- Navigation: fixed, thin, text-led; full-screen mobile menu.
- Navigation: fixed location/identity/menu triptych with a full-screen typographic menu.
- Hero: black viewport, scattered screenshot collage, oversized three-line statement, compact practice metadata.
- Projects: full-width editorial figures with project number, category, title, year, and direct actions.
- Experience: ruled rows, three columns on desktop, stacked metadata on mobile.
- Mission: scroll-filled statement followed by factual practice counters.
- Capabilities: large numbered accordion rows with concise capability lists and imagery.
- Experience: horizontal trust-proof cards using real roles, followed by a portrait-led personal introduction.
- Contact: monochrome enquiry scene with an operational email form.
- FAQ: practical commissioning questions in minimal expanding rows.
- Footer: full-viewport black closing statement, social links, and oversized name.
- Marquee: seamless repeated outline-free typography, slowed on hover.
- Contact: oversized text link rather than a conventional button.
- Footer: black, sparse social/navigation links, oversized name treatment.

## Motion

Use `cubic-bezier(.22, 1, .36, 1)`. Prefer transforms, opacity, and clip-path. Desktop receives the full hero choreography and image reveals. Mobile uses shorter translate/opacity reveals and native scrolling. Respect reduced motion throughout.

## Texture

A two-layer monochrome film grain sits above the page without receiving pointer events. Animate the grain only for fine pointers; keep it static on touch devices.
