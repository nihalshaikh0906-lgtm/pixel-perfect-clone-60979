import { useState, useEffect } from "react";
import {
  Sparkles,
  Building2,
  Users,
  CheckCircle2,
  Phone,
  MessageCircle,
  ArrowRight,
  Clock,
  RefreshCw,
  Send,
  MapPin,
  DollarSign,
  ShieldCheck,
  UserCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { openWhatsApp } from "@/lib/whatsapp-send";
import {
  getCompanyPool,
  claimCompanyLead,
  claimCompanyLeadAtomic,
  transferCompanyLead,
  isAuthorizedToTransfer,
  initCompanyLeadsRealtime,
  COMPANY_AGENTS,
  type CompanyLeadItem,
  type CallerAuth,
} from "@/lib/company-leads";

interface CompanyLeadBoxProps {
  currentAgentName?: string;
  compact?: boolean;
}

export function CompanyLeadBox({ currentAgentName = "Tariq Mansoor", compact = false }: CompanyLeadBoxProps) {
  const [pool, setPool] = useState<CompanyLeadItem[]>([]);
  const [transferringLead, setTransferringLead] = useState<CompanyLeadItem | null>(null);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const loadPool = () => {
    setPool(getCompanyPool());
  };

  useEffect(() => {
    loadPool();
    // Subscribes to Supabase Realtime channel across all browsers as well as local storage events
    const unsubscribe = initCompanyLeadsRealtime(() => {
      loadPool();
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const caller: CallerAuth = {
    name: currentAgentName,
    role: "agent",
    email: typeof window !== "undefined" ? localStorage.getItem("dealos_active_email") : null,
  };

  const unclaimedLeads = pool.filter((i) => i.status === "unclaimed");
  const myClaimedLeads = pool.filter(
    (i) => i.status === "claimed" && (i.claimedByAgentName === currentAgentName || !i.claimedByAgentName)
  );

  const handleClaim = async (item: CompanyLeadItem, actionType: "claim" | "whatsapp") => {
    if (claimingId) return;
    setClaimingId(item.id);

    try {
      const result = await claimCompanyLeadAtomic(item.id, currentAgentName);
      setClaimingId(null);
      loadPool();

      if (!result.success) {
        toast.error(result.message || "Could not claim lead", { icon: "⚠️" });
        return;
      }

      if (actionType === "whatsapp") {
        const cleanPhone = item.phone.replace(/\D/g, "");
        const msg = `Salam ${item.title.split(" ")[0]}, this is ${currentAgentName} from DealOS Brokerage. Our Managing Director assigned your inquiry for ${item.location} (${item.budgetOrPrice}) to my priority desk. Are you free for a quick 2-minute call?`;
        openWhatsApp({ phone: cleanPhone, text: msg, recipientName: item.title });
        toast.success(
          `⚡ Action Taken! You claimed "${item.title}". It is now locked to your account with tag "Company Lead" and removed from all other agents' lead boxes.`,
          { icon: "🔒", duration: 4000 }
        );
      } else {
        toast.success(
          `⚡ Lead Claimed! "${item.title}" is now locked to your personal leads with tag "Company Lead" and removed from all other agents.`,
          { icon: "🔒", duration: 4000 }
        );
      }
    } catch {
      setClaimingId(null);
      loadPool();
    }
  };

  const handleTransfer = (targetAgentName: string) => {
    if (!transferringLead) return;

    const result = transferCompanyLead(transferringLead.id, targetAgentName, caller);
    if (!result.success) {
      toast.error(result.message, { icon: "🚫" });
      return;
    }

    toast.success(
      `✓ 1-Click Transfer Complete! "${transferringLead.title}" and all data have shifted to ${targetAgentName}'s account.`,
      { icon: "⇄", duration: 4000 }
    );
    setTransferringLead(null);
    loadPool();
  };

  if (unclaimedLeads.length === 0 && myClaimedLeads.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mb-6">
      {/* ═══ 1. UNCLAIMED COMPANY FLOOR POOL (VISIBLE TO ALL AGENTS) ═══ */}
      {unclaimedLeads.length > 0 && (
        <div className="rounded-2xl sm:rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 via-card to-background p-4 sm:p-6 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 pointer-events-none opacity-20">
            <Building2 size={80} className="text-emerald-500" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Company Floor Pool · First to Claim
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                  {unclaimedLeads.length} Available
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-foreground font-display">
                New Leads &amp; Exclusive Properties Added by Company Owner
              </h3>
              <p className="text-xs text-muted-foreground">
                Visible to all agency brokers. Take action on any lead to lock it into your desk — it will immediately disappear from all other agents' lead boxes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {unclaimedLeads.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-card/95 border border-border/80 hover:border-emerald-500/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 text-left group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black uppercase bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                      Company Lead
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                      <Clock size={11} />
                      Unclaimed
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-extrabold text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {item.budgetOrPrice}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.details}
                  </p>

                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium pt-1">
                    <MapPin size={12} className="text-primary shrink-0" />
                    <span>{item.location} · {item.category}</span>
                  </div>

                  {item.notes && (
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                      {item.notes}
                    </div>
                  )}
                </div>

                {/* Claim Actions */}
                <div className="pt-2 border-t border-border/60 flex items-center gap-2">
                  <Button
                    size="sm"
                    disabled={claimingId === item.id}
                    onClick={() => handleClaim(item, "whatsapp")}
                    className="flex-1 h-9 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <MessageCircle size={13} />
                    <span>{claimingId === item.id ? "Locking..." : "WhatsApp & Claim ⚡"}</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={claimingId === item.id}
                    onClick={() => handleClaim(item, "claim")}
                    className="h-9 px-3 rounded-xl text-xs font-bold border-border hover:bg-secondary cursor-pointer disabled:opacity-50"
                  >
                    <span>{claimingId === item.id ? "Locking..." : "Claim"}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ 2. MY CLAIMED COMPANY LEADS (WITH "COMPANY LEAD" TAG & 1-CLICK TRANSFER) ═══ */}
      {myClaimedLeads.length > 0 && (
        <div className="rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs text-left space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-blue-500" />
              <h4 className="text-sm font-extrabold text-foreground">
                My Company Leads ({myClaimedLeads.length} Claimed)
              </h4>
              <span className="text-xs text-muted-foreground">· Stays in your desk</span>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
              1-Click Transfer available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {myClaimedLeads.map((lead) => (
              <div
                key={lead.id}
                className="p-3.5 rounded-2xl bg-secondary/30 border border-border/70 hover:border-blue-500/40 transition-all space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1.5">
                    {/* Small tag on top saying Company Lead */}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                      Company Lead
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      Locked to You
                    </span>
                  </div>

                  <div>
                    <h5 className="text-xs font-black text-foreground">{lead.title}</h5>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {lead.budgetOrPrice}
                    </span>
                  </div>

                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {lead.details}
                  </p>

                  <div className="text-[10px] font-mono text-muted-foreground flex items-center gap-2 pt-1">
                    <span>📞 {lead.phone}</span>
                    <span>📍 {lead.location}</span>
                  </div>
                </div>

                {/* Bottom Actions: Contact + 1-Click Transfer */}
                <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const cleanPhone = lead.phone.replace(/\D/g, "");
                      openWhatsApp({
                        phone: cleanPhone,
                        text: `Hi ${lead.title.split(" ")[0]}, following up from DealOS Brokerage regarding ${lead.location}.`,
                        recipientName: lead.title,
                      });
                    }}
                    className="h-8 px-3 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <MessageCircle size={12} />
                    <span>WhatsApp</span>
                  </button>

                  {/* 1-Click Transfer Button */}
                  <button
                    type="button"
                    onClick={() => setTransferringLead(lead)}
                    className="h-8 px-3 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold border border-border flex items-center gap-1 transition-colors cursor-pointer hover:border-primary/50"
                  >
                    <RefreshCw size={11} />
                    <span>Transfer ⇄</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ 1-CLICK TRANSFER TO ANOTHER COMPANY AGENT MODAL ═══ */}
      {transferringLead && (
        <Dialog open={!!transferringLead} onOpenChange={() => setTransferringLead(null)}>
          <DialogContent className="max-w-md p-5 rounded-3xl bg-card border-border shadow-2xl">
            <DialogHeader className="text-left space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black uppercase bg-blue-500/15 text-blue-600 border border-blue-500/30">
                  Company Lead
                </span>
                <span className="text-xs font-mono font-bold text-muted-foreground">1-Click Shift</span>
              </div>
              <DialogTitle className="text-base font-bold text-foreground">
                Transfer Lead to Company Colleague
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Shift <strong>{transferringLead.title}</strong> and all notes/history to another broker in your agency with one click.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 py-3">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                Select Company Agent:
              </span>
              <div className="space-y-1.5">
                {COMPANY_AGENTS.filter((a) => a.name !== currentAgentName).map((agent) => (
                  <button
                    key={agent.id}
                    type="button"
                    onClick={() => handleTransfer(agent.name)}
                    className="w-full p-2.5 rounded-xl border border-border hover:border-primary/50 bg-secondary/30 hover:bg-primary/10 flex items-center justify-between transition-all cursor-pointer text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-full bg-primary/15 text-primary font-bold text-xs flex items-center justify-center">
                        {agent.avatar}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-foreground block group-hover:text-primary transition-colors">
                          {agent.name}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {agent.reraNumber} · {agent.role}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-primary font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Shift Data</span>
                      <ArrowRight size={12} />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
