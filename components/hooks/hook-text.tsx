import * as React from "react";
import { attachPrefix, bidiRuns, placeholderLabel, segments, type Values } from "./text";
import { cn } from "@/lib/utils";

/** Unfilled placeholder: lemon highlighter with the field name ("עיר"). */
export function PlaceholderChip({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={cn(
        "mx-0.5 inline-flex items-center rounded-[6px] bg-lemon px-1.5 align-baseline text-[0.82em] font-bold leading-[1.45] text-on-primary",
        className,
      )}
    >
      {placeholderLabel(name)}
    </span>
  );
}

function Runs({ text }: { text: string }) {
  return (
    <>
      {bidiRuns(text).map((r, i) => (r.isolate ? <bdi key={i}>{r.text}</bdi> : <React.Fragment key={i}>{r.text}</React.Fragment>))}
    </>
  );
}

/**
 * Hook text with {placeholders}: unfilled → PlaceholderChip, filled → plain text with a dotted underline.
 * Latin words and numbers are bidi-isolated (Part 02 §5.2).
 */
export function HookText({ text, values, className }: { text: string; values?: Values; className?: string }) {
  const segs = segments(text);
  return (
    <span className={className}>
      {segs.map((s, i) => {
        if (s.kind === "text") return <Runs key={i} text={s.text} />;
        const v = values?.[s.name]?.trim();
        if (!v) {
          return (
            <React.Fragment key={i}>
              {s.prefix}
              <PlaceholderChip name={s.name} />
            </React.Fragment>
          );
        }
        return (
          <span key={i} className="underline decoration-primary-text decoration-dotted decoration-2 underline-offset-[6px]">
            <Runs text={attachPrefix(s.prefix, v, s.name)} />
          </span>
        );
      })}
    </span>
  );
}
