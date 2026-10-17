import type { Metadata } from "next";
import { TemplatesGallery } from "@/components/library/templates-gallery";
import { templatesCopy } from "@/content/he/account";

export const metadata: Metadata = {
  title: templatesCopy.meta.title,
  description: templatesCopy.meta.description,
};

export default function TemplatesPage() {
  return <TemplatesGallery />;
}
