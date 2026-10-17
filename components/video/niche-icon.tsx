import {
  Activity, Bed, BedDouble, Brush, Building2, Calculator, CalendarDays, Camera, Car, ChefHat, CircleDashed, Clapperboard, Compass,
  Dumbbell, Flame, GraduationCap, Hammer, HandHeart, HeartHandshake, House, Landmark, MessageCircle, Music, PartyPopper, PawPrint,
  PersonStanding, PlugZap, Rocket, Scale, Scissors, ShoppingCart, Smile, Sofa, Sparkles, Star, Store, ToyBrick, TrafficCone, Truck,
  Umbrella, UtensilsCrossed, Wrench, type LucideProps,
} from "lucide-react";

/** Static map of the seed niche icons (niches.icon) + scene glyphs. Unknown → Store. Always decorative. */
const MAP = {
  Activity, Bed, BedDouble, Brush, Building2, Calculator, CalendarDays, Camera, Car, ChefHat, CircleDashed, Clapperboard, Compass,
  Dumbbell, Flame, GraduationCap, Hammer, HandHeart, HeartHandshake, House, Landmark, MessageCircle, Music, PartyPopper, PawPrint,
  PersonStanding, PlugZap, Rocket, Scale, Scissors, ShoppingCart, Smile, Sofa, Sparkles, Star, Store, ToyBrick, TrafficCone, Truck,
  Umbrella, UtensilsCrossed, Wrench,
} as const;

export function NicheIcon({ name, ...props }: Omit<LucideProps, "ref" | "name"> & { name: string | null | undefined }) {
  const I = (name && (MAP as Record<string, typeof Store>)[name]) || Store;
  return <I aria-hidden {...props} />;
}
