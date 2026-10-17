import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-xs px-2 py-0.5 text-micro whitespace-nowrap [&_svg]:size-3.5",
  {
    variants: {
      variant: {
        neutral: "bg-surface-3 text-text-2",
        primary: "bg-primary text-on-primary",
        lemon: "bg-lemon text-on-primary",
        violet: "bg-violet/15 text-violet",
        success: "bg-success/15 text-success",
        danger: "bg-danger/15 text-danger",
        outline: "border border-border-strong text-text-2",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}
