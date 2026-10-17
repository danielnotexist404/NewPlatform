import * as React from "react";
import { Info, Lightbulb, TriangleAlert, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTENT_UI } from "@/content/he/site";
import type { Block } from "./markdown";
import { renderInline, type InlineMode } from "./inline";
import { resolveOwnerVar } from "./owner-vars";
import { HookEmbed } from "./hook-embed";
import { CtaBox } from "./cta-box";
import { PrintFormButton } from "./print-form-button";

const CALLOUT = {
  tip: { icon: Lightbulb, ring: "border-success/50", tint: "bg-success/10", text: "text-success" },
  warning: { icon: TriangleAlert, ring: "border-primary-text/60", tint: "bg-primary/10", text: "text-primary-text" },
  note: { icon: Info, ring: "border-violet/50", tint: "bg-violet/10", text: "text-violet" },
} as const;

/**
 * Responsive table: a real <table> from md up; below md each row becomes a card with labelled
 * cells. Explicit ARIA roles keep table semantics when the display changes.
 */
function Table({ head, rows, mode }: { head: string[]; rows: string[][]; mode: InlineMode }) {
  return (
    <div className="not-prose my-6 md:overflow-x-auto md:rounded-md md:shadow-[inset_0_0_0_1px_var(--color-frame)]">
      <table role="table" className="w-full border-collapse text-[0.98rem] max-md:block">
        <thead role="rowgroup" className="max-md:sr-only">
          <tr role="row" className="bg-surface-2">
            {head.map((h, i) => (
              <th key={i} role="columnheader" scope="col" className="px-4 py-3 text-start align-bottom text-small font-semibold text-text-2">
                {renderInline(h, mode, `th${i}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup" className="max-md:flex max-md:flex-col max-md:gap-3">
          {rows.map((r, ri) => (
            <tr
              key={ri}
              role="row"
              className="border-t border-border align-top max-md:flex max-md:flex-col max-md:gap-2 max-md:rounded-md max-md:border-0 max-md:bg-surface-1 max-md:p-4 max-md:shadow-[inset_0_0_0_1px_var(--color-frame)]"
            >
              {r.map((c, ci) => (
                <td key={ci} role="cell" className={cn("px-4 py-3 text-start leading-relaxed max-md:p-0", ci === 0 && "font-semibold text-text")}>
                  {ci > 0 && head[ci] && (
                    <span aria-hidden className="mb-0.5 block text-micro font-semibold text-muted md:hidden">
                      {head[ci]}
                    </span>
                  )}
                  {renderInline(c, mode, `td${ri}-${ci}`)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Blocks({ blocks, mode = "legal", idPrefix = "b" }: { blocks: Block[]; mode?: InlineMode; idPrefix?: string }) {
  return (
    <>
      {blocks.map((b, i) => {
        const key = `${idPrefix}-${i}`;
        switch (b.t) {
          case "p":
            if (b.cond && resolveOwnerVar(b.cond) === null) return null;
            return <p key={key}>{renderInline(b.text, mode, key)}</p>;
          case "h3":
            return (
              <h3 key={key} id={b.id} className="scroll-mt-[calc(var(--header-h)+24px)]">
                {renderInline(b.text, mode, key)}
              </h3>
            );
          case "ul":
            return (
              <ul key={key}>
                {b.items.map((it, j) => (
                  <li key={j}>{renderInline(it, mode, `${key}-${j}`)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={key} start={b.start}>
                {b.items.map((it, j) => (
                  <li key={j}>{renderInline(it, mode, `${key}-${j}`)}</li>
                ))}
              </ol>
            );
          case "clauses":
            return (
              <ol key={key} className="flex list-none flex-col gap-3 ps-0">
                {b.items.map((c, j) => (
                  <li key={j} className="my-0 grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-2">
                    <span className="num pt-px text-small font-semibold text-muted">
                      <bdi dir="ltr">{c.n.replace(/\.$/, "")}</bdi>
                    </span>
                    <span>{renderInline(c.text, mode, `${key}-${j}`)}</span>
                  </li>
                ))}
              </ol>
            );
          case "table":
            return <Table key={key} head={b.head} rows={b.rows} mode={mode} />;
          case "quote":
            return (
              <blockquote key={key}>
                {b.paras.map((p, j) => (
                  <p key={j}>{renderInline(p, mode, `${key}-${j}`)}</p>
                ))}
              </blockquote>
            );
          case "callout": {
            const s = CALLOUT[b.kind] ?? CALLOUT.note;
            const Icon = s.icon;
            return (
              <aside key={key} className={cn("not-prose my-8 rounded-md border-s-4 p-5", s.ring, s.tint)}>
                <p className={cn("mb-2 flex items-center gap-2 font-bold", s.text)}>
                  <Icon aria-hidden className="size-5 shrink-0" />
                  {b.title ?? CONTENT_UI.callout[b.kind]}
                </p>
                <div className="text-text [&_p]:mb-0 [&_p+p]:mt-3">
                  <Blocks blocks={b.body} mode={mode} idPrefix={key} />
                </div>
              </aside>
            );
          }
          case "sources":
            return (
              <section key={key} aria-label={CONTENT_UI.sources} className="not-prose my-10 rounded-md bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)]">
                <h2 className="mb-3 flex items-center gap-2 text-body font-bold text-text">
                  <BookOpen aria-hidden className="size-4 text-text-2" />
                  {CONTENT_UI.sources}
                </h2>
                <ol className="m-0 flex list-decimal flex-col gap-1.5 ps-5 text-small text-text-2">
                  {b.items.map((s, j) => (
                    <li key={j} className="m-0">
                      {renderInline(s, mode, `${key}-${j}`)}
                    </li>
                  ))}
                </ol>
              </section>
            );
          case "form": {
            const formId = `${idPrefix}-form`;
            return (
              <div key={key} className="not-prose my-8 overflow-hidden rounded-lg bg-surface-1 shadow-[inset_0_0_0_1px_var(--color-frame)] elev-2">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface-2 px-5 py-3">
                  <span className="text-small font-semibold text-text-2">{b.title}</span>
                  <PrintFormButton targetId={formId} />
                </div>
                <div id={formId} className="px-5 py-6 leading-[2] md:px-8 [&_p]:mb-3 [&_h3]:mb-4 [&_h3]:mt-0 [&_h3]:text-h3">
                  <Blocks blocks={b.body} mode={mode} idPrefix={key} />
                </div>
              </div>
            );
          }
          case "hook":
            return <HookEmbed key={key} id={b.id} />;
          case "cta":
            return <CtaBox key={key} kind={b.kind} niche={b.niche} />;
          case "hr":
            return <hr key={key} />;
          default:
            return null;
        }
      })}
    </>
  );
}
