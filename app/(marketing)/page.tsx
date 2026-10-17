import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SIGNUP_HREF } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Temporary hero — replaced by the full landing page (components/marketing/landing/*).
export default function HomePage() {
  return (
    <section id="hero" className="container-marketing flex min-h-[70dvh] flex-col items-start justify-center gap-6 py-20">
      <h1 className="text-h1 max-w-4xl">
        סרטון מוכן <span className="text-gold-gradient">וקמפיין באוויר</span>, בלחיצה אחת
      </h1>
      <p className="text-body-lg max-w-2xl text-text-2">
        לעסקים קטנים ולעסקים שצומחים: בוחרים נישה, מקבלים סרטון בעברית, ומעלים אותו כקמפיין לפייסבוק ולאינסטגרם מכאן. בלי עורך וידאו, בלי סוכנות, ובלי להבין במנהל המודעות.
      </p>
      <Link href={SIGNUP_HREF} className={cn(buttonVariants({ size: "xl" }))}>צרו סרטון בחינם</Link>
    </section>
  );
}
