import { Section } from "./section-heading";
import { BeforeAfterSlider } from "./before-after-slider";
import { SavingsCalculator } from "./savings-calculator";
import { LANDING } from "@/content/he/landing";

const T = LANDING.editorMath;

/** §3.7 EditorMath — before/after slider + savings calculator + sourced footnotes. */
export function EditorMath() {
  return (
    <Section id="editor-math" labelledBy="editor-math-title" className="bg-afterglow">
      <div className="flex flex-col items-start gap-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-surface-2 px-3 py-1 text-micro text-text-2 shadow-[inset_0_0_0_1px_var(--color-frame)]">
          <span aria-hidden className="size-1.5 rounded-full bg-primary" />
          {T.eyebrow}
        </span>
        <h2 id="editor-math-title" className="text-h2 max-w-3xl text-text">{T.title}</h2>
        <p className="text-body-lg max-w-2xl text-text-2">
          {T.subtitleBefore}
          <sup>
            <a href="#fn-1" className="ms-0.5 text-link" aria-label={T.calc.footnoteRef(1)}>1</a>
          </sup>
          {T.subtitleAfter}
        </p>
      </div>
      <div className="mt-12 grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <BeforeAfterSlider />
        </div>
        <div className="lg:col-span-7">
          <SavingsCalculator />
        </div>
      </div>
      <div className="mt-10">
        <h3 className="mb-3 text-small font-bold text-text-2">{T.calc.footnotesTitle}</h3>
        <ol className="grid list-decimal gap-2 ps-5 text-micro font-normal text-muted md:grid-cols-2 md:gap-x-10">
          {T.footnotes.map((f, i) => (
            <li key={i} id={`fn-${i + 1}`} className="scroll-mt-28 leading-relaxed">
              {f}
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
