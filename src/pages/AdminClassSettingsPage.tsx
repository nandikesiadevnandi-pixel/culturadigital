import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Camera, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { schools } from "@/data/schools";

type Setting = {
  class_name: string;
  chat_enabled: boolean;
  photos_enabled: boolean;
};

export default function AdminClassSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Record<string, Setting>>({});
  const [knownClasses, setKnownClasses] = useState<string[]>([]);

  const load = async () => {
    setLoading(true);
    // turmas existentes via profiles + lista fixa
    const { data: profiles } = await supabase
      .from("profiles")
      .select("class_name, school")
      .not("class_name", "is", null);
    const set = new Set<string>();
    (profiles || []).forEach((p: any) => p.class_name && set.add(p.class_name));
    schools.forEach((s) => s.classes?.forEach((c) => set.add(c)));
    const list = Array.from(set).sort();
    setKnownClasses(list);

    const { data: cfgs } = await supabase.from("class_settings").select("*");
    const map: Record<string, Setting> = {};
    (cfgs || []).forEach((c: any) => (map[c.class_name] = c));
    setSettings(map);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const update = async (cls: string, patch: Partial<Setting>) => {
    const current = settings[cls] || { class_name: cls, chat_enabled: true, photos_enabled: true };
    const next = { ...current, ...patch };
    setSettings((s) => ({ ...s, [cls]: next }));
    const { error } = await supabase
      .from("class_settings")
      .upsert({
        class_name: cls,
        chat_enabled: next.chat_enabled,
        photos_enabled: next.photos_enabled,
      });
    if (error) {
      toast.error(error.message);
      load();
    } else {
      toast.success(`${cls} atualizada`);
    }
  };

  const grouped = useMemo(() => knownClasses, [knownClasses]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#141432] to-[#0a0a1a] py-8">
      <div className="container max-w-3xl">
        <Link to="/admin/alunos" className="inline-flex items-center gap-2 text-violet-200 hover:text-white text-sm mb-4">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-white">Chat e Fotos por turma</h1>
            <p className="text-sm text-violet-200/70">
              Ligue ou desligue na hora pra cada turma. Útil pra abrir só durante a aula.
            </p>
          </div>
          <Button onClick={load} variant="outline" className="border-violet-500/40 text-violet-100">
            <RefreshCw className="h-4 w-4 mr-1" /> Atualizar
          </Button>
        </div>

        {loading ? (
          <p className="text-center text-violet-200">Carregando...</p>
        ) : grouped.length === 0 ? (
          <p className="text-center text-violet-200/70">Nenhuma turma cadastrada ainda.</p>
        ) : (
          <div className="space-y-2">
            {grouped.map((cls) => {
              const cfg = settings[cls] || { class_name: cls, chat_enabled: true, photos_enabled: true };
              return (
                <Card key={cls} className="border-violet-500/20 bg-[#0f0f24]/80 p-4">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-bold text-white">Turma {cls}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <MessageCircle className={`h-4 w-4 ${cfg.chat_enabled ? "text-cyan-300" : "text-violet-200/40"}`} />
                        <span className="text-sm text-violet-100">Chat</span>
                        <Switch
                          checked={cfg.chat_enabled}
                          onCheckedChange={(v) => update(cls, { chat_enabled: v })}
                        />
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Camera className={`h-4 w-4 ${cfg.photos_enabled ? "text-cyan-300" : "text-violet-200/40"}`} />
                        <span className="text-sm text-violet-100">Fotos</span>
                        <Switch
                          checked={cfg.photos_enabled}
                          onCheckedChange={(v) => update(cls, { photos_enabled: v })}
                        />
                      </label>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
