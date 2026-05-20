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
      const { data: profiles, error: pe } = await supabase
        .from("profiles")
        .select("user_id, full_name, school, class_name, is_blocked, nickname")
        .order("full_name");
      if (pe) throw pe;

      const emailsByUser = new Map<string, string>();
      let page = 1;
      while (true) {
        const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
        if (error) throw error;
        for (const u of data.users) emailsByUser.set(u.id, u.email ?? "");
        if (data.users.length < 1000) break;
        page++;
      }

      const { data: roles } = await supabase.from("user_roles").select("user_id, role");
      const roleByUser = new Map<string, string[]>();
      (roles || []).forEach((r: any) => {
        const list = roleByUser.get(r.user_id) || [];
        list.push(r.role);
        roleByUser.set(r.user_id, list);
      });

      const { data: creds } = await supabase
        .from("student_credentials")
        .select("user_id, plain_password");
      const credsByUser = new Map<string, string>();
      (creds || []).forEach((c: any) => credsByUser.set(c.user_id, c.plain_password));

      const students = (profiles || []).map((p: any) => ({
        user_id: p.user_id,
        full_name: p.full_name,
        nickname: p.nickname,
        school: p.school,
        class_name: p.class_name,
        login_email: emailsByUser.get(p.user_id) || "",
        plain_password: credsByUser.get(p.user_id) || null,
        is_blocked: !!p.is_blocked,
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
      // Atualiza credenciais visíveis pro ADM
      await supabase
        .from("student_credentials")
        .update({ plain_password: String(new_password), updated_at: new Date().toISOString() })
        .eq("user_id", user_id);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "set_blocked") {
      const { user_id, blocked } = payload ?? {};
      if (!user_id) {
        return new Response(JSON.stringify({ error: "user_id obrigatório" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const isBlocked = !!blocked;
      // Atualiza flag no profile
      const { error: pErr } = await supabase
        .from("profiles")
        .update({ is_blocked: isBlocked })
        .eq("user_id", user_id);
      if (pErr) throw pErr;
      // Banir/desbanir sessão (revoga login)
      const { error: bErr } = await supabase.auth.admin.updateUserById(user_id, {
        ban_duration: isBlocked ? "876000h" : "none",
      } as any);
      if (bErr) throw bErr;
      return new Response(JSON.stringify({ ok: true, blocked: isBlocked }), {
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
