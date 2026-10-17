import Link from "next/link";
import { BarChart3, Check, Clapperboard, MapPin, Megaphone, MessageCircle, Scissors } from "lucide-react";
import { DirIcon } from "@/components/a11y/dir-icon";
import { buttonVariants } from "@/components/ui/button";
import { Eyebrow, SampleTag } from "@/components/marketing/gallery/kit";
import { ReelArt, ArtChip, DurationChip } from "@/components/marketing/gallery/reel-art";
import { PhoneFrame } from "@/components/marketing/landing/phone-frame";
import { CAMPAIGNS_HERO as H } from "@/content/he/campaigns";
import { getHook } from "@/lib/data/seed";
import { SIGNUP_HREF } from "@/lib/constants";

/** /campaigns hero: the loop video → campaign → report (spec §A.1), sample visual labelled "דוגמה להמחשה". */
export function CampaignsHero() {
  const hook = getHook("barbers-salons-01");
  return (
    <section id="hero" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] light:hidden"
        style={{ background: "radial-gradient(45% 55% at 30% 10%, color-mix(in oklab, var(--color-violet) 18%, transparent), transparent 70%)" }}
      />
      <div className="container-marketing grid gap-14 pb-16 pt-10 md:pt-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:pb-24">
        <div className="flex flex-col gap-6">
          <Eyebrow>{H.eyebrow}</Eyebrow>
          <h1 className="text-h1 max-w-2xl">
            {H.h1Lead} <span className="text-gold-gradient">{H.h1Highlight}</span>
            <br />
            {H.h1Tail}
          </h1>
          <p className="text-body-lg max-w-xl text-text-2">{H.sub}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={SIGNUP_HREF} className={buttonVariants({ size: "xl" })} data-cta-location="campaigns_page">
              {H.cta}
            </Link>
            <a href="#builder" className={buttonVariants({ size: "xl", variant: "secondary" })}>
              {H.secondary}
            </a>
          </div>
          <ul className="flex flex-col gap-2.5 pt-2">
            {H.chips.map((c) => (
              <li key={c} className="flex items-center gap-2.5 text-text-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                  <Check aria-hidden className="size-3.5" strokeWidth={3} />
                </span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        <figure className="relative mx-auto w-full max-w-[520px]" aria-label={H.sampleTag}>
          <PhoneFrame className="max-w-[260px]">
            <ReelArt
              tone="gold"
              icon={Scissors}
              hook={hook?.text_he ?? ""}
              highlight="רק לסדר קצת"
              className="rounded-none"
              bottomStart={<ArtChip>מספרה לדוגמה</ArtChip>}
              bottomEnd={<DurationChip sec={15} />}
            />
          </PhoneFrame>

          {/* floating "campaign" card */}
          <div className="absolute top-[44%] inset-s-0 w-[46%] max-w-[210px] rounded-md glass p-3.5 elev-2 shadow-[inset_0_0_0_1px_var(--color-frame)] sm:inset-s-[-2%]">
            <div className="flex items-center gap-2 text-micro text-primary-text">
              <Megaphone aria-hidden className="size-3.5" />
              {H.loop[1].label}
            </div>
            <p className="mt-1.5 text-small font-bold">תור פנוי השבוע</p>
            <ul className="mt-2 flex flex-col gap-1 text-micro font-normal text-text-2">
              <li className="flex items-center gap-1.5">
                <MessageCircle aria-hidden className="size-3.5 text-success" /> הודעות בוואטסאפ
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin aria-hidden className="size-3.5 text-violet" /> 5 ק״מ סביב העסק
              </li>
            </ul>
            <span className="mt-2 inline-flex items-center gap-1 rounded-xs bg-success/15 px-1.5 py-0.5 text-micro text-success">
              <span aria-hidden className="size-1.5 animate-pulse-dot rounded-full bg-success" /> פעיל
            </span>
          </div>

          {/* floating "report" card */}
          <div className="absolute bottom-[16%] inset-e-0 w-[54%] max-w-[250px] rounded-md glass p-3.5 elev-2 shadow-[inset_0_0_0_1px_var(--color-frame)] sm:inset-e-[-2%]">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-micro text-primary-text">
                <BarChart3 aria-hidden className="size-3.5" />
                {H.loop[2].label}
              </span>
              <SampleTag>{H.sampleTag}</SampleTag>
            </div>
            <dl className="mt-2.5 grid grid-cols-2 gap-2">
              <div className="rounded-sm bg-surface-2/80 p-2">
                <dt className="text-[11px] text-muted">כמה פניות</dt>
                <dd className="text-xl font-extrabold leading-tight num">23</dd>
              </div>
              <div className="rounded-sm bg-surface-2/80 p-2">
                <dt className="text-[11px] text-muted">כמה עלתה כל פנייה</dt>
                <dd className="text-xl font-extrabold leading-tight">
                  <bdi className="num">₪12.17</bdi>
                </dd>
              </div>
            </dl>
          </div>

          <figcaption className="mt-6 flex flex-wrap items-center justify-center gap-2 text-small text-text-2">
            {H.loop.map((l, i) => (
              <span key={l.key} className="inline-flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 font-semibold text-text">
                  {i === 0 ? <Clapperboard aria-hidden className="size-3.5 text-primary-text" /> : i === 1 ? <Megaphone aria-hidden className="size-3.5 text-primary-text" /> : <BarChart3 aria-hidden className="size-3.5 text-primary-text" />}
                  {l.label}
                </span>
                {i < H.loop.length - 1 && <DirIcon name="forward" className="size-4 text-muted" />}
              </span>
            ))}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
