---
name: undulate-design
description: undulate's design rules, token system, the principles carried over from Ladenkit's review rounds, and the undulate rejection log. Load before any design variation, round brief, CSS or motion work on this site, and append to it after every review.
---

# undulate design skill

This file is the living record of what makes an undulate design good, and of what got cut. It is the generator: a variation is built by an agent that reads this file, `docs/BRIEF.md` and `docs/GENERATOR.md`, plus the round's references, and checks its own work against the principles below before a human sees it.

Its starting point is the design skill from Ladenkit, a sibling project that builds websites for small shops. Ladenkit ran about a dozen reviewed rounds; the **principles** it learned travel to any site and are carried over here with their provenance (`LK` plus the round). Its **solutions** (themes, shop archetypes, layouts) stay in Ladenkit and are not reused. Every review here adds undulate's own rounds to the log at the end.

## What undulate is (read first)

- An event company: Jasmin produces and curates electronic music events, concept events (fashion, art, tech, food), listening sessions and festivals. The site is one brand, not a template for many businesses.
- **The site has to win company clients** (startups, corporates with event budgets) by selling her subcultural credibility. The hero speaks to companies in words, while the imagery comes from her own events. Cool, never generic corporate, never a club flyer that a head of people can't book.
- Two audiences, one page: companies first, the scene (attendees, artists, collaborators) second. The upcoming-events strip and the project pages are for both.
- Full plan: `docs/PLAN.md`. Brief and palette: `docs/BRIEF.md`. What a variation may and may not change: `docs/GENERATOR.md`.

## Hard constraints

- **No third-party requests at runtime** except Plausible (cookieless). No CDN fonts, no embeds (Instagram, Spotify, YouTube, maps). This is what keeps the site free of a consent banner under German law.
- **No cookies.**
- **Impressum and Datenschutz** linked from every page.
- **Phone first.** Most visitors arrive from Instagram. 375px is the design width.
- **Every optional field can be empty.** A project with no photos, no events, no write-up, no series accent; a series with one flyer; an empty upcoming strip. The page still looks deliberate.
- **Jasmin edits everything in Keystatic.** A design never hard-codes copy that belongs in content, and never needs a field she can't fill.
- **Lighthouse ≥95** for performance and accessibility on the mobile profile, LCP ≤2.5s (the Ladenkit target; flyers and hero photos are the risk).
- **The content model, data layer, routes and homepage order are fixed** (`docs/GENERATOR.md`). A variation is tokens, styles, component markup and motion.

## Token system

- Base size `html{font-size:100%}`, so 1rem = 16px.
- **8pt grid.** Margins, padding, gaps and grid dimensions are multiples of 8px; 4px as a half-step for tight gaps. Values between steps round up. Line-heights snap to multiples of 8px (16/24, 32/40, 48/56). Borders and the pill radius are not on the grid. *(LK)*
- **Breathing room:** side margins at least 32px on a phone and 64px on desktop; at least 40px above the first text on a phone and 64px on desktop. `scripts/design-check.cjs` enforces these numbers, so change both together. *(LK gastro-r1: a 24px phone gutter read "too close to the edges")*
- **Section air:** at least 64px above a section head on a phone, about 128px on desktop. Air, not lines or boxes, separates sections. *(LK kontor-r1)*
- **Palette:** the logo colours in `src/styles/tokens.css` (`--palette-*`, `--gradient-*`). A variation maps roles (`--color-bg`, `--color-text`, `--color-brand`, `--color-accent`) onto them; contrast rules in `docs/BRIEF.md`.
- **Series colours** come from content (`--project-accent`), never from the variation.
- A useful reference value from Ladenkit, not a default: hairlines as `color-mix(in oklab, var(--ink) 14%, var(--paper))` at 1px; labels 13px, weight 500, tracking .16em, capitals; body 16px, prose 18px.

## Process

### The two rounds

1. **Round 1:** five directions (`docs/BRIEF.md`), one branch each, `design/<n>-<name>`, each its own Netlify preview. Jasmin shortlists two.
2. **Round 2:** refined versions of the two shortlisted directions. Jasmin picks the winner and may name elements to bring in from the others. The winner merges to `main`.

### Before building a direction, write down (in `design/rounds/<round>.md`)

1. **The visitor first.** What does a company's event lead do in the first ten seconds? What does someone from the scene do? What does the best event-agency or cultural-institution site in the world show that a local promoter's does not?
2. **Its one structural idea**, the memorable element. It must be structural, not decorative, and it must survive a project with one bad phone photo.
3. **The two references it combines,** from different styles, and the move it takes from each (see "Inspiration").
4. **The moves of the other directions it will not reuse.** Five directions that read as recolours of each other is a failed round. *(LK gastro-r2: "basically the same as gastro-07")*

### Building

- Start in `src/styles/tokens.css`, then components. Use the motion layer's attributes (`public/motion/motion.js`, CSS in `src/motion/motion.css`: `data-reveal`, `data-reveal-stagger`, `data-fade`, `data-parallax`, `data-tuck`, `data-hscroll`), no scroll JS of your own.
- Fonts: Google Fonts may be loaded while exploring a round, so faces can change cheaply; `design-check` flags them as third-party. Self-host once a face is agreed, and always before merge to `main`. *(LK)*
- Render it, don't imagine it. Check at 375 and 1280, every page type, with real content and with the sparse cases (a project with no photos, the company-summer-party project with no events).

### Before handing over

- `npm run build && npm run preview`, then `npm run design:check`. Loop until clean, apart from Google Fonts flagged during exploration.
- Run the tests in "Principles" on the renders yourself.
- Check hover, scroll and sticky states in a live browser session, not only in full-page captures: fixed elements appear mid-page in a full-page screenshot. *(LK)*
- `npm run design:sheet -- previews/<round>.png <label>=<url> ...` for the at-a-glance first screens of all directions.
- Hand over the preview URLs and a short list of where to look. **Self-assessment of visual quality is not useful and is not offered.** *(LK)*

### After review

Every verdict goes into the rejection log below **the same turn it is given**, as what was tried, what was kept or cut, and why in one sentence. A note that is a principle also goes into "Principles", with its round. Raw feedback can be kept in `design/feedback/<round>.json`. An empty log means the loop isn't working.

## Principles for any site

Carried over from Ladenkit's reviews (rounds named `LK ...`). Each says why and, where it can be checked, gives a test. Shop-specific wording has been translated to undulate's case; where the original example was a shop, the reasoning still holds.

### Layout and composition
- **One obvious first thing per screen.** A big type lockup, a photo treatment or both; without it the page reads mediocre. *(LK gastro-r1, gastro-r2, kontor-r1)* Test: cover the page at 375 and 1280; name the first thing in one word.
- **The hero comes first, the structural idea under it.** A page that opened on its mechanism read as a sub page or a wireframe of it. *(LK r6, gastro-r3, praxis-r1)* For undulate: the first phone screen carries the headline to companies, an image from her events and the "Plan your company event" button.
- **The hero fits the first phone screen.** Headline, subline and button fully visible at 375x812. The top margin is a minimum, not a target. *(LK gastro-r1, gastro-r2, landing-r6)*
- **The hero has one headline.** Several headline-sized lines stacked read saturated; one line carries the size, the rest steps down. *(LK gastro-r3)*
- **Nothing stacked on the hero for decoration.** A badge repeating a fact already in the copy is noise. *(LK kontor-r1, landing-r6)*
- **A typographic page with nothing else is not enough.** Type alone read "too simple and boring". *(LK gastro-r1, gastro-r2)*
- **Sections differ; a stack of bands is a wireframe.** Change scale, alignment and imagery from section to section. *(LK r3, studio-r4)*
- **Full bleed.** Frames, colour blocks, photos and the footer run to the edges; the side margins belong to the text inside them. A margin around the whole page was the first thing cut. *(LK r3, retail-r4, kontor-r1)*
- **Wide sections are wide.** A list left-aligned in half the page beside nothing reads unfinished; run it full width or give the other half a job. *(LK retail-r4)*
- **One concept, one aesthetic.** Three ideas on one page is three sites. *(LK gastro-r2, r3)*
- **A block over a photo sits in a corner of that photo,** flush with its edges, on solid colour. Never a translucent box (reads 2010s), never riding a seam between two areas. *(LK r3, kontor-r1)*
- **Every element survives its own absence.** No photo, no events, one project: the layout still reads as meant. *(LK, kontor-r1)*
- **Big type never collides.** Headings never overlap content at any width; `design-check` fails it. *(LK gastro-r1)*

### Hierarchy and type
- **Labels small, answers big.** A section word is a label; names, dates, formats carry the size. Giant label words competing with their content were cut. *(LK gastro-r1, gastro-r2, kontor-r1)*
- **A label carries a fact the heading does not:** a count, a date, a place. A label that echoes its heading reads as placeholder text. *(LK landing-r6)*
- **Two families, chosen for contrast, each text role in one style.** Long text is never in the display face. *(LK studio-r4, studio-r5)*
- **A display face is judged at its largest use.** A face that only works small is cut. *(LK studio-r5)*
- **Only true styles.** No synthetic italic; a face without one changes colour instead. *(LK kontor-r1)*
- **Text gets a real measure,** about 24rem at least for a description. *(LK kontor-r1)*
- **One text style per listing line.** Name, date, venue and tags bunched in four styles is noise. *(LK retail-r4)*
- **Buttons have a hierarchy.** One solid primary per screen (for undulate: the company enquiry), an outline secondary, text links for the rest. *(LK studio-r4)*
- **Display sizes are set for the real names.** Long titles ("Open Air Festival Production") must not break into three hyphenated lines; balance lines, no automatic hyphens. *(LK kontor-r3)*

### Lines, shapes and photos
- **Hairlines, not rules.** One weight, the thinnest the screen allows, a low mix of ink into paper. *(LK retail-r4, studio-r4, kontor-r1)*
- **A line is drawn once,** and **lines run edge to edge and close what they open.** *(LK kontor-r1)* Test: walk every section boundary at 1280.
- **A photo fills its place.** Inside a cell or band it runs to the edges; the words keep the margin. A photo never starts inset and opens on arrival. *(LK kontor-r1)*
- **One shape family, one angle family.** An arch beside rounded prints, tilted cards beside straight photos: two designs stitched together. *(LK retail-r4, studio-r5)*
- **Design for the photos you will actually get.** Owners' pictures were phone photos, and full-width placements showed them zoomed and soft. *(LK kontor-r3)* For undulate: flyers are 4:5 or square artwork with text in them (never crop them), event photos are often dark and grainy club shots. Design for both.

### Consistency
- **One language per page:** one line weight, one shape family, one tilt decision, one hover behaviour, one button hierarchy, one style per text role. Most "imbalance" notes trace back to two of something. *(LK retail-r4, studio-r4, studio-r5, kontor-r1)*
- **Directions differ in structure, not in colour and type.** *(LK gastro-r2)*
- **Learnings carry between rounds.** Read this file before every round. *(LK studio-r4)*

### Interaction and motion
- **The first screens move.** Static galleries and long text read as a brochure. *(LK gastro-r1, studio-r4)*
- **What reviewers liked:** sections that stack on scroll (two or three moments, never everything), accordions, text that fades or slides in once, large type shifting on scroll, words filling with the accent as their section is read, drag strips of tall photos, a photo's crop changing as the hero leaves, a full-width hero slider. *(LK gastro-r2, r3, retail-r4, studio-r4, studio-r5, landing-r3)*
- **Every interaction pays off.** A hover returns something: an image, a flyer, a fragment. A highlight that returns nothing teaches the visitor not to touch. *(LK landing-r3, landing-r4)*
- **A hover belongs to the thing under the pointer,** with a slow, quiet return, so neighbours never fire. *(LK landing-r6)*
- **Hover is quiet.** A face to its italic, a colour to full strength, a photo growing slightly (about 1.04 in cards), a button filling. No arrows sliding in, nothing moving sideways. *(LK gastro-r2, kontor-r1)*
- **A hover over a list comes in quickly and leaves slowly.** *(LK kontor-r3)*
- **Underlines belong to running text.** *(LK kontor-r1)*
- **Pattern motion stays out of reading text.** *(LK landing-r6)*
- **A choice shows where it leads.** *(LK praxis-r1)*
- **Motion reaches every browser.** Reveals tied only to the CSS scroll timeline showed nothing outside Chrome; use the motion layer, keep scroll-linked CSS as an extra. Never under reduced motion, never opacity tricks on body text that leave it unreadable. *(LK kontor-r3)*

### Navigation and the phone
- **The phone nav is designed.** A wrapping list of page names is not a nav; a menu button, a dock at the thumb or a sideways band is. *(LK r3, retail-r4, kontor-r1)*
- **The phone is held in one hand.** The primary action reaches the thumb; docked buttons at the foot of the screen were liked twice. *(LK retail-r4, studio-r4, kontor-r1)*
- **A sticky bar gives the page back,** sliding away while reading down, returning on the way up (`data-tuck`), and it works without its script. *(LK kontor-r1)*
- **The side rail is one option, not the default.** *(LK r3)*

### Content and text
- **Never shorten or rewrite the owner's text; choose what shows first.** Long write-ups get a designed treatment (first paragraph and a photo first, the rest behind a toggle). *(LK r3, studio-r4, studio-r5)*
- **Enough images to look like the business.** Mostly text with thin photos read sparse. *(LK r6)* For undulate, flyers and event photos are the richest material: design them as much as the type.
- **Interaction does not design a list.** Filters and bold type still leave a list; the projects index needs imagery or a visual component of its own. *(LK retail-r6, praxis-r1)*
- **Short and not literal** for any copy we write: the advantage, not the mechanism. *(LK landing-r2, landing-r3)*
- **The visitor recognises themselves** in the first screen. *(LK landing-r1)* For undulate: a company sees its own occasion (a launch, a summer party, an offsite).
- **Voice:** no em-dash asides, no three-item lists as the default rhythm, no "not X but Y", no marketing adjectives. *(LK house style)* `design-check` flags em dashes.

### Colour and brand
- **A palette and a face are a decision, not a default.** Cream, rust and a soft grotesk read as machine-made; nobody should be able to tell which tool made the site. *(LK landing-r3)*
- **A grey ground and a muted accent read dull.** Calm is not grey. *(LK praxis-r2)*
- **A restrained palette can still be bold:** darker, a more striking accent, matching the type's boldness. *(LK retail-r4)*
- **Colour fields do not sit hard against each other** unless the pair is checked; some pairs clash. *(LK landing-r6)* undulate's palette has several loud pairs (red against pink, mint against yellow): check them.
- **Motifs from the trade beat abstract patterns.** *(LK landing-r6)* For undulate: waveforms, flyer grids, sound systems, the "undulating" line, not generic blobs.

- **Not a conference.** Large condensed capitals as the default heading style read as a tech conference; giant type is a single moment on a page, not every section's heading. *(undulate r1)*
- **No stock type.** A generic serif plus a generic sans (Bodoni, Gloock, Hanken, Albert Sans, Manrope, Archivo) or a stock condensed display (Anton, Bebas, Big Shoulders) is a default, not a decision. *(undulate r1)*
- **Gradients: subtle, grainy, full width.** A soft abstract gradient with grain across the full width works; wave-shaped edges and blobs do not. *(undulate r1)*
- **A neutral ground with bold buttons.** Use few palette colours: a neutral ground and one or two bold colours for buttons and moments, not every colour on every page. *(undulate r1)*

### Inspiration
- **Inspiration is a starting point, not a component library.** No more than one direction per round takes the same element from the same reference; each direction combines at least two picks from different styles. *(LK r3, studio-r4)*
- **An idea is worth building only if the client would want it.** *(LK retail-r6)*

## Recurring signals (Ladenkit)

What came back in three or more Ladenkit rounds; check these first when time is short.

1. Lines too heavy or too many.
2. Spacing and breathing room off.
3. Too much text, not designed.
4. Static, no interaction.
5. Inconsistency: two of something.
6. Hovers that return nothing, or too much.
7. A large typographic footer, the name edge to edge, was liked every time it was tried.
8. No hero, or a hero without hierarchy.

## Inspiration

References live in `design/inspiration/` (see its README). The Eagle library on Patrick's Mac is the source; `design/inspiration/eagle-index.json` is its annotated index. Agents sketch from the prepared slices and their `Take` lines, never from the whole library.

## Rejection log

One entry per reviewed direction. Format: what was tried, what was kept or cut, why, in one or two sentences, naming the references that led there.

### r1 (reviewed by Patrick, 2026-11-15)

No direction shortlisted. Round 2 starts over from new directions rather than refining two.

- **Whole round:** five directions shared the same section patterns (the company formats section in particular) and differed mostly in colour and some layout, so the round read as recolours. Large condensed capitals everywhere made all five look like a tech conference.
- **1 After Dark** (`hero-giant-year-filmstrip`, `listing-shows-grid-genre-tags`): cut. Big Shoulders capitals and the ink-and-neon frame are part of the conference look.
- **2 Gallery Sand** (`index-project-rows-roles`, `about-founder-split-pill-nav`, `hero-type-scattered-images-rails`): cut. Gloock and Hanken Grotesk are a generic serif-and-sans pairing.
- **3 Poster** (`events-past-flyers-stacked`, `services-bento-cards`, `poster-future-boutique`): the pillars as two full colour fields (yellow and violet), each listing its specialties under hairline rules in two columns, are **kept as a section with potential**. Bebas Neue is cut.
- **4 Gradient Wave** (`hero-roster-names-gradient`, `hero-gradient-condensed-type`, `about-card-over-giant-type`): **kept with potential:** the full-width closing band with a vertical violet-to-lilac gradient and the email as a solid pill, and the project header on a soft radial gradient in the series accent with outline pill specialties. The wave-edge masks are cut, and so is Anton.
- **5 Editorial** (`index-chapter-rows`, `profile-two-photos-text-column`, `about-text-over-portrait`): cut. Bodoni Moda and Albert Sans are a generic serif-and-sans pairing.
- **About page:** too thin. It needs several sections about Jasmin and how she works, not one text over a portrait.
