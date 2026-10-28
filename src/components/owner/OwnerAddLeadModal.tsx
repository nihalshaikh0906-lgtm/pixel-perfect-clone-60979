import React, { useState } from "react";
import {
  UserPlus,
  Building2,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Sparkles,
  X,
  Users,
  Compass,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { addImportedLeads, type Lead, type LeadType, type Stage } from "@/lib/demo-leads";
import { addCompanyLeadOrProperty } from "@/lib/company-leads";
import { AGENCY_BROKERS } from "@/pages/OwnerDashboard";

interface OwnerAddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadAdded?: (lead: any) => void;
}

export function OwnerAddLeadModal({ isOpen, onClose, onLeadAdded }: OwnerAddLeadModalProps) {
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("+971 ");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState("AED 4,500,000");
  const [area, setArea] = useState("Palm Jumeirah");
  const [type, setType] = useState<LeadType>("Off-plan");
  const [beds, setBeds] = useState(3);
  const [stage, setStage] = useState<Stage>("New");
  const [liquidityTier, setLiquidityTier] = useState("Tier 1 Ultra-HNWI (Cash)");
  const [assignedBrokerId, setAssignedBrokerId] = useState<string>("company-floor");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      toast.error("Please enter a client name");
      return;
    }

    setIsSubmitting(true);
    const numericBudget = parseInt(budget.replace(/\D/g, ""), 10) || 4500000;
    const cleanPhone = phone.trim() || "+971 50 123 4567";
    const leadId = `lead-${Date.now()}`;
    const initials = clientName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const selectedBroker = AGENCY_BROKERS.find((b) => b.id === assignedBrokerId);
    const isCompanyFloor = assignedBrokerId === "company-floor" || !selectedBroker;

    // 1. If assigned to company floor, add to company pool for first-to-claim broadcast
    if (isCompanyFloor) {
      addCompanyLeadOrProperty({
        type: "lead",
        title: clientName.trim(),
        phone: cleanPhone,
        email: email.trim() || "investor@dubai-direct.ae",
        budgetOrPrice: budget.trim(),
        location: area,
        category: numericBudget >= 10000000 ? "Ultra-HNWI" : type === "Off-plan" ? "Off-Plan" : "Ready Resale",
        details: `Direct Owner Inbound: ${beds}BR in ${area}. ${notes.trim() || "High priority investor."}`,
        notes: `Owner Mandate: First broker to contact locks claim. Liquidity: ${liquidityTier}.`,
      });
    }

    // 2. Add as a real Lead into the broker CRM workspace and custom leads store
    const newLead: Lead = {
      id: leadId,
      name: clientName.trim(),
      initials,
      country: "UAE",
      phone: cleanPhone,
      type,
      beds,
      area,
      budget: numericBudget,
      payment: liquidityTier.includes("Cash") ? "Cash" : "Payment plan",
      score: 95,
      stage,
      source: "Company Owner Import",
      receivedHoursAgo: 0.1,
      contacted: false,
      followUpDueInHours: 0.5,
      message: notes.trim() || `Inbound direct VIP enquiry for ${beds}BR in ${area}.`,
      task: isCompanyFloor ? "Claim & First Contact" : `Assigned to ${selectedBroker?.name}`,
    };

    addImportedLeads([newLead]);

    // 3. Persist to Supabase leads table if online/authenticated
    try {
      await supabase.from("leads").insert({
        full_name: clientName.trim(),
        phone: cleanPhone,
        email: email.trim() || null,
        preferred_location: area,
        budget_max_aed: numericBudget,
        notes: `Owner Lead | Assigned to: ${isCompanyFloor ? "Company Floor" : selectedBroker?.name} | Liquidity: ${liquidityTier} | Notes: ${notes}`,
        source: "Company Owner Import",
        stage: stage.toLowerCase(),
        broker_id: isCompanyFloor ? null : selectedBroker?.id,
      });
    } catch {
      // Fallback to local persistence
    }

    // 4. Notify all broker workspaces and local listeners
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("dealos:lead_added", { detail: newLead }));
      window.dispatchEvent(new CustomEvent("dealos_company_pool_updated", { detail: { timestamp: Date.now() } }));
    }

    // 5. Construct executive lead for Owner Dashboard Overwatch
    const executiveLead = {
      id: leadId,
      clientName: clientName.trim(),
      nationality: "Verified Investor",
      budgetFormatted: budget,
      projectInterest: `${beds}BR ${type} in ${area}`,
      assignedBrokerId: isCompanyFloor ? "company-floor" : selectedBroker!.id,
      assignedBrokerName: isCompanyFloor ? "Unclaimed (Company Floor)" : selectedBroker!.name,
      assignedBrokerAvatar: isCompanyFloor ? "CF" : selectedBroker!.avatar,
      stage: stage === "New" ? "Negotiation" : "Viewing Confirmed",
      stageColor: isCompanyFloor ? "bg-amber-500/10 text-amber-300 border-amber-500/30" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      probability: "90%",
      speedToLeadMins: 1.0,
      lastContactAgo: "Just added by Owner",
      liquidityTier: liquidityTier as any,
      executiveBrief: notes.trim() || `Owner VIP referral for ${beds}BR in ${area}. Fast action required.`,
      brokerPhone: isCompanyFloor ? "+971500000000" : selectedBroker!.phone,
    };

    onLeadAdded?.(executiveLead);

    toast.success(
      isCompanyFloor
        ? `⚡ Lead Added! "${clientName}" broadcast to Company Floor for all brokers to claim.`
        : `⚡ Lead Assigned! "${clientName}" delivered directly to ${selectedBroker?.name}'s live leadbox.`
    );

    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto p-5 sm:p-7 rounded-3xl bg-card border-border/80 shadow-2xl">
        <DialogHeader className="text-left space-y-1.5 pb-3 border-b border-border/60">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/25">
              <UserPlus size={13} />
              EXECUTIVE LEAD LOGGING
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              Direct Agency Ingestion
            </span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-black text-foreground font-display">
            Add New Investor Lead
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Log an exclusive buyer or tenant inquiry. Assign directly to a licensed broker or broadcast to the company floor.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Client Full Name *</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Sheikh Majid Al-Nuaimi"
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/50 text-foreground text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Phone / WhatsApp *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+971 50 123 4567"
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/50 text-foreground text-xs font-mono focus:ring-2 focus:ring-primary/40 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Email Address (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@investment-office.ae"
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/50 text-foreground text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Investment Budget *</label>
              <input
                type="text"
                required
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="AED 5,000,000"
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-secondary/50 text-foreground text-xs font-mono focus:ring-2 focus:ring-primary/40 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Preferred Dubai Community</label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-border bg-secondary/50 text-foreground text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
              >
                <option value="Palm Jumeirah">Palm Jumeirah</option>
                <option value="Downtown Dubai">Downtown Dubai</option>
                <option value="Dubai Hills Estate">Dubai Hills Estate</option>
                <option value="Dubai Marina">Dubai Marina</option>
                <option value="Business Bay">Business Bay</option>
                <option value="Jumeirah Village Circle">Jumeirah Village Circle</option>
                <option value="Dubai Creek Harbour">Dubai Creek Harbour</option>
                <option value="Jumeirah Bay Island">Jumeirah Bay Island</option>
                <option value="Emirates Hills">Emirates Hills</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Property Type &amp; Bedrooms</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as LeadType)}
                  className="h-10 px-2 rounded-xl border border-border bg-secondary/50 text-foreground text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                >
                  <option value="Off-plan">Off-plan</option>
                  <option value="Ready">Ready Resale</option>
                  <option value="Rent">Luxury Rental</option>
                </select>
                <select
                  value={beds}
                  onChange={(e) => setBeds(Number(e.target.value))}
                  className="h-10 px-2 rounded-xl border border-border bg-secondary/50 text-foreground text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                >
                  <option value={1}>1 Bedroom</option>
                  <option value={2}>2 Bedrooms</option>
                  <option value={3}>3 Bedrooms</option>
                  <option value={4}>4 Bedrooms</option>
                  <option value={5}>5+ Bedrooms</option>
                </select>
              </div>
            </div>
          </div>

          {/* Assignment Destination */}
          <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-foreground flex items-center gap-1.5">
                <Users size={14} className="text-primary" />
                <span>Assign Lead To:</span>
              </label>
              <span className="text-[10px] font-mono text-muted-foreground">
                Immediate Leadbox Dispatch
              </span>
            </div>
            <select
              value={assignedBrokerId}
              onChange={(e) => setAssignedBrokerId(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-primary/30 bg-card text-foreground font-bold text-xs focus:ring-2 focus:ring-primary/50 focus:outline-none"
            >
              <option value="company-floor">
                ⚡ Company Floor Pool (Broadcast to All 12 Brokers — First to Claim)
              </option>
              <optgroup label="Direct Broker Assignment">
                {AGENCY_BROKERS.map((broker) => (
                  <option key={broker.id} value={broker.id}>
                    👤 {broker.name} — {broker.role} ({broker.tier})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Liquidity Tier & Stage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Liquidity &amp; Verification Tier</label>
              <select
                value={liquidityTier}
                onChange={(e) => setLiquidityTier(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-border bg-secondary/50 text-foreground text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
              >
                <option value="Tier 1 Ultra-HNWI (Cash)">Tier 1 Ultra-HNWI (100% Cash Ready)</option>
                <option value="Tier 2 Institutional">Tier 2 Institutional / Family Office</option>
                <option value="Tier 3 Mortgage Pre-Approved">Tier 3 Mortgage Pre-Approved</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Initial Pipeline Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as Stage)}
                className="w-full h-10 px-3 rounded-xl border border-border bg-secondary/50 text-foreground text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
              >
                <option value="New">New / Uncontacted</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Viewing">Viewing Confirmed</option>
              </select>
            </div>
          </div>

          {/* Owner Direct Instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Owner Instructions / Requirements</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. High-net-worth client from London looking for sea view on Palm Crescent. Needs video tour before Thursday."
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
              disabled={isSubmitting}
              className="h-10 px-6 rounded-xl text-xs font-extrabold bg-primary text-primary-foreground hover:brightness-105 shadow-md gap-1.5"
            >
              <Sparkles size={14} />
              <span>{isSubmitting ? "Dispatching..." : "Add & Dispatch Lead ⚡"}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
