Vou criar um sistema de **arquivo histórico de relatórios mensais** com login, banco de dados e visualização em grade por ano.

## O que será criado

### 1. Login real (Lovable Cloud)
- Página `/auth` com login por **email/senha + Google**
- Substitui o "password" simples atual da Folha de Registro
- Só você (logada) consegue ver/editar relatórios
- Redirecionamento automático se não estiver logada

### 2. Banco de dados
Nova tabela `monthly_reports` na nuvem guardando:
- `user_id` — quem é dona do relatório
- `period_key` — identificador do mês (ex: `2026-04`)
- `data` — todo o conteúdo do relatório (JSON editável)
- datas de criação/atualização

Regras de acesso (RLS): cada usuária só vê e edita os próprios relatórios.

### 3. Nova página `/admin/relatorios` — Arquivo de Relatórios
Visual em **grade por ano**:

```text
            2026
 ┌──────┬──────┬──────┬──────┐
 │ Jan  │ Fev  │ Mar  │ Abr ✓│
 ├──────┼──────┼──────┼──────┤
 │ Mai  │ Jun  │ Jul  │ Ago  │
 ├──────┼──────┼──────┼──────┤
 │ Set  │ Out  │ Nov  │ Dez  │
 └──────┴──────┴──────┴──────┘
```

- Meses **com relatório salvo** aparecem destacados (cor + ✓)
- Meses **vazios** aparecem cinza com botão "Criar"
- Seletor de ano (← 2025 | 2026 | 2027 →)
- Ao clicar num mês: abre a Folha de Registro daquele mês

### 4. Folha de Registro adaptada
- Vira `/admin/relatorios/:periodKey` (ex: `/admin/relatorios/2026-04`)
- Carrega do banco quando abre; se não existir, usa template em branco já com mês/ano preenchidos
- Botão **"Salvar na nuvem"** novo (ao lado de Salvar PDF/Imagem)
- Auto-preenche o título com o mês/ano selecionado
- Mantém todas funções atuais: editar tudo, exportar PDF, imagem, imprimir, anexar assinatura

### 5. Migração do relatório de Abril/2026 atual
O relatório que você já tem (Abril/2026) será inserido automaticamente no banco quando você logar pela primeira vez e abrir esse mês — sem perder nada.

## Detalhes técnicos

- Tabela `monthly_reports` com `UNIQUE(user_id, period_key)` para garantir 1 relatório por mês por usuária
- Trigger `update_updated_at_column` para manter `updated_at` atualizado
- Auth com `onAuthStateChange` + `getSession`, persistência via Supabase
- Auto-confirm de email **desativado** (precisa verificar email no signup) — posso ativar se preferir entrar direto sem verificar
- O grid usa shadcn `Card` + tokens semânticos do design system

## Próximo passo
Se aprovar, começo aplicando a migração do banco e em seguida construo as telas de auth, grade e adapto a folha. Depois te aviso pra você criar sua conta e abrir Abril/2026.