"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Check } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioCards } from "@/components/settings/controls";
import { BillingDisclosure } from "./billing-disclosure";
import { billingCopy, accountCommon } from "@/content/he/account";
import { CREDIT_PACKS } from "@/lib/data/plans";
import { MOCK_FLAGS, MOCK_WORKSPACE, TYPICAL_VIDEO_CREDITS } from "@/lib/mock/account";
import { fill, formatIls, formatInt, plural } from "@/components/settings/format";

const t = billingCopy.topUp;
type PackId = (typeof CREDIT_PACKS)[number]["id"];

export function TopUpDialog({ open, onOpenChange, initialPack }: { open: boolean; onOpenChange: (o: boolean) => void; initialPack?: string | null }) {
  const router = useRouter();
  const valid = CREDIT_PACKS.some((p) => p.id === initialPack);
  const [pack, setPack] = React.useState<PackId>((valid ? initialPack : "pack-500") as PackId);
  const [accepted, setAccepted] = React.useState(false);
  const [tried, setTried] = React.useState(false);
  const [redirecting, setRedirecting] = React.useState(false);
  const selected = CREDIT_PACKS.find((p) => p.id === pack)!;

  React.useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset the form each time the dialog opens
    setAccepted(false);
    setTried(false);
    setRedirecting(false);
    if (valid) setPack(initialPack as PackId);
  }, [open, initialPack, valid]);

  return (
    <Dialog open={open} onOpenChange={(o) => !redirecting && onOpenChange(o)}>
      <DialogContent size="lg" className="max-h-[92dvh] overflow-y-auto">
        <DialogTitle>{t.title}</DialogTitle>
        <DialogDescription>{t.subtitle}</DialogDescription>

        <div className="mt-5 flex flex-col gap-5">
          <RadioCards<PackId>
            label={t.packsLabel}
            value={pack}
            onValueChange={setPack}
            columns={1}
            options={CREDIT_PACKS.map((p) => {
              const videos = Math.floor(p.credits / TYPICAL_VIDEO_CREDITS);
              const perCredit = formatIls(Math.round((p.priceIls / p.credits) * 100) / 100, "always");
              return {
                value: p.id,
                label: (
                  <span className="flex items-baseline gap-2">
                    <bdi className="num text-h3">{formatInt(p.credits)}</bdi>
                    <span className="text-small font-normal text-text-2">{billingCopy.balance.unit}</span>
                  </span>
                ),
                badge: (
                  <span className="flex items-center gap-2">
                    {p.id === "pack-500" && <Badge variant="lemon">{t.recommended}</Badge>}
                    <bdi className="num text-body-lg font-bold">{formatIls(p.priceIls)}</bdi>
                  </span>
                ),
                description: fill(t.helper, { videos: plural(videos, t.videos), perCredit }),
              };
            })}
          />

          <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-small text-text-2">
            <li className="flex items-center gap-1.5"><Check className="size-4 text-success" aria-hidden />{t.vat}</li>
            <li className="flex items-center gap-1.5"><CreditCard className="size-4 text-text-2" aria-hidden />{MOCK_FLAGS.bitEnabled ? t.payCardBit : t.payCard}</li>
            {!MOCK_WORKSPACE.hasPaid && <li className="flex items-center gap-1.5"><Check className="size-4 text-success" aria-hidden />{t.watermark}</li>}
          </ul>

          <BillingDisclosure id="topup" kind="pack" priceIls={selected.priceIls} accepted={accepted} onAcceptedChange={setAccepted} showRequired={tried} />

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={redirecting}>{accountCommon.cancel}</Button>
            <Button
              size="lg"
              aria-disabled={!accepted || undefined}
              aria-describedby={!accepted ? "topup-terms-required" : undefined}
              loading={redirecting}
              onClick={() => {
                if (!accepted) { setTried(true); return; }
                setRedirecting(true);
                setTimeout(() => router.push(`/app/billing/return?kind=topup&credits=${selected.credits}&status=completed`), 1100);
              }}
            >
              {redirecting ? t.redirecting : fill(t.pay, { price: formatIls(selected.priceIls) })}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
