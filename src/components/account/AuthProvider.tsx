"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { browserSupabase } from "@/lib/supabase-browser";

export interface CustomerProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  company_name: string | null;
  buyer_type: "retail" | "bulk";
  city: string | null;
}

interface AuthValue {
  /** False until the stored session has been checked. */
  ready: boolean;
  user: User | null;
  profile: CustomerProfile | null;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

/** Optional customer accounts. Guests are simply `user: null`; nothing on the site requires signing in. */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    const sb = browserSupabase();
    sb.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setReady(true);
    });
    // Only update state here: Supabase advises against awaiting its own calls inside this callback.
    const { data } = sb.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setReady(true);
      if (event === "PASSWORD_RECOVERY") setRecovering(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  // A password-reset link signs the customer in; send them to choose a new password.
  useEffect(() => {
    if (recovering && pathname !== "/account/reset-password") router.replace("/account/reset-password");
    if (recovering) setRecovering(false);
  }, [recovering, pathname, router]);

  const userId = user?.id;
  const refreshProfile = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      return;
    }
    const { data } = await browserSupabase().from("customer_profiles").select("id, full_name, phone, company_name, buyer_type, city").eq("id", userId).maybeSingle();
    setProfile((data as CustomerProfile | null) ?? null);
  }, [userId]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const signOut = useCallback(async () => {
    await browserSupabase().auth.signOut();
    setProfile(null);
  }, []);

  const value = useMemo(() => ({ ready, user, profile, refreshProfile, signOut }), [ready, user, profile, refreshProfile, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

/** Only same-site paths, so a crafted link can't send customers to another website after sign-in. */
export function safeNext(next: string | null | undefined) {
  return next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : null;
}
