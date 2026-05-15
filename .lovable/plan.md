# Cultura Digital Educacional 🚀

Plataforma educacional completa, vibe **tech jovem (dark + neon)**, onde alunos do 4º ao 8º ano se cadastram livremente, seguem trilhas, jogam, ganham XP — e você comanda tudo de um painel ADM.

---

## 🎯 O que vamos construir (Fase 1 / MVP)

### Para o aluno
1. **Cadastro livre** com: nome, turma (ex: 7ºA), escola (dropdown das suas escolas), email + senha → entra direto
2. **Perfil personalizado** — avatar (gerado), nome, escola, turma, nível, XP total, medalhas
3. **Trilha do ano dele** — só vê conteúdo do 4º, 5º, 6º, 7º ou 8º (filtro automático)
4. **Aulas** — texto + vídeo + imagens, marca como concluída → ganha XP
5. **Quizzes** (reaproveita o sistema atual!) — agora vinculados ao aluno logado
6. **1 mini-jogo de estreia** — "Caça-Bug" (lógica visual, funciona para todos os anos) ou "Robô que Anda" (sequência de comandos, mais fácil)
7. **Galeria personalizada** — só fotos da escola/turma dele
8. **Página de evolução** — gráfico de XP ao longo do tempo, medalhas conquistadas, % da trilha
9. **Ranking** — da turma dele + da escola dele

### Para você (ADM)
1. **Dashboard** — total de alunos, ativos hoje, novos cadastros da semana, gráfico por escola/turma
2. **Lista de alunos** filtrável (escola → turma → ano), busca por nome
3. **Perfil do aluno** — vê tudo: progresso, quizzes feitos, jogos, XP — e pode dar XP/medalha manual
4. **Editor de aulas** — cria/edita aulas direto na interface (sem código): título, ano-alvo, conteúdo rico, imagens, vídeo (YouTube)
5. **Editor de quizzes** — monta quiz com perguntas, alternativas, ano-alvo
6. **Mensagens** — manda recado pra uma turma inteira ou escola inteira
7. **Relatórios mensais** — continua o que já tem, mas agora puxa dados reais (alunos ativos, médias, etc) automaticamente

---

## 🎨 Visual — "Tech jovem dark/neon"

- Fundo **dark navy** (#0a0a1a → #141432), acentos **neon roxo/ciano** (#a78bfa, #67e8f9)
- Tipografia: **Space Grotesk** (títulos) + **Inter** (corpo) — moderna, monoespaçada quando precisa
- Cards com **glow sutil** nas bordas, animações suaves de hover
- Barras de XP estilo videogame, medalhas com brilho, "níveis" com nomes legais (Iniciante → Codificador → Hacker → Mestre Digital)
- Mantém o switcher de plataforma atual (Cultura Digital ↔ Hospitalidade)

A área ADM continua mais clean (a que você já tem), só ganha as novas seções.

---

## 🗄️ Estrutura técnica

### Banco de dados (novas tabelas)

```text
profiles            → 1 por aluno: nome, turma, escola, ano_escolar, avatar, xp, nivel
user_roles          → quem é "admin" (você) vs "student" (alunos)
lessons             → aulas: titulo, conteudo, ano_escolar, ordem, xp_recompensa
lesson_completions  → aluno X concluiu aula Y (+ data + xp ganho)
quizzes_v2          → quizzes vinculados a ano escolar (evolui o atual)
quiz_attempts       → tentativas do aluno no quiz (score, data)
games               → catálogo de jogos disponíveis
game_scores         → pontuação do aluno em cada jogo
badges              → medalhas disponíveis (nome, ícone, condição)
user_badges         → quais medalhas cada aluno conquistou
xp_events           → histórico de XP (vem de quiz, aula, jogo, ou manual da prof)
class_messages      → recados que você manda pra turmas
```

Tudo com **RLS forte**:
- Aluno só vê/edita o próprio perfil e progresso
- Aluno vê aulas/quizzes/jogos do **ano dele**
- Você (admin) vê e edita tudo via função `has_role(user_id, 'admin')`

### Rotas novas

```text
/cadastro                        → criar conta de aluno
/entrar                          → login (renomeia /auth)
/aluno                           → dashboard do aluno (perfil + atalhos)
/aluno/trilha                    → trilha do ano dele
/aluno/aula/:id                  → ler aula + marcar concluída
/aluno/jogos                     → lista de mini-jogos
/aluno/jogo/caca-bug             → primeiro jogo
/aluno/evolucao                  → gráfico de progresso
/aluno/medalhas                  → coleção de badges

/admin                           → vira dashboard geral (não só avaliação)
/admin/alunos                    → lista de alunos com filtros
/admin/alunos/:id                → perfil completo do aluno
/admin/aulas                     → editor de aulas
/admin/quizzes                   → editor de quizzes (evolui o atual)
/admin/mensagens                 → enviar recado pra turma
/admin/relatorios                → continua igual, mas com dados reais
```

---

## 🛠️ Como vamos atacar (ordem de construção, mesmo que tudo seja Fase 1)

1. **Fundação** — tabelas + RLS + roles (você vira admin automaticamente quando logar com seu email)
2. **Auth do aluno** — cadastro com nome/turma/escola, login, perfil
3. **Layout dark/neon** — novo tema visual aplicado nas áreas de aluno
4. **Trilha + aulas** — editor pra você + visualização pro aluno + completar aula = XP
5. **Quizzes** — adapta o sistema atual pra vincular ao aluno logado e dar XP
6. **Jogo "Caça-Bug"** — primeiro mini-jogo (escolho um simples e visual pra começar bonito)
7. **XP, níveis e medalhas** — sistema de progressão + 5 medalhas iniciais
8. **Dashboard ADM** — visão geral com números reais
9. **Lista + perfil de aluno no ADM** — você consegue ver e ajustar tudo
10. **Galeria e ranking personalizados** — filtra por escola/turma do aluno
11. **Mensagens pra turma**
12. **Relatórios automáticos** — puxa dados reais

---

## ⚠️ Pontos importantes pra você saber

- **É um projeto grande** — vou entregar em várias mensagens. A cada etapa você testa e a gente ajusta.
- **Cadastro livre = qualquer um pode entrar.** Você escolheu isso. Se aparecer abuso, a gente adiciona um "código de turma" depois (fácil).
- **Email não precisa ser verificado** (pra alunos não travarem). Posso mudar se preferir.
- **Você precisa criar sua conta admin primeiro** — vou deixar um email seu já marcado como admin no banco assim que me passar (ou eu adiciono manualmente depois do primeiro login seu).
- **As contas/quizzes atuais** continuam funcionando. A galeria e o ranking públicos continuam visíveis pra todos (visitantes), só ganham camada extra pra alunos logados.
- A vibe **tech jovem dark/neon** vai ficar nas áreas do aluno. Áreas públicas (home, sobre) e o ADM mantêm o visual atual pra não quebrar identidade.

---

## ✅ Próximo passo

Se aprovar esse plano, eu começo pela **fundação (tabelas + roles + auth do aluno)** e te aviso pra criar sua conta. A partir daí, construímos camada por camada — você testa cada uma antes de avançar.

Quer ajustar algo (tirar/incluir feature, mudar ordem, mudar nome de algo) ou posso começar?
