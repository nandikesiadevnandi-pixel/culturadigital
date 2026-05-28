import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const slug = (s: string) =>
  s.normalize('NFD')
   .replace(/[̀-ͯ]/g, '')
   .toLowerCase()
   .replace(/[^a-z0-9]+/g, '-')
   .replace(/^-+|-+$/g, '')
   .slice(0, 40)

function buildStudentEmail(name: string, className: string, school: string): string {
  const n = slug(name)
  const c = slug(className) || 'sem-turma'
  const s = slug(school) || 'sem-escola'
  return `${n}.${c}.${s}@aluno.cultura.local`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, class_name, school, new_password } = await req.json()

    if (!name || !class_name || !school || !new_password) {
      return new Response(
        JSON.stringify({ error: 'Dados incompletos.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
      )
    }

    const email = buildStudentEmail(name, class_name, school)

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Fetch users in batches to find by email
    let found: { id: string } | null = null
    let page = 1
    while (!found) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 500 })
      if (error) throw error
      found = data.users.find(u => u.email === email) ?? null
      if (found || data.users.length < 500) break
      page++
    }

    if (!found) {
      return new Response(
        JSON.stringify({ error: 'Conta não encontrada. Confira nome, turma e escola.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 },
      )
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(found.id, {
      password: new_password,
    })

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message ?? 'Erro interno.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 },
    )
  }
})
