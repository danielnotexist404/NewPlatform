import type { Metadata } from "next";
import { Globe } from "lucide-react";
import { LandingList } from "@/components/landing-pages/landing-list";
import { LP_LIST, LP_META } from "@/content/he/landing-pages";

export const metadata: Metadata = {
  title: LP_META.list.title,
  description: LP_META.list.description,
  robots: { index: false },
};

export default function LandingPagesPage() {
  return (
    <div className="flex flex-col gap-8 pb-12">
      <header className="flex flex-col gap-3">
        <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-micro text-primary-text">
          <Globe aria-hidden className="size-3.5" />
          {LP_LIST.eyebrow}
        </p>
        <h1 className="text-h1">{LP_LIST.h1}</h1>
        <p className="max-w-3xl text-body-lg text-text-2">{LP_LIST.lead}</p>
      </header>
      <LandingList />
    </div>
  );
}
