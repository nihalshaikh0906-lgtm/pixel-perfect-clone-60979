import { useState, useEffect } from "react";
import {
  Building2,
  UserPlus,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send,
  Users,
  DollarSign,
  MapPin,
  Clock,
  RefreshCw,
  Phone,
  Mail,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  addCompanyLeadOrProperty,
  getCompanyPool,
  transferCompanyLead,
  COMPANY_AGENTS,
  type CompanyLeadItem,
} from "@/lib/company-leads";

interface ImportLeadPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ImportLeadPropertyModal({ isOpen, onClose, onSuccess }: ImportLeadPropertyModalProps) {
  const [activeTab, setActiveTab] = useState<"lead" | "property" | "pool">("lead");

  // Form State - Lead
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("+971 ");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadBudget, setLeadBudget] = useState("AED 4,500,000");
  const [leadLocation, setLeadLocation] = useState("Palm Jumeirah");
  const [leadCategory, setLeadCategory] = useState<CompanyLeadItem["category"]>("Ultra-HNWI");
  const [leadDetails, setLeadDetails] = useState("");
  const [leadNotes, setLeadNotes] = useState("");

  // Form State - Property
  const [propTitle, setPropTitle] = useState("");
  const [propPrice, setPropPrice] = useState("AED 3,200,000");
  const [propLocation, setPropLocation] = useState("Dubai Marina");
  const [propCategory, setPropCategory] = useState<CompanyLeadItem["category"]>("Ready Resale");
  const [propPhone, setPropPhone] = useState("+971 ");
  const [propDetails, setPropDetails] = useState("");

  // Pool List State
  const [poolItems, setPoolItems] = useState<CompanyLeadItem[]>([]);
  const [reassignModalLead, setReassignModalLead] = useState<CompanyLeadItem | null>(null);

  const refreshPool = () => {
    setPoolItems(getCompanyPool());
  };

  useEffect(() => {
    if (isOpen) {
      refreshPool();
    }
  }, [isOpen]);

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim()) {
      toast.error("Please enter a client name");
      return;
    }

    addCompanyLeadOrProperty({
      type: "lead",
      title: leadName.trim(),
      phone: leadPhone.trim() || "+971 50 000 0000",
      email: leadEmail.trim() || "client@dubai-investor.ae",
      budgetOrPrice: leadBudget.trim(),
      location: leadLocation,
      category: leadCategory,
      details: leadDetails.trim() || "High-intent company lead requiring prompt agent outreach.",
      notes: leadNotes.trim() ? `Owner Note: ${leadNotes.trim()}` : "Owner Note: Direct company lead. First agent to contact claims ownership.",
    });

    toast.success(`✓ Broadcast to Agency Floor! "${leadName}" is now visible to all agents.`);
    setLeadName("");
    setLeadDetails("");
    setLeadNotes("");
    refreshPool();
    setActiveTab("pool");
    onSuccess?.();
  };

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propTitle.trim()) {
      toast.error("Please enter a property title");
      return;
    }

    addCompanyLeadOrProperty({
      type: "property",
      title: propTitle.trim(),
      phone: propPhone.trim() || "+971 50 000 0000",
      email: "landlord@direct-dubai.ae",
      budgetOrPrice: propPrice.trim(),
      location: propLocation,
      category: propCategory,
      details: propDetails.trim() || "Exclusive company direct mandate. Ready for immediate broker pitching.",
      notes: "Owner Note: Exclusive agency listing. Commission protected.",
    });

    toast.success(`✓ Direct Property Added! "${propTitle}" is now live in company inventory.`);
    setPropTitle("");
    setPropDetails("");
    refreshPool();
    setActiveTab("pool");
    onSuccess?.();
  };

  const handleTransfer = (leadId: string, targetAgentName: string) => {
    transferCompanyLead(leadId, "Company Owner", targetAgentName);
    toast.success(`✓ Transferred lead directly to ${targetAgentName}! All data shifted.`);
    setReassignModalLead(null);
    refreshPool();
    onSuccess?.();
  };

  const unclaimedCount = poolItems.filter((i) => i.status === "unclaimed").length;
  const claimedCount = poolItems.filter((i) => i.status === "claimed").length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-3xl bg-card border-border/80 shadow-2xl">
        <DialogHeader className="text-left space-y-1.5 pb-3 border-b border-border/60">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/25">
              <Sparkles size={13} />
              EXECUTIVE LEAD &amp; PROPERTY DISPATCH
            </span>
            <span className="text-xs font-mono font-bold text-muted-foreground hidden sm:inline">
              Broadcasts to 12 Company Agents
            </span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-black text-foreground font-display">
            Import Lead / Exclusive Property
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Add high-value leads or exclusive landlord properties into the company floor. Any company agent who takes action first locks the lead into their personal desk.
          </DialogDescription>
        </DialogHeader>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-secondary/70 border border-border/60 my-2">
          <button
            type="button"
            onClick={() => setActiveTab("lead")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "lead"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <UserPlus size={14} />
            <span>Add Client Lead</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("property")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "property"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Building2 size={14} />
            <span>Add Exclusive Property</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pool")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "pool"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Users size={14} />
            <span>Company Floor Pool ({unclaimedCount} Unclaimed)</span>
          </button>
        </div>

        {/* TAB 1: ADD CLIENT LEAD */}
        {activeTab === "lead" && (
          <form onSubmit={handleCreateLead} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Client Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sheikh Majid Al-Nuaimi"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary/40 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Client WhatsApp / Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+971 50 123 4567"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary/40 outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="client@investor.com"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary/40 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Target Investment Budget</label>
                <input
                  type="text"
                  placeholder="e.g. AED 4,500,000"
                  value={leadBudget}
                  onChange={(e) => setLeadBudget(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary/40 outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Preferred Dubai Area</label>
                <select
                  value={leadLocation}
                  onChange={(e) => setLeadLocation(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary/40 outline-none"
                >
                  <option value="Palm Jumeirah">Palm Jumeirah</option>
                  <option value="Downtown Dubai">Downtown Dubai</option>
                  <option value="Dubai Marina">Dubai Marina</option>
                  <option value="Dubai Creek Harbour">Dubai Creek Harbour</option>
                  <option value="Dubai Hills Estate">Dubai Hills Estate</option>
                  <option value="Jumeirah Village Circle (JVC)">Jumeirah Village Circle (JVC)</option>
                  <option value="Business Bay">Business Bay</option>
                  <option value="Dubai South (Al Maktoum)">Dubai South (Al Maktoum)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Investor Category</label>
                <select
                  value={leadCategory}
                  onChange={(e) => setLeadCategory(e.target.value as CompanyLeadItem["category"])}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary/40 outline-none"
                >
                  <option value="Ultra-HNWI">Ultra-HNWI (Cash Buyer)</option>
                  <option value="Off-Plan">Off-Plan Investor</option>
                  <option value="Ready Resale">Ready Resale Buyer</option>
                  <option value="Rental">High-Yield Rental Investor</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">Client Brief / Requirements</label>
              <textarea
                rows={2}
                placeholder="e.g. Looking for high floor with canal view. Ready to pay 10% EOI immediately upon unit match."
                value={leadDetails}
                onChange={(e) => setLeadDetails(e.target.value)}
                className="w-full p-3 rounded-xl border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary/40 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">Owner Instructions for Brokers</label>
              <input
                type="text"
                placeholder="e.g. VIP client — first agent who conducts viewing will receive 60% commission split."
                value={leadNotes}
                onChange={(e) => setLeadNotes(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary/40 outline-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-2xl bg-primary text-primary-foreground font-extrabold text-sm gap-2 shadow-md cursor-pointer hover:brightness-105"
            >
              <Send size={15} />
              <span>Broadcast Lead to Company Floor ⚡</span>
            </Button>
          </form>
        )}

        {/* TAB 2: ADD EXCLUSIVE PROPERTY */}
        {activeTab === "property" && (
          <form onSubmit={handleCreateProperty} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Property Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marina Gate II · 3BR Sky Villa"
                  value={propTitle}
                  onChange={(e) => setPropTitle(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary/40 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Asking Price (AED) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AED 3,200,000"
                  value={propPrice}
                  onChange={(e) => setPropPrice(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary/40 outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Community Location</label>
                <input
                  type="text"
                  value={propLocation}
                  onChange={(e) => setPropLocation(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary/40 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Landlord / Owner Phone</label>
                <input
                  type="tel"
                  placeholder="+971 50 123 4567"
                  value={propPhone}
                  onChange={(e) => setPropPhone(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary/40 outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">Unit Key Features &amp; Terms</label>
              <textarea
                rows={2}
                placeholder="e.g. Tenanted at 190k/yr until Q2 2027. Full marina view, vacant on transfer option. Form A exclusive."
                value={propDetails}
                onChange={(e) => setPropDetails(e.target.value)}
                className="w-full p-3 rounded-xl border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary/40 outline-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm gap-2 shadow-md cursor-pointer"
            >
              <UploadCloud size={16} />
              <span>Publish Exclusive Property to Company Pool</span>
            </Button>
          </form>
        )}

        {/* TAB 3: POOL OVERVIEW (UNCLAIMED & CLAIMED) */}
        {activeTab === "pool" && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border/50">
              <span>{poolItems.length} Total Company Items Tracked</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-emerald-500 font-bold">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  {unclaimedCount} Waiting in Pool
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-blue-500 font-bold">{claimedCount} Claimed by Agents</span>
              </div>
            </div>

            <div className="space-y-3">
              {poolItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all text-left space-y-2.5 ${
                    item.status === "unclaimed"
                      ? "bg-emerald-500/5 border-emerald-500/25 shadow-xs"
                      : "bg-secondary/40 border-border/70 opacity-90"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/25">
                        Company Lead
                      </span>
                      <span className="text-xs font-bold text-foreground">{item.title}</span>
                      <span className="text-[11px] font-mono font-bold text-emerald-500">
                        {item.budgetOrPrice}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.status === "unclaimed" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                          <Clock size={11} /> Unclaimed · Visible to All Brokers
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                          <CheckCircle2 size={11} /> Claimed by {item.claimedByAgentName}
                        </span>
                      )}

                      {/* 1-Click Reassign / Transfer */}
                      <button
                        type="button"
                        onClick={() => setReassignModalLead(item)}
                        className="px-2.5 py-1 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-[11px] font-bold border border-border flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <RefreshCw size={11} />
                        <span>Transfer ⇄</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">{item.details}</p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/50 text-[11px] text-muted-foreground font-mono">
                    <span className="flex items-center gap-1">
                      <MapPin size={11} className="text-primary" /> {item.location} · {item.category}
                    </span>
                    <span className="flex items-center gap-2">
                      <span>📞 {item.phone}</span>
                      <span>✉️ {item.email}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 1-CLICK TRANSFER MODAL */}
        {reassignModalLead && (
          <Dialog open={!!reassignModalLead} onOpenChange={() => setReassignModalLead(null)}>
            <DialogContent className="max-w-md p-5 rounded-3xl bg-card border-border shadow-2xl">
              <DialogHeader className="text-left space-y-1">
                <DialogTitle className="text-base font-bold text-foreground">
                  1-Click Lead Transfer
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Instantly shift <strong>{reassignModalLead.title}</strong> and all associated notes/history to another company agent.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2 py-3">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Select Destination Broker:
                </span>
                <div className="space-y-1.5">
                  {COMPANY_AGENTS.map((agent) => (
                    <button
                      key={agent.id}
                      type="button"
                      onClick={() => handleTransfer(reassignModalLead.id, agent.name)}
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
                        <span>Assign</span>
                        <ArrowRight size={12} />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}
