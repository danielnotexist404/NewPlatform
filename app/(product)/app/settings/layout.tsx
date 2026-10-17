import { SettingsNav } from "@/components/settings/settings-nav";
import { DemoBadge } from "@/components/settings/kit";
import { settingsCopy } from "@/content/he/account";

/** /app/settings/* shell: secondary nav at the start (Part 03 §16). Wraps integrations too (owned elsewhere). */
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-micro text-muted">{settingsCopy.title}</p>
        <DemoBadge />
      </div>
      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
        <SettingsNav />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
