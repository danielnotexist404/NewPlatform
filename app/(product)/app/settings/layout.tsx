import { SettingsNav } from "@/components/settings/settings-nav";
import { PageHeader } from "@/components/settings/kit";
import { settingsCopy } from "@/content/he/account";

/** /app/settings/* shell: page title + secondary nav at the start (Part 03 §16). Also wraps /integrations (owned elsewhere). */
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <PageHeader title={settingsCopy.title} description={settingsCopy.subtitle} />
      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
        <SettingsNav />
        <div className="min-w-0 max-w-[880px]">{children}</div>
      </div>
    </div>
  );
}
