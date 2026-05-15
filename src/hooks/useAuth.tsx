import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  user_id: string;
  full_name: string;
  school: string | null;
  class_name: string | null;
  grade_year: number | null;
  avatar_url: string | null;
  total_xp: number;
  level: number;
};

export type Role = "admin" | "student";

type AuthCtx = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  roles: Role[];
  isAdmin: boolean;
  isStudent: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProfileAndRoles = async (uid: string) => {
    const [{ data: p }, { data: r }] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", uid).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", uid),
    ]);
    setProfile((p as Profile) ?? null);
    setRoles(((r ?? []) as { role: Role }[]).map((x) => x.role));
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        // defer to avoid deadlock inside auth callback
        setTimeout(() => loadProfileAndRoles(s.user.id), 0);
      } else {
        setProfile(null);
        setRoles([]);
      }
    });

    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) await loadProfileAndRoles(data.session.user.id);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (user) await loadProfileAndRoles(user.id);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Ctx.Provider
      value={{
        session,
        user,
        profile,
        roles,
        isAdmin: roles.includes("admin"),
        isStudent: roles.includes("student"),
        loading,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
};
