import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    const user = userData?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "Não autenticado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: isAdmin } = await userClient.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Acesso negado" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const body = await req.json().catch(() => ({}));
    const { action, payload } = body ?? {};

    if (action === "list") {
      // Get all profiles with their emails from auth.users
      const { data: profiles, error: pe } = await supabase
        .from("profiles")
        .select("*")
        .order("full_name");
      if (pe) throw pe;

      // Fetch emails via admin API (paginate)
      const emailsByUser = new Map<string, string>();
      let page = 1;
      while (true) {
        const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
        if (error) throw error;
        for (const u of data.users) emailsByUser.set(u.id, u.email ?? "");
        if (data.users.length < 1000) break;
        page++;
      }

      // roles
      const { data: roles } = await supabase.from("user_roles").select("user_id, role");
      const roleByUser = new Map<string, string[]>();
      (roles || []).forEach((r: any) => {
        const list = roleByUser.get(r.user_id) || [];
        list.push(r.role);
        roleByUser.set(r.user_id, list);
      });

      const students = (profiles || []).map((p: any) => ({
        user_id: p.user_id,
        full_name: p.full_name,
        school: p.school,
        class_name: p.class_name,
        login_email: emailsByUser.get(p.user_id) || "",
        roles: roleByUser.get(p.user_id) || [],
      }));

      return new Response(JSON.stringify({ students }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "reset_password") {
      const { user_id, new_password } = payload ?? {};
      if (!user_id || !new_password || String(new_password).length < 4) {
        return new Response(JSON.stringify({ error: "Senha deve ter pelo menos 4 caracteres" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { error } = await supabase.auth.admin.updateUserById(user_id, {
        password: String(new_password),
      });
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Ação desconhecida" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
