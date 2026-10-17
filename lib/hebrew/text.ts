/**
 * Hebrew prefix letters (ב, ל, מ, ש, ה, ו, כ) attach to a Hebrew word without a hyphen,
 * and with a hyphen before digits, Latin text, e-mails and formatted dates (Part 00 §6.5, R18).
 */
const HEBREW_START = /^[֐-׿]/;

export function withPrefix(prefix: string, word: string): string {
  if (!word) return prefix;
  return HEBREW_START.test(word) ? `${prefix}${word}` : `${prefix}-${word}`;
}

/** Owner variables that were not filled yet look like "{{NAME}}" and must never be shown. */
export function isFilled(value: string | null | undefined): value is string {
  return !!value && !/^\{\{.+\}\}$/.test(value.trim());
}
