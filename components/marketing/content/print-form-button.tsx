"use client";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTENT_UI } from "@/content/he/site";

/** Prints only the consent form (Part 02 §10.8): copies its markup into a clean RTL window. */
export function PrintFormButton({ targetId }: { targetId: string }) {
  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={() => {
        const el = document.getElementById(targetId);
        if (!el) return;
        const w = window.open("", "_blank", "noopener=no,width=820,height=1000");
        if (!w) {
          window.print();
          return;
        }
        w.document.write(
          `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>${CONTENT_UI.print.windowTitle}</title>` +
            `<style>body{font-family:Arial,"Noto Sans Hebrew",sans-serif;line-height:1.9;font-size:15px;margin:40px;color:black;background:white}` +
            `h3{font-size:20px;margin:0 0 16px}p{margin:0 0 14px}strong{font-weight:700}[data-print-hide]{display:none}</style></head>` +
            `<body>${el.innerHTML}</body></html>`,
        );
        w.document.close();
        w.focus();
        w.print();
      }}
    >
      <Printer aria-hidden />
      {CONTENT_UI.print.button}
    </Button>
  );
}
