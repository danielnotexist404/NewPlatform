import Link from "next/link";
import { DirIcon } from "@/components/a11y/dir-icon";
import { cn } from "@/lib/utils";
import { BLOG_TAGS, BLOG_UI, type BlogPost } from "@/content/he/blog";
import { BlogCover } from "./blog-cover";
import { metaParts } from "./blog-meta";

/** BlogCard (Part 02 §8.1): cover, title, description, date and reading time. */
export function BlogCard({ post, featured = false, headingLevel = 2 }: { post: BlogPost; featured?: boolean; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl bg-surface-1 shadow-[inset_0_0_0_1px_var(--color-frame)] elev-1 transition-[background-color,box-shadow] hover:bg-surface-2 hover:elev-2",
        featured && "lg:grid lg:grid-cols-[1.15fr_1fr] lg:items-stretch",
      )}
    >
      <div className={cn("p-3 pb-0", featured && "lg:p-4 lg:pe-0")}>
        <BlogCover post={post} size={featured ? "lg" : "sm"} className={cn("transition-transform duration-[var(--duration-panel)] group-hover:scale-[1.01]", featured && "lg:h-full lg:aspect-auto lg:min-h-80")} />
      </div>
      <div className={cn("flex flex-1 flex-col gap-3 p-5", featured && "lg:justify-center lg:p-10")}>
        <div className="flex flex-wrap items-center gap-2">
          {featured && <span className="rounded-xs bg-primary px-2 py-0.5 text-micro text-on-primary">{BLOG_UI.featured}</span>}
          {post.tags.map((t) => (
            <span key={t} className="text-micro text-muted">
              #{BLOG_TAGS[t]}
            </span>
          ))}
        </div>
        <H className={cn("text-h3", featured && "lg:text-h2")}>
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none [&:focus-visible]:after:rounded-xl [&:focus-visible]:after:outline-2 [&:focus-visible]:after:outline-focus">
            {post.title}
          </Link>
        </H>
        <p className={cn("text-text-2", featured ? "text-body-lg" : "text-small")}>{post.description}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3 text-micro font-normal text-muted">
          <span>{metaParts(post).slice(1).join(" · ")}</span>
          <span aria-hidden className="inline-flex items-center gap-1 font-semibold text-primary-text">
            {BLOG_UI.read}
            <DirIcon name="forward" className="size-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
