"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Building2, Calculator, ClipboardList, Home, Loader2, LogOut, MailCheck, Trash2, UserRound } from "lucide-react";
import { browserSupabase } from "@/lib/supabase-browser";
import { safeNext, useAuth } from "@/components/account/AuthProvider";
import { inputClass } from "@/components/forms/shared";
import { useContact } from "@/components/ContactProvider";
import { waMessage } from "@/config/site";
import { WhatsAppIcon } from "@/components/icons";
import { formatDay, parseRequest, REQUEST_STATUS, type CustomerRequest, type SavedSizing } from "@/lib/account";

/** Turns Supabase's sign-in errors into plain language. */
function friendly(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "Email or password is incorrect.";
  if (m.includes("email not confirmed")) return "Please confirm your email first. Check your inbox (and spam folder) for our link.";
  if (m.includes("already registered") || m.includes("already been registered")) return "An account with this email already exists. Sign in instead, or reset your password.";
  if (m.includes("password should be") || m.includes("weak")) return "Please choose a stronger password: at least 8 characters, mixing letters and numbers.";
  if (m.includes("rate limit") || m.includes("too many")) return "Too many attempts. Please wait a few minutes and try again.";
  if (m.includes("fetch")) return "No internet connection. Please check your connection and try again.";
  return message;
}

export function AccountClient() {
  const { ready, user } = useAuth();
  if (!ready) {
    return (
      <div className="grid place-items-center py-24 text-muted">
        <Loader2 className="size-6 animate-spin" aria-label="Loading" />
      </div>
    );
  }
  return user ? <Dashboard /> : <AuthPanel />;
}

/* ─────────────────────────────── Sign in / register ─────────────────────────────── */

function AuthPanel() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "register" | "forgot">("signin");
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", password: "", company: "" });
  const [buyerType, setBuyerType] = useState<"retail" | "bulk">("retail");
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState<{ title: string; text: string } | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const next = () => safeNext(new URLSearchParams(window.location.search).get("next"));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const email = form.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email address.");
    const sb = browserSupabase();
    setBusy(true);
    try {
      if (mode === "forgot") {
        const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/account/reset-password` });
        if (error) throw error;
        setNotice({ title: "Check your email", text: `If an account exists for ${email}, we've sent a link to choose a new password.` });
        return;
      }
      if (form.password.length < 8) return setError("Your password needs at least 8 characters.");
      if (mode === "signin") {
        const { error } = await sb.auth.signInWithPassword({ email, password: form.password });
        if (error) throw error;
        const to = next();
        if (to) router.replace(to);
        return;
      }
      // Register
      if (!form.fullName.trim()) return setError("Please enter your full name.");
      if (form.phone && !/^[+0-9][0-9 -]{6,39}$/.test(form.phone.trim())) return setError("Please check your phone number.");
      if (!agree) return setError("Please accept the Privacy Policy to create an account.");
      const back = next();
      const { data, error } = await sb.auth.signUp({
        email,
        password: form.password,
        options: {
          emailRedirectTo: `${window.location.origin}${back ?? "/account"}`,
          data: { full_name: form.fullName.trim(), phone: form.phone.trim(), company_name: buyerType === "bulk" ? form.company.trim() : "", buyer_type: buyerType },
        },
      });
      if (error) throw error;
      if (data.session) {
        if (back) router.replace(back);
      } else {
        setNotice({ title: "Confirm your email", text: `We've sent a confirmation link to ${email}. Open it to activate your account, then sign in.` });
      }
    } catch (err) {
      setError(friendly(err instanceof Error ? err.message : "Something went wrong."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
      <div className="sun-glow relative overflow-hidden rounded-[1.75rem] p-8 text-white">
        <div className="grid-lines absolute inset-0" aria-hidden />
        <div className="relative">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-sun">Why create an account</p>
          <h2 className="mt-3 font-display text-2xl font-extrabold leading-snug">Your solar plans and orders, in one place.</h2>
          <ul className="mt-6 space-y-4 text-[14.5px] text-white/80">
            <Benefit icon={Calculator} title="Save sizing calculations">Keep each property&apos;s calculation and reopen it any time, on any device.</Benefit>
            <Benefit icon={ClipboardList} title="Follow your requests">See every quote and service request with its reference and status.</Benefit>
            <Benefit icon={Building2} title="Built for bulk buyers">Installers, resellers and projects can re-order faster with their details saved.</Benefit>
            <Benefit icon={UserRound} title="Faster forms">Your name and phone are filled in for you.</Benefit>
          </ul>
          <p className="mt-6 text-[13px] text-white/60">No payment details are ever stored. You only pay against the invoice our team sends you.</p>
        </div>
      </div>

      <div className="rounded-[1.75rem] bg-white p-6 ring-1 ring-line sm:p-8">
        {notice ? (
          <div role="status" className="text-center">
            <MailCheck className="mx-auto size-12 text-brand" aria-hidden />
            <p className="mt-4 font-display text-xl font-bold">{notice.title}</p>
            <p className="mt-2 text-[15px] text-muted">{notice.text}</p>
            <button type="button" onClick={() => { setNotice(null); setMode("signin"); }} className="btn btn-brand mt-6">
              Back to sign in
            </button>
          </div>
        ) : (
          <>
            {mode !== "forgot" && (
              <div role="tablist" className="grid grid-cols-2 rounded-full bg-mist p-1">
                {(["signin", "register"] as const).map((m) => (
                  <button key={m} role="tab" aria-selected={mode === m} type="button" onClick={() => { setMode(m); setError(""); }} className={`rounded-full py-2.5 text-[14.5px] font-semibold transition-colors ${mode === m ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"}`}>
                    {m === "signin" ? "Sign in" : "Create account"}
                  </button>
                ))}
              </div>
            )}
            {mode === "forgot" && (
              <div>
                <h2 className="font-display text-xl font-bold">Reset your password</h2>
                <p className="mt-1 text-[14.5px] text-muted">Enter your email and we&apos;ll send you a link to choose a new password.</p>
              </div>
            )}

            <form onSubmit={submit} className="mt-6 grid gap-4" noValidate>
              {mode === "register" && (
                <>
                  <fieldset>
                    <legend className="text-[14px] font-semibold">I am buying for</legend>
                    <div className="mt-2 grid gap-3 sm:grid-cols-2">
                      {([
                        { v: "retail", icon: Home, label: "Home, shop or office", hint: "Small purchases" },
                        { v: "bulk", icon: Building2, label: "Business / bulk", hint: "Installers, resellers, projects" },
                      ] as const).map((o) => (
                        <label key={o.v} className={`flex cursor-pointer items-start gap-3 rounded-xl p-4 ring-1 transition-shadow ${buyerType === o.v ? "ring-2 ring-brand" : "ring-line hover:ring-slate-300"}`}>
                          <input type="radio" name="buyerType" checked={buyerType === o.v} onChange={() => setBuyerType(o.v)} className="mt-1 accent-[var(--color-brand)]" />
                          <span>
                            <span className="flex items-center gap-1.5 text-[14.5px] font-semibold"><o.icon className="size-4 text-brand" aria-hidden />{o.label}</span>
                            <span className="block text-[13px] text-muted">{o.hint}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <label className="text-[14px] font-semibold">
                    Full name <span className="text-sun-2">*</span>
                    <input autoComplete="name" value={form.fullName} onChange={set("fullName")} className={inputClass} />
                  </label>
                  {buyerType === "bulk" && (
                    <label className="text-[14px] font-semibold">
                      Company name <span className="font-normal text-muted">(optional)</span>
                      <input autoComplete="organization" value={form.company} onChange={set("company")} className={inputClass} />
                    </label>
                  )}
                  <label className="text-[14px] font-semibold">
                    Phone / WhatsApp <span className="font-normal text-muted">(optional)</span>
                    <input type="tel" autoComplete="tel" placeholder="e.g. 0803 123 4567" value={form.phone} onChange={set("phone")} className={inputClass} />
                  </label>
                </>
              )}
              <label className="text-[14px] font-semibold">
                Email <span className="text-sun-2">*</span>
                <input type="email" autoComplete="email" value={form.email} onChange={set("email")} className={inputClass} />
              </label>
              {mode !== "forgot" && (
                <label className="text-[14px] font-semibold">
                  <span className="flex items-center justify-between">
                    <span>Password <span className="text-sun-2">*</span></span>
                    {mode === "signin" && (
                      <button type="button" onClick={() => { setMode("forgot"); setError(""); }} className="text-[13px] font-semibold text-brand hover:underline">
                        Forgot password?
                      </button>
                    )}
                  </span>
                  <input type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} value={form.password} onChange={set("password")} className={inputClass} />
                  {mode === "register" && <span className="mt-1 block text-[12.5px] font-normal text-muted">At least 8 characters.</span>}
                </label>
              )}
              {mode === "register" && (
                <label className="flex items-start gap-2.5 text-[14px] text-ink/80">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 accent-[var(--color-brand)]" />
                  <span>
                    I agree to the{" "}
                    <Link href="/privacy" className="font-semibold text-brand underline" target="_blank">
                      Privacy Policy
                    </Link>{" "}
                    and to Africell Energy Solar Aba keeping my account details.
                  </span>
                </label>
              )}

              {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-[14px] text-red-700">{error}</p>}

              <button type="submit" disabled={busy} className="btn btn-brand w-full disabled:opacity-60">
                {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
                {mode === "signin" ? "Sign in" : mode === "register" ? "Create my account" : "Send reset link"}
              </button>
              {mode === "forgot" && (
                <button type="button" onClick={() => { setMode("signin"); setError(""); }} className="text-[14px] font-semibold text-muted hover:text-ink">
                  ← Back to sign in
                </button>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function Benefit({ icon: Icon, title, children }: { icon: typeof Home; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15">
        <Icon className="size-[18px] text-sun" aria-hidden />
      </span>
      <span>
        <span className="block font-semibold text-white">{title}</span>
        {children}
      </span>
    </li>
  );
}

/* ─────────────────────────────── Dashboard ─────────────────────────────── */

type Tab = "calculations" | "requests" | "details";

function Dashboard() {
  const { user, profile, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("calculations");
  const name = profile?.full_name?.split(" ")[0];

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tab");
    if (t === "requests" || t === "details" || t === "calculations") setTab(t);
  }, []);

  const tabs: { id: Tab; label: string; icon: typeof Home }[] = [
    { id: "calculations", label: "Saved calculations", icon: Calculator },
    { id: "requests", label: "Quotes & requests", icon: ClipboardList },
    { id: "details", label: "My details", icon: UserRound },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold">Welcome{name ? `, ${name}` : ""}</h2>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-[14.5px] text-muted">
            {user?.email}
            <span className={`rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${profile?.buyer_type === "bulk" ? "bg-sun-50 text-amber-800" : "bg-brand-50 text-brand"}`}>
              {profile?.buyer_type === "bulk" ? "Business / bulk buyer" : "Home & small business"}
            </span>
            {profile?.company_name && <span className="text-ink/80">· {profile.company_name}</span>}
          </p>
        </div>
        <button type="button" onClick={signOut} className="btn !bg-mist !py-2.5 !text-[14px] text-ink hover:!bg-line">
          <LogOut className="size-4" aria-hidden /> Sign out
        </button>
      </div>

      <div role="tablist" className="no-scrollbar mt-8 flex gap-1 overflow-x-auto border-b border-line">
        {tabs.map((t) => (
          <button key={t.id} role="tab" type="button" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3.5 text-[14.5px] font-semibold ${tab === t.id ? "border-sun-2 text-ink" : "border-transparent text-muted hover:text-ink"}`}>
            <t.icon className="size-4" aria-hidden /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "calculations" && <Calculations />}
        {tab === "requests" && <Requests />}
        {tab === "details" && <Details />}
      </div>
    </div>
  );
}

function LoadState({ error, retry }: { error: string; retry: () => void }) {
  return error ? (
    <div className="rounded-2xl bg-red-50 p-6 text-[14.5px] text-red-700">
      {error}{" "}
      <button type="button" onClick={retry} className="font-semibold underline">
        Try again
      </button>
    </div>
  ) : (
    <div className="grid place-items-center py-16 text-muted">
      <Loader2 className="size-6 animate-spin" aria-label="Loading" />
    </div>
  );
}

function Calculations() {
  const [rows, setRows] = useState<SavedSizing[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    setRows(null);
    const { data, error } = await browserSupabase().from("saved_sizings").select("id, title, appliances, battery_share, load_kw, daily_kwh, recommendation, created_at").order("created_at", { ascending: false });
    if (error) setError("We couldn't load your saved calculations.");
    else setRows(data as SavedSizing[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(row: SavedSizing) {
    if (!window.confirm(`Delete "${row.title}"? This can't be undone.`)) return;
    const { error } = await browserSupabase().from("saved_sizings").delete().eq("id", row.id);
    if (error) window.alert("We couldn't delete it. Please try again.");
    else setRows((r) => r?.filter((x) => x.id !== row.id) ?? null);
  }

  if (!rows) return <LoadState error={error} retry={load} />;
  if (rows.length === 0) {
    return (
      <Empty icon={Calculator} title="No saved calculations yet" text="Use the sizing guide to work out the inverter, battery and panels you need, then tap “Save to my account”.">
        <Link href="/support/sizing-guide" className="btn btn-sun mt-6">
          Open the sizing guide
        </Link>
      </Empty>
    );
  }
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {rows.map((r) => (
        <article key={r.id} className="flex flex-col rounded-2xl bg-white p-6 ring-1 ring-line">
          <p className="text-[12.5px] text-muted">Saved {formatDay(r.created_at)}</p>
          <h3 className="mt-1 font-display text-lg font-bold">{r.title}</h3>
          <dl className="mt-4 grid grid-cols-2 gap-2.5">
            <Figure label="Running load" value={`${Number(r.load_kw).toFixed(2)} kW`} />
            <Figure label="Daily energy" value={`${Number(r.daily_kwh).toFixed(1)} kWh`} />
          </dl>
          <ul className="mt-4 space-y-1.5 text-[14px] text-ink/80">
            {r.recommendation.inverter && <li><b className="font-semibold text-ink">Inverter:</b> {r.recommendation.inverter}</li>}
            {r.recommendation.battery && <li><b className="font-semibold text-ink">Battery:</b> {r.recommendation.battery}</li>}
            {r.recommendation.panels && <li><b className="font-semibold text-ink">Panels:</b> {r.recommendation.panels}</li>}
          </ul>
          <div className="mt-auto flex items-center gap-2 pt-6">
            <Link href={`/support/sizing-guide?load=${r.id}`} className="btn btn-brand flex-1 !py-2.5 !text-[14px]">
              Open &amp; get a quote
            </Link>
            <button type="button" aria-label={`Delete ${r.title}`} onClick={() => remove(r)} className="grid size-11 place-items-center rounded-full text-muted ring-1 ring-line hover:bg-red-50 hover:text-red-600">
              <Trash2 className="size-4" aria-hidden />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-mist px-3 py-2.5">
      <dt className="text-[11.5px] font-semibold uppercase tracking-wider text-muted">{label}</dt>
      <dd className="font-display text-[17px] font-extrabold">{value}</dd>
    </div>
  );
}

function Requests() {
  const { user } = useAuth();
  const { whatsappLink } = useContact();
  const [rows, setRows] = useState<CustomerRequest[] | null>(null);
  const [error, setError] = useState("");
  const userId = user?.id;

  const load = useCallback(async () => {
    if (!userId) return;
    setError("");
    setRows(null);
    const { data, error } = await browserSupabase().from("enquiries").select("id, kind, message, items, status, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(100);
    if (error) setError("We couldn't load your requests.");
    else setRows(data as CustomerRequest[]);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  if (!rows) return <LoadState error={error} retry={load} />;
  if (rows.length === 0) {
    return (
      <Empty icon={ClipboardList} title="No requests yet" text="Quotes and service requests you send while signed in will appear here with their reference and progress.">
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/quote" className="btn btn-sun">Request a quote</Link>
          <Link href="/support/maintenance" className="btn !bg-mist text-ink">Request maintenance</Link>
        </div>
      </Empty>
    );
  }
  return (
    <ul className="space-y-4">
      {rows.map((r) => {
        const p = parseRequest(r.message);
        const status = REQUEST_STATUS[r.status];
        return (
          <li key={r.id} className="rounded-2xl bg-white p-6 ring-1 ring-line">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[12.5px] text-muted">{formatDay(r.created_at)}</p>
                <h3 className="mt-0.5 font-display text-lg font-bold">{p.label}</h3>
                {p.reference && (
                  <p className="mt-1 text-[13.5px] text-muted">
                    Reference <span className="rounded-md bg-mist px-2 py-0.5 font-mono font-bold text-ink">{p.reference}</span>
                  </p>
                )}
              </div>
              <span className={`rounded-full px-3 py-1 text-[12.5px] font-semibold ${status.tone}`}>{status.label}</span>
            </div>
            {r.items.length > 0 && (
              <ul className="mt-4 space-y-1 text-[14px] text-ink/80">
                {r.items.map((i, n) => (
                  <li key={n}>
                    {i.qty} × {i.name}
                    {i.model ? <span className="text-muted"> ({i.model})</span> : null}
                  </li>
                ))}
              </ul>
            )}
            {p.details.length > 0 && (
              <dl className="mt-4 grid gap-x-6 gap-y-1 text-[13.5px] sm:grid-cols-2">
                {p.details.filter(([k]) => k !== "Sizing estimate").map(([k, v]) => (
                  <div key={k}>
                    <dt className="inline font-semibold">{k}: </dt>
                    <dd className="inline text-ink/75">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
            <a
              href={whatsappLink(waMessage(p.topic, `I'm following up on my request${p.reference ? ` (ref ${p.reference})` : ""} from ${formatDay(r.created_at)}.`))}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-[#128c4a] hover:underline"
            >
              <WhatsAppIcon className="size-4" /> Follow up on WhatsApp
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function Details() {
  const { user, profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({ full_name: "", phone: "", company_name: "", city: "", buyer_type: "retail" as "retail" | "bulk" });
  const [state, setState] = useState<{ kind: "idle" | "saving" | "saved" } | { kind: "error"; message: string }>({ kind: "idle" });
  const [password, setPassword] = useState("");
  const [pwState, setPwState] = useState<{ kind: "idle" | "saving" | "saved" } | { kind: "error"; message: string }>({ kind: "idle" });

  useEffect(() => {
    if (profile) setForm({ full_name: profile.full_name ?? "", phone: profile.phone ?? "", company_name: profile.company_name ?? "", city: profile.city ?? "", buyer_type: profile.buyer_type });
  }, [profile]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ kind: "idle" });
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!form.full_name.trim()) return setState({ kind: "error", message: "Please enter your full name." });
    if (form.phone.trim() && !/^[+0-9][0-9 -]{6,39}$/.test(form.phone.trim())) return setState({ kind: "error", message: "Please check your phone number." });
    setState({ kind: "saving" });
    const { error } = await browserSupabase()
      .from("customer_profiles")
      .update({ full_name: form.full_name.trim(), phone: form.phone.trim() || null, company_name: form.company_name.trim() || null, city: form.city.trim() || null, buyer_type: form.buyer_type })
      .eq("id", user.id);
    if (error) return setState({ kind: "error", message: "We couldn't save your details. Please try again." });
    await refreshProfile();
    setState({ kind: "saved" });
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) return setPwState({ kind: "error", message: "Your password needs at least 8 characters." });
    setPwState({ kind: "saving" });
    const { error } = await browserSupabase().auth.updateUser({ password });
    if (error) return setPwState({ kind: "error", message: friendly(error.message) });
    setPassword("");
    setPwState({ kind: "saved" });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <form onSubmit={save} className="grid gap-4 rounded-2xl bg-white p-6 ring-1 ring-line sm:grid-cols-2 sm:p-8" noValidate>
        <h3 className="font-display text-lg font-bold sm:col-span-2">Contact details</h3>
        <p className="-mt-2 text-[14px] text-muted sm:col-span-2">Used to fill in your quote and service forms automatically.</p>
        <label className="text-[14px] font-semibold">
          Full name
          <input autoComplete="name" value={form.full_name} onChange={set("full_name")} className={inputClass} />
        </label>
        <label className="text-[14px] font-semibold">
          Phone / WhatsApp
          <input type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} className={inputClass} />
        </label>
        <label className="text-[14px] font-semibold">
          Company <span className="font-normal text-muted">(optional)</span>
          <input autoComplete="organization" value={form.company_name} onChange={set("company_name")} className={inputClass} />
        </label>
        <label className="text-[14px] font-semibold">
          Town / area
          <input autoComplete="address-level2" placeholder="e.g. Ogbor Hill, Aba" value={form.city} onChange={set("city")} className={inputClass} />
        </label>
        <fieldset className="sm:col-span-2">
          <legend className="text-[14px] font-semibold">I usually buy</legend>
          <div className="mt-2 flex flex-wrap gap-3">
            {([["retail", "For a home, shop or office"], ["bulk", "In bulk (business, installer, reseller)"]] as const).map(([v, label]) => (
              <label key={v} className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-[14px] ring-1 ${form.buyer_type === v ? "font-semibold ring-2 ring-brand" : "ring-line"}`}>
                <input type="radio" name="buyer_type" checked={form.buyer_type === v} onChange={() => { setState({ kind: "idle" }); setForm((f) => ({ ...f, buyer_type: v })); }} className="accent-[var(--color-brand)]" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <button type="submit" disabled={state.kind === "saving"} className="btn btn-brand disabled:opacity-60">
            {state.kind === "saving" && <Loader2 className="size-4 animate-spin" aria-hidden />} Save details
          </button>
          {state.kind === "saved" && <p role="status" className="text-[14px] font-semibold text-green-700">Saved ✓</p>}
          {state.kind === "error" && <p role="alert" className="text-[14px] text-red-700">{state.message}</p>}
        </div>
      </form>

      <div className="space-y-6">
        <form onSubmit={changePassword} className="rounded-2xl bg-white p-6 ring-1 ring-line sm:p-8" noValidate>
          <h3 className="font-display text-lg font-bold">Change password</h3>
          <label className="mt-4 block text-[14px] font-semibold">
            New password
            <input type="password" autoComplete="new-password" value={password} onChange={(e) => { setPwState({ kind: "idle" }); setPassword(e.target.value); }} className={inputClass} />
          </label>
          <button type="submit" disabled={pwState.kind === "saving"} className="btn btn-brand mt-4 disabled:opacity-60">
            {pwState.kind === "saving" && <Loader2 className="size-4 animate-spin" aria-hidden />} Update password
          </button>
          {pwState.kind === "saved" && <p role="status" className="mt-3 text-[14px] font-semibold text-green-700">Password updated ✓</p>}
          {pwState.kind === "error" && <p role="alert" className="mt-3 text-[14px] text-red-700">{pwState.message}</p>}
        </form>
        <div className="rounded-2xl bg-mist p-6 text-[14px] leading-relaxed text-ink/80">
          <p className="font-semibold text-ink">Delete my account</p>
          <p className="mt-1">
            You can ask us to delete your account and data at any time. See our{" "}
            <Link href="/privacy" className="font-semibold text-brand underline">
              Privacy Policy
            </Link>{" "}
            or message us on WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}

function Empty({ icon: Icon, title, text, children }: { icon: typeof Home; title: string; text: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-mist px-6 py-14 text-center">
      <Icon className="mx-auto size-10 text-brand" aria-hidden />
      <p className="mt-4 font-display text-lg font-bold">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-[14.5px] text-muted">{text}</p>
      {children}
    </div>
  );
}
