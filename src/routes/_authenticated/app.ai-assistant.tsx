import { createFileRoute } from "@tanstack/react-router";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";
import { useBrokerProfile } from "@/lib/broker";
import {
  Sparkles, Plus, Mic, Send, Paperclip, User, Building2, Users, FileText,
  X, Check, ArrowRight, RefreshCw, Copy, CheckCheck,
  ChevronDown, Flame, ShieldCheck, Zap, MessageSquare, Clock,
  Search, PanelLeft, ArrowUpRight, LineChart, Calculator, DollarSign,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/Logo";
import { type DealOSRole } from "@/lib/auth-role";

export const Route = createFileRoute("/_authenticated/app/ai-assistant")({
  head: () => workspaceHead("AI Assistant"),
  component: GeminiAssistantPage,
});

export type AttachedItem = {
  id: string;
  type: "lead" | "project" | "agent" | "file";
  label: string;
  sub?: string;
  budget?: string;
  category?: "hot" | "offplan" | "luxury";
  date?: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: AttachedItem[];
  timestamp: string;
};

const LEADS_DATA: AttachedItem[] = [
  { id: "lead-1", type: "lead", label: "Michael Thorne", sub: "UK Investor · 1BR DLRC · Handover Q4 2026", budget: "AED 1,200,000", category: "hot", date: "9 Oct, 14:02" },
  { id: "lead-2", type: "lead", label: "Dr. Tariq Al-Mansoor", sub: "Saudi HNWI · Luxury Villa · Palm / Dubai Hills", budget: "AED 3,500,000", category: "luxury", date: "9 Oct, 13:56" },
  { id: "lead-3", type: "lead", label: "Elena Rostova", sub: "European Cash Buyer · Studio / 1BR JVC · Fast Closing", budget: "AED 850,000", category: "offplan", date: "8 Oct, 18:20" },
  { id: "lead-4", type: "lead", label: "Saad Al-Ghamdi", sub: "Saudi Investor · 2BR Business Bay · 1% Monthly Plan", budget: "AED 2,400,000", category: "offplan", date: "8 Oct, 11:45" },
  { id: "lead-5", type: "lead", label: "Chloe Martin", sub: "French Expat · 2BR Dubai Marina · Resale or Handover", budget: "AED 1,800,000", category: "hot", date: "7 Oct, 16:30" },
];

const RECENT_CHATS = [
  "Dubai Real Estate Investment Advisor",
  "Michael Thorne DLRC Match",
  "UAE 11-Day Lookbook Itinerary",
  "High-Yield Off-Plan Portfolio Strategy",
  "Danube vs Sobha Payment Plan Analysis",
];

export function getSmartRoleResponse(prompt: string, role: "company" | "agent", attachedLead?: AttachedItem): string {
  const q = prompt.toLowerCase();
  
  if (attachedLead) {
    return `### Strategic Analysis for ${attachedLead.label}

**1. Investor Financial Profile:**
* **Budget:** ${attachedLead.budget || "Verified Range"}
* **Preferences:** ${attachedLead.sub}
* **Status:** High Probability Closer · DLD Registration Ready

**2. Matched Dubai Developments:**
* **Reef Luxury 995 (DLRC):** 1BR from AED 684,000 · 10/40/50 Handover Q4 2026. Aligns with budget; 8.4% projected net rental yield.
* **Bayz 102 by Danube (Business Bay):** 1% monthly post-handover plan for investor cash-flow optimization.

**3. 1-Click WhatsApp Pitch:**
> *"Hi ${attachedLead.label.split(" ")[0]}, hope you're having a productive week! I just reviewed exclusive allocations that align with your search criteria in Dubai. We have 2 prime options with flexible developer payment plans and verified DLD escrow. Would 3:00 PM today suit you for a quick 2-minute overview?"*

*Would you like me to prepare an official EOI reservation slip or draft an Ejari/SPA contract review?*`;
  }

  // Agency Owner Responses
  if (q.includes("aging") || q.includes("commission") || q.includes("delinquent") || q.includes("receivable") || q.includes("overdue")) {
    return `### 🏢 Agency Commission Aging Ledger Audit
**Audit Date:** Live DLD Sync | **Receivables Balance:** AED 1,420,000 (Overdue > 60 Days)

| Developer | Project | Outstanding (AED) | Aging (Days) | Status / Recommended Action |
| :--- | :--- | :--- | :--- | :--- |
| **Sobha Realty** | Verde / SeaHaven | AED 640,000 | 78 Days | SPA Registered · Send Automated 60d Demand Notice |
| **Danube Properties** | Bayz 102 | AED 420,000 | 64 Days | Invoice Batched · Awaiting Milestone 1 Settlement |
| **Binghatti** | Phantom Tower | AED 360,000 | 92 Days | Escalated to Principal KAM · Schedule Reconciliation |

**Executive Recommendation:** 
1. Dispatch DealOS automated DLD-compliant commission demand letters to Sobha & Danube finance desks.
2. Freeze secondary broker allocations on Binghatti pending receivables clearance.`;
  }

  if (q.includes("leaderboard") || q.includes("top-performing") || q.includes("sales volume") || q.includes("quota")) {
    return `### 🏆 Q4 Broker Sales Production & Velocity Leaderboard
**Agency Total Volume:** AED 48,250,000 | **Closed Deals:** 19 | **Avg Deal Size:** AED 2.54M

1. 🥇 **Nihal Shaikh (Principal):** AED 18.5M Volume (7 Closed Deals) · Pipeline: AED 24M · Projected Take-Home: AED 185,000
2. 🥈 **Amina Al-Mansoori (Senior Off-Plan):** AED 14.2M Volume (5 Closed Deals) · Pipeline: AED 16M · Projected Take-Home: AED 142,000
3. 🥉 **Tariq Aziz (Luxury Residential):** AED 9.8M Volume (4 Closed Deals) · Pipeline: AED 11M · Projected Take-Home: AED 98,000
4. 🏅 **Elena Rostova (International Desk):** AED 5.75M Volume (3 Closed Deals) · Pipeline: AED 8.5M · Projected Take-Home: AED 57,500

*Overall agency pacing is 114% against Q4 target. Off-plan 1% monthly plans account for 68% of closed transactions.*`;
  }

  if (q.includes("escrow") || q.includes("compliance") || q.includes("rera") || q.includes("trust account")) {
    return `### 🛡️ RERA Escrow & Off-Plan Trust Account Audit
**RERA Status:** 100% of Agency Active Listings Verified via Central Bank of UAE Escrow System

* **Reef Luxury 995 (DLRC):**
  * Developer: Reef Developments | RERA Permit: #0204918239
  * Escrow Bank: Emirates NBD (Trust A/C: 01-92384-01)
  * Construction Milestone: 34.2% verified (On schedule for Q4 2026)
* **Bayz 102 (Business Bay):**
  * Developer: Danube Properties | RERA Permit: #0184920481
  * Escrow Bank: Mashreq Bank (Trust A/C: 44-81920-02)
  * Construction Milestone: 18.7% verified (On schedule for Q4 2027)
* **Creek Waters (Dubai Creek Harbour):**
  * Developer: Emaar Properties | RERA Permit: #0992384721
  * Escrow Bank: First Abu Dhabi Bank (FAB)
  * Construction Milestone: 52.0% verified (On schedule for Q2 2026)

*Compliance Note: All developer accounts verified under Dubai Law No. (8) of 2007.*`;
  }

  if (q.includes("allocation") || q.includes("proposal") || q.includes("developer master") || q.includes("exclusive floor")) {
    return `### 📑 Agency Master Pre-Launch Allocation Proposal
**Target Developer:** Off-Plan Waterfront Launch | **Requested Allocation:** 2 Complete High Floors

**Draft Proposal Letter:**
> *"Dear Head of Sales & Investor Allocations,*
> 
> *DealOS Agency Network currently represents 42 active qualified HNWI buyers with over AED 65,000,000 in liquid capital earmarked for prime Dubai waterfront assets.*
> 
> *We formally request a dedicated pre-launch allocation of 2 contiguous high-level floors (1BR & 2BR layouts). In return, our agency commits to:*
> * 100% EOI reservation deposit conversions within 7 calendar days of release.
> * Full DLD 4% pre-registration settlement upon launch day.
> * Dedicated agency roadshow and private investor screening.*
> 
> *Kindly share the unit layout matrix and payment milestones to execute the broker underwriting agreement.*
> 
> *Sincerely,*  
> *Agency Principal & Managing Partner — DealOS Overwatch"*`;
  }

  // Solo Broker Responses
  if (q.includes("matcher") || q.includes("off-plan") || q.includes("1br") || q.includes("dlrc") || q.includes("jvc")) {
    return `### 🎯 Dubai Off-Plan Matcher (1% Monthly Plans < AED 1.2M)

1. **Reef Luxury 995 (DLRC):**
   * **Starting Price:** AED 684,000 (1BR · 742 sq.ft)
   * **Payment Plan:** 10% Down | 1% Monthly for 40 months | 50% on Handover (Q4 2026)
   * **Projected Net ROI:** 8.6% | Capital Growth: +19% by handover
   * **DLD Escrow:** Emirates NBD #0204918239 (Verified)

2. **Bayz 102 by Danube (Business Bay):**
   * **Starting Price:** AED 1,180,000 (1BR · 615 sq.ft)
   * **Payment Plan:** 1% Monthly Post-Handover for 30 months (Zero Interest)
   * **Projected Net ROI:** 7.9% | Capital Growth: +24% by handover
   * **DLD Escrow:** Mashreq Bank #0184920481 (Verified)

*Ready to generate a branded investor presentation deck or booking link?*`;
  }

  if (q.includes("roi") || q.includes("payment plan") || q.includes("cash-flow") || q.includes("60/40")) {
    return `### 📊 Payment Plan ROI Analysis: 60/40 vs 1% Monthly Plan
**Benchmark Property:** AED 1,200,000 (1BR Luxury Apartment)

* **Plan A: Standard 60/40 Developer Plan**
  * Capital Required Pre-Handover: AED 772,200 (60% + 4% DLD + AED 4,200 Trustee)
  * Final Handover Payment: AED 480,000 (Cash or Mortgage)
  * 3-Year Cash-on-Cash Return: **9.8% net**
* **Plan B: 1% Monthly Post-Handover Plan**
  * Capital Required Pre-Handover: AED 532,200 (40% + 4% DLD + AED 4,200 Trustee)
  * Post-Handover Payment: AED 12,000/month (covered by projected tenant rent of AED 12,500/month)
  * 3-Year Cash-on-Cash Return: **16.4% net**

**Broker Pitch Conclusion:** The 1% monthly plan frees up AED 240,000 in investor working capital while raising cash-on-cash returns by **+6.6%**.`;
  }

  if (q.includes("yield") || q.includes("radar") || q.includes("business bay") || q.includes("dubai hills") || q.includes("appreciation")) {
    return `### 📡 DLD Yield Radar: Business Bay vs. Dubai Hills Estate
**Source:** Real-time Dubai Land Department Transaction Registry (Past 12 Months)

| Metric | Business Bay (Urban High-Rise) | Dubai Hills Estate (Master Community) |
| :--- | :--- | :--- |
| **Average Price/Sq.Ft** | AED 2,240 / sq.ft (+14.2% YoY) | AED 2,580 / sq.ft (+18.9% YoY) |
| **Gross Rental Yield** | **7.8%** | **6.4%** |
| **Net Rental Yield** | **6.9%** | **5.7%** |
| **Tenant Demographic** | Corporate expats, young professionals | Families, long-term corporate directors |
| **Short-Term Airbnb Yield** | 9.4% gross (High holiday velocity) | 6.8% gross |
| **Optimal Exit Horizon** | 2–3 Years (Yield maximization) | 5–7 Years (Capital preservation) |

*Recommendation: Pitch Business Bay for liquid cash-flow yields; pitch Dubai Hills for multi-generational equity preservation.*`;
  }

  if (q.includes("whatsapp") || q.includes("pitch") || q.includes("script") || q.includes("converting")) {
    return `### 💬 VIP WhatsApp Pitch Script (High-Converting Conversion Template)

*Copy and send directly to your prospective off-plan investor:*

> *"Hi [First Name], hope you're having a productive week!*
> 
> *I just secured access to a limited allocation in Business Bay / DLRC starting from AED 850,000 with a developer 1% monthly payment plan and verified DLD Escrow.*
> 
> *At this entry price point, rental yields in the district are generating 8.2% net, meaning tenant rental cash-flow covers the remaining installments post-handover.*
> 
> *I’ve prepared a 1-page financial breakdown showing the exact cash-to-close schedule and projected ROI. May I share the PDF and unit layouts with you here on WhatsApp?*
> 
> *Best regards,*  
> *[Your Name] · Licensed Dubai Broker, DealOS"*`;
  }

  // Fallback
  return `### DealOS Strategic Mastermind

I've processed your inquiry: **"${prompt}"**

* **Dubai Market Update:** Active inventory shows 1,355+ off-plan projects with steady capital growth across DLRC, JVC, Business Bay, and Dubai Hills Estate.
* **Next Action:** Select any of the 4 role-tailored prompt cards below or attach a lead from your CRM to generate an immediate contract, pitch, or financial yield breakdown.`;
}

export function GeminiAssistantPage() {
  const profile = useBrokerProfile();
  const userName = profile?.name?.split(" ")[0] || "Nihal";

  // Role detection and switcher (Agency Owner vs Solo Broker)
  const storedRole = typeof window !== "undefined" ? (localStorage.getItem("dealos_role") as DealOSRole | null) : null;
  const [role, setRole] = useState<DealOSRole>(storedRole === "company" ? "company" : "agent");

  const toggleRole = () => {
    const nextRole: DealOSRole = role === "company" ? "agent" : "company";
    setRole(nextRole);
    if (typeof window !== "undefined") {
      localStorage.setItem("dealos_role", nextRole);
    }
    toast.success(`Switched AI Copilot to ${nextRole === "company" ? "Agency Owner" : "Solo Broker"} persona`);
  };

  // 4 Role-Wise Suggestions
  const brokerSuggestions = [
    {
      id: "b-offplan",
      title: "Off-Plan Matcher",
      tag: "TOP MATCH",
      tagColor: "bg-amber-500/15 text-amber-500 border-amber-500/25",
      icon: Building2,
      iconColor: "text-amber-500 bg-amber-500/10 border-amber-500/25",
      desc: "Match off-plan 1BR and 2BR in DLRC or JVC under AED 1.2M with 1% monthly plan",
      prompt: "Match off-plan 1BR and 2BR units in DLRC or JVC under AED 1.2M with 1% monthly payment plan and high projected ROI.",
    },
    {
      id: "b-roi",
      title: "Payment Plan ROI",
      tag: "FINANCIAL",
      tagColor: "bg-blue-500/15 text-blue-500 border-blue-500/25",
      icon: Calculator,
      iconColor: "text-blue-500 bg-blue-500/10 border-blue-500/25",
      desc: "Compare 60/40 vs 1% monthly plan cash-flow & handover net rental yields",
      prompt: "Calculate 60/40 payment plan vs 1% monthly plan cash-flow and net rental yield for an international cash buyer.",
    },
    {
      id: "b-yield",
      title: "DLD Yield Radar",
      tag: "DLD DATA",
      tagColor: "bg-emerald-500/15 text-emerald-500 border-emerald-500/25",
      icon: LineChart,
      iconColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/25",
      desc: "Compare 5-year capital appreciation & rental yield: Business Bay vs Dubai Hills",
      prompt: "Compare 5-year capital appreciation and net rental yields: Business Bay vs Dubai Hills using recent DLD transaction data.",
    },
    {
      id: "b-pitch",
      title: "1-Click WhatsApp Pitch",
      tag: "CONVERSION",
      tagColor: "bg-purple-500/15 text-purple-500 border-purple-500/25",
      icon: MessageSquare,
      iconColor: "text-purple-500 bg-purple-500/10 border-purple-500/25",
      desc: "Draft high-converting VIP WhatsApp pitch script for luxury off-plan investor",
      prompt: "Draft a high-converting VIP WhatsApp pitch for an overseas investor looking for high rental yields with low initial deposit.",
    },
  ];

  const ownerSuggestions = [
    {
      id: "o-comm",
      title: "Commission Aging Audit",
      tag: "RECEIVABLES",
      tagColor: "bg-rose-500/15 text-rose-400 border-rose-500/25",
      icon: DollarSign,
      iconColor: "text-rose-400 bg-rose-500/10 border-rose-500/25",
      desc: "Audit developer commissions unpaid & overdue > 60 days across agency agents",
      prompt: "Run an audit on developer commission receivables overdue > 60 days across all agents in the agency. List top delinquent developers and total outstanding AED balance.",
    },
    {
      id: "o-leaderboard",
      title: "Broker Leaderboard",
      tag: "PRODUCTION",
      tagColor: "bg-blue-500/15 text-blue-400 border-blue-500/25",
      icon: Users,
      iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/25",
      desc: "Rank brokers by closed sales volume, pipeline velocity, and conversion rate",
      prompt: "Show the top-performing brokers this quarter by closed sales volume, pipeline conversion velocity, and commission payout forecast.",
    },
    {
      id: "o-escrow",
      title: "Escrow Trust Audit",
      tag: "COMPLIANCE",
      tagColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
      icon: ShieldCheck,
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
      desc: "Verify RERA escrow trust accounts & construction progress across registered developments",
      prompt: "Verify RERA escrow trust account compliance and construction milestones for our active off-plan project listings.",
    },
    {
      id: "o-alloc",
      title: "Developer Allocation Pitch",
      tag: "ACQUISITION",
      tagColor: "bg-purple-500/15 text-purple-400 border-purple-500/25",
      icon: Building2,
      iconColor: "text-purple-400 bg-purple-500/10 border-purple-500/25",
      desc: "Draft agency master allocation proposal for new luxury off-plan launch",
      prompt: "Draft an agency master allocation proposal to secure exclusive floors and pre-launch broker allocations for a new luxury waterfront development.",
    },
  ];

  const currentSuggestions = role === "company" ? ownerSuggestions : brokerSuggestions;

  // Sidebar history panel: collapsed by default (optional to open)
  const [panelOpen, setPanelOpen] = useState(false);
  
  // Floating Leads center modal
  const [leadsModalOpen, setLeadsModalOpen] = useState(false);
  const [leadCategoryFilter, setLeadCategoryFilter] = useState<"all" | "hot" | "offplan" | "luxury">("all");
  const [leadSearch, setLeadSearch] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<AttachedItem[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [aiModel, setAiModel] = useState<"Pro" | "Fast" | "Audit">("Pro");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleStartNewChat = () => {
    setMessages([]);
    setAttachments([]);
    setInput("");
    setPanelOpen(false);
    toast.success("Started a new clean chat");
  };

  const handleAddLeadToChat = (lead: AttachedItem) => {
    if (attachments.some((a) => a.id === lead.id)) {
      toast.info(`${lead.label} is already attached to chat.`);
    } else {
      setAttachments((prev) => [...prev, lead]);
      toast.success(`Attached ${lead.label} to chat context!`);
    }
    setLeadsModalOpen(false);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const item: AttachedItem = {
        id: `file-${Date.now()}`,
        type: "file",
        label: file.name,
        sub: `${(file.size / 1024).toFixed(0)} KB · ${file.type || "Document"}`,
        date: "Just now",
      };
      setAttachments((prev) => [...prev, item]);
      toast.success(`File ${file.name} uploaded to chat`);
    }
  };

  const handleSend = (customPrompt?: string) => {
    const prompt = (customPrompt || input).trim();
    if (!prompt && attachments.length === 0) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: prompt || "Analyze attached leads & provide strategic guidance",
      attachments: [...attachments],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setAttachments([]);
    setIsTyping(true);

    // Contextual AI simulation
    setTimeout(() => {
      const attachedLead = userMsg.attachments?.find((a) => a.type === "lead");
      const responseText = getSmartRoleResponse(prompt, role, attachedLead);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 650);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied response to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLeads = LEADS_DATA.filter((l) => {
    const matchesCategory = leadCategoryFilter === "all" || l.category === leadCategoryFilter;
    const matchesSearch =
      l.label.toLowerCase().includes(leadSearch.toLowerCase()) ||
      (l.sub && l.sub.toLowerCase().includes(leadSearch.toLowerCase())) ||
      (l.budget && l.budget.toLowerCase().includes(leadSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative flex h-[calc(100dvh-70px)] sm:h-[calc(100vh-80px)] w-full overflow-hidden bg-background">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
      />

      {/* ═══ OPTIONAL SLIDE-OUT HISTORY PANEL (COLLAPSED BY DEFAULT) ═══ */}
      {panelOpen && (
        <aside className="w-64 border-r border-border/80 bg-card/90 backdrop-blur-md flex flex-col shrink-0 animate-in slide-in-from-left duration-200 z-30">
          <div className="p-3 border-b border-border/60 flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Sparkles size={13} className="text-primary" /> Chat History
            </span>
            <button
              onClick={() => setPanelOpen(false)}
              className="size-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground"
              title="Close panel"
            >
              <X size={15} />
            </button>
          </div>

          <div className="p-3">
            <button
              onClick={handleStartNewChat}
              className="w-full h-10 rounded-xl border border-border/80 bg-card hover:bg-secondary transition-all px-3 flex items-center gap-2 text-xs font-bold text-foreground shadow-sm"
            >
              <Plus size={16} className="text-primary" />
              <span>New chat</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-1">Recent Chats</p>
            {RECENT_CHATS.map((title) => (
              <button
                key={title}
                onClick={() => {
                  setPanelOpen(false);
                  toast.info(`Opened "${title}"`);
                }}
                className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors truncate flex items-center gap-2"
              >
                <Clock size={13} className="shrink-0 opacity-60" />
                <span className="truncate">{title}</span>
              </button>
            ))}
          </div>
        </aside>
      )}

      {/* ═══ 100% FULL-SCREEN EXPANSIVE MAIN WORKSPACE ═══ */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Control Bar: Optional Panel Opener & New Chat */}
        <div className="absolute top-4 left-6 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPanelOpen((v) => !v)}
            className="size-9 rounded-xl border border-border/80 bg-card/80 backdrop-blur-sm hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground shadow-sm transition-all"
            title={panelOpen ? "Collapse chats" : "Open recent chats"}
          >
            <PanelLeft size={16} />
          </button>

          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleStartNewChat}
              className="h-9 px-3 rounded-xl border border-border/80 bg-card/80 backdrop-blur-sm hover:bg-secondary flex items-center gap-1.5 text-xs font-bold text-foreground shadow-sm transition-all"
            >
              <Plus size={14} className="text-primary" />
              <span>New chat</span>
            </button>
          )}
        </div>

        {/* ═══ SCENARIO A: PURE ZEN CENTER FLOATING SCREEN (NO MESSAGES) ═══ */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-3xl mx-auto w-full relative pb-16 sm:pb-8 overflow-y-auto">
            {/* Ambient Radial Glow & Gemini Shimmer Backdrop */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
              <div className="size-[480px] rounded-full bg-gradient-to-tr from-primary/10 via-[#7B4DFF]/10 to-emerald-500/5 blur-3xl opacity-80 animate-pulse" />
            </div>

            {/* Centered DealOS Logo (Gemini Style) & Halo Aura */}
            <div className="text-center mb-6 relative z-10 flex flex-col items-center space-y-3">
              <div className="relative group">
                {/* Glowing Gemini-like aura ring */}
                <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-primary via-[#7B4DFF] to-cyan-400 opacity-40 blur-xl group-hover:opacity-60 transition-opacity animate-pulse" />
                <div className="relative size-20 sm:size-24 rounded-3xl bg-card/90 border border-white/20 shadow-2xl flex items-center justify-center p-3 backdrop-blur-xl">
                  <LogoMark size={56} variant="dark" />
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold font-mono bg-primary/10 text-primary border border-primary/20 shadow-xs">
                  <Sparkles size={12} className="text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>DEALOS MASTERMIND · GEMINI AI ENGINE</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground font-display">
                  {role === "company" ? `Welcome to Overwatch, ${userName}!` : `Your move, ${userName}!`}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                  {role === "company"
                    ? "Overwatch broker commissions, RERA escrow compliance, and agency allocation pipelines."
                    : "Dubai off-plan matching, 1% payment plans, DLD yields, and 1-click investor pitches."}
                </p>
              </div>

              {/* Role Switcher Pill */}
              <button
                type="button"
                onClick={toggleRole}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/80 hover:bg-secondary text-foreground text-xs font-semibold border border-border/80 transition-all cursor-pointer shadow-xs active:scale-95"
                title="Switch role mode"
              >
                <span>Viewing as: <strong>{role === "company" ? "🏢 Agency Owner" : "💼 Solo Broker"}</strong></span>
                <span className="text-[11px] text-primary underline font-bold">Switch ⇄</span>
              </button>
            </div>

            {/* ═══ FLOATING CAPSULE IN CENTRE OF SCREEN (EXACTLY LIKE GEMINI) ═══ */}
            <div className="w-full max-w-2xl relative z-20 mb-6">
              {/* Context Chips (Show if items are attached) */}
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2 px-1">
                  {attachments.map((item) => (
                    <span
                      key={item.id}
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-card px-3 py-1 text-xs font-semibold text-foreground shadow-sm"
                    >
                      <User size={13} className="text-amber-400" />
                      <span className="truncate max-w-[180px]">{item.label}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(item.id)}
                        className="text-muted-foreground hover:text-foreground ml-0.5"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Floating Elevated Capsule Container */}
              <div className="relative rounded-full border border-primary/30 bg-card/95 backdrop-blur-2xl shadow-[0_12px_40px_-10px_rgba(47,107,255,0.2),0_2px_10px_rgba(0,0,0,0.1)] hover:border-primary/60 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300 flex items-center p-2 pl-3">
                {/* Plus Button: Opens Center Floating Leads Picker */}
                <button
                  type="button"
                  onClick={() => setLeadsModalOpen(true)}
                  className="size-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer"
                  title="Add Leads or Documents to Chat"
                >
                  <Plus size={20} />
                </button>

                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                  placeholder={role === "company" ? "Ask Agency Overwatch (commissions, broker quotas, RERA escrow)..." : "Ask DealOS Copilot (off-plan matching, DLD yields, 1% plans)..."}
                  className="flex-1 bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />

                <div className="flex items-center gap-1.5 shrink-0 pr-1">
                  {/* Model Selector */}
                  <select
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value as typeof aiModel)}
                    className="bg-secondary/70 text-foreground text-xs font-bold rounded-full px-2.5 py-1 border border-border cursor-pointer focus:outline-none"
                  >
                    <option value="Pro">Pro</option>
                    <option value="Fast">Fast</option>
                    <option value="Audit">Audit</option>
                  </select>

                  {/* Mic Dictation */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRecording((v) => !v);
                      toast.info(isRecording ? "Voice memo stopped" : "Listening for voice memo...");
                    }}
                    className={`size-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                      isRecording ? "bg-red-500/20 text-red-400 animate-pulse" : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Voice prompt"
                  >
                    <Mic size={16} />
                  </button>

                  {/* Send Button */}
                  <button
                    type="button"
                    onClick={() => handleSend()}
                    disabled={!input.trim() && attachments.length === 0}
                    className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
                    title="Send"
                  >
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* ═══ 4 ROLE-WISE SUGGESTIONS UNDER FLOATING CAPSULE ═══ */}
            <div className="w-full max-w-2xl px-1 relative z-10">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Sparkles size={11} className="text-primary" />
                  {role === "company" ? "4 Executive Agency Prompts" : "4 Solo Broker Prompts"}
                </span>
                <span className="text-[10px] text-muted-foreground">Click to run</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentSuggestions.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSend(item.prompt)}
                      className="group p-3 sm:p-3.5 rounded-2xl border border-border/80 bg-card/80 hover:bg-secondary/70 hover:border-primary/40 text-left transition-all shadow-xs flex items-start gap-3 active:scale-[0.98] cursor-pointer"
                    >
                      <div className={`size-9 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${item.iconColor}`}>
                        <Icon size={17} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{item.title}</span>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full border ${item.tagColor}`}>
                            {item.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ═══ SCENARIO B: ACTIVE FULL-SCREEN CONVERSATION STREAM ═══ */
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 pt-16 space-y-6 max-w-3xl mx-auto w-full">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 animate-in fade-in-50 duration-200 ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {m.role === "assistant" && (
                    <div className="size-8 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0 mt-1">
                      <Sparkles size={16} />
                    </div>
                  )}

                  <div className={`space-y-2 max-w-[85%] ${m.role === "user" ? "items-end" : ""}`}>
                    {/* Attached Leads Chips */}
                    {m.attachments && m.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-1.5">
                        {m.attachments.map((att) => (
                          <span
                            key={att.id}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold bg-secondary px-2.5 py-0.5 rounded-full border border-border"
                          >
                            <User size={11} className="text-amber-400" />
                            {att.label}
                          </span>
                        ))}
                      </div>
                    )}

                    <div
                      className={`rounded-2xl p-4 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-primary text-primary-foreground font-medium rounded-tr-sm"
                          : "bg-card border border-border/80 text-foreground rounded-tl-sm shadow-sm"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    </div>

                    {m.role === "assistant" && (
                      <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                        <span>{m.timestamp}</span>
                        <span>•</span>
                        <button
                          onClick={() => handleCopy(m.id, m.content)}
                          className="inline-flex items-center gap-1 hover:text-foreground transition-colors font-medium"
                        >
                          {copiedId === m.id ? <CheckCheck size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          <span>{copiedId === m.id ? "Copied" : "Copy Response"}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {m.role === "user" && (
                    <div className="size-8 rounded-xl bg-secondary border border-border flex items-center justify-center text-xs font-bold text-foreground shrink-0 mt-1 font-display">
                      {userName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 animate-in fade-in-50 duration-150">
                  <div className="size-8 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div className="rounded-2xl bg-card border border-border/80 px-4 py-3 text-xs text-muted-foreground flex items-center gap-2">
                    <span className="size-2 rounded-full bg-primary animate-ping" />
                    <span>Analyzing lead requirements and Dubai inventory...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* DOCKED BOTTOM CENTER INPUT CAPSULE */}
            <div className="p-3 pb-24 sm:p-4 border-t border-border/60 bg-card/80 backdrop-blur-md shrink-0">
              <div className="max-w-2xl mx-auto w-full">
                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2 px-1">
                    {attachments.map((item) => (
                      <span
                        key={item.id}
                        className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-card px-3 py-1 text-xs font-semibold text-foreground shadow-sm"
                      >
                        <User size={13} className="text-amber-400" />
                        <span className="truncate max-w-[180px]">{item.label}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(item.id)}
                          className="text-muted-foreground hover:text-foreground ml-0.5"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="relative rounded-full border border-border/80 bg-card shadow-lg hover:border-border transition-all duration-200 flex items-center p-2 pl-3">
                  <button
                    type="button"
                    onClick={() => setLeadsModalOpen(true)}
                    className="size-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                    title="Add Leads to Chat"
                  >
                    <Plus size={20} />
                  </button>

                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                    placeholder="Ask follow-up about this lead..."
                    className="flex-1 bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!input.trim() && attachments.length === 0}
                    className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity"
                  >
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ CENTER FLOATING "LEADS" MODAL (MATCHING GEMINI REFERENCE CARDS) ═══ */}
      {leadsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in-50 duration-200">
          <div className="w-full max-w-2xl rounded-3xl border border-border/80 bg-card p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-foreground font-display flex items-center gap-2">
                  <User className="size-5 text-primary" />
                  <span>Attach Investor Leads to Chat</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select an active investor lead to inject their requirements directly into the prompt.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-foreground transition-all"
                >
                  <Paperclip size={13} />
                  <span>Upload File</span>
                </button>
                <button
                  onClick={() => setLeadsModalOpen(false)}
                  className="size-8 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Search & Category Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  placeholder="Search lead by name, budget, or community..."
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-secondary/50 text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-1 p-1 rounded-xl bg-secondary/70 border border-border/60 text-xs font-bold shrink-0">
                {(["all", "hot", "offplan", "luxury"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setLeadCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                      leadCategoryFilter === cat ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat === "all" ? "All" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Leads (Clean Wide Rounded Cards like Gemini Library Reference) */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="group rounded-2xl border border-border/80 bg-secondary/30 hover:border-primary/50 hover:bg-secondary/60 p-4 transition-all duration-200 flex items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="size-11 rounded-xl bg-card border border-border/80 flex items-center justify-center font-display font-extrabold text-foreground text-sm shrink-0">
                      {lead.label.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-foreground truncate">{lead.label}</h3>
                        {lead.budget && (
                          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.2 text-[10px] font-bold text-emerald-400 font-mono">
                            {lead.budget}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{lead.sub}</p>
                      <span className="text-[10px] text-muted-foreground/70 block mt-0.5">{lead.date}</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleAddLeadToChat(lead)}
                    className="rounded-xl text-xs font-bold gap-1.5 bg-primary text-primary-foreground shrink-0 shadow-sm"
                  >
                    <Plus size={14} />
                    <span>Add to Chat</span>
                  </Button>
                </div>
              ))}

              {filteredLeads.length === 0 && (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  No investor leads found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
