import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Directional icons by meaning, not by drawing (Part 01 §9.2). In RTL "next" points left.
 * Only directional arrows flip; media controls and logos never do.
 */
export function DirIcon({ name, className }: { name: "next" | "prev" | "forward" | "back"; className?: string }) {
  const props = { className: className ?? "size-[1.1em]", "aria-hidden": true as const };
  switch (name) {
    case "next":
      return <ChevronLeft {...props} />;
    case "prev":
      return <ChevronRight {...props} />;
    case "forward":
      return <ArrowLeft {...props} />;
    case "back":
      return <ArrowRight {...props} />;
  }
}
