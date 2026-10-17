import type { Metadata } from "next";
import { MediaLibrary } from "@/components/library/media-library";
import { libraryCopy } from "@/content/he/account";

export const metadata: Metadata = {
  title: libraryCopy.meta.title,
  description: libraryCopy.meta.description,
};

export default function LibraryPage() {
  return <MediaLibrary />;
}
