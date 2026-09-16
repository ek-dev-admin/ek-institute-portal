"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Camera, CheckCircle2, Clock3, ShieldAlert, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AuthUser } from "@/types/api";

type ProfileViewProps = {
  user: AuthUser;
};

function displayName(user: AuthUser) {
  return [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;
}

function initials(user: AuthUser) {
  const first = user.firstName?.trim().charAt(0);
  const last = user.lastName?.trim().charAt(0);

  if (first || last) {
    return `${first ?? ""}${last ?? ""}`.toUpperCase();
  }

  return user.email.slice(0, 2).toUpperCase();
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-white/10 py-4 last:border-b-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
        {label}
      </p>
      <p className="mt-2 text-sm text-white/90">{value}</p>
    </div>
  );
}

function statusDetails(status?: string) {
  switch (status) {
    case "active":
    case "approved":
      return { label: "Verified member", tone: "text-emerald-300 border-emerald-300/20 bg-emerald-300/10", icon: CheckCircle2 };
    case "rejected":
    case "suspended":
      return { label: status === "suspended" ? "Account suspended" : "Verification rejected", tone: "text-red-300 border-red-300/20 bg-red-300/10", icon: status === "suspended" ? ShieldAlert : XCircle };
    default:
      return { label: "Pending verification", tone: "text-gold border-gold/25 bg-gold/10", icon: Clock3 };
  }
}

export function ProfileView({ user }: ProfileViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const name = displayName(user);
  const roles = user.roles?.length ? user.roles.join(", ") : "Member";
  const verification = statusDetails(user.status);
  const VerificationIcon = verification.icon;

  useEffect(() => {
    fetch("/api/profile/avatar", { cache: "no-store" }).then((response) => response.json()).then((payload) => { if (payload?.downloadUrl) setAvatar(payload.downloadUrl); else setAvatar(window.localStorage.getItem(`ek-avatar:${user.id}`)); }).catch(() => setAvatar(window.localStorage.getItem(`ek-avatar:${user.id}`)));
  }, [user.id]);

  async function chooseAvatar(file?: File) {
    if (!file || !file.type.startsWith("image/")) return;
    setAvatarBusy(true);
    try {
      const uploadResponse = await fetch("/api/profile/avatar/upload-url", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contentType: file.type }) });
      const upload = await uploadResponse.json();
      if (!uploadResponse.ok) throw new Error(upload?.message ?? "Unable to prepare photo upload");
      const s3Response = await fetch(upload.uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      if (!s3Response.ok) throw new Error("Unable to upload photo");
      const completeResponse = await fetch("/api/profile/avatar/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ avatarKey: upload.key }) });
      if (!completeResponse.ok) throw new Error("Unable to save photo");
      const avatarResponse = await fetch("/api/profile/avatar", { cache: "no-store" });
      const saved = await avatarResponse.json();
      setAvatar(saved.downloadUrl ?? null);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Unable to update photo");
    } finally {
      setAvatarBusy(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
        Account
      </p>
      <h1 className="mt-2 font-display text-4xl">Profile</h1>
      <p className="mt-3 text-white/55">
        Your membership details for Executive Cooperation.
      </p>

      <section className="mt-10 overflow-hidden rounded-2xl border border-gold/20 bg-black/40">
        <div className="flex items-center gap-5 border-b border-white/10 bg-white/[0.03] px-6 py-6 sm:px-8">
          <button type="button" disabled={avatarBusy} onClick={() => fileInputRef.current?.click()} className="group relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/40 bg-gold/10 font-display text-xl text-gold disabled:opacity-60" aria-label="Choose profile photo">
            {avatar ? <Image src={avatar} alt="" width={160} height={160} unoptimized className="h-full w-full object-cover" /> : initials(user)}
            <span className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition group-hover:opacity-100"><Camera className="h-5 w-5 text-white" /></span>
          </button>

          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => chooseAvatar(event.target.files?.[0])} />

          <div className="min-w-0">
            <h2 className="truncate font-display text-2xl">{name}</h2>
            <p className="mt-1 truncate text-sm text-white/50">{user.email}</p>
            <div className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${verification.tone}`}><VerificationIcon className="h-3.5 w-3.5" />{verification.label}</div>
          </div>
        </div>

        <div className="px-6 py-2 sm:px-8">
          <Field label="First name" value={user.firstName || "—"} />
          <Field label="Last name" value={user.lastName || "—"} />
          <Field label="Email" value={user.email} />
          <Field label="Role" value={roles} />
          <Field label="EK ID" value={user.id === "unknown" ? "—" : user.id} />
          <Field label="Member type" value={user.memberType ? user.memberType.charAt(0).toUpperCase() + user.memberType.slice(1) : "Buyer"} />
        </div>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/dashboard" variant="outline">
          Back to dashboard
        </Button>
        <Button href="/forgot-password" variant="ghost">
          Reset password
        </Button>
      </div>

      <p className="mt-8 text-sm text-white/40">
        Name and email are managed with your membership account. Use password
        reset if you need a new credential.
      </p>
    </div>
  );
}
