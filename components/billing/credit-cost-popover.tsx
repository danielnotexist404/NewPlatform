"use client";
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { billingCopy } from "@/content/he/account";
import { VIDEO_COST_EXAMPLES } from "@/lib/data/plans";
import { creditsText } from "@/components/settings/format";

/** "כמה עולה כל סרטון?" — CreditCostTable in a popover (Part 02 §7.5 values from lib/data/plans). */
export function CreditCostPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="link" size="sm" className="h-auto">{billingCopy.balance.costTable}</Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        <p className="mb-3 font-bold">{billingCopy.balance.costTableTitle}</p>
        <dl className="flex flex-col">
          {VIDEO_COST_EXAMPLES.map((x) => (
            <div key={x.labelHe} className="flex items-baseline justify-between gap-3 border-b border-border py-2 last:border-b-0">
              <dt className="text-small text-text-2">{x.labelHe}</dt>
              <dd className="shrink-0 text-small font-bold">{creditsText(x.credits)}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-micro font-normal text-muted">{billingCopy.balance.costTableNote}</p>
      </PopoverContent>
    </Popover>
  );
}
