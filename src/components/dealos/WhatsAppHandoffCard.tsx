import { useState } from 'react';
import {
  Smartphone,
  Copy,
  CheckCheck,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { openWhatsAppDemo } from './WhatsAppInteractivePitchModal';

interface WhatsAppHandoffCardProps {
  text: string;
  phone?: string;
  title?: string;
  subtitle?: string;
  dealRoomUrl?: string;
  className?: string;
}

export function WhatsAppHandoffCard({
  text,
  title = 'WhatsApp Investor Script',
  dealRoomUrl,
  className = '',
}: WhatsAppHandoffCardProps) {
  const [copied, setCopied] = useState(false);

  const targetMessage = dealRoomUrl ? `${text}\n\nClient Deal Room: ${dealRoomUrl}` : text;

  const handleCopy = () => {
    navigator.clipboard.writeText(targetMessage);
    setCopied(true);
    toast.success('WhatsApp brief copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLaunchDemo = () => {
    openWhatsAppDemo();
  };

  return (
    <div
      className={`rounded-2xl bg-[#0B141A] border border-emerald-500/30 text-xs text-zinc-100 p-4 sm:p-5 space-y-3.5 shadow-2xl ${className}`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 active:scale-95 transition-all"
          >
            {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
        </div>
      </div>

      {/* Message preview bubble */}
      <div className="bg-[#005c4b]/30 p-3.5 rounded-xl border border-emerald-500/20 text-[12px] leading-relaxed text-zinc-200 font-sans shadow-inner">
        <p className="whitespace-pre-line">{text}</p>
        {dealRoomUrl && (
          <p className="mt-2 pt-2 border-t border-emerald-500/20 text-emerald-300 font-mono text-[11px] flex items-center gap-1">
            <Sparkles size={12} />
            <span>Interactive Deal Room: {dealRoomUrl}</span>
          </p>
        )}
      </div>

      {/* Primary Action: Floating Sample iPhone Demo Page */}
      <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <button
          type="button"
          onClick={handleLaunchDemo}
          className="flex-1 h-11 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 cursor-pointer active:scale-98 transition-all"
        >
          <Smartphone size={16} />
          <span>📱 Test Drive Live WhatsApp Pitch (Sample iPhone)</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="h-11 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/15 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98"
        >
          {copied ? <CheckCheck size={14} className="text-emerald-400" /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy Script'}</span>
        </button>
      </div>
    </div>
  );
}
