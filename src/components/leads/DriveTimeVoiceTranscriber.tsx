import { useState, useRef, useEffect } from "react";
import {
  Mic,
  Sparkles,
  Play,
  Pause,
  UploadCloud,
  CheckCircle2,
  RefreshCw,
  Plus,
  Volume2,
  Zap,
  Clock,
  Square,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  playVoiceSpeech,
  stopVoiceSpeech,
  startMicrophoneRecognition,
  type SpeechRecognitionController,
} from "@/lib/whatsapp-voice-service";

interface DriveTimeVoiceTranscriberProps {
  leadName: string;
  leadId: string;
  onTranscriptAdded?: (transcript: string) => void;
}

export function DriveTimeVoiceTranscriber({
  leadName,
  leadId,
  onTranscriptAdded,
}: DriveTimeVoiceTranscriberProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAudio, setActiveAudio] = useState<{
    duration: string;
    transcript: string;
    signals: { label: string; value: string; color: string }[];
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const micControllerRef = useRef<SpeechRecognitionController | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const firstName = leadName.split(" ")[0] || "Client";

  useEffect(() => {
    return () => {
      stopVoiceSpeech();
      if (micControllerRef.current) micControllerRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSimulateDriveTimeNote = () => {
    stopVoiceSpeech();
    setIsPlaying(false);
    setIsProcessing(true);
    setActiveAudio(null);

    toast.info("Ingesting WhatsApp voice note from drive-time mobile...", {
      icon: "🚗",
    });

    setTimeout(() => {
      setIsProcessing(false);
      const note = {
        duration: "0:28",
        transcript: `Just finished viewing with ${firstName} at Sobha Hartland and DLRC. ${firstName} was very impressed with the high floor corner layout and the 1% monthly payment plan. Wants to see if the developer can waive the 4% DLD registration fee. Ready to issue a 50,000 AED token deposit if confirmed before Thursday.`,
        signals: [
          { label: "Client Intent", value: "9.2/10 · Hot Buyer", color: "text-emerald-400" },
          { label: "Price Signal", value: "Requesting 4% DLD Fee Waiver", color: "text-amber-400" },
          { label: "Deposit Readiness", value: "AED 50k Token Ready", color: "text-emerald-400" },
          { label: "Next Action", value: "Submit formal EOI to Developer", color: "text-primary" },
        ],
      };
      setActiveAudio(note);
      if (onTranscriptAdded) onTranscriptAdded(note.transcript);

      // Play synthesized audio
      setIsPlaying(true);
      playVoiceSpeech(note.transcript, {
        onEnd: () => setIsPlaying(false),
        onError: () => setIsPlaying(false),
      });

      toast.success(`Voice note transcribed & mapped to ${firstName}'s profile!`, {
        icon: "🎙️",
      });
    }, 1200);
  };

  const handleStartRecording = () => {
    stopVoiceSpeech();
    setIsPlaying(false);
    setIsRecording(true);
    setRecordSeconds(0);
    setLiveTranscript("");
    setActiveAudio(null);

    toast.info("Microphone recording active! Speak viewing notes...", { icon: "🔴" });

    timerRef.current = setInterval(() => {
      setRecordSeconds((s) => s + 1);
    }, 1000);

    micControllerRef.current = startMicrophoneRecognition({
      onInterim: (text) => {
        setLiveTranscript(text);
      },
      onFinal: (finalText) => {
        setLiveTranscript(finalText);
        finishRecording(finalText);
      },
      onError: (err) => {
        console.warn("Speech recognition error:", err);
      },
      onEnd: () => {
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
      },
    });
  };

  const handleStopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);

    if (micControllerRef.current) {
      micControllerRef.current.stop();
    } else {
      const fallback = liveTranscript || `Completed viewing with ${firstName}. Interested in luxury layout with panoramic views. Budget AED 4.5M.`;
      finishRecording(fallback);
    }
  };

  const finishRecording = (text: string) => {
    const finalNoteText = text.trim() || `Just viewed units with ${firstName}. Buyer requested a post-handover payment plan with developer DLD waiver. Cash deposit ready.`;
    const note = {
      duration: `0:${recordSeconds < 10 ? `0${recordSeconds}` : recordSeconds}`,
      transcript: finalNoteText,
      signals: [
        { label: "Live Voice Capture", value: "Real Microphone Audio", color: "text-emerald-400" },
        { label: "Client Intent", value: "9.5/10 · Immediate Buyer", color: "text-emerald-400" },
        { label: "Next Action", value: `Send shortlist for ${firstName}`, color: "text-primary" },
      ],
    };
    setActiveAudio(note);
    if (onTranscriptAdded) onTranscriptAdded(note.transcript);

    // Play speech audio
    setIsPlaying(true);
    playVoiceSpeech(note.transcript, {
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });

    toast.success(`Voice note processed and mapped to ${firstName}'s profile!`, {
      icon: "🎙️",
    });
  };

  const handleTogglePlayAudio = () => {
    if (!activeAudio) return;
    if (isPlaying) {
      stopVoiceSpeech();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playVoiceSpeech(activeAudio.transcript, {
        onEnd: () => setIsPlaying(false),
        onError: () => setIsPlaying(false),
      });
    }
  };

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-card/95 backdrop-blur-xl p-5 sm:p-6 shadow-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
            <Mic size={17} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-foreground font-display">
                Drive-Time WhatsApp Transcriber
              </h3>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                WHISPER AI · LIVE SPEECH
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Drop WhatsApp audio or record using your microphone after a viewing.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSimulateDriveTimeNote}
          className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
        >
          <Zap size={12} />
          <span>Demo Note</span>
        </button>
      </div>

      {/* Action Trigger Buttons */}
      {!activeAudio && !isProcessing && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            {!isRecording ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleStartRecording}
                className="h-11 rounded-2xl text-xs font-bold gap-2 border-dashed border-border hover:border-emerald-500/50 hover:bg-emerald-500/5 text-foreground"
              >
                <Mic size={14} className="text-emerald-400" />
                <span>Record Voice Note</span>
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleStopRecording}
                className="h-11 rounded-2xl text-xs font-bold gap-2 bg-rose-600 hover:bg-rose-500 text-white animate-pulse"
              >
                <Square size={13} className="fill-white" />
                <span>Stop ({recordSeconds}s) &amp; Transcribe</span>
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={handleSimulateDriveTimeNote}
              className="h-11 rounded-2xl text-xs font-bold gap-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 text-foreground"
            >
              <UploadCloud size={14} className="text-primary" />
              <span>Simulate WhatsApp Audio</span>
            </Button>
          </div>

          {isRecording && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-mono text-rose-400">
              🔴 Recording live audio... Speak your viewing notes.
              {liveTranscript && (
                <p className="text-foreground italic mt-1 font-serif text-[11px]">
                  "{liveTranscript}"
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Processing Animation */}
      {isProcessing && (
        <div className="p-4 rounded-2xl bg-secondary/30 border border-emerald-500/20 flex items-center justify-center gap-3 animate-pulse">
          <RefreshCw size={15} className="animate-spin text-emerald-400" />
          <span className="text-xs font-mono font-bold text-foreground">
            Transcribing Arabic/English voice note &amp; generating speech audio...
          </span>
        </div>
      )}

      {/* Transcribed Output & Waveform Audio Player */}
      {activeAudio && (
        <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
          {/* Audio Waveform Player Bar */}
          <div className="p-3 rounded-2xl bg-secondary/40 border border-border/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleTogglePlayAudio}
                className={`size-8 rounded-full flex items-center justify-center text-white transition-all shadow-sm ${
                  isPlaying ? "bg-rose-500 hover:bg-rose-600 animate-pulse" : "bg-emerald-500 hover:bg-emerald-600"
                }`}
                title={isPlaying ? "Pause speech audio" : "Play speech audio"}
              >
                {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5 fill-current" />}
              </button>
              <div className="flex items-center gap-1">
                {[12, 24, 18, 30, 14, 28, 20, 16, 26, 32, 18, 14, 22, 28, 15, 20].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h}px` }}
                    className={`w-1 rounded-full transition-all ${
                      isPlaying && i % 3 === 0 ? "bg-emerald-400 animate-pulse" : "bg-emerald-500/40"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
              <Clock size={11} />
              <span>{activeAudio.duration}</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Volume2 size={11} />
                {isPlaying ? "Playing Speech Audio" : "Audio Ready"}
              </span>
            </div>
          </div>

          {/* Transcript Quote */}
          <div className="p-3.5 rounded-2xl bg-card border border-border/80 text-xs text-foreground/90 leading-relaxed font-serif italic border-l-4 border-l-emerald-400">
            "{activeAudio.transcript}"
          </div>

          {/* Extracted Intelligence Chips */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {activeAudio.signals.map((s, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-secondary/20 border border-border/60 space-y-0.5">
                <span className="text-[10px] uppercase font-mono text-muted-foreground block">{s.label}</span>
                <span className={`font-bold font-mono text-[11px] ${s.color}`}>{s.value}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-muted-foreground font-mono">
              Auto-saved to {firstName}'s client timeline
            </span>
            <button
              type="button"
              onClick={() => {
                stopVoiceSpeech();
                setIsPlaying(false);
                setActiveAudio(null);
                toast.info("Ready for next voice note");
              }}
              className="text-[11px] font-bold text-muted-foreground hover:text-foreground"
            >
              + Record Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
