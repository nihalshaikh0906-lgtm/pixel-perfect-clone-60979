import { useState, useEffect } from "react";
import {
  QrCode,
  Smartphone,
  CheckCircle2,
  RefreshCw,
  LogOut,
  Mic,
  Sparkles,
  Zap,
  Play,
  Pause,
  ArrowRight,
  ShieldCheck,
  Building2,
  DollarSign,
  MapPin,
  Clock,
  Radio,
} from "lucide-react";
import { toast } from "sonner";
import {
  getWhatsAppSession,
  saveWhatsAppSession,
  connectMockWhatsApp,
  disconnectWhatsApp,
  getProcessedVoiceNotes,
  ingestVoiceNote,
  SAMPLE_VOICENOTES,
  type WhatsAppSession,
  type VoiceNoteSimulation,
} from "@/lib/whatsapp-gateway";
import { Button } from "@/components/ui/button";

export function WhatsAppQrSync() {
  const [session, setSession] = useState<WhatsAppSession>(getWhatsAppSession);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [activeVoiceNote, setActiveVoiceNote] = useState<VoiceNoteSimulation | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showQrModal && countdown > 0 && !session.connected) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      // auto refresh QR
      setCountdown(60);
    }
    return () => clearInterval(timer);
  }, [showQrModal, countdown, session.connected]);

  const handleStartLinking = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowQrModal(true);
      setCountdown(60);
    }, 600);
  };

  const handleSimulateScan = () => {
    toast.loading("Authenticating WhatsApp Multi-Device session...", { id: "wa-connect" });
    setTimeout(() => {
      const newSession = connectMockWhatsApp();
      setSession(newSession);
      setShowQrModal(false);
      toast.success("WhatsApp Linked Successfully! Device: +971 50 839 2104", { id: "wa-connect" });
    }, 1200);
  };

  const handleDisconnect = () => {
    if (confirm("Are you sure you want to unlink your WhatsApp device? Automated voice note transcription will be paused.")) {
      const reset = disconnectWhatsApp();
      setSession(reset);
      setShowQrModal(false);
      toast.info("WhatsApp session disconnected");
    }
  };

  const handleToggleSetting = (key: keyof WhatsAppSession) => {
    const updated = { ...session, [key]: !session[key] };
    setSession(updated);
    saveWhatsAppSession(updated);
    toast.success("Gateway preference updated");
  };

  const handleRunVoiceNoteDemo = (sample: VoiceNoteSimulation) => {
    setIsProcessingVoice(true);
    setActiveVoiceNote(null);
    setIsPlayingAudio(true);

    toast.info("Incoming WhatsApp audio note received...", { icon: "🎙️" });

    setTimeout(() => {
      setIsProcessingVoice(false);
      setActiveVoiceNote(sample);
      ingestVoiceNote(sample);
      toast.success(`Voice note transcribed for ${sample.senderName}! AI extracted AED ${(sample.extractedData.budgetAed / 1000000).toFixed(1)}M budget.`, {
        duration: 4000,
      });
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Main Connection Card */}
      <section className="rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div className="flex items-start sm:items-center gap-3">
            <div className="size-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <QrCode size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-foreground font-display">
                  WhatsApp Web Gateway (Linked Devices)
                </h2>
                {session.connected ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    CONNECTED · LIVE SYNC
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    UNLINKED
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Scan via WhatsApp on your phone in 10 seconds. Keeps your personal number, existing chats, and auto-transcribes client voice notes.
              </p>
            </div>
          </div>

          <div>
            {session.connected ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                className="h-9 rounded-xl text-xs font-bold gap-1.5 border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
              >
                <LogOut size={13} />
                <span>Disconnect WhatsApp</span>
              </Button>
            ) : (
              <Button
                onClick={handleStartLinking}
                disabled={isGenerating}
                className="h-9 rounded-xl text-xs font-bold gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
              >
                {isGenerating ? <RefreshCw size={13} className="animate-spin" /> : <QrCode size={13} />}
                <span>{isGenerating ? "Generating QR..." : "Connect WhatsApp (Scan QR)"}</span>
              </Button>
            )}
          </div>
        </div>

        {/* Status Display */}
        {session.connected ? (
          <div className="space-y-6">
            {/* Active Device Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 space-y-1">
                <span className="text-[10px] uppercase font-mono font-bold text-muted-foreground">Linked Number</span>
                <p className="text-sm font-extrabold text-foreground font-mono flex items-center gap-1.5">
                  <Smartphone size={14} className="text-emerald-400" />
                  {session.phoneNumber || "+971 50 839 2104"}
                </p>
                <p className="text-[10px] text-muted-foreground">Multi-Device Web Session</p>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 space-y-1">
                <span className="text-[10px] uppercase font-mono font-bold text-muted-foreground">Session Status</span>
                <p className="text-sm font-extrabold text-emerald-400 font-mono flex items-center gap-1.5">
                  <Radio size={14} className="animate-pulse" />
                  Active &amp; Listening
                </p>
                <p className="text-[10px] text-muted-foreground">Latency: 28ms (Dubai Edge)</p>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 space-y-1">
                <span className="text-[10px] uppercase font-mono font-bold text-muted-foreground">AI Transcriber</span>
                <p className="text-sm font-extrabold text-foreground font-mono flex items-center gap-1.5">
                  <Sparkles size={14} className="text-primary" />
                  Whisper Real Estate Model
                </p>
                <p className="text-[10px] text-muted-foreground">Arabic, English, French &amp; Russian</p>
              </div>
            </div>

            {/* Automation Toggles */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-extrabold uppercase font-mono text-muted-foreground tracking-wider">
                Automated Ingestion Rules
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleSetting("autoTranscribe")}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    session.autoTranscribe
                      ? "bg-emerald-500/5 border-emerald-500/30 text-foreground"
                      : "bg-secondary/20 border-border/60 text-muted-foreground"
                  }`}
                >
                  <div className={`size-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                    session.autoTranscribe ? "bg-emerald-500 border-emerald-400 text-white" : "border-border"
                  }`}>
                    {session.autoTranscribe && <CheckCircle2 size={12} />}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold">Auto-Transcribe Voice Notes</p>
                    <p className="text-[10px] text-muted-foreground">Converts incoming investor audio notes into clean text dossier records.</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleSetting("autoCreateLeads")}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    session.autoCreateLeads
                      ? "bg-emerald-500/5 border-emerald-500/30 text-foreground"
                      : "bg-secondary/20 border-border/60 text-muted-foreground"
                  }`}
                >
                  <div className={`size-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                    session.autoCreateLeads ? "bg-emerald-500 border-emerald-400 text-white" : "border-border"
                  }`}>
                    {session.autoCreateLeads && <CheckCircle2 size={12} />}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold">Auto-Extract Budgets &amp; Area</p>
                    <p className="text-[10px] text-muted-foreground">Parses AED values, bedroom count, and desired locations directly into lead fields.</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleSetting("autoMatchInventory")}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    session.autoMatchInventory
                      ? "bg-emerald-500/5 border-emerald-500/30 text-foreground"
                      : "bg-secondary/20 border-border/60 text-muted-foreground"
                  }`}
                >
                  <div className={`size-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                    session.autoMatchInventory ? "bg-emerald-500 border-emerald-400 text-white" : "border-border"
                  }`}>
                    {session.autoMatchInventory && <CheckCircle2 size={12} />}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold">Instant Off-Plan Allocations</p>
                    <p className="text-[10px] text-muted-foreground">Matches developer projects from 1,355+ catalog as soon as an inquiry arrives.</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Interactive Voice Note Simulator Playground */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic size={16} className="text-primary" />
                  <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider font-mono">
                    Test Live Voice Note Ingestion (Simulator)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-primary font-bold bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                  Interactive Test
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                Click any incoming WhatsApp audio sample below to watch DealOS transcribe the voice note, parse the client's budget, and prepare the lead dossier:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {SAMPLE_VOICENOTES.map((note) => (
                  <button
                    key={note.id}
                    type="button"
                    disabled={isProcessingVoice}
                    onClick={() => handleRunVoiceNoteDemo(note)}
                    className="p-3.5 rounded-xl border border-border/70 bg-card/80 hover:bg-card hover:border-primary/50 text-left transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-foreground group-hover:text-primary transition-colors">
                        {note.senderName}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">{note.audioDuration}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Mic size={12} className="text-emerald-400" />
                      <span>{note.language}</span>
                      <span>·</span>
                      <span className="font-mono">{note.timestamp}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-primary pt-1">
                      <Play size={12} className="fill-current" />
                      <span>Simulate Audio Ingestion</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Processing Spinner */}
              {isProcessingVoice && (
                <div className="p-4 rounded-xl bg-card border border-primary/30 flex items-center justify-center gap-3 animate-pulse">
                  <RefreshCw size={16} className="animate-spin text-primary" />
                  <span className="text-xs font-bold text-foreground font-mono">
                    AI transcribing WhatsApp voice note &amp; extracting real-estate parameters...
                  </span>
                </div>
              )}

              {/* Extracted Dossier Result Preview */}
              {activeVoiceNote && (
                <div className="p-4 rounded-xl bg-card border border-emerald-500/30 space-y-3 shadow-sm animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-emerald-400" />
                      <span className="text-xs font-extrabold text-foreground font-mono">
                        Transcription &amp; Lead Extraction Result
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      100% Parsed
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-secondary/30 text-xs italic text-foreground/90 border border-border/40 font-serif leading-relaxed">
                    "{activeVoiceNote.transcript}"
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                    <div className="p-2.5 rounded-lg bg-secondary/20 border border-border/60">
                      <span className="text-[10px] uppercase font-mono text-muted-foreground block">Client</span>
                      <span className="font-extrabold text-foreground">{activeVoiceNote.extractedData.clientName}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-secondary/20 border border-border/60">
                      <span className="text-[10px] uppercase font-mono text-muted-foreground block">Budget (AED)</span>
                      <span className="font-extrabold text-emerald-400 font-mono">
                        AED {(activeVoiceNote.extractedData.budgetAed / 1000000).toFixed(1)}M
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-secondary/20 border border-border/60">
                      <span className="text-[10px] uppercase font-mono text-muted-foreground block">Requirement</span>
                      <span className="font-extrabold text-foreground">{activeVoiceNote.extractedData.bedrooms}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-secondary/20 border border-border/60">
                      <span className="text-[10px] uppercase font-mono text-muted-foreground block">Areas</span>
                      <span className="font-extrabold text-foreground truncate block">
                        {activeVoiceNote.extractedData.preferredAreas.join(", ")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-muted-foreground font-mono">
                      Matched to 1,355+ Off-Plan Registry · Lead dossier automatically saved
                    </span>
                    <a
                      href="/app/leads"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                    >
                      <span>Open in Leads Inbox</span>
                      <ArrowRight size={13} />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Unlinked State Preview */
          <div className="p-6 rounded-2xl bg-secondary/20 border border-border/60 text-center space-y-4">
            <div className="size-14 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <QrCode size={28} />
            </div>

            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-sm font-extrabold text-foreground">
                No WhatsApp Device Linked Yet
              </h3>
              <p className="text-xs text-muted-foreground">
                Link your phone via WhatsApp Web in 10 seconds. You keep your own number and clients; DealOS silently logs chats and auto-transcribes voice notes into your CRM.
              </p>
            </div>

            <Button
              onClick={handleStartLinking}
              disabled={isGenerating}
              className="h-10 px-5 rounded-xl text-xs font-bold gap-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-md mx-auto"
            >
              <QrCode size={15} />
              <span>Generate My WhatsApp QR Code</span>
            </Button>
          </div>
        )}
      </section>

      {/* QR Code Scan Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <QrCode size={18} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-foreground font-display">
                    Link WhatsApp to DealOS
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    End-to-End Encrypted Multi-Device Gateway
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="text-xs font-mono text-muted-foreground hover:text-foreground p-1"
              >
                ✕ Close
              </button>
            </div>

            {/* QR Visual & Instructions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* QR Box */}
              <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-zinc-200 shadow-inner relative group">
                {/* Simulated Sharp QR Code */}
                <div className="relative size-44 bg-white p-2 rounded-xl flex items-center justify-center">
                  <svg
                    viewBox="0 0 200 200"
                    className="size-full text-zinc-950"
                    fill="currentColor"
                  >
                    {/* Finder Patterns */}
                    <rect x="10" y="10" width="50" height="50" rx="6" fill="black" />
                    <rect x="18" y="18" width="34" height="34" rx="4" fill="white" />
                    <rect x="26" y="26" width="18" height="18" rx="2" fill="black" />

                    <rect x="140" y="10" width="50" height="50" rx="6" fill="black" />
                    <rect x="148" y="18" width="34" height="34" rx="4" fill="white" />
                    <rect x="156" y="26" width="18" height="18" rx="2" fill="black" />

                    <rect x="10" y="140" width="50" height="50" rx="6" fill="black" />
                    <rect x="18" y="148" width="34" height="34" rx="4" fill="white" />
                    <rect x="26" y="156" width="18" height="18" rx="2" fill="black" />

                    {/* QR Matrix Bits */}
                    <rect x="70" y="15" width="12" height="12" />
                    <rect x="90" y="25" width="12" height="12" />
                    <rect x="110" y="15" width="12" height="12" />
                    <rect x="70" y="45" width="12" height="12" />
                    <rect x="110" y="45" width="12" height="12" />

                    <rect x="15" y="75" width="12" height="12" />
                    <rect x="35" y="90" width="12" height="12" />
                    <rect x="15" y="110" width="12" height="12" />

                    <rect x="75" y="75" width="10" height="10" />
                    <rect x="115" y="75" width="10" height="10" />
                    <rect x="75" y="115" width="10" height="10" />
                    <rect x="115" y="115" width="10" height="10" />

                    <rect x="145" y="75" width="12" height="12" />
                    <rect x="165" y="95" width="12" height="12" />
                    <rect x="145" y="115" width="12" height="12" />
                    <rect x="175" y="115" width="12" height="12" />

                    <rect x="75" y="145" width="12" height="12" />
                    <rect x="95" y="165" width="12" height="12" />
                    <rect x="115" y="145" width="12" height="12" />
                    <rect x="145" y="145" width="12" height="12" />
                    <rect x="165" y="165" width="12" height="12" />
                  </svg>

                  {/* Centered WhatsApp Badge */}
                  <div className="absolute size-9 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-md">
                    <Smartphone size={16} />
                  </div>
                </div>

                <div className="mt-2 text-[10px] font-mono text-zinc-600 font-bold flex items-center gap-1">
                  <Clock size={11} className="text-zinc-500" />
                  <span>Expires in {countdown}s</span>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="size-5 rounded-full bg-primary/10 text-primary font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                    1
                  </span>
                  <p className="text-muted-foreground">
                    Open <strong className="text-foreground">WhatsApp</strong> on your phone.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="size-5 rounded-full bg-primary/10 text-primary font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                    2
                  </span>
                  <p className="text-muted-foreground">
                    Go to <strong className="text-foreground">Settings</strong> → <strong className="text-foreground">Linked Devices</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="size-5 rounded-full bg-primary/10 text-primary font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                    3
                  </span>
                  <p className="text-muted-foreground">
                    Tap <strong className="text-foreground">Link a Device</strong> and point your camera at this QR code.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-[11px] text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <ShieldCheck size={13} />
                    <span>Zero Meta Bureaucracy</span>
                  </div>
                  <p>Your chats remain end-to-end encrypted. No business verification or second SIM required.</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-border/60">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCountdown(60)}
                className="text-xs text-muted-foreground hover:text-foreground h-8 gap-1.5"
              >
                <RefreshCw size={12} />
                <span>Refresh QR Code</span>
              </Button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  onClick={handleSimulateScan}
                  className="w-full sm:w-auto h-9 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5 shadow-md"
                >
                  <Zap size={13} />
                  <span>Simulate Instant Scan (1-Click Test)</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
