import type { Metadata, Viewport } from "next";
import { heebo, karantina, jetbrains } from "./fonts";
import { Providers } from "./providers";
import { ThemeScript } from "@/components/a11y/theme-script";
import { BRAND } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${BRAND.domain}`),
  title: {
    default: `${BRAND.nameHe} · סרטון תדמית וקמפיין ממומן בלחיצה, בעברית`,
    template: `%s · ${BRAND.nameHe}`,
  },
  description:
    "בוחרים נישה, מקבלים סרטון מוכן בעברית ומעלים אותו כקמפיין לפייסבוק ולאינסטגרם, בלי עורך וידאו ובלי סוכנות. דשבורד פשוט בעברית, 0% מתקציב הפרסום.",
  applicationName: BRAND.nameHe,
  openGraph: { locale: "he_IL", type: "website", siteName: BRAND.nameHe },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#08080C" },
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="he"
      dir="rtl"
      data-theme="light"
      suppressHydrationWarning
      className={`${heebo.variable} ${karantina.variable} ${jetbrains.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <Providers dir="rtl">{children}</Providers>
      </body>
    </html>
  );
}
