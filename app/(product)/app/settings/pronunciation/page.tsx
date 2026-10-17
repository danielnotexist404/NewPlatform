import type { Metadata } from "next";
import { PronunciationTable } from "@/components/settings/pronunciation-table";
import { settingsCopy } from "@/content/he/account";

export const metadata: Metadata = {
  title: settingsCopy.meta.pronunciation.title,
  description: settingsCopy.meta.pronunciation.description,
};

export default function PronunciationPage() {
  return <PronunciationTable />;
}
