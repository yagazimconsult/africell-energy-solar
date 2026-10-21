"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bookmark, FolderOpen, Info, Loader2, Minus, Plus, RotateCcw } from "lucide-react";
import { useAuth } from "@/components/account/AuthProvider";
import { browserSupabase } from "@/lib/supabase-browser";
import { useContact } from "@/components/ContactProvider";
import { waMessage } from "@/config/site";
import { WhatsAppIcon } from "@/components/icons";
import { useQuote } from "@/components/quote/QuoteProvider";

interface Appliance {
  id: string;
  name: string;
  watts: number;
  hours: number;
  motor?: boolean;
}

// Typical ratings; real appliances vary. Hours are effective running hours per day.
const APPLIANCES: Appliance[] = [
  { id: "bulb", name: "LED bulb", watts: 10, hours: 6 },
  { id: "fan", name: "Ceiling fan", watts: 70, hours: 8 },
  { id: "standfan", name: "Standing fan", watts: 55, hours: 8 },
  { id: "tv", name: "LED TV (32–43\")", watts: 100, hours: 6 },
  { id: "decoder", name: "Decoder / Wi-Fi router", watts: 20, hours: 8 },
  { id: "laptop", name: "Laptop", watts: 65, hours: 6 },
  { id: "desktop", name: "Desktop computer", watts: 200, hours: 6 },
  { id: "charger", name: "Phone charger", watts: 10, hours: 3 },
  { id: "fridge", name: "Refrigerator", watts: 150, hours: 10, motor: true },
  { id: "freezer", name: "Chest freezer", watts: 200, hours: 12, motor: true },
  { id: "washer", name: "Washing machine", watts: 500, hours: 1, motor: true },
  { id: "pump", name: "Water pump (1HP)", watts: 750, hours: 0.5, motor: true },
  { id: "ac1", name: "Air conditioner (1HP)", watts: 900, hours: 6, motor: true },
  { id: "ac15", name: "Air conditioner (1.5HP)", watts: 1300, hours: 6, motor: true },
  { id: "microwave", name: "Microwave", watts: 1200, hours: 0.25 },
  { id: "iron", name: "Electric iron", watts: 1200, hours: 0.5 },
  { id: "sound", name: "Sound system", watts: 150, hours: 3 },
  { id: "pos", name: "POS / printer", watts: 50, hours: 8 },
];

const DEFAULTS: Record<string, number> = { bulb: 8, fan: 3, tv: 1, decoder: 1, laptop: 1, charger: 3, fridge: 1 };

/** A calculation waiting to be saved while the customer signs in. */
const PENDING_KEY = "africell-pending-sizing-v1";

/** Keeps only known appliances with sensible quantities (data comes from storage or the database). */
function cleanQty(raw: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (raw && typeof raw === "object") {
    for (const a of APPLIANCES) {
      const n = Number((raw as Record<string, unknown>)[a.id]);
      if (Number.isFinite(n) && n > 0) out[a.id] = Math.min(50, Math.round(n));
    }
  }
  return out;
}

const clampShare = (v: unknown) => Math.max(30, Math.min(100, Number(v) || 60));
const defaultTitle = () => `My solar system, ${new Date().toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}`;

type SaveState = { kind: "closed" | "open" | "saving" } | { kind: "saved"; title: string } | { kind: "error"; message: string };

/** A catalogue product the calculator can recommend; rating is kVA, kWh or W. Supplied from Supabase by the page. */
export interface SizingOption {
  key: string;
  name: string;
  model?: string;
  href: string;
  image: string;
  rating: number;
}

const PEAK_SUN_HOURS = 4.5; // South-East Nigeria, conservative annual average
const SYSTEM_LOSSES = 0.75; // heat, dust, wiring, conversion
const POWER_FACTOR = 0.8; // kW per kVA
const HEADROOM = 1.25;
const DOD = 0.9;

export function SizingCalculator({ inverters, batteries, panel }: { inverters: SizingOption[]; batteries: SizingOption[]; panel: SizingOption }) {
  const { whatsappLink } = useContact();
  const [qty, setQty] = useState<Record<string, number>>(DEFAULTS);
  const [batteryShare, setBatteryShare] = useState(60);
  const { add, setSizing } = useQuote();
  const [added, setAdded] = useState(false);
  const { ready, user } = useAuth();
  const router = useRouter();
  const [save, setSave] = useState<SaveState>({ kind: "closed" });
  const [title, setTitle] = useState("");
  const [openedTitle, setOpenedTitle] = useState<string | null>(null);
  const restored = useRef(false);

  // Reopen a saved calculation (?load=id from My Account), or finish saving one that was waiting
  // for the customer to sign in.
  useEffect(() => {
    if (!ready || restored.current) return;
    restored.current = true;
    const loadId = new URLSearchParams(window.location.search).get("load");
    if (loadId && user) {
      browserSupabase()
        .from("saved_sizings")
        .select("title, appliances, battery_share")
        .eq("id", loadId)
        .maybeSingle()
        .then(({ data }) => {
          if (!data) return;
          setQty(cleanQty(data.appliances));
          setBatteryShare(clampShare(data.battery_share));
          setOpenedTitle(data.title);
          setTitle(data.title);
        });
      return;
    }
    let pending: { qty?: unknown; batteryShare?: number } | null = null;
    try {
      pending = JSON.parse(localStorage.getItem(PENDING_KEY) ?? "null");
      localStorage.removeItem(PENDING_KEY);
    } catch {}
    if (pending?.qty) {
      setQty(cleanQty(pending.qty));
      setBatteryShare(clampShare(pending.batteryShare));
      if (user) {
        setTitle(defaultTitle());
        setSave({ kind: "open" });
      }
    }
  }, [ready, user]);

  const change = (id: string, d: number) => {
    setAdded(false);
    if (save.kind === "saved") setSave({ kind: "closed" });
    setQty((q) => ({ ...q, [id]: Math.max(0, Math.min(50, (q[id] ?? 0) + d)) }));
  };

  const r = useMemo(() => {
    const selected = APPLIANCES.filter((a) => (qty[a.id] ?? 0) > 0);
    const loadW = selected.reduce((s, a) => s + a.watts * qty[a.id], 0);
    const dailyWh = selected.reduce((s, a) => s + a.watts * a.hours * qty[a.id], 0);
    const kvaNeeded = (loadW * HEADROOM) / POWER_FACTOR / 1000;
    const inverter = inverters.find((i) => i.rating >= kvaNeeded);
    const batteryWh = (dailyWh * (batteryShare / 100)) / DOD;
    const largest = batteries[batteries.length - 1];
    const single = batteries.find((b) => b.rating * 1000 >= batteryWh);
    const battery = single ? { ...single, count: 1 } : { ...largest, count: Math.ceil(batteryWh / (largest.rating * 1000)) };
    const arrayW = dailyWh / (PEAK_SUN_HOURS * SYSTEM_LOSSES);
    const panels = Math.max(1, Math.ceil(arrayW / panel.rating));
    const motors = selected.some((a) => a.motor);
    const heating = selected.some((a) => a.id === "iron" || a.id === "microwave");
    return { selected, loadW, dailyWh, kvaNeeded, inverter, batteryWh, battery, arrayW, panels, motors, heating };
  }, [qty, batteryShare, inverters, batteries, panel]);

  const empty = r.selected.length === 0;

  const summary = waMessage(
    "purchase",
    "I used your sizing guide. My appliances:",
    ...r.selected.map((a) => `- ${qty[a.id]} × ${a.name}`),
    `Estimated load: ${(r.loadW / 1000).toFixed(2)} kW, daily energy: ${(r.dailyWh / 1000).toFixed(1)} kWh.`,
    `Suggested: ${r.inverter ? r.inverter.name : "10kVA+ / parallel inverters"}, ${r.battery.count} × ${r.battery.name}, ${r.panels} × ${panel.name}.`,
    "Please confirm and send me a quote.",
  );

  const addAll = () => {
    if (r.inverter) add({ key: r.inverter.key, name: r.inverter.name, href: r.inverter.href, image: r.inverter.image });
    add({ key: r.battery.key, name: r.battery.name, model: r.battery.model, href: r.battery.href, image: r.battery.image }, r.battery.count);
    add({ key: panel.key, name: panel.name, model: panel.model, href: panel.href, image: panel.image }, r.panels);
    setSizing({
      appliances: r.selected.map((a) => `${qty[a.id]} × ${a.name}`),
      loadKw: (r.loadW / 1000).toFixed(2),
      dailyKwh: (r.dailyWh / 1000).toFixed(1),
      batteryShare,
    });
    setAdded(true);
  };

  const startSave = () => {
    if (!user) {
      try {
        localStorage.setItem(PENDING_KEY, JSON.stringify({ qty, batteryShare }));
      } catch {}
      router.push(`/account?next=${encodeURIComponent("/support/sizing-guide")}`);
      return;
    }
    if (!title) setTitle(defaultTitle());
    setSave({ kind: "open" });
  };

  async function doSave(e: React.FormEvent) {
    e.preventDefault();
    const name = (title.trim() || defaultTitle()).slice(0, 80);
    setSave({ kind: "saving" });
    const { error } = await browserSupabase()
      .from("saved_sizings")
      .insert({
        title: name,
        appliances: cleanQty(qty),
        battery_share: batteryShare,
        load_kw: Number((r.loadW / 1000).toFixed(2)),
        daily_kwh: Number((r.dailyWh / 1000).toFixed(1)),
        recommendation: {
          inverter: r.inverter ? r.inverter.name : `Above ${inverters[inverters.length - 1]?.rating ?? 10}kVA: parallel inverters or a larger system`,
          battery: `${r.battery.count} × ${r.battery.name}`,
          panels: `${r.panels} × ${panel.name}`,
          storageKwh: (r.battery.rating * r.battery.count).toFixed(2),
          arrayKwp: ((r.panels * panel.rating) / 1000).toFixed(2),
        },
      });
    if (error) {
      setSave({ kind: "error", message: error.message.includes("limit of 100") ? error.message : "We couldn't save this calculation. Please try again." });
      return;
    }
    setSave({ kind: "saved", title: name });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr]">
      {/* Appliance picker */}
      <div>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold">1. Choose your appliances</h2>
            <p className="mt-1 text-[14.5px] text-muted">Include only what you want to run on solar and battery.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setQty({});
              setSave({ kind: "closed" });
              setOpenedTitle(null);
            }} className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-muted hover:text-ink">
            <RotateCcw className="size-3.5" aria-hidden /> Reset
          </button>
        </div>
        <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {APPLIANCES.map((a) => {
            const n = qty[a.id] ?? 0;
            return (
              <li key={a.id} className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 ring-1 transition-colors ${n > 0 ? "bg-brand-50 ring-brand/30" : "bg-white ring-line"}`}>
                <div className="min-w-0">
                  <p className="truncate text-[14.5px] font-semibold">{a.name}</p>
                  <p className="text-[12.5px] text-muted">
                    {a.watts}W · ~{a.hours}h/day
                  </p>
                </div>
                <div className="flex shrink-0 items-center rounded-full bg-white ring-1 ring-line">
                  <button type="button" aria-label={`Fewer ${a.name}`} onClick={() => change(a.id, -1)} disabled={n === 0} className="grid size-8 place-items-center rounded-full hover:bg-mist disabled:opacity-30">
                    <Minus className="size-3.5" aria-hidden />
                  </button>
                  <span className="w-7 text-center text-[14px] font-bold" aria-live="polite">
                    {n}
                  </span>
                  <button type="button" aria-label={`More ${a.name}`} onClick={() => change(a.id, 1)} className="grid size-8 place-items-center rounded-full hover:bg-mist">
                    <Plus className="size-3.5" aria-hidden />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 rounded-2xl bg-mist p-5">
          <label htmlFor="share" className="flex items-center justify-between text-[14.5px] font-semibold">
            <span>2. Share of daily energy supplied by the battery</span>
            <span className="rounded-full bg-white px-2.5 py-0.5 text-brand ring-1 ring-line">{batteryShare}%</span>
          </label>
          <input id="share" type="range" min={30} max={100} step={5} value={batteryShare} onChange={(e) => setBatteryShare(Number(e.target.value))} className="mt-3 w-full accent-[var(--color-brand)]" />
          <p className="mt-1.5 text-[12.5px] text-muted">Evenings, nights and grid outages. Raise this if you are often without grid power.</p>
        </div>
      </div>

      {/* Results */}
      <div className="lg:sticky lg:top-32 lg:h-fit">
        <div className="sun-glow relative overflow-hidden rounded-[1.75rem] p-7 text-white">
          <div className="grid-lines absolute inset-0" aria-hidden />
          <div className="relative">
            {openedTitle && (
              <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[12.5px] font-semibold text-sun ring-1 ring-white/15">
                <FolderOpen className="size-3.5" aria-hidden /> {openedTitle}
              </p>
            )}
            <h2 className="text-xl font-extrabold">Your estimate</h2>
            <dl className="mt-5 grid grid-cols-2 gap-3">
              <Stat label="Running load" value={empty ? "—" : `${(r.loadW / 1000).toFixed(2)} kW`} />
              <Stat label="Daily energy" value={empty ? "—" : `${(r.dailyWh / 1000).toFixed(1)} kWh`} />
            </dl>

            <div className="mt-6 space-y-3">
              <Result label="Inverter" value={empty ? "—" : r.inverter ? `${r.inverter.rating}kVA` : `Above ${inverters[inverters.length - 1]?.rating ?? 10}kVA`} detail={empty ? "" : r.inverter ? r.inverter.name : "Parallel inverters or a larger system. Talk to us."} href={r.inverter?.href} />
              <Result label="Battery storage" value={empty ? "—" : `${(r.battery.rating * r.battery.count).toFixed(2)} kWh`} detail={empty ? "" : `${r.battery.count} × ${r.battery.name}`} href={r.battery.href} />
              <Result label="Solar array" value={empty ? "—" : `${((r.panels * panel.rating) / 1000).toFixed(2)} kWp`} detail={empty ? "" : `${r.panels} × ${panel.name}`} href={panel.href} />
            </div>

            {!empty && (r.motors || r.heating) && (
              <p className="mt-5 flex gap-2 rounded-xl bg-white/10 p-3 text-[13px] leading-relaxed text-white/85">
                <Info className="mt-0.5 size-4 shrink-0 text-sun" aria-hidden />
                {r.heating
                  ? "Irons and microwaves draw heavy power. Use them while the sun is out, and let us check your inverter size."
                  : "Motors (fridges, pumps, ACs) draw extra power when starting. We will confirm your inverter can handle the surge."}
              </p>
            )}

            <div className="mt-6 grid gap-2.5">
              <button type="button" disabled={empty} onClick={addAll} className="btn btn-sun w-full disabled:opacity-50">
                {added ? "Added to your quote list ✓" : "Add this system to my quote"}
              </button>
              {added && (
                <Link href="/quote" className="btn btn-glass w-full">
                  Review quantities &amp; request quote →
                </Link>
              )}
              <a href={empty ? undefined : whatsappLink(summary)} target="_blank" rel="noopener noreferrer" aria-disabled={empty} className={`btn btn-whatsapp w-full ${empty ? "pointer-events-none opacity-50" : ""}`}>
                <WhatsAppIcon className="size-4" /> Send to our team
              </a>
            </div>

            {/* Save to the customer's account */}
            <div className="mt-4 border-t border-white/10 pt-4">
              {save.kind === "saved" ? (
                <p role="status" className="text-[14px] text-white/85">
                  <b className="text-sun">Saved ✓</b> “{save.title}” is in your account.{" "}
                  <Link href="/account" className="font-semibold text-white underline">
                    View saved calculations
                  </Link>
                </p>
              ) : save.kind === "closed" ? (
                <>
                  <button type="button" disabled={empty} onClick={startSave} className="btn btn-glass w-full disabled:opacity-50">
                    <Bookmark className="size-4" aria-hidden /> Save to my account
                  </button>
                  {!user && <p className="mt-2 text-center text-[12.5px] text-white/55">Sign in or create a free account to keep this calculation for later.</p>}
                </>
              ) : (
                <form onSubmit={doSave} className="space-y-2.5">
                  <label htmlFor="sizing-title" className="block text-[13px] font-semibold text-white/80">
                    Name this calculation
                  </label>
                  <input
                    id="sizing-title"
                    autoFocus
                    maxLength={80}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Home, Ogbor Hill or Shop at Ariaria"
                    className="h-11 w-full rounded-xl bg-white px-4 text-[15px] text-ink outline-none focus:ring-2 focus:ring-sun"
                  />
                  {save.kind === "error" && (
                    <p role="alert" className="text-[13px] text-red-200">
                      {save.message}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button type="submit" disabled={save.kind === "saving" || empty} className="btn btn-sun flex-1 disabled:opacity-60">
                      {save.kind === "saving" && <Loader2 className="size-4 animate-spin" aria-hidden />} Save
                    </button>
                    <button type="button" onClick={() => setSave({ kind: "closed" })} className="btn btn-glass">
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        <p className="mt-4 text-[12.5px] leading-relaxed text-muted">
          Estimates assume {PEAK_SUN_HOURS} peak sun hours a day, {Math.round((1 - SYSTEM_LOSSES) * 100)}% system losses, {Math.round(DOD * 100)}% usable battery depth, {POWER_FACTOR} kW per kVA and {Math.round((HEADROOM - 1) * 100)}% inverter headroom. Real appliances vary. Our team confirms every design before you buy.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/[0.07] p-4 ring-1 ring-white/10">
      <dt className="text-[12px] font-semibold uppercase tracking-wider text-white/55">{label}</dt>
      <dd className="mt-1 font-display text-2xl font-extrabold">{value}</dd>
    </div>
  );
}

function Result({ label, value, detail, href }: { label: string; value: string; detail: string; href?: string }) {
  const inner = (
    <>
      <span>
        <span className="block text-[12px] font-semibold uppercase tracking-wider text-white/55">{label}</span>
        <span className="mt-0.5 block text-[13.5px] text-white/75">{detail}</span>
      </span>
      <span className="font-display text-xl font-extrabold text-sun">{value}</span>
    </>
  );
  return href && detail ? (
    <Link href={href} className="flex items-center justify-between gap-4 rounded-xl bg-white/[0.07] p-4 ring-1 ring-white/10 transition-colors hover:bg-white/[0.12]">
      {inner}
    </Link>
  ) : (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-white/[0.07] p-4 ring-1 ring-white/10">{inner}</div>
  );
}
