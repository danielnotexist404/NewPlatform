"use client";
import * as React from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plural } from "./plural";
import { APP_CORE } from "@/content/he/app-core";

const R = APP_CORE.render;

/** Part 03 §7.5. Initial focus on "המשך היצירה" (the non-destructive action). */
export function CancelJobDialog({
  open,
  onOpenChange,
  captured,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  captured: number;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>{R.cancelDialog.title}</DialogTitle>
        <DialogDescription>
          {R.cancelDialog.bodyPre}
          <Plural n={captured} forms={APP_CORE.counts.captured} />
          {R.cancelDialog.bodyPost}
        </DialogDescription>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <DialogClose asChild>
            <Button variant="secondary" autoFocus>{R.cancelDialog.keep}</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => {
              onOpenChange(false);
              onConfirm();
            }}
          >
            {R.cancelDialog.confirm}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
