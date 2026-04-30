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

    if (action === "ai_grade") {
      // payload: { submission_id }
      const { submission_id } = payload ?? {};
      if (!submission_id) {
        return new Response(JSON.stringify({ error: "submission_id obrigatório" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY não configurado");

      const { data: openAnswers, error: aerr } = await supabase
        .from("answers")
        .select("*")
        .eq("submission_id", submission_id)
        .neq("question_type", "multiple_choice")
        .order("question_number");
      if (aerr) throw aerr;

      // Question prompts (mirror of frontend quiz.ts)
      const PROMPTS: Record<number, string> = {
        1: "O que é tecnologia? Explique com suas próprias palavras.",
        3: "Explique o que é lógica de programação de forma simples.",
        5: "Escreva uma sequência de passos para fazer um bolo simples.",
        7: "O que significa “seguir instruções” em uma atividade digital?",
        9: "Dê um exemplo de tecnologia que você usa no seu dia a dia e explique para que serve.",
        11: "Descreva um exemplo da sua rotina diária e explique como pode ser representada como um passo a passo.",
      };

      const items = (openAnswers || []).map((a: any) => ({
        question_number: a.question_number,
        question: PROMPTS[a.question_number] || "",
        answer: a.answer_text,
      }));

      const systemPrompt = `Você é uma professora carinhosa avaliando respostas de crianças do 4º e 5º ano do ensino fundamental (idades 9-11) sobre Cultura Digital e Lógica de Programação.

REGRAS DE AVALIAÇÃO (de 0 a 2 pontos por questão):
- 2 pontos: a criança demonstrou compreender a ideia, mesmo com palavras simples, erros de escrita ou jeitinho infantil. Aceite respostas curtas se mostrarem entendimento.
- 1 ponto: resposta parcial, ideia no caminho certo mas incompleta ou um pouco confusa.
- 0 pontos: em branco, totalmente fora do tema, ou sem nenhuma compreensão demonstrada.

IMPORTANTE:
- Seja generosa! Ignore erros ortográficos e gramaticais.
- Valorize esforço e ideias, não a forma escrita.
- Exemplos válidos: "celular serve para falar com a mamãe" = 2 pontos para tecnologia do dia a dia.
- "passo a passo é fazer as coisas em ordem" = 2 pontos.
- Justificativa curta (1 frase) e gentil para cada nota.`;

      const userPrompt = `Avalie estas respostas:\n\n${items
        .map(
          (it) =>
            `Questão ${it.question_number}: ${it.question}\nResposta da criança: "${it.answer}"`
        )
        .join("\n\n---\n\n")}`;

      const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "submit_grades",
                description: "Envia notas e justificativas para cada questão.",
                parameters: {
                  type: "object",
                  properties: {
                    grades: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          question_number: { type: "number" },
                          points: { type: "number", enum: [0, 1, 2] },
                          feedback: { type: "string" },
                        },
                        required: ["question_number", "points", "feedback"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["grades"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "submit_grades" } },
        }),
      });

      if (!aiResp.ok) {
        const t = await aiResp.text();
        if (aiResp.status === 429) {
          return new Response(JSON.stringify({ error: "Limite de uso da IA atingido. Tente novamente em instantes." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (aiResp.status === 402) {
          return new Response(
            JSON.stringify({ error: "Créditos da IA esgotados. Adicione créditos em Settings → Workspace → Usage." }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        throw new Error(`Erro da IA: ${aiResp.status} ${t}`);
      }

      const aiData = await aiResp.json();
      const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) throw new Error("IA não retornou avaliação estruturada");
      const parsed = JSON.parse(toolCall.function.arguments);
      const grades: { question_number: number; points: number; feedback: string }[] = parsed.grades || [];

      // Map grades back to answer ids and save
      let manual = 0;
      for (const g of grades) {
        const pts = Math.max(0, Math.min(2, Number(g.points) || 0));
        manual += pts;
        const ans = (openAnswers || []).find((a: any) => a.question_number === g.question_number);
        if (!ans) continue;
        await supabase.from("answers").update({ manual_points: pts }).eq("id", ans.id);
      }

      const { data: sub } = await supabase
        .from("submissions")
        .select("auto_score")
        .eq("id", submission_id)
        .single();
      const total = (sub?.auto_score || 0) + manual;
      await supabase
        .from("submissions")
        .update({ manual_score: manual, total_score: total })
        .eq("id", submission_id);

      return new Response(JSON.stringify({ ok: true, grades, manual, total }), {
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
