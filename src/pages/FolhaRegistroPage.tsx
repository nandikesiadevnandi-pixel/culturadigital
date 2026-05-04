import { useMemo, useState } from "react";
import { Printer, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import brasaoCanela from "@/assets/brasao-canela.png";

type Row = {
  dia: string;
  mes: string;
  ano: string;
  atividade: string;
  turma: string;
  alunos: string;
};

type Folha = {
  oficina: string;
  oficineiro: string;
  escola: string;
  rows: Row[];
};

const initialFolhas: Folha[] = [
  {
    oficina: "Cultura Digital",
    oficineiro: "Késia Weige Nandi",
    escola: "Escola Bertholdo",
    rows: [
      {
        dia: "06",
        mes: "04",
        ano: "2026",
        atividade:
          "Despertar o interesse sobre lógica de programação. O que é tecnologia e para que serve. Introdução à lógica de programação usando o exemplo da receita do bolo.",
        turma: "6B, 7A, 7B, 8A, 8B",
        alunos: "108",
      },
      {
        dia: "13",
        mes: "04",
        ano: "2026",
        atividade:
          "Apoio à instalação e configuração dos 10 Chromebooks recém-chegados à escola (sem internet e sem software instalado). Aguardo da equipe de TI da Secretaria para configuração da rede e dos softwares necessários para iniciar as aulas.",
        turma: "6B, 7A, 7B, 8A, 8B",
        alunos: "108",
      },
      {
        dia: "20",
        mes: "04",
        ano: "2026",
        atividade: "SEM AULA — Feriado de Tiradentes (antecipação).",
        turma: "—",
        alunos: "—",
      },
    ],
  },
  {
    oficina: "Cultura Digital",
    oficineiro: "Késia Weige Nandi",
    escola: "Escola Dante Bertoluci",
    rows: [
      {
        dia: "07",
        mes: "04",
        ano: "2026",
        atividade:
          "Reconhecimento da escola, da equipe pedagógica e das turmas. Organização do calendário das aulas (definidas para todas as sextas-feiras).",
        turma: "141, 142, 151, 152",
        alunos: "118",
      },
      {
        dia: "17",
        mes: "04",
        ano: "2026",
        atividade:
          "Semana 1 — Introdução à lógica de programação: a receita do bolo. Primeiros conceitos de algoritmo e sequência de comandos.",
        turma: "141, 142, 151, 152",
        alunos: "118",
      },
      {
        dia: "24",
        mes: "04",
        ano: "2026",
        atividade:
          "Semana 2 — Criação/uso da conta Google e primeiro contato com o Scratch: construção de um primeiro jogo seguindo comandos simples.",
        turma: "141, 142, 151, 152",
        alunos: "118",
      },
      {
        dia: "30",
        mes: "04",
        ano: "2026",
        atividade:
          "Semana 3 (aula antecipada de quinta-feira por conta do feriado de sexta) — Retomada dos conteúdos aplicados e avaliação: o que aprenderam sobre tecnologia e lógica de programação.",
        turma: "141, 142, 151, 152",
        alunos: "118",
      },
    ],
  },
];

const PASS_KEY = "cd_admin_pass";

export default function FolhaRegistroPage() {
  const [authed, setAuthed] = useState(
    !!sessionStorage.getItem(PASS_KEY)
  );
  const [pwd, setPwd] = useState(sessionStorage.getItem(PASS_KEY) || "");
  const [folhas, setFolhas] = useState<Folha[]>(initialFolhas);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.trim().length < 3) return;
    sessionStorage.setItem(PASS_KEY, pwd);
    setAuthed(true);
  };

  const updateRow = (fi: number, ri: number, field: keyof Row, value: string) => {
    setFolhas((prev) => {
      const next = structuredClone(prev);
      next[fi].rows[ri][field] = value;
      return next;
    });
  };

  const addRow = (fi: number) => {
    setFolhas((prev) => {
      const next = structuredClone(prev);
      next[fi].rows.push({ dia: "", mes: "", ano: "2026", atividade: "", turma: "", alunos: "" });
      return next;
    });
  };

  const removeRow = (fi: number, ri: number) => {
    setFolhas((prev) => {
      const next = structuredClone(prev);
      next[fi].rows.splice(ri, 1);
      return next;
    });
  };

  if (!authed) {
    return (
      <div className="container max-w-md py-20">
        <h1 className="font-display text-2xl font-extrabold mb-4">Folha de Registro — acesso</h1>
        <form onSubmit={handleAuth} className="space-y-3">
          <Input
            type="password"
            placeholder="Senha do admin"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
          />
          <Button type="submit" className="w-full">Entrar</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 py-8 print:bg-white print:py-0">
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 12mm; }
          body { background: white; }
          .no-print { display: none !important; }
          .folha { page-break-after: always; box-shadow: none !important; }
          .folha:last-child { page-break-after: auto; }
        }
      `}</style>

      <div className="container max-w-6xl no-print mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold">Folha de Registro de Atividades</h1>
          <p className="text-sm text-muted-foreground">Edite os campos se precisar e clique em imprimir.</p>
        </div>
        <Button onClick={() => window.print()} className="gap-2">
          <Printer className="h-4 w-4" /> Imprimir / Salvar PDF
        </Button>
      </div>

      <div className="container max-w-6xl space-y-8">
        {folhas.map((f, fi) => (
          <FolhaSheet
            key={fi}
            folha={f}
            onChangeRow={(ri, field, val) => updateRow(fi, ri, field, val)}
            onAddRow={() => addRow(fi)}
            onRemoveRow={(ri) => removeRow(fi, ri)}
            onChangeHeader={(field, val) =>
              setFolhas((prev) => {
                const next = structuredClone(prev);
                (next[fi] as any)[field] = val;
                return next;
              })
            }
          />
        ))}
      </div>
    </div>
  );
}

function FolhaSheet({
  folha,
  onChangeRow,
  onAddRow,
  onRemoveRow,
  onChangeHeader,
}: {
  folha: Folha;
  onChangeRow: (ri: number, field: keyof Row, val: string) => void;
  onAddRow: () => void;
  onRemoveRow: (ri: number) => void;
  onChangeHeader: (field: "oficina" | "oficineiro" | "escola", val: string) => void;
}) {
  // Pad rows to at least 10 for printed look
  const printRows = useMemo(() => {
    const padded = [...folha.rows];
    while (padded.length < 10) padded.push({ dia: "", mes: "", ano: "", atividade: "", turma: "", alunos: "" });
    return padded;
  }, [folha.rows]);

  return (
    <div className="folha bg-white text-black rounded-md shadow-soft p-8 print:p-4 print:shadow-none">
      {/* Header */}
      <div className="text-center mb-4">
        <img src={brasaoCanela} alt="Brasão Prefeitura Municipal de Canela" className="mx-auto mb-1 h-16 w-16 object-contain" />
        <div className="font-extrabold tracking-widest text-blue-900 text-lg">SMEEL</div>
        <div className="font-bold text-base mt-1">FOLHA DE REGISTRO DE ATIVIDADES</div>
        <input
          className="text-xs text-gray-600 text-center bg-transparent outline-none w-full"
          value={folha.escola}
          onChange={(e) => onChangeHeader("escola", e.target.value)}
        />
      </div>

      {/* Top fields */}
      <div className="space-y-1 text-sm mb-3">
        <div className="flex gap-2 items-baseline border-b border-black pb-0.5">
          <span className="font-bold">Oficina:</span>
          <input
            className="flex-1 bg-transparent outline-none"
            value={folha.oficina}
            onChange={(e) => onChangeHeader("oficina", e.target.value)}
          />
        </div>
        <div className="flex gap-2 items-baseline border-b border-black pb-0.5">
          <span className="font-bold">Nome do Oficineiro:</span>
          <input
            className="flex-1 bg-transparent outline-none"
            value={folha.oficineiro}
            onChange={(e) => onChangeHeader("oficineiro", e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-black text-xs">
        <thead>
          <tr>
            <th className="border border-black p-1 w-10">Dia</th>
            <th className="border border-black p-1 w-10">Mês</th>
            <th className="border border-black p-1 w-12">Ano</th>
            <th className="border border-black p-1">Atividades desenvolvidas na oficina</th>
            <th className="border border-black p-1 w-28">Turma</th>
            <th className="border border-black p-1 w-20">Nº de alunos</th>
            <th className="border border-black p-1 w-10 no-print">—</th>
          </tr>
        </thead>
        <tbody>
          {printRows.map((row, ri) => {
            const isReal = ri < folha.rows.length;
            return (
              <tr key={ri} className="align-top">
                <td className="border border-black p-1 text-center">
                  {isReal ? (
                    <input className="w-full text-center bg-transparent outline-none print:border-none" value={row.dia} onChange={(e) => onChangeRow(ri, "dia", e.target.value)} />
                  ) : <span>&nbsp;</span>}
                </td>
                <td className="border border-black p-1 text-center">
                  {isReal ? (
                    <input className="w-full text-center bg-transparent outline-none" value={row.mes} onChange={(e) => onChangeRow(ri, "mes", e.target.value)} />
                  ) : <span>&nbsp;</span>}
                </td>
                <td className="border border-black p-1 text-center">
                  {isReal ? (
                    <input className="w-full text-center bg-transparent outline-none" value={row.ano} onChange={(e) => onChangeRow(ri, "ano", e.target.value)} />
                  ) : <span>&nbsp;</span>}
                </td>
                <td className="border border-black p-1" style={{ minHeight: "2rem" }}>
                  {isReal ? (
                    <textarea
                      className="w-full bg-transparent outline-none resize-none leading-snug"
                      rows={Math.max(2, Math.ceil(row.atividade.length / 90))}
                      value={row.atividade}
                      onChange={(e) => onChangeRow(ri, "atividade", e.target.value)}
                    />
                  ) : <span>&nbsp;</span>}
                </td>
                <td className="border border-black p-1 text-center">
                  {isReal ? (
                    <input className="w-full text-center bg-transparent outline-none" value={row.turma} onChange={(e) => onChangeRow(ri, "turma", e.target.value)} />
                  ) : <span>&nbsp;</span>}
                </td>
                <td className="border border-black p-1 text-center">
                  {isReal ? (
                    <input className="w-full text-center bg-transparent outline-none" value={row.alunos} onChange={(e) => onChangeRow(ri, "alunos", e.target.value)} />
                  ) : <span>&nbsp;</span>}
                </td>
                <td className="border border-black p-1 text-center no-print">
                  {isReal && (
                    <button onClick={() => onRemoveRow(ri)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="no-print mt-3">
        <Button variant="outline" size="sm" onClick={onAddRow} className="gap-2">
          <Plus className="h-4 w-4" /> Adicionar linha
        </Button>
      </div>

      {/* Signature */}
      <div className="mt-10 mx-auto w-72 text-center">
        <div className="border-t border-black"></div>
        <div className="text-xs mt-1">Assinatura do oficineiro</div>
      </div>
    </div>
  );
}
