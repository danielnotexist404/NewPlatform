"use client";
import * as React from "react";
import Link from "next/link";
import { Camera, Images, Lock, Pause, Play, Upload, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider, Switch, ToggleGroup, ToggleGroupItem } from "@/components/ui/misc";
import { VideoTile } from "@/components/video/video-tile";
import { fillText } from "@/components/projects/plural";
import { APP_CORE } from "@/content/he/app-core";
import { QUALITY_LABEL, VISUAL_MIX_LABEL } from "@/lib/labels";
import { formatDuration, type Quality, type SceneTone, type VisualMix, type VisualStyle } from "@/lib/mock/projects";
import { MOCK_PLAN, MOCK_TRACKS, MOCK_VOICES } from "@/lib/mock/workspace";
import { ChipRadio, DeltaChip, Group, LockedNote, Panel, RadioCards, StepHeading } from "../choice";
import { costOf, useWizard } from "../wizard-state";
import { cn } from "@/lib/utils";

const W = APP_CORE.wizard;

const STYLE_TONES: Record<VisualStyle, [SceneTone, string]> = {
  cinematic: ["ember", "Clapperboard"], ugc: ["rose", "Camera"], day_in_business: ["gold", "Store"],
  before_after: ["violet", "Sparkles"], product: ["night", "Star"], text_motion: ["smoke", "Sparkles"],
};

export function StyleStep() {
  const { data, set } = useWizard();
  const St = W.style;
  const base = costOf(data).credits;
  const delta = (over: Parameters<typeof costOf>[1]) => costOf(data, over).credits - base;
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [consent, setConsent] = React.useState(false);
  const qualityLocked = (q: Quality) => q === "premium" && MOCK_PLAN.id === "starter";

  return (
    <>
      <StepHeading title={St.title} subtitle={St.subtitle} />
      <Group label={St.styleLabel}>
        <RadioCards
          label={St.styleLabel}
          value={data.visualStyle}
          onValueChange={(v) => set({ visualStyle: v as VisualStyle })}
          columns="grid-cols-2 sm:grid-cols-3"
          size="sm"
          items={(Object.keys(St.styles) as VisualStyle[]).map((s) => ({
            value: s,
            media: <VideoTile tone={STYLE_TONES[s][0]} icon={STYLE_TONES[s][1]} aspect="1:1" className="rounded-sm" />,
            title: St.styles[s].title,
            description: <span className="text-micro">{St.styles[s].description}</span>,
          }))}
        />
      </Group>

      <Group label={St.mixLabel}>
        <RadioCards
          label={St.mixLabel}
          value={data.visualMix}
          onValueChange={(v) => set({ visualMix: v as VisualMix })}
          columns="grid-cols-1 sm:grid-cols-3"
          size="sm"
          items={(["images", "smart", "full"] as VisualMix[]).map((m) => ({
            value: m,
            title: VISUAL_MIX_LABEL[m],
            description: <span className="text-micro">{St.mixes[m]}</span>,
            aside: <DeltaChip n={delta({ visualMix: m })} />,
          }))}
        />
      </Group>

      <Group label={St.qualityLabel}>
        <RadioCards
          label={St.qualityLabel}
          value={data.quality}
          onValueChange={(v) => !qualityLocked(v as Quality) && set({ quality: v as Quality })}
          columns="grid-cols-1 sm:grid-cols-3"
          size="sm"
          items={(["draft", "standard", "premium"] as Quality[]).map((q) => ({
            value: q,
            title: QUALITY_LABEL[q],
            description: <span className="text-micro">{St.qualities[q]}</span>,
            aside: qualityLocked(q) ? undefined : <DeltaChip n={delta({ quality: q })} />,
            locked: qualityLocked(q) ? St.premiumLocked : undefined,
          }))}
        />
        {MOCK_PLAN.id === "starter" && <LockedNote text={St.premiumLocked} />}
      </Group>

      <Panel className="flex flex-col gap-4">
        <div>
          <h2 className="text-body-lg font-bold">{St.mediaTitle}</h2>
          <p className="text-small text-text-2">{St.mediaHelp}</p>
        </div>
        <div className="flex flex-col items-center gap-3 rounded-md border-2 border-dashed border-border-strong/60 p-6 text-center">
          <Upload className="size-6 text-muted" aria-hidden />
          <p className="text-micro font-normal text-muted">{St.mediaTypes}</p>
          {data.uploads.length === 0 && (
            <label className="flex items-start gap-2 text-start text-micro font-normal text-text-2">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 size-4 accent-[var(--color-primary)]" />
              מי שמופיע בצילומים נתן הסכמה לשימוש בהם בפרסום (ואם מופיעים ילדים — ההורים שלהם הסכימו בכתב).
            </label>
          )}
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="secondary" size="sm" disabled={!consent && data.uploads.length === 0} onClick={() => fileRef.current?.click()}>
              {St.mediaPick}
            </Button>
            <Button variant="ghost" size="sm" asChild><Link href="/app/library"><Images aria-hidden />{St.mediaLibrary}</Link></Button>
          </div>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/heic,video/mp4,video/quicktime"
            className="sr-only"
            tabIndex={-1}
            onChange={(e) => set((d) => ({ uploads: [...d.uploads, ...Array.from(e.target.files ?? []).map((f) => f.name)].slice(0, 20) }))}
          />
          {data.uploads.length > 0 && (
            <ul className="flex flex-wrap justify-center gap-1.5">{data.uploads.map((u) => <li key={u} dir="ltr" className="rounded-full bg-surface-2 px-2.5 py-0.5 font-mono text-micro">{u}</li>)}</ul>
          )}
        </div>
        <Link href={`/app/projects/${data.projectId}/shoot`} className="inline-flex items-center gap-2 self-start text-small font-semibold text-primary-text hover:underline">
          <Camera className="size-4" aria-hidden />
          {St.guided}
        </Link>
      </Panel>
    </>
  );
}

export function VoiceStep() {
  const { data, set } = useWizard();
  const V = W.voice;
  const [playing, setPlaying] = React.useState<string | null>(null);
  const voices = MOCK_VOICES.filter((v) => v.gender === data.voiceGender);
  const words = data.scenes.reduce((a, s) => a + s.vo.split(/\s+/).filter(Boolean).length, 0) || 70;
  const seconds = Math.round(words / (2.5 * data.speed));
  const play = (id: string) => {
    setPlaying(id);
    window.setTimeout(() => setPlaying((p) => (p === id ? null : p)), 2200);
  };
  const latin = Array.from(new Set(data.scenes.flatMap((s) => s.vo.match(/[A-Za-z]{2,}|[א-ת]+״[א-ת]/g) ?? [])));

  return (
    <>
      <StepHeading title={V.title} subtitle={V.subtitle} />
      <ToggleGroup type="single" value={data.voiceGender} onValueChange={(v) => v && set({ voiceGender: v as "female" | "male", voiceId: MOCK_VOICES.find((x) => x.gender === v)?.id ?? "none" })} aria-label={APP_CORE.onboarding.voice.speaker.label} className="self-start">
        <ToggleGroupItem value="female">{V.female}</ToggleGroupItem>
        <ToggleGroupItem value="male">{V.male}</ToggleGroupItem>
      </ToggleGroup>
      <RadioCards
        label={V.title}
        value={data.voiceId}
        onValueChange={(v) => set({ voiceId: v })}
        columns="grid-cols-1 sm:grid-cols-2"
        items={[
          ...voices.map((v) => ({
            value: v.id,
            title: v.name,
            description: `${v.age} · ${v.tone}`,
            badge: v.brand ? <span className="rounded-xs bg-lemon px-1.5 text-micro text-on-primary">{V.brandVoice}</span> : undefined,
            media: (
              <span className="flex items-center gap-2">
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); play(v.id); }}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); play(v.id); } }}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full bg-surface-3 px-3 text-micro hover:bg-primary hover:text-on-primary"
                  aria-label={`${V.play}: ${v.name}`}
                >
                  {playing === v.id ? <Pause className="size-3.5" aria-hidden /> : <Play className="size-3.5" aria-hidden />}
                  {playing === v.id ? V.playing : V.play}
                </span>
                {playing === v.id && <Wave />}
              </span>
            ),
          })),
          { value: "none", title: V.none.title, description: V.none.body },
        ]}
      />
      {data.voiceId === "none" && <p className="text-small text-text-2">{V.noneNote}</p>}
      {data.voiceId !== "none" && (
        <Group label={V.speed} help={fillText(V.duration, { seconds })}>
          <div dir="ltr" className="flex items-center gap-3">
            <span className="text-micro text-muted" dir="rtl">{V.speedLabels[2]}</span>
            <Slider dir="rtl" min={0.85} max={1.15} step={0.05} value={[data.speed]} onValueChange={([s]) => set({ speed: s })} aria-label={V.speed} aria-valuetext={`מהירות ${Math.round(data.speed * 100)}%`} />
            <span className="text-micro text-muted" dir="rtl">{V.speedLabels[0]}</span>
          </div>
        </Group>
      )}
      {latin.length > 0 && (
        <Panel className="flex flex-col gap-2">
          <h2 className="font-bold">{V.checkWords}</h2>
          <ul className="flex flex-wrap gap-2">{latin.map((w) => <li key={w} className="rounded-full bg-surface-2 px-3 py-1 text-small" dir="auto">{w}</li>)}</ul>
          <Link href="/app/settings/pronunciation" className="text-small font-semibold text-link underline">מילון ההגייה של העסק</Link>
        </Panel>
      )}
    </>
  );
}

function Wave({ bars = 18 }: { bars?: number }) {
  return (
    <span dir="ltr" aria-hidden className="flex h-6 items-center gap-[2px]">
      {Array.from({ length: bars }, (_, i) => (
        <span key={i} className="w-[3px] rounded-full bg-primary-text/70 animate-pulse-dot" style={{ height: `${30 + ((i * 37) % 70)}%`, animationDelay: `${(i % 6) * 0.12}s` }} />
      ))}
    </span>
  );
}

export function MusicStep() {
  const { data, set } = useWizard();
  const M = W.music;
  const [playing, setPlaying] = React.useState<string | null>(null);
  const tracks = MOCK_TRACKS.filter((t) => t.mood === data.mood);
  const originalLocked = MOCK_PLAN.id === "starter";
  return (
    <>
      <StepHeading title={M.title} subtitle={M.subtitle} />
      <ChipRadio
        label={M.title}
        value={data.mood}
        onValueChange={(v) => set({ mood: v, trackId: MOCK_TRACKS.find((t) => t.mood === v)?.id ?? data.trackId, musicMode: "library" })}
        items={M.moods.map((m) => ({ value: m, label: m }))}
      />
      <ul className="flex flex-col gap-2">
        {tracks.length === 0 && <li className="text-small text-text-2">עוד אין רצועות לאווירה הזו. נסו אווירה אחרת.</li>}
        {tracks.map((t) => {
          const sel = data.musicMode === "library" && data.trackId === t.id;
          return (
            <li key={t.id} className={cn("flex items-center gap-3 rounded-md bg-surface-1 p-3 shadow-[inset_0_0_0_1px_var(--color-border)]", sel && "bg-surface-2 shadow-[inset_0_0_0_2px_var(--color-primary)]")}>
              <button
                type="button"
                onClick={() => setPlaying((p) => (p === t.id ? null : t.id))}
                aria-label={`${playing === t.id ? M.pause : M.play}: ${t.name}`}
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary"
              >
                {playing === t.id ? <Pause className="size-4 fill-current" aria-hidden /> : <Play className="size-4 translate-x-px fill-current" aria-hidden />}
              </button>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{t.name}</p>
                <p className="text-micro font-normal text-muted">{t.mood} · <bdi className="font-mono">{formatDuration(t.durationSec)}</bdi></p>
              </div>
              <span className="hidden sm:block">{playing === t.id ? <Wave bars={24} /> : <span dir="ltr" aria-hidden className="flex h-6 items-center gap-[2px] opacity-40">{Array.from({ length: 24 }, (_, i) => <span key={i} className="w-[3px] rounded-full bg-text-2" style={{ height: `${30 + ((i * 37) % 70)}%` }} />)}</span>}</span>
              <Button size="sm" variant={sel ? "primary" : "secondary"} aria-pressed={sel} onClick={() => set({ musicMode: "library", trackId: t.id })}>
                {sel ? "נבחרה" : "בחירה"}
              </Button>
            </li>
          );
        })}
      </ul>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={originalLocked}
          aria-pressed={data.musicMode === "generate"}
          onClick={() => set({ musicMode: "generate" })}
          className={cn("flex flex-col gap-1 rounded-md bg-surface-1 p-4 text-start shadow-[inset_0_0_0_1px_var(--color-border)] disabled:cursor-not-allowed", data.musicMode === "generate" && "shadow-[inset_0_0_0_2px_var(--color-primary)]")}
        >
          <span className="flex items-center gap-2 font-bold">{originalLocked && <Lock className="size-3.5 text-primary-text" aria-hidden />}{M.original} · 5 קרדיטים</span>
          <span className="text-micro font-normal text-text-2">{originalLocked ? M.originalLocked : M.originalBody}</span>
        </button>
        <button
          type="button"
          aria-pressed={data.musicMode === "none"}
          onClick={() => set({ musicMode: "none" })}
          className={cn("flex items-center gap-2 rounded-md bg-surface-1 p-4 text-start font-bold shadow-[inset_0_0_0_1px_var(--color-border)]", data.musicMode === "none" && "shadow-[inset_0_0_0_2px_var(--color-primary)]")}
        >
          {M.none}
        </button>
      </div>
      {data.musicMode !== "none" && (
        <Panel className="flex flex-col gap-4">
          <Group label={M.volume}>
            <ChipRadio label={M.volume} value={String(data.musicVolume)} onValueChange={(v) => set({ musicVolume: Number(v) })} items={M.volumes.map((l, i) => ({ value: String(i), label: <><Volume2 className="size-3.5" aria-hidden />{l}</> }))} />
          </Group>
          <label className="flex items-center justify-between gap-3 text-small font-semibold">
            {M.ducking}
            <Switch checked={data.ducking && data.voiceId !== "none"} disabled={data.voiceId === "none"} onCheckedChange={(c) => set({ ducking: c })} />
          </label>
        </Panel>
      )}
    </>
  );
}
