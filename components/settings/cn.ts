import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * `cn` for the account screens. tailwind-merge does not know the custom type scale in globals.css, so the
 * stock `cn` treats `text-micro` and `text-violet` as the same group and drops the size. This instance
 * registers the scale as font sizes. (The same fix is needed in lib/utils.ts — reported to the lead.)
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display", "h1", "h2", "h3", "body-lg", "body", "small", "micro"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
