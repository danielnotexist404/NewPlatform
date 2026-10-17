import type { Metadata } from "next";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { settingsCopy } from "@/content/he/account";

export const metadata: Metadata = {
  title: settingsCopy.meta.profile.title,
  description: settingsCopy.meta.profile.description,
};

export default function SettingsProfilePage() {
  return <ProfileSettings />;
}
