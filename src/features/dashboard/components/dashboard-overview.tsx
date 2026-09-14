"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, CheckCircle2, CircleUserRound, FileCheck2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { listDocuments } from "@/features/profile/services/documents.api";
import type { AuthUser, UserDocument } from "@/types/api";

type DashboardOverviewProps = { user: AuthUser };

const documentLabels: Record<UserDocument["documentType"], string> = {
  id_passport: "Identity",
  proof_of_address: "Address",
  business_registration: "Business",
  other: "Other",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(value));
}

function getProfileProgress(user: AuthUser) {
  return [user.firstName, user.lastName, user.email, user.role ?? user.roles?.[0], user.status].filter(Boolean).length;
}

export function DashboardOverview({ user }: DashboardOverviewProps) {
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listDocuments().then(setDocuments).catch(() => setDocuments([])).finally(() => setLoading(false));
  }, []);

  const confirmedCount = documents.filter((document) => document.confirmed).length;
  const profileProgress = Math.round((getProfileProgress(user) / 5) * 100);
  const onboardingProgress = Math.min(100, Math.round(((profileProgress + (confirmedCount > 0 ? 25 : 0)) / 125) * 100));
  const recentDocuments = documents.slice(0, 4);

  const activityBars = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, index) => {
      const month = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      const count = documents.filter((document) => {
        const date = new Date(document.createdAt);
        return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth();
      }).length;
      return { label: month.toLocaleDateString("en", { month: "short" }), count };
    });
  }, [documents]);

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">Member overview</p>
          <h1 className="mt-3 font-display text-4xl text-white sm:text-5xl">Welcome back, {user.firstName ?? "member"}.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">Your Executive Cooperation workspace at a glance. Keep your profile and verification documents ready for review.</p>
        </div>
        <Button href="/dashboard/profile" variant="outline">Open profile <ArrowUpRight className="ml-2 h-4 w-4" /></Button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={<CircleUserRound />} label="Profile completion" value={`${profileProgress}%`} detail="Keep your details current" />
        <MetricCard icon={<FileCheck2 />} label="Documents" value={loading ? "—" : String(documents.length)} detail={`${confirmedCount} confirmed`} />
        <MetricCard icon={<ShieldCheck />} label="Account status" value={user.status ?? "Active"} detail={user.role ?? user.roles?.[0] ?? "Member access"} />
        <MetricCard icon={<CheckCircle2 />} label="Verification" value={documents.length ? `${Math.round((confirmedCount / documents.length) * 100)}%` : "0%"} detail="Document confirmation" />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
        <div className="rounded-2xl border border-white/10 bg-panel p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Activity</p><h2 className="mt-2 font-display text-2xl text-white">Verification activity</h2></div><span className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-gold">Last 6 months</span></div>
          <div className="mt-8 flex h-52 items-end gap-3 border-b border-l border-white/10 px-3 pb-0 pt-4 sm:gap-6">
            {activityBars.map((bar) => { const height = bar.count ? Math.max(18, (bar.count / Math.max(...activityBars.map((item) => item.count), 1)) * 100) : 5; return <div key={bar.label} className="flex h-full flex-1 flex-col items-center justify-end gap-3"><div className="w-full max-w-10 rounded-t-md bg-gradient-to-t from-gold/35 to-gold" style={{ height: `${height}%` }} title={`${bar.count} document${bar.count === 1 ? "" : "s"}`} /><span className="text-[10px] uppercase tracking-wider text-white/35">{bar.label}</span></div>; })}
          </div>
          <p className="mt-5 text-xs text-white/40">Uploads and confirmations are shown from your account activity.</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-panel p-6 sm:p-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Next milestone</p><h2 className="mt-2 font-display text-2xl text-white">Complete your profile</h2>
          <div className="mt-7 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gold" style={{ width: `${onboardingProgress}%` }} /></div><div className="mt-3 flex justify-between text-xs text-white/45"><span>Onboarding progress</span><span>{onboardingProgress}%</span></div>
          <p className="mt-7 text-sm leading-6 text-white/55">A complete profile and verified documents help us prepare your membership review.</p><Button href="/dashboard/profile" className="mt-6 w-full">Continue setup</Button>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-panel p-6 sm:p-7">
        <div className="flex items-end justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Recent activity</p><h2 className="mt-2 font-display text-2xl text-white">Your documents</h2></div><Button href="/dashboard/profile" variant="ghost">Manage documents <ArrowUpRight className="ml-2 h-4 w-4" /></Button></div>
        {recentDocuments.length === 0 ? <p className="mt-8 border-t border-white/10 pt-6 text-sm text-white/45">No documents uploaded yet. Add your first document from your profile.</p> : <div className="mt-6 divide-y divide-white/10 border-t border-white/10">{recentDocuments.map((document) => <div key={document.id} className="flex items-center justify-between gap-4 py-4"><div><p className="text-sm text-white/85">{documentLabels[document.documentType]}</p><p className="mt-1 text-xs text-white/40">Uploaded {formatDate(document.createdAt)}</p></div><span className={document.confirmed ? "text-xs text-emerald-300" : "text-xs text-gold"}>{document.confirmed ? "Confirmed" : "Awaiting confirmation"}</span></div>)}</div>}
      </section>
    </div>
  );
}

function MetricCard({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return <div className="rounded-2xl border border-white/10 bg-panel p-5"><div className="flex items-center justify-between"><span className="text-gold">{icon}</span><span className="text-[10px] uppercase tracking-[0.14em] text-white/35">Account</span></div><p className="mt-6 text-xs text-white/45">{label}</p><p className="mt-1 truncate font-display text-2xl text-white">{value}</p><p className="mt-2 truncate text-xs text-white/35">{detail}</p></div>;
}
