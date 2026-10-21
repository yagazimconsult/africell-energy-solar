"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { browserSupabase } from "@/lib/supabase-browser";
import { useAuth } from "@/components/account/AuthProvider";
import { inputClass } from "@/components/forms/shared";

/** Opened from the password-reset email: the link signs the customer in, then they pick a new password here. */
export function ResetPasswordForm() {
  const { ready, user } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [state, setState] = useState<{ kind: "idle" | "saving" | "done" } | { kind: "error"; message: string }>({ kind: "idle" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) return setState({ kind: "error", message: "Your password needs at least 8 characters." });
    if (password !== confirm) return setState({ kind: "error", message: "The two passwords don't match." });
    setState({ kind: "saving" });
    const { error } = await browserSupabase().auth.updateUser({ password });
    setState(error ? { kind: "error", message: "We couldn't update your password. The link may have expired: please request a new one." } : { kind: "done" });
  }

  const box = "mx-auto max-w-md rounded-[1.75rem] bg-white p-6 ring-1 ring-line sm:p-8";

  if (!ready) return <div className="grid place-items-center py-16 text-muted"><Loader2 className="size-6 animate-spin" aria-label="Loading" /></div>;

  if (!user) {
    return (
      <div className={`${box} text-center`}>
        <p className="font-display text-xl font-bold">This link has expired</p>
        <p className="mt-2 text-[15px] text-muted">Password links work once and only for a short time. Request a new one from the sign-in page.</p>
        <Link href="/account" className="btn btn-brand mt-6">Go to sign in</Link>
      </div>
    );
  }

  if (state.kind === "done") {
    return (
      <div className={`${box} text-center`} role="status">
        <CheckCircle2 className="mx-auto size-12 text-green-600" aria-hidden />
        <p className="mt-4 font-display text-xl font-bold">Password updated</p>
        <Link href="/account" className="btn btn-brand mt-6">Go to my account</Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`${box} grid gap-4`} noValidate>
      <p className="text-[14.5px] text-muted">Signed in as <b className="text-ink">{user.email}</b></p>
      <label className="text-[14px] font-semibold">
        New password
        <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
      </label>
      <label className="text-[14px] font-semibold">
        Repeat new password
        <input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} />
      </label>
      {state.kind === "error" && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-[14px] text-red-700">{state.message}</p>}
      <button type="submit" disabled={state.kind === "saving"} className="btn btn-brand w-full disabled:opacity-60">
        {state.kind === "saving" && <Loader2 className="size-4 animate-spin" aria-hidden />} Save new password
      </button>
    </form>
  );
}
