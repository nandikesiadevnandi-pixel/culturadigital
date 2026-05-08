import { useRef, useState } from "react";
import { Printer, Plus, Trash2, FileImage, FileDown, Upload } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import brasaoCanela from "@/assets/brasao-canela.png";

type ActivityRow = {
  data: string;
  escola: string;
  turmas: string;
  atividades: string;
};

type TurmaRow = { turma: string; alunos: string };

type SchoolBlock = {
  nome: string;
  diaSemana: string;
  observacao: string;
  turmas: TurmaRow[];
};

type Relatorio = {
  titulo: string;
  periodo: string;
  escolasAtendidas: string;
  credenciada: string;
  cnpj: string;
  contrato: string;
  oficina: string;
  oficineira: string;
  cargaTema: string;
  introducao: string;
  objetivos: string;
  schools: SchoolBlock[];
  activities: ActivityRow[];
  consideracoes: string;
  encaminhamentos: string;
  cidadeData: string;
  assinanteNome: string;
  assinaturaImg?: string;
};

const initial: Relatorio = {
  titulo: "RELATÓRIO DE ATIVIDADES\nOFICINAS DE CULTURA DIGITAL – ABRIL/2026",
  periodo: "Abril de 2026",
  escolasAtendidas: "Escolas atendidas: EMEF Bertholdo Oppitz, EMEF Ernesto Dorneles e EMEF Dante Bertoluci",
  credenciada: "Interação Comunicação e Marketing Ltda",
  cnpj: "40.949.328/0001-73",
  contrato: "4397",
  oficina: "22535",
  oficineira: "Késia Weige Nandi",
  cargaTema: "50h aula",
  introducao:
    "O presente relatório sistematiza as atividades desenvolvidas nas Oficinas de Cultura Digital realizadas no contraturno escolar, ao longo do mês de abril de 2026, nas escolas municipais Bertholdo Oppitz e Dante Bertoluci, no município de Canela/RS. No período, o trabalho concentrou-se na organização inicial da oferta, no reconhecimento das condições técnicas de atendimento, na alfabetização digital introdutória, na abordagem de noções básicas de lógica de programação e no primeiro contato dos estudantes com ferramentas como conta Google e Scratch, com ajustes metodológicos e operacionais definidos em diálogo com cada escola.",
  objetivos:
    "As atividades priorizaram a compreensão inicial do que é tecnologia, para que ela serve, como organizar comandos em sequência e como utilizar recursos digitais de maneira orientada e progressiva. O percurso do mês combinou alinhamento institucional, reconhecimento da infraestrutura disponível, definição de protocolos de uso dos equipamentos e desenvolvimento das primeiras atividades práticas com os estudantes.",
  schools: [
    {
      nome: "EMEF Bertholdo Oppitz",
      diaSemana: "Sexta-feira",
      observacao:
        "As turmas são atendidas em sistema de rodízio quinzenal, definidos pela escola. As oficinas têm em média 50min efetivos para compensar os períodos de intervalo para lanche, recreio e para não prejudicar os alunos que saem às 16h45 com o transporte escolar.",
      turmas: [
        { turma: "6º A", alunos: "32" },
        { turma: "6º B", alunos: "32" },
        { turma: "7º A", alunos: "28" },
        { turma: "7º B", alunos: "30" },
        { turma: "8º A", alunos: "22" },
        { turma: "8º B", alunos: "25" },
      ],
    },
    {
      nome: "EMEF Dante Bertoluci",
      diaSemana: "Sexta-feira",
      observacao:
        "Atendimento reorganizado para sexta-feira. Inicialmente, o atendimento seria realizado às terças-feiras, a partir de 07/04.",
      turmas: [
        { turma: "141", alunos: "" },
        { turma: "142", alunos: "" },
        { turma: "151", alunos: "" },
        { turma: "152", alunos: "" },
        { turma: "Total", alunos: "118" },
      ],
    },
    {
      nome: "EMEF Ernesto Dorneles",
      diaSemana: "Segunda-feira",
      observacao:
        "Início do atendimento em maio de 2026. Cada estudante recebeu um número fixo, ficando responsável sempre pelo mesmo notebook ao longo das oficinas.",
      turmas: [
        { turma: "5º ano", alunos: "" },
        { turma: "6º ano", alunos: "" },
        { turma: "7º ano", alunos: "" },
        { turma: "8º ano", alunos: "" },
      ],
    },
  ],
  activities: [
    {
      data: "06/04",
      escola: "EMEF Bertholdo Oppitz",
      turmas: "6ºB, 7ºA, 7ºB, 8ºA e 8ºB",
      atividades:
        "Início do ciclo de oficinas com apresentação da proposta de Cultura Digital, sensibilização sobre o que é tecnologia e para que ela serve, além de introdução à lógica de programação por meio do exemplo da receita do bolo, trabalhando noções iniciais de algoritmo e sequência de comandos com as turmas atendidas no primeiro rodízio. A escola não possuía computadores nesse dia e o trabalho foi todo desconectado.",
    },
    {
      data: "07/04",
      escola: "EMEF Dante Bertoluci",
      turmas: "Equipe gestora, OP, prof. Daise e turmas observadas",
      atividades:
        "Visita de reconhecimento e alinhamento institucional com o diretor André, a vice-diretora Andressa, a equipe de orientação pedagógica e a professora Daise. Definiu-se que a oficina de Cultura Digital assumiria a alfabetização digital das turmas de 4º e 5º anos como laboratório de teste, com possibilidade de ampliação futura para 3º anos, e que o atendimento passaria para as sextas-feiras. Acompanhamento de duas turmas atendidas pela professora Daise. Recebimento dos novos computadores e identificação da ausência dos drivers da placa Wi-Fi. Definição de protocolo de uso dos equipamentos.",
    },
    {
      data: "13/04",
      escola: "EMEF Bertholdo Oppitz",
      turmas: "6ºA, 7ºA, 7ºB, 8ºA e 8ºB",
      atividades:
        "Apoio na instalação, organização e configuração inicial dos novos Chromebooks recebidos pela escola. Identificação da ausência dos drivers de Wi-Fi, estabelecimento de protocolo de uso, guarda, conferência e preparação prévia dos equipamentos. Aguardo da equipe de TI da Secretaria para configuração da rede e dos softwares. Preparação da plataforma digital de acompanhamento evolutivo dos alunos e atendimento offline.",
    },
    {
      data: "17/04",
      escola: "EMEF Dante Bertoluci",
      turmas: "141, 142, 151 e 152",
      atividades:
        "Semana 1 de atendimento efetivo após reorganização do cronograma. Aula introdutória de alfabetização digital com introdução à lógica de programação a partir da metáfora da receita do bolo: primeiros conceitos de algoritmo, sequência de comandos e organização do pensamento computacional.",
    },
    {
      data: "24/04",
      escola: "EMEF Dante Bertoluci",
      turmas: "141, 142, 151 e 152",
      atividades:
        "Semana 2. Criação e uso da conta Google e primeiro contato com a plataforma Scratch, com exploração do ambiente, compreensão de comandos simples e construção orientada de um primeiro jogo, respeitando o nível de alfabetização digital das turmas.",
    },
    {
      data: "27/04",
      escola: "EMEF Bertholdo Oppitz",
      turmas: "6ºB, 7ºA, 7ºB, 8ºA, 8ºB",
      atividades:
        "Retomada da aula de lógica de programação com inserção do uso de computadores. Ensino sobre o bom manuseio e protocolo de responsabilidade. Criação e uso da conta Google e primeiro contato com o Scratch.",
    },
    {
      data: "30/04",
      escola: "EMEF Dante Bertoluci",
      turmas: "141, 142, 151 e 152",
      atividades:
        "Semana 3, antecipada para quinta-feira em função do feriado. Retomada dos conteúdos das semanas anteriores e atividade de revisão/avaliação diagnóstica sobre o que os estudantes aprenderam de tecnologia, lógica de programação, comandos e uso inicial das ferramentas digitais.",
    },
    {
      data: "07/05",
      escola: "EMEF Dante Bertoluci",
      turmas: "141, 142, 151 e 152",
      atividades:
        "Aula prática no Scratch com aprofundamento em estruturas de programação: trabalho com os blocos de entrada e saída (eventos de teclado/mouse e respostas do palco) e introdução à estrutura condicional 'SE... ENTÃO', que permite ao programa tomar decisões a partir de uma condição. A lógica foi explicada por meio da dinâmica do Jogo da Maçã: o personagem (cesto) se move com as setas do teclado (entrada) e, sempre que toca a maçã que cai do céu (condição), o programa executa a ação 'SE tocar na maçã, ENTÃO some a maçã, soma 1 ponto e reaparece em posição aleatória' (saída). Esse exemplo ajudou os estudantes a visualizarem, na prática, como combinar entrada de comandos, verificação de condições e respostas do programa, consolidando a noção de que programar é ensinar o computador a decidir o que fazer em cada situação.",
    },
    {
      data: "05/05",
      escola: "EMEF Ernesto Dorneles",
      turmas: "5º, 6º, 7º e 8º ano",
      atividades:
        "Primeira aula na escola. Conversa inicial sobre o cuidado com os notebooks recém-recebidos: cada estudante recebeu um número fixo e ficará sempre responsável pelo mesmo equipamento, com orientações sobre transporte, abertura, guarda e limpeza. Reconhecimento das principais funções do notebook (ligar/desligar, área de trabalho, teclado, touchpad, navegador e contas de usuário). Em seguida, aula sobre Segurança Digital: o que é segurança no uso da tecnologia, cuidados com senhas, dados pessoais, links e contatos desconhecidos. A turma foi organizada em grupos para a realização de trabalhos colaborativos sobre o tema, estimulando troca de ideias e construção coletiva do conceito de segurança digital.",
    },
  ],
  consideracoes:
    "O trabalho desenvolvido em abril demonstrou a relevância da oficina de Cultura Digital como espaço de iniciação tecnológica e pensamento computacional no contraturno escolar. Mesmo em um cenário inicial de implantação, com necessidade de ajustes de agenda e de infraestrutura, foi possível estabelecer bases pedagógicas consistentes para a continuidade do trabalho nas duas escolas atendidas. O mês teve forte componente de organização institucional e técnica, especialmente em função da chegada dos novos equipamentos, da ausência de drivers de conectividade e da necessidade de pactuar protocolos de uso e divisão do laboratório.",
  encaminhamentos:
    "Recomenda-se a continuidade do percurso formativo com aprofundamento progressivo em alfabetização digital, uso orientado de contas institucionais, ampliação das práticas no Scratch, acompanhamento sistemático da operacionalização dos laboratórios e registro contínuo das próximas etapas em diário de campo, de modo a fortalecer a memória pedagógica do projeto e subsidiar futuras prestações de contas.",
  cidadeData: "Canela/RS, 03 de maio de 2026",
  assinanteNome: "KESIA WEIGE NANDI",
};

const PASS_KEY = "cd_admin_pass";

// Editable text helpers
const EditableInput = ({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) => (
  <input
    className={`bg-transparent outline-none w-full ${className}`}
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

const EditableArea = ({
  value,
  onChange,
  className = "",
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  rows?: number;
}) => (
  <textarea
    className={`bg-transparent outline-none w-full resize-none leading-snug ${className}`}
    value={value}
    rows={Math.max(rows, Math.ceil(value.length / 110))}
    onChange={(e) => onChange(e.target.value)}
  />
);

export default function FolhaRegistroPage() {
  const [authed, setAuthed] = useState(!!sessionStorage.getItem(PASS_KEY));
  const [pwd, setPwd] = useState(sessionStorage.getItem(PASS_KEY) || "");
  const [r, setR] = useState<Relatorio>(initial);
  const sheetRef = useRef<HTMLDivElement>(null);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.trim().length < 3) return;
    sessionStorage.setItem(PASS_KEY, pwd);
    setAuthed(true);
  };

  const update = <K extends keyof Relatorio>(k: K, v: Relatorio[K]) =>
    setR((p) => ({ ...p, [k]: v }));

  const updateActivity = (i: number, k: keyof ActivityRow, v: string) =>
    setR((p) => {
      const next = structuredClone(p);
      next.activities[i][k] = v;
      return next;
    });

  const addActivity = () =>
    setR((p) => ({
      ...p,
      activities: [...p.activities, { data: "", escola: "", turmas: "", atividades: "" }],
    }));

  const removeActivity = (i: number) =>
    setR((p) => {
      const next = structuredClone(p);
      next.activities.splice(i, 1);
      return next;
    });

  const updateSchool = (si: number, field: keyof SchoolBlock, v: string) =>
    setR((p) => {
      const next = structuredClone(p);
      (next.schools[si] as any)[field] = v;
      return next;
    });

  const updateTurma = (si: number, ti: number, k: keyof TurmaRow, v: string) =>
    setR((p) => {
      const next = structuredClone(p);
      next.schools[si].turmas[ti][k] = v;
      return next;
    });

  const addTurma = (si: number) =>
    setR((p) => {
      const next = structuredClone(p);
      next.schools[si].turmas.push({ turma: "", alunos: "" });
      return next;
    });

  const removeTurma = (si: number, ti: number) =>
    setR((p) => {
      const next = structuredClone(p);
      next.schools[si].turmas.splice(ti, 1);
      return next;
    });

  const onSignatureUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => update("assinaturaImg", reader.result as string);
    reader.readAsDataURL(file);
  };

  const captureCanvas = async () => {
    if (!sheetRef.current) return null;
    return await html2canvas(sheetRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });
  };

  const saveAsImage = async () => {
    const canvas = await captureCanvas();
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `Relatorio_${r.periodo.replace(/\s+/g, "_")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const saveAsPDF = async () => {
    const canvas = await captureCanvas();
    if (!canvas) return;
    const pdf = new jsPDF("p", "mm", "a4");
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgW = pageW;
    const imgH = (canvas.height * imgW) / canvas.width;
    let heightLeft = imgH;
    let position = 0;
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, position, imgW, imgH);
    heightLeft -= pageH;
    while (heightLeft > 0) {
      position = heightLeft - imgH;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgW, imgH);
      heightLeft -= pageH;
    }
    pdf.save(`Relatorio_${r.periodo.replace(/\s+/g, "_")}.pdf`);
  };

  if (!authed) {
    return (
      <div className="container max-w-md py-20">
        <h1 className="font-display text-2xl font-extrabold mb-4">Relatório — acesso</h1>
        <form onSubmit={handleAuth} className="space-y-3">
          <Input type="password" placeholder="Senha do admin" value={pwd} onChange={(e) => setPwd(e.target.value)} />
          <Button type="submit" className="w-full">Entrar</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 py-8 print:bg-white print:py-0 min-h-screen">
      <style>{`
        @media print {
          @page { size: A4; margin: 12mm; }
          body { background: white; }
          .no-print { display: none !important; }
          .sheet { box-shadow: none !important; padding: 0 !important; }
        }
      `}</style>

      <div className="container max-w-5xl no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold">Relatório Mensal de Atividades</h1>
          <p className="text-sm text-muted-foreground">
            Edite qualquer campo. Salve como PDF, imagem ou imprima. Anexe a assinatura do gov.br se quiser.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && onSignatureUpload(e.target.files[0])}
            />
            <span className="inline-flex items-center gap-2 h-9 px-3 rounded-md border bg-background hover:bg-accent text-sm">
              <Upload className="h-4 w-4" /> Assinatura gov.br
            </span>
          </label>
          <Button variant="outline" onClick={saveAsImage} className="gap-2">
            <FileImage className="h-4 w-4" /> Salvar imagem
          </Button>
          <Button variant="outline" onClick={saveAsPDF} className="gap-2">
            <FileDown className="h-4 w-4" /> Salvar PDF
          </Button>
          <Button onClick={() => window.print()} className="gap-2">
            <Printer className="h-4 w-4" /> Imprimir
          </Button>
        </div>
      </div>

      <div className="container max-w-5xl">
        <div ref={sheetRef} className="sheet bg-white text-black rounded-md shadow-soft p-10 print:p-0">
          {/* Cabeçalho com brasão grande e centralizado */}
          <div className="text-center mb-6">
            <img
              src={brasaoCanela}
              alt="Brasão Prefeitura Municipal de Canela"
              className="mx-auto mb-3 h-32 w-32 object-contain"
            />
            <div className="font-bold text-sm tracking-wide">PREFEITURA MUNICIPAL DE CANELA</div>
            <div className="font-bold text-sm tracking-wide">
              SECRETARIA MUNICIPAL DE EDUCAÇÃO, ESPORTE E LAZER
            </div>
            <div className="mt-4">
              <textarea
                className="w-full text-center font-extrabold text-lg leading-tight bg-transparent outline-none resize-none"
                rows={2}
                value={r.titulo}
                onChange={(e) => update("titulo", e.target.value)}
              />
            </div>
            <div className="mt-2 text-sm">
              <EditableInput
                value={r.escolasAtendidas}
                onChange={(v) => update("escolasAtendidas", v)}
                className="text-center"
              />
            </div>
          </div>

          {/* Tabela de identificação */}
          <table className="w-full border-collapse border border-black text-sm mb-4">
            <tbody>
              {[
                ["Credenciada", "credenciada"],
                ["CNPJ", "cnpj"],
                ["Contrato", "contrato"],
                ["Cód. da Oficina", "oficina"],
                ["Oficineira", "oficineira"],
                ["Período", "periodo"],
                ["Carga horária e temática desenvolvida no mês", "cargaTema"],
              ].map(([label, key]) => (
                <tr key={key}>
                  <th className="border border-black p-2 text-left bg-gray-100 w-1/3">{label}</th>
                  <td className="border border-black p-2">
                    <EditableInput
                      value={(r as any)[key]}
                      onChange={(v) => update(key as any, v)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Introdução */}
          <div className="text-sm text-justify mb-3">
            <EditableArea value={r.introducao} onChange={(v) => update("introducao", v)} rows={4} />
          </div>
          <div className="text-sm text-justify mb-6">
            <EditableArea value={r.objetivos} onChange={(v) => update("objetivos", v)} rows={3} />
          </div>

          {/* Escolas */}
          {r.schools.map((s, si) => (
            <div key={si} className="mb-4">
              <h2 className="font-bold text-base mb-2">
                <EditableInput value={s.nome} onChange={(v) => updateSchool(si, "nome", v)} />
              </h2>
              <div className="text-xs mb-2">
                <span className="font-semibold">Dia da semana: </span>
                <input
                  className="bg-transparent outline-none border-b border-gray-300"
                  value={s.diaSemana}
                  onChange={(e) => updateSchool(si, "diaSemana", e.target.value)}
                />
              </div>
              <table className="w-full border-collapse border border-black text-xs mb-2">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-black p-1 w-1/2 text-left">Observações</th>
                    <th className="border border-black p-1 w-1/4">Turma</th>
                    <th className="border border-black p-1 w-1/4">Alunos matriculados</th>
                    <th className="border border-black p-1 w-8 no-print">—</th>
                  </tr>
                </thead>
                <tbody>
                  {s.turmas.map((t, ti) => (
                    <tr key={ti} className="align-top">
                      {ti === 0 && (
                        <td
                          className="border border-black p-2"
                          rowSpan={s.turmas.length}
                        >
                          <EditableArea
                            value={s.observacao}
                            onChange={(v) => updateSchool(si, "observacao", v)}
                            rows={5}
                          />
                        </td>
                      )}
                      <td className="border border-black p-1 text-center">
                        <EditableInput
                          value={t.turma}
                          onChange={(v) => updateTurma(si, ti, "turma", v)}
                          className="text-center"
                        />
                      </td>
                      <td className="border border-black p-1 text-center">
                        <EditableInput
                          value={t.alunos}
                          onChange={(v) => updateTurma(si, ti, "alunos", v)}
                          className="text-center"
                        />
                      </td>
                      <td className="border border-black p-1 text-center no-print">
                        <button onClick={() => removeTurma(si, ti)} className="text-red-600">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="no-print">
                <Button variant="outline" size="sm" onClick={() => addTurma(si)} className="gap-2">
                  <Plus className="h-3 w-3" /> Turma
                </Button>
              </div>
            </div>
          ))}

          {/* Quadro de atividades */}
          <h2 className="font-bold text-base mt-6 mb-2">Quadro sintético de atividades</h2>
          <table className="w-full border-collapse border border-black text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-1 w-16">Data</th>
                <th className="border border-black p-1 w-44">Escola</th>
                <th className="border border-black p-1 w-40">Turma(s)</th>
                <th className="border border-black p-1">Atividades desenvolvidas</th>
                <th className="border border-black p-1 w-8 no-print">—</th>
              </tr>
            </thead>
            <tbody>
              {r.activities.map((a, i) => (
                <tr key={i} className="align-top">
                  <td className="border border-black p-1 text-center">
                    <EditableInput value={a.data} onChange={(v) => updateActivity(i, "data", v)} className="text-center" />
                  </td>
                  <td className="border border-black p-1">
                    <EditableInput value={a.escola} onChange={(v) => updateActivity(i, "escola", v)} />
                  </td>
                  <td className="border border-black p-1">
                    <EditableInput value={a.turmas} onChange={(v) => updateActivity(i, "turmas", v)} />
                  </td>
                  <td className="border border-black p-1">
                    <EditableArea value={a.atividades} onChange={(v) => updateActivity(i, "atividades", v)} rows={3} />
                  </td>
                  <td className="border border-black p-1 text-center no-print">
                    <button onClick={() => removeActivity(i)} className="text-red-600">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="no-print mt-2">
            <Button variant="outline" size="sm" onClick={addActivity} className="gap-2">
              <Plus className="h-4 w-4" /> Adicionar atividade
            </Button>
          </div>

          {/* Considerações finais */}
          <div className="text-sm text-justify mt-6 mb-3">
            <EditableArea value={r.consideracoes} onChange={(v) => update("consideracoes", v)} rows={4} />
          </div>
          <div className="text-sm text-justify mb-8">
            <EditableArea value={r.encaminhamentos} onChange={(v) => update("encaminhamentos", v)} rows={3} />
          </div>

          {/* Assinatura */}
          <div className="mt-8 text-sm">
            <EditableInput value={r.cidadeData} onChange={(v) => update("cidadeData", v)} />
          </div>

          <div className="mt-10 mx-auto w-96 text-center">
            {r.assinaturaImg ? (
              <img src={r.assinaturaImg} alt="Assinatura" className="mx-auto max-h-32 object-contain" />
            ) : (
              <div className="h-20" />
            )}
            <div className="border-t border-black mt-2"></div>
            <div className="text-xs mt-1 font-semibold">
              <EditableInput value={r.assinanteNome} onChange={(v) => update("assinanteNome", v)} className="text-center" />
            </div>
            <div className="text-xs">Assinatura da oficineira</div>
          </div>
        </div>
      </div>
    </div>
  );
}
