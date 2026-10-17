import { Check, Minus } from "lucide-react";
import { PLANS, type PlanId } from "@/lib/data/plans";
import {
  COMPARE,
  COMPARE_CREATION,
  COMPARE_META_LABELS as L,
  COMPARE_TEAM,
  META_EXTRA_LIMITS,
  type Cell,
  type CompareGroup,
} from "@/content/he/pricing";
import { fmtIls } from "./money";
import { cn } from "@/lib/utils";

/** Meta / landing page / health-check rows are built from `PLANS` (spec §K.2, §S.2, §S.7), not hand-written. */
function metaGroups(): CompareGroup[] {
  const by = <T,>(f: (p: (typeof PLANS)[number]) => T) => Object.fromEntries(PLANS.map((p) => [p.id, f(p)])) as Record<PlanId, T>;
  return [
    {
      id: "meta",
      title: L.groupTitle,
      rows: [
        { id: "zero", label: L.zeroPct, values: by(() => true as Cell) },
        { id: "ad-accounts", label: L.adAccounts, values: by((p) => String(p.meta.adAccounts)) },
        { id: "active", label: L.activeCampaigns, values: by((p) => (p.meta.activeCampaigns === null ? L.unlimited : String(p.meta.activeCampaigns))) },
        {
          id: "spend-cap",
          label: L.spendCap,
          hint: L.spendCapHint,
          values: by((p) => (p.meta.testSpendIls > 0 && p.meta.monthlySpendCapIls === 0 ? L.freeTest(fmtIls(p.meta.testSpendIls)) : L.upTo(fmtIls(p.meta.monthlySpendCapIls)))),
        },
        { id: "split", label: L.splitTest, values: by((p) => (META_EXTRA_LIMITS[p.id].splitTest ? true : L.splitTestFree)) },
        { id: "rules", label: L.autoRules, values: by((p) => L.autoRulesValue(META_EXTRA_LIMITS[p.id].autoRules)) },
        { id: "leads", label: L.leadsInbox, values: by((p) => (META_EXTRA_LIMITS[p.id].leadInbox ? true : L.leadsInboxFree)) },
        { id: "organic", label: L.organic, values: by((p) => L.scheduled(META_EXTRA_LIMITS[p.id].scheduledMax)) },
        { id: "reports", label: L.reports, values: by(() => true as Cell) },
      ],
    },
    {
      id: "pages",
      title: L.pagesGroupTitle,
      rows: [
        {
          id: "landing",
          label: L.landingPages,
          hint: L.landingCredits,
          values: by((p) => (p.landingPages === "per_client" ? L.landingPerClient : p.landingPages === 0 ? L.landingFree : String(p.landingPages))),
        },
        { id: "health", label: L.healthChecks, values: by((p) => L.healthValue(p.healthChecksPerMonth, p.id === "agency")) },
      ],
    },
  ];
}

function CellView({ v }: { v: Cell }) {
  if (v === true)
    return (
      <>
        <Check aria-hidden className="mx-auto size-5 text-success" />
        <span className="sr-only">{COMPARE.included}</span>
      </>
    );
  if (v === false)
    return (
      <>
        <Minus aria-hidden className="mx-auto size-5 text-muted" />
        <span className="sr-only">{COMPARE.notIncluded}</span>
      </>
    );
  return <span>{v}</span>;
}

export function PlanComparisonTable() {
  const groups = [COMPARE_CREATION, ...metaGroups(), COMPARE_TEAM];
  const highlighted = PLANS.find((p) => p.badgeHe)?.id;
  return (
    <div className="flex flex-col gap-3">
      <p className="text-small text-muted md:hidden">{COMPARE.scrollHint}</p>
      <div className="relative -mx-4 overflow-x-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0" tabIndex={0} role="region" aria-label={COMPARE.caption}>
        <table className="w-full min-w-[760px] border-separate border-spacing-0 text-small" aria-describedby="seats-footnote">
          <caption className="sr-only">{COMPARE.caption}</caption>
          <thead>
            <tr>
              <th scope="col" className="sticky inset-s-0 z-20 w-[30%] bg-bg py-4 pe-4 text-start font-semibold text-text-2 lg:top-16">
                {COMPARE.planCol}
              </th>
              {PLANS.map((p) => (
                <th
                  key={p.id}
                  scope="col"
                  className={cn(
                    "z-10 bg-bg px-3 py-4 text-center lg:sticky lg:top-16",
                    p.id === highlighted && "rounded-t-md bg-surface-2 shadow-[inset_0_2px_0_var(--color-primary)]",
                  )}
                >
                  <span className="block text-body-lg font-bold">{p.nameHe}</span>
                  <span className="block text-micro font-normal text-text-2 num">{p.monthlyIls === 0 ? "₪0" : `${fmtIls(p.monthlyIls)} לחודש`}</span>
                </th>
              ))}
            </tr>
          </thead>
          {groups.map((g) => (
            <tbody key={g.id}>
              <tr>
                <th scope="rowgroup" colSpan={PLANS.length + 1} className="sticky inset-s-0 bg-bg pb-2 pt-8 text-start text-body-lg font-bold text-primary-text">
                  {g.title}
                </th>
              </tr>
              {g.rows.map((r) => (
                <tr key={r.id} className="group">
                  <th scope="row" className="sticky inset-s-0 z-10 border-b border-border bg-bg py-3 pe-4 text-start font-medium group-hover:bg-surface-1">
                    {r.label}
                    {r.hint && <span className="mt-0.5 block text-micro font-normal text-muted">{r.hint}</span>}
                  </th>
                  {PLANS.map((p) => (
                    <td
                      key={p.id}
                      className={cn(
                        "border-b border-border px-3 py-3 text-center align-middle text-text group-hover:bg-surface-1",
                        p.id === highlighted && "bg-surface-2/60",
                      )}
                    >
                      <CellView v={r.values[p.id]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
      <p id="seats-footnote" className="text-micro font-normal text-muted">
        {COMPARE.seatsFootnote}
      </p>
      <p className="text-small text-text-2">{COMPARE.metaNote}</p>
    </div>
  );
}
