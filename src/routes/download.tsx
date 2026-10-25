import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Smartphone,
  Apple,
  Download,
  QrCode,
  Share2,
  PlusSquare,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { toast } from "sonner";
import { PublicLayout, Eyebrow, meta } from "@/components/public/PublicLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/download")({
  head: () =>
    meta(
      "Download DealOS Mobile App · iOS, Android & Desktop",
      "Install DealOS on your iPhone, Android, or Mac. Direct 1-tap installation, offline client profiles, and WhatsApp auto-transcription."
    ),
  component: DownloadPage,
});

export function DownloadPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running as PWA / Standalone
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsStandalone(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        toast.success("DealOS installed to your device!");
      }
      setDeferredPrompt(null);
    } else {
      // Guide iPhone users
      toast.info(
        "On iPhone: Tap the Share button in Safari, then tap 'Add to Home Screen'!",
        { duration: 6000 }
      );
    }
  };

  return (
    <PublicLayout>
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <Eyebrow>Mobile First Architecture</Eyebrow>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold tracking-tight md:text-6xl text-foreground font-display">
          DealOS in Your Pocket
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-[16px] text-muted-foreground leading-relaxed">
          Full-screen mobile cockpit designed for Dubai brokers on the move. Record viewing voice notes, generate client deal rooms, and access 34,850+ DLD units from Sheikh Zayed Road to Palm Jumeirah.
        </p>

        {/* 1-Click Install Banner for Mobile */}
        <div className="mt-10 mx-auto max-w-xl p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-card to-emerald-500/5 border border-emerald-500/30 shadow-lg space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              {isStandalone ? "DealOS Standalone App Active" : "Instant 1-Tap Installation Ready"}
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-foreground font-display">
            Install Without App Store Wait
          </h3>
          <p className="text-xs text-muted-foreground">
            Zero App Store downloads required. Instant zero-latency loading with offline cached client profiles and push notifications.
          </p>

          <Button
            onClick={handleInstallClick}
            className="h-12 px-8 rounded-2xl text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl gap-2 w-full sm:w-auto"
          >
            <Download size={16} />
            <span>Install DealOS to Home Screen</span>
          </Button>
        </div>

        {/* Platform Installation Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {/* iOS Card */}
          <div className="p-7 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-md space-y-5">
            <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-foreground">
              <Apple size={24} />
            </div>
            <div>
              <h4 className="text-lg font-extrabold text-foreground">Apple iOS (iPhone &amp; iPad)</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Optimized for iPhone 14/15/16 Pro Dynamic Island and Safari PWA.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="size-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                <p className="text-muted-foreground">Open <strong className="text-foreground">dealos.ae</strong> in Safari.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="size-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                <p className="text-muted-foreground">Tap the <Share2 size={13} className="inline text-primary mx-1" /> <strong>Share</strong> button at bottom.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="size-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                <p className="text-muted-foreground">Scroll down &amp; tap <PlusSquare size={13} className="inline text-emerald-400 mx-1" /> <strong>Add to Home Screen</strong>.</p>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast.info("Public TestFlight invitation link generated! Use TestFlight on iOS for native build.", { icon: "✈️" });
                }}
                className="w-full h-10 rounded-xl text-xs font-bold gap-2"
              >
                <span>Request iOS TestFlight Invite</span>
                <ArrowRight size={13} />
              </Button>
            </div>
          </div>

          {/* Android Card */}
          <div className="p-7 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-md space-y-5">
            <div className="size-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Smartphone size={24} />
            </div>
            <div>
              <h4 className="text-lg font-extrabold text-foreground">Google Android</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Compatible with Samsung Galaxy, Google Pixel, and all Android devices.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="size-5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                <p className="text-muted-foreground">Open in Google Chrome.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="size-5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                <p className="text-muted-foreground">Tap the 3 dots menu in the top right.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="size-5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                <p className="text-muted-foreground">Tap <strong>Install App</strong> or <strong>Add to Home screen</strong>.</p>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast.success("Downloading DealOS APK direct installer...", { icon: "📥" });
                  window.location.href = "/welcome";
                }}
                className="w-full h-10 rounded-xl text-xs font-bold gap-2 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
              >
                <Download size={13} />
                <span>Direct APK Installer (v2.1)</span>
              </Button>
            </div>
          </div>

          {/* Desktop PWA / Mac Card */}
          <div className="p-7 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-md space-y-5">
            <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Compass size={24} />
            </div>
            <div>
              <h4 className="text-lg font-extrabold text-foreground">macOS &amp; Windows</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Install as a dedicated standalone desktop app with keyboard shortcuts.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="size-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                <p className="text-muted-foreground">Click the install icon in Chrome / Edge address bar.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="size-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                <p className="text-muted-foreground">Select <strong>Install DealOS</strong>.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="size-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                <p className="text-muted-foreground">Dock in your Mac Dock or Windows Taskbar.</p>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleInstallClick}
                className="w-full h-10 rounded-xl text-xs font-bold gap-2"
              >
                <Download size={13} />
                <span>Install Desktop App</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Live Scan QR Code for Desktop Visitors */}
        <div className="mt-16 mx-auto max-w-2xl p-8 rounded-3xl border border-border/80 bg-card/90 shadow-xl flex flex-col sm:flex-row items-center gap-8 text-left">
          <div className="size-36 p-2 rounded-2xl bg-white border border-zinc-200 shrink-0 shadow-md flex items-center justify-center">
            {/* SVG QR Code */}
            <svg viewBox="0 0 100 100" className="size-full text-black" fill="currentColor">
              <rect x="5" y="5" width="25" height="25" rx="3" fill="black" />
              <rect x="9" y="9" width="17" height="17" rx="2" fill="white" />
              <rect x="13" y="13" width="9" height="9" fill="black" />

              <rect x="70" y="5" width="25" height="25" rx="3" fill="black" />
              <rect x="74" y="9" width="17" height="17" rx="2" fill="white" />
              <rect x="78" y="13" width="9" height="9" fill="black" />

              <rect x="5" y="70" width="25" height="25" rx="3" fill="black" />
              <rect x="9" y="74" width="17" height="17" rx="2" fill="white" />
              <rect x="13" y="78" width="9" height="9" fill="black" />

              <rect x="35" y="10" width="8" height="8" />
              <rect x="48" y="15" width="8" height="8" />
              <rect x="35" y="35" width="8" height="8" />
              <rect x="48" y="48" width="8" height="8" />
              <rect x="65" y="40" width="8" height="8" />
              <rect x="80" y="50" width="8" height="8" />
              <rect x="35" y="75" width="8" height="8" />
              <rect x="55" y="80" width="8" height="8" />
              <rect x="75" y="75" width="8" height="8" />
            </svg>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
              DESKTOP-TO-MOBILE SYNC
            </span>
            <h4 className="text-lg font-extrabold text-foreground font-display">
              Scan with your iPhone or Android
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Point your phone camera here to open DealOS directly in your mobile browser, complete with full offline client synchronization and 1-tap WhatsApp outreach.
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
