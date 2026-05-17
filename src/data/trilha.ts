// Trilha de aulas de Cultura Digital por ano escolar
export type TrailLesson = {
  id: string;
  emoji: string;
  title: string;
  summary: string;
  content: { heading: string; text: string }[];
  keyPoints: string[];
};

export type TrailModule = {
  id: string;
  title: string;
  description: string;
  color: string;
  lessons: TrailLesson[];
};

export const TRAIL_BY_GRADE: Record<number, TrailModule[]> = {
  6: [
    {
      id: "m1-6",
      title: "Mundo Digital",
      description: "O que é tecnologia e como ela faz parte do nosso dia",
      color: "from-violet-500 to-cyan-400",
      lessons: [
        {
          id: "6-1",
          emoji: "💡",
          title: "O que é tecnologia?",
          summary: "Toda ferramenta criada para resolver um problema é tecnologia.",
          content: [
            { heading: "Tecnologia está em tudo", text: "Uma roda, uma caneta, um celular e a internet — todos são tecnologias. Tecnologia é qualquer invenção que ajuda os humanos a fazerem algo melhor, mais rápido ou mais fácil." },
            { heading: "Tecnologia digital", text: "Quando uma tecnologia usa números (0 e 1) e eletricidade para funcionar, chamamos de tecnologia digital. Computador, celular, tablet, smart TV e videogame são exemplos." },
          ],
          keyPoints: ["Tecnologia = ferramenta que resolve problema", "Digital = funciona com 0 e 1", "Nem toda tecnologia é digital"],
        },
        {
          id: "6-2",
          emoji: "🌐",
          title: "O que é a internet?",
          summary: "Uma rede gigante que liga computadores do mundo todo.",
          content: [
            { heading: "Uma teia mundial", text: "A internet é uma rede de cabos, antenas e satélites que conecta milhões de computadores. Quando você abre um site, seu celular pede a informação para outro computador (servidor) e ele te responde em segundos." },
            { heading: "Quem inventou?", text: "A internet nasceu nos anos 1960 nos EUA para comunicação militar e científica. Hoje ela liga mais de 5 bilhões de pessoas." },
          ],
          keyPoints: ["Internet ≠ Wi-Fi", "Wi-Fi é só a forma de se conectar", "Servidores guardam e enviam os sites"],
        },
        {
          id: "6-3",
          emoji: "👤",
          title: "Identidade digital",
          summary: "Tudo o que você posta fica registrado e fala sobre você.",
          content: [
            { heading: "Pegada digital", text: "Cada foto, comentário ou curtida deixa uma marca na internet, chamada de pegada digital. Mesmo apagando, alguém pode ter visto ou salvo." },
            { heading: "Cuidado com dados", text: "Nunca compartilhe seu endereço, telefone, escola ou senhas em redes sociais. Combine com seus pais o que pode e o que não pode postar." },
          ],
          keyPoints: ["Internet não esquece", "Nunca dê dados pessoais", "Pense antes de postar"],
        },
      ],
    },
    {
      id: "m2-6",
      title: "Lógica de Programação",
      description: "Aprenda a pensar como um computador",
      color: "from-pink-500 to-orange-500",
      lessons: [
        {
          id: "6-4",
          emoji: "🧩",
          title: "O que é um algoritmo?",
          summary: "Uma sequência de passos para resolver algo.",
          content: [
            { heading: "Receita de bolo é algoritmo", text: "Uma receita diz: 1) pegue a farinha, 2) misture o ovo, 3) leve ao forno. Se você muda a ordem, o bolo não dá certo. Programar é parecido: ordem importa." },
            { heading: "Computador é literal", text: "O computador faz EXATAMENTE o que você manda. Se você esquecer um passo, ele para. Por isso programador precisa pensar com calma." },
          ],
          keyPoints: ["Algoritmo = passo a passo", "Ordem importa", "Computador segue à risca"],
        },
        {
          id: "6-5",
          emoji: "🔁",
          title: "Repetição e decisão",
          summary: "Computadores adoram repetir e tomar decisões rapidinho.",
          content: [
            { heading: "Repetição (loop)", text: "Se eu quero pular corda 10 vezes, em vez de escrever 'pule, pule, pule...' 10 vezes, eu digo: 'repita pular 10 vezes'. Isso é um laço." },
            { heading: "Decisão (if)", text: "SE está chovendo, leve guarda-chuva. SENÃO, use óculos de sol. Programas tomam decisões assim o tempo todo." },
          ],
          keyPoints: ["Loop = repetir", "If = decidir", "Junto formam quase qualquer programa"],
        },
      ],
    },
  ],
  7: [
    {
      id: "m1-7",
      title: "Cidadania Digital",
      description: "Como conviver bem na internet",
      color: "from-emerald-400 to-cyan-500",
      lessons: [
        {
          id: "7-1",
          emoji: "📰",
          title: "Fake news e checagem",
          summary: "Como saber se uma notícia é verdadeira.",
          content: [
            { heading: "O que é fake news?", text: "São notícias falsas feitas para enganar, vender ou manipular opinião. Espalham rápido porque mexem com emoção (medo, raiva, surpresa)." },
            { heading: "Como checar", text: "1) Veja a fonte (jornal conhecido?). 2) Procure a mesma notícia em outros sites confiáveis. 3) Cheque a data. 4) Desconfie de mensagens que pedem 'compartilhe urgente'. Use sites como Aos Fatos, Lupa e Boatos.org." },
          ],
          keyPoints: ["Não compartilhe sem checar", "Desconfie da urgência", "Fonte importa"],
        },
        {
          id: "7-2",
          emoji: "🔐",
          title: "Segurança e senhas",
          summary: "Sua senha é a chave da sua vida digital.",
          content: [
            { heading: "Senha forte", text: "Use no mínimo 8 caracteres, misturando letras, números e símbolos. Evite seu nome, data de nascimento ou '123456'. Exemplo bom: 'Lua@2026!azul'." },
            { heading: "Não reutilize", text: "Se você usa a mesma senha em tudo e um site vaza, o invasor entra em todas as suas contas. Use senhas diferentes nos lugares importantes." },
          ],
          keyPoints: ["Mín. 8 caracteres mistos", "Não conte para ninguém", "Ative verificação em 2 etapas"],
        },
        {
          id: "7-3",
          emoji: "💬",
          title: "Cyberbullying",
          summary: "Atrás da tela tem uma pessoa real.",
          content: [
            { heading: "O que é", text: "É usar a internet para humilhar, ameaçar ou excluir alguém. Pode ser por mensagens, vídeos, memes, fofocas em grupos. Faz tanto mal quanto bullying na escola — às vezes mais, porque não para nunca." },
            { heading: "O que fazer", text: "Se acontecer com você: salve as provas (prints), bloqueie a pessoa e conte para um adulto de confiança. Se ver acontecer com outro: não compartilhe, defenda quem está sofrendo e avise um professor." },
          ],
          keyPoints: ["Print = prova", "Bloquear é coragem", "Contar a um adulto sempre"],
        },
      ],
    },
  ],
  8: [
    {
      id: "m1-8",
      title: "Computação Criativa",
      description: "Como ideias viram aplicativos e jogos",
      color: "from-amber-400 to-pink-500",
      lessons: [
        {
          id: "8-1",
          emoji: "🛠️",
          title: "Como nasce um app",
          summary: "Da ideia ao app que está no seu celular.",
          content: [
            { heading: "Etapas", text: "1) Ideia (que problema resolve?). 2) Rascunho de telas. 3) Código (frontend = o que você vê, backend = o que está nos servidores). 4) Teste. 5) Publicação na loja." },
            { heading: "Quem trabalha", text: "Designer (desenha), programador (codifica), product manager (organiza), QA (testa). Um app simples pode ser feito por 1 pessoa; um grande tem centenas." },
          ],
          keyPoints: ["Ideia → Design → Código → Teste", "Frontend ≠ Backend", "Sempre tem usuário no centro"],
        },
        {
          id: "8-2",
          emoji: "🤖",
          title: "Inteligência Artificial",
          summary: "Máquinas que aprendem com exemplos.",
          content: [
            { heading: "Como aprende?", text: "Uma IA recebe milhares de exemplos (fotos de gatos, frases, jogadas de xadrez) e descobre padrões. Depois, ela usa esses padrões para responder coisas novas. Não é mágica — é matemática e muitos dados." },
            { heading: "Cuidados", text: "IA pode errar, inventar fatos ou ter preconceitos (se aprendeu com dados ruins). Sempre confira o que ela disser, principalmente fontes e números." },
          ],
          keyPoints: ["IA aprende por exemplos", "Pode errar e inventar", "Use como ajuda, não como verdade absoluta"],
        },
      ],
    },
  ],
  9: [
    {
      id: "m1-9",
      title: "Projetos e Carreira",
      description: "Como aplicar tudo o que você aprendeu",
      color: "from-violet-500 to-pink-500",
      lessons: [
        {
          id: "9-1",
          emoji: "🚀",
          title: "Profissões do futuro",
          summary: "Carreiras que envolvem tecnologia e criatividade.",
          content: [
            { heading: "Algumas profissões", text: "Programador, designer de UX, cientista de dados, criador de conteúdo, engenheiro de IA, especialista em cibersegurança, gestor de redes sociais, desenvolvedor de jogos. Todas pedem curiosidade e vontade de aprender sempre." },
            { heading: "Como começar agora", text: "Aprenda lógica, inglês básico, escreva muito (textos, posts, código). Faça projetos pequenos: um site sobre seu hobby, um joguinho, um perfil profissional. Portfólio vale mais que diploma." },
          ],
          keyPoints: ["Carreira tech é diversa", "Estude inglês", "Faça e mostre projetos"],
        },
      ],
    },
  ],
};

export const getTrailForGrade = (grade: number | null | undefined): TrailModule[] => {
  if (!grade) return TRAIL_BY_GRADE[6];
  return TRAIL_BY_GRADE[grade] ?? TRAIL_BY_GRADE[6];
};
