import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Users,
  Lock,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  User,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/join")({
  validateSearch: (s: Record<string, unknown>) => ({
    agency: typeof s["agency"] === "string" ? s["agency"] : "Skyline Luxury Real Estate LLC",
    token: typeof s["token"] === "string" ? s["token"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Join Agency Workspace · DealOS" },
      { name: "description", content: "Activate your broker seat under your agency's DealOS enterprise license." },
    ],
  }),
  component: JoinAgencyPage,
});

export function JoinAgencyPage() {
  const { agency, token } = Route.useSearch();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+971 ");
  const [reraBrn, setReraBrn] = useState("BRN-");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const agencyDisplayName = decodeURIComponent(agency || "Skyline Luxury Real Estate LLC");

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || password.length < 8) {
      toast.error("Please complete all required fields (password minimum 8 characters).");
      return;
    }

    setLoading(true);
    toast.loading("Verifying agency seat allocation...", { id: "join-seat" });

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            company: agencyDisplayName,
            phone: phone.trim(),
            rera_brn: reraBrn.trim(),
            role: "Senior Broker",
            invited_by_token: token || null,
          },
        },
      });

      if (error) {
        toast.error(error.message, { id: "join-seat" });
        setLoading(false);
        return;
      }

      toast.success(`Welcome to ${agencyDisplayName}! Your broker seat is active.`, { id: "join-seat" });
      setTimeout(() => {
        void navigate({
          to: "/verifying",
          search: { role: "broker", email: email.trim() },
          replace: true,
        });
      }, 800);
    } catch (err: any) {
      toast.error(err.message || "Failed to activate seat", { id: "join-seat" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between py-10 px-4 sm:px-6">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Top Logo */}
        <div className="text-center">
          <div className="inline-block">
            <Logo variant="dark" size={32} />
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[11px] font-mono font-bold border border-emerald-500/20">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>AGENCY SEAT ALLOCATION ACTIVE</span>
          </div>
        </div>

        {/* Invitation Card */}
        <div className="rounded-3xl bg-white border border-[#E6E9F5] p-7 sm:p-8 shadow-xl space-y-6">
          <div className="border-b border-border/60 pb-5 space-y-2">
            <span className="text-[10px] uppercase font-mono font-bold text-muted-foreground tracking-wider block">
              Official Team Invitation
            </span>
            <h2 className="text-xl font-extrabold text-[#141A33] font-display">
              Join {agencyDisplayName}
            </h2>
            <p className="text-xs text-[#5E6582] leading-relaxed">
              Your Managing Director has provisioned an enterprise DealOS license for you. Enter your details to access your live lead inbox, 34,850+ DLD units, and WhatsApp cockpit.
            </p>
          </div>

          <form onSubmit={handleActivate} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-[#141A33] text-[11px]">
                Your Full Name *
              </label>
              <div className="relative">
                <input
                  required
                  placeholder="e.g. Elena Rostova"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-10 px-3.5 pl-9 rounded-xl border border-[#D8DCED] bg-[#F7F8FC] text-xs text-[#141A33] focus:outline-none focus:border-[#2F6BFF]"
                />
                <User size={14} className="absolute left-3 top-3 text-[#8A92A6]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#141A33] text-[11px]">
                Corporate Work Email *
              </label>
              <div className="relative">
                <input
                  required
                  type="email"
                  placeholder="elena@agency.ae"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3.5 pl-9 rounded-xl border border-[#D8DCED] bg-[#F7F8FC] text-xs text-[#141A33] focus:outline-none focus:border-[#2F6BFF]"
                />
                <Mail size={14} className="absolute left-3 top-3 text-[#8A92A6]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-[#141A33] text-[11px]">
                  Direct WhatsApp (+971) *
                </label>
                <input
                  required
                  placeholder="+971 50 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[#D8DCED] bg-[#F7F8FC] text-xs text-[#141A33] focus:outline-none focus:border-[#2F6BFF] font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#141A33] text-[11px]">
                  RERA BRN Card #
                </label>
                <input
                  placeholder="BRN-49201"
                  value={reraBrn}
                  onChange={(e) => setReraBrn(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[#D8DCED] bg-[#F7F8FC] text-xs text-[#141A33] focus:outline-none focus:border-[#2F6BFF] font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#141A33] text-[11px]">
                Create Password *
              </label>
              <div className="relative">
                <input
                  required
                  type="password"
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 px-3.5 pl-9 rounded-xl border border-[#D8DCED] bg-[#F7F8FC] text-xs text-[#141A33] focus:outline-none focus:border-[#2F6BFF]"
                />
                <Lock size={14} className="absolute left-3 top-3 text-[#8A92A6]" />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-[11px] text-emerald-800 space-y-0.5">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-600" />
                <span>Enterprise Agency Seat Covered</span>
              </p>
              <p className="text-[#5E6582]">
                Your subscription fee is 100% covered under your company’s active DealOS contract.
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#2F6BFF] hover:bg-[#2052D9] text-white shadow-md gap-2"
            >
              <span>{loading ? "Activating Broker Seat..." : "Activate My Broker Seat"}</span>
              <ArrowRight size={14} />
            </Button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-[#8A92A6] pt-8">
        DealOS Technologies · Institutional Real Estate OS for Dubai &amp; the UAE
      </div>
    </div>
  );
}
