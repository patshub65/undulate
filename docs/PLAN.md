# undulate website: plan

The plan for the undulate website, agreed in a planning interview. It is the brief for the build and for the website generator that produces the design variations.

## 1. Context

undulate is a music and cultural event company run by its founder, Jasmin, who is based in Germany. She produces, curates, books and promotes events:

- electronic music events
- interdisciplinary concept events that combine fashion, art, tech and food around a topic
- listening sessions
- festival production and promotion

Some events belong to series that have their own look and feel, for example bananas are berries.

## 2. Audience and positioning

**Primary audience: clients.** These are mainly corporates, startups and other companies with real event budgets who might hire Jasmin for a company event. Brands, venues, festivals and cultural partners are also clients.

**Secondary audience: the scene.** Attendees, artists and collaborators. They want to see what is coming up and what undulate has done. Their presence is also proof of credibility for clients.

**Positioning.** Subcultural credibility is the selling point. undulate is cooler than a generic event company because of Jasmin's background in cultural and subcultural scenes. She is very good at curating cool spaces, and brings that to companies that can pay properly for it. Every page, and every call to action in particular, should get this across: "the same curation behind our club nights and concept events, for your company's moments."

**Voice.** The site uses a hybrid voice. undulate is the brand, and Jasmin is visible throughout as the founder and the person behind it. She writes in the first person where the text is about her work.

**Language.** English throughout. Event details may stay in the language the event was promoted in.

## 3. Content model

The content is file-based and edited in Keystatic.

### Project (the only main content type)

Everything undulate has done is a project. A series such as bananas are berries is one project, and so is a one-off concept event, a festival production or a corporate job.

| Field | Notes |
|---|---|
| title, slug | |
| template | `series` puts the flyer grid first. `case-study` puts photos and the write-up first. More templates can be added later without changing the model. |
| description | short text, used on cards |
| write-up | optional long text |
| photos | optional gallery |
| specialties | multi-select from the services list (see below). The pillars are worked out from these automatically. |
| format | optional, for example festival, concept event, listening session, club night |
| events | optional list (see below) |
| featured | boolean. Featured projects appear on the homepage. |
| identity accents | optional per-series touches such as a logo or accent colour, shown inside the undulate frame |

### Event (inside a project, with no page of its own)

| Field | Notes |
|---|---|
| name | |
| date | drives the upcoming-events strip |
| flyer | the main image in the project's event grid |
| details | short text, in any language |
| link | optional external link to tickets or an event page |

On a project page, events appear as a **grid of flyers**. Clicking a flyer opens a **popover** with the details and the link. Once an event's date has passed, it drops off the homepage strip and stays in its project's grid.

### Services: two pillars with specialties

The specialty list is editable in Keystatic and is expected to grow.

- **Event Production**: festival production, artist care, hospitality, bar management
- **Event Curation**: booking (including electronic music booking), promotion (including event promoting)

Projects are tagged with specialties, and each specialty belongs to one pillar.

### Company event formats

An editable list of the kinds of events undulate offers companies, each with a one-line description. Starting suggestions: product launches, brand activations, company parties, summer and winter events, team offsites with a cultural programme, client and partner nights, conference side events.

## 4. Pages (v1)

### Home, in this order

1. **Hero.** The words address companies directly, and the imagery comes from undulate's own cultural work, so the site reads as cool and the copy makes clear she is for hire.
2. **Event Production and Event Curation.** Each pillar gets a short description and its specialties. Each one links to the Projects page filtered to it.
3. **Events for companies.** The company event formats, with a company-focused call to action such as "Plan your company event".
4. **Featured projects.**
5. **Upcoming events strip.** The next few events across all projects, built automatically from event dates. It uses the same popover as project pages.
6. **About teaser**, linking to About.
7. **Email call to action.**

### Other pages

- **Projects.** An index of all projects, filterable by pillar and by specialty. Pillar and specialty links elsewhere land here with the filter already applied.
- **Project.** One page per project, rendered with its template.
- **About.** Jasmin's story, approach and background, with a portrait, in her voice.
- **Impressum** and **Datenschutz** (privacy), linked in the footer.

**Contact** is an email link in the header, the footer and the calls to action. There is no form and no contact page.

## 5. Stack and operations

- **Framework:** Astro, a static site, with content as files in this repo (Astro content collections).
- **Editor:** Keystatic at `/keystatic`, so Jasmin can create and edit projects, events, specialties and formats herself. Each save commits to the repo.
- **Hosting:** Netlify (free tier). It rebuilds the site on each commit, and her existing domain points to it.
- **Analytics:** Plausible (hosted, cookieless, EU). It tracks custom events for email-link clicks, call-to-action clicks, views of the "Events for companies" section and project views.
- **EU and German compliance:** Impressum and privacy pages, self-hosted fonts, no third-party embeds or tracking (no Google Fonts, no Instagram or Spotify embeds) and therefore **no cookie banner**.
- **Images:** optimised at build time, with flyers and photos served in responsive sizes.

## 6. Visual identity

The identity is partly defined. Jasmin has drafted a logo with colours, and the rest of the identity comes out of the design process below.

- All colours, typefaces, spacing and radii are held as **design tokens**, seeded from the logo colours.
- undulate's frame should let each series' own look (flyers, accent colours) sit comfortably inside it.
- The site must work well on phones, because most visitors arrive from Instagram.

## 7. Design and build process

Design happens in code, using a website generator agent that already exists in another project.

1. **Adapt the generator** to this use case, using inspiration sites and screenshots, this plan and the target stack.
2. **Build the shared skeleton** in this repo: Astro, Keystatic, the content model above, the page routes and sample content. Every variation is built on this skeleton, so the variations differ only in design.
3. **Round 1:** the generator produces **five broad directions**, each as its own Netlify preview URL. Jasmin shortlists **two**.
4. **Round 2:** the generator produces refined variations of the two shortlisted directions. Jasmin picks the winner and can bring in specific elements from other variations.
5. **The winner becomes the site.**

**Checklist for judging variations:**

- Does the hero speak to companies while looking unmistakably subcultural?
- Do the logo colours work?
- Do series flyers sit well inside the undulate frame?
- Is the "Events for companies" call to action easy to find?
- Does it work well on a phone?

## 8. Content for launch

- Jasmin gathers the material for **4 to 6 projects**, covering both pillars and both templates. She **writes all the copy herself** in the editor.
- The rest of the archive is added after launch, one project at a time.

## 9. Open items

- [ ] Does Jasmin have any past corporate or brand work? If so, it should be one of the launch projects and featured on the homepage.
- [ ] The drafted logo files and colour values, to seed the design tokens.
- [ ] The details for the Impressum.
- [ ] Privacy policy text, for example from the eRecht24 generator, checked by Jasmin.
- [ ] Domain name and where it is registered, to point it at Netlify.
- [ ] A GitHub account for Jasmin to log into Keystatic.
- [ ] A Plausible account.

## 10. After launch (not v1)

- A newsletter sign-up, embedded in the footer and beside the upcoming-events strip
- The full project archive
- More project templates as needed

## Decisions log

| # | Decision |
|---|---|
| 1 | The site is mainly for clients, while also acting as the overview of all undulate events and series. |
| 2 | Hybrid voice: undulate is the brand, and Jasmin is visible throughout. |
| 3–4, 10–11 | Projects are the only main content type, with templates. Events sit inside projects with no pages of their own. |
| 5 | Static site, and Jasmin edits it herself through a browser editor. |
| 6 | Partial identity: the drafted logo and colours are the basis. |
| 7–9 | Design in code with the generator, on a shared Astro skeleton. The winning variation becomes the site. |
| 12 | Upcoming events appear as a homepage strip only. There is no "What's on" page. |
| 13 | Contact is an email link only. |
| 14 | No newsletter in v1. |
| 15 | Pages: Home, Projects, Project, About, plus the legal pages. |
| 16–17 | Netlify hosting with Keystatic, using the existing domain. |
| 18 | English, with event details allowed in their original language. |
| 19 | Jasmin writes all copy and gathers 4 to 6 launch projects. |
| 20–21 | Two pillars, Event Production and Event Curation, with specialties that can grow. Projects are tagged by specialty, and format is a separate field. |
| 22 | An "Events for companies" formats section, built on her subcultural credibility. |
| 23 | Homepage: the hero speaks to companies, with the section order as in §4. |
| 24 | EU-compliant by default, with no cookie banner. |
| 25 | Plausible analytics. |
| 26 | The winner is chosen in two rounds (five directions, then two), with elements from others allowed in the final pick. |
