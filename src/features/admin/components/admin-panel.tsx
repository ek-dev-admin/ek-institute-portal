"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown, Clock3, ShieldCheck, UserRound, X, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AuthUser } from "@/types/api";

type AdminDocument = { id: string; documentType: string; confirmed: boolean; contentType?: string };
const statuses = ["pending", "active", "suspended", "rejected"];
const roles = ["user", "staff", "admin"];

export function AdminPanel() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [documents, setDocuments] = useState<Record<string, AdminDocument[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingStatus, setPendingStatus] = useState<{ user: AuthUser; value: string } | null>(null);

  async function loadUsers() {
    setLoading(true);
    const response = await fetch("/api/admin/users", { cache: "no-store" });
    const payload = await response.json().catch(() => null);
    if (!response.ok) setError(payload?.message ?? "Unable to load members");
    else setUsers(payload ?? []);
    setLoading(false);
  }

  useEffect(() => { void loadUsers(); }, []);

  async function applyUpdate(user: AuthUser, field: "status" | "role", value: string) {
    if (!user.cognitoSub) return;
    setSaving(`${user.cognitoSub}:${field}`);
    const response = await fetch(`/api/admin/users/${user.cognitoSub}/${field}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ [field]: value }) });
    const payload = await response.json().catch(() => null);
    if (!response.ok) setError(payload?.message ?? "Unable to update member");
    else setUsers((current) => current.map((item) => item.cognitoSub === user.cognitoSub ? { ...item, [field]: value } : item));
    setSaving(null);
  }

  function updateUser(user: AuthUser, field: "status" | "role", value: string) {
    if (field === "status") setPendingStatus({ user, value });
    else void applyUpdate(user, field, value);
  }

  async function toggleDocuments(user: AuthUser) {
    if (!user.cognitoSub) return;
    if (documents[user.cognitoSub]) { setDocuments((current) => { const next = { ...current }; delete next[user.cognitoSub!]; return next; }); return; }
    const response = await fetch(`/api/admin/users/${user.cognitoSub}/documents`, { cache: "no-store" });
    const payload = await response.json().catch(() => null);
    if (!response.ok) setError(payload?.message ?? "Unable to load documents");
    else setDocuments((current) => ({ ...current, [user.cognitoSub!]: payload ?? [] }));
  }

  async function downloadDocument(user: AuthUser, id: string) {
    const response = await fetch(`/api/admin/users/${user.cognitoSub}/documents/${id}/download-url`);
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.downloadUrl) setError(payload?.message ?? "Unable to create download link");
    else window.open(payload.downloadUrl, "_blank", "noopener,noreferrer");
  }

  const pending = users.filter((user) => !user.status || user.status === "pending").length;
  const verified = users.filter((user) => user.status === "active" || user.status === "approved").length;

  return <div className="space-y-8"><section><p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">Administration</p><div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="font-display text-4xl text-white sm:text-5xl">Member review</h1><p className="mt-3 text-sm text-white/55">Review profiles, files, and verification status.</p></div><Button variant="outline" onClick={() => void loadUsers()}>Refresh</Button></div></section><section className="grid gap-4 sm:grid-cols-3"><Stat label="Total members" value={String(users.length)} /><Stat label="Awaiting review" value={String(pending)} /><Stat label="Verified" value={String(verified)} /></section>{error && <div className="flex items-center justify-between rounded-xl border border-red-300/20 bg-red-300/10 px-4 py-3 text-sm text-red-200"><span>{error}</span><button onClick={() => setError(null)} aria-label="Dismiss"><X className="h-4 w-4" /></button></div>}<section className="overflow-hidden rounded-2xl border border-white/10 bg-panel">{loading ? <p className="p-8 text-sm text-white/45">Loading members...</p> : users.length === 0 ? <p className="p-8 text-sm text-white/45">No members found.</p> : <div className="divide-y divide-white/10">{users.map((user) => <MemberRow key={user.id} user={user} saving={saving} files={user.cognitoSub ? documents[user.cognitoSub] : undefined} onUpdate={updateUser} onToggleFiles={() => void toggleDocuments(user)} onDownload={downloadDocument} />)}</div>}</section>{pendingStatus && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-5 backdrop-blur-sm"><div role="dialog" aria-modal="true" className="w-full max-w-md rounded-2xl border border-white/10 bg-panel p-6 shadow-2xl"><div className="flex items-start gap-4"><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${pendingStatus.value === "rejected" || pendingStatus.value === "suspended" ? "bg-red-400/10 text-red-300" : "bg-gold/10 text-gold"}`}>{pendingStatus.value === "rejected" ? <XCircle className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}</div><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">Confirm status change</p><h2 className="mt-2 font-display text-2xl text-white">Set status to {pendingStatus.value}?</h2><p className="mt-3 text-sm leading-6 text-white/55">This change will be visible to the member in their profile.</p></div></div><div className="mt-7 flex justify-end gap-3"><Button variant="ghost" onClick={() => setPendingStatus(null)}>Cancel</Button><Button className={pendingStatus.value === "rejected" || pendingStatus.value === "suspended" ? "bg-red-500 text-white hover:bg-red-400" : ""} onClick={() => { const item = pendingStatus; setPendingStatus(null); void applyUpdate(item.user, "status", item.value); }}>{pendingStatus.value === "rejected" ? "Reject member" : "Confirm change"}</Button></div></div></div>}</div>;
}

function MemberRow({ user, saving, files, onUpdate, onToggleFiles, onDownload }: { user: AuthUser; saving: string | null; files?: AdminDocument[]; onUpdate: (user: AuthUser, field: "status" | "role", value: string) => void; onToggleFiles: () => void; onDownload: (user: AuthUser, id: string) => Promise<void> }) {
  const [avatar, setAvatar] = useState<string | null>(null);
  useEffect(() => { if (user.cognitoSub) fetch(`/api/admin/users/${user.cognitoSub}/avatar`, { cache: "no-store" }).then((response) => response.json()).then((payload) => setAvatar(payload?.downloadUrl ?? null)).catch(() => setAvatar(null)); }, [user.cognitoSub]);
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;
  const status = user.status ?? "pending";
  const verified = status === "active" || status === "approved";
  const tone = status === "rejected" || status === "suspended" ? "text-red-300" : verified ? "text-emerald-300" : "text-gold";
  const label = status === "rejected" ? "Rejected" : status === "suspended" ? "Suspended" : verified ? "Verified" : "Needs review";
  return <div><div role="button" tabIndex={0} onClick={onToggleFiles} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onToggleFiles(); }} className="flex cursor-pointer flex-col gap-5 px-5 py-5 transition hover:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between sm:px-7"><div className="flex min-w-0 items-center gap-4"><div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/40 bg-gold/10 font-display text-xl text-gold">{avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-5 w-5" />}</div><div className="min-w-0"><p className="truncate text-sm font-medium text-white">{name}</p><p className="truncate text-xs text-white/40">{user.email}{user.companyName ? ` · ${user.companyName}` : ""}</p><span className={`mt-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] ${tone}`}>{verified ? <Check className="h-3 w-3" /> : status === "pending" ? <Clock3 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}{label}</span></div></div><div className="flex flex-wrap gap-3" onClick={(event) => event.stopPropagation()}><Button variant="ghost" className="min-h-10 px-3 py-2 text-[10px]" onClick={onToggleFiles}>{files ? "Hide files" : "View files"}</Button><label className="relative"><span className="sr-only">Status</span><select value={status} disabled={saving === `${user.cognitoSub}:status`} onChange={(event) => onUpdate(user, "status", event.target.value)} className={`min-h-10 appearance-none rounded-lg border bg-black/20 px-3 pr-9 text-xs outline-none ${tone} border-white/15 focus:border-gold`}>{statuses.map((value) => <option key={value} value={value} className={value === "rejected" || value === "suspended" ? "bg-red-950 text-red-200" : "bg-panel"}>{value}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-white/40" /></label><label className="relative"><span className="sr-only">Role</span><select value={user.role ?? user.roles?.[0] ?? "user"} disabled={saving === `${user.cognitoSub}:role`} onChange={(event) => onUpdate(user, "role", event.target.value)} className="min-h-10 appearance-none rounded-lg border border-white/15 bg-black/20 px-3 pr-9 text-xs text-white outline-none focus:border-gold">{roles.map((role) => <option key={role} value={role} className="bg-panel">{role}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-white/40" /></label></div></div>{files && <div className="border-t border-white/10 bg-black/20 px-5 py-4 sm:px-7"><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">Member files</p>{files.length === 0 ? <p className="text-sm text-white/40">No files uploaded.</p> : <div className="space-y-2">{files.map((file) => <div key={file.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 px-3 py-3"><div><p className="text-sm text-white/80">{file.documentType.replaceAll("_", " ")}</p><p className="mt-1 text-xs text-white/35">{file.contentType ?? "File"} · {file.confirmed ? "Confirmed" : "Pending confirmation"}</p></div><Button variant="ghost" className="min-h-9 px-3 py-2 text-[10px]" onClick={() => void onDownload(user, file.id)}>Download</Button></div>)}</div>}</div>}</div>;
}

function Stat({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-white/10 bg-panel p-5"><p className="text-xs text-white/45">{label}</p><p className="mt-2 font-display text-3xl text-white">{value}</p></div>; }
