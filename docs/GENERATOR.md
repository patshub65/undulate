# Contract for design variations

The website generator builds each design direction on this skeleton. All variations share the **same content and structure**, so they differ **only in design**. That keeps them comparable, and it means the winner can become the site without being ported. The full background is in `docs/PLAN.md`.

## Variations may change

- `src/styles/tokens.css`: colours, type, spacing and radii. **Start here.** Seed the brand colours from the undulate logo.
- `src/styles/base.css`: global styles.
- Markup and styles in `src/components/**` and `src/layouts/BaseLayout.astro`.
- Fonts. Google Fonts are allowed while exploring a round. Self-host them in `public/fonts/` once a face is agreed, and always before merging to `main`.
- Motion, through the motion layer's attributes (`data-reveal`, `data-parallax`, `data-tuck`, `data-hscroll` and others; see `public/motion/motion.js`) and CSS. The content still works without JavaScript and under reduced motion.
- Imagery treatment (crops, overlays, filters).

## Variations must not change

- **The content model:** `keystatic.config.ts`, `src/content.config.ts`, `src/content/**`. Jasmin edits content through these.
- **The data layer:** `src/lib/content.ts`. Read everything through its helpers.
- **Routes:** `/`, `/projects/`, `/projects/[slug]/`, `/about/`, `/impressum/`, `/datenschutz/`.
- **Homepage section order:** Hero → Pillars → Events for companies → Featured projects → Coming up → About teaser → Closing.
- **Behaviour hooks:**
  - `data-track` and `data-track-view` attributes (analytics)
  - `data-upcoming` and `data-event-date` (hiding past events)
  - `data-project-list`, `data-filter`, `data-pillars` and `data-specialties` (project filters)
  - native `popover` and `popovertarget` for events
- **Legal and compliance:** footer links to Impressum and Datenschutz, no third-party embeds, no cookies.

## Rules from the plan

- **Positioning:** the hero speaks to **companies** in words, while the imagery comes from undulate's own subcultural events. The look should be cool, never generic corporate.
- **Series identity:** a series' accent colour (`--project-accent`) and logo should sit inside the undulate frame, not replace it.
- **Events** have no pages of their own: they are a flyer plus a popover.
- **Phones first:** most visitors arrive from Instagram. Side margins of at least 32px on a phone and 64px on desktop, and no horizontal scroll. `npm run design:check` enforces this.
- **Contact** is only the email link, through `mailto()`.

## Judging checklist

- [ ] Does the hero speak to companies while looking unmistakably subcultural?
- [ ] Do the logo colours work?
- [ ] Do series flyers and accents sit well inside the undulate frame?
- [ ] Is the "Events for companies" call to action easy to find?
- [ ] Does it work well on a phone?

## Workflow

The full process is in the skill under "Process". In short:

- Build each variation on its own branch, `design/<n>-<name>`. Netlify branch deploys give each one a preview URL.
- **Round 1:** five directions, from which Jasmin shortlists two.
- **Round 2:** refined versions of the shortlisted two.
- The winner merges to `main`.
