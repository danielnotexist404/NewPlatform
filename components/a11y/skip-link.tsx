export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:inset-s-4 focus:top-4 focus:z-[var(--z-toast)] focus:rounded-full focus:bg-primary focus:px-5 focus:py-2.5 focus:font-semibold focus:text-on-primary"
    >
      דילוג לתוכן הראשי
    </a>
  );
}
