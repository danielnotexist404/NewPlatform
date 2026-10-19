/**
 * Demo reels for the marketing site (2026 "clean" redesign). Hooks are real seed hooks (lib/data/seed.ts);
 * the view counters are illustrative and always rendered with a visible "דוגמה" label.
 * No real business, customer or result is represented.
 */
import { isReel, reelFromHook, type ReelData } from "@/components/marketing/media/reel-data";

export type { ReelData };

/** Hero fan, in DOM (reading) order: start side → end side. Index 2 is the large center phone. */
export const HERO_REELS: ReelData[] = [
  reelFromHook("barbers-salons-01", { caption: "box", viewsK: 48.2, sponsored: true, highlight: 1 }),
  reelFromHook("restaurants-01", { caption: "shadow", viewsK: 31.7, highlight: 3 }),
  reelFromHook("real-estate-02", { caption: "box", viewsK: 126, sponsored: true, highlight: 4 }),
  reelFromHook("beauty-nails-01", { caption: "box", viewsK: 22.4, highlight: 3 }),
  reelFromHook("zimmers-boutique-hotels-02", { caption: "shadow", viewsK: 57.9, sponsored: true, highlight: 0 }),
].filter(isReel);

/** The looping gallery strip. */
export const STRIP_REELS: ReelData[] = [
  reelFromHook("dentists-03", { caption: "box", viewsK: 64.3, highlight: 0 }),
  reelFromHook("fitness-trainers-01", { caption: "shadow", viewsK: 88.1, highlight: 2 }),
  reelFromHook("renovation-contractors-01", { caption: "box", viewsK: 41.5, highlight: 3 }),
  reelFromHook("ecommerce-02", { caption: "accent", viewsK: 19.8, highlight: 4, sponsored: true }),
  reelFromHook("event-venues-01", { caption: "shadow", viewsK: 73.2, highlight: 3 }),
  reelFromHook("interior-design-01", { caption: "box", viewsK: 36.4, highlight: 4 }),
  reelFromHook("vets-dog-grooming-01", { caption: "shadow", viewsK: 52.6, highlight: 3 }),
  reelFromHook("aesthetic-clinics-01", { caption: "box", viewsK: 27.9, highlight: 3, sponsored: true }),
  reelFromHook("djs-musicians-01", { caption: "shadow", viewsK: 95.4, highlight: 4 }),
  reelFromHook("car-dealers-01", { caption: "box", viewsK: 44.7, highlight: 0 }),
].filter(isReel);

/** Reel shown inside "איך זה עובד", step 2. */
export const STEP_REEL: ReelData | null = reelFromHook("restaurants-01", { caption: "box", viewsK: 31.7, highlight: 3 });
