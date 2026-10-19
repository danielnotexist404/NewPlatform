// Brand-kit fonts (Part 01 §5.4): the 7 open-licence Hebrew fonts allowed in videos. Heebo and Karantina come
// from app/fonts.ts; the other five load here, only on the brand screens (preload: false, swap).
import { Rubik, Assistant, Secular_One, Suez_One, Fredoka } from "next/font/google";
import type { BrandFont } from "@/lib/mock/account";

const rubik = Rubik({ subsets: ["hebrew", "latin"], display: "swap", preload: false }); // variable font: explicit weights broke the Turbopack font loader in production builds
const assistant = Assistant({ subsets: ["hebrew", "latin"], weight: ["400", "700"], display: "swap", preload: false });
const secular = Secular_One({ subsets: ["hebrew", "latin"], weight: "400", display: "swap", preload: false });
const suez = Suez_One({ subsets: ["hebrew", "latin"], weight: "400", display: "swap", preload: false });
const fredoka = Fredoka({ subsets: ["hebrew", "latin"], weight: ["600"], display: "swap", preload: false });

export const BRAND_FONTS: BrandFont[] = ["Heebo", "Rubik", "Assistant", "Secular One", "Suez One", "Fredoka", "Karantina"];

export function fontFamily(f: BrandFont): string {
  switch (f) {
    case "Heebo": return "var(--font-heebo), sans-serif";
    case "Karantina": return "var(--font-karantina), var(--font-heebo), sans-serif";
    case "Rubik": return rubik.style.fontFamily;
    case "Assistant": return assistant.style.fontFamily;
    case "Secular One": return secular.style.fontFamily;
    case "Suez One": return suez.style.fontFamily;
    case "Fredoka": return fredoka.style.fontFamily;
  }
}
