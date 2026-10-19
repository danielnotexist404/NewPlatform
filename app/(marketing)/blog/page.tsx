import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page/kit";
import { FinalCta } from "@/components/marketing/landing/faq-final";
import { BlogCard } from "@/components/marketing/content/blog-card";
import { TagChips } from "@/components/marketing/content/tag-chips";
import { BLOG_UI, postsByDate } from "@/content/he/blog";

export const metadata: Metadata = {
  title: { absolute: BLOG_UI.meta.title },
  description: BLOG_UI.meta.description,
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const [first, ...rest] = postsByDate();
  return (
    <div>
      <PageHero title={BLOG_UI.h1} sub="מדריכים קצרים לסרטונים ולקמפיינים, בעברית." className="pb-8 md:pb-12">
        <TagChips />
      </PageHero>
      <div className="container-marketing">
        <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2">
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
      <div className="mt-16"><FinalCta /></div>
    </div>
  );
}
