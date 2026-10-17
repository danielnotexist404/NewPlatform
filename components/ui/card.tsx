import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, interactive, ...props }: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-md bg-surface-1 text-text elev-1 shadow-[inset_0_0_0_1px_var(--color-frame)]",
        interactive && "transition-colors hover:bg-surface-2 hover:elev-2",
        className,
      )}
      {...props}
    />
  );
}
export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 p-5 pb-0", className)} {...props} />;
}
export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-h3", className)} {...props} />;
}
export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-small text-text-2", className)} {...props} />;
}
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props} />;
}
export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center gap-3 p-5 pt-0", className)} {...props} />;
}
