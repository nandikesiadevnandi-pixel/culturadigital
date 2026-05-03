import { Construction } from "lucide-react";
import { usePlatform } from "@/contexts/PlatformContext";

export const PlatformPlaceholder = ({ title }: { title: string }) => {
  const { platform } = usePlatform();
  return (
    <section className="container max-w-2xl py-20">
      <div className="rounded-3xl border-2 border-dashed border-primary/30 bg-card p-10 text-center shadow-soft">
        <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full gradient-purple text-primary-foreground shadow-glow">
          <Construction className="h-8 w-8" />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-gradient">{title}</h1>
        <p className="mt-3 text-muted-foreground">
          Esta seção do portfólio da <strong>{platform.teacherName}</strong> está em construção. {platform.emoji}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Em breve será preenchida com aulas, atividades e momentos da turma.
        </p>
      </div>
    </section>
  );
};
