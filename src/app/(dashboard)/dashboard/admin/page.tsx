import { redirect } from "next/navigation";

import { AdminPanel } from "@/features/admin/components/admin-panel";
import { requireAuth } from "@/lib/auth/session";

export default async function AdminPage() {
  const session = await requireAuth();
  const roles = session.user.roles ?? (session.user.role ? [session.user.role] : []);

  if (!roles.some((role) => role.toLowerCase() === "admin")) {
    redirect("/dashboard");
  }

  return <AdminPanel />;
}
