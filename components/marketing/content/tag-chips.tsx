import Link from "next/link";
import { BLOG_TAGS, BLOG_UI, postsByDate, type BlogTag } from "@/content/he/blog";
import { cn } from "@/lib/utils";

/** Tag chips of the blog hub and tag pages (Part 02 §8.1). */
export function TagChips({ active }: { active?: BlogTag }) {
  const used = new Set(postsByDate().flatMap((p) => p.tags));
  const tags = (Object.keys(BLOG_TAGS) as BlogTag[]).filter((t) => used.has(t));
  const chip = "inline-flex h-9 items-center rounded-full border px-4 text-small font-semibold transition-colors";
  return (
    <nav aria-label={BLOG_UI.tagsLabel} className="mt-8">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link href="/blog" aria-current={!active ? "page" : undefined} className={cn(chip, !active ? "border-primary bg-primary text-on-primary" : "border-border-strong text-text-2 hover:text-text")}>
            {BLOG_UI.allTags}
          </Link>
        </li>
        {tags.map((t) => (
          <li key={t}>
            <Link
              href={`/blog/tag/${t}`}
              aria-current={active === t ? "page" : undefined}
              className={cn(chip, active === t ? "border-primary bg-primary text-on-primary" : "border-border-strong text-text-2 hover:text-text")}
            >
              {BLOG_TAGS[t]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
