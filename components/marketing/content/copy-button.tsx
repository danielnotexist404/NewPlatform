"use client";
import * as React from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CopyButton({ text, label = "העתקה", copiedToast = "ההוק הועתק" }: { text: string; label?: string; copiedToast?: string }) {
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
          toast.error("לא הצלחנו להעתיק. אפשר לסמן את הטקסט ולהעתיק ידנית.");
        }
      }}
    >
      {done ? <Check aria-hidden /> : <Copy aria-hidden />}
      {done ? "הועתק" : label}
    </Button>
  );
}
