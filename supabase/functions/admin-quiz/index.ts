import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const body = await req.json().catch(() => ({}));
    const { password, action, payload } = body ?? {};

    if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: "Senha incorreta" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    if (action === "verify") {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "list") {
      const { data: subs, error: e1 } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (e1) throw e1;
      const { data: ans, error: e2 } = await supabase.from("answers").select("*");
      if (e2) throw e2;
      return new Response(JSON.stringify({ submissions: subs, answers: ans }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "grade") {
      // payload: { submission_id, grades: [{ answer_id, manual_points }] }
      const { submission_id, grades } = payload ?? {};
      if (!submission_id || !Array.isArray(grades)) {
        return new Response(JSON.stringify({ error: "Dados inválidos" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      for (const g of grades) {
        const pts = Math.max(0, Math.min(2, Number(g.manual_points) || 0));
        const { error } = await supabase
          .from("answers")
          .update({ manual_points: pts })
          .eq("id", g.answer_id)
          .eq("submission_id", submission_id);
        if (error) throw error;
      }

      // recompute totals
      const { data: ans } = await supabase
        .from("answers")
        .select("manual_points")
        .eq("submission_id", submission_id);
      const manual = (ans || []).reduce((s, a) => s + (a.manual_points || 0), 0);

      const { data: sub } = await supabase
        .from("submissions")
        .select("auto_score")
        .eq("id", submission_id)
        .single();

      const total = (sub?.auto_score || 0) + manual;

      const { error: upErr } = await supabase
        .from("submissions")
        .update({ manual_score: manual, total_score: total })
        .eq("id", submission_id);
      if (upErr) throw upErr;

      return new Response(JSON.stringify({ ok: true, manual, total }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete") {
      const { submission_id } = payload ?? {};
      if (!submission_id) {
        return new Response(JSON.stringify({ error: "submission_id obrigatório" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { error } = await supabase.from("submissions").delete().eq("id", submission_id);
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
