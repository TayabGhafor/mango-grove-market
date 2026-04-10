import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

const isMissingProfilesTable = (error: unknown) => {
  if (!error || typeof error !== "object") return false;
  const code = (error as { code?: unknown }).code;
  return code === "PGRST205";
};

type AuthContextValue = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: Tables<"profiles"> | null;
  login: (payload: { email: string; password: string }) => Promise<void>;
  signup: (payload: { name: string; email: string; password: string }) => Promise<{ needsEmailConfirmation: boolean }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (payload: { name?: string; phone?: string; address?: string }) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);

  const loadProfile = useCallback(async (nextUser: User | null) => {
    if (!nextUser) {
      setProfile(null);
      return;
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", nextUser.id)
      .maybeSingle();
    if (error) {
      if (isMissingProfilesTable(error)) {
        setProfile(null);
        return;
      }
      throw error;
    }
    setProfile(data ?? null);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        if (isMounted) setLoading(false);
        return;
      }
      if (!isMounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      try {
        await loadProfile(data.session?.user ?? null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    init();

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      try {
        await loadProfile(nextSession?.user ?? null);
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const login = useCallback(async ({ email, password }: { email: string; password: string }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signup = useCallback(async ({ name, email, password }: { name: string; email: string; password: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;

    return { needsEmailConfirmation: !data.session };
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const refreshProfile = useCallback(async () => {
    await loadProfile(user);
  }, [loadProfile, user]);

  const updateProfile = useCallback(async (payload: { name?: string; phone?: string; address?: string }) => {
    if (!user) throw new Error("Not signed in.");
    const resolvedName = (payload.name ?? profile?.name ?? user.user_metadata?.name ?? user.email ?? "").trim();
    if (resolvedName.length < 2) throw new Error("Name must be at least 2 characters.");

    const next = {
      name: resolvedName,
      ...(payload.phone !== undefined ? { phone: payload.phone } : {}),
      ...(payload.address !== undefined ? { address: payload.address } : {}),
    };
    const { data, error } = await supabase.from("profiles").update(next).eq("id", user.id).select("id");
    if (error) {
      if (isMissingProfilesTable(error)) {
        throw new Error("Supabase database schema is not installed yet (missing profiles table).");
      }
      throw error;
    }
    if (!data || data.length === 0) {
      const email = user.email ?? profile?.email ?? "";
      if (!email) throw new Error("Email is required.");
      const { error: insertError } = await supabase.from("profiles").insert({
        id: user.id,
        email,
        name: resolvedName,
        role: "customer",
        ...(payload.phone !== undefined ? { phone: payload.phone } : {}),
        ...(payload.address !== undefined ? { address: payload.address } : {}),
      });
      if (insertError) {
        if (isMissingProfilesTable(insertError)) {
          throw new Error("Supabase database schema is not installed yet (missing profiles table).");
        }
        throw insertError;
      }
    }
    await loadProfile(user);
  }, [loadProfile, profile?.email, profile?.name, user]);

  const value = useMemo<AuthContextValue>(() => ({
    loading,
    session,
    user,
    profile,
    login,
    signup,
    logout,
    refreshProfile,
    updateProfile,
  }), [loading, session, user, profile, login, signup, logout, refreshProfile, updateProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
