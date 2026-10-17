/**
 * Blocking theme script (Part 01 §6.2): the server renders data-theme="dark"; this corrects it
 * before paint from localStorage / the OS preference, so ISR pages never read cookies.
 */
export const THEME_SCRIPT_SOURCE = `(function(){try{var t=localStorage.getItem("theme");var m=localStorage.getItem("motion");var d=document.documentElement;if(t==="light"||t==="dark"){d.dataset.theme=t}else if(t==="system"&&window.matchMedia("(prefers-color-scheme: light)").matches){d.dataset.theme="light"}if(m==="reduce"){d.dataset.motion="reduce"}}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT_SOURCE }} />;
}
