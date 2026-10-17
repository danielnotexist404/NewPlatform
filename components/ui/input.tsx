import * as React from "react";
import { cn } from "@/lib/utils";

const field =
  "w-full rounded-sm bg-surface-2 border border-border-strong px-3.5 text-base text-text placeholder:text-muted text-start transition-shadow focus-visible:outline-2 focus-visible:outline-offset-0 aria-[invalid=true]:border-danger disabled:opacity-50 read-only:bg-surface-1";

export function Input({ className, size = "md", ...props }: Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & { size?: "md" | "lg" }) {
  return <input data-slot="input" className={cn(field, size === "lg" ? "h-[52px]" : "h-11", className)} {...props} />;
}

/** Phone, e-mail, URL and number fields are LTR inside the RTL page (Part 01 §9). */
export function LtrInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return <Input dir="ltr" className={cn("text-left", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea data-slot="textarea" className={cn(field, "min-h-24 py-2.5 [field-sizing:content]", className)} {...props} />;
}
