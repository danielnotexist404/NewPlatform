"use client";
import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandKitsTab } from "./brand-kits-tab";
import { BusinessProfileForm } from "./business-profile-form";
import { brandCopy } from "@/content/he/account";

/** /app/brand — two tabs (Part 03 §12.1); `?tab=business` opens the business details. */
export function BrandView() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tab = params.get("tab") === "business" ? "business" : "kits";
  return (
    <Tabs
      value={tab}
      onValueChange={(v) => router.replace(v === "business" ? `${pathname}?tab=business` : pathname, { scroll: false })}
      className="flex flex-col gap-6"
    >
      <TabsList className="w-fit">
        <TabsTrigger value="kits">{brandCopy.tabs.kits}</TabsTrigger>
        <TabsTrigger value="business">{brandCopy.tabs.business}</TabsTrigger>
      </TabsList>
      <TabsContent value="kits"><BrandKitsTab /></TabsContent>
      <TabsContent value="business" className="max-w-[880px]"><BusinessProfileForm /></TabsContent>
    </Tabs>
  );
}
