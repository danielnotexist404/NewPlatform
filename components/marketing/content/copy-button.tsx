"use client";
import * as React from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CONTENT_UI } from "@/content/he/site";

export function CopyButton({ text, label, copiedToast }: { text: string; label: string; copiedToast: string }) {
  const [done, setDone] = React.useState(false);
  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          toast.success(copiedToast);
          window.setTimeout(() => setDone(false), 1800);
        } catch {
          toast.error(CONTENT_UI.copy.failed);
        }
      }}
    >
      {done ? <Check aria-hidden /> : <Copy aria-hidden />}
      {done ? CONTENT_UI.copy.done : label}
    </Button>
  );
}
