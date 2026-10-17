import type { Metadata } from "next";
import { PublishComposer } from "@/components/publish/publish-composer";
import { pageMeta } from "@/content/he/campaigns-app";

export const metadata: Metadata = { title: pageMeta.publishNew.title, description: pageMeta.publishNew.description };

export default function PublishNewPage() {
  return <PublishComposer />;
}
