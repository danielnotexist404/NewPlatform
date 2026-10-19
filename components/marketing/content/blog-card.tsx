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
        "group relative flex h-full flex-col",
        featured && "lg:grid lg:grid-cols-[1.15fr_1fr] lg:items-stretch",
      )}
    >
      <div className={cn("overflow-hidden rounded-[28px]", featured && "lg:h-full")}>
        <BlogCover post={post} size={featured ? "lg" : "sm"} className={cn("transition-transform duration-700 ease-out group-hover:scale-[1.03]", featured && "lg:h-full lg:aspect-auto lg:min-h-96")} />
      </div>
      <div className={cn("flex flex-1 flex-col gap-3 px-1 pt-5", featured && "lg:justify-center lg:px-12 lg:pt-0")}>
        <div className="flex flex-wrap items-center gap-2">
          {featured && <span className="rounded-full bg-accent-gradient px-2.5 py-0.5 text-micro text-ink">{BLOG_UI.featured}</span>}
          {post.tags.map((t) => (
            <span key={t} className="text-micro text-muted">
              #{BLOG_TAGS[t]}
            </span>
          ))}
        </div>
        <H className={cn("text-h3", featured && "lg:text-h2")}>
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none [&:focus-visible]:after:rounded-[28px] [&:focus-visible]:after:outline-2 [&:focus-visible]:after:outline-focus">
            {post.title}
          </Link>
        </H>
        <p className={cn("line-clamp-2 text-text-2", featured ? "text-body-lg" : "text-body")}>{post.description}</p>
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
