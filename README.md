# undulate

This is the website for undulate, Jasmin's event production and curation company. The plan and all the decisions behind it are in [`docs/PLAN.md`](docs/PLAN.md). The rules for design variations are in [`docs/GENERATOR.md`](docs/GENERATOR.md), and the brief for the generator is [`docs/BRIEF.md`](docs/BRIEF.md). The generator itself is the design skill in [`.claude/skills/undulate-design/`](.claude/skills/undulate-design/SKILL.md), with references in [`design/inspiration/`](design/inspiration/README.md).

**Stack:** Astro (static) · Keystatic (browser editor at `/keystatic`) · Netlify · Plausible

## Develop

```bash
npm install
npm run dev
```

- The site runs at http://localhost:4321.
- The editor runs at http://localhost:4321/keystatic. In development it edits the files in `src/content` directly.
- `npm run build` creates a production build, and `npm run check` type-checks the project.
- `npm run design:check [url]` checks a running build for layout faults, third-party requests and cookies, and `npm run design:sheet` makes a contact sheet comparing directions.
- `npm run placeholders` generates labelled placeholder images for any image path that is referenced in the content but missing on disk.

## Where things live

| Path | What |
|---|---|
| `keystatic.config.ts` | Editor fields: the content model |
| `src/content.config.ts` | The same model as Astro schemas. **Keep it in sync with `keystatic.config.ts`.** |
| `src/content/projects/*.mdoc` | Projects (front matter plus the write-up) |
| `src/content/specialties/*.yaml` | Services: each specialty belongs to a pillar (production or curation) |
| `src/content/company-formats/*.yaml` | The "Events for companies" list |
| `src/content/pages/` | Site settings and homepage copy (`settings.yaml`), About, Impressum, Datenschutz |
| `src/assets/` | Images uploaded through the editor |
| `src/lib/content.ts` | Data layer: every page reads content through this |
| `src/components/`, `src/layouts/`, `src/styles/` | Presentation: what design variations change |

Content status: **bananas or berries** is a real series with placeholder text. The other four projects are fictional samples, marked `[Sample project]`, to be replaced by Jasmin's 4 to 6 launch projects. All images are placeholders.

## Deploy (Netlify)

1. In Netlify, choose **Add new site → Import from Git** and pick this repo. The build settings come from `netlify.toml`.
2. Set the environment variables `SITE_URL` (the final domain) and `PUBLIC_PLAUSIBLE_DOMAIN` (the domain as registered in Plausible).
3. **Keystatic GitHub mode:** run `npm run dev` locally and open `/keystatic`. Because production uses GitHub storage, follow Keystatic's "Create GitHub App" flow. It creates the GitHub app and prints `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` and `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`. Add all four to Netlify's environment variables. The app's callback URL must be `https://<domain>/api/keystatic/github/oauth/callback`.
4. Install the GitHub app on this repo and give Jasmin's GitHub account write access. She then logs in at `https://<domain>/keystatic`.
5. **Daily rebuild:** create a Netlify build hook and call it once a day, for example from a scheduled GitHub Action, so that past events leave the "Coming up" strip. A small script on the page already hides past events between builds.
6. Point Jasmin's domain at Netlify (**Domain management**).

## Compliance (Germany)

The site is set up so that no cookie banner is needed:

- Fonts are self-hosted only: put the files in `public/fonts/` and add `@font-face` rules.
- No third-party embeds (Instagram, Spotify, YouTube). Link to them instead.
- Plausible is the only external script, and it's cookieless.

Impressum and Datenschutz must contain real text before launch.
