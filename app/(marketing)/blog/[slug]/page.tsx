import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BRAND } from "@/lib/constants";
import { Breadcrumbs } from "@/components/marketing/content/breadcrumbs";
import { BlogCover } from "@/components/marketing/content/blog-cover";
import { BlogCard } from "@/components/marketing/content/blog-card";
import { Blocks } from "@/components/marketing/content/blocks";
import { JsonLd } from "@/components/marketing/content/json-ld";
import { Toc } from "@/components/marketing/content/toc";
import { splitSections } from "@/components/marketing/content/markdown";
import { renderInline } from "@/components/marketing/content/inline";
import { metaParts } from "@/components/marketing/content/blog-meta";
import { formatHeDate } from "@/components/marketing/content/dates";
import { BLOG_POSTS, BLOG_TAGS, BLOG_UI, getPost, relatedPosts } from "@/content/he/blog";
import { CONTENT_UI } from "@/content/he/site";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.seoTitle,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.seoTitle, description: post.description, url: `/blog/${post.slug}`, publishedTime: post.date, modifiedTime: post.updated },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { intro, sections } = splitSections(post.body);
  const toc = sections.map((s) => ({ id: s.id, title: s.title }));
  const related = relatedPosts(post);
  const [lead, ...introRest] = intro;

  return (
    <article className="pb-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.updated ?? post.date,
          inLanguage: "he",
          author: { "@type": "Organization", name: post.author },
          publisher: { "@type": "Organization", name: BRAND.nameHe, url: `https://${BRAND.domain}` },
          mainEntityOfPage: `https://${BRAND.domain}/blog/${post.slug}`,
        }}
      />
      <header className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-afterglow opacity-70" />
        <div className="container-marketing relative pt-8 md:pt-12">
          <Breadcrumbs items={[{ label: BLOG_UI.crumb, href: "/blog" }, { label: post.title }]} />
          <div className="mx-auto mt-10 max-w-4xl text-center">
            <ul className="flex flex-wrap justify-center gap-2" aria-label={BLOG_UI.tagsLabel}>
              {post.tags.map((t) => (
                <li key={t}>
                  <Link href={`/blog/tag/${t}`} className="inline-flex h-8 items-center rounded-full border border-border-strong px-3 text-micro text-text-2 hover:text-text">
                    {BLOG_TAGS[t]}
                  </Link>
                </li>
              ))}
            </ul>
            <h1 className="mt-6 text-h1">{post.title}</h1>
            <p className="mx-auto mt-5 max-w-2xl text-body-lg text-text-2">{post.description}</p>
            <p className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-small text-muted">
              {metaParts(post).map((m, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden>·</span>}
                  {m}
                </span>
              ))}
              {post.updated && (
                <span className="flex items-center gap-2">
                  <span aria-hidden>·</span>
                  {BLOG_UI.updated(formatHeDate(post.updated))}
                </span>
              )}
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-5xl">
            <BlogCover post={post} className="rounded-xl elev-3" />
          </div>
        </div>
      </header>

      <div className="container-marketing mt-12 grid gap-10 xl:grid-cols-[minmax(0,1fr)_16rem] xl:gap-16">
        <div className="min-w-0">
          <div className="mx-auto max-w-[68ch] xl:me-0 xl:ms-auto">
            {lead && lead.t === "p" && <p className="mb-6 text-[1.3rem] font-medium leading-relaxed text-text">{renderInline(lead.text, "site", "lead")}</p>}
            <div className="xl:hidden">
              <Toc items={toc} title={CONTENT_UI.tocBlog} variant="mobile" />
            </div>
            <div className="prose-he">
              <Blocks blocks={lead && lead.t === "p" ? introRest : intro} mode="site" idPrefix="intro" />
              {sections.map((s) => (
                <section key={s.id} aria-labelledby={s.id}>
                  <h2 id={s.id} className="scroll-mt-[calc(var(--header-h)+24px)] text-h2">
                    {s.title}
                  </h2>
                  <Blocks blocks={s.blocks} mode="site" idPrefix={s.id} />
                </section>
              ))}
            </div>
          </div>
        </div>
        <aside className="hidden xl:block">
          <Toc items={toc} title={CONTENT_UI.tocBlog} variant="desktop" />
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related" className="container-marketing mt-20">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 id="related" className="text-h2">{BLOG_UI.more}</h2>
            <Link href="/blog" className="text-small font-semibold text-primary-text hover:underline">
              {BLOG_UI.backToBlog}
            </Link>
          </div>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p.slug}>
                <BlogCard post={p} headingLevel={3} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
