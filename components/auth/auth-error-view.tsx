"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AUTH } from "@/content/he/site";

export function AuthErrorView() {
  const reason = useSearchParams().get("reason");
  const body = reason === "expired" ? AUTH.context.expired : reason === "oauth" ? AUTH.context.oauth : AUTH.error.unknown;
  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-xl bg-surface-1 p-8 text-center shadow-[inset_0_0_0_1px_var(--color-frame)] elev-2">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-afterglow" />
      <div className="relative flex flex-col items-center gap-4">
        <span aria-hidden className="inline-flex size-14 items-center justify-center rounded-full bg-danger/15 text-danger">
          <TriangleAlert className="size-7" />
        </span>
        <h1 className="text-h2">{AUTH.error.title}</h1>
        <p className="text-text-2">{body}</p>
        <Link href="/login" className={cn(buttonVariants({ size: "lg" }), "mt-2")}>
          {AUTH.error.back}
        </Link>
      </div>
    </div>
  );
}
