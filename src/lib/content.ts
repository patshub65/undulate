/**
 * Data layer. Pages and components get content only through these helpers,
 * so design variations can restyle freely without touching data logic.
 */
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;
export type Specialty = CollectionEntry<'specialties'>;
export type PillarId = 'production' | 'curation';

export const PILLARS: Record<PillarId, { id: PillarId; name: string }> = {
  production: { id: 'production', name: 'Event Production' },
  curation: { id: 'curation', name: 'Event Curation' },
};

export const FORMAT_LABELS: Record<Project['data']['format'], string> = {
  'club-night': 'Club night',
  'concept-event': 'Concept event',
  'listening-session': 'Listening session',
  festival: 'Festival',
  'company-event': 'Company event',
  other: 'Event',
};

const byOrder = <T extends { data: { order?: number | null } }>(a: T, b: T) =>
  (a.data.order ?? 999) - (b.data.order ?? 999);

export async function getSettings() {
  const entry = await getEntry('settings', 'settings');
  if (!entry) throw new Error('Missing src/content/pages/settings.yaml');
  return entry.data;
}

/**
 * The About page: its entry (render the story with <Prose entry={entry} />),
 * its section fields, and the series it lists (every project on the series template).
 */
export async function getAbout() {
  const entry = await getEntry('pages', 'about');
  if (!entry) throw new Error('Missing src/content/pages/about.mdoc');
  const series = (await getProjects()).filter((p) => p.data.template === 'series');
  return { entry, ...entry.data, series };
}

export async function getSpecialties() {
  return (await getCollection('specialties')).sort(byOrder);
}

/** Pillars with their specialties, in display order. */
export async function getPillars() {
  const specialties = await getSpecialties();
  return (Object.keys(PILLARS) as PillarId[]).map((id) => ({
    ...PILLARS[id],
    specialties: specialties.filter((s) => s.data.pillar === id),
  }));
}

export async function getCompanyFormats() {
  return (await getCollection('companyFormats')).sort(byOrder);
}

function latestEventTime(p: Project) {
  return Math.max(0, ...p.data.events.map((e) => e.date.getTime()));
}

/** All projects: explicit sort order first, then most recent activity. */
export async function getProjects() {
  return (await getCollection('projects')).sort(
    (a, b) => byOrder(a, b) || latestEventTime(b) - latestEventTime(a),
  );
}

export async function getFeaturedProjects() {
  return (await getProjects()).filter((p) => p.data.featured);
}

/** Specialty entries for a project, plus the pillars they roll up to. */
export async function getProjectServices(project: Project) {
  const all = await getSpecialties();
  const ids = new Set(project.data.specialties.map((r) => r.id));
  const specialties = all.filter((s) => ids.has(s.id));
  const pillars = [...new Set(specialties.map((s) => s.data.pillar))].map((id) => PILLARS[id]);
  return { specialties, pillars };
}

export type EventItem = Project['data']['events'][number] & {
  project: { id: string; title: string; accent?: string };
};

/** Events from today onwards across all projects, soonest first. */
export async function getUpcomingEvents(limit?: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const events: EventItem[] = (await getProjects()).flatMap((p) =>
    p.data.events
      .filter((e) => e.date >= today)
      .map((e) => ({
        ...e,
        project: { id: p.id, title: p.data.title, accent: p.data.identity.accent },
      })),
  );
  events.sort((a, b) => a.date.getTime() - b.date.getTime());
  return limit ? events.slice(0, limit) : events;
}

export function formatDate(d: Date) {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** ISO date (YYYY-MM-DD), used by the client script that hides past events. */
export function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function mailto(email: string, subject?: string) {
  return subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;
}

export function projectsUrl(filter?: { pillar?: string; specialty?: string }) {
  const params = new URLSearchParams(filter as Record<string, string>);
  const q = params.toString();
  return `/projects/${q ? `?${q}` : ''}`;
}
