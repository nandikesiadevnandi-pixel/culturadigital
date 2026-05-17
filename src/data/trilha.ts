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
  4: [
    {
      id: "m1-4",
      title: "HTML Básico",
      description: "Crie suas primeiras páginas na internet com HTML",
      color: "from-orange-500 to-amber-400",
      lessons: [
        {
          id: "4-html-1",
          emoji: "🏗️",
          title: "Estrutura HTML: o esqueleto da página",
          summary: "Toda página da internet tem a mesma estrutura básica — e você vai aprender a usá-la hoje.",
          content: [
            { heading: "Por que isso importa?", text: "Toda página que você já visitou na internet, do YouTube ao site da sua escola, foi escrita com código HTML. Aprender HTML é descobrir o que está por baixo de tudo na internet." },
            { heading: "Como funciona", text: "HTML usa tags que se abrem e fecham para organizar o conteúdo. A tag <!DOCTYPE html> avisa o navegador que é um documento HTML. O <html> engloba tudo. O <head> guarda informações como o título da aba. O <body> contém tudo que o visitante vê." },
            { heading: "Decomposição", text: "Decompor é dividir um problema grande em partes menores. Uma página HTML é decomposta em head (informações) e body (conteúdo visível). O body é decomposto em títulos, parágrafos, imagens — cada parte com uma função." },
            { heading: "Na prática", text: "Para criar um título grande: <h1>Texto aqui</h1>. Para um parágrafo: <p>Texto aqui</p>. O título da aba do navegador fica dentro de <title> no <head>. Toda tag tem abertura e fechamento." },
          ],
          keyPoints: ["<head> = informações · <body> = conteúdo visível", "Toda tag abre e fecha: <h1>texto</h1>", "h1 = título grande · p = parágrafo"],
        },
        {
          id: "4-html-2",
          emoji: "📰",
          title: "Tags de Texto: dando vida às palavras",
          summary: "Títulos, subtítulos e parágrafos são a base de qualquer site. Aprenda a hierarquia do texto em HTML.",
          content: [
            { heading: "Por que isso importa?", text: "Sites de notícias, blogs, portfólios — todos usam as mesmas tags de texto que você vai aprender. Dominar isso é dominar a estrutura de 90% dos sites na internet." },
            { heading: "Hierarquia de títulos", text: "h1 é o título principal da página — o maior. h2 é subtítulo de seção. h3 é ainda menor. Use apenas um h1 por página. Para texto normal use p (parágrafo). Para negrito: <strong>. Para itálico: <em>." },
            { heading: "Reconhecimento de Padrões", text: "Todas as tags HTML seguem o mesmo padrão: tag de abertura, conteúdo, tag de fechamento. <h1>título</h1>, <p>texto</p>, <strong>negrito</strong>. O padrão é sempre o mesmo — aprender uma tag facilita aprender todas as outras." },
            { heading: "Na prática", text: "Crie uma página de notícias com h1 para o nome do jornal, dois h2 para manchetes, e p para o texto. Use <strong> para datas importantes e <em> para nomes de pessoas." },
          ],
          keyPoints: ["h1 (maior) → h2 → h3 (menor)", "<strong> = negrito · <em> = itálico", "Padrão: <tag>conteúdo</tag>"],
        },
        {
          id: "4-html-3",
          emoji: "🔗",
          title: "Links e Imagens: conectando o mundo",
          summary: "Aprenda a inserir fotos e criar links — os dois elementos mais clicados da internet.",
          content: [
            { heading: "Por que isso importa?", text: "Links e imagens são os elementos mais clicados da internet. Saber criar um link que leva para qualquer site e inserir uma foto de qualquer lugar é saber tecer a teia da internet." },
            { heading: "Imagens", text: "Para inserir imagem: <img src='endereço' alt='descrição'>. O src é o endereço (URL) da imagem na internet. O alt descreve a imagem — é importante para acessibilidade e aparece quando a foto não carrega. A tag img não tem fechamento separado." },
            { heading: "Links", text: "Para criar link: <a href='endereço'>texto visível</a>. O href é o endereço do destino. O texto entre <a> e </a> é o que aparece sublinhado. Para pegar o endereço de uma imagem: clique com botão direito e escolha 'Copiar endereço da imagem'." },
            { heading: "Abstração", text: "Abstração é usar algo sem precisar entender todos os detalhes internos. Quando você usa src='https://...', você aplica abstração: não precisa saber como a foto está armazenada no servidor — só precisa do endereço." },
          ],
          keyPoints: ["<img src='' alt=''> para imagens", "<a href=''>texto</a> para links", "URL = endereço do arquivo na internet"],
        },
        {
          id: "4-html-4",
          emoji: "🌐",
          title: "Projeto: Quem Sou Eu",
          summary: "Crie sua primeira página real na internet e compartilhe com a família pelo WhatsApp.",
          content: [
            { heading: "O projeto", text: "Use todas as tags aprendidas: h1 para seu nome, h2 para seções (O que gosto, Meu lugar favorito, Minha mensagem), p para os textos, strong e em para destaques, img para uma foto, e a para um link. Mínimo de 4 seções." },
            { heading: "Audiência real", text: "Depois de terminar, publique na galeria da plataforma e envie o link pelo WhatsApp para alguém da sua família. Sua página é real — qualquer pessoa com o link pode acessar." },
            { heading: "Checklist antes de publicar", text: "Verifique: a estrutura html/head/body está correta? Há pelo menos 4 tags diferentes? A imagem aparece? O link funciona quando você clica? Se tudo estiver certo, você ganhou 100 XP ao publicar." },
            { heading: "Pensamento Computacional aplicado", text: "Você usou decomposição (dividiu a página em seções), reconhecimento de padrões (mesma estrutura de tag em todas as aulas) e abstração (usou URLs sem precisar entender os servidores)." },
          ],
          keyPoints: ["Publique e compartilhe o link com a família", "100 XP ao publicar + 120 XP bônus de módulo", "h1 para nome · h2 para seções · p para texto"],
        },
      ],
    },
  ],
  5: [
    {
      id: "m1-5",
      title: "HTML Básico",
      description: "Crie suas primeiras páginas na internet com HTML",
      color: "from-orange-500 to-amber-400",
      lessons: [
        {
          id: "5-html-1",
          emoji: "🏗️",
          title: "Estrutura HTML: o esqueleto da página",
          summary: "Toda página da internet tem a mesma estrutura básica — e você vai aprender a usá-la hoje.",
          content: [
            { heading: "Por que isso importa?", text: "Toda página que você já visitou na internet, do YouTube ao site da sua escola, foi escrita com código HTML. Aprender HTML é descobrir o que está por baixo de tudo na internet." },
            { heading: "Como funciona", text: "HTML usa tags que se abrem e fecham para organizar o conteúdo. O <html> engloba tudo. O <head> guarda informações como o título da aba. O <body> contém tudo que o visitante vê. Cada parte tem uma função específica." },
            { heading: "Decomposição", text: "Decompor é dividir um problema grande em partes menores. Uma página HTML é decomposta em head (informações) e body (conteúdo visível). O body é decomposto em títulos, parágrafos, imagens — cada parte com uma função." },
            { heading: "Na prática", text: "Para criar um título grande: <h1>Texto aqui</h1>. Para um parágrafo: <p>Texto aqui</p>. O título da aba do navegador fica dentro de <title> no <head>. Toda tag tem abertura e fechamento." },
          ],
          keyPoints: ["<head> = informações · <body> = conteúdo visível", "Toda tag abre e fecha: <h1>texto</h1>", "h1 = título grande · p = parágrafo"],
        },
        {
          id: "5-html-2",
          emoji: "📰",
          title: "Tags de Texto: dando vida às palavras",
          summary: "Títulos, subtítulos e parágrafos são a base de qualquer site.",
          content: [
            { heading: "Hierarquia de títulos", text: "h1 é o título principal da página (maior). h2 é subtítulo de seção. h3 é ainda menor. Use apenas um h1 por página. Para texto normal use p. Para negrito: <strong>. Para itálico: <em>." },
            { heading: "Reconhecimento de Padrões", text: "Todas as tags HTML seguem o mesmo padrão: tag de abertura, conteúdo, tag de fechamento. <h1>título</h1>, <p>texto</p>, <strong>negrito</strong>. O padrão é sempre o mesmo." },
            { heading: "Na prática", text: "Crie uma página de notícias com h1 para o nome do jornal, dois h2 para manchetes, e p para o texto. Use <strong> para destacar informações importantes e <em> para nomes." },
          ],
          keyPoints: ["h1 (maior) → h2 → h3 (menor)", "<strong> = negrito · <em> = itálico", "Padrão: <tag>conteúdo</tag>"],
        },
        {
          id: "5-html-3",
          emoji: "🔗",
          title: "Links e Imagens: conectando o mundo",
          summary: "Aprenda a inserir fotos e criar links clicáveis em suas páginas.",
          content: [
            { heading: "Imagens", text: "Para inserir imagem: <img src='endereço' alt='descrição'>. O src é o endereço (URL) da imagem na internet. O alt descreve a imagem — importante para acessibilidade. A tag img não tem fechamento separado." },
            { heading: "Links", text: "Para criar link: <a href='endereço'>texto visível</a>. O href é o endereço do destino. O texto entre <a> e </a> é o que aparece sublinhado. Para pegar o endereço de uma imagem: botão direito → Copiar endereço da imagem." },
            { heading: "Abstração", text: "Abstração é usar algo sem entender todos os detalhes internos. Quando você usa src='https://...', aplica abstração: não precisa saber como a foto está armazenada no servidor — só precisa do endereço." },
          ],
          keyPoints: ["<img src='' alt=''> para imagens", "<a href=''>texto</a> para links", "URL = endereço do arquivo na internet"],
        },
        {
          id: "5-html-4",
          emoji: "🌐",
          title: "Projeto: Quem Sou Eu",
          summary: "Crie sua primeira página real na internet e compartilhe com a família.",
          content: [
            { heading: "O projeto", text: "Use todas as tags aprendidas: h1 para seu nome, h2 para seções (O que gosto, Meu lugar favorito, Minha mensagem), p para os textos, strong e em para destaques, img para uma foto, e a para um link. Mínimo de 4 seções." },
            { heading: "Audiência real", text: "Depois de terminar, publique na galeria da plataforma e envie o link pelo WhatsApp para alguém da sua família. Sua página é real — qualquer pessoa com o link pode acessar e ver." },
            { heading: "Pensamento Computacional aplicado", text: "Você usou decomposição (dividiu a página em seções), reconhecimento de padrões (mesma estrutura de tag em todas as aulas) e abstração (usou URLs sem precisar entender os servidores)." },
          ],
          keyPoints: ["Publique e compartilhe o link com a família", "100 XP ao publicar + 120 XP bônus de módulo", "h1 → h2 → p → img → a"],
        },
      ],
    },
  ],
  6: [
    {
      id: "m0-6",
      title: "CSS Fundamental",
      description: "Dê estilo e identidade visual às suas páginas HTML",
      color: "from-cyan-500 to-blue-500",
      lessons: [
        {
          id: "6-css-1",
          emoji: "🎨",
          title: "Primeiros Seletores: apontando para o alvo certo",
          summary: "Aprenda a apontar para qualquer parte de uma página e mudar sua aparência.",
          content: [
            { heading: "Por que isso importa?", text: "HTML diz o que tem na página. CSS diz como parece. Toda a diferença visual entre um site feito no Notepad e um site profissional é CSS. É o CSS que faz sites bonitos." },
            { heading: "Como funciona", text: "CSS fica dentro de uma tag <style> no <head>. O formato é sempre: seletor { propriedade: valor; }. O seletor aponta para quem vai receber o estilo. h1 {} aplica a todos os h1. .classe {} aplica a todos que têm essa classe. #id {} aplica a um único elemento." },
            { heading: "Reconhecimento de Padrões", text: "CSS segue sempre o mesmo padrão: seletor + chaves + propriedade + dois-pontos + valor + ponto-e-vírgula. h1 { color: blue; }. p { font-size: 16px; }. Uma vez que você reconhece o padrão, qualquer propriedade CSS fica mais fácil." },
            { heading: "Na prática", text: "Crie uma página sobre estados do Brasil. Use CSS para dar uma cor diferente para cada estado usando classes (.estado-sp, .estado-ba). Explore cores: red, blue, darkgreen, crimson, teal, coral, navy, orange." },
          ],
          keyPoints: ["CSS: seletor { propriedade: valor; }", "Seletor de elemento = afeta todos iguais", "Classe (.) = grupo · ID (#) = elemento único"],
        },
        {
          id: "6-css-2",
          emoji: "✍️",
          title: "Tipografia e Espaçamento: texto com personalidade",
          summary: "O mesmo texto pode parecer um contrato jurídico ou um convite de festa — dependendo só do CSS.",
          content: [
            { heading: "Por que isso importa?", text: "Tipografia é uma das ferramentas mais poderosas do design. Sites de banco e sites de música usam letras completamente diferentes para comunicar personalidades diferentes." },
            { heading: "Propriedades de texto", text: "font-family define a fonte (Arial, Georgia, Courier New). font-size define o tamanho em pixels. font-weight: bold para negrito. line-height para espaçamento entre linhas (1.6 é confortável). text-align para centralizar, alinhar à esquerda ou direita." },
            { heading: "Espaçamento", text: "margin é o espaço externo ao redor do elemento (empurra outros elementos para longe). padding é o espaço interno dentro do elemento (afasta o conteúdo das bordas). A diferença: margin fica fora, padding fica dentro." },
            { heading: "Abstração", text: "font-family: 'Georgia' abstrai uma família tipográfica inteira (com centenas de variações) em uma única palavra. Você usa a fonte sem saber como está armazenada no sistema operacional." },
          ],
          keyPoints: ["font-family · font-size · font-weight · line-height", "margin = fora do elemento", "padding = dentro do elemento"],
        },
        {
          id: "6-css-3",
          emoji: "📦",
          title: "Box Model: tudo é uma caixa",
          summary: "Toda a internet é construída com caixas invisíveis. Aprenda a usá-las.",
          content: [
            { heading: "Por que isso importa?", text: "O Instagram é uma grade de caixas. Cada post é uma caixa. Os stories são caixas. Os botões são caixas. Entender o Box Model é entender a fundação de qualquer layout na web." },
            { heading: "As 4 camadas", text: "Todo elemento HTML é uma caixa com 4 camadas, de dentro para fora: Content (o conteúdo), Padding (espaço interno entre conteúdo e borda), Border (a borda visível ou invisível), Margin (espaço externo entre este elemento e outros)." },
            { heading: "Criando cards", text: "Para criar um card: width define a largura. background-color define a cor de fundo. border: 2px solid #ccc cria uma borda. border-radius: 12px arredonda os cantos. padding: 24px cria espaço interno confortável. margin: 20px afasta cards entre si." },
            { heading: "Decomposição", text: "Decompor um layout complexo em caixas é o que desenvolvedores fazem para construir qualquer interface. Veja qualquer site e tente identificar as caixas — header, sidebar, card, footer. Cada um tem seu box model." },
          ],
          keyPoints: ["Content → Padding → Border → Margin", "padding = texto não toca a borda", "border-radius arredonda cantos"],
        },
        {
          id: "6-css-4",
          emoji: "⚽",
          title: "Projeto: Meu Time ou Clube Favorito",
          summary: "Crie a página oficial do seu time com cores, tipografia e layout de cards.",
          content: [
            { heading: "O projeto", text: "Crie a página oficial do seu time ou clube favorito. Deve ter: header com o nome do time nas cores do uniforme, seção Sobre o clube, galeria de 3 cards de jogadores/membros com nome e posição, e CSS coerente com a identidade visual do time." },
            { heading: "Peer review", text: "Ao publicar, você avalia a página de 2 colegas e recebe avaliação dos 2 deles. A rubrica: identidade visual coerente com o time (3 pts), tipografia com hierarquia (3 pts), 3+ cards com estilo consistente (3 pts), organização e limpeza (3 pts). Mínimo 9/12 para aprovação." },
            { heading: "Display flex", text: "Para colocar os cards lado a lado, adicione ao container: display: flex; gap: 20px; flex-wrap: wrap. O display flex é o que coloca elementos em linha automaticamente." },
            { heading: "XP disponível", text: "100 XP ao publicar na galeria + 120 XP bônus ao completar o Módulo CSS inteiro. Total possível: 220 XP." },
          ],
          keyPoints: ["Use as cores do uniforme em toda a página", "display: flex coloca cards lado a lado", "100 XP ao publicar + 120 XP bônus"],
        },
      ],
    },
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
      id: "m0-7",
      title: "CSS Fundamental",
      description: "Dê estilo e identidade visual às suas páginas HTML",
      color: "from-cyan-500 to-blue-500",
      lessons: [
        {
          id: "7-css-1",
          emoji: "🎨",
          title: "Primeiros Seletores: apontando para o alvo certo",
          summary: "Aprenda a apontar para qualquer parte de uma página e mudar sua aparência.",
          content: [
            { heading: "Por que isso importa?", text: "HTML diz o que tem na página. CSS diz como parece. Toda a diferença visual entre um site feito no Notepad e um site profissional é CSS. É o CSS que faz sites bonitos." },
            { heading: "Como funciona", text: "CSS fica dentro de uma tag <style> no <head>. O formato é sempre: seletor { propriedade: valor; }. O seletor aponta para quem vai receber o estilo. h1 {} aplica a todos os h1. .classe {} aplica a todos que têm essa classe. #id {} aplica a um único elemento." },
            { heading: "Reconhecimento de Padrões", text: "CSS segue sempre o mesmo padrão: seletor + chaves + propriedade + dois-pontos + valor + ponto-e-vírgula. h1 { color: blue; }. p { font-size: 16px; }. Uma vez que você reconhece o padrão, qualquer propriedade CSS fica mais fácil." },
            { heading: "Na prática", text: "Crie uma página sobre estados do Brasil. Use CSS para dar uma cor diferente para cada estado usando classes (.estado-sp, .estado-ba). Explore cores: red, blue, darkgreen, crimson, teal, coral, navy, orange." },
          ],
          keyPoints: ["CSS: seletor { propriedade: valor; }", "Seletor de elemento = afeta todos iguais", "Classe (.) = grupo · ID (#) = elemento único"],
        },
        {
          id: "7-css-2",
          emoji: "✍️",
          title: "Tipografia e Espaçamento: texto com personalidade",
          summary: "O mesmo texto pode parecer um contrato jurídico ou um convite de festa — dependendo só do CSS.",
          content: [
            { heading: "Por que isso importa?", text: "Tipografia é uma das ferramentas mais poderosas do design. Sites de banco e sites de música usam letras completamente diferentes para comunicar personalidades diferentes." },
            { heading: "Propriedades de texto", text: "font-family define a fonte (Arial, Georgia, Courier New). font-size define o tamanho em pixels. font-weight: bold para negrito. line-height para espaçamento entre linhas (1.6 é confortável). text-align para centralizar, alinhar à esquerda ou direita." },
            { heading: "Espaçamento", text: "margin é o espaço externo ao redor do elemento (empurra outros elementos para longe). padding é o espaço interno dentro do elemento (afasta o conteúdo das bordas). A diferença: margin fica fora, padding fica dentro." },
            { heading: "Abstração", text: "font-family: 'Georgia' abstrai uma família tipográfica inteira (com centenas de variações) em uma única palavra. Você usa a fonte sem saber como está armazenada no sistema operacional." },
          ],
          keyPoints: ["font-family · font-size · font-weight · line-height", "margin = fora do elemento", "padding = dentro do elemento"],
        },
        {
          id: "7-css-3",
          emoji: "📦",
          title: "Box Model: tudo é uma caixa",
          summary: "Toda a internet é construída com caixas invisíveis. Aprenda a usá-las.",
          content: [
            { heading: "Por que isso importa?", text: "O Instagram é uma grade de caixas. Cada post é uma caixa. Os stories são caixas. Os botões são caixas. Entender o Box Model é entender a fundação de qualquer layout na web." },
            { heading: "As 4 camadas", text: "Todo elemento HTML é uma caixa com 4 camadas, de dentro para fora: Content (o conteúdo), Padding (espaço interno entre conteúdo e borda), Border (a borda visível ou invisível), Margin (espaço externo entre este elemento e outros)." },
            { heading: "Criando cards", text: "Para criar um card: width define a largura. background-color define a cor de fundo. border: 2px solid #ccc cria uma borda. border-radius: 12px arredonda os cantos. padding: 24px cria espaço interno confortável. margin: 20px afasta cards entre si." },
            { heading: "Decomposição", text: "Decompor um layout complexo em caixas é o que desenvolvedores fazem para construir qualquer interface. Veja qualquer site e tente identificar as caixas — header, sidebar, card, footer. Cada um tem seu box model." },
          ],
          keyPoints: ["Content → Padding → Border → Margin", "padding = texto não toca a borda", "border-radius arredonda cantos"],
        },
        {
          id: "7-css-4",
          emoji: "⚽",
          title: "Projeto: Meu Time ou Clube Favorito",
          summary: "Crie a página oficial do seu time com cores, tipografia e layout de cards.",
          content: [
            { heading: "O projeto", text: "Crie a página oficial do seu time ou clube favorito. Deve ter: header com o nome do time nas cores do uniforme, seção Sobre o clube, galeria de 3 cards de jogadores/membros com nome e posição, e CSS coerente com a identidade visual do time." },
            { heading: "Peer review", text: "Ao publicar, você avalia a página de 2 colegas e recebe avaliação dos 2 deles. A rubrica: identidade visual coerente com o time (3 pts), tipografia com hierarquia (3 pts), 3+ cards com estilo consistente (3 pts), organização e limpeza (3 pts). Mínimo 9/12 para aprovação." },
            { heading: "Display flex", text: "Para colocar os cards lado a lado, adicione ao container: display: flex; gap: 20px; flex-wrap: wrap. O display flex é o que coloca elementos em linha automaticamente." },
            { heading: "XP disponível", text: "100 XP ao publicar na galeria + 120 XP bônus ao completar o Módulo CSS inteiro. Total possível: 220 XP." },
          ],
          keyPoints: ["Use as cores do uniforme em toda a página", "display: flex coloca cards lado a lado", "100 XP ao publicar + 120 XP bônus"],
        },
      ],
    },
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
      id: "m0-8",
      title: "CSS Avançado",
      description: "Flexbox, Grid, Responsividade, Animações e Pseudo-classes",
      color: "from-violet-500 to-cyan-400",
      lessons: [
        {
          id: "8-css-1",
          emoji: "📐",
          title: "Flexbox Completo: organizando o espaço",
          summary: "Aprenda a distribuir elementos em linha ou coluna com controle total do espaçamento.",
          content: [
            { heading: "Por que isso importa?", text: "Todos os grandes sites brasileiros — UOL, G1, Globo — usam Flexbox para organizar seus layouts. Barras de navegação, galeria de manchetes, cards lado a lado: tudo Flexbox." },
            { heading: "Como funciona", text: "Adicione display: flex ao container pai. Os filhos diretos ficam em linha automaticamente. flex-direction: row (padrão, linha) ou column (coluna). justify-content distribui o espaço no eixo principal: flex-start, center, flex-end, space-between, space-around. align-items alinha no eixo cruzado: flex-start, center, flex-end." },
            { heading: "Gap e flex-wrap", text: "gap: 20px cria espaço entre os filhos (substitui margin entre itens). flex-wrap: wrap permite que os itens quebrem para a linha de baixo quando não há espaço — essencial para layouts responsivos." },
            { heading: "Reconhecimento de Padrões", text: "Todo layout Flexbox segue o mesmo padrão: (1) container recebe display: flex, (2) justify-content distribui horizontalmente, (3) align-items alinha verticalmente. Reconhecer esse padrão significa que qualquer layout Flexbox que você encontrar fica legível." },
          ],
          keyPoints: ["display: flex no container pai", "justify-content distribui horizontalmente", "align-items alinha verticalmente · gap = espaço entre filhos"],
        },
        {
          id: "8-css-2",
          emoji: "🗂️",
          title: "CSS Grid: o tabuleiro de xadrez do layout",
          summary: "Crie layouts em grade com linhas e colunas — como a tabela de classificação do campeonato.",
          content: [
            { heading: "Por que isso importa?", text: "Layouts de revista, portais de notícias, galerias de fotos — todos usam CSS Grid. Grid é o sistema de layout mais poderoso do CSS, permitindo controle total de linhas e colunas." },
            { heading: "Como funciona", text: "Adicione display: grid ao container. grid-template-columns define as colunas: repeat(3, 1fr) cria 3 colunas iguais. 2fr 1fr 1fr cria proporções 50%/25%/25%. gap: 20px adiciona espaço entre as células. Os filhos do grid preenchem as células automaticamente." },
            { heading: "Posicionamento", text: "Um item pode ocupar mais de uma célula: grid-column: 1 / 3 faz o item ocupar da coluna 1 até a 3. grid-row: 1 / 2 define as linhas. Isso permite criar manchetes principais que se destacam sobre as notícias secundárias." },
            { heading: "Decomposição", text: "Decomposição aplicada ao Grid: antes de escrever o CSS, esboce no papel quantas colunas e linhas você precisa, e quais células precisam de span. Decompor o layout em células é o primeiro passo de qualquer projeto com Grid." },
          ],
          keyPoints: ["display: grid no container", "grid-template-columns: repeat(3, 1fr)", "grid-column: 1/3 faz item ocupar 2 células"],
        },
        {
          id: "8-css-3",
          emoji: "📱",
          title: "Responsividade: design para qualquer tela",
          summary: "Crie páginas que ficam perfeitas no celular e no computador.",
          content: [
            { heading: "Por que isso importa?", text: "Mais de 70% dos acessos à internet no Brasil são pelo celular. Uma página que não funciona em mobile não funciona para a maioria dos brasileiros." },
            { heading: "Media Queries", text: "@media (min-width: 600px) { } — o CSS dentro das chaves só é aplicado quando a tela tem 600px ou mais. Mobile-first: escreva o CSS padrão para telas pequenas e use min-width para sobrescrever em telas maiores." },
            { heading: "Na prática", text: "CSS base (mobile): .grid { grid-template-columns: 1fr; } — 1 coluna. @media (min-width: 600px) { .grid { grid-template-columns: repeat(2, 1fr); } } — 2 colunas em tablet. @media (min-width: 900px) { .grid { grid-template-columns: repeat(3, 1fr); } } — 3 colunas em desktop." },
            { heading: "Abstração", text: "Media queries aplicam abstração: em vez de tratar cada celular separadamente (iPhone 14, Samsung A23, Motorola G82), você trata todos como 'tela menor que 600px'. Abstrai os detalhes irrelevantes e foca no que importa: a largura." },
          ],
          keyPoints: ["Mobile-first: CSS padrão para mobile, min-width para desktop", "@media (min-width: Xpx) { }", "viewport: adicione <meta name='viewport'> no HTML"],
        },
        {
          id: "8-css-4",
          emoji: "✨",
          title: "Animações CSS: movimento com código",
          summary: "Crie transições suaves e animações sem nenhuma linha de JavaScript.",
          content: [
            { heading: "Por que isso importa?", text: "O spinner de carregamento do iFood, a animação do logo do Google, o pulso do coração no Instagram — muito disso é CSS puro. JavaScript controla lógica; CSS controla aparência, incluindo aparência em movimento." },
            { heading: "Transition", text: "transition define como uma propriedade muda suavemente quando o estado muda. Exemplo: transition: background-color 0.3s ease. Quando o :hover acontece, a cor muda em 0.3 segundos com curva suave. Sintaxe: transition: [propriedade] [duração] [timing]." },
            { heading: "Animation e @keyframes", text: "@keyframes define os estados da animação: from { opacity: 0; } to { opacity: 1; }. animation aplica ao elemento: animation: fadeIn 1s ease-out forwards. Diferente do transition, animation começa sozinha — sem precisar de interação do usuário." },
            { heading: "Reconhecimento de Padrões", text: "Toda animação CSS segue o padrão: (1) definir estados com @keyframes, (2) aplicar com animation. Toda transição: (1) qual propriedade muda, (2) em quanto tempo, (3) com qual curva. Reconhecer esse padrão torna qualquer animação CSS legível." },
          ],
          keyPoints: ["transition = muda suavemente ao hover", "@keyframes + animation = começa sozinha", "ease = suave · linear = constante · forwards = mantém estado final"],
        },
        {
          id: "8-css-5",
          emoji: "🖱️",
          title: "Pseudo-classes: CSS que responde ao usuário",
          summary: "Faça o CSS responder ao que o usuário está fazendo — sem JavaScript.",
          content: [
            { heading: "Por que isso importa?", text: "Quando você clica num campo de formulário e ele fica com borda azul, quando o mouse passa sobre um botão e ele escurece — isso é CSS respondendo ao estado do elemento. Sem JavaScript." },
            { heading: "Pseudo-classes principais", text: ":hover — SE o mouse está sobre o elemento ENTÃO aplique este estilo. :focus — SE o campo está ativo (clicado). :active — SE está sendo clicado agora. :visited — SE o link já foi visitado. :nth-child(odd) — os elementos em posição ímpar. :first-child e :last-child para primeiro e último." },
            { heading: "Pensamento Algorítmico", text: "Pensamento algorítmico é organizar ações em sequências de condições: SE [estado] ENTÃO [ação]. As pseudo-classes CSS implementam exatamente isso: SE :hover ENTÃO { background-color: darkblue; }. É lógica condicional escrita em CSS." },
            { heading: "Na prática", text: "Menu de navegação: .link:hover { color: white; background: rgba(255,255,255,0.1); }. Formulário: input:focus { border-color: #3498db; box-shadow: 0 0 8px rgba(52,152,219,0.3); }. Lista: li:nth-child(odd) { background: #f5f5f5; } para zebra striping." },
          ],
          keyPoints: [":hover (mouse sobre) · :focus (campo ativo) · :active (clicando)", ":nth-child(odd/even) para padrão zebra", "Pensamento algorítmico: SE estado ENTÃO estilo"],
        },
        {
          id: "8-css-6",
          emoji: "💼",
          title: "Projeto: Meu Portfólio Digital",
          summary: "Crie a primeira página que você pode usar de verdade — num processo seletivo ou para mostrar à família.",
          content: [
            { heading: "Por que isso importa?", text: "Um portfólio digital é o que profissionais de tecnologia, design e comunicação usam para mostrar o que sabem fazer. Não é currículo em PDF — é código rodando no navegador, projetos que podem ser clicados." },
            { heading: "O projeto", text: "Crie seu portfólio com: header com seu nome e uma animação de entrada, seção Sobre mim com Flexbox, grade de projetos com CSS Grid mostrando seus trabalhos dos módulos anteriores, responsivo (1 coluna no mobile, 2-3 colunas no desktop), e hover com animação nos cards." },
            { heading: "Pensamento Computacional integrado", text: "Você usou Decomposição (header, sobre, projetos, rodapé como partes independentes), Reconhecimento de padrões (mesmo estilo em todos os cards), Abstração (media queries tratam todos os celulares como 'tela pequena') e Pensamento algorítmico (SE mobile ENTÃO 1 coluna)." },
            { heading: "Audiência autêntica", text: "Publique na galeria da plataforma, compartilhe com a família, e — se quiser — use como portfólio real em qualquer processo seletivo. 100 XP ao publicar + 120 XP bônus de conclusão do Módulo CSS Avançado." },
          ],
          keyPoints: ["Grid para layout geral + Flex para componentes", "Responsivo: 1 col mobile → 3 cols desktop", "100 XP ao publicar + 120 XP bônus"],
        },
      ],
    },
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
