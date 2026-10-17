"use client";
import * as React from "react";
import { toast } from "sonner";
import { Plus, Trash2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Panel, Section, EmptyState } from "./kit";
import { SavedIndicator, useAutosave } from "./controls";
import { settingsCopy } from "@/content/he/account";
import { MOCK_PRONUNCIATION } from "@/lib/mock/account";
import { fill } from "./format";

const c = settingsCopy.pronunciation;

export function PronunciationTable() {
  const save = useAutosave(400);
  const [rows, setRows] = React.useState(MOCK_PRONUNCIATION);
  const [term, setTerm] = React.useState("");
  const [sayAs, setSayAs] = React.useState("");
  const [note, setNote] = React.useState("");
  const [errors, setErrors] = React.useState<{ term?: string; sayAs?: string }>({});

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    const t = term.trim();
    if (!t) next.term = c.errors.termRequired;
    else if (t.length > 60) next.term = c.errors.term;
    else if (rows.some((r) => r.term === t)) next.term = c.errors.duplicate;
    if (!sayAs.trim()) next.sayAs = c.errors.sayAsRequired;
    else if (sayAs.length > 120) next.sayAs = c.errors.sayAs;
    setErrors(next);
    if (Object.keys(next).length) return;
    setRows((r) => [{ id: `pr-${r.length + 10}-${t}`, term: t, sayAs: sayAs.trim(), note: note.trim() }, ...r]);
    setTerm(""); setSayAs(""); setNote("");
    save.touch();
    document.getElementById("pr-term")?.focus();
  };

  return (
    <Section id="pronunciation" title={c.title} description={c.subtitle} actions={<SavedIndicator state={save.state} />}>
      <Panel className="flex flex-col gap-6">
        <form onSubmit={add} noValidate className="grid gap-3 rounded-md bg-surface-2 p-4 md:grid-cols-[1fr_1.4fr_1.2fr_auto] md:items-start">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="pr-term" className="text-sm font-semibold">{c.columns.term}</label>
            <Input id="pr-term" dir="rtl" maxLength={60} placeholder={`${c.placeholders.term} · ${c.placeholders.term2}`} value={term} onChange={(e) => setTerm(e.target.value)} aria-invalid={!!errors.term} aria-describedby={errors.term ? "pr-term-error" : undefined} />
            {errors.term && <p id="pr-term-error" role="alert" className="text-small text-danger">{errors.term}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="pr-say" className="text-sm font-semibold">{c.columns.sayAs}</label>
            <Input id="pr-say" dir="rtl" maxLength={120} placeholder={`${c.placeholders.sayAs} · ${c.placeholders.sayAs2}`} value={sayAs} onChange={(e) => setSayAs(e.target.value)} className="leading-[1.9]" aria-invalid={!!errors.sayAs} aria-describedby={errors.sayAs ? "pr-say-error" : undefined} />
            {errors.sayAs && <p id="pr-say-error" role="alert" className="text-small text-danger">{errors.sayAs}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="pr-note" className="text-sm font-semibold">{c.columns.note}</label>
            <Input id="pr-note" maxLength={200} value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <Button type="submit" size="lg" className="h-11 md:mt-[1.625rem]">
            <Plus aria-hidden />
            {c.add}
          </Button>
        </form>

        {rows.length === 0 ? (
          <EmptyState illustration="search" size="inline" title={c.empty} />
        ) : (
          <ul aria-label={c.caption} className="flex flex-col divide-y divide-border">
            {rows.map((r) => (
              <li key={r.id} className="grid items-center gap-3 py-3.5 sm:grid-cols-[1fr_1.4fr_1.2fr_auto]">
                <span className="font-bold" dir="rtl">{r.term}</span>
                <span className="text-body-lg leading-[1.9] text-text" dir="rtl">{r.sayAs}</span>
                <span className="text-small text-text-2">{r.note}</span>
                <span className="flex items-center gap-1">
                  <Button size="icon-sm" variant="ghost" aria-label={fill(c.playSr, { term: r.term })} onClick={() => toast(fill(c.playing, { term: r.term }))}>
                    <Volume2 aria-hidden />
                  </Button>
                  <Button size="icon-sm" variant="ghost" aria-label={fill(c.removeSr, { term: r.term })} onClick={() => { setRows((x) => x.filter((y) => y.id !== r.id)); save.touch(); }}>
                    <Trash2 aria-hidden />
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </Section>
  );
}
