import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireAuth } from "@/lib/auth/session";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await requireAuth();

  return <DashboardShell user={session.user}>{children}</DashboardShell>;
}
