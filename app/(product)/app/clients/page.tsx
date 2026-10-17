import type { Metadata } from "next";
import { PageHeader } from "@/components/settings/kit";
import { ClientsView } from "@/components/team/client-workspaces";
import { clientsCopy } from "@/content/he/account";

export const metadata: Metadata = {
  title: clientsCopy.meta.title,
  description: clientsCopy.meta.description,
};

export default function ClientsPage() {
  return (
    <>
      <PageHeader title={clientsCopy.title} />
      <ClientsView />
    </>
  );
}
