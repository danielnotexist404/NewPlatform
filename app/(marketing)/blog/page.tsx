import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/content/page-hero";
import { BlogCard } from "@/components/marketing/content/blog-card";
import { TagChips } from "@/components/marketing/content/tag-chips";
import { BLOG_UI, postsByDate } from "@/content/he/blog";

export const metadata: Metadata = {
  title: BLOG_UI.meta.title,
  description: BLOG_UI.meta.description,
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const [first, ...rest] = postsByDate();
  return (
    <div className="pb-8">
      <PageHero crumbs={[{ label: BLOG_UI.crumb }]} eyebrow={BLOG_UI.eyebrow} title={BLOG_UI.h1} lede={BLOG_UI.lede}>
        <TagChips />
      </PageHero>
      <div className="container-marketing">
        <ul className="grid gap-6 md:grid-cols-2">
          {first && (
            <li className="md:col-span-2">
              <BlogCard post={first} featured />
            </li>
          )}
          {rest.map((p) => (
            <li key={p.slug}>
              <BlogCard post={p} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
