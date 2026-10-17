import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/** Register our custom type scale so `text-micro text-muted` keeps both size and color. */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display", "h1", "h2", "h3", "body-lg", "body", "small", "micro"] }],
      shadow: ["elev-1", "elev-2", "elev-3", "glow-primary", "glow-ai"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
