import type { Metadata } from "next";
import { TeamView } from "@/components/team/team-view";
import { teamCopy } from "@/content/he/account";

export const metadata: Metadata = {
  title: teamCopy.meta.title,
  description: teamCopy.meta.description,
};

export default function TeamPage() {
  return <TeamView />;
}
