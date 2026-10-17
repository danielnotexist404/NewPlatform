import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

/**
 * `FaqAccordion` (Part 01 §11.2): several items may be open; the trigger is a button inside an <h3>
 * (Radix `Accordion.Header` renders the <h3>).
 */
export function FaqList({ items, className }: { items: { id: string; q_he: string; a_he: string }[]; className?: string }) {
  return (
    <Accordion type="multiple" className={cn("border-t border-border", className)}>
      {items.map((f) => (
        <AccordionItem key={f.id} value={f.id} id={`faq-${f.id}`}>
          <AccordionTrigger>{f.q_he}</AccordionTrigger>
          <AccordionContent>
            <p className="max-w-3xl">{f.a_he}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
