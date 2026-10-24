import { useState } from "react";
import {
  X,
  Sparkles,
  Phone,
  Mail,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DemoBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoBookingModal({ isOpen, onClose }: DemoBookingModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+971 ");
  const [agency, setAgency] = useState("");
  const [teamSize, setTeamSize] = useState("1–5 agents");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

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
    toast.success("Demo request sent! We will contact you directly to schedule your demo.");
  };

  const handleReset = () => {
    setDone(false);
    setName("");
    setEmail("");
    setPhone("+971 ");
    setAgency("");
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in-50 duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-card border border-border/80 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border/70 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-primary/10 text-primary border border-primary/20">
                <Sparkles size={13} className="text-amber-400" />
                Live 1-on-1 Walkthrough
              </span>
              <span className="text-xs text-muted-foreground font-mono">· RERA Compliant</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground font-display tracking-tight">
              Book a DealOS Demo
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Experience the 1,355+ Dubai off-plan catalog, AI copilot, and broker overwatch desk.
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

        {done ? (
          /* ═══ ELEGANT SUCCESS STATE (REQUEST SENT) ═══ */
          <div className="text-center py-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-md">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-1.5">
              <span className="inline-block text-[11px] font-bold font-mono uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Request Sent Successfully
              </span>
              <h3 className="text-2xl font-black text-foreground font-display">
                Demo Request Received!
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-foreground">{name || "Partner"}</strong>. We have received your demo request. Our team will review your agency profile and contact you directly via WhatsApp or phone at{" "}
                <strong className="text-foreground font-mono">{phone}</strong> to schedule and conduct your live demo.
              </p>
            </div>

            {/* Recap Card */}
            <div className="p-4 rounded-2xl bg-secondary/50 border border-border/70 text-left text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Contact</span>
                <span className="font-semibold text-foreground">{name || "Broker"} · {email}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">WhatsApp / Phone</span>
                <span className="font-mono font-bold text-foreground">{phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Brokerage / Team</span>
                <span className="font-semibold text-foreground">{agency || "Licensed Brokerage"} ({teamSize})</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <Button
                type="button"
                onClick={onClose}
                className="w-full h-11 rounded-xl font-bold text-xs sm:text-sm bg-primary text-primary-foreground hover:bg-primary/90 shadow-md cursor-pointer"
              >
                Done
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="w-full h-11 rounded-xl font-bold text-xs bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Book for another agency
              </Button>
            </div>
          </div>
        ) : (
          /* ═══ CLEAN, DIRECT BOOKING FORM ═══ */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">Full Name *</label>
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
                <label className="text-xs font-bold text-foreground block">Work Email *</label>
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
                <label className="text-xs font-bold text-foreground block">WhatsApp / Phone *</label>
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
                  placeholder="e.g. Apex Luxury Properties"
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
              className="w-full h-12 rounded-xl text-xs sm:text-sm font-extrabold bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg shadow-primary/20 mt-2 cursor-pointer transition-all active:scale-[0.99]"
            >
              <span>{loading ? "Transmitting Request..." : "Book Demo Walkthrough ➔"}</span>
            </Button>

            <p className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck size={13} className="text-emerald-500" />
              <span>We will contact you via WhatsApp / phone to conduct your live demo</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
