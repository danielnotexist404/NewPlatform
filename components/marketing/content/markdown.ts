/**
 * Block-level mini-markdown for long-form content (no packages; Part 02 §8.1 / §10.1 semantics).
 *
 *   ## Title {#anchor}           section (documents only, via splitSections)
 *   ### Title {#anchor}          sub-heading
 *   - item                       bullet list
 *   1. item                      ordered list
 *   1.1. text                    numbered legal clauses
 *   | a | b |                    table (first row = header, |---| row skipped)
 *   > text                       quote (an empty ">" line splits paragraphs)
 *   ?VAR text                    paragraph shown only when owner variable VAR is filled
 *   ::hook real-estate-01        hook card from the seed
 *   ::cta hooks real-estate      end-of-article CTA box
 *   :::callout warning Title     callout … closed by :::
 *   :::sources                   sources list … closed by :::
 *   :::form Title                printable form … closed by :::
 *   ---                          divider
 * Every other non-empty line is its own paragraph.
 */
export type Block =
  | { t: "p"; text: string; cond?: string }
  | { t: "h3"; text: string; id?: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[]; start: number }
  | { t: "clauses"; items: { n: string; text: string }[] }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "quote"; paras: string[] }
  | { t: "callout"; kind: "tip" | "warning" | "note"; title?: string; body: Block[] }
  | { t: "sources"; items: string[] }
  | { t: "form"; title: string; body: Block[] }
  | { t: "hook"; id: string }
  | { t: "cta"; kind: "create" | "hooks" | "pricing"; niche?: string }
  | { t: "hr" };

export interface DocSection {
  id: string;
  title: string;
  blocks: Block[];
}

const CLAUSE = /^(\d+(?:\.\d+)+\.)\s+(.*)$/;
const OL = /^(\d+)\.\s+(.*)$/;

export function headingParts(raw: string): { text: string; id?: string } {
  const m = /^(.*?)\s*\{#([a-z0-9-]+)\}\s*$/.exec(raw.trim());
  return m ? { text: m[1], id: m[2] } : { text: raw.trim() };
}

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

export function parseBlocks(src: string): Block[] {
  const lines = src.split("\n");
  const out: Block[] = [];
  let i = 0;
  const at = (k: number) => (lines[k] ?? "").trim();

  while (i < lines.length) {
    const line = at(i);
    if (!line) {
      i++;
      continue;
    }

    if (line.startsWith(":::")) {
      const [kind, ...rest] = line.slice(3).trim().split(/\s+/);
      const inner: string[] = [];
      i++;
      while (i < lines.length && at(i) !== ":::") inner.push(lines[i++]);
      i++;
      if (kind === "callout") {
        const [ck, ...title] = rest;
        out.push({ t: "callout", kind: (ck as "tip" | "warning" | "note") ?? "note", title: title.join(" ") || undefined, body: parseBlocks(inner.join("\n")) });
      } else if (kind === "sources") {
        out.push({ t: "sources", items: inner.map((l) => l.trim()).filter((l) => l.startsWith("- ")).map((l) => l.slice(2)) });
      } else if (kind === "form") {
        out.push({ t: "form", title: rest.join(" "), body: parseBlocks(inner.join("\n")) });
      } else {
        throw new Error(`Unknown container :::${kind}`);
      }
      continue;
    }

    if (line.startsWith("::")) {
      const [kind, a, b] = line.slice(2).trim().split(/\s+/);
      if (kind === "hook") out.push({ t: "hook", id: a });
      else if (kind === "cta") out.push({ t: "cta", kind: a as "create" | "hooks" | "pricing", niche: b });
      else throw new Error(`Unknown directive ::${kind}`);
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      out.push({ t: "h3", ...headingParts(line.slice(4)) });
      i++;
      continue;
    }

    if (line === "---") {
      out.push({ t: "hr" });
      i++;
      continue;
    }

    if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && at(i).startsWith("|")) {
        const l = at(i++);
        if (/^\|?\s*:?-{2,}/.test(l)) continue;
        rows.push(splitRow(l));
      }
      out.push({ t: "table", head: rows[0] ?? [], rows: rows.slice(1) });
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && at(i).startsWith("- ")) items.push(at(i++).slice(2));
      out.push({ t: "ul", items });
      continue;
    }

    if (CLAUSE.test(line)) {
      const items: { n: string; text: string }[] = [];
      while (i < lines.length && CLAUSE.test(at(i))) {
        const m = CLAUSE.exec(at(i++))!;
        items.push({ n: m[1], text: m[2] });
      }
      out.push({ t: "clauses", items });
      continue;
    }

    if (OL.test(line)) {
      const items: string[] = [];
      const start = Number(OL.exec(line)![1]);
      while (i < lines.length && OL.test(at(i))) items.push(OL.exec(at(i++))![2]);
      out.push({ t: "ol", items, start });
      continue;
    }

    if (line.startsWith(">")) {
      const paras: string[] = [];
      let cur: string[] = [];
      while (i < lines.length && at(i).startsWith(">")) {
        const body = at(i++).replace(/^>\s?/, "");
        if (!body) {
          if (cur.length) paras.push(cur.join(" "));
          cur = [];
        } else cur.push(body);
      }
      if (cur.length) paras.push(cur.join(" "));
      out.push({ t: "quote", paras });
      continue;
    }

    const cond = /^\?([A-Z0-9_]+)\s+(.*)$/.exec(line);
    if (cond) out.push({ t: "p", text: cond[2], cond: cond[1] });
    else out.push({ t: "p", text: line });
    i++;
  }
  return out;
}

/** Splits a document at "## Title {#id}" lines. Text before the first heading becomes `intro`. */
export function splitSections(src: string): { intro: Block[]; sections: DocSection[] } {
  const lines = src.split("\n");
  const intro: string[] = [];
  const raw: { id: string; title: string; body: string[] }[] = [];
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith("## ")) {
      const { text, id } = headingParts(t.slice(3));
      raw.push({ id: id ?? `section-${raw.length + 1}`, title: text, body: [] });
    } else if (raw.length) raw[raw.length - 1].body.push(line);
    else intro.push(line);
  }
  return {
    intro: parseBlocks(intro.join("\n")),
    sections: raw.map((s) => ({ id: s.id, title: s.title, blocks: parseBlocks(s.body.join("\n")) })),
  };
}

/** All visible text of a block tree (for word counts and search). */
export function blocksText(blocks: Block[]): string {
  const parts: string[] = [];
  for (const b of blocks) {
    switch (b.t) {
      case "p":
      case "h3":
        parts.push(b.text);
        break;
      case "ul":
      case "ol":
      case "sources":
        parts.push(...b.items);
        break;
      case "clauses":
        parts.push(...b.items.map((c) => c.text));
        break;
      case "table":
        parts.push(...b.head, ...b.rows.flat());
        break;
      case "quote":
        parts.push(...b.paras);
        break;
      case "callout":
      case "form":
        if (b.t === "callout" && b.title) parts.push(b.title);
        parts.push(blocksText(b.body));
        break;
      default:
        break;
    }
  }
  return parts.join(" ");
}
