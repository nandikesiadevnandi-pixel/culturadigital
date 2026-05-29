/**
 * Exporta credenciais dos alunos da Escola Dante Bertoluci
 * Turmas: 141, 142, 151, 152
 *
 * Uso:
 *   node scripts/exportar-alunos-dante.mjs <SERVICE_ROLE_KEY>
 */

import { writeFileSync } from 'fs';

const SUPABASE_URL = 'https://jlsturmqsagtcxhtfqdk.supabase.co';
const SERVICE_KEY  = process.argv[2];
const ESCOLA       = 'Escola Dante Bertoluci';
const TURMAS       = ['141', '142', '151', '152'];

if (!SERVICE_KEY) {
  console.error('Uso: node scripts/exportar-alunos-dante.mjs <SERVICE_ROLE_KEY>');
  process.exit(1);
}

async function listAllUsers() {
  const users = [];
  let page = 1;
  while (true) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?page=${page}&per_page=500`, {
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
    });
    const json = await res.json();
    const batch = json.users ?? [];
    if (!batch.length) break;
    users.push(...batch);
    if (batch.length < 500) break;
    page++;
  }
  return users;
}

async function main() {
  console.log('Buscando usuários...');
  const allUsers = await listAllUsers();
  console.log(`Total de usuários no sistema: ${allUsers.length}`);

  // Filter by school + class in user_metadata
  const alunos = allUsers
    .filter(u => {
      const meta = u.user_metadata ?? u.raw_user_meta_data ?? {};
      const escola = meta.school ?? '';
      const turma  = String(meta.class_name ?? '');
      return escola === ESCOLA && TURMAS.includes(turma);
    })
    .map(u => {
      const meta = u.user_metadata ?? u.raw_user_meta_data ?? {};
      return {
        turma:  meta.class_name ?? '',
        nome:   meta.full_name  ?? '',
        ano:    meta.grade_year ?? '',
        login:  u.email ?? '',
        senha:  meta.plain_password ?? '(não registrada)',
      };
    })
    .sort((a, b) => a.turma.localeCompare(b.turma) || a.nome.localeCompare(b.nome));

  console.log(`Alunos encontrados na Dante (${TURMAS.join(', ')}): ${alunos.length}`);

  if (!alunos.length) {
    console.warn('Nenhum aluno encontrado. Verifique o nome exato da escola nos perfis.');
    return;
  }

  // Generate CSV (opens in Excel)
  const header = ['Turma', 'Nome do Aluno', 'Ano', 'Login (usuário)', 'Senha'];
  const rows   = alunos.map(a => [a.turma, a.nome, a.ano, a.login, a.senha]);
  const csv    = [header, ...rows]
    .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(';'))
    .join('\n');

  const filename = 'C:\\Users\\User\\Desktop\\alunos-dante-bertoluci.csv';
  writeFileSync(filename, '﻿' + csv, 'utf8'); // BOM for Excel UTF-8
  console.log(`\nArquivo salvo em: ${filename}`);
  console.log('Abra no Excel: clique duas vezes no arquivo ou use Dados > Importar de Texto/CSV');

  // Also print summary table
  console.log('\n--- RESUMO POR TURMA ---');
  for (const t of TURMAS) {
    const n = alunos.filter(a => a.turma === t).length;
    console.log(`Turma ${t}: ${n} aluno(s)`);
  }
  console.log('\n--- LISTA COMPLETA ---');
  for (const a of alunos) {
    console.log(`[${a.turma}] ${a.nome.padEnd(35)} login: ${a.login.padEnd(60)} senha: ${a.senha}`);
  }
}

main().catch(console.error);
