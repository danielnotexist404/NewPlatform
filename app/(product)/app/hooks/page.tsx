import type { Metadata } from "next";
import { Suspense } from "react";
import { HooksLibrary } from "@/components/library/hooks-library";
import { hooksCopy } from "@/content/he/account";

export const metadata: Metadata = {
  title: hooksCopy.meta.title,
  description: hooksCopy.meta.description,
};

export default function AppHooksPage() {
  return (
    <Suspense>
      <HooksLibrary />
    </Suspense>
  );
}
