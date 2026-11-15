import { config, fields, collection, singleton } from '@keystatic/core';

/**
 * Keystatic editor config: the content model from docs/PLAN.md §3.
 * Locally Keystatic edits files on disk; in production it commits to GitHub.
 */
const projectImages = (label: string, description?: string) =>
  fields.image({
    label,
    description,
    directory: 'src/assets/projects',
    publicPath: '../../assets/projects/',
  });

const siteImage = (label: string, description?: string) =>
  fields.image({
    label,
    description,
    directory: 'src/assets/site',
    publicPath: '../../assets/site/',
  });

export const PROJECT_FORMATS = [
  { label: 'Club night / electronic music event', value: 'club-night' },
  { label: 'Concept event (fashion / art / tech / food)', value: 'concept-event' },
  { label: 'Listening session', value: 'listening-session' },
  { label: 'Festival', value: 'festival' },
  { label: 'Company / brand event', value: 'company-event' },
  { label: 'Other', value: 'other' },
] as const;

export default config({
  storage: import.meta.env.PROD
    ? { kind: 'github', repo: 'patshub65/undulate' }
    : { kind: 'local' },
  ui: {
    brand: { name: 'undulate' },
    navigation: {
      Work: ['projects'],
      Services: ['specialties', 'companyFormats'],
      Pages: ['settings', 'about', 'impressum', 'privacy'],
    },
  },
  collections: {
    projects: collection({
      label: 'Projects',
      slugField: 'title',
      path: 'src/content/projects/*',
      format: { contentField: 'writeup' },
      entryLayout: 'content',
      columns: ['title', 'template'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        template: fields.select({
          label: 'Template',
          description:
            'Series: the flyer grid leads. Case study: photos and write-up lead.',
          options: [
            { label: 'Series', value: 'series' },
            { label: 'Case study', value: 'case-study' },
          ],
          defaultValue: 'series',
        }),
        summary: fields.text({
          label: 'Short description',
          description: 'One or two sentences, shown on project cards.',
          multiline: true,
          validation: { length: { min: 1, max: 280 } },
        }),
        cover: projectImages('Cover image', 'Used on cards and at the top of the page.'),
        specialties: fields.multiRelationship({
          label: 'Specialties',
          description: 'What undulate did on this project. Pillars are derived automatically.',
          collection: 'specialties',
        }),
        format: fields.select({
          label: 'Format',
          options: [...PROJECT_FORMATS],
          defaultValue: 'club-night',
        }),
        client: fields.text({
          label: 'Client or partner',
          description: 'Optional, e.g. the company or festival this was for.',
        }),
        featured: fields.checkbox({ label: 'Feature on homepage', defaultValue: false }),
        order: fields.integer({
          label: 'Sort order',
          description: 'Lower numbers appear first. Leave empty to sort by latest event.',
        }),
        identity: fields.object(
          {
            accent: fields.text({
              label: 'Accent colour',
              description: 'Optional hex colour for this series, e.g. #ff5a36.',
              validation: { pattern: { regex: /^$|^#[0-9a-fA-F]{6}$/, message: 'Use a hex colour like #ff5a36' } },
            }),
            logo: projectImages('Series logo'),
          },
          { label: 'Series identity' },
        ),
        photos: fields.array(
          fields.object({
            image: projectImages('Photo'),
            alt: fields.text({ label: 'Description (for screen readers)' }),
          }),
          { label: 'Photos', itemLabel: (p) => p.fields.alt.value || 'Photo' },
        ),
        events: fields.array(
          fields.object({
            name: fields.text({ label: 'Event name', validation: { length: { min: 1 } } }),
            date: fields.date({ label: 'Date', validation: { isRequired: true } }),
            venue: fields.text({ label: 'Venue / city' }),
            flyer: projectImages('Flyer'),
            details: fields.text({
              label: 'Details',
              description: 'Any language. Shown in the popover.',
              multiline: true,
            }),
            link: fields.url({ label: 'Link (tickets or event page)' }),
          }),
          {
            label: 'Events',
            itemLabel: (e) => `${e.fields.date.value ?? ''} ${e.fields.name.value}`.trim(),
          },
        ),
        writeup: fields.markdoc({ label: 'Write-up' }),
      },
    }),

    specialties: collection({
      label: 'Specialties',
      slugField: 'name',
      path: 'src/content/specialties/*',
      format: { data: 'yaml' },
      columns: ['name', 'pillar'],
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        pillar: fields.select({
          label: 'Pillar',
          options: [
            { label: 'Event Production', value: 'production' },
            { label: 'Event Curation', value: 'curation' },
          ],
          defaultValue: 'production',
        }),
        description: fields.text({ label: 'One-line description', multiline: true }),
        order: fields.integer({ label: 'Sort order' }),
      },
    }),

    companyFormats: collection({
      label: 'Events for companies',
      slugField: 'name',
      path: 'src/content/company-formats/*',
      format: { data: 'yaml' },
      schema: {
        name: fields.slug({ name: { label: 'Format' } }),
        description: fields.text({ label: 'One-line description', multiline: true }),
        order: fields.integer({ label: 'Sort order' }),
      },
    }),
  },

  singletons: {
    settings: singleton({
      label: 'Site settings & homepage',
      path: 'src/content/pages/settings',
      format: { data: 'yaml' },
      schema: {
        email: fields.text({ label: 'Contact email', validation: { length: { min: 3 } } }),
        instagram: fields.url({ label: 'Instagram URL' }),
        hero: fields.object(
          {
            headline: fields.text({ label: 'Headline (speaks to companies)' }),
            subline: fields.text({ label: 'Subline', multiline: true }),
            cta: fields.text({ label: 'Button label', defaultValue: 'Plan your company event' }),
            image: siteImage('Hero image', 'From undulate’s own events.'),
            imageAlt: fields.text({ label: 'Hero image description' }),
          },
          { label: 'Hero' },
        ),
        pillars: fields.object(
          {
            production: fields.text({ label: 'Event Production intro', multiline: true }),
            curation: fields.text({ label: 'Event Curation intro', multiline: true }),
          },
          { label: 'Service pillars' },
        ),
        companies: fields.object(
          {
            heading: fields.text({ label: 'Heading', defaultValue: 'Events for companies' }),
            intro: fields.text({ label: 'Intro', multiline: true }),
            cta: fields.text({ label: 'Button label', defaultValue: 'Plan your company event' }),
          },
          { label: 'Events for companies section' },
        ),
        aboutTeaser: fields.text({ label: 'About teaser (homepage)', multiline: true }),
        closing: fields.object(
          {
            heading: fields.text({ label: 'Closing heading' }),
            text: fields.text({ label: 'Closing text', multiline: true }),
          },
          { label: 'Closing call to action' },
        ),
        upcomingCount: fields.integer({ label: 'Upcoming events shown on homepage', defaultValue: 4 }),
      },
    }),
    about: singleton({
      label: 'About',
      path: 'src/content/pages/about',
      format: { contentField: 'body' },
      entryLayout: 'content',
      schema: {
        title: fields.text({ label: 'Title', defaultValue: 'About' }),
        portrait: siteImage('Portrait'),
        portraitAlt: fields.text({ label: 'Portrait description' }),
        body: fields.markdoc({ label: 'Text' }),
      },
    }),
    impressum: singleton({
      label: 'Impressum',
      path: 'src/content/pages/impressum',
      format: { contentField: 'body' },
      entryLayout: 'content',
      schema: { body: fields.markdoc({ label: 'Text' }) },
    }),
    privacy: singleton({
      label: 'Datenschutz (privacy)',
      path: 'src/content/pages/privacy',
      format: { contentField: 'body' },
      entryLayout: 'content',
      schema: { body: fields.markdoc({ label: 'Text' }) },
    }),
  },
});
