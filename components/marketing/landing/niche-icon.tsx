import {
  Activity, BedDouble, Brush, Building2, Calculator, Camera, Car, ChefHat, Compass, Dumbbell, GraduationCap,
  Hammer, HandHeart, HeartHandshake, House, Landmark, Music, PartyPopper, PawPrint, PersonStanding, PlugZap,
  Rocket, Scale, Scissors, ShoppingCart, Smile, Sofa, Sparkles, Store, ToyBrick, TrafficCone, Truck, Umbrella,
  UtensilsCrossed, Wrench, Briefcase, type LucideIcon,
} from "lucide-react";

/** Seed `niches.icon` (lucide names) → component. Unknown names fall back to a neutral icon. */
const ICONS: Record<string, LucideIcon> = {
  Activity, BedDouble, Brush, Building2, Calculator, Camera, Car, ChefHat, Compass, Dumbbell, GraduationCap,
  Hammer, HandHeart, HeartHandshake, House, Landmark, Music, PartyPopper, PawPrint, PersonStanding, PlugZap,
  Rocket, Scale, Scissors, ShoppingCart, Smile, Sofa, Sparkles, Store, ToyBrick, TrafficCone, Truck, Umbrella,
  UtensilsCrossed, Wrench,
};

export function NicheIcon({ name, className, strokeWidth }: { name: string; className?: string; strokeWidth?: number }) {
  const Icon = ICONS[name] ?? Briefcase;
  return <Icon className={className ?? "size-4"} strokeWidth={strokeWidth} aria-hidden />;
}

/** Category → two accent tokens used by the CSS "video" art. Tokens only (no raw colors). */
const CATEGORY_TONES: Record<string, [string, string]> = {
  "real-estate-home": ["var(--color-primary)", "var(--color-violet)"],
  "beauty-grooming": ["var(--color-rose)", "var(--color-violet)"],
  "health-wellness": ["var(--color-success)", "var(--color-violet)"],
  "food-hospitality": ["var(--color-primary)", "var(--color-rose)"],
  events: ["var(--color-violet)", "var(--color-rose)"],
  "tourism-leisure": ["var(--color-success)", "var(--color-primary)"],
  "professional-finance": ["var(--color-violet)", "var(--color-primary)"],
  commerce: ["var(--color-rose)", "var(--color-primary)"],
  automotive: ["var(--color-primary)", "var(--color-success)"],
  "education-kids": ["var(--color-lemon)", "var(--color-violet)"],
  pets: ["var(--color-success)", "var(--color-lemon)"],
  "tech-b2b": ["var(--color-violet)", "var(--color-success)"],
  "community-public": ["var(--color-success)", "var(--color-violet)"],
};

export function categoryTones(categorySlug: string): [string, string] {
  return CATEGORY_TONES[categorySlug] ?? ["var(--color-primary)", "var(--color-violet)"];
}
