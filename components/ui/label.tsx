"use client";
import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

export function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return <LabelPrimitive.Root className={cn("text-sm font-semibold text-text", className)} {...props} />;
}

export function Field({ label, htmlFor, help, error, optional, children }: {
  label: string; htmlFor: string; help?: string; error?: string; optional?: boolean; children: React.ReactNode;
}) {
  const helpId = help ? `${htmlFor}-help` : undefined;
  const errId = error ? `${htmlFor}-error` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>
        {label}
        {optional && <span className="ms-1 font-normal text-muted">(רשות)</span>}
      </Label>
      {children}
      {help && <p id={helpId} className="text-small text-muted">{help}</p>}
      {error && <p id={errId} role="alert" className="text-small text-danger">{error}</p>}
    </div>
  );
}
