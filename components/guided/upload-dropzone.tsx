"use client";
import * as React from "react";
import { CircleAlert, FileVideo, Upload } from "lucide-react";
import { Progress } from "@/components/ui/misc";
import { GUIDED } from "@/content/he/trends-app";
import { cn } from "@/lib/utils";

export interface PickedFile { name: string; size: number }

const fmtSize = (b: number) => (b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

/**
 * Upload dropzone mock (spec 07–08 §J.7: `<input type="file" accept="video/*" capture="environment">`).
 * The real flow sends the file through the signed `upload_video` URL; here the progress is simulated.
 */
export function UploadDropzone({ onUploaded, disabled }: { onUploaded: (f: PickedFile) => void; disabled?: boolean }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [over, setOver] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [file, setFile] = React.useState<PickedFile | null>(null);
  const [progress, setProgress] = React.useState<number | null>(null);
  const timer = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const id = React.useId();

  React.useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  function accept(f: File | undefined) {
    if (!f) return;
    if (!f.type.startsWith("video/")) {
      setError(GUIDED.upload.notVideo);
      return;
    }
    setError(null);
    const picked = { name: f.name, size: f.size };
    setFile(picked);
    setProgress(0);
    if (timer.current) clearInterval(timer.current);
    let p = 0;
    timer.current = setInterval(() => {
      p = Math.min(100, p + 12);
      setProgress(p);
      if (p >= 100 && timer.current) {
        clearInterval(timer.current);
        timer.current = null;
        setTimeout(() => onUploaded(picked), 250);
      }
    }, 120);
  }

  const uploading = progress !== null && progress < 100;

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); if (!disabled) accept(e.dataTransfer.files?.[0]); }}
        className={cn(
          "flex cursor-pointer flex-col items-center gap-2 rounded-md border-2 border-dashed border-border-strong bg-surface-1 px-4 py-6 text-center transition-colors hover:bg-surface-2 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus",
          over && "border-primary bg-primary/10",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-surface-3 text-primary-text">
          <Upload aria-hidden className="size-5" />
        </span>
        <span className="font-semibold">{GUIDED.upload.drop}</span>
        <span className="text-micro text-muted">{GUIDED.upload.formats}</span>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="video/*"
          capture="environment"
          disabled={disabled}
          className="sr-only"
          aria-describedby={error ? `${id}-err` : undefined}
          onChange={(e) => { accept(e.target.files?.[0]); e.target.value = ""; }}
        />
      </label>
      {error && (
        <p id={`${id}-err`} role="alert" className="flex items-center gap-1.5 text-small text-danger">
          <CircleAlert aria-hidden className="size-4" />
          {error}
        </p>
      )}
      {file && progress !== null && (
        <div className="flex items-center gap-3 rounded-sm bg-surface-2 p-3" aria-live="polite">
          <FileVideo aria-hidden className="size-5 shrink-0 text-text-2" />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2 text-small">
              <bdi dir="ltr" className="truncate">{file.name}</bdi>
              <span className="num shrink-0 text-muted">{fmtSize(file.size)}</span>
            </div>
            <Progress value={progress} aria-label={GUIDED.upload.uploading} />
            <span className="text-micro text-muted">{uploading ? GUIDED.upload.uploading : GUIDED.upload.done}</span>
          </div>
        </div>
      )}
    </div>
  );
}
