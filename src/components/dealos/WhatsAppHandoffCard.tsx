import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  QrCode,
  Smartphone,
  Copy,
  CheckCheck,
  ExternalLink,
  Sparkles,
  Camera,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';
import { openWhatsApp, getWhatsAppWebUrl } from '@/lib/whatsapp-send';

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
  phone,
  title = 'WhatsApp Investor Script',
  subtitle = 'Test-drive on your own device',
  dealRoomUrl,
  className = '',
}: WhatsAppHandoffCardProps) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(
        window.innerWidth < 768 ||
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      );
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Dispatch target URL
  const targetMessage = dealRoomUrl ? `${text}\n\nClient Deal Room: ${dealRoomUrl}` : text;
  const waWebUrl = getWhatsAppWebUrl(phone, targetMessage);
  const qrTargetUrl = waWebUrl;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    qrTargetUrl
  )}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(targetMessage);
    setCopied(true);
    toast.success('WhatsApp brief copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMobileOpen = () => {
    openWhatsApp({
      phone,
      text: targetMessage,
      recipientName: 'Dubai Investor',
    });
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

      {/* Dynamic Phone-to-Desktop Handoff Actions */}
      <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* On Mobile Phone: Direct 1-Tap App Launch */}
        {isMobile ? (
          <button
            type="button"
            onClick={handleMobileOpen}
            className="w-full h-11 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-98 transition-all"
          >
            <MessageCircle size={16} />
            <span>Open Directly in WhatsApp</span>
          </button>
        ) : (
          /* On Desktop/PC: Direct Web WhatsApp or QR Handoff to Mobile */
          <>
            <button
              type="button"
              onClick={() => setShowQr((v) => !v)}
              className={`h-10 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer active:scale-98 ${
                showQr
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-md'
                  : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
              }`}
            >
              <QrCode size={14} />
              <span>{showQr ? 'Hide Phone QR' : '📱 Scan for Phone WhatsApp'}</span>
            </button>

            <a
              href={waWebUrl}
              target="_blank"
              rel="noreferrer"
              className="h-10 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/15 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <ExternalLink size={13} />
              <span>Open Web WhatsApp</span>
            </a>
          </>
        )}
      </div>

      {/* QR Code Handoff Box (Desktop Users Scanning With Phone) */}
      <AnimatePresence>
        {showQr && !isMobile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-2xl bg-[#071015] border border-emerald-500/30 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left mt-2">
              {/* Live Scannable QR Code */}
              <div className="p-2.5 bg-white rounded-xl shadow-lg shrink-0 border-2 border-emerald-400/40 relative group">
                <img
                  src={qrApiUrl}
                  alt="Scan to open WhatsApp on your phone"
                  width={140}
                  height={140}
                  className="rounded-lg object-contain"
                  loading="lazy"
                />
              </div>

              {/* Instructions */}
              <div className="space-y-1.5 max-w-xs">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-400 font-extrabold text-xs">
                  <Camera size={14} />
                  <span>Scan with Phone Camera</span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-normal">
                  Point your iPhone or Android camera at the QR code to open this pitch and live Deal Room link instantly in your phone&apos;s WhatsApp app.
                </p>
                <div className="pt-1 flex items-center justify-center sm:justify-start gap-2 text-[10px] font-mono text-zinc-500">
                  <span className="flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-emerald-500" /> iOS &amp; Android
                  </span>
                  <span>•</span>
                  <span>Zero App Install</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
