"use client";
/** Hub explorer: the whole seed library is bundled here (client-side search + facets, Part 02 §5.5). */
import { HookExplorer } from "./hook-explorer";
import { ALL_HOOKS, placeholdersIn } from "./hook-data";

const FIELDS = placeholdersIn(ALL_HOOKS);

export function HubHookExplorer() {
  return (
    <HookExplorer
      hooks={ALL_HOOKS}
      mode="hub"
      facets={["niche", "type", "platform", "goal", "gender", "season"]}
      personalizerFields={FIELDS}
      showNicheChip
      location="hub"
    />
  );
}
