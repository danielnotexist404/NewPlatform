"use client";
import { Clapperboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DirIcon } from "@/components/a11y/dir-icon";
import { HOOKS_COPY } from "@/content/he/hooks";
import { useGate } from "./hooks-provider";
import { createFromHookHref } from "./links";

export function CreateFromHookButton({ id }: { id: string }) {
  const gate = useGate();
  return (
    <Button size="xl" onClick={() => gate("create", createFromHookHref(id))}>
      <Clapperboard aria-hidden />
      {HOOKS_COPY.card.createVideo}
      <DirIcon name="forward" />
    </Button>
  );
}
