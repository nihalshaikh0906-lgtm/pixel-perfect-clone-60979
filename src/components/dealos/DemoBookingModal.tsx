import { useState } from "react";
import {
  X,
  Calendar,
  Sparkles,
  Phone,
  Mail,
  Building2,
  Users,
  CheckCircle2,
  Video,
  ArrowRight,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DemoBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoBookingModal({ isOpen, onClose }: DemoBookingModalProps) {
  const [bookingMode, setBookingMode] = useState<"callback" | "zoom">("callback");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+971 ");
  const [agency, setAgency] = useState("");
  const [teamSize, setTeamSize] = useState("1–5 agents");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const calendlyUrl =
    (import.meta as unknown as { env: Record<string, string> }).env?.VITE_CALENDLY_URL ||
    "https://calendly.com/dealos-ae/demo";

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    const payload = {
      name: name.trim() || "Dubai Broker / Owner",
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      agency: agency.trim() || "Licensed Brokerage",
      role: "owner",
      team_size: teamSize,
      status: "new",
      created_at: new Date().toISOString(),
    };

    try {
      await (supabase as unknown as { from: (t: string) => any })
        .from("demo_requests")
        .insert(payload);
    } catch (err) {
      console.warn("Supabase insert note:", err);
    }

    try {
      const existing = JSON.parse(localStorage.getItem("dealos_demo_requests") || "[]");
      existing.push(payload);
      localStorage.setItem("dealos_demo_requests", JSON.stringify(existing));
    } catch {
      // ignore
    }

    setLoading(false);
    setDone(true);
    toast.success("Executive Demo Booked! Our Dubai advisory desk will reach out via WhatsApp.");
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in-50 duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-card border border-border/80 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border/70 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-primary/10 text-primary border border-primary/20">
                <Sparkles size={13} />
                Private Agency Walkthrough
              </span>
              <span className="text-xs text-muted-foreground font-mono">· RERA Verified</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground font-display tracking-tight">
              Book a DealOS Executive Demo
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Experience the live Dubai off-plan catalog, AI copilot, and broker overwatch.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-9 rounded-xl bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center border border-border/60 transition-all shrink-0 cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center p-1 rounded-2xl bg-secondary/70 border border-border/70 gap-1.5">
          <button
            type="button"
            onClick={() => setBookingMode("callback")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-[13px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              bookingMode === "callback"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>⚡ Quick Callback (30s)</span>
          </button>
          <button
            type="button"
            onClick={() => setBookingMode("zoom")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-[13px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              bookingMode === "zoom"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Video size={14} />
            <span>📅 Live Zoom (15m)</span>
          </button>
        </div>

        {done ? (
          <div className="text-center py-8 space-y-4 animate-in fade-in-50">
            <div className="size-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">Walkthrough Confirmed!</h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                Thank you, <strong className="text-foreground">{name || "Partner"}</strong>. Our Dubai team has received your request and will connect via WhatsApp at{" "}
                <strong className="text-foreground">{phone}</strong>.
              </p>
            </div>
            <Button
              type="button"
              onClick={onClose}
              className="h-11 px-6 rounded-xl font-bold text-xs sm:text-sm bg-secondary text-foreground hover:bg-secondary/80"
            >
              Close Window
            </Button>
          </div>
        ) : bookingMode === "callback" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tariq Al Mansoor"
                className="w-full h-11 px-3.5 rounded-xl border border-border/80 bg-secondary/30 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Work Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@brokerage.ae"
                  className="w-full h-11 px-3.5 rounded-xl border border-border/80 bg-secondary/30 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">WhatsApp / Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+971 50 000 0000"
                  className="w-full h-11 px-3.5 rounded-xl border border-border/80 bg-secondary/30 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Brokerage / Agency</label>
                <input
                  type="text"
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
                  placeholder="e.g. Luxury Realty Dubai"
                  className="w-full h-11 px-3.5 rounded-xl border border-border/80 bg-secondary/30 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Number of Agents</label>
                <select
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-border/80 bg-secondary/30 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-medium"
                >
                  <option value="1–5 agents">1–5 agents</option>
                  <option value="6–15 agents">6–15 agents</option>
                  <option value="16–50 agents">16–50 agents</option>
                  <option value="50+ agents">50+ Enterprise agents</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl text-xs sm:text-sm font-extrabold bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg shadow-primary/20 mt-2 cursor-pointer"
            >
              <span>{loading ? "Scheduling..." : "Request Live Demo Walkthrough ➔"}</span>
            </Button>

            <p className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-500" />
              <span>Zero obligation · 100% confidential Dubai agency consultation</span>
            </p>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20">
              <Calendar size={22} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                Book a Direct 15-Minute Zoom Call
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                Pick an available time on our live calendar with our Dubai operations team.
              </p>
            </div>
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl font-extrabold text-xs sm:text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md"
            >
              <span>Open Live Calendar ↗</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
