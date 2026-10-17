import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";

const SUFFIX = ` · ${BRAND.nameHe}`;

/**
 * Title rule (Part 02 §5.11, `buildTitle`): ≤ 60 chars with the brand suffix (added by the root template);
 * too long → drop the suffix; still too long → the short alternative.
 */
export function titleFor(main: string, short?: string): NonNullable<Metadata["title"]> {
  if ((main + SUFFIX).length <= 60) return main;
  if (main.length <= 60) return { absolute: main };
  const alt = short ?? main;
  return { absolute: alt.length <= 60 ? alt : `${alt.slice(0, 59).replace(/\s+\S*$/, "")}…` };
}

export function clampDesc(s: string, max = 155): string {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

export function pageMeta(o: { title: string; short?: string; description: string; path: string; canonical?: string; index?: boolean }): Metadata {
  const title = titleFor(o.title, o.short);
  const description = clampDesc(o.description);
  return {
    title,
    description,
    alternates: { canonical: o.canonical ?? o.path },
    robots: o.index === false ? { index: false, follow: true } : undefined,
    openGraph: { title: typeof title === "string" ? title : (title as { absolute: string }).absolute, description, url: o.path, locale: "he_IL", type: "website", siteName: BRAND.nameHe },
  };
}
