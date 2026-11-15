import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Astro-side schemas. These mirror keystatic.config.ts; keep both in sync.
 * Keystatic writes empty optional fields as null or '', hence the nullish().
 */
const optText = z.string().nullish().transform((v) => v || undefined);

const projects = defineCollection({
  loader: glob({ pattern: '*.mdoc', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      template: z.enum(['series', 'case-study']).default('series'),
      summary: z.string(),
      cover: image().nullish(),
      specialties: z.array(reference('specialties')).default([]),
      format: z
        .enum(['club-night', 'concept-event', 'listening-session', 'festival', 'company-event', 'other'])
        .default('other'),
      client: optText,
      featured: z.boolean().default(false),
      order: z.number().int().nullish(),
      identity: z
        .object({ accent: optText, logo: image().nullish() })
        .default({ accent: undefined, logo: null }),
      photos: z
        .array(z.object({ image: image().nullish(), alt: optText }))
        .default([]),
      events: z
        .array(
          z.object({
            name: z.string(),
            date: z.coerce.date(),
            venue: optText,
            flyer: image().nullish(),
            details: optText,
            link: optText,
          }),
        )
        .default([]),
    }),
});

const specialties = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/specialties' }),
  schema: z.object({
    name: z.string(),
    pillar: z.enum(['production', 'curation']),
    description: optText,
    order: z.number().int().nullish(),
  }),
});

const companyFormats = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/company-formats' }),
  schema: z.object({
    name: z.string(),
    description: optText,
    order: z.number().int().nullish(),
  }),
});

const settings = defineCollection({
  loader: glob({ pattern: 'settings.yaml', base: './src/content/pages' }),
  schema: ({ image }) =>
    z.object({
      email: z.string(),
      instagram: optText,
      hero: z.object({
        headline: z.string(),
        subline: optText,
        cta: z.string().default('Plan your company event'),
        image: image().nullish(),
        imageAlt: optText,
      }),
      pillars: z.object({ production: optText, curation: optText }),
      companies: z.object({
        heading: z.string().default('Events for companies'),
        intro: optText,
        cta: z.string().default('Plan your company event'),
      }),
      aboutTeaser: optText,
      closing: z.object({ heading: optText, text: optText }),
      upcomingCount: z.number().int().nullish(),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.mdoc', base: './src/content/pages' }),
  schema: ({ image }) =>
    z.object({
      title: optText,
      portrait: image().nullish(),
      portraitAlt: optText,
    }),
});

export const collections = { projects, specialties, companyFormats, settings, pages };
