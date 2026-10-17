import { getHookType, hooksForNiche, launchNiches, nicheShortName } from "@/lib/data/seed";
import { WALL_TILES } from "@/lib/mock/landing";
import { Section, SectionHeading } from "./section-heading";
import { NicheShowcase, type ShowcaseNiche } from "./niche-showcase";
import { LANDING } from "@/content/he/landing";

const firstSentence = (s: string) => {
  const i = s.indexOf(". ");
  return i > 0 ? s.slice(0, i + 1) : s;
};

/** §3.5 — data for all 14 launch niches is embedded in the static HTML so switching is instant. */
export function NichesSection() {
  const T = LANDING.niches;
  const items: ShowcaseNiche[] = launchNiches().map((n) => {
    const all = hooksForNiche(n.slug);
    const picked = [...all.filter((h) => h.is_featured), ...all.filter((h) => !h.is_featured)].slice(0, 3);
    const wall = WALL_TILES.find((t) => t.nicheSlug === n.slug);
    const phoneHook = picked.find((h) => h.placeholders.length === 0) ?? picked[0];
    return {
      slug: n.slug,
      label: nicheShortName(n),
      icon: n.icon,
      categorySlug: n.category_slug,
      line: firstSentence(n.description_he),
      preset: wall?.captionPreset ?? "bold-pop",
      phoneText: phoneHook?.text_he ?? "",
      hooks: picked.map((h) => ({
        id: h.id,
        text: h.text_he,
        typeName: getHookType(h.hook_type_slug)?.name_he ?? "",
        visual: h.visual_direction_he,
      })),
    };
  });
  return (
    <Section id="niches" labelledBy="niches-title" className="bg-afterglow">
      <SectionHeading id="niches-title" eyebrow={T.eyebrow} title={T.title} subtitle={T.subtitle} />
      <NicheShowcase items={items} />
    </Section>
  );
}
