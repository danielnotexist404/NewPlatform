import Script from "next/script";

/**
 * Blocking theme script (Part 01 §6.2). The server renders data-theme="light" (the marketing default).
 * Before paint this applies, in order: the stored choice ("light" / "dark" / "system"), otherwise the
 * shell default — dark for the product app (/app), light everywhere else. No cookies, so ISR pages stay static.
 * It also sets data-js="1" so scroll-reveal styles only hide content when JS is running.
 * Client-side navigation between shells is handled by <ShellTheme> (components/a11y/shell-theme.tsx).
 */
export const THEME_SCRIPT_SOURCE = `(function(){try{var d=document.documentElement,t=null,m=null;try{t=localStorage.getItem("theme");m=localStorage.getItem("motion")}catch(e){}var def=/^\\/app(\\/|$)/.test(location.pathname)?"dark":"light";var r=t==="light"||t==="dark"?t:t==="system"?(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"):def;d.dataset.theme=r;d.dataset.js="1";if(m==="reduce"){d.dataset.motion="reduce"}}catch(e){}})();`;

export function ThemeScript() {
  return <Script id="theme-script" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: THEME_SCRIPT_SOURCE }} />;
}
