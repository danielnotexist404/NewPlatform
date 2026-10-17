const MONTHS_HE = ["בינואר", "בפברואר", "במרץ", "באפריל", "במאי", "ביוני", "ביולי", "באוגוסט", "בספטמבר", "באוקטובר", "בנובמבר", "בדצמבר"];

/**
 * "2026-10-17" → "17 באוקטובר 2026" (App E §6). Pure string formatting — no `new Date()`,
 * so it is safe in prerendered Server Components (cacheComponents).
 */
export function formatHeDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS_HE[m - 1]} ${y}`;
}
