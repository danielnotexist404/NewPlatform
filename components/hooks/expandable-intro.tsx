"use client";
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SmartText } from "./hook-text";

/** SEO intro: full text in the HTML; on mobile the first 3 lines show until "להמשך קריאה" (Part 02 §5.6 item 3). */
export function ExpandableIntro({ paragraphs, more, less, className }: { paragraphs: string[]; more: string; less: string; className?: string }) {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();
  return (
    <div className={className}>
      <div
        id={id}
        className={cn(
          "flex flex-col gap-4 text-body-lg text-text-2",
          !open && "max-md:max-h-[5.1em] max-md:overflow-hidden max-md:[mask-image:linear-gradient(to_bottom,black_55%,transparent)]",
        )}
      >
        {paragraphs.map((p) => (
          <p key={p.slice(0, 40)}>
            <SmartText text={p} />
          </p>
        ))}
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary-text hover:underline md:hidden"
      >
        {open ? less : more}
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
    </div>
  );
}
