"use client";
import * as React from "react";
import Link from "next/link";
import { Switch } from "@/components/ui/misc";
import { DirIcon } from "@/components/a11y/dir-icon";
import { Panel, Section } from "./kit";
import { MotionSwitch, ThemeSegmented } from "./display-controls";
import { SavedIndicator, useAutosave } from "./controls";
import { settingsCopy } from "@/content/he/account";
import { MOCK_PROFILE } from "@/lib/mock/account";
import { cn } from "@/lib/utils";

const c = settingsCopy.accessibility;

export function AccessibilitySettings() {
  const save = useAutosave(400);
  const [larger, setLarger] = React.useState(MOCK_PROFILE.larger_captions);
  return (
    <div className="flex flex-col gap-10">
      <Section id="a11y" title={c.title} actions={<SavedIndicator state={save.state} />}>
        <Panel className="flex flex-col divide-y divide-border p-0 md:p-0">
          <div className="p-5 md:p-6">
            <MotionSwitch id="motion-setting" />
          </div>
          <div className="flex flex-col gap-4 p-5 md:p-6">
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="larger-captions" className="font-semibold">{c.largerCaptions}</label>
              <Switch id="larger-captions" checked={larger} aria-describedby="larger-captions-hint" onCheckedChange={(v) => { setLarger(v); save.touch(); }} />
            </div>
            <p id="larger-captions-hint" className="text-small text-text-2">{c.largerCaptionsHint}</p>
            {/* Player-caption sample: an LTR media frame with Hebrew caption inside */}
            <div dir="ltr" className="relative mx-auto aspect-wide w-full max-w-md overflow-hidden rounded-md bg-surface-3 bg-afterglow shadow-[inset_0_0_0_1px_var(--color-frame)]" aria-hidden>
              <div className="absolute inset-x-0 bottom-4 flex justify-center px-6">
                <span
                  dir="rtl"
                  className={cn(
                    "rounded-xs bg-black/75 px-2.5 py-1 text-center font-semibold text-white transition-[font-size]",
                    larger ? "text-[1.4rem] leading-snug" : "text-base",
                  )}
                >
                  {c.captionSample}
                </span>
              </div>
            </div>
          </div>
        </Panel>
      </Section>

      <Section id="theme-a11y" title={<span id="theme-a11y-label">{c.theme}</span>}>
        <Panel>
          <ThemeSegmented id="theme-a11y" />
        </Panel>
      </Section>

      <Panel className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/legal/accessibility" className="inline-flex items-center gap-1.5 font-semibold text-link underline-offset-4 hover:underline">
          {c.statement}
          <DirIcon name="next" className="size-4" />
        </Link>
        <Link href="/contact?topic=accessibility" className="inline-flex items-center gap-1.5 font-semibold text-link underline-offset-4 hover:underline">
          {c.report}
          <DirIcon name="next" className="size-4" />
        </Link>
      </Panel>
    </div>
  );
}
