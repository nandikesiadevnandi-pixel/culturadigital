import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Printer, Plus, Trash2, FileImage, FileDown, Upload, Save, ArrowLeft, Cloud } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import brasaoCanela from "@/assets/brasao-canela.png";
import {
  Relatorio,
  ActivityRow,
  SchoolBlock,
  TurmaRow,
  emptyRelatorio,
  abril2026,
} from "@/data/relatorio";

const EditableInput = ({ value, onChange, className = "" }: { value: string; onChange: (v: string) => void; className?: string }) => (
  <input className={`bg-transparent outline-none w-full ${className}`} value={value} onChange={(e) => onChange(e.target.value)} />
);

const EditableArea = ({ value, onChange, className = "", rows = 3 }: { value: string; onChange: (v: string) => void; className?: string; rows?: number }) => (
  <textarea
    className={`bg-transparent outline-none w-full resize-none leading-snug ${className}`}
    value={value}
    rows={Math.max(rows, Math.ceil(value.length / 110))}
    onChange={(e) => onChange(e.target.value)}
  />
);

export default function FolhaRegistroPage() {
  const { periodKey: paramKey } = useParams<{ periodKey: string }>();
  const periodKey = paramKey ?? "2026-04";
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [r, setR] = useState<Relatorio>(() => emptyRelatorio(periodKey));
  const sheetRef = useRef<HTMLDivElement>(null);

  // Auth gate + load
  useEffect(() => {
    let active = true;
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate("/auth", { replace: true });
    });
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      if (!data.session) {
        navigate("/auth", { replace: true });
        return;
      }
      const uid = data.session.user.id;
      setUserId(uid);
      const { data: row } = await supabase
        .from("monthly_reports")
        .select("data")
        .eq("user_id", uid)
        .eq("period_key", periodKey)
        .maybeSingle();
      if (!active) return;
      if (row?.data) {
        setR(row.data as unknown as Relatorio);
      } else if (periodKey === "2026-04") {
        setR(abril2026);
      } else {
        setR(emptyRelatorio(periodKey));
      }
      setLoading(false);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate, periodKey]);

  const update = <K extends keyof Relatorio>(k: K, v: Relatorio[K]) => setR((p) => ({ ...p, [k]: v }));

  const updateActivity = (i: number, k: keyof ActivityRow, v: string) =>
    setR((p) => {
      const next = structuredClone(p);
      next.activities[i][k] = v;
      return next;
    });
  const addActivity = () =>
    setR((p) => ({ ...p, activities: [...p.activities, { data: "", escola: "", turmas: "", atividades: "" }] }));
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
  const addSchool = () =>
    setR((p) => ({
      ...p,
      schools: [...p.schools, { nome: "Nova escola", diaSemana: "", observacao: "", turmas: [{ turma: "", alunos: "" }] }],
    }));
  const removeSchool = (si: number) =>
    setR((p) => {
      const next = structuredClone(p);
      next.schools.splice(si, 1);
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

  const saveToCloud = async () => {
    if (!userId) return;
    setSaving(true);
    const { error } = await supabase
      .from("monthly_reports")
      .upsert(
        { user_id: userId, period_key: periodKey, data: r as unknown as any },
        { onConflict: "user_id,period_key" }
      );
    setSaving(false);
    if (error) toast.error("Erro ao salvar: " + error.message);
    else toast.success("Relatório salvo na nuvem ✓");
  };

  const captureCanvas = async () => {
    if (!sheetRef.current) return null;
    return await html2canvas(sheetRef.current, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
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

  if (loading) {
    return <div className="container py-20 text-center text-muted-foreground">Carregando relatório…</div>;
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
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link to="/admin/relatorios"><ArrowLeft className="h-4 w-4" /> Arquivo</Link>
          </Button>
          <div>
            <h1 className="font-display text-2xl font-extrabold">{r.periodo}</h1>
            <p className="text-sm text-muted-foreground">
              Edite qualquer campo e clique em <span className="font-medium">Salvar na nuvem</span> para guardar.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onSignatureUpload(e.target.files[0])} />
            <span className="inline-flex items-center gap-2 h-9 px-3 rounded-md border bg-background hover:bg-accent text-sm">
              <Upload className="h-4 w-4" /> Assinatura gov.br
            </span>
          </label>
          <Button variant="outline" onClick={saveAsImage} className="gap-2">
            <FileImage className="h-4 w-4" /> Imagem
          </Button>
          <Button variant="outline" onClick={saveAsPDF} className="gap-2">
            <FileDown className="h-4 w-4" /> PDF
          </Button>
          <Button variant="outline" onClick={() => window.print()} className="gap-2">
            <Printer className="h-4 w-4" /> Imprimir
          </Button>
          <Button onClick={saveToCloud} disabled={saving} className="gap-2">
            <Cloud className="h-4 w-4" /> {saving ? "Salvando…" : "Salvar na nuvem"}
          </Button>
        </div>
      </div>

      <div className="container max-w-5xl">
        <div ref={sheetRef} className="sheet bg-white text-black rounded-md shadow-soft p-10 print:p-0">
          <div className="text-center mb-6">
            <img src={brasaoCanela} alt="Brasão Prefeitura Municipal de Canela" className="mx-auto mb-3 h-32 w-32 object-contain" />
            <div className="font-bold text-sm tracking-wide">PREFEITURA MUNICIPAL DE CANELA</div>
            <div className="font-bold text-sm tracking-wide">SECRETARIA MUNICIPAL DE EDUCAÇÃO, ESPORTE E LAZER</div>
            <div className="mt-4">
              <textarea
                className="w-full text-center font-extrabold text-lg leading-tight bg-transparent outline-none resize-none"
                rows={2}
                value={r.titulo}
                onChange={(e) => update("titulo", e.target.value)}
              />
            </div>
            <div className="mt-2 text-sm">
              <EditableInput value={r.escolasAtendidas} onChange={(v) => update("escolasAtendidas", v)} className="text-center" />
            </div>
          </div>

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
                    <EditableInput value={(r as any)[key]} onChange={(v) => update(key as any, v)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-sm text-justify mb-3">
            <EditableArea value={r.introducao} onChange={(v) => update("introducao", v)} rows={4} />
          </div>
          <div className="text-sm text-justify mb-6">
            <EditableArea value={r.objetivos} onChange={(v) => update("objetivos", v)} rows={3} />
          </div>

          {r.schools.map((s, si) => (
            <div key={si} className="mb-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-base mb-2 flex-1">
                  <EditableInput value={s.nome} onChange={(v) => updateSchool(si, "nome", v)} />
                </h2>
                <button onClick={() => removeSchool(si)} className="text-red-600 no-print" title="Remover escola">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="text-xs mb-2">
                <span className="font-semibold">Dia da semana: </span>
                <input className="bg-transparent outline-none border-b border-gray-300" value={s.diaSemana} onChange={(e) => updateSchool(si, "diaSemana", e.target.value)} />
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
                        <td className="border border-black p-2" rowSpan={s.turmas.length}>
                          <EditableArea value={s.observacao} onChange={(v) => updateSchool(si, "observacao", v)} rows={5} />
                        </td>
                      )}
                      <td className="border border-black p-1 text-center">
                        <EditableInput value={t.turma} onChange={(v) => updateTurma(si, ti, "turma", v)} className="text-center" />
                      </td>
                      <td className="border border-black p-1 text-center">
                        <EditableInput value={t.alunos} onChange={(v) => updateTurma(si, ti, "alunos", v)} className="text-center" />
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
          <div className="no-print mb-6">
            <Button variant="outline" size="sm" onClick={addSchool} className="gap-2">
              <Plus className="h-3 w-3" /> Adicionar escola
            </Button>
          </div>

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

          <div className="text-sm text-justify mt-6 mb-3">
            <EditableArea value={r.consideracoes} onChange={(v) => update("consideracoes", v)} rows={4} />
          </div>
          <div className="text-sm text-justify mb-8">
            <EditableArea value={r.encaminhamentos} onChange={(v) => update("encaminhamentos", v)} rows={3} />
          </div>

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
