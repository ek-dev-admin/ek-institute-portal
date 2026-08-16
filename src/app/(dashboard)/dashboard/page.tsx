import { requireAuth } from "@/lib/auth/session";

export default async function DashboardPage() {
  const session = await requireAuth();

  return (
    <div>
      <h1 className="font-display text-4xl">Dashboard</h1>
      <p className="mt-3 text-white/55">
        Welcome back, {session.user.firstName ?? session.user.email}.
      </p>
      <p className="mt-6 text-sm text-white/45">
        Connect additional feature modules here as you build them out.
      </p>
    </div>
  );
}
