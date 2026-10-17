import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/marketing/content/page-hero";
import { BlogCard } from "@/components/marketing/content/blog-card";
import { TagChips } from "@/components/marketing/content/tag-chips";
import { BLOG_POSTS, BLOG_TAGS, BLOG_UI, postsForTag, type BlogTag } from "@/content/he/blog";

const isTag = (t: string): t is BlogTag => t in BLOG_TAGS;

export function generateStaticParams() {
  const used = new Set(BLOG_POSTS.flatMap((p) => p.tags));
  return [...used].map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;
  if (!isTag(tag)) return {};
  return {
    title: BLOG_UI.tagH1(BLOG_TAGS[tag]),
    description: `${BLOG_UI.tagH1(BLOG_TAGS[tag])}: ${BLOG_UI.meta.description}`,
    alternates: { canonical: `/blog/tag/${tag}` },
  };
}

export default async function BlogTagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  if (!isTag(tag)) notFound();
  const posts = postsForTag(tag);
  if (!posts.length) notFound();
  return (
    <div className="pb-8">
      <PageHero
        crumbs={[{ label: BLOG_UI.crumb, href: "/blog" }, { label: BLOG_TAGS[tag] }]}
        eyebrow={BLOG_UI.eyebrow}
        title={BLOG_UI.tagH1(BLOG_TAGS[tag])}
        lede={BLOG_UI.tagLede(posts.length)}
      >
        <TagChips active={tag} />
      </PageHero>
      <div className="container-marketing">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <li key={p.slug}>
              <BlogCard post={p} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
