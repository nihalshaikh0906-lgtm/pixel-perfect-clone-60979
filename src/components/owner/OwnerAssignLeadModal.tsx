import React, { useState } from "react";
import {
  UserCheck,
  Building2,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Phone,
  Zap,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { addImportedLeads, type Lead } from "@/lib/demo-leads";
import { AGENCY_BROKERS, type ExecutiveLead } from "@/pages/OwnerDashboard";

interface OwnerAssignLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  unassignedLeads?: any[];
  onLeadAssigned?: (lead: ExecutiveLead) => void;
}

export function OwnerAssignLeadModal({
  isOpen,
  onClose,
  unassignedLeads = [],
  onLeadAssigned,
}: OwnerAssignLeadModalProps) {
  const [leadMode, setLeadMode] = useState<"existing" | "new">(unassignedLeads.length > 0 ? "existing" : "new");
  const [selectedLeadId, setSelectedLeadId] = useState<string>(unassignedLeads[0]?.id || "");
  const [targetBrokerId, setTargetBrokerId] = useState<string>(AGENCY_BROKERS[0].id);

  // Quick Lead form state
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("+971 ");
  const [budget, setBudget] = useState("AED 6,200,000");
  const [projectInterest, setProjectInterest] = useState("Downtown Dubai / Opera Grand");
  const [slaMins, setSlaMins] = useState("5");
  const [instructions, setInstructions] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const selectedBroker = AGENCY_BROKERS.find((b) => b.id === targetBrokerId) || AGENCY_BROKERS[0];

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAssigning(true);

    const leadId = `lead-assign-${Date.now()}`;
    const nameToAssign = leadMode === "new" ? clientName.trim() : (unassignedLeads.find((l) => l.id === selectedLeadId)?.clientName || "Investor Lead");
    const budgetVal = leadMode === "new" ? budget : (unassignedLeads.find((l) => l.id === selectedLeadId)?.budgetFormatted || "AED 5,000,000");
    const numericBudget = parseInt(budgetVal.replace(/\D/g, ""), 10) || 5000000;
    const cleanPhone = phone.trim() || "+971 50 889 1234";

    if (!nameToAssign) {
      toast.error("Please enter or select a lead name");
      setIsAssigning(false);
      return;
    }

    // 1. Add as real lead in broker workspace
    const newLead: Lead = {
      id: leadId,
      name: nameToAssign,
      initials: nameToAssign.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
      country: "UAE",
      phone: cleanPhone,
      type: "Off-plan",
      beds: 3,
      area: projectInterest.split("/")[0]?.trim() || "Downtown Dubai",
      budget: numericBudget,
      payment: "Payment plan",
      score: 96,
      stage: "Qualified",
      source: "Executive Owner Assignment",
      receivedHoursAgo: 0.05,
      contacted: false,
      followUpDueInHours: Number(slaMins) / 60,
      message: instructions.trim() || `Owner Executive Assignment: Contact within ${slaMins} minutes. Interested in ${projectInterest}.`,
      task: `Assigned by Managing Director to ${selectedBroker.name}`,
    };

    addImportedLeads([newLead]);

    // 2. Persist to Supabase leads table
    try {
      await supabase.from("leads").insert({
        full_name: nameToAssign,
        phone: cleanPhone,
        preferred_location: projectInterest,
        budget_max_aed: numericBudget,
        notes: `Executive Assignment to ${selectedBroker.name} | SLA: ${slaMins}m | Instructions: ${instructions}`,
        source: "Executive Owner Assignment",
        stage: "qualified",
        broker_id: selectedBroker.id,
      });
    } catch {
      // Fallback
    }

    // 3. Dispatch real-time events to all tabs
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("dealos:lead_added", { detail: newLead }));
      window.dispatchEvent(new CustomEvent("dealos:lead_reassigned", { detail: { leadId, brokerId: selectedBroker.id } }));
    }

    // 4. Construct Executive Lead for Owner Overwatch
    const executiveLead: ExecutiveLead = {
      id: leadId,
      clientName: nameToAssign,
      nationality: "VIP Client",
      budgetFormatted: budgetVal,
      projectInterest,
      assignedBrokerId: selectedBroker.id,
      assignedBrokerName: selectedBroker.name,
      assignedBrokerAvatar: selectedBroker.avatar,
      stage: "Viewing Confirmed",
      stageColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      probability: "92%",
      speedToLeadMins: parseFloat(slaMins),
      lastContactAgo: "Assigned by Managing Director",
      liquidityTier: "Tier 1 Ultra-HNWI (Cash)",
      executiveBrief: instructions.trim() || `Mandate assigned to ${selectedBroker.name}. SLA: Contact within ${slaMins} mins.`,
      brokerPhone: selectedBroker.phone,
    };

    onLeadAssigned?.(executiveLead);

    toast.success(
      `⚡ Lead Assigned! "${nameToAssign}" delivered directly to ${selectedBroker.name}'s leadbox with ${slaMins}-minute SLA.`
    );

    setIsAssigning(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto p-5 sm:p-7 rounded-3xl bg-card border-border/80 shadow-2xl">
        <DialogHeader className="text-left space-y-1.5 pb-3 border-b border-border/60">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Zap size={13} />
              EXECUTIVE DELEGATION DESK
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              Direct Leadbox Routing
            </span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-black text-foreground font-display">
            Assign Lead to Agency Broker
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Directly route investor opportunities to your top producers. Enforce SLA response deadlines and track closing velocity.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAssign} className="space-y-4 pt-3">
          {unassignedLeads.length > 0 && (
            <div className="flex items-center gap-2 p-1 rounded-xl bg-secondary/60 border border-border">
              <button
                type="button"
                onClick={() => setLeadMode("existing")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  leadMode === "existing" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
                }`}
              >
                Assign Existing Unclaimed Lead ({unassignedLeads.length})
              </button>
              <button
                type="button"
                onClick={() => setLeadMode("new")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  leadMode === "new" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
                }`}
              >
                Log &amp; Assign New Mandate
              </button>
            </div>
          )}

          {leadMode === "existing" && unassignedLeads.length > 0 ? (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Select Unclaimed Lead</label>
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-border bg-secondary/50 text-foreground font-bold text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
              >
                {unassignedLeads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.clientName} — {lead.budgetFormatted} ({lead.projectInterest})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Investor Name *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Al-Futtaim Family Office"
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/50 text-foreground text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Phone / WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+971 50 123 4567"
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/50 text-foreground text-xs font-mono focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Investment Budget</label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="AED 6,200,000"
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/50 text-foreground text-xs font-mono focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Project / Area Interest</label>
                <input
                  type="text"
                  value={projectInterest}
                  onChange={(e) => setProjectInterest(e.target.value)}
                  placeholder="Downtown Dubai / Opera District"
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/50 text-foreground text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Target Broker Selection with Live Card */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-foreground flex items-center gap-1.5">
                <Users size={14} className="text-primary" />
                <span>Target Broker Leadbox</span>
              </label>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                ● 12 Brokers Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border border-border/80 rounded-2xl bg-secondary/20">
              {AGENCY_BROKERS.map((broker) => {
                const isSelected = broker.id === targetBrokerId;
                return (
                  <button
                    key={broker.id}
                    type="button"
                    onClick={() => setTargetBrokerId(broker.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary/10 border-primary text-foreground shadow-xs ring-1 ring-primary/40"
                        : "bg-card/70 border-border hover:border-border/80 hover:bg-card text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                        {broker.avatar}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-foreground block truncate">
                          {broker.name}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground block truncate">
                          {broker.speedToLeadMins}m speed · {broker.activeDealsCount} active
                        </span>
                      </div>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${broker.tierColor}`}>
                      {broker.tier}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SLA Response Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Clock size={13} className="text-amber-400" />
                <span>Mandated Speed-to-Lead SLA</span>
              </label>
              <select
                value={slaMins}
                onChange={(e) => setSlaMins(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-border bg-secondary/50 text-foreground text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
              >
                <option value="3">⚡ 3 Minutes (Critical Ultra-HNWI)</option>
                <option value="5">⚡ 5 Minutes (Standard VIP)</option>
                <option value="15">🕒 15 Minutes (Active Investor)</option>
                <option value="60">📅 1 Hour (Standard Outreach)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Priority Level</label>
              <div className="flex items-center gap-2 h-10 px-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                <ShieldCheck size={14} />
                <span>Executive Verified Cash Buyer</span>
              </div>
            </div>
          </div>

          {/* Owner Direct Instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Director Notes for Broker</label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Schedule private viewing at sales pavilion. Buyer pre-approved for immediate booking deposit."
              className="w-full p-3 rounded-xl border border-border bg-secondary/50 text-foreground text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 px-4 rounded-xl text-xs font-bold border-border"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isAssigning}
              className="h-10 px-6 rounded-xl text-xs font-extrabold bg-primary text-primary-foreground hover:brightness-105 shadow-md gap-1.5"
            >
              <UserCheck size={14} />
              <span>{isAssigning ? "Assigning..." : `Assign to ${selectedBroker.name.split(" ")[0]} ⚡`}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
