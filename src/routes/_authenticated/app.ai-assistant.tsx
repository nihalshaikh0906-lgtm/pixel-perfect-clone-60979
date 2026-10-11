import { createFileRoute } from "@tanstack/react-router";
import { workspaceHead } from "@/components/app/WorkspacePlaceholder";
import { useBrokerProfile } from "@/lib/broker";
import {
  Sparkles, Plus, Mic, Send, Paperclip, User, Building2, Users, FileText,
  X, Check, ArrowRight, RefreshCw, Copy, CheckCheck,
  ChevronDown, Flame, ShieldCheck, Zap, MessageSquare, Clock,
  Search, PanelLeft, ArrowUpRight
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/app/ai-assistant")({
  head: () => workspaceHead("AI Assistant"),
  component: GeminiAssistantPage,
});

type AttachedItem = {
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

export function GeminiAssistantPage() {
  const profile = useBrokerProfile();
  const userName = profile?.name?.split(" ")[0] || "Nihal";

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

  const handleSend = () => {
    const prompt = input.trim();
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
      let responseText = "";
      const attachedLead = userMsg.attachments?.find((a) => a.type === "lead");

      if (attachedLead) {
        responseText = `### Strategic Analysis for ${attachedLead.label}

**1. Investor Financial Summary:**
* **Budget:** ${attachedLead.budget || "Verified Range"}
* **Preferences:** ${attachedLead.sub}
* **Status:** High Probability Closer · DLD Registration Ready

**2. Matched Dubai Developments:**
* **Reef Luxury 995 (DLRC):** 1BR from AED 684,000 · 10/40/50 Handover Q4 2026. Aligns with budget; 8.4% projected net rental yield.
* **Bayz 102 by Danube (Business Bay):** 1% monthly post-handover plan for investor cash-flow optimization.

**3. 1-Click WhatsApp Pitch:**
> *"Hi ${attachedLead.label.split(" ")[0]}, hope you're having a productive week! I just reviewed exclusive allocations that align with your search criteria in Dubai. We have 2 prime options with flexible developer payment plans and verified DLD escrow. Would 3:00 PM today suit you for a quick 2-minute overview?"*

*Would you like me to prepare an official EOI reservation slip or draft an Ejari/SPA contract review?*`;
      } else {
        responseText = `### DealOS Strategic Mastermind

I've processed your query: **"${prompt}"**

* **Market Overview:** Dubai real estate market continues strong momentum with 1,450+ active developments and high capital growth.
* **Recommended Next Step:** Click the **+** button to attach an investor lead or project document from your Leads directory to tailor the exact strategy.`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 850);
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
    <div className="relative flex h-[calc(100vh-80px)] w-full overflow-hidden bg-background">
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
          <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-3xl mx-auto w-full relative">
            {/* Ambient Radial Glow */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="size-96 rounded-full bg-primary/5 blur-3xl opacity-70" />
            </div>

            {/* Center Greeting */}
            <div className="text-center mb-8 relative z-10 space-y-2">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground font-display">
                Your move, {userName}!
              </h1>
            </div>

            {/* ═══ CENTER FLOATING INPUT CAPSULE BAR (EXACTLY LIKE GEMINI) ═══ */}
            <div className="w-full max-w-2xl relative z-20">
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

              {/* Capsule Container */}
              <div className="relative rounded-full border border-border/80 bg-card shadow-lg hover:border-border transition-all duration-200 flex items-center p-2 pl-3">
                {/* Plus Button: Opens Center Floating Leads Picker */}
                <button
                  type="button"
                  onClick={() => setLeadsModalOpen(true)}
                  className="size-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                  title="Add Leads or Documents to Chat"
                >
                  <Plus size={20} />
                </button>

                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                  placeholder="Ask DealOS Mastermind..."
                  className="flex-1 bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />

                <div className="flex items-center gap-1.5 shrink-0 pr-1">
                  {/* Model Selector */}
                  <select
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value as typeof aiModel)}
                    className="bg-secondary/60 text-foreground text-xs font-bold rounded-full px-2.5 py-1 border border-border cursor-pointer focus:outline-none"
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
                    className={`size-8 rounded-full flex items-center justify-center transition-colors ${
                      isRecording ? "bg-red-500/20 text-red-400 animate-pulse" : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Voice prompt"
                  >
                    <Mic size={16} />
                  </button>

                  {/* Send Button */}
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!input.trim() && attachments.length === 0}
                    className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity"
                    title="Send"
                  >
                    <ArrowRight size={15} />
                  </button>
                </div>
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
            <div className="p-4 border-t border-border/60 bg-card/60 backdrop-blur-md shrink-0">
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
