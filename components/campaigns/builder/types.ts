import { addDays, builderDraft, GOAL_CTAS, MOCK_TODAY, type CampaignGoal, type CtaKey } from "@/lib/mock/campaigns";

export interface DraftState {
  goal: CampaignGoal;
  areaMode: "radius" | "cities" | "country";
  radiusKm: number;
  customKm: boolean;
  cities: string[];
  ageMin: number;
  ageMax: number;
  advantage: boolean;
  ageWarn: boolean;
  reelsOnly: boolean;
  qualityLeads: boolean;
  creativeOptin: boolean;
  cta: CtaKey;
  utm: string;
  budget: number;
  customBudget: boolean;
  duration: "open" | "date";
  endDate: string;
  userCapOn: boolean;
  userCap: number;
  variants: { primaryText: string; headline: string }[];
}

export type Patch = (p: Partial<DraftState>) => void;

export function initialDraft(): DraftState {
  const d = builderDraft.defaults;
  return {
    goal: d.goal,
    areaMode: "radius",
    radiusKm: d.radiusKm,
    customKm: false,
    cities: [],
    ageMin: d.ageMin,
    ageMax: d.ageMax,
    advantage: true,
    ageWarn: false,
    reelsOnly: false,
    qualityLeads: false,
    creativeOptin: false,
    cta: GOAL_CTAS[d.goal][0],
    utm: "utm_source=meta&utm_medium=paid_social&utm_campaign=kdm_new",
    budget: d.dailyBudgetIls,
    customBudget: false,
    duration: "date",
    endDate: addDays(MOCK_TODAY, builderDraft.firstCampaignDays - 1),
    userCapOn: true,
    userCap: 2000,
    variants: builderDraft.variants.map((v) => ({ primaryText: v.primaryText, headline: v.headline })),
  };
}

export const RADIUS_CHIPS = [3, 5, 10, 15, 25] as const;
export const PRIMARY_MAX = 125;
export const HEADLINE_MAX = 40;
