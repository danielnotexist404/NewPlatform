import type { Metadata } from "next";
import { NotificationsSettings } from "@/components/settings/notifications-settings";
import { settingsCopy } from "@/content/he/account";

export const metadata: Metadata = {
  title: settingsCopy.meta.notifications.title,
  description: settingsCopy.meta.notifications.description,
};

export default function NotificationsPage() {
  return <NotificationsSettings />;
}
