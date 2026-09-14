import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { requireAuth } from "@/lib/auth/session";

export default async function DashboardPage() {
  const session = await requireAuth();

  return <DashboardOverview user={session.user} />;
}
