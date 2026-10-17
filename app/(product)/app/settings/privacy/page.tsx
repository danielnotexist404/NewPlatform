import type { Metadata } from "next";
import { Suspense } from "react";
import { PrivacySettings } from "@/components/settings/privacy-settings";
import { settingsCopy } from "@/content/he/account";

export const metadata: Metadata = {
  title: settingsCopy.meta.privacy.title,
  description: settingsCopy.meta.privacy.description,
};

export default function PrivacyPage() {
  return (
    <Suspense>
      <PrivacySettings />
    </Suspense>
  );
}
