// app/fonts.ts — UI fonts via next/font (self-hosted at build, no runtime request to Google). Part 01 §5.1.
import { Heebo, Karantina, JetBrains_Mono } from "next/font/google";

export const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  fallback: ["Arial Hebrew", "Noto Sans Hebrew", "Arial", "sans-serif"],
});

export const karantina = Karantina({
  subsets: ["hebrew", "latin"],
  weight: ["700"],
  variable: "--font-karantina",
  display: "swap",
  preload: false,
  fallback: ["Arial Hebrew", "sans-serif"],
});

export const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});
