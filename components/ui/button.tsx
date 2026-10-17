import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Part 01 §8.3: pill buttons, gold primary with ink text, loading keeps width. */
export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-[background-color,box-shadow,transform,color] duration-[var(--duration-hover)] active:scale-[.98] disabled:pointer-events-none disabled:opacity-50 aria-disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 [&_svg]:size-[1.1em] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary hover:bg-primary-hover hover:glow-primary",
        secondary: "bg-surface-2 text-text border border-border-strong hover:bg-surface-3",
        outline: "border border-border-strong text-text hover:bg-surface-2",
        ghost: "text-text hover:bg-surface-2",
        destructive: "bg-danger text-on-danger hover:opacity-90",
        link: "rounded-none text-link underline underline-offset-4 hover:decoration-2 px-0",
      },
      size: {
        sm: "h-8 px-3.5 text-sm",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        "icon-sm": "size-8",
        icon: "size-10",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export function Button({ className, variant, size, asChild = false, loading = false, children, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      aria-busy={loading || undefined}
      disabled={!asChild ? props.disabled || loading : undefined}
      {...props}
    >
      {loading && !asChild ? (
        <>
          <Loader2 className="animate-spin" aria-hidden />
          {children}
        </>
      ) : (
        children
      )}
    </Comp>
  );
}
