import * as React from "react";
import { ReelChromeBar, ReelFootage, ReelWords } from "./reel-card";
import type { ReelData } from "./reel-data";
import { cn } from "@/lib/utils";

export type TileAspect = "9:16" | "1:1" | "16:9" | "4:5";

const ASPECT: Record<TileAspect, string> = { "9:16": "aspect-[9/16]", "1:1": "aspect-square", "16:9": "aspect-video", "4:5": "aspect-[4/5]" };
/** Width of the caption column, as a share of the tile width, so captions keep reel proportions in any format. */
const COLUMN: Record<TileAspect, string> = { "9:16": "w-full", "1:1": "w-[62%]", "16:9": "w-[40%]", "4:5": "w-[76%]" };

/**
 * A looping "video" in any format (9:16, 1:1, 16:9, 4:5): the same animated footage and word-by-word caption as ReelCard.
 * Children render on top (badges, a play button).
 */
export function MediaTile({
  reel, aspect = "9:16", offset = 0, className, children, label, instance = "", rounded = "rounded-[22px]",
}: {
  reel: ReelData;
  aspect?: TileAspect;
  offset?: number;
  className?: string;
  children?: React.ReactNode;
  label?: string;
  instance?: string;
  rounded?: string;
}) {
  const words = reel.hook.split(/\s+/).filter(Boolean).length;
  const loop = Math.max(6, Math.min(9, 4.2 + words * 0.32));
  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("@container relative isolate overflow-hidden bg-ink shadow-[0_30px_60px_-30px_color-mix(in_oklab,var(--color-ink)_55%,transparent),inset_0_0_0_1px_var(--color-frame)]", ASPECT[aspect], rounded, className)}
    >
      <ReelFootage reel={reel} uid={`${reel.key}${instance}`} offset={offset} propClassName={aspect === "16:9" ? "w-[34%] bottom-[12%]" : aspect === "1:1" ? "w-[48%] bottom-[10%]" : undefined} />
      <div aria-hidden className="absolute inset-0 flex justify-center">
        <div className={cn("@container relative h-full", COLUMN[aspect])}>
          <ReelChromeBar loop={loop} offset={offset} />
          <div className="absolute inset-x-[5cqw] top-[16cqw]">
            <ReelWords text={reel.hook} style={reel.caption} highlight={reel.highlight} loop={loop} offset={offset} />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
