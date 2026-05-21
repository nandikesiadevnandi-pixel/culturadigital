import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { text, context } = await req.json();
    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ error: 'text required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (text.trim().length === 0) {
      return new Response(JSON.stringify({ allowed: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY missing');

    const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          {
            role: 'system',
            content:
              'Você modera mensagens de estudantes brasileiros (6ª a 8ª série) em uma rede social escolar. Sinalize bullying, xingamentos, ameaças, discriminação (racismo, homofobia, etc), assédio, conteúdo sexual ou divulgação de dados pessoais sensíveis. Seja tolerante com gírias inofensivas e brincadeiras leves. Responda SOMENTE chamando a função classify_text.',
          },
          { role: 'user', content: `Contexto: ${context || 'mensagem'}\n\nTexto: """${text}"""` },
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'classify_text',
            description: 'Classifica o texto.',
            parameters: {
              type: 'object',
              properties: {
                allowed: { type: 'boolean', description: 'true se o texto pode ser publicado' },
                severity: { type: 'string', enum: ['none', 'low', 'medium', 'high'] },
                reason: { type: 'string', description: 'Motivo curto em português, vazio se permitido.' },
                suggestion: { type: 'string', description: 'Sugestão amigável de reescrita, vazia se permitido.' },
              },
              required: ['allowed', 'severity', 'reason', 'suggestion'],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: 'function', function: { name: 'classify_text' } },
      }),
    });

    if (resp.status === 429 || resp.status === 402) {
      return new Response(JSON.stringify({ allowed: true, fallback: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!resp.ok) {
      console.error('AI gateway error', resp.status, await resp.text());
      return new Response(JSON.stringify({ allowed: true, fallback: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await resp.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    let parsed = { allowed: true, severity: 'none', reason: '', suggestion: '' };
    if (args) {
      try { parsed = JSON.parse(args); } catch { /* keep default */ }
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('moderate-text error', e);
    return new Response(JSON.stringify({ allowed: true, fallback: true, error: String(e) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
