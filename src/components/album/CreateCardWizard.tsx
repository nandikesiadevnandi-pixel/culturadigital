import { useEffect, useRef, useState } from 'react';
import { Camera, Upload, ArrowRight, ArrowLeft, Sparkles, RotateCcw, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { StudentCardView } from './StudentCardView';
import { CreateCardInput } from '@/hooks/useStudentCards';

const COUNTRIES = [
  { name: 'Brasil', flag: '🇧🇷' },
  { name: 'Argentina', flag: '🇦🇷' },
  { name: 'Uruguai', flag: '🇺🇾' },
  { name: 'França', flag: '🇫🇷' },
  { name: 'Portugal', flag: '🇵🇹' },
  { name: 'Espanha', flag: '🇪🇸' },
  { name: 'Inglaterra', flag: '🏴\u200d☠️' },
  { name: 'Alemanha', flag: '🇩🇪' },
];
const POSITIONS = ['GOL', 'ZAG', 'LAT', 'VOL', 'MEI', 'ATA'];
const JERSEY_COLORS = ['#1E9B5F', '#D43B2A', '#0EA5E9', '#FBBA16', '#6B21A8', '#0d0d0d', '#FFFFFF', '#E11D48'];
const FRAMES: Array<{ id: string; name: string; emoji: string }> = [
  { id: 'gold', name: 'Ouro', emoji: '🥇' },
  { id: 'diamond', name: 'Diamante', emoji: '💎' },
  { id: 'holographic', name: 'Holográfica', emoji: '🌈' },
];

interface Props {
  onClose: () => void;
  onSave: (input: CreateCardInput) => Promise<{ ok: boolean; error?: string }>;
  initial?: Partial<CreateCardInput> & { photoUrl?: string };
}

export function CreateCardWizard({ onClose, onSave, initial }: Props) {
  const [step, setStep] = useState(0);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(initial?.photoUrl ?? null);
  const [saving, setSaving] = useState(false);

  const [playerName, setPlayerName] = useState(initial?.playerName ?? '');
  const [country, setCountry] = useState(initial?.country ?? 'Brasil');
  const [countryFlag, setCountryFlag] = useState(initial?.countryFlag ?? '🇧🇷');
  const [club, setClub] = useState(initial?.club ?? '');
  const [position, setPosition] = useState(initial?.position ?? 'ATA');
  const [jerseyNumber, setJerseyNumber] = useState(initial?.jerseyNumber ?? 10);
  const [foot, setFoot] = useState(initial?.foot ?? 'Direito');
  const [jerseyColor, setJerseyColor] = useState(initial?.jerseyColor ?? '#1E9B5F');
  const [jerseyStyle, setJerseyStyle] = useState(initial?.jerseyStyle ?? 'solid');
  const [frame, setFrame] = useState(initial?.frame ?? 'gold');

  // Webcam
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [camOn, setCamOn] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => () => stopCam(), []);

  async function startCam() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 640 } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCamOn(true);
    } catch (e: any) {
      toast.error('Não consegui acessar a câmera. Use o botão de upload.');
    }
  }

  function stopCam() {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCamOn(false);
  }

  function capture() {
    const v = videoRef.current; const c = canvasRef.current;
    if (!v || !c) return;
    const size = Math.min(v.videoWidth, v.videoHeight);
    const sx = (v.videoWidth - size) / 2;
    const sy = (v.videoHeight - size) / 2;
    c.width = 512; c.height = 512;
    const ctx = c.getContext('2d')!;
    ctx.drawImage(v, sx, sy, size, size, 0, 0, 512, 512);
    c.toBlob((blob) => {
      if (!blob) return;
      setPhotoBlob(blob);
      setPhotoUrl(URL.createObjectURL(blob));
      stopCam();
    }, 'image/jpeg', 0.88);
  }

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setPhotoBlob(f);
    setPhotoUrl(URL.createObjectURL(f));
  }

  async function handleSave() {
    if (!photoBlob && !photoUrl) { toast.error('Tire uma foto primeiro!'); return; }
    if (!playerName.trim()) { toast.error('Coloca o nome do craque!'); return; }
    if (!photoBlob) { toast.error('Tire uma foto nova para salvar.'); return; }
    setSaving(true);
    const res = await onSave({
      playerName: playerName.trim(),
      country, countryFlag, club: club.trim(), position,
      jerseyNumber, foot, jerseyColor, jerseyStyle, frame,
      photoBlob,
    });
    setSaving(false);
    if (res.ok) { toast.success('🌟 Sua figurinha LENDÁRIA está no álbum!'); onClose(); }
    else toast.error(res.error ?? 'Não consegui salvar.');
  }

  const previewCard = {
    playerName: playerName || 'Seu Nome',
    country, countryFlag, club: club || country,
    position, jerseyNumber, foot,
    jerseyColor, jerseyStyle, frame,
    photoUrl: photoUrl ?? '',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-white/15 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/30">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#FBBA16]" />
            <h2 className="font-black text-white">Minha Figurinha Lendária</h2>
          </div>
          <button type="button" onClick={onClose} className="text-white/60 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        {/* Steps indicator */}
        <div className="flex gap-1 px-6 pt-4">
          {['Foto', 'Dados', 'Visual', 'Pronto'].map((label, i) => (
            <div key={label} className="flex-1">
              <div className={`h-1.5 rounded-full transition-all ${i <= step ? 'bg-[#FBBA16]' : 'bg-white/15'}`} />
              <p className={`text-[10px] mt-1 font-bold ${i === step ? 'text-[#FBBA16]' : 'text-white/50'}`}>{label}</p>
            </div>
          ))}
        </div>

        <div className="p-6">
          {/* ── STEP 0 — FOTO ── */}
          {step === 0 && (
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div>
                <div className="aspect-square rounded-2xl overflow-hidden bg-black border border-white/10 flex items-center justify-center">
                  {photoUrl ? (
                    <img src={photoUrl} alt="preview" className="h-full w-full object-cover" />
                  ) : camOn ? (
                    <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
                  ) : (
                    <div className="text-white/40 text-sm text-center px-6">
                      <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      Use a webcam ou suba uma foto
                    </div>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  {!camOn && !photoUrl && (
                    <>
                      <button type="button" onClick={startCam} className="px-4 py-3 rounded-xl bg-[#FBBA16] text-gray-900 font-black flex items-center justify-center gap-2">
                        <Camera className="h-4 w-4" /> Câmera
                      </button>
                      <button type="button" onClick={() => fileRef.current?.click()} className="px-4 py-3 rounded-xl bg-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/20">
                        <Upload className="h-4 w-4" /> Upload
                      </button>
                    </>
                  )}
                  {camOn && (
                    <>
                      <button type="button" onClick={capture} className="px-4 py-3 rounded-xl bg-[#1E9B5F] text-white font-black flex items-center justify-center gap-2">
                        📸 Tirar Foto
                      </button>
                      <button type="button" onClick={stopCam} className="px-4 py-3 rounded-xl bg-white/10 text-white font-bold">Cancelar</button>
                    </>
                  )}
                  {photoUrl && !camOn && (
                    <button type="button" onClick={() => { setPhotoUrl(null); setPhotoBlob(null); }} className="col-span-2 px-4 py-3 rounded-xl bg-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/20">
                      <RotateCcw className="h-4 w-4" /> Tirar outra
                    </button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" capture="user" className="hidden" onChange={pickFile} />
              </div>

              <div className="text-white/80 text-sm space-y-3">
                <h3 className="font-black text-white text-base">Etapa 1 — Tire sua foto</h3>
                <p>Sua cara vai virar uma figurinha <span className="text-[#FBBA16] font-bold">LENDÁRIA</span> no álbum da turma! ⭐</p>
                <ul className="text-xs text-white/60 space-y-1.5 list-disc list-inside">
                  <li>Olha pra frente</li>
                  <li>Boa iluminação</li>
                  <li>Pode usar a câmera do notebook ou subir uma foto</li>
                </ul>
              </div>
            </div>
          )}

          {/* ── STEP 1 — DADOS ── */}
          {step === 1 && (
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Nome do craque" value={playerName} onChange={setPlayerName} placeholder="Ex: João Silva" />
              <Field label="Time favorito" value={club} onChange={setClub} placeholder="Ex: Grêmio" />
              <div>
                <label className="text-xs font-bold text-white/70 mb-1 block">País</label>
                <select value={country} onChange={(e) => { const c = COUNTRIES.find(x => x.name === e.target.value); if (c) { setCountry(c.name); setCountryFlag(c.flag); } }}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white">
                  {COUNTRIES.map(c => <option key={c.name} value={c.name} className="bg-slate-900">{c.flag} {c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-white/70 mb-1 block">Posição</label>
                <div className="grid grid-cols-6 gap-1">
                  {POSITIONS.map(p => (
                    <button key={p} type="button" onClick={() => setPosition(p)}
                      className={`py-2 rounded-lg text-xs font-black transition-all ${position === p ? 'bg-[#FBBA16] text-gray-900' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-white/70 mb-1 block">Número da camisa</label>
                <input type="number" min={1} max={99} value={jerseyNumber} onChange={(e) => setJerseyNumber(Math.max(1, Math.min(99, Number(e.target.value) || 1)))}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white font-black text-lg" />
              </div>
              <div>
                <label className="text-xs font-bold text-white/70 mb-1 block">Pé dominante</label>
                <div className="grid grid-cols-3 gap-1">
                  {['Direito', 'Esquerdo', 'Ambos'].map(f => (
                    <button key={f} type="button" onClick={() => setFoot(f)}
                      className={`py-2 rounded-lg text-xs font-bold ${foot === f ? 'bg-[#1E9B5F] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2 — VISUAL ── */}
          {step === 2 && (
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div className="flex justify-center"><StudentCardView card={previewCard} size="md" /></div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-white/70 mb-2 block">Cor da camisa</label>
                  <div className="flex flex-wrap gap-2">
                    {JERSEY_COLORS.map(c => (
                      <button key={c} type="button" onClick={() => setJerseyColor(c)}
                        className={`h-10 w-10 rounded-xl border-2 transition-all ${jerseyColor === c ? 'border-white scale-110' : 'border-white/20'}`}
                        style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-white/70 mb-2 block">Estilo</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ id: 'solid', label: 'Lisa' }, { id: 'striped', label: 'Listrada' }].map(s => (
                      <button key={s.id} type="button" onClick={() => setJerseyStyle(s.id)}
                        className={`py-2 rounded-lg text-sm font-bold ${jerseyStyle === s.id ? 'bg-[#FBBA16] text-gray-900' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-white/70 mb-2 block">Moldura</label>
                  <div className="grid grid-cols-3 gap-2">
                    {FRAMES.map(f => (
                      <button key={f.id} type="button" onClick={() => setFrame(f.id)}
                        className={`py-3 rounded-lg text-xs font-bold flex flex-col items-center gap-1 transition-all ${frame === f.id ? 'bg-white/25 ring-2 ring-[#FBBA16]' : 'bg-white/10 hover:bg-white/20'}`}>
                        <span className="text-xl">{f.emoji}</span>
                        <span className="text-white">{f.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3 — PRONTO ── */}
          {step === 3 && (
            <div className="flex flex-col items-center gap-4">
              <p className="text-white/80 text-sm text-center">Confira sua figurinha lendária — depois clica em <strong className="text-[#FBBA16]">Salvar</strong> e ela entra no álbum da sua turma! 🌟</p>
              <StudentCardView card={previewCard} size="lg" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-black/30">
          <button type="button" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
            className="px-4 py-2 rounded-xl text-white/70 hover:text-white disabled:opacity-30 flex items-center gap-2 text-sm font-bold">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </button>
          {step < 3 ? (
            <button type="button" onClick={() => setStep(s => Math.min(3, s + 1))}
              disabled={step === 0 && !photoUrl}
              className="px-6 py-2.5 rounded-xl bg-[#FBBA16] text-gray-900 font-black flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
              Continuar <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button type="button" onClick={handleSave} disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FBBA16] to-[#F59E0B] text-gray-900 font-black flex items-center gap-2 disabled:opacity-50">
              <Check className="h-4 w-4" /> {saving ? 'Salvando...' : 'Salvar Figurinha'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs font-bold text-white/70 mb-1 block">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={40}
        className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30" />
    </div>
  );
}
