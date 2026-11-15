# Generator brief: undulate

**Build five design directions for the undulate website on this repo's skeleton.** Load `.claude/skills/undulate-design/SKILL.md` first. It holds the principles learned on Ladenkit, and every direction is checked against them. The rules are in `docs/GENERATOR.md`: restyle only, keeping the content model, routes and section order. The background is in `docs/PLAN.md`.

## The client

undulate is Jasmin's event company, based in Germany, working in event production and event curation. Her background is in club nights, concept events (fashion, art, tech and food), listening sessions and festivals. **The site has to win company clients**, such as startups and corporates with real event budgets, by selling her subcultural credibility: *"cooler than a generic event agency, because she comes from the scene."*

**Tone:** confident, warm, and scene-literate rather than corporate. The hero copy speaks to companies, and the imagery is from her own events.

## Palette (from the drafted logo)

| Token | Hex | Role ideas |
|---|---|---|
| yellow | `#f2d833` | highlight, accent on dark |
| red | `#f24a33` | energy accent, used sparingly |
| mint | `#33f5bc` | accent on dark |
| violet | `#4c33f2` | strong brand candidate, buttons |
| dusk | `#5f559d` | softer brand and surfaces |
| sand | `#d4c5b4` | warm light ground |
| ink | `#191a18` | dark ground and text |
| white | `#ffffff` | |

**Gradients (logo):**

- mint `#33f5bc` → teal `#008fa5`
- ink `#191a18` → grey `#686b6a`
- violet `#4c33f2` → lilac `#b893ff`
- red `#f24a33` → pink `#ff2191`
- dusk `#5f559d` → orchid `#f2a0df`

**Contrast notes:**

- Yellow, mint, sand and lilac need **dark text** (`#191a18`).
- White text works on violet, dusk and ink.
- On red, white text only works at large or bold sizes.
- Body text should always be ink on a light ground or white on ink.

**Don't use every colour at once.** Each direction picks a ground, one main brand colour and one or two accents. Gradients are for moments such as the hero, highlights and hover states, not for large areas of reading text.

## Five directions

The five should be clearly different from each other:

1. **After Dark:** an ink ground with neon accents (mint and yellow), and the violet-to-lilac gradient in the hero. Feels like the club.
2. **Gallery Sand:** a sand ground with ink type, generous space and a single violet accent. Feels like a curated art space, and is the most "trustworthy for corporates".
3. **Poster:** bold type and colour-blocked sections, with Production and Curation each given their own colour. Feels like flyer and poster culture.
4. **Gradient Wave:** a white or sand frame with the logo gradients used as flowing "undulating" shapes or bands, a nod to the name.
5. **Editorial:** mostly white and ink with dusk as the brand colour, magazine-style typography, and imagery that does the talking.

## Must-haves in every direction

- Set the palette in `src/styles/tokens.css`, and replace the placeholder favicon and wordmark styling.
- The hero headline addresses companies, and the "Plan your company event" button is visible without scrolling.
- The "Events for companies" section stands out, since it's the main way companies will convert.
- Series accent colours (`--project-accent`) and flyers sit inside the undulate frame without clashing.
- Fonts may come from Google Fonts while exploring, but must be self-hosted from `public/fonts/` before a direction merges.
- It works on a phone first: side margins of 32px on a phone and 64px on desktop, no horizontal scroll, and `npm run design:check` passes.
- Passes WCAG AA contrast for text.
- Light and dark mode are optional. Each direction can be a single mode, but the design must be deliberate.

## Deliverables

- One branch per direction, `design/<n>-<name>`, each with its Netlify preview URL.
- A desktop and a mobile screenshot of Home, a series project page (`/projects/bananas-or-berries/`) and a case study page (`/projects/texture-studies/`).
- One line per direction saying what it's going for.

Jasmin shortlists two of the five, and round 2 refines those two.
