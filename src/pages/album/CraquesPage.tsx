import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Heart, Flame, Star, Plus, Pencil, Trophy, MessageSquare, Send, Swords } from 'lucide-react';
import { useStudentCards, StudentCard } from '@/hooks/useStudentCards';
import { useAuth } from '@/hooks/useAuth';
import { CopaBackground } from '@/components/album/CopaBackground';
import { StudentCardView } from '@/components/album/StudentCardView';
import { CreateCardWizard } from '@/components/album/CreateCardWizard';
import { supabase as sb } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const supabase = sb as any;

const BLOCKED = ['feio','burro','idiota','chato','horrível','ruim','péssimo','odeio','odeia','estupido','lixo'];
function isCommentSafe(t: string) { return !BLOCKED.some(w => t.toLowerCase().includes(w)); }

type Comment = { id: string; card_id: string; user_id: string; author_name: string; body: string; created_at: string };

function useComments(cardId: string | null) {
  const [comments, setComments] = useState<Comment[]>([]);
  const load = async () => {
    if (!cardId) return;
    const { data } = await supabase.from('student_card_comments').select('*').eq('card_id', cardId).order('created_at');
    setComments(data ?? []);
  };
  useEffect(() => { load(); }, [cardId]);
  return { comments, reload: load };
}

function CardModal({ card, user, onClose, onToggleReaction }: {
  card: StudentCard; user: any; onClose: () => void;
  onToggleReaction: (id: string, r: 'like'|'fire'|'star') => void;
}) {
  const { profile } = useAuth();
  const { comments, reload } = useComments(card.id);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [localCard, setLocalCard] = useState(card);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendComment = async () => {
    const body = draft.trim();
    if (!body || !profile) return;
    if (!isCommentSafe(body)) { toast.error('Usa palavras legais! 😊 Nada de comentários negativos.'); return; }
    setSending(true);
    await supabase.from('student_card_comments').insert({ card_id: card.id, user_id: user.id, author_name: profile.full_name, body });
    setSending(false);
    setDraft('');
    reload();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="relative max-w-md w-full my-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-center mb-4"><StudentCardView card={localCard} size="lg" /></div>
        <div className="rounded-2xl bg-slate-900 border border-white/15 p-4 space-y-4">
          <div className="text-center">
            <p className="text-white font-black text-lg">{card.playerName}</p>
            <p className="text-white/60 text-xs">{card.club || card.country} · {card.position} #{card.jerseyNumber}</p>
          </div>

          {/* reactions */}
          <div className="grid grid-cols-3 gap-2">
            {(['like','fire','star'] as const).map(r => {
              const meta = r==='like' ? {icon:Heart,label:'Gostei',color:'text-pink-400'} : r==='fire' ? {icon:Flame,label:'Craque',color:'text-orange-400'} : {icon:Star,label:'Melhor',color:'text-[#FBBA16]'};
              const Icon = meta.icon;
              const mine = localCard.myReactions.has(r);
              const isMine = localCard.userId === user?.id;
              return (
                <button key={r} type="button" disabled={isMine}
                  onClick={async () => {
                    await onToggleReaction(card.id, r);
                    setLocalCard(c => { const s = new Set(c.myReactions); mine ? s.delete(r) : s.add(r); return {...c, myReactions: s, likes: {...c.likes, [r]: Math.max(0, c.likes[r]+(mine?-1:1))}}; });
                  }}
                  className={`py-3 rounded-xl font-bold text-xs flex flex-col items-center gap-1 transition-all ${mine ? 'bg-white/25 ring-2 ring-white/50' : 'bg-white/10 hover:bg-white/20'} disabled:opacity-40 disabled:cursor-not-allowed`}>
                  <Icon className={`h-5 w-5 ${meta.color}`} />
                  <span className="text-white">{meta.label}</span>
                  <span className="text-white/60">{localCard.likes[r]}</span>
                </button>
              );
            })}
          </div>
          {localCard.userId === user?.id && <p className="text-center text-white/40 text-[10px]">você não pode curtir a própria figurinha 😉</p>}

          {/* comments */}
          <div>
            <p className="text-white/70 text-xs font-bold mb-2 flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Comentários ({comments.length})</p>
            <div className="space-y-1.5 max-h-32 overflow-y-auto mb-2">
              {comments.length === 0 && <p className="text-white/30 text-[11px] italic">Seja o primeiro a comentar!</p>}
              {comments.map(c => (
                <div key={c.id} className="flex gap-2 text-xs">
                  <span className="font-bold text-cyan-300 shrink-0">{c.author_name.split(' ')[0]}:</span>
                  <span className="text-white/80">{c.body}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input ref={inputRef} value={draft} onChange={e => setDraft(e.target.value.slice(0,100))}
                onKeyDown={e => { if(e.key==='Enter') sendComment(); }}
                placeholder="Diga algo positivo... 🌟" maxLength={100}
                className="flex-1 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs placeholder-white/30 outline-none focus:border-[#FBBA16]" />
              <button type="button" onClick={sendComment} disabled={sending || !draft.trim()}
                aria-label="Enviar comentário"
                className="px-3 py-1.5 rounded-lg bg-[#FBBA16] text-gray-900 font-black text-xs disabled:opacity-40">
                <Send className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CraquesPage() {
  const { user, profile } = useAuth();
  const { cards, myCard, loading, createOrUpdate, toggleReaction } = useStudentCards();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [openCard, setOpenCard] = useState<StudentCard | null>(null);

  const ranking = [...cards].sort((a, b) => {
    const sa = a.likes.like + a.likes.fire * 2 + a.likes.star * 3;
    const sb = b.likes.like + b.likes.fire * 2 + b.likes.star * 3;
    return sb - sa;
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-x-hidden">
      <CopaBackground />

      <div className="relative z-10 container py-8">
        <div className="flex items-center justify-between mb-6">
          <Link to="/aluno/album">
            <button type="button" className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-bold">
              <ArrowLeft className="h-4 w-4" /> Voltar ao álbum
            </button>
          </Link>
          <Link to="/aluno/album/selecao">
            <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FBBA16] to-[#F59E0B] text-gray-900 text-sm font-black shadow-lg hover:opacity-90">
              <Swords className="h-4 w-4" /> Minha Seleção
            </button>
          </Link>
        </div>

        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBBA16]/20 border border-[#FBBA16]/40 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-[#FBBA16]" />
            <span className="text-xs font-black text-[#FBBA16] tracking-wider uppercase">Todas Lendárias</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-1">Craques da Turma {profile?.class_name}</h1>
          <p className="text-white/70 text-sm">Cada aluno é um craque do álbum 🌟</p>
        </div>

        {/* My card / Create */}
        <div className="mb-8 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6">
          {myCard ? (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <StudentCardView card={myCard} size="md" />
              <div className="flex-1 text-center sm:text-left">
                <h2 className="font-black text-white text-xl mb-1">Sua figurinha está no álbum! 🎉</h2>
                <p className="text-white/70 text-sm mb-4">Toda a turma {profile?.class_name} pode ver e curtir.</p>
                <div className="flex gap-3 justify-center sm:justify-start flex-wrap">
                  <span className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm font-bold flex items-center gap-1.5">
                    <Heart className="h-3.5 w-3.5 text-pink-400" /> {myCard.likes.like}
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm font-bold flex items-center gap-1.5">
                    <Flame className="h-3.5 w-3.5 text-orange-400" /> {myCard.likes.fire}
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm font-bold flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 text-[#FBBA16]" /> {myCard.likes.star}
                  </span>
                </div>
                <button type="button" onClick={() => setWizardOpen(true)} className="mt-4 px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-bold flex items-center gap-2 hover:bg-white/20">
                  <Pencil className="h-4 w-4" /> Editar minha figurinha
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FBBA16] to-[#F59E0B] mb-3">
                <Sparkles className="h-8 w-8 text-gray-900" />
              </div>
              <h2 className="font-black text-white text-xl mb-1">Cria a TUA figurinha lendária!</h2>
              <p className="text-white/70 text-sm mb-4">Tira uma foto, escolhe time, posição, número… e vira lenda do álbum.</p>
              <button type="button" onClick={() => setWizardOpen(true)} className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FBBA16] to-[#F59E0B] text-gray-900 font-black inline-flex items-center gap-2 shadow-lg">
                <Plus className="h-5 w-5" /> Criar Minha Figurinha
              </button>
            </div>
          )}
        </div>

        {/* Ranking */}
        {ranking.length > 0 && (
          <div className="mb-6">
            <h2 className="text-white font-black text-lg mb-3 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[#FBBA16]" /> Ranking de Craques
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {ranking.slice(0, 5).map((c, i) => {
                const score = c.likes.like + c.likes.fire * 2 + c.likes.star * 3;
                return (
                  <button key={c.id} type="button" onClick={() => setOpenCard(c)} className="flex-shrink-0 text-center group">
                    <div className="relative">
                      <StudentCardView card={c} size="sm" />
                      <span className={`absolute -top-2 -left-2 h-8 w-8 rounded-full flex items-center justify-center font-black text-sm shadow-lg ${i === 0 ? 'bg-[#FBBA16] text-gray-900' : i === 1 ? 'bg-gray-300 text-gray-900' : i === 2 ? 'bg-amber-700 text-white' : 'bg-white/20 text-white'}`}>
                        {i + 1}º
                      </span>
                    </div>
                    <p className="text-xs text-white/70 mt-2 font-bold">{score} pts</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Gallery */}
        <h2 className="text-white font-black text-lg mb-3">🌟 Todas as figurinhas da turma</h2>
        {loading ? (
          <div className="text-white/60 text-center py-12">Carregando…</div>
        ) : cards.length === 0 ? (
          <div className="text-white/60 text-center py-12 text-sm">Ainda ninguém criou figurinha. Seja o primeiro! ⭐</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {cards.map(c => (
              <button key={c.id} type="button" onClick={() => setOpenCard(c)} className="flex flex-col items-center group">
                <div className="transition-transform group-hover:scale-105">
                  <StudentCardView card={c} size="sm" />
                </div>
                <p className="text-xs text-white font-bold mt-2 truncate w-full text-center">{c.playerName}</p>
                <div className="flex gap-2 text-[10px] text-white/60 mt-0.5">
                  <span>❤️ {c.likes.like}</span>
                  <span>🔥 {c.likes.fire}</span>
                  <span>⭐ {c.likes.star}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {wizardOpen && (
        <CreateCardWizard
          onClose={() => setWizardOpen(false)}
          onSave={createOrUpdate}
          initial={myCard ? {
            playerName: myCard.playerName, country: myCard.country, countryFlag: myCard.countryFlag,
            club: myCard.club, position: myCard.position, jerseyNumber: myCard.jerseyNumber,
            foot: myCard.foot, jerseyColor: myCard.jerseyColor, jerseyStyle: myCard.jerseyStyle,
            frame: myCard.frame, photoUrl: myCard.photoUrl,
          } as any : undefined}
        />
      )}

      {openCard && (
        <CardModal card={openCard} user={user} onClose={() => setOpenCard(null)} onToggleReaction={toggleReaction} />
      )}
    </div>
  );
}
