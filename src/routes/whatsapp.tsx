import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MessageSquare, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { WhatsAppQrSync } from "@/components/whatsapp/WhatsAppQrSync";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/whatsapp")({
  head: () => ({
    meta: [
      { title: "WhatsApp Gateway & Voice Transcriber · DealOS" },
      {
        name: "description",
        content:
          "Connect WhatsApp Web Multi-Device, transcribe incoming investor voice notes with real audio playback, and capture live microphone viewing notes directly into DealOS CRM.",
      },
    ],
  }),
  component: WhatsAppPublicPage,
});

export function WhatsAppPublicPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/welcome"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>Landing Page</span>
            </Link>

            <div className="h-4 w-px bg-border/60" />

            <Link to="/welcome" className="flex items-center gap-2">
              <Logo />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Gateway Playground
            </span>

            <Button asChild size="sm" variant="outline" className="rounded-xl text-xs font-bold gap-1.5 border-border">
              <a href="/app/leads">
                <span>Leads Inbox</span>
                <ArrowRight size={13} />
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        {/* Hero Section */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <MessageSquare size={13} />
            <span>Multi-Device WhatsApp Bridge · Real Speech Audio &amp; Microphone Active</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display tracking-tight">
            WhatsApp Web Gateway &amp; Voice Note Transcriber
          </h1>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Test the entire pipeline directly: scan WhatsApp Web, test the 3 audio note samples (now with real voice speech audio and automatic CRM lead creation), or test the live microphone transcriber without any sign-in wall.
          </p>
        </div>

        {/* The Core WhatsApp & Microphone Suite */}
        <WhatsAppQrSync />

        {/* Bottom Trust & Tech Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/60 text-xs">
          <div className="p-4 rounded-2xl bg-secondary/20 border border-border/60 space-y-1">
            <span className="font-bold text-foreground block">Real Speech Audio Playback</span>
            <p className="text-[11px] text-muted-foreground">
              Uses Web Speech synthesis and acoustic WhatsApp chimes to audibly speak investor transcripts through device speakers.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-secondary/20 border border-border/60 space-y-1">
            <span className="font-bold text-foreground block">Automatic CRM Lead Ingestion</span>
            <p className="text-[11px] text-muted-foreground">
              Every simulated note or microphone recording instantly creates a real Lead record with parsed AED budget in DealOS CRM.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-secondary/20 border border-border/60 space-y-1">
            <span className="font-bold text-foreground block">Device Microphone Support</span>
            <p className="text-[11px] text-muted-foreground">
              Uses native Web SpeechRecognition and MediaRecorder for instant browser testing with zero account requirement.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
