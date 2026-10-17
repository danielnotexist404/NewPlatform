import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LandingEditor } from "@/components/landing-pages/landing-editor";
import { PageSkeleton } from "@/components/trends/page-skeleton";
import { DirIcon } from "@/components/a11y/dir-icon";
import { LP_EDITOR, LP_META } from "@/content/he/landing-pages";
import { getWorkspacePage, NEW_PAGE_ID, WORKSPACE_PAGES } from "@/lib/mock/landing-pages";

/** Builder / editor for one business page (§S.1, §S.7). `new` = generate from the brand kit. */
export function generateStaticParams() {
  return [...WORKSPACE_PAGES.map((p) => ({ id: p.id })), { id: NEW_PAGE_ID }];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  if (id === NEW_PAGE_ID) return { title: LP_META.newPage.title, description: LP_META.newPage.description, robots: { index: false } };
  const page = getWorkspacePage(id);
  const m = LP_META.editor(page?.business.nameHe ?? "");
  return { title: m.title, description: m.description, robots: { index: false } };
}

export default function LandingPageEditorPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="flex flex-col gap-5 pb-12">
      <Link href="/app/landing-pages" className="inline-flex w-fit items-center gap-1 text-small font-semibold text-text-2 hover:text-text">
        <DirIcon name="back" />
        {LP_EDITOR.back}
      </Link>
      <Suspense fallback={<PageSkeleton />}>
        <Editor params={params} />
      </Suspense>
    </div>
  );
}

async function Editor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === NEW_PAGE_ID;
  const page = getWorkspacePage(id);
  if (!isNew && !page) notFound();
  return (
    <>
      <h1 className="text-h2">{isNew ? LP_META.newPage.title : LP_META.editor(page!.business.nameHe).title.split(" · ")[0]}</h1>
      <LandingEditor pageId={id} />
    </>
  );
}
