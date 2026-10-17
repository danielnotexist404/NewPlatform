import {
  Activity, BedDouble, Brush, Building2, Calculator, Camera, Car, ChefHat, Compass, Dumbbell, GraduationCap,
  HandHeart, Hammer, HeartHandshake, House, Landmark, Music, PartyPopper, PawPrint, PersonStanding, PlugZap,
  Rocket, Scale, Scissors, ShoppingCart, Smile, Sofa, Sparkles, Store, ToyBrick, TrafficCone, Truck, Umbrella,
  UtensilsCrossed, Vote, Wrench, type LucideIcon, type LucideProps,
} from "lucide-react";

/** Static map of the 36 seed icons (Part 01 §10.14). Unknown name → Store. Objects never mirror in RTL. */
const ICONS: Record<string, LucideIcon> = {
  Activity, BedDouble, Brush, Building2, Calculator, Camera, Car, ChefHat, Compass, Dumbbell, GraduationCap,
  HandHeart, Hammer, HeartHandshake, House, Landmark, Music, PartyPopper, PawPrint, PersonStanding, PlugZap,
  Rocket, Scale, Scissors, ShoppingCart, Smile, Sofa, Sparkles, Store, ToyBrick, TrafficCone, Truck, Umbrella,
  UtensilsCrossed, Vote, Wrench,
};

export function NicheIcon({ name, ...props }: Omit<LucideProps, "ref"> & { name: string | null }) {
  const Icon = (name && ICONS[name]) || Store;
  return <Icon aria-hidden {...props} />;
}
