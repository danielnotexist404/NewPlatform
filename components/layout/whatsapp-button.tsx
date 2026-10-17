import { MessageCircle } from "lucide-react";
import { whatsappHref } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** The only way to link to WhatsApp (Part 02 §2.5). Hidden until the owner fills the number. */
export function WhatsAppButton({ text, label = "דברו איתנו בוואטסאפ", iconOnly = false, className }: { text?: string; label?: string; iconOnly?: boolean; className?: string }) {
  const href = whatsappHref(text);
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={iconOnly ? label : undefined}
      className={cn(buttonVariants({ variant: "secondary", size: iconOnly ? "icon-lg" : "md" }), className)}
    >
      <MessageCircle aria-hidden />
      {!iconOnly && label}
    </a>
  );
}
