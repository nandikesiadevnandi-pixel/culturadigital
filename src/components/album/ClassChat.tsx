import { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '@/hooks/useAlbum';
import { Button } from '@/components/ui/button';
import { Send, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Props {
  messages: ChatMessage[];
  currentUserId?: string;
  onSend: (msg: string) => void;
}

export function ClassChat({ messages, currentUserId, onSend }: Props) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col h-96 rounded-2xl border border-violet-500/20 bg-[#0a0a1a]/80 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-violet-500/20 bg-[#0f0f24]">
        <MessageCircle className="h-4 w-4 text-violet-400" />
        <span className="font-bold text-white text-sm">Chat de Trocas da Turma</span>
        <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-violet-200/40 text-sm text-center">
            <div>
              <p className="text-3xl mb-2">💬</p>
              <p>Nenhuma mensagem ainda.</p>
              <p>Negocie trocas com sua turma!</p>
            </div>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.userId === currentUserId;
          return (
            <div key={msg.id} className={cn('flex', isMe ? 'justify-end' : 'justify-start')}>
              <div className={cn(
                'max-w-[75%] rounded-2xl px-3 py-2',
                isMe
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white'
                  : 'bg-[#1a1a3a] border border-violet-500/20 text-white',
              )}>
                {!isMe && (
                  <p className="text-[10px] font-bold text-cyan-400 mb-0.5">{msg.userName}</p>
                )}
                <p className="text-sm leading-relaxed">{msg.message}</p>
                <p className="text-[10px] text-white/50 text-right mt-1">
                  {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true, locale: ptBR })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-3 py-2 border-t border-violet-500/20 bg-[#0f0f24]">
        <input
          className="flex-1 rounded-xl bg-[#1a1a3a] border border-violet-500/30 px-3 py-2 text-sm text-white placeholder:text-violet-200/40 focus:outline-none focus:border-cyan-400/60"
          placeholder="Ofereço Messi por Mbappé..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          maxLength={200}
        />
        <Button
          size="sm"
          onClick={handleSend}
          disabled={!input.trim()}
          className="bg-gradient-to-r from-violet-500 to-cyan-400 text-white hover:opacity-90 rounded-xl"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
