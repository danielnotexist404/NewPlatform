"use client";
import * as React from "react";
import { useSearchParams } from "next/navigation";
import { getSeason } from "@/lib/data/seed";
import { getCampaign, GOAL_CTAS } from "@/lib/mock/campaigns";
import { getVideo, socialPosts } from "@/lib/mock/publish";
import { builder as B } from "@/content/he/campaigns-app";
import { fmt } from "../text";
import { CampaignBuilder } from "./campaign-builder";
import type { DraftState } from "./types";

/** Entry points (spec §F.1): /app/campaigns/new?duplicate=&season=&post=&project= */
export function BuilderEntry() {
  const sp = useSearchParams();
  const duplicate = sp.get("duplicate");
  const season = sp.get("season");
  const post = sp.get("post");

  let initial: Partial<DraftState> | undefined;
  let note: string | null = null;
  const src = duplicate ? getCampaign(duplicate) : undefined;
  if (src) {
    initial = {
      goal: src.goal,
      cta: GOAL_CTAS[src.goal][0],
      budget: src.dailyBudgetIls,
      radiusKm: src.geo.radiusKm ?? 5,
      areaMode: src.geo.mode,
      cities: src.geo.cities ?? [],
      ageMin: src.advantageAudience ? Math.min(src.ageMin, 25) : src.ageMin,
      ageMax: src.advantageAudience ? 65 : src.ageMax,
      advantage: src.advantageAudience,
    };
    note = fmt(B.entry.duplicate, { name: src.name });
  } else if (season && getSeason(season)) {
    note = fmt(B.entry.season, { name: getSeason(season)!.name_he });
  } else if (post) {
    const p = socialPosts.find((x) => x.id === post);
    const v = p ? getVideo(p.videoId) : undefined;
    if (v) note = fmt(B.entry.post, { name: v.title });
  }
  return <CampaignBuilder key={`${duplicate}-${season}-${post}`} initial={initial} entryNote={note} />;
}
