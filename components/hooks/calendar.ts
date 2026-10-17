/** Season calendar helpers on top of SEASON_DATES (approximate until Hebcal dates land, Appendix B). Pure. */
import { seasons, type Season } from "@/lib/data/seed";
import { SEASON_DATES, SEASONS_WITHOUT_PAGE } from "@/content/he/hooks";
import { daysBetween } from "./text";

export interface DatedSeason { season: Season; start: string; end: string }

export const datedSeasons: DatedSeason[] = seasons
  .filter((s) => SEASON_DATES[s.slug] && !(SEASONS_WITHOUT_PAGE as readonly string[]).includes(s.slug))
  .map((s) => ({ season: s, ...SEASON_DATES[s.slug] }))
  .sort((a, b) => a.start.localeCompare(b.start));

/** Next seasons by start date (ongoing ones first). `today` null → the calendar order (prerender). */
export function upcomingSeasons(today: string | null, limit: number, filter?: (s: Season) => boolean): DatedSeason[] {
  const list = datedSeasons.filter((d) => !filter || filter(d.season));
  if (!today) return list.slice(0, limit);
  return list.filter((d) => d.end >= today).slice(0, limit);
}

export function quietDayToday(today: string | null): Season | null {
  if (!today) return null;
  return datedSeasons.find((d) => d.season.is_quiet_day && d.start <= today && today <= d.end)?.season ?? null;
}

export type SeasonPhase = { kind: "upcoming"; days: number } | { kind: "now" } | { kind: "ended" };

export function seasonPhase(slug: string, today: string): SeasonPhase | null {
  const d = SEASON_DATES[slug];
  if (!d) return null;
  if (today < d.start) return { kind: "upcoming", days: daysBetween(today, d.start) };
  if (today <= d.end) return { kind: "now" };
  return { kind: "ended" };
}
