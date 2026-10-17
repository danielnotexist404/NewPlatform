/**
 * Resolves the content of a niche page: the written launch text (§4.4–§4.5) or a generated version built only
 * from seed fields. Tokens ({{BRAND}}, {draftCredits}…) are filled from lib/constants and lib/data/plans.
 */
import { getNiche, nicheExtra, nicheShortName, type Niche } from "@/lib/data/seed";
import { BRAND } from "@/lib/constants";
import { VIDEO_COST_EXAMPLES } from "@/lib/data/plans";
import { getHookType } from "@/lib/data/seed";
import {
  COMPLIANCE_DISCLAIMERS, CTA_LINES, GENERATED, HOOK_COUNT_SUCH, NICHE_CONTENT,
  type NicheContent, type NicheFaq, type SampleScript, type VideoTypeKey,
} from "@/content/he/niches";
import { HOOKS_COPY } from "@/content/he/hooks";
import { hooksOfNiche } from "@/components/hooks/hook-data";
import { joinHe, plural } from "@/components/hooks/text";
import { creditsToIls } from "./blocks";

const draft = VIDEO_COST_EXAMPLES[1].credits;
const standard = VIDEO_COST_EXAMPLES[2].credits;
const ils = (n: number) => `₪${new Intl.NumberFormat("he-IL").format(n)}`;

function fill(s: string, n: Niche): string {
  const count = hooksOfNiche(n.slug).length;
  return s
    .replaceAll("{{BRAND}}", BRAND.nameHe)
    .replaceAll("{draftCredits}", String(draft))
    .replaceAll("{standardCredits}", String(standard))
    .replaceAll("{draftIls}", ils(creditsToIls(draft)))
    .replaceAll("{standardIls}", ils(creditsToIls(standard)))
    .replaceAll("{hookCountSuch}", plural(count, HOOK_COUNT_SUCH));
}

export const disclaimersFor = (n: Niche) => COMPLIANCE_DISCLAIMERS[n.compliance_flag] ?? [];

function topTypeNames(n: Niche, limit = 3): string[] {
  const counts = new Map<string, number>();
  for (const h of hooksOfNiche(n.slug)) counts.set(h.typeSlug, (counts.get(h.typeSlug) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([slug]) => getHookType(slug)?.name_he ?? slug);
}

const VIDEO_TYPE_GUESS: VideoTypeKey[] = ["reel_hook", "brand_promo", "explainer"];

function generatedScripts(n: Niche): SampleScript[] {
  const short = nicheShortName(n);
  const extra = nicheExtra(n.slug);
  const cta = CTA_LINES[(extra?.default_cta as string) ?? "whatsapp"] ?? CTA_LINES.whatsapp;
  const hooks = hooksOfNiche(n.slug);
  const picks = hooks.filter((h) => h.featured).concat(hooks.filter((h) => !h.featured)).slice(0, 3);
  const O = GENERATED.outline;
  return picks.map((h, i) => ({
    title_he: n.video_types_he[i] ?? h.typeName,
    video_type: VIDEO_TYPE_GUESS[i] ?? "reel_hook",
    duration_sec: 30,
    hook_id: h.id,
    outline: true,
    beats: [
      { role: "hook", vo_he: h.text, onscreen_text_he: h.text.split(/[.?:–]/)[0].trim() },
      { role: "problem", vo_he: O.problem, onscreen_text_he: O.problemOn },
      { role: "solution", vo_he: O.solution(short), onscreen_text_he: O.solutionOn },
      { role: "proof", vo_he: O.proof, onscreen_text_he: O.proofOn },
      { role: "cta", vo_he: cta, onscreen_text_he: cta },
    ],
    cta_text_he: cta,
    disclaimers_he: disclaimersFor(n),
  }));
}

function generated(n: Niche): NicheContent {
  const short = nicheShortName(n);
  const extra = nicheExtra(n.slug);
  const cta = CTA_LINES[(extra?.default_cta as string) ?? "whatsapp"] ?? CTA_LINES.whatsapp;
  const disc = disclaimersFor(n)[0] ?? null;
  const count = hooksOfNiche(n.slug).length;
  const types = topTypeNames(n);

  const intro: string[] = [n.description_he, GENERATED.how(BRAND.nameHeWith.b, short, joinHe(n.video_types_he), cta)];
  if (n.compliance_note_he) intro.push(GENERATED.rules(n.compliance_note_he, disc));
  intro.push(GENERATED.formats());

  const faq: NicheFaq[] = [
    { q_he: GENERATED.faq.what.q(short), a_he: GENERATED.faq.what.a(joinHe(n.video_types_he.slice(0, 3))) },
    { q_he: GENERATED.faq.cost.q, a_he: fill(GENERATED.faq.cost.a, n) },
    { q_he: GENERATED.faq.hooks.q(short), a_he: GENERATED.faq.hooks.a(plural(count, HOOKS_COPY.niche.hooksCount), joinHe(types)) },
    n.compliance_note_he
      ? { q_he: GENERATED.faq.rules.q, a_he: GENERATED.faq.rules.a(n.compliance_note_he) }
      : { q_he: GENERATED.faq.where.q, a_he: GENERATED.faq.where.a },
    { q_he: GENERATED.faq.photographer.q, a_he: GENERATED.faq.photographer.a },
  ];

  return {
    reviewed: false,
    landing_intro_he: intro,
    seo_intro_he: [n.description_he, GENERATED.hooksIntro(short, joinHe(types)), GENERATED.hooksIntroRule],
    faq,
    sample_scripts: generatedScripts(n),
  };
}

export function nicheContent(slug: string): NicheContent | null {
  const n = getNiche(slug);
  if (!n) return null;
  const c = NICHE_CONTENT[slug];
  if (!c) return generated(n);
  return {
    ...c,
    landing_intro_he: c.landing_intro_he.map((p) => fill(p, n)),
    seo_intro_he: c.seo_intro_he.map((p) => fill(p, n)),
    faq: c.faq.map((f) => ({ q_he: fill(f.q_he, n), a_he: fill(f.a_he, n) })),
  };
}
