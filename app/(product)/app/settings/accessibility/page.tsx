import type { Metadata } from "next";
import { AccessibilitySettings } from "@/components/settings/accessibility-settings";
import { settingsCopy } from "@/content/he/account";

export const metadata: Metadata = {
  title: settingsCopy.meta.accessibility.title,
  description: settingsCopy.meta.accessibility.description,
};

export default function AccessibilityPage() {
  return <AccessibilitySettings />;
}
