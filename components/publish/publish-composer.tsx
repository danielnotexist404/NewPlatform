"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarClock, Check, Hash, Heart, MessageCircle, MoonStar, MoreHorizontal, Plus, Send, Sparkles, Vote, X } from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { LtrInput, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch, ToggleGroup, ToggleGroupItem } from "@/components/ui/misc";
import { getSeason } from "@/lib/data/seed";
import { MOCK_TODAY, SAMPLE_BUSINESS } from "@/lib/mock/campaigns";
import { calendarSeasons, sampleVideos } from "@/lib/mock/publish";
import { publishCopy as P, sample } from "@/content/he/campaigns-app";
import { PageHeader, SampleNote } from "@/components/campaigns/page-header";
import { VideoThumb } from "@/components/campaigns/video-thumb";
import { dateLong, fmt } from "@/components/campaigns/text";
import { cn } from "@/lib/utils";

const MAX_TAGS = 5;
const CAPTION_MAX = 2000;
const AI_NOTICE_KEY = "announcement.dismissed.meta-ai-notice";
const TAG_SUGGESTIONS = ["#ברברשופ", "#תספורתגברים", "#רמתגן", "#פייד", "#מספרה", "#עיצובזקן"];

/** Caption builder rule (spec §I.4): no ׳ ״ - or nikud, underscores instead of spaces. */
export function sanitizeTag(raw: string) {
  const body = raw
    .trim()
    .replace(/^#+/, "")
    .replace(/[֑-ׇ]/g, "")
    .replace(/[׳״"'\-־]/g, "")
    .replace(/\s+/g, "_");
  return body ? `#${body}` : "";
}

export function PublishComposer() {
  const router = useRouter();
  const [videoId, setVideoId] = React.useState(sampleVideos[0].id);
  const video = sampleVideos.find((v) => v.id === videoId)!;
  const [ig, setIg] = React.useState(true);
  const [fb, setFb] = React.useState(true);
  const [feed, setFeed] = React.useState(true);
  const [trial, setTrial] = React.useState(false);
  const [caption, setCaption] = React.useState(video.captionHe);
  const [tags, setTags] = React.useState<string[]>(video.hashtags);
  const [tagInput, setTagInput] = React.useState("");
  const [when, setWhen] = React.useState<"now" | "schedule">("schedule");
  const [date, setDate] = React.useState("2026-10-20");
  const [time, setTime] = React.useState("19:00");
  const [cover, setCover] = React.useState(1);
  const [collabs, setCollabs] = React.useState<string[]>([]);
  const [collabInput, setCollabInput] = React.useState("");
  const [location, setLocation] = React.useState(true);
  const [aiDismissed, setAiDismissed] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read a per-viewer dismissal after mount
      if (localStorage.getItem(AI_NOTICE_KEY) === "1") setAiDismissed(true);
    } catch {
      /* storage blocked */
    }
  }, []);

  function pickVideo(id: string) {
    const v = sampleVideos.find((x) => x.id === id)!;
    setVideoId(id);
    setCaption(v.captionHe);
    setTags(v.hashtags);
  }
  function addTag(raw: string) {
    const t = sanitizeTag(raw);
    if (!t || tags.includes(t)) return setTagInput("");
    if (tags.length >= MAX_TAGS) {
      toast.error(P.composer.hashtagMax);
      return;
    }
    setTags([...tags, t]);
    setTagInput("");
  }
  function addCollab() {
    const u = collabInput.trim().replace(/^@/, "");
    if (!u || collabs.includes(u) || collabs.length >= 3) return setCollabInput("");
    setCollabs([...collabs, u]);
    setCollabInput("");
  }

  const quiet = when === "schedule" ? calendarSeasons.find((s) => s.quiet && date >= s.start && date <= s.end) : undefined;
  const election = when === "schedule" && calendarSeasons.some((s) => s.election && date >= s.start && date <= s.end);
  const noPlatform = !ig && !fb;
  const blocked = noPlatform || !!quiet || caption.length > CAPTION_MAX;

  function submit() {
    if (blocked) return;
    setBusy(true);
    window.setTimeout(() => {
      toast.success(when === "now" ? P.composer.toastNow : fmt(P.composer.toastSchedule, { date: dateLong(date), time }));
      router.push("/app/publish");
    }, 900);
  }

  const firstLine = caption.split("\n")[0];

  return (
    <div className="flex flex-col gap-6 pb-24 lg:pb-0">
      <SampleNote text={sample.publish} />
      <PageHeader back={{ href: "/app/publish", label: P.composer.back }} title={P.composer.title} />

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col gap-6">
          {/* 1. video */}
          <Section title={P.composer.video} n={1}>
            <div role="radiogroup" aria-label={P.composer.video} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {sampleVideos.map((v) => {
                const on = v.id === videoId;
                return (
                  <label key={v.id} className={cn("flex cursor-pointer flex-col gap-2 rounded-md bg-surface-2 p-2 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-focus", on && "shadow-[inset_0_0_0_2px_var(--color-primary)]")}>
                    <input type="radio" name="video" className="sr-only" checked={on} onChange={() => pickVideo(v.id)} />
                    <VideoThumb size="md" tone={v.tone} hookText={v.hookText} durationSec={v.durationSec} className="w-full" showPlay={false} />
                    <span className="flex items-center justify-between gap-1 px-1 text-small font-semibold">
                      <span className="truncate">{v.title}</span>
                      {on && <Check className="size-4 shrink-0 text-primary-text" aria-hidden />}
                    </span>
                  </label>
                );
              })}
            </div>
          </Section>

          {/* 2. where */}
          <Section title={P.composer.where} n={2}>
            <div className="grid gap-3 sm:grid-cols-2">
              <PlatformToggle id="pf-ig" label={P.composer.igReels} checked={ig} onChange={setIg} />
              <PlatformToggle id="pf-fb" label={P.composer.fbReels} checked={fb} onChange={setFb} />
            </div>
            {noPlatform && <p role="alert" className="text-small text-danger">{P.composer.noPlatform}</p>}
            {ig && (
              <div className="flex flex-col gap-4 rounded-sm bg-surface-2 p-4">
                <Row id="feed" label={P.composer.shareToFeed} checked={feed} onChange={setFeed} />
                <Row id="trial" label={P.composer.trial} help={P.composer.trialHelp} checked={trial} onChange={setTrial} />
              </div>
            )}
          </Section>

          {/* 3. caption */}
          <Section title={P.composer.caption} n={3}>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between">
                <Label htmlFor="caption">{P.composer.caption}</Label>
                <bdi className={cn("text-micro num", caption.length > CAPTION_MAX ? "text-danger" : "text-muted")}>{fmt(P.composer.captionCounter, { n: caption.length })}</bdi>
              </div>
              <Textarea id="caption" value={caption} onChange={(e) => setCaption(e.target.value)} aria-describedby="caption-help" className="min-h-32" />
              <p id="caption-help" className="text-micro font-normal text-muted">{P.composer.captionHelp}</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <Label htmlFor="tag-input">{P.composer.hashtags}</Label>
                <bdi className={cn("text-micro num", tags.length >= MAX_TAGS ? "text-primary-text" : "text-muted")}>{tags.length}/{MAX_TAGS}</bdi>
              </div>
              <div className="flex flex-wrap items-center gap-2 rounded-sm border border-border-strong bg-surface-2 p-2">
                {tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 rounded-full bg-surface-3 py-1 ps-3 pe-1 text-sm">
                    {t}
                    <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))} aria-label={fmt(P.composer.hashtagRemove, { tag: t })} className="rounded-full p-1 text-text-2 hover:bg-surface-2 hover:text-text">
                      <X className="size-3.5" aria-hidden />
                    </button>
                  </span>
                ))}
                <input
                  id="tag-input"
                  value={tagInput}
                  disabled={tags.length >= MAX_TAGS}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addTag(tagInput);
                    }
                  }}
                  placeholder={tags.length >= MAX_TAGS ? P.composer.hashtagMax : P.composer.hashtagPlaceholder}
                  className="min-w-32 flex-1 bg-transparent px-1 py-1 text-sm text-text outline-none placeholder:text-muted"
                  aria-describedby="tag-help"
                />
              </div>
              <p id="tag-help" className="text-micro font-normal text-muted">{P.composer.hashtagsHelp}</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-micro text-text-2">{P.composer.suggestions}:</span>
                {TAG_SUGGESTIONS.filter((t) => !tags.includes(t)).map((t) => (
                  <button key={t} type="button" disabled={tags.length >= MAX_TAGS} onClick={() => addTag(t)} className="inline-flex items-center gap-1 rounded-full border border-dashed border-border-strong px-2.5 py-1 text-micro text-text-2 hover:text-text disabled:opacity-40">
                    <Plus className="size-3" aria-hidden />
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          {/* 4. when */}
          <Section title={P.composer.when} n={4}>
            <ToggleGroup type="single" value={when} onValueChange={(v) => v && setWhen(v as "now" | "schedule")} aria-label={P.composer.when} className="w-fit rounded-full">
              <ToggleGroupItem value="now" className="rounded-full">{P.composer.now}</ToggleGroupItem>
              <ToggleGroupItem value="schedule" className="rounded-full">{P.composer.schedule}</ToggleGroupItem>
            </ToggleGroup>
            {when === "schedule" && (
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="post-date">{P.composer.date}</Label>
                  <LtrInput id="post-date" type="date" min={MOCK_TODAY} value={date} onChange={(e) => e.target.value && setDate(e.target.value)} className="w-48" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="post-time">{P.composer.time}</Label>
                  <LtrInput id="post-time" type="time" value={time} onChange={(e) => e.target.value && setTime(e.target.value)} className="w-36" />
                </div>
              </div>
            )}
            {quiet && (
              <p role="alert" className="flex items-start gap-2 rounded-sm bg-surface-3 p-3 text-small">
                <MoonStar className="mt-0.5 size-4 shrink-0" aria-hidden />
                {fmt(P.composer.quietWarn, { date: dateLong(date), name: getSeason(quiet.slug)?.name_he ?? "" })}
              </p>
            )}
            {election && (
              <p role="status" className="flex items-start gap-2 rounded-sm bg-violet/10 p-3 text-small">
                <Vote className="mt-0.5 size-4 shrink-0 text-violet" aria-hidden />
                {P.composer.electionWarn}
              </p>
            )}
            <p className="text-micro font-normal text-muted">{P.igNote}</p>
          </Section>

          {/* 5. more */}
          <Accordion type="single" collapsible className="rounded-md bg-surface-1 px-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:px-5">
            <AccordionItem value="more" className="border-b-0">
              <AccordionTrigger className="text-body">{P.composer.more}</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-5">
                <fieldset className="flex flex-col gap-2">
                  <legend className="mb-2 text-sm font-semibold text-text">{P.composer.cover}</legend>
                  <div className="flex gap-3">
                    {[0, 1, 2].map((i) => (
                      <label key={i} className={cn("w-20 cursor-pointer rounded-sm p-1 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-focus", cover === i && "shadow-[inset_0_0_0_2px_var(--color-primary)]")}>
                        <input type="radio" name="cover" className="sr-only" checked={cover === i} onChange={() => setCover(i)} />
                        <VideoThumb size="sm" tone={((video.tone + i) % 4) as 0 | 1 | 2 | 3} className="w-full" showPlay={false} />
                        <span className="mt-1 block text-center text-micro font-normal text-text-2">{fmt(P.composer.coverFrame, { n: i + 1 })}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="collab">{P.composer.collaborators}</Label>
                  <div className="flex gap-2">
                    <LtrInput id="collab" value={collabInput} disabled={collabs.length >= 3} onChange={(e) => setCollabInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCollab())} placeholder={P.composer.collaboratorPlaceholder} aria-describedby="collab-help" />
                    <Button variant="secondary" onClick={addCollab} disabled={collabs.length >= 3}>{P.composer.hashtagAdd}</Button>
                  </div>
                  <p id="collab-help" className="text-micro font-normal text-muted">{P.composer.collaboratorsHelp}</p>
                  {collabs.length > 0 && (
                    <ul className="flex flex-wrap gap-2">
                      {collabs.map((c) => (
                        <li key={c} className="inline-flex items-center gap-1 rounded-full bg-surface-3 py-1 ps-3 pe-1 text-sm">
                          <bdi dir="ltr">@{c}</bdi>
                          <button type="button" onClick={() => setCollabs(collabs.filter((x) => x !== c))} aria-label={fmt(P.composer.hashtagRemove, { tag: c })} className="rounded-full p-1 text-text-2 hover:bg-surface-2">
                            <X className="size-3.5" aria-hidden />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <Row id="location" label={P.composer.location} checked={location} onChange={setLocation} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {!aiDismissed && (
            <div className="flex flex-col gap-2 rounded-sm bg-violet/10 p-3 text-small sm:flex-row sm:items-start sm:justify-between">
              <p className="flex items-start gap-2">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-violet" aria-hidden />
                {P.composer.aiNotice}
              </p>
              <button
                type="button"
                className="shrink-0 font-semibold text-link underline-offset-4 hover:underline"
                onClick={() => {
                  setAiDismissed(true);
                  try {
                    localStorage.setItem(AI_NOTICE_KEY, "1");
                  } catch {
                    /* storage blocked */
                  }
                }}
              >
                {P.composer.aiNoticeDismiss}
              </button>
            </div>
          )}

          <div className="fixed inset-x-0 bottom-0 z-[var(--z-sticky)] flex items-center gap-2 border-t border-border glass px-4 py-3 lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            <Button size="lg" onClick={submit} loading={busy} disabled={blocked} className="flex-1 lg:flex-none lg:min-w-48">
              {when === "now" ? <Send aria-hidden /> : <CalendarClock aria-hidden />}
              {when === "now" ? P.composer.submitNow : P.composer.submitSchedule}
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="/app/publish">{P.composer.back}</Link>
            </Button>
          </div>
        </div>

        <aside className="flex flex-col gap-3 lg:sticky lg:top-[calc(var(--header-h)+24px)]" aria-label={P.composer.preview}>
          <p className="text-small font-semibold text-text-2">{P.composer.preview}</p>
          <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-[26px] bg-black p-1.5 elev-3 shadow-[inset_0_0_0_1px_var(--color-frame)]">
            <div className="relative overflow-hidden rounded-[20px]">
              <VideoThumb hookText={video.hookText} tone={video.tone} size="lg" hideIcon showPlay={false} className="w-full rounded-[20px]" />
              <div aria-hidden className="absolute bottom-28 inset-s-2 flex flex-col items-center gap-3.5 text-white">
                <Heart className="size-5" />
                <MessageCircle className="size-5" />
                <Send className="size-5" />
                <MoreHorizontal className="size-5" />
              </div>
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 bg-linear-to-t from-black/90 to-transparent p-3 pt-12 text-white">
                <p className="flex items-center gap-2 text-micro">
                  <span aria-hidden className="flex size-7 items-center justify-center rounded-full bg-primary text-on-primary">{SAMPLE_BUSINESS.name.slice(0, 1)}</span>
                  <bdi dir="ltr">{SAMPLE_BUSINESS.instagram}</bdi>
                  {collabs[0] && <span className="font-normal opacity-80">· <bdi dir="ltr">{collabs[0]}</bdi></span>}
                </p>
                <p className="line-clamp-2 text-micro font-normal">{firstLine} <span className="opacity-70">… {P.composer.more2}</span></p>
                {tags.length > 0 && (
                  <p className="flex flex-wrap gap-x-1.5 text-micro font-normal opacity-90">
                    {tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </p>
                )}
              </div>
            </div>
          </div>
          <p className="text-center text-micro font-normal text-muted">{P.composer.previewNote}</p>
          <p className="flex items-center justify-center gap-1.5 text-micro text-text-2">
            <Hash className="size-3.5" aria-hidden />
            {tags.length}/{MAX_TAGS}
          </p>
        </aside>
      </div>
    </div>
  );
}

function Section({ title, n, children }: { title: string; n: number; children: React.ReactNode }) {
  const id = React.useId();
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4 rounded-md bg-surface-1 p-4 shadow-[inset_0_0_0_1px_var(--color-frame)] md:p-5">
      <h2 id={id} className="flex items-center gap-2 text-body-lg font-bold">
        <span aria-hidden className="flex size-6 items-center justify-center rounded-full bg-surface-3 text-micro num">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function PlatformToggle({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label htmlFor={id} className={cn("flex cursor-pointer items-center justify-between gap-3 rounded-sm bg-surface-2 px-4 py-3", checked && "shadow-[inset_0_0_0_2px_var(--color-primary)]")}>
      <span className="font-semibold">{label}</span>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </label>
  );
}

function Row({ id, label, help, checked, onChange }: { id: string; label: string; help?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor={id}>{label}</Label>
        {help && <p className="text-small text-text-2">{help}</p>}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

