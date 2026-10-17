import {
  Activity, BedDouble, Brush, Building2, Calculator, Camera, Car, ChefHat, Compass, Dumbbell, GraduationCap, Hammer,
  HandHeart, HeartHandshake, House, Landmark, Music, PartyPopper, PawPrint, PersonStanding, PlugZap, Rocket, Scale,
  Scissors, ShoppingCart, Smile, Sofa, Sparkles, Store, ToyBrick, TrafficCone, Truck, Umbrella, UtensilsCrossed, Wrench,
  type LucideIcon, type LucideProps,
} from "lucide-react";

/** Static map of the seed niche icons (Part 01 §10.14). Unknown name → Store. Always aria-hidden. */
const ICONS: Record<string, LucideIcon> = {
  House, Building2, Sparkles, Brush, Scissors, UtensilsCrossed, Dumbbell, PersonStanding, Hammer, Smile, Landmark,
  PartyPopper, ShoppingCart, Car, Wrench, Scale, Calculator, Umbrella, Sofa, Camera, Music, BedDouble, Compass,
  GraduationCap, HeartHandshake, PawPrint, TrafficCone, ToyBrick, PlugZap, Truck, Store, ChefHat, Rocket, HandHeart, Activity,
};

export function NicheIcon({ icon, ...props }: Omit<LucideProps, "ref" | "name"> & { icon: string | null | undefined }) {
  const Icon = (icon && ICONS[icon]) || Store;
  return <Icon aria-hidden {...props} />;
}
