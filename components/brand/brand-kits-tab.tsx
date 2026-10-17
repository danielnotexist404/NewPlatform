"use client";
import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Copy, EllipsisVertical, Lock, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip } from "@/components/ui/tooltip";
import { EmptyState, Note, Tag, ButtonLink } from "@/components/settings/kit";
import { LogoMark } from "./brand-preview-phone";
import { fontFamily } from "./brand-fonts";
import { brandCopy, CAPTION_PRESET_LABEL, accountCommon } from "@/content/he/account";
import { MOCK_BRAND_KITS, MOCK_WORKSPACE, PLAN_EXTRA_LIMITS, type BrandKit } from "@/lib/mock/account";
import { fill, plural } from "@/components/settings/format";
import { cn } from "@/components/settings/cn";

const k = brandCopy.kits;

export function BrandKitsTab() {
  const [kits, setKits] = React.useState<BrandKit[]>(MOCK_BRAND_KITS);
  const [toDelete, setToDelete] = React.useState<BrandKit | null>(null);
  const max = PLAN_EXTRA_LIMITS[MOCK_WORKSPACE.planId].brandKits;
  const atLimit = max !== null && kits.length >= max;

  const setDefault = (id: string) => {
    setKits((l) => l.map((x) => ({ ...x, isDefault: x.id === id })));
    toast.success(fill(k.toastDefault, { name: kits.find((x) => x.id === id)?.name ?? "" }));
  };
  const duplicate = (kit: BrandKit) => {
    if (atLimit) { toast.error(plural(max ?? 0, k.limit)); return; }
    setKits((l) => [...l, { ...kit, id: `${kit.id}-copy-${l.length}`, name: fill(k.copyName, { name: kit.name }), isDefault: false, usedInProjects: 0 }]);
    toast.success(k.toastDuplicated);
  };

  if (kits.length === 0) {
    return <EmptyState illustration="brand" title={k.emptyTitle} action={<Button>{k.emptyAction}</Button>} />;
  }

  return (
    <div className="flex flex-col gap-6">
      {MOCK_WORKSPACE.type === "agency" && <Note>{k.agencyHelp}</Note>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {kits.map((kit) => (
          <article key={kit.id} aria-labelledby={`kit-${kit.id}`} className="group flex flex-col overflow-hidden rounded-lg bg-surface-1 elev-1 shadow-[inset_0_0_0_1px_var(--color-frame)] transition-shadow hover:elev-2">
            {/* Cover: brand colors as a lit "screen", logo and heading font */}
            <div
              className="relative flex aspect-[16/9] items-center justify-center gap-4 overflow-hidden"
              style={{ background: `radial-gradient(70% 90% at 75% 10%, color-mix(in oklab, ${kit.colors.primary} 70%, transparent), transparent 70%), radial-gradient(60% 70% at 15% 95%, color-mix(in oklab, ${kit.colors.accent} 45%, transparent), transparent 70%), ${kit.colors.secondary}` }}
            >
              <LogoMark kit={kit} size={56} />
              <span className="text-[1.75rem] leading-none" style={{ fontFamily: fontFamily(kit.fonts.heading), color: kit.colors.text }}>{kit.name}</span>
              <span className="absolute bottom-3 inset-s-3 rounded-xs bg-black/45 px-2 py-0.5 text-micro text-white">{CAPTION_PRESET_LABEL[kit.captionPreset]}</span>
            </div>
            <div className="flex flex-1 flex-col gap-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <h3 id={`kit-${kit.id}`} className="flex flex-wrap items-center gap-2 text-body-lg font-bold">
                    <span dir="auto">{kit.name}</span>
                    {kit.isDefault && <Tag variant="primary"><Star aria-hidden />{k.defaultBadge}</Tag>}
                  </h3>
                  <p className="text-small text-text-2">{plural(kit.usedInProjects, k.usage)}</p>
                </div>
                <span className="flex [&>*+*]:-ms-1.5" aria-label={fill(k.colorsSr, { colors: Object.values(kit.colors).join(", ") })} role="img">
                  {Object.values(kit.colors).map((c, i) => (
                    <span key={i} className="size-6 rounded-full shadow-[0_0_0_2px_var(--color-surface-1)]" style={{ background: c }} />
                  ))}
                </span>
              </div>
              <div className="mt-auto flex items-center gap-2">
                <Link href={`/app/brand/${kit.id}`} className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "flex-1")}>
                  <Pencil aria-hidden />{k.edit}
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon-sm" variant="ghost" aria-label={fill(k.moreActions, { name: kit.name })}><EllipsisVertical aria-hidden /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {!kit.isDefault && <DropdownMenuItem onSelect={() => setDefault(kit.id)}><Star aria-hidden />{k.setDefault}</DropdownMenuItem>}
                    <DropdownMenuItem onSelect={() => duplicate(kit)}><Copy aria-hidden />{k.duplicate}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {kit.isDefault ? (
                      <DropdownMenuItem disabled className="flex-col items-start opacity-70">
                        <span className="flex items-center gap-2"><Lock aria-hidden />{k.delete}</span>
                        <span className="text-micro font-normal text-muted">{k.cantDeleteDefault}</span>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem danger onSelect={() => setToDelete(kit)}><Trash2 aria-hidden />{k.delete}</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </article>
        ))}

        {/* New kit tile */}
        {atLimit ? (
          <Tooltip content={plural(max ?? 0, k.limit)}>
            <div tabIndex={0} className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border-strong p-6 text-center text-text-2">
              <Lock className="size-6" aria-hidden />
              <p className="font-semibold">{k.new}</p>
              <p className="text-small">{plural(max ?? 0, k.limit)}</p>
              <ButtonLink href="/app/billing/plans" variant="link" size="sm">{accountCommon.comparePlans}</ButtonLink>
            </div>
          </Tooltip>
        ) : (
          <button
            type="button"
            onClick={() => {
              const base = kits.find((x) => x.isDefault) ?? kits[0];
              setKits((l) => [...l, { ...base, id: `kit-new-${l.length}`, name: k.newName, isDefault: false, usedInProjects: 0 }]);
              toast.success(accountCommon.saved);
            }}
            className="group flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border-strong p-6 text-text-2 transition-colors hover:border-primary-text hover:bg-surface-1 hover:text-text"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-surface-2 text-primary-text transition-transform group-hover:scale-105"><Plus className="size-6" aria-hidden /></span>
            <span className="font-semibold">{k.new}</span>
          </button>
        )}
      </div>

      <Dialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <DialogContent>
          <DialogTitle>{fill(k.deleteTitle, { name: toDelete?.name ?? "" })}</DialogTitle>
          <DialogDescription>{k.deleteBody}</DialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setToDelete(null)}>{accountCommon.cancel}</Button>
            <Button variant="destructive" onClick={() => { setKits((l) => l.filter((x) => x.id !== toDelete?.id)); setToDelete(null); toast(k.toastDeleted); }}>{k.delete}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
