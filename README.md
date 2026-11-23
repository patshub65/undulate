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

Content status: **bananas are berries** and **Future Boutique** are real series (their flyers are real; the write-ups are placeholders). The other three projects are fictional samples, marked `[Sample project]`, to be replaced by Jasmin's 4 to 6 launch projects. All other images are placeholders.

## Deploy (Netlify)

The site is the Netlify project **`undulate`** (https://undulate.netlify.app). It is linked to this repo and builds from `netlify.toml`.

- **Production branch:** `main`. Every commit to `main`, including each save in Keystatic, rebuilds the live site.
- **Deploy previews:** every pull request gets a preview at `https://deploy-preview-<PR number>--undulate.netlify.app`. Design variants are reviewed this way: open a **draft** PR from the design branch into `main` and don't merge it.
- **Why the repo is public:** on Netlify's free plan, a private repo only builds commits whose author is a member of the Netlify team. That blocked previews of commits made by Claude and would block Jasmin's Keystatic edits. If the repo goes private again, every commit author needs a seat on the Netlify team.

### Environment variables

Set these in Netlify under **Site configuration → Environment variables**, with all scopes:

| Variable | Value |
|---|---|
| `SITE_URL` | The live URL: `https://undulate.netlify.app` for now, then the final domain |
| `PUBLIC_PLAUSIBLE_DOMAIN` | The domain as registered in Plausible |
| `KEYSTATIC_GITHUB_CLIENT_ID` | From the GitHub App (see below) |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | From the GitHub App |
| `KEYSTATIC_SECRET` | Any long random string (40+ characters) |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | The GitHub App's slug, the `<slug>` in `github.com/apps/<slug>` |

`PUBLIC_` variables are fixed at build time, so trigger a new deploy after changing them (**Deploys → Trigger deploy**).

### Keystatic (the editor at `/keystatic`)

Production builds store content in GitHub, and local dev edits the files on disk (see `keystatic.config.ts`). Keystatic's automatic "Create GitHub App" screen only appears in GitHub mode, so local dev never shows it. Create the app by hand instead:

1. On GitHub, go to **Settings → Developer settings → GitHub Apps → New GitHub App** and fill in:
   - **Homepage URL:** the live URL.
   - **Callback URL:** `https://<live domain>/api/keystatic/github/oauth/callback`. An app can hold several callback URLs, so add one for each domain the editor should work on.
   - **Request user authorization (OAuth) during installation:** on.
   - **Webhook:** off.
   - **Repository permissions:** Contents *Read and write*, Pull requests *Read and write*.
   - **Where it can be installed:** only on this account.
2. On the app page, copy the **Client ID**, generate a **client secret** and note the **slug**. Put them in the Netlify variables above.
3. Under **Install App**, install it on this repo only.
4. Trigger a deploy. Then open `https://<live domain>/keystatic` and log in with GitHub. A save commits to `main`, and Netlify rebuilds.

The editor only works on the domains listed as callback URLs, so it doesn't work on deploy-preview links.

### Before Jasmin uses it, and before launch

1. **Visitor access:** Netlify protects new projects with a Netlify team login. Turn it off for production under **Site configuration → Access & security → Visitor access**. Otherwise Jasmin and the public can't open the site.
2. **Jasmin's account:** give her GitHub account write access to this repo (**Settings → Collaborators**). She then logs in at `/keystatic` the same way.
3. **Daily rebuild:** create a Netlify build hook and call it once a day, for example from a scheduled GitHub Action, so that past events leave the "Coming up" strip. A small script on the page already hides past events between builds.
4. **Domain:** point Jasmin's domain at Netlify (**Domain management**). Then update `SITE_URL` and add the domain's callback URL to the GitHub App.

## Compliance (Germany)

The site is set up so that no cookie banner is needed:

- Fonts are self-hosted only: put the files in `public/fonts/` and add `@font-face` rules.
- No third-party embeds (Instagram, Spotify, YouTube). Link to them instead.
- Plausible is the only external script, and it's cookieless.

Impressum and Datenschutz must contain real text before launch.
