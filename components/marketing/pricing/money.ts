import { VAT_RATE } from "@/lib/data/plans";

/** `net = round2(gross / (1 + vat_rate))` (Part 02 §7.2). The rate will come from `app_settings.vat_rate`. */
export function netOf(gross: number, vatRate: number = VAT_RATE): number {
  return Math.round((gross / (1 + vatRate)) * 100) / 100;
}

export const isWhole = (n: number) => Math.abs(n - Math.round(n)) < 0.005;

const nf0 = new Intl.NumberFormat("he-IL");
const nf2 = new Intl.NumberFormat("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** "₪119" / "₪100.85" — agorot only when the amount is not whole. */
export function fmtIls(n: number): string {
  return `₪${isWhole(n) ? nf0.format(Math.round(n)) : nf2.format(n)}`;
}

export const vatPercent = (vatRate: number = VAT_RATE) => Math.round(vatRate * 100);
