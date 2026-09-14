import type { Metadata } from "next";

import { ProfileView } from "@/features/profile/components/profile-view";
import { DocumentsPanel } from "@/features/profile/components/documents-panel";
import { requireAuth } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Profile | Executive Cooperation",
  description: "View your Executive Cooperation membership profile.",
};

export default async function ProfilePage() {
  const session = await requireAuth();

  return (
    <>
      <ProfileView user={session.user} />
      <DocumentsPanel />
    </>
  );
}
